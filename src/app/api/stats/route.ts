import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Active in-memory session map: sessionId -> { lastSeen: number, visitorId: string }
const activeSessions = new Map<string, { lastSeen: number; visitorId: string }>();

const STATS_FILE = path.join(process.cwd(), 'data', 'visitor_stats.json');

interface StatsFile {
  totalVisitors: number;
  uniqueVisitorIds: string[];
  totalPageViews: number;
  lastUpdated: number;
}

function readStatsFile(): StatsFile {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        totalVisitors: parsed.totalVisitors || (parsed.uniqueVisitorIds ? parsed.uniqueVisitorIds.length : 1),
        uniqueVisitorIds: parsed.uniqueVisitorIds || [],
        totalPageViews: parsed.totalPageViews || 1,
        lastUpdated: parsed.lastUpdated || Date.now(),
      };
    }
  } catch (err) {
    console.error('Error reading stats file:', err);
  }

  return {
    totalVisitors: 1,
    uniqueVisitorIds: ['initial-visitor'],
    totalPageViews: 1,
    lastUpdated: Date.now(),
  };
}

function writeStatsFile(stats: StatsFile) {
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing stats file:', err);
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
  return distinctVisitors.size;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const visitorId = searchParams.get('visitorId') || 'guest';
  const sessionId = searchParams.get('sessionId') || `sess_${Math.random()}`;

  // Record session
  activeSessions.set(sessionId, { lastSeen: Date.now(), visitorId });

  // Read persisted stats
  const stats = readStatsFile();

  // If visitor is new, record unique visitor
  if (visitorId && visitorId !== 'guest') {
    if (!stats.uniqueVisitorIds.includes(visitorId)) {
      stats.uniqueVisitorIds.push(visitorId);
      stats.totalVisitors = stats.uniqueVisitorIds.length;
      stats.totalPageViews += 1;
      stats.lastUpdated = Date.now();
      writeStatsFile(stats);
    }
  }

  const liveUsers = Math.max(1, getDistinctLiveUsers());

  return NextResponse.json({
    liveUsers,
    totalVisitors: Math.max(1, stats.totalVisitors),
    totalPageViews: stats.totalPageViews,
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
      const stats = readStatsFile();
      return NextResponse.json({
        liveUsers,
        totalVisitors: Math.max(1, stats.totalVisitors),
      });
    }

    if (sessionId && visitorId) {
      activeSessions.set(sessionId, { lastSeen: Date.now(), visitorId });

      const stats = readStatsFile();
      let updated = false;

      if (action === 'pageview') {
        stats.totalVisitors = (stats.totalVisitors || 0) + 1;
        stats.totalPageViews = (stats.totalPageViews || 0) + 1;
        stats.uniqueVisitorIds.push(visitorId);
        if (stats.uniqueVisitorIds.length > 200) {
          stats.uniqueVisitorIds = stats.uniqueVisitorIds.slice(-200);
        }
        updated = true;
      } else if (!stats.uniqueVisitorIds.includes(visitorId)) {
        stats.uniqueVisitorIds.push(visitorId);
        stats.totalVisitors = (stats.totalVisitors || 0) + 1;
        updated = true;
      }

      if (updated) {
        stats.lastUpdated = Date.now();
        writeStatsFile(stats);
      }

      const liveUsers = Math.max(1, getDistinctLiveUsers());
      return NextResponse.json({
        liveUsers,
        totalVisitors: Math.max(1, stats.totalVisitors),
        totalPageViews: stats.totalPageViews,
      });
    }
  } catch (err) {
    console.error('Stats POST error:', err);
  }

  const stats = readStatsFile();
  const liveUsers = Math.max(1, getDistinctLiveUsers());

  return NextResponse.json({
    liveUsers,
    totalVisitors: Math.max(1, stats.totalVisitors),
  });
}
