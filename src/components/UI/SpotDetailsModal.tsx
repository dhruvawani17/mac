"use client";

import { useEffect, useState } from "react";
import { SpotDefinition } from "@/data/spots";

interface SpotDetailsModalProps {
  spot: SpotDefinition | null;
  onClose: () => void;
  brandText: string;
  brandColor: string;
  onCheckout: (websiteUrl: string, email: string, logoUrl: string) => Promise<void>;
  isClaimed?: boolean;
  claimedWebsite?: string;
}

export function SpotDetailsModal({
  spot,
  onClose,
  brandText,
  brandColor,
  onCheckout,
  isClaimed = false,
  claimedWebsite,
}: SpotDetailsModalProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!spot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl || !email) return;
    setLoading(true);
    try {
      await onCheckout(websiteUrl, email, logoUrl);
    } finally {
      setLoading(false);
    }
  };

  const previewName = brandText.trim() || (websiteUrl ? websiteUrl.replace(/https?:\/\//, "").split("/")[0] : "YOUR LOGO");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-hairline transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-ink tracking-wider uppercase">
              SPOT {spot.id < 10 ? `0${spot.id}` : spot.id}
            </span>
            <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-xs font-semibold text-blue uppercase">
              {spot.tier}
            </span>
            {isClaimed && (
              <span className="rounded-full bg-apple-green/15 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                Claimed
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-2 hover:text-ink hover:bg-surface transition-colors cursor-pointer"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title & Desc */}
        <h3 className="text-2xl font-bold tracking-tight text-ink mb-1">
          {spot.label}
        </h3>
        <p className="text-sm text-ink-2 mb-5">
          {spot.desc} · Physical dimension: <span className="font-medium text-ink">{spot.size}</span>
        </p>

        {/* 2D Decal Preview Card */}
        <div className="rounded-2xl bg-surface/80 p-5 mb-5 border border-hairline/80 flex flex-col items-center justify-center">
          <span className="text-[11px] font-semibold text-ink-2 uppercase tracking-wider mb-2">
            Die-Cut Vinyl Decal Preview
          </span>
          <div
            className="w-full max-w-[280px] h-20 rounded-xl bg-white shadow-md border border-black/10 flex flex-col items-center justify-center p-3 relative overflow-hidden transition-all"
          >
            <span
              className="text-lg font-bold tracking-tight truncate max-w-[240px]"
              style={{ color: brandColor }}
            >
              {previewName}
            </span>
            <span className="text-[9px] font-semibold text-ink-2/60 uppercase tracking-widest mt-0.5">
              MACBOOK AIR M5 VINYL
            </span>
            {/* Decal Shine Highlight */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
          </div>
        </div>

        {/* Pricing / Claim Status */}
        <div className="flex items-center justify-between rounded-xl bg-surface p-4 mb-5 border border-hairline">
          <div>
            <span className="text-xs text-ink-2 block">Placement Cost</span>
            <span className="text-2xl font-bold tracking-tight text-ink">${spot.price}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-ink-2 block">Durability</span>
            <span className="text-xs font-semibold text-ink">Lifetime of Machine</span>
          </div>
        </div>

        {isClaimed ? (
          <div className="rounded-xl bg-apple-green/10 border border-apple-green/20 p-4 text-center">
            <p className="text-sm font-semibold text-green-800 mb-1">This spot has been claimed!</p>
            {claimedWebsite && (
              <p className="text-xs text-green-700">
                Active Sponsor: <span className="font-semibold">{claimedWebsite}</span>
              </p>
            )}
          </div>
        ) : (
          /* Form for checkout */
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Your Website URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full rounded-xl border border-hairline px-4 py-3 text-sm font-medium text-ink placeholder:text-ink-2/60 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-hairline px-4 py-3 text-sm font-medium text-ink placeholder:text-ink-2/60 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Logo URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://yoursite.com/logo.png"
                className="w-full rounded-xl border border-hairline px-4 py-3 text-sm font-medium text-ink placeholder:text-ink-2/60 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg"
            >
              {loading ? "Redirecting to checkout..." : `Claim Spot ${spot.id} · Pay $${spot.price}`}
            </button>

            <p className="text-[11px] text-center text-ink-2 mt-2">
              Secure payments powered by Dodo Payments. Vinyl sticker produced and applied within days.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
