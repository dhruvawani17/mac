"use client";

export function SpecsSection() {
  const specs = [
    { label: "Chip", value: "Apple M5 chip with 10-core CPU, up to 10-core GPU, and built-in Neural Accelerator" },
    { label: "Unified Memory", value: "16GB unified memory (configurable up to 32GB)" },
    { label: "Storage", value: "512GB ultra-fast SSD (configurable up to 4TB)" },
    { label: "Display", value: "13.6-inch Liquid Retina display, 500 nits, P3 wide color, True Tone (1 billion colors)" },
    { label: "Finish", value: "Starlight anodized aluminium unibody (also available in Sky Blue, Silver, Midnight)" },
    { label: "Camera & Audio", value: "12MP Center Stage camera with Desk View, three-mic array, Spatial Audio with Dolby Atmos" },
    { label: "Connectivity", value: "Apple N1 wireless chip with Wi-Fi 7 and Bluetooth 6" },
    { label: "Ports", value: "MagSafe 3 charging, two Thunderbolt 4 ports, 3.5 mm headphone jack (supports dual external displays)" },
    { label: "Dimensions & Weight", value: "Under 1.15 cm thin · 1.23 kg (2.71 lb) · Fanless silent design" },
    { label: "Battery & Charging", value: "Up to 18 hours battery life · Fast charge up to 50% in ~30 minutes" },
    { label: "Platform & OS", value: "macOS Tahoe with Liquid Glass, reimagined Spotlight & built-in Apple Intelligence" },
    { label: "Keyboard & Security", value: "Backlit Magic Keyboard with Touch ID, Force Touch trackpad" },
  ];

  return (
    <section id="specs" className="scroll-mt-20 py-16 md:py-24 bg-white border-t border-hairline">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-2 mb-3">
            <span>Official Industrial Design Specifications</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
            MacBook Air 13-inch · M5
          </h2>
          <p className="text-sm text-ink-2 mt-2 max-w-md mx-auto">
            Engineered with the next-generation Apple Silicon M5 architecture in a razor-thin fanless Starlight aluminium chassis.
          </p>
        </div>

        <div className="rounded-3xl border border-hairline bg-surface/40 p-6 sm:p-10 shadow-sm">
          <dl className="divide-y divide-hairline/80">
            {specs.map((item) => (
              <div key={item.label} className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-4">
                <dt className="text-sm font-semibold text-ink-2">{item.label}</dt>
                <dd className="sm:col-span-2 text-sm font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
