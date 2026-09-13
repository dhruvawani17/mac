"use client";

import { useState, useEffect } from "react";
import { MacBookSection } from "@/components/MacBookDisplay/MacBookSection";
import { createClient } from "@/utils/supabase/client";

interface ClaimedSpot {
  id: number;
  spot_id: number;
  website_url: string;
  logo_url: string | null;
  created_at: string;
}

const lidSpots = [
  { id: 1, label: "Top left banner", size: "9.5 × 5.5 cm", price: 170, desc: "Top · far left" },
  { id: 2, label: "Marquee (above logo)", size: "9.5 × 5.5 cm", price: 240, desc: "Top · centre" },
  { id: 3, label: "Top right banner", size: "9.5 × 5.5 cm", price: 170, desc: "Top · far right" },
  { id: 4, label: "Upper left — far left", size: "1.2 × 1.2 cm", price: 25, desc: "Upper · far left" },
  { id: 5, label: "Upper left — left", size: "1.2 × 1.2 cm", price: 25, desc: "Upper · left" },
  { id: 6, label: "Upper left — centre left", size: "1.2 × 1.2 cm", price: 25, desc: "Upper · centre left" },
  { id: 7, label: "Upper left — centre right", size: "1.2 × 1.2 cm", price: 25, desc: "Upper · centre right" },
  { id: 8, label: "Upper right — far left", size: "1.2 × 1.2 cm", price: 25, desc: "Upper · right" },
  { id: 9, label: "Upper right — left", size: "1.2 × 1.2 cm", price: 25, desc: "Upper · far right" },
  { id: 10, label: "Upper right — centre left", size: "1.2 × 1.2 cm", price: 25, desc: "Upper · centre left" },
  { id: 11, label: "Upper right — centre right", size: "1.2 × 1.2 cm", price: 25, desc: "Upper · centre right" },
  { id: 12, label: "Bottom left strip", size: "9.5 × 4 cm", price: 160, desc: "Bottom · far left" },
  { id: 13, label: "Bottom centre (under logo)", size: "9.5 × 4 cm", price: 195, desc: "Bottom · centre" },
  { id: 14, label: "Bottom right strip", size: "9.5 × 4 cm", price: 160, desc: "Bottom · far right" },
];

const insideSpots = [
  { id: 15, label: "Left palm rest — 1", size: "4 × 4 cm", price: 25, desc: "Left palm · far left" },
  { id: 16, label: "Left palm rest — 2", size: "4 × 4 cm", price: 35, desc: "Left palm · left" },
  { id: 17, label: "Left palm rest — 3", size: "4 × 4 cm", price: 25, desc: "Left palm · centre left" },
  { id: 18, label: "Left palm rest — 4", size: "4 × 4 cm", price: 35, desc: "Left palm · centre right" },
  { id: 19, label: "Right palm rest — 1", size: "4 × 4 cm", price: 45, desc: "Right palm · left" },
  { id: 20, label: "Right palm rest — 2", size: "4 × 4 cm", price: 30, desc: "Right palm · centre left" },
  { id: 21, label: "Right palm rest — 3", size: "4 × 4 cm", price: 35, desc: "Right palm · centre right" },
  { id: 22, label: "Right palm rest — 4", size: "4 × 4 cm", price: 25, desc: "Right palm · far right" },
  { id: 23, label: "The charger + cable", size: "5 × 5 cm", price: 75, desc: "Charger · centre" },
  { id: 24, label: "The Magic Mouse", size: "4 × 2.5 cm", price: 89, desc: "Mouse · centre" },
];

const allSpots = [...lidSpots, ...insideSpots];
const goalAmount = allSpots.reduce((sum, spot) => sum + spot.price, 0);

const formatUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

export default function Home() {
  const [view, setView] = useState<"lid" | "inside">("lid");
  const [selectedSpot, setSelectedSpot] = useState<typeof allSpots[0] | null>(null);
  const [claimedSpots, setClaimedSpots] = useState<ClaimedSpot[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutLogoUrl, setCheckoutLogoUrl] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [liveUsers, setLiveUsers] = useState<number>(1);
  const [totalVisitors, setTotalVisitors] = useState<number>(81);

  // Real-time visitor tracking (every refresh registers a new visitor)
  useEffect(() => {
    try {
      localStorage.removeItem("bmm_vid");
    } catch {}

    const visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Initial pageview registration
    const registerVisit = async () => {
      try {
        const res = await fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId,
            sessionId,
            action: "pageview",
          }),
        });
        const data = await res.json();
        if (typeof data.liveUsers === "number") setLiveUsers(data.liveUsers);
        if (typeof data.totalVisitors === "number") setTotalVisitors(data.totalVisitors);
      } catch (err) {
        console.error("Error registering visitor:", err);
      }
    };

    // Heartbeat to keep live session active
    const sendHeartbeat = async () => {
      try {
        const res = await fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId,
            sessionId,
            action: "heartbeat",
          }),
        });
        const data = await res.json();
        if (typeof data.liveUsers === "number") setLiveUsers(data.liveUsers);
        if (typeof data.totalVisitors === "number") setTotalVisitors(data.totalVisitors);
      } catch (err) {
        console.error("Heartbeat error:", err);
      }
    };

    registerVisit();
    const interval = setInterval(sendHeartbeat, 15000);

    const handleUnload = () => {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/stats",
          new Blob([JSON.stringify({ visitorId, sessionId, action: "leave" })], {
            type: "application/json",
          })
        );
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      handleUnload();
    };
  }, []);

  // Load claimed spots from Supabase & local storage on mount
  useEffect(() => {
    const fetchClaimedSpots = async () => {
      try {
        // Clean up any legacy localStorage fallback claims
        try {
          localStorage.removeItem("local_claimed_spots");
        } catch {
          // ignore
        }

        const response = await fetch("/api/spots");
        const data = await response.json();
        if (data.claimedSpots && Array.isArray(data.claimedSpots)) {
          setClaimedSpots(data.claimedSpots);
        } else {
          setClaimedSpots([]);
        }
      } catch (error) {
        console.error("Error fetching claimed spots:", error);
      }
    };

    fetchClaimedSpots();

    // Supabase Realtime subscription for live spot claims & deletions
    try {
      const supabase = createClient();
      const channel = supabase
        .channel('claimed_spots_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'claimed_spots' },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              // Deleted from Supabase: immediately remove from website
              const deletedSpotId = (payload.old as { spot_id?: number })?.spot_id;
              if (deletedSpotId) {
                setClaimedSpots((prev) => prev.filter((s) => s.spot_id !== deletedSpotId));
              } else {
                fetchClaimedSpots();
              }
            } else if (payload.new && typeof (payload.new as { spot_id?: number }).spot_id === 'number') {
              const updatedItem = payload.new as ClaimedSpot;
              setClaimedSpots((prev) => {
                const exists = prev.some((s) => s.spot_id === updatedItem.spot_id);
                if (exists) {
                  return prev.map((s) => (s.spot_id === updatedItem.spot_id ? updatedItem : s));
                }
                return [...prev, updatedItem];
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime subscription skipped:', e);
    }
  }, []);

  const claimedIds = new Set(claimedSpots.map((s) => s.spot_id));
  const raised = allSpots.filter((s) => claimedIds.has(s.id)).reduce((sum, s) => sum + s.price, 0);
  const takenCount = claimedIds.size;
  const goalPassed = raised >= goalAmount;
  const percentage = Math.min(Math.round((raised / goalAmount) * 100), 100);

  const handleCheckout = async () => {
    if (!selectedSpot || !checkoutUrl) {
      alert("Please enter your website URL.");
      return;
    }
    if (!checkoutEmail || !checkoutEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    setCheckoutLoading(true);
    try {
      localStorage.setItem(
        "pendingClaim",
        JSON.stringify({
          spotId: selectedSpot.id,
          websiteUrl: checkoutUrl,
          email: checkoutEmail,
          logoUrl: checkoutLogoUrl,
        })
      );

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotId: selectedSpot.id,
          spotLabel: selectedSpot.label,
          spotSize: selectedSpot.size,
          spotPrice: selectedSpot.price,
          email: checkoutEmail,
          websiteUrl: checkoutUrl,
          logoUrl: checkoutLogoUrl,
        }),
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Failed to create checkout. Please try again.");
      }
    } catch {
      alert("Failed to create checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-ink font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-hairline/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-13 max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px] tracking-[-0.01em]">Brand My Mac</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[15px] text-ink-2">
            <a href="#spots" className="hover:text-ink transition-colors">
              Spots
            </a>
            <a href="#how" className="hover:text-ink transition-colors">
              How it works
            </a>
            <a href="#specs" className="hover:text-ink transition-colors">
              The machine
            </a>
            <a href="#faq" className="hover:text-ink transition-colors">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-hairline/80 text-xs text-ink-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-ink">{liveUsers} live</span>
              <span className="text-ink-2/30">·</span>
              <span>
                {totalVisitors.toLocaleString()} {totalVisitors === 1 ? "visitor" : "visitors"}
              </span>
            </div>
            <a
              href="#spots"
              className="rounded-full bg-ink px-4 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85"
            >
              Get a spot
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-4 sm:px-6 pt-8 pb-6 md:pt-12 md:pb-8">
        <div className="mx-auto max-w-5xl xl:max-w-6xl text-center">
          {/* Top Live Stats Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface/90 border border-hairline/90 shadow-2xs text-xs font-medium text-ink-2 mb-5 backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-ink">
              {liveUsers} {liveUsers === 1 ? "live user" : "live users"}
            </span>
            <span className="text-ink-2/30">·</span>
            <span>
              <strong className="font-bold text-ink">{totalVisitors.toLocaleString()}</strong>{" "}
              {totalVisitors === 1 ? "total visitor" : "total visitors"}
            </span>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.025em] mb-3">
            Your brand, on my Mac.
          </h1>
          <p className="text-[clamp(0.95rem,1.7vw,1.15rem)] text-ink-2 mb-6 max-w-xl mx-auto leading-relaxed">
            Your logo travels with me on a founder&apos;s best friend: the MacBook.
          </p>

          {/* Stats + Progress Bar */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-apple-green">
                  ${raised.toLocaleString()}
                </span>
                <span className="text-sm text-ink-2">raised</span>
              </div>
              <div className="flex items-center gap-2">
                {goalPassed && <span className="w-2 h-2 rounded-full bg-apple-green"></span>}
                <span className={`text-sm ${goalPassed ? "text-apple-green font-medium" : "text-ink-2"}`}>
                  {goalPassed
                    ? `goal passed · ${Math.round((raised / goalAmount) * 100)}%`
                    : `goal: $${goalAmount.toLocaleString()}`}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mx-auto max-w-lg">
              <div className="h-3 bg-hairline rounded-full overflow-hidden">
                <div
                  className="h-full bg-apple-green rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-ink-2 mt-2">
              {goalPassed
                ? `${takenCount} spot${takenCount !== 1 ? "s" : ""} sold`
                : `${takenCount} spot${takenCount !== 1 ? "s" : ""} sold · $${(
                    goalAmount - raised
                  ).toLocaleString()} to go`}
            </p>
          </div>

          {/* Upgraded MacBook & Stickers Section */}
          <MacBookSection
            view={view}
            onChangeView={setView}
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
            claimedSpots={claimedSpots}
            lidSpots={lidSpots}
            insideSpots={insideSpots}
          />

          <p className="text-[15px] text-ink-2 mb-1">Tap any spot to claim it.</p>
          <a href="#how" className="text-[15px] font-medium text-blue hover:underline">
            How it works ›
          </a>
        </div>
      </header>

      {/* Promoting section */}
      <section className="py-8 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-ink-2 text-sm leading-relaxed mb-5">
            I&apos;m promoting my MacBook by leasing it to advertising.
            <br />
            Every sticker you see is a real ad placed on my daily driver.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="#how"
              className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-85"
            >
              How it works
            </a>
            <a
              href="#spots"
              className="rounded-full border border-hairline px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-surface"
            >
              View all spots
            </a>
          </div>
        </div>
      </section>

      {/* Spots Grid Section */}
      <section id="spots" className="scroll-mt-20 bg-surface/70 py-14 md:py-20 border-t border-hairline/70">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mb-2">
                Available Spots
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-2">
                <span>Lid spots from</span>
                <span className="bg-white border border-hairline rounded-full px-3 py-1 font-medium text-ink">
                  $25 Small
                </span>
                <span className="text-ink-2/40">·</span>
                <span className="bg-white border border-hairline rounded-full px-3 py-1 font-medium text-ink">
                  $150 Medium
                </span>
                <span className="text-ink-2/40">·</span>
                <span className="bg-white border border-hairline rounded-full px-3 py-1 font-medium text-ink">
                  $200 Large
                </span>
              </div>
            </div>
            <div className="text-xs text-ink-2 font-medium">
              {allSpots.length - takenCount} of {allSpots.length} spots available
            </div>
          </div>

          {/* Grid of Spot Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {allSpots.map((spot) => {
              const claim = claimedSpots.find((c) => c.spot_id === spot.id);
              const isClaimed = !!claim || claimedIds.has(spot.id);
              const isSelected = selectedSpot?.id === spot.id;

              const handleSpotCardClick = () => {
                if (isClaimed && claim?.website_url) {
                  const targetUrl = formatUrl(claim.website_url);
                  if (targetUrl) {
                    window.open(targetUrl, "_blank", "noopener,noreferrer");
                    return;
                  }
                }
                if (!isClaimed) {
                  setSelectedSpot(spot);
                }
              };

              return (
                <div
                  key={spot.id}
                  onClick={handleSpotCardClick}
                  title={
                    isClaimed && claim?.website_url
                      ? `Visit ${claim.website_url} (Spot #${spot.id})`
                      : undefined
                  }
                  className={`rounded-2xl bg-white p-5 border transition-all shadow-xs flex flex-col justify-between cursor-pointer ${
                    isClaimed
                      ? "border-hairline bg-gray-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-sm"
                      : isSelected
                      ? "border-blue-600 ring-2 ring-blue-600/20 shadow-sm"
                      : "border-hairline hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    {/* Top Row: Spot ID badge & Status pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isClaimed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-surface text-ink font-semibold"
                          }`}
                        >
                          {isClaimed ? "✓" : spot.id}
                        </span>
                        <span className="text-xs font-semibold text-ink-2">
                          Spot {spot.id}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isClaimed
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-apple-green/10 text-green-700"
                        }`}
                      >
                        {isClaimed ? "Claimed" : "Available"}
                      </span>
                    </div>

                    {/* Spot Title & Label */}
                    <h3 className="font-bold text-[15px] text-ink mb-0.5 line-clamp-1">
                      {spot.desc}
                    </h3>
                    <p className="text-xs text-ink-2 mb-3 line-clamp-1">
                      {spot.label}
                    </p>

                    {/* Dimensions / Size */}
                    <div className="flex items-center gap-1.5 text-xs text-ink-2 mb-4">
                      <span className="text-ink-2/70">Size:</span>
                      <span className="font-medium text-ink">{spot.size}</span>
                    </div>
                  </div>

                  {/* Bottom Row: Price & Bid / Claim Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-hairline/70 mt-auto">
                    <div>
                      <span className="text-[10px] text-ink-2 block leading-none mb-0.5">Price</span>
                      <span className="text-xl font-bold tracking-tight text-ink">
                        ${spot.price}
                      </span>
                    </div>

                    {!isClaimed ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpot(spot);
                        }}
                        className="rounded-full bg-blue px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-hover transition-colors cursor-pointer shadow-2xs"
                      >
                        Bid
                      </button>
                    ) : claim?.website_url ? (
                      <a
                        href={formatUrl(claim.website_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Visit site</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-ink-2">Claimed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 mx-auto max-w-4xl px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.015em] mb-12 text-center">
          How it works
        </h2>
        <ol className="space-y-10">
          {[
            {
              step: "1",
              title: "Pick your spot and size",
              desc: "Twenty spots across the lid, the inside and the accessories. Larger spots cost more — the marquee and banner positions are premium.",
            },
            {
              step: "2",
              title: "Claim it at the listed price",
              desc: "Pay the fixed price for your chosen spot. No auctions, no bidding — just claim the spot you want.",
            },
            {
              step: "3",
              title: "Your sticker rides along",
              desc: "I print your logo as a quality die-cut vinyl sticker. It shows on this page immediately, and on the real MacBook within days.",
            },
          ].map((item) => (
            <li key={item.step} className="flex gap-5">
              <div className="w-8 h-8 bg-ink text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-ink-2 leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* What the money buys */}
      <section id="specs" className="scroll-mt-20 bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.015em] mb-2 text-center">
            What the money buys.
          </h2>
          <p className="text-ink-2 text-center mb-10">Here are the exact specs.</p>
          <div className="bg-white rounded-2xl p-8 border border-hairline">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-ink-2 mb-1">MacBook</div>
                  <div className="font-semibold">MacBook Air 13″ M5, 512 GB, Starlight</div>
                  <div className="text-2xl font-bold mt-1">$1,580</div>
                </div>
                <div>
                  <div className="text-sm text-ink-2 mb-1">Magic Mouse</div>
                  <div className="font-medium">Multi-Touch Magic Mouse (Starlight) — $89</div>
                </div>
                <div>
                  <div className="text-sm text-ink-2 mb-1">Sticker printing</div>
                  <div className="font-medium">Die-cut vinyl stickers for every spot — $20</div>
                </div>
                <div>
                  <div className="text-sm text-ink-2 mb-1">Payment fees</div>
                  <div className="font-medium">Dodo Payments — starting at 4% + 40¢ per spot (est. ~$78)</div>
                </div>
              </div>
              <div className="space-y-0">
                <dl className="divide-y divide-hairline">
                  <div className="flex justify-between py-3">
                    <dt className="text-ink-2">Chip</dt>
                    <dd className="font-medium text-right">Apple M5 — 10-core CPU, 8-core GPU</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-ink-2">Memory</dt>
                    <dd className="font-medium">16 GB unified</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-ink-2">Storage</dt>
                    <dd className="font-medium">512 GB SSD</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-ink-2">Display</dt>
                    <dd className="font-medium">13.6″ Liquid Retina</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-ink-2">Battery</dt>
                    <dd className="font-medium">Up to 18 hours</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-ink-2">Weight</dt>
                    <dd className="font-medium">1.23 kg</dd>
                  </div>
                  <div className="flex justify-between py-3">
                    <dt className="text-ink-2">Color</dt>
                    <dd className="font-medium">Starlight</dd>
                  </div>
                </dl>
              </div>
            </div>
            <p className="text-xs text-ink-2 mt-8">
              Based on the ₹149,900 (~$1,580) MacBook Air 13″ M5 (512 GB) official price.{" "}
              <a
                href="https://www.apple.com/in/macbook-air/"
                className="underline decoration-dotted decoration-hairline underline-offset-4 hover:text-ink"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check the price at Apple
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.015em] mb-8 text-center">
            Questions & Answers
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Is this real?",
                a: "Completely. The MacBook is real, the stickers are real vinyl, and I will travel with it and work with it in public spaces. The only fictional thing is the idea that a laptop lid isn't premium ad inventory.",
              },
              {
                q: "Why this MacBook?",
                a: "I'm a developer and builder. My MacBook goes with me everywhere — cafés, coworking spaces, meetups, and conferences. Your brand gets visibility in the real world, not just on a screen.",
              },
              {
                q: "What do I actually get?",
                a: "Your logo printed as a high-quality die-cut vinyl sticker, placed on the spot you claimed. It shows on this page immediately and on the real MacBook within days of your purchase.",
              },
              {
                q: "How does payment work?",
                a: "Pay the fixed price for your chosen spot via Dodo Payments. No auctions, no bidding — just claim the spot you want at the listed price.",
              },
              {
                q: "Can any brand join?",
                a: "Yes! Whether you're a SaaS startup, a coffee shop, a newsletter, or a personal project — if you want real-world visibility, a spot is yours.",
              },
              {
                q: "Why not just buy the MacBook?",
                a: "That's a fair question. This is about creative marketing and community. Your $25–$240 gets you guaranteed visibility every time I open my laptop in public.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white rounded-xl border border-hairline overflow-hidden"
              >
                <summary className="px-6 py-4 cursor-pointer font-medium flex items-center justify-between hover:bg-surface/50 transition-colors list-none">
                  {item.q}
                  <span className="text-ink-2 group-open:rotate-180 transition-transform text-lg">
                    ▾
                  </span>
                </summary>
                <div className="px-6 pb-4 text-sm text-ink-2 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6 mb-10">
            <div className="w-[72px] h-[72px] bg-hairline rounded-full flex items-center justify-center text-xl font-bold text-ink-2 shrink-0">
              D
            </div>
            <div>
              <p className="font-semibold mb-1">Hey, I&apos;m Dhruva 👋</p>
              <p className="text-sm text-ink-2 leading-relaxed mb-3">
                Building things, shipping projects. This is my MacBook — brands on the lid, logo in hand.
                Questions, or want a spot?{" "}
                <a href="mailto:hello@brandmymacbook.com" className="text-blue hover:underline">
                  email me
                </a>
                .
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2 mb-8">
            <a href="#spots" className="hover:text-ink transition-colors">
              Spots
            </a>
            <a href="#how" className="hover:text-ink transition-colors">
              How it works
            </a>
            <a href="#specs" className="hover:text-ink transition-colors">
              The machine
            </a>
            <a href="#faq" className="hover:text-ink transition-colors">
              FAQ
            </a>
          </nav>
          <p className="text-xs text-ink-2/70">
            Brand My Mac is not affiliated with, endorsed by, or sponsored by Apple Inc. MacBook is a trademark of Apple Inc.
          </p>
        </div>
        <div style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }} />
      </footer>

      {/* Claim Modal */}
      {selectedSpot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setSelectedSpot(null);
            setCheckoutUrl("");
            setCheckoutEmail("");
            setCheckoutLogoUrl("");
          }}
        >
          <div
            className="bg-white rounded-2xl p-7 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-1">
              <span className="text-sm text-ink-2">
                Spot {selectedSpot.id} · {selectedSpot.size}
              </span>
              <button
                onClick={() => {
                  setSelectedSpot(null);
                  setCheckoutUrl("");
                  setCheckoutEmail("");
                  setCheckoutLogoUrl("");
                }}
                className="text-ink-2 hover:text-ink text-xl leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-4">{selectedSpot.desc}</h3>
            <p className="text-sm text-ink-2 leading-relaxed mb-5">
              Fixed price for this spot. Drop your site URL, email, and logo, pay — your sticker is applied as soon as payment clears.
            </p>

            {/* Price row */}
            <div className="bg-surface rounded-xl px-5 py-3.5 flex items-center justify-between mb-4">
              <span className="text-sm text-ink-2">Price</span>
              <span className="text-2xl font-bold tracking-tight">${selectedSpot.price}</span>
            </div>

            {/* Website URL input */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                required
                value={checkoutUrl}
                onChange={(e) => setCheckoutUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full border border-hairline rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              />
            </div>

            {/* Email ID input */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                Email ID
              </label>
              <input
                type="email"
                required
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-hairline rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              />
            </div>

            {/* Logo URL input */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-ink-2 mb-1.5">
                Logo URL
              </label>
              <input
                type="url"
                value={checkoutLogoUrl}
                onChange={(e) => setCheckoutLogoUrl(e.target.value)}
                placeholder="https://yoursite.com/logo.png"
                className="w-full border border-hairline rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all"
              />
            </div>

            {/* Pay button */}
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-ink text-white py-3.5 rounded-2xl font-semibold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              {checkoutLoading ? "Redirecting..." : `Pay $${selectedSpot.price} – claim this spot`}
            </button>

            <p className="text-xs text-ink-2 text-center mt-3.5">Secure checkout via Dodo Payments.</p>
          </div>
        </div>
      )}
    </main>
  );
}
