"use client";

import Image from "next/image";
import { BMMSpot, SPOTS_DATA, CORNER_SPONSOR } from "@/data/brandmymac_data";

interface ExactMacBookViewProps {
  view: "lid" | "inside";
  onChangeView: (v: "lid" | "inside") => void;
  currency: "USD" | "EUR";
  onSelectSpot: (spot: BMMSpot) => void;
}

export function ExactMacBookView({
  view,
  onChangeView,
  currency,
  onSelectSpot,
}: ExactMacBookViewProps) {
  const formatPrice = (usd: number, eur: number) => {
    if (currency === "USD") {
      return `$${usd.toLocaleString()}`;
    }
    return `${eur.toLocaleString().replace(/,/g, " ")} €`;
  };

  const getSpot = (id: number) => SPOTS_DATA.find((s) => s.id === id)!;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Three-Column Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: The Corner Sponsor Card & Charger                           */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* The Corner Card */}
          <div className="rounded-2xl border border-dashed border-gray-300/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span>{CORNER_SPONSOR.timeAgo}</span>
              <span>paid {formatPrice(CORNER_SPONSOR.amountUsd, CORNER_SPONSOR.amountEur)}</span>
            </div>

            <div className="flex flex-col items-center justify-center my-2 text-center">
              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mb-2 overflow-hidden border border-gray-200/60 shadow-xs">
                <img
                  src={CORNER_SPONSOR.icon}
                  alt={CORNER_SPONSOR.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <span className="font-bold text-sm text-gray-900">{CORNER_SPONSOR.label}</span>
              <a
                href="#corner"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mt-1 cursor-pointer"
              >
                Claim this spot for {formatPrice(CORNER_SPONSOR.nextBidUsd, CORNER_SPONSOR.nextBidEur)}
              </a>
            </div>
          </div>

          {/* PREVIOUSLY HERE Section */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
              PREVIOUSLY HERE
            </span>
            <div className="space-y-2.5">
              {CORNER_SPONSOR.past.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group hover:bg-gray-50 p-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.avatar}
                      alt={item.label}
                      className="w-5 h-5 rounded-full object-cover shrink-0 border border-gray-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/logos/charnotes.png";
                      }}
                    />
                    <span className="text-xs font-medium text-gray-800 group-hover:text-blue-600 truncate">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">
                    {item.duration} · {formatPrice(item.amountUsd, item.amountEur)}
                  </span>
                </a>
              ))}
            </div>
            <a
              href="#corner"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mt-3 cursor-pointer"
            >
              See all 4 →
            </a>
          </div>

          {/* CHARGER + CABLE Placement */}
          <div className="mt-2 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              CHARGER + CABLE
            </span>
            <div
              onClick={() => onSelectSpot(getSpot(19))}
              className="relative w-36 h-36 flex items-center justify-center cursor-pointer group"
            >
              {/* Charger Graphic */}
              <img
                src="/charger.webp"
                alt="Charger and cable"
                className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-102 transition-transform"
              />
              {/* Dotted overlay spot */}
              <div className="absolute inset-x-4 inset-y-4 rounded-xl border border-dashed border-gray-400/80 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center p-2 group-hover:bg-white/90 transition-colors shadow-xs">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-gray-900">Botpool</span>
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  {formatPrice(getSpot(19).currentBidUsd, getSpot(19).currentBidEur)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Lid vs Inside View Switcher & The MacBook                 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Mode Switcher Pill */}
          <div className="inline-flex items-center rounded-full bg-gray-100 p-1 mb-5 border border-gray-200/70 shadow-xs">
            <button
              onClick={() => onChangeView("lid")}
              className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                view === "lid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Lid
            </button>
            <button
              onClick={() => onChangeView("inside")}
              className={`relative flex items-center gap-1.5 rounded-full px-5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                view === "inside"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Inside</span>
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            </button>
          </div>

          {/* ===================================================================== */}
          {/* VIEW: LID EXTERIOR                                                    */}
          {/* ===================================================================== */}
          {view === "lid" ? (
            <div
              className="w-full relative rounded-[28px] sm:rounded-[36px] bg-[#ebecee] border border-gray-300/80 p-4 sm:p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
              style={{ aspectRatio: "1.44" }}
            >
              {/* Inner Chassis Grid */}
              <div className="w-full h-full grid grid-cols-6 grid-rows-4 gap-2 sm:gap-3">
                {/* --------------------------------------------------------------- */}
                {/* ROW 1: 3 Large Banners (MacPaw, see.io, PrivateAlps)             */}
                {/* --------------------------------------------------------------- */}
                {/* Spot 1: MacPaw */}
                <div
                  onClick={() => onSelectSpot(getSpot(1))}
                  className="col-span-2 row-span-1 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-2 pt-1">
                    <img
                      src="/logos/1.png"
                      alt="MacPaw"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 pb-1">
                    {formatPrice(getSpot(1).currentBidUsd, getSpot(1).currentBidEur)}
                  </span>
                </div>

                {/* Spot 2: see.io */}
                <div
                  onClick={() => onSelectSpot(getSpot(2))}
                  className="col-span-2 row-span-1 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-2 pt-1">
                    <img
                      src="/logos/2.png"
                      alt="see.io"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 pb-1">
                    {formatPrice(getSpot(2).currentBidUsd, getSpot(2).currentBidEur)}
                  </span>
                </div>

                {/* Spot 3: PrivateAlps */}
                <div
                  onClick={() => onSelectSpot(getSpot(3))}
                  className="col-span-2 row-span-1 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-2 pt-1">
                    <img
                      src="/logos/3.png"
                      alt="PrivateAlps"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 pb-1">
                    {formatPrice(getSpot(3).currentBidUsd, getSpot(3).currentBidEur)}
                  </span>
                </div>

                {/* --------------------------------------------------------------- */}
                {/* ROW 2 & 3: 4 Small Spots + Center Apple Logo                    */}
                {/* --------------------------------------------------------------- */}
                {/* Spot 4: Draftline Fantasy */}
                <div
                  onClick={() => onSelectSpot(getSpot(4))}
                  className="col-span-1 row-span-2 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden p-1">
                    <img
                      src="/logos/4.png"
                      alt="Draftline Fantasy"
                      className="max-h-14 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <div className="text-center pb-1">
                    <span className="block text-[10px] font-medium text-gray-500 truncate max-w-[70px]">
                      Draftline Fantasy
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {formatPrice(getSpot(4).currentBidUsd, getSpot(4).currentBidEur)}
                    </span>
                  </div>
                </div>

                {/* Spot 5: SurfOffice */}
                <div
                  onClick={() => onSelectSpot(getSpot(5))}
                  className="col-span-1 row-span-2 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden p-1">
                    <img
                      src="/logos/5.png"
                      alt="SurfOffice"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 pb-1">
                    {formatPrice(getSpot(5).currentBidUsd, getSpot(5).currentBidEur)}
                  </span>
                </div>

                {/* Center Apple Logo */}
                <div className="col-span-2 row-span-2 flex items-center justify-center select-none pointer-events-none">
                  <img
                    src="/apple-logo.svg"
                    alt="Apple Logo"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain opacity-90 drop-shadow-xs"
                  />
                </div>

                {/* Spot 6: ServicePro.co */}
                <div
                  onClick={() => onSelectSpot(getSpot(6))}
                  className="col-span-1 row-span-2 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden p-1">
                    <img
                      src="/logos/6.svg"
                      alt="ServicePro.co"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <div className="text-center pb-1">
                    <span className="block text-[10px] font-medium text-gray-500 truncate max-w-[70px]">
                      ServicePro.co
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {formatPrice(getSpot(6).currentBidUsd, getSpot(6).currentBidEur)}
                    </span>
                  </div>
                </div>

                {/* Spot 7: Moyai */}
                <div
                  onClick={() => onSelectSpot(getSpot(7))}
                  className="col-span-1 row-span-2 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden p-1">
                    <img
                      src="/logos/7.png"
                      alt="Moyai"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <div className="text-center pb-1">
                    <span className="block text-[10px] font-medium text-gray-500 truncate max-w-[70px]">
                      Moyai
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {formatPrice(getSpot(7).currentBidUsd, getSpot(7).currentBidEur)}
                    </span>
                  </div>
                </div>

                {/* --------------------------------------------------------------- */}
                {/* ROW 4: 3 Medium Banners (dealhivemind, FELYN GO, nerofabric)    */}
                {/* --------------------------------------------------------------- */}
                {/* Spot 8: dealhivemind */}
                <div
                  onClick={() => onSelectSpot(getSpot(8))}
                  className="col-span-2 row-span-1 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-2 pt-1">
                    <img
                      src="/logos/8.svg"
                      alt="dealhivemind.com"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 pb-1">
                    {formatPrice(getSpot(8).currentBidUsd, getSpot(8).currentBidEur)}
                  </span>
                </div>

                {/* Spot 9: FELYN GO */}
                <div
                  onClick={() => onSelectSpot(getSpot(9))}
                  className="col-span-2 row-span-1 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-2 pt-1">
                    <img
                      src="/logos/9.png"
                      alt="FELYN GO"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 pb-1">
                    {formatPrice(getSpot(9).currentBidUsd, getSpot(9).currentBidEur)}
                  </span>
                </div>

                {/* Spot 10: nerofabric */}
                <div
                  onClick={() => onSelectSpot(getSpot(10))}
                  className="col-span-2 row-span-1 rounded-xl sm:rounded-2xl border border-dashed border-gray-400/80 bg-white/95 hover:bg-white p-2 flex flex-col items-center justify-between cursor-pointer transition-all shadow-xs group"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-2 pt-1">
                    <img
                      src="/logos/10.svg"
                      alt="nerofabric.com"
                      className="max-h-12 w-auto object-contain group-hover:scale-102 transition-transform"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 pb-1">
                    {formatPrice(getSpot(10).currentBidUsd, getSpot(10).currentBidEur)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ===================================================================== */
            /* VIEW: INSIDE DECK (KEYBOARD + PALM REST SPOTS)                        */
            /* ===================================================================== */
            <div
              className="w-full relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] border border-gray-300/80 bg-black/5"
              style={{ aspectRatio: "1.44" }}
            >
              {/* Top-down inside photo */}
              <img
                src="/inside.png"
                alt="MacBook inside top-down"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* ----------------------------------------------------------------- */}
              {/* LEFT PALM REST SPOTS (2x2 Grid)                                   */}
              {/* ----------------------------------------------------------------- */}
              {/* Spot 11: Sixtyfold (Top-Left) */}
              <div
                onClick={() => onSelectSpot(getSpot(11))}
                className="absolute left-[2.5%] top-[65%] w-[15%] h-[15%] rounded-xl border border-dashed border-gray-400/90 bg-white/95 hover:bg-white flex flex-col items-center justify-between p-1.5 cursor-pointer shadow-xs transition-transform hover:scale-102"
              >
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img src="/logos/11.png" alt="Sixtyfold" className="max-h-8 object-contain" />
                </div>
                <div className="text-center leading-none">
                  <span className="block text-[9px] font-bold text-gray-800 truncate">Sixtyfold</span>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {formatPrice(getSpot(11).currentBidUsd, getSpot(11).currentBidEur)}
                  </span>
                </div>
              </div>

              {/* Spot 12: Qurbo (Top-Right) */}
              <div
                onClick={() => onSelectSpot(getSpot(12))}
                className="absolute left-[18.5%] top-[65%] w-[15%] h-[15%] rounded-xl border border-dashed border-gray-400/90 bg-white/95 hover:bg-white flex flex-col items-center justify-between p-1.5 cursor-pointer shadow-xs transition-transform hover:scale-102"
              >
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img src="/logos/12.png" alt="Qurbo" className="max-h-8 object-contain" />
                </div>
                <div className="text-center leading-none">
                  <span className="text-[11px] font-semibold text-gray-600">
                    {formatPrice(getSpot(12).currentBidUsd, getSpot(12).currentBidEur)}
                  </span>
                </div>
              </div>

              {/* Spot 13: Developer Timeline (Bottom-Left) */}
              <div
                onClick={() => onSelectSpot(getSpot(13))}
                className="absolute left-[2.5%] top-[81%] w-[15%] h-[15%] rounded-xl border border-dashed border-gray-400/90 bg-white/95 hover:bg-white flex flex-col items-center justify-between p-1.5 cursor-pointer shadow-xs transition-transform hover:scale-102"
              >
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img src="/logos/13.png" alt="Developer Timeline" className="max-h-8 object-contain" />
                </div>
                <div className="text-center leading-none">
                  <span className="text-[11px] font-semibold text-gray-600">
                    {formatPrice(getSpot(13).currentBidUsd, getSpot(13).currentBidEur)}
                  </span>
                </div>
              </div>

              {/* Spot 14: cocoonvehicles (Bottom-Right) */}
              <div
                onClick={() => onSelectSpot(getSpot(14))}
                className="absolute left-[18.5%] top-[81%] w-[15%] h-[15%] rounded-xl border border-dashed border-gray-400/90 bg-white/95 hover:bg-white flex flex-col items-center justify-between p-1.5 cursor-pointer shadow-xs transition-transform hover:scale-102"
              >
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img src="/logos/14.png" alt="cocoonvehicles" className="max-h-8 object-contain" />
                </div>
                <div className="text-center leading-none">
                  <span className="block text-[8px] font-bold text-gray-800 truncate max-w-[55px]">cocoonvehi...</span>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {formatPrice(getSpot(14).currentBidUsd, getSpot(14).currentBidEur)}
                  </span>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* RIGHT PALM REST SPOTS (2x2 Grid)                                  */}
              {/* ----------------------------------------------------------------- */}
              {/* Spot 15: plantime (Top-Left) */}
              <div
                onClick={() => onSelectSpot(getSpot(15))}
                className="absolute right-[18.5%] top-[65%] w-[15%] h-[15%] rounded-xl border border-dashed border-gray-400/90 bg-white/95 hover:bg-white flex flex-col items-center justify-between p-1.5 cursor-pointer shadow-xs transition-transform hover:scale-102"
              >
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img src="/logos/15.svg" alt="plantime" className="max-h-8 object-contain" />
                </div>
                <div className="text-center leading-none">
                  <span className="text-[11px] font-semibold text-gray-600">
                    {formatPrice(getSpot(15).currentBidUsd, getSpot(15).currentBidEur)}
                  </span>
                </div>
              </div>

              {/* Spot 16: Product Mafia (Top-Right) */}
              <div
                onClick={() => onSelectSpot(getSpot(16))}
                className="absolute right-[2.5%] top-[65%] w-[15%] h-[15%] rounded-xl border border-dashed border-gray-400/90 bg-white/95 hover:bg-white flex flex-col items-center justify-between p-1.5 cursor-pointer shadow-xs transition-transform hover:scale-102"
              >
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img src="/logos/16.jpg" alt="Product Mafia" className="max-h-8 object-contain rounded-full" />
                </div>
                <div className="text-center leading-none">
                  <span className="block text-[9px] font-bold text-gray-800 truncate max-w-[55px]">Product Ma...</span>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {formatPrice(getSpot(16).currentBidUsd, getSpot(16).currentBidEur)}
                  </span>
                </div>
              </div>

              {/* Spot 17: SMALL UNSOLD (Bottom-Left) */}
              <div
                onClick={() => onSelectSpot(getSpot(17))}
                className="absolute right-[18.5%] top-[81%] w-[15%] h-[15%] rounded-xl border border-dashed border-gray-400/90 bg-white/80 hover:bg-white flex flex-col items-center justify-center p-1.5 cursor-pointer shadow-xs transition-transform hover:scale-102"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                  SMALL
                </span>
                <span className="text-[9px] font-medium text-gray-400 mt-0.5">
                  unsold
                </span>
              </div>

              {/* Spot 18: Martin Marchev / Roman bust (Bottom-Right) */}
              <div
                onClick={() => onSelectSpot(getSpot(18))}
                className="absolute right-[2.5%] top-[81%] w-[15%] h-[15%] rounded-xl border border-dashed border-gray-400/90 bg-white/95 hover:bg-white flex flex-col items-center justify-between p-1.5 cursor-pointer shadow-xs transition-transform hover:scale-102"
              >
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img src="/logos/18.png" alt="Martin Marchev" className="max-h-8 object-contain" />
                </div>
                <div className="text-center leading-none">
                  <span className="text-[11px] font-semibold text-gray-600">
                    {formatPrice(getSpot(18).currentBidUsd, getSpot(18).currentBidEur)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Magic Mouse                                                */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col items-center pt-8">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            MAGIC MOUSE
          </span>
          <div
            onClick={() => onSelectSpot(getSpot(20))}
            className="relative w-28 h-48 flex items-center justify-center cursor-pointer group"
          >
            {/* Mouse Graphic */}
            <img
              src="/magicmouse.webp"
              alt="Magic mouse"
              className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-102 transition-transform"
            />
            {/* Dotted overlay spot */}
            <div className="absolute inset-x-2 top-14 bottom-14 rounded-2xl border border-dashed border-gray-400/80 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center p-2 group-hover:bg-white/90 transition-colors shadow-xs">
              <div className="flex items-center gap-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-gray-900">Botpool</span>
              </div>
              <span className="text-xs font-semibold text-gray-600">
                {formatPrice(getSpot(20).currentBidUsd, getSpot(20).currentBidEur)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
