import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CLAIMS_FILE = path.join(process.cwd(), 'data', 'claimed_spots.json');

interface ClaimRecord {
  id: number;
  spot_id: number;
  website_url: string;
  logo_url: string | null;
  created_at: string;
}

function getLocalClaims(): ClaimRecord[] {
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      const raw = fs.readFileSync(CLAIMS_FILE, 'utf8');
      return JSON.parse(raw) || [];
    }
  } catch (err) {
    console.error('Error reading local claims file:', err);
  }
  return [];
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('claimed_spots')
      .select('*');

    if (!error && Array.isArray(data)) {
      // Sync local file to match Supabase
      try {
        const dir = path.dirname(CLAIMS_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(CLAIMS_FILE, JSON.stringify(data, null, 2), 'utf8');
      } catch {
        // ignore file write errors
      }
      return NextResponse.json({ claimedSpots: data });
    }

    if (error) {
      console.warn('Notice: Supabase query returned error, falling back to local file:', error.message);
    }
  } catch (err) {
    console.warn('Notice: Supabase connection failed, falling back to local file:', err);
  }

  // Fallback to local claims file only if Supabase fails
  const localClaims = getLocalClaims();
  return NextResponse.json({ claimedSpots: localClaims });
}
