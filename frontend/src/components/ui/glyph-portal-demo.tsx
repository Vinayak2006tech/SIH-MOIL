"use client";

import { useEffect, useState } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";
import { Sparkles, ArrowRight, Satellite, ShieldCheck, Database, Compass } from "lucide-react";

const settings = { word: "RESERVE", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Glyph Portal Jakarta", Arial, sans-serif';
let fontLoad: Promise<void> | undefined;

export default function GlyphPortalDemo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [face, setFace] = useState<string | null>(null);

  useEffect(() => {
    let settled = false;
    const finish = (value: string) => { if (!settled) { settled = true; setFace(value); } };
    fontLoad ??= new FontFace("Glyph Portal Jakarta", 'url("https://cdn.21st.dev/assets/mirror/15/153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79.woff2")', { weight: "400 700" })
      .load().then((font) => { document.fonts.add(font); });
    const timeout = window.setTimeout(() => finish("Arial, sans-serif"), 1600);
    void fontLoad.then(() => finish(family), () => finish("Arial, sans-serif"));
    return () => { settled = true; clearTimeout(timeout); };
  }, []);

  return (
    <div
      data-demo-scroll
      data-slipstream-demo
      tabIndex={0}
      role="region"
      aria-label="MOIL ReserveIQ Portal. Scroll to step inside."
      style={{
        width: "100%",
        height: "min(720px, 100svh)",
        overflowY: "auto",
        background: "#0F1214",
        containerType: "inline-size",
        fontFamily: face ?? "Arial, sans-serif"
      }}
      className="rounded-3xl border border-[#26333B] shadow-2xl relative overflow-hidden"
    >
      <style>{`
        [data-slipstream-demo] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;}
        [data-slipstream-demo] [data-gp-hint]{display:none;}
        [data-slipstream-demo] [data-gp-enter]{min-height:46px;padding:0 20px;gap:20px;background:linear-gradient(135deg, #6B5B95 0%, #0D9488 100%);border:1px solid #2DD4BF80;border-radius:12px;color:#0F1214;font-size:13px;font-weight:800;box-shadow:0 0 25px rgba(45,212,191,0.3);transition:all .2s;}
        [data-slipstream-demo] [data-gp-enter]:hover{background:linear-gradient(135deg, #7E69AB 0%, #2DD4BF 100%);box-shadow:0 0 35px rgba(45,212,191,0.5);transform:translateY(-1px);}
        [data-slipstream-demo] [data-gp-enter]:focus-visible{outline:2px solid #2DD4BF;outline-offset:4px;}
        [data-slipstream-demo] [data-gp-touch-picker]{top:auto;bottom:18px;left:50%;}
        [data-slipstream-demo] [data-gp-select]{border-color:#26333B;border-radius:8px;font-size:12px;color:#E8E6E3;background:#161D22;}
        [data-sublime-header]{position:absolute;inset:clamp(24px,4.5cqw,48px) clamp(24px,5cqw,64px) auto;display:flex;align-items:center;justify-content:space-between;gap:20px;}
        [data-sublime-logo]{font-size:18px;font-weight:900;letter-spacing:-.04em;color:#E8E6E3;}
        [data-sublime-category]{font-size:12px;line-height:1.5;color:#94A3B8;font-family:ui-monospace,monospace;}
        [data-sublime-eyebrow]{position:absolute;inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);margin:0;text-align:center;font-size:13px;font-weight:600;line-height:1.5;letter-spacing:.08em;color:#2DD4BF;text-transform:uppercase;}
        [data-sublime-support]{position:absolute;inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;margin:0;text-align:center;font-size:15px;font-weight:500;line-height:1.5;color:#94A3B8;}
        [data-sublime-scroll]{position:absolute;inset:auto 24px 7%;text-align:center;color:#94A3B8;font-size:11px;letter-spacing:.05em;font-family:ui-monospace,monospace;}
        @media(any-pointer:coarse){[data-sublime-scroll]{bottom:13%;}}
        @container(max-width:450px){[data-sublime-category]{max-width:14ch;text-align:right;}[data-sublime-eyebrow]{font-size:11px;}[data-sublime-support]{font-size:13px;}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 76px);}}
        @container(max-height:479px){[data-sublime-header]{top:18px;}[data-sublime-support]{top:calc(var(--gp-word-bottom,50%) + 16px);}[data-slipstream-demo] [data-gp-caption]{top:calc(var(--gp-word-bottom,50%) + 60px);}[data-sublime-scroll]{display:none;}}
        [data-slipstream-demo] [data-gp-content]{padding:5.5rem clamp(1.25rem,5cqw,5rem) 6.5rem;font-family:inherit;}
        [data-slipstream-demo] section,[data-slipstream-demo] [data-gp-caption]{font-family:inherit;}
        [data-slipstream-copy]{display:flex;width:min(100%,80rem);margin:auto;flex-direction:column;align-items:flex-start;gap:clamp(2rem,5svh,3.5rem);}
        [data-slipstream-copy] h2{max-width:48rem;margin:0;color:#E8E6E3;font-size:clamp(1.75rem,1.1rem + 2.1cqw,2.5rem);font-weight:800;line-height:1.2;letter-spacing:-.02em;text-wrap:balance;}
        [data-slipstream-features]{display:grid;width:100%;grid-template-columns:1fr;gap:1.75rem;}
        [data-slipstream-feature]{border-top:1px solid rgba(45,212,191,0.25);padding-top:1.2rem;background:rgba(22,29,34,0.6);padding:1.25rem;border-radius:1rem;border:1px solid #26333B;}
        [data-slipstream-feature] h3{margin:0;color:#E8E6E3;font-size:1.125rem;font-weight:700;line-height:1.2;display:flex;align-items:center;gap:0.5rem;}
        [data-slipstream-feature] p{margin:.55rem 0 0;color:#94A3B8;font-size:.9375rem;line-height:1.55;}
        [data-slipstream-no]{display:inline-block;color:#2DD4BF;font:700 .75rem ui-monospace,monospace;letter-spacing:.08em;}
        @container(min-width:768px){[data-slipstream-features]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.5rem;}}
      `}</style>
      {face ? (
        <GlyphPortal
          word={s.word}
          fontFamily={face}
          fontWeight={900}
          style={{
            fontFamily: face,
            "--gp-paper": "#0F1214",
            "--gp-ink": "#E8E6E3",
            "--gp-field": "#161D22",
            "--gp-foreground": "#E8E6E3"
          }}
          scrollLength={s.scrollLength}
          interactive={s.interactive}
          annotations={s.annotations}
          enterLabel="Enter Subsurface Vault"
          background={
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(to bottom, rgba(15, 18, 20, 0.75), rgba(22, 29, 34, 0.95)), url('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: "scale(var(--gp-field-scale,1))"
              }}
            />
          }
          front={
            <>
              <div data-sublime-header>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B5B95] to-[#2DD4BF] flex items-center justify-center text-[#0F1214] font-black text-xs">
                    IQ
                  </div>
                  <span data-sublime-logo>MOIL ReserveIQ</span>
                </div>
                <span data-sublime-category className="flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5 text-[#2DD4BF]" /> ESA Sentinel-2 Telemetry
                </span>
              </div>
              <p data-sublime-eyebrow>Geostatistical 3D Kriging Engine</p>
              <p data-sublime-support>Step inside live UNFC 111 manganese reserves & ore strata.</p>
              <span data-sublime-scroll>Scroll down into live typography ↓</span>
            </>
          }
        >
          <div data-slipstream-copy>
            <h2>Sub-Surface Mineral Kriging & Telemetry Ingestion</h2>
            <div data-slipstream-features>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>01</span>
                  <Database className="w-4 h-4 text-[#2DD4BF]" />
                  Borehole Assay Fusion
                </h3>
                <p>Geological interpolation fusing 64+ sub-surface diamond drill cores with real-time strip ratios across 10 active mines.</p>
              </div>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>02</span>
                  <Satellite className="w-4 h-4 text-[#2DD4BF]" />
                  Sentinel-2 Multi-Spectral
                </h3>
                <p>Copernicus orbital reflectance tracking surface bench NDVI clearance and precipitation ingress before mine dispatch.</p>
              </div>
              <div data-slipstream-feature>
                <h3>
                  <span data-slipstream-no>03</span>
                  <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
                  UNFC 111 Certification
                </h3>
                <p>Statutory alignment with Indian Bureau of Mines (IBM) National Mineral Inventory (NMI) verification guidelines.</p>
              </div>
            </div>
          </div>
        </GlyphPortal>
      ) : (
        <div role="status" style={{ height: "100%", display: "grid", placeItems: "center", color: "#94A3B8", fontSize: 13, fontFamily: "ui-monospace, monospace" }}>
          Loading MOIL Subsurface Typography…
        </div>
      )}
    </div>
  );
}
