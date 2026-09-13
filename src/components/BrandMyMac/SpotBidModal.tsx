"use client";

import { useState } from "react";
import { BMMSpot } from "@/data/brandmymac_data";

interface SpotBidModalProps {
  spot: BMMSpot | null;
  currency: "USD" | "EUR";
  onClose: () => void;
  onCheckout: (spotId: number, websiteUrl: string, logoUrl: string, amount: number) => Promise<void>;
}

export function SpotBidModal({
  spot,
  currency,
  onClose,
  onCheckout,
}: SpotBidModalProps) {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!spot) return null;

  const currentPrice = currency === "USD" ? spot.currentBidUsd : spot.currentBidEur;
  const minBid = currentPrice + (currency === "USD" ? 15 : 10);
  const currencySymbol = currency === "USD" ? "$" : "€";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) return;
    setLoading(true);
    try {
      await onCheckout(spot.id, websiteUrl, logoUrl, minBid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
              Spot {spot.id}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500">{spot.dims}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs font-medium text-gray-500 uppercase">{spot.surface}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
          {spot.label}
        </h3>

        {/* Current Bid / Sponsor Banner */}
        <div className="rounded-xl bg-gray-50 p-3.5 my-4 border border-gray-200/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 block uppercase font-medium">Current top bid</span>
            <span className="text-xl font-bold text-gray-900">
              {currency === "USD" ? `$${currentPrice}` : `${currentPrice} €`}
            </span>
          </div>

          {spot.sponsor && (
            <div className="flex items-center gap-2 text-right">
              {spot.sponsor.logo && (
                <img
                  src={spot.sponsor.logo}
                  alt={spot.sponsor.brand}
                  className="max-h-7 max-w-[90px] object-contain"
                />
              )}
              <a
                href={spot.sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-0.5"
              >
                Visit ↗
              </a>
            </div>
          )}
        </div>

        {/* Form to place a higher bid / claim */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Your Website URL
            </label>
            <input
              type="url"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yoursite.com"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Logo URL (Optional)
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://yoursite.com/logo.png"
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-[#111111] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading
              ? "Processing..."
              : `Place bid for ${currencySymbol}${minBid} · Claim Spot ${spot.id}`}
          </button>
        </form>

        <p className="text-[11px] text-center text-gray-400 mt-3">
          Outbids require beating the standing offer. Stickers printed as high-quality die-cut vinyl.
        </p>
      </div>
    </div>
  );
}
