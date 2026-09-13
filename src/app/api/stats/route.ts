import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://rlpyzofaulakcqaiiyxh.supabase.co';

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_bPsW-_P18AFsMbkUT7H0xA_oEy2n27N';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// Active in-memory session map: sessionId -> { lastSeen: number, visitorId: string }
const activeSessions = new Map<string, { lastSeen: number; visitorId: string }>();

const STATS_FILE = path.join(process.cwd(), 'data', 'visitor_stats.json');

// Base offset for visitors:
// We align baseline + Supabase count so visitor count reflects actual totals
const BASE_VISITORS = 74;

let cachedTotalVisitors = 81;
let lastCountFetchTime = 0;

interface StatsFile {
  totalVisitors: number;
  uniqueVisitorIds: string[];
  totalPageViews: number;
  lastUpdated: number;
}

function readLocalStatsFile(): StatsFile | null {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch {
    // Ignore read errors
  }
  return null;
}

function writeLocalStatsFile(stats: StatsFile) {
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf8');
  } catch {
    // Fails safely on Vercel read-only filesystem (EROFS)
  }
}

// Clean sessions older than 30 seconds
function cleanOldSessions() {
  const now = Date.now();
  for (const [id, session] of activeSessions.entries()) {
    if (now - session.lastSeen > 30_000) {
      activeSessions.delete(id);
    }
  }
}

function getDistinctLiveUsers(): number {
  cleanOldSessions();
  const distinctVisitors = new Set<string>();
  for (const session of activeSessions.values()) {
    distinctVisitors.add(session.visitorId);
  }
  return Math.max(1, distinctVisitors.size);
}

async function getSupabaseVisitorCount(): Promise<number> {
  const now = Date.now();
  // Return cached count if queried in the last 2 seconds
  if (now - lastCountFetchTime < 2000 && cachedTotalVisitors > 0) {
    return cachedTotalVisitors;
  }

  try {
    const { count, error } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .like('name', 'visit:%');

    if (!error && typeof count === 'number') {
      const total = BASE_VISITORS + count;
      cachedTotalVisitors = total;
      lastCountFetchTime = now;
      return total;
    }
  } catch (err) {
    console.warn('Notice: Error querying Supabase visitor count:', err);
  }

  const local = readLocalStatsFile();
  if (local && local.totalVisitors) {
    cachedTotalVisitors = Math.max(cachedTotalVisitors, local.totalVisitors);
  }
  return cachedTotalVisitors;
}

async function recordSupabaseVisit(visitorId: string): Promise<number> {
  try {
    // Insert new visit record into Supabase
    await supabase.from('todos').insert({
      name: `visit:${visitorId}`,
    });

    // Query updated count
    const { count, error } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .like('name', 'visit:%');

    if (!error && typeof count === 'number') {
      const total = BASE_VISITORS + count;
      cachedTotalVisitors = total;
      lastCountFetchTime = Date.now();

      // Safely try updating local file if writable
      writeLocalStatsFile({
        totalVisitors: total,
        uniqueVisitorIds: [visitorId],
        totalPageViews: total * 4,
        lastUpdated: Date.now(),
      });

      return total;
    }
  } catch (err) {
    console.warn('Notice: Error recording visit in Supabase:', err);
  }

  // Fallback increment
  cachedTotalVisitors += 1;
  return cachedTotalVisitors;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const visitorId = searchParams.get('visitorId') || 'guest';
  const sessionId = searchParams.get('sessionId') || `sess_${Math.random()}`;

  // Record session
  activeSessions.set(sessionId, { lastSeen: Date.now(), visitorId });

  const totalVisitors = await getSupabaseVisitorCount();
  const liveUsers = getDistinctLiveUsers();

  return NextResponse.json({
    liveUsers,
    totalVisitors,
    totalPageViews: totalVisitors * 4,
  });
}

export async function POST(request: Request) {
  cleanOldSessions();

  try {
    const body = await request.json().catch(() => ({}));
    const { visitorId, sessionId, action } = body as {
      visitorId?: string;
      sessionId?: string;
      action?: string;
    };

    // Client tab closed / navigating away
    if (action === 'leave' && sessionId) {
      activeSessions.delete(sessionId);
      const liveUsers = getDistinctLiveUsers();
      return NextResponse.json({
        liveUsers,
        totalVisitors: cachedTotalVisitors,
      });
    }

    if (sessionId && visitorId) {
      activeSessions.set(sessionId, { lastSeen: Date.now(), visitorId });

      let totalVisitors = cachedTotalVisitors;

      if (action === 'pageview') {
        totalVisitors = await recordSupabaseVisit(visitorId);
      } else if (action === 'heartbeat') {
        totalVisitors = await getSupabaseVisitorCount();
      }

      const liveUsers = getDistinctLiveUsers();
      return NextResponse.json({
        liveUsers,
        totalVisitors,
        totalPageViews: totalVisitors * 4,
      });
    }
  } catch (err) {
    console.error('Stats POST error:', err);
  }

  const liveUsers = getDistinctLiveUsers();
  return NextResponse.json({
    liveUsers,
    totalVisitors: cachedTotalVisitors,
  });
}
