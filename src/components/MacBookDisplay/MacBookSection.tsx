"use client";

interface Spot {
  id: number;
  label: string;
  size: string;
  price: number;
  desc: string;
}

interface ClaimedSpot {
  id: number;
  spot_id: number;
  website_url: string;
  logo_url: string | null;
  created_at: string;
}

interface MacBookSectionProps {
  view: "lid" | "inside";
  onChangeView: (v: "lid" | "inside") => void;
  selectedSpot: Spot | null;
  onSelectSpot: (spot: Spot) => void;
  claimedSpots: ClaimedSpot[];
  lidSpots: Spot[];
  insideSpots: Spot[];
}

export function MacBookSection({
  view,
  onChangeView,
  selectedSpot,
  onSelectSpot,
  claimedSpots,
  lidSpots,
  insideSpots,
}: MacBookSectionProps) {

  // Helper to normalize and format external website URLs
  const formatUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // Helper to get logo for a spot ONLY if claimed in claimedSpots
  const getSpotLogo = (spotId: number) => {
    const claim = claimedSpots.find((c) => c.spot_id === spotId);
    if (claim) {
      return {
        url:
          claim.logo_url ||
          `https://www.google.com/s2/favicons?domain=${claim.website_url.replace(/https?:\/\//, "").split("/")[0]}&sz=64`,
        name: claim.website_url.replace(/https?:\/\//, "").split("/")[0],
        website_url: claim.website_url,
      };
    }
    return null;
  };

  // Handle click on any spot: if bought/claimed, redirect to its website; if available, open claim modal
  const handleSpotClick = (spot: Spot | undefined) => {
    if (!spot) return;
    const claim = claimedSpots.find((c) => c.spot_id === spot.id);
    if (claim && claim.website_url) {
      const targetUrl = formatUrl(claim.website_url);
      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
        return;
      }
    }
    onSelectSpot(spot);
  };

  // Render a 2D Lid sticker spot with clean earlier style
  const renderLidSpot = (spot: Spot, className: string) => {
    const logoData = getSpotLogo(spot.id);
    const isSelected = selectedSpot?.id === spot.id;

    return (
      <button
        key={spot.id}
        onClick={() => handleSpotClick(spot)}
        title={
          logoData
            ? `Visit ${logoData.name} (${logoData.website_url})`
            : `Spot #${spot.id} · $${spot.price}`
        }
        className={`${className} rounded-lg sm:rounded-xl border border-dashed border-gray-400/80 bg-white/90 hover:bg-white flex flex-col items-center justify-center p-1 sm:p-2 cursor-pointer transition-all shadow-xs group ${isSelected ? "ring-2 ring-blue-600 bg-white shadow-md" : ""
          } ${logoData ? "hover:border-blue-400 hover:shadow-md" : ""}`}
      >
        {logoData ? (
          <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-1 pt-0.5">
            <img
              src={logoData.url}
              alt={logoData.name}
              className="max-h-9 sm:max-h-11 max-w-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-ink">
              #{spot.id}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 group-hover:text-gray-700">
              ${spot.price}
            </span>
          </div>
        )}
      </button>
    );
  };

  const chargerClaim = getSpotLogo(insideSpots[8]?.id ?? 23);
  const mouseClaim = getSpotLogo(insideSpots[9]?.id ?? 24);

  return (
    <div className="w-full max-w-6xl mx-auto mb-8 px-2 sm:px-4">
      {/* Top Controls Row: View Switcher (Lid | Inside) */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {/* Lid / Inside Segmented Control */}
        <div className="inline-flex rounded-full bg-gray-100 p-1 border border-gray-200/70 shadow-xs">
          <button
            onClick={() => onChangeView("lid")}
            className={`rounded-full px-5 py-1.5 text-[13px] font-medium transition-all cursor-pointer ${view === "lid"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            Lid
          </button>
          <button
            onClick={() => onChangeView("inside")}
            className={`relative flex items-center gap-1.5 rounded-full px-5 py-1.5 text-[13px] font-medium transition-all cursor-pointer ${view === "inside"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
              }`}
          >
            <span>Inside</span>
            {claimedSpots.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                {claimedSpots.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2D MACBOOK STAGE WITH BALANCED GRID                                     */}
      {/* ======================================================================= */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
          {/* Left Flank: CHARGER + CABLE */}
          <div className="hidden lg:flex flex-col items-center w-40 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              CHARGER + CABLE
            </span>
            <div
              onClick={() => handleSpotClick(insideSpots[8])}
              title={
                chargerClaim
                  ? `Visit ${chargerClaim.name} (${chargerClaim.website_url})`
                  : `Spot #23 · $${insideSpots[8]?.price ?? 75}`
              }
              className="relative w-36 h-28 flex items-center justify-center cursor-pointer group"
            >
              <img
                src="/charger.png"
                alt="Apple Charger"
                className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-102 transition-transform"
              />
              <div
                className={`absolute left-[38%] right-[8%] top-[10%] bottom-[10%] rounded-xl border border-dashed border-gray-400/80 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-1 group-hover:bg-white transition-all shadow-xs ${selectedSpot?.id === 23 ? "ring-2 ring-blue-600 bg-white shadow-md" : ""
                  } ${chargerClaim ? "hover:border-blue-400 hover:shadow-md" : ""}`}
              >
                {chargerClaim ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={chargerClaim.url}
                      alt={chargerClaim.name}
                      className="max-h-7 object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-bold text-gray-900">#23</span>
                    <span className="text-[11px] font-semibold text-gray-600">
                      ${insideSpots[8]?.price ?? 75}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Center: The MacBook Lid or Inside */}
          <div className="relative w-full max-w-2xl sm:max-w-3xl lg:max-w-[840px] xl:max-w-[890px]">
            {view === "lid" ? (
              /* =============================================================== */
              /* LID VIEW — EARLIER BALANCED 4-ROW GRID (Spots 1-14 + Logo)     */
              /* =============================================================== */
              <div
                className="relative w-full rounded-[24px] sm:rounded-[36px] bg-[#ebecee] border border-gray-300/80 p-3 sm:p-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
                style={{ aspectRatio: "1.411" }}
              >
                <div
                  className="w-full h-full grid gap-2 sm:gap-2.5"
                  style={{
                    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                    gridTemplateRows:
                      "minmax(0, 1.25fr) minmax(0, 0.85fr) minmax(0, 0.85fr) minmax(0, 1.05fr)",
                  }}
                >
                  {/* Row 1: 3 large banners (Spots 1, 2, 3) */}
                  {renderLidSpot(lidSpots[0], "col-start-1 col-end-3 row-start-1 row-end-2")}
                  {renderLidSpot(lidSpots[1], "col-start-3 col-end-5 row-start-1 row-end-2")}
                  {renderLidSpot(lidSpots[2], "col-start-5 col-end-7 row-start-1 row-end-2")}

                  {/* Row 2: Upper small spots (4, 5 left, 8, 9 right) */}
                  {renderLidSpot(lidSpots[3], "col-start-1 col-end-2 row-start-2 row-end-3")}
                  {renderLidSpot(lidSpots[4], "col-start-2 col-end-3 row-start-2 row-end-3")}
                  {renderLidSpot(lidSpots[7], "col-start-5 col-end-6 row-start-2 row-end-3")}
                  {renderLidSpot(lidSpots[8], "col-start-6 col-end-7 row-start-2 row-end-3")}

                  {/* Row 3: Lower small spots (6, 7 left, 10, 11 right) */}
                  {renderLidSpot(lidSpots[5], "col-start-1 col-end-2 row-start-3 row-end-4")}
                  {renderLidSpot(lidSpots[6], "col-start-2 col-end-3 row-start-3 row-end-4")}

                  {/* Centered Apple Logo spanning Rows 2 & 3 in middle columns 3-4 */}
                  <div className="col-start-3 col-end-5 row-start-2 row-end-4 flex items-center justify-center select-none pointer-events-none">
                    <img
                      src="/apple-logo.svg"
                      alt="Apple Logo"
                      className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-[150px] lg:h-[150px] object-contain opacity-90 drop-shadow-xs"
                    />
                  </div>

                  {renderLidSpot(lidSpots[9], "col-start-5 col-end-6 row-start-3 row-end-4")}
                  {renderLidSpot(lidSpots[10], "col-start-6 col-end-7 row-start-3 row-end-4")}

                  {/* Row 4: 3 bottom strips (Spots 12, 13, 14) */}
                  {renderLidSpot(lidSpots[11], "col-start-1 col-end-3 row-start-4 row-end-5")}
                  {renderLidSpot(lidSpots[12], "col-start-3 col-end-5 row-start-4 row-end-5")}
                  {renderLidSpot(lidSpots[13], "col-start-5 col-end-7 row-start-4 row-end-5")}
                </div>
              </div>
            ) : (
              /* =============================================================== */
              /* INSIDE VIEW (Deck with keyboard, trackpad & clean palm spots)  */
              /* =============================================================== */
              <div
                className="relative w-full select-none"
                style={{ aspectRatio: "1.411" }}
              >
                <img
                  src="/inside.png?v=4"
                  alt="MacBook inside top-down"
                  className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.14)]"
                />

                {/* Left Palm Rest Spots (4 spots in 2x2 grid: 15, 16, 17, 18) */}
                {insideSpots.slice(0, 4).map((spot, idx) => {
                  const palmStyles = [
                    { left: "4.5%", top: "64.5%", width: "10.5%", height: "14%" },
                    { left: "16.5%", top: "64.5%", width: "10.5%", height: "14%" },
                    { left: "4.5%", top: "80.5%", width: "10.5%", height: "14%" },
                    { left: "16.5%", top: "80.5%", width: "10.5%", height: "14%" },
                  ];
                  const logoData = getSpotLogo(spot.id);
                  const isSelected = selectedSpot?.id === spot.id;

                  return (
                    <button
                      key={spot.id}
                      onClick={() => handleSpotClick(spot)}
                      title={
                        logoData
                          ? `Visit ${logoData.name} (${logoData.website_url})`
                          : `Spot #${spot.id} · $${spot.price}`
                      }
                      style={palmStyles[idx]}
                      className={`absolute rounded-xl border border-dashed border-gray-400/90 bg-white/90 hover:bg-white flex flex-col items-center justify-center p-1 cursor-pointer shadow-xs transition-all hover:scale-102 group ${isSelected ? "ring-2 ring-blue-600 bg-white shadow-md" : ""
                        } ${logoData ? "hover:border-blue-400 hover:shadow-md" : ""}`}
                    >
                      {logoData ? (
                        <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                          <img
                            src={logoData.url}
                            alt={logoData.name}
                            className="max-h-7 object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[11px] sm:text-xs font-bold text-gray-800">
                            #{spot.id}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500">
                            ${spot.price}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Right Palm Rest Spots (4 spots in 2x2 grid: 19, 20, 21, 22) */}
                {insideSpots.slice(4, 8).map((spot, idx) => {
                  const palmStyles = [
                    { left: "73.0%", top: "64.5%", width: "10.5%", height: "14%" },
                    { left: "85.0%", top: "64.5%", width: "10.5%", height: "14%" },
                    { left: "73.0%", top: "80.5%", width: "10.5%", height: "14%" },
                    { left: "85.0%", top: "80.5%", width: "10.5%", height: "14%" },
                  ];
                  const logoData = getSpotLogo(spot.id);
                  const isSelected = selectedSpot?.id === spot.id;

                  return (
                    <button
                      key={spot.id}
                      onClick={() => handleSpotClick(spot)}
                      title={
                        logoData
                          ? `Visit ${logoData.name} (${logoData.website_url})`
                          : `Spot #${spot.id} · $${spot.price}`
                      }
                      style={palmStyles[idx]}
                      className={`absolute rounded-xl border border-dashed border-gray-400/90 bg-white/90 hover:bg-white flex flex-col items-center justify-center p-1 cursor-pointer shadow-xs transition-all hover:scale-102 group ${isSelected ? "ring-2 ring-blue-600 bg-white shadow-md" : ""
                        } ${logoData ? "hover:border-blue-400 hover:shadow-md" : ""}`}
                    >
                      {logoData ? (
                        <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                          <img
                            src={logoData.url}
                            alt={logoData.name}
                            className="max-h-7 object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[11px] sm:text-xs font-bold text-gray-800">
                            #{spot.id}
                          </span>
                          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-500">
                            ${spot.price}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Flank: MAGIC MOUSE */}
          <div className="hidden lg:flex flex-col items-center w-36 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              MAGIC MOUSE
            </span>
            <div
              onClick={() => handleSpotClick(insideSpots[9])}
              title={
                mouseClaim
                  ? `Visit ${mouseClaim.name} (${mouseClaim.website_url})`
                  : `Spot #24 · $${insideSpots[9]?.price ?? 89}`
              }
              className="relative w-28 h-44 flex items-center justify-center cursor-pointer group"
            >
              <img
                src="/magicmouse.webp"
                alt="Magic mouse"
                className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-102 transition-transform"
              />
              <div
                className={`absolute inset-x-2 top-12 bottom-12 rounded-2xl border border-dashed border-gray-400/80 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-2 group-hover:bg-white transition-all shadow-xs ${selectedSpot?.id === 24 ? "ring-2 ring-blue-600 bg-white shadow-md" : ""
                  } ${mouseClaim ? "hover:border-blue-400 hover:shadow-md" : ""}`}
              >
                {mouseClaim ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={mouseClaim.url}
                      alt={mouseClaim.name}
                      className="max-h-8 object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-bold text-gray-900">#24</span>
                    <span className="text-[11px] font-semibold text-gray-600">
                      ${insideSpots[9]?.price ?? 89}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Mobile accessories row for small screens where side flanks are hidden */}
      <div className="flex lg:hidden items-center justify-center gap-6 mt-5 pt-3 border-t border-gray-100">
        <button
          onClick={() => handleSpotClick(insideSpots[8])}
          title={chargerClaim ? `Visit ${chargerClaim.name} (${chargerClaim.website_url})` : undefined}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/80 hover:bg-white transition-colors cursor-pointer"
        >
          <img src="/charger.png" alt="Charger" className="w-8 h-8 object-contain" />
          <div className="text-left">
            <span className="text-[11px] font-bold text-gray-800 block">Charger & Cable</span>
            <span className="text-[10px] text-gray-500 font-medium">
              Spot #23 · {chargerClaim ? "Claimed" : `$${insideSpots[8]?.price ?? 75}`}
            </span>
          </div>
        </button>

        <button
          onClick={() => handleSpotClick(insideSpots[9])}
          title={mouseClaim ? `Visit ${mouseClaim.name} (${mouseClaim.website_url})` : undefined}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/80 hover:bg-white transition-colors cursor-pointer"
        >
          <img src="/magicmouse.webp" alt="Mouse" className="w-8 h-8 object-contain" />
          <div className="text-left">
            <span className="text-[11px] font-bold text-gray-800 block">Magic Mouse</span>
            <span className="text-[10px] text-gray-500 font-medium">
              Spot #24 · {mouseClaim ? "Claimed" : `$${insideSpots[9]?.price ?? 89}`}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
