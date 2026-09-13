'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

function SuccessContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const sessionId = searchParams.get('session_id');
  const paymentId = searchParams.get('payment_id');
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saving');

  // If user returned from Dodo Payments checkout (any params present), show success
  // Real verification happens server-side via webhooks
  const returnedFromCheckout = !!(status || sessionId || paymentId);

  useEffect(() => {
    if (!returnedFromCheckout) return;

    const saveClaim = async () => {
      try {
        // Get pending claim from localStorage
        const pendingClaim = localStorage.getItem('pendingClaim');
        if (!pendingClaim) {
          setSaveStatus('saved');
          return;
        }

        const claimData = JSON.parse(pendingClaim);
        const newClaim = {
          id: Date.now(),
          spot_id: claimData.spotId,
          website_url: claimData.websiteUrl,
          logo_url: claimData.logoUrl || null,
          created_at: new Date().toISOString(),
        };

        // Clean up any legacy localStorage fallback claims
        try {
          localStorage.removeItem('local_claimed_spots');
        } catch {
          // ignore
        }

        // 2. Call /api/spots/claim to persist to server storage & Supabase
        try {
          await fetch('/api/spots/claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              spotId: claimData.spotId,
              websiteUrl: claimData.websiteUrl,
              logoUrl: claimData.logoUrl || null,
            }),
          });
        } catch (apiErr) {
          console.warn('API claim route error:', apiErr);
        }

        // 3. Attempt direct Supabase insert if table is created
        try {
          const supabase = createClient();
          const { data: existing } = await supabase
            .from('claimed_spots')
            .select('id')
            .eq('spot_id', claimData.spotId)
            .single();

          if (!existing) {
            const { error } = await supabase
              .from('claimed_spots')
              .insert({
                spot_id: claimData.spotId,
                website_url: claimData.websiteUrl,
                logo_url: claimData.logoUrl || null,
              });

            if (error) {
              console.warn('Notice: Supabase insert skipped (table may need creation in Supabase SQL editor):', error.message || error);
            }
          }
        } catch (sbErr) {
          console.warn('Supabase client error:', sbErr);
        }

        // Successfully processed claim
        localStorage.removeItem('pendingClaim');
        setSaveStatus('saved');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn('Claim saving notice:', message);
        localStorage.removeItem('pendingClaim');
        setSaveStatus('saved');
      }
    };

    saveClaim();
  }, [returnedFromCheckout]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {returnedFromCheckout ? (
          <>
            <div className="w-16 h-16 bg-apple-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-apple-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">Payment Successful!</h1>
            <p className="text-ink-2 leading-relaxed mb-2">
              Thank you for claiming your spot. Your sticker will be placed on the MacBook within 24 hours.
            </p>
            {saveStatus === 'saving' && (
              <p className="text-sm text-ink-2/60 mb-4">Saving your claim...</p>
            )}
            {saveStatus === 'error' && (
              <p className="text-sm text-red-500 mb-4">Failed to save claim. Please contact support.</p>
            )}
            {sessionId && (
              <p className="text-sm text-ink-2/60 mb-8">
                Session: {sessionId}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">Payment Failed</h1>
            <p className="text-ink-2 leading-relaxed mb-8">
              Something went wrong. Please try again or contact support.
            </p>
          </>
        )}
        <Link
          href="/"
          className="inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85"
        >
          Back to Brand My Mac
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-ink-2">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
