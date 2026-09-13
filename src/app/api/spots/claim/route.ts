import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const CLAIMS_FILE = path.join(process.cwd(), 'data', 'claimed_spots.json');

interface ClaimRecord {
  id: number;
  spot_id: number;
  website_url: string;
  logo_url: string | null;
  created_at: string;
}

function saveLocalClaim(claim: ClaimRecord) {
  try {
    const dir = path.dirname(CLAIMS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let list: ClaimRecord[] = [];
    if (fs.existsSync(CLAIMS_FILE)) {
      const raw = fs.readFileSync(CLAIMS_FILE, 'utf8');
      list = JSON.parse(raw) || [];
    }
    const idx = list.findIndex((c) => c.spot_id === claim.spot_id);
    if (idx >= 0) {
      list[idx] = claim;
    } else {
      list.push(claim);
    }
    fs.writeFileSync(CLAIMS_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local claim:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { spotId, websiteUrl, logoUrl } = body;

    if (!spotId || !websiteUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newClaim: ClaimRecord = {
      id: Date.now(),
      spot_id: Number(spotId),
      website_url: websiteUrl,
      logo_url: logoUrl || null,
      created_at: new Date().toISOString(),
    };

    // 1. Always save to persistent server-side file storage
    saveLocalClaim(newClaim);

    // 2. Also attempt inserting into Supabase if table is configured
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      const { data: existing } = await supabase
        .from('claimed_spots')
        .select('id')
        .eq('spot_id', Number(spotId))
        .single();

      if (!existing) {
        const { data, error } = await supabase
          .from('claimed_spots')
          .insert({
            spot_id: Number(spotId),
            website_url: websiteUrl,
            logo_url: logoUrl || null,
          })
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ claimedSpot: data });
        }
      }
    } catch (sbErr) {
      console.warn('Notice: Supabase insert skipped (run supabase_schema.sql if table is missing):', sbErr);
    }

    return NextResponse.json({ claimedSpot: newClaim });
  } catch (error) {
    console.error('Unexpected error in /api/spots/claim:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
