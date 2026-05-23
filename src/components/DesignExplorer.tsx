/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CmsDatabase, GlobalSettings } from '../types';
import { 
  Palette, 
  Type, 
  Layout, 
  Check, 
  Sparkles, 
  Sliders, 
  Maximize2, 
  RotateCcw, 
  Monitor, 
  Cpu, 
  CheckCircle, 
  Hash, 
  Star, 
  Eye, 
  Info,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DesignExplorerProps {
  cmsDb: CmsDatabase;
  setCmsDb: React.Dispatch<React.SetStateAction<CmsDatabase>>;
  currentLocale: string;
}

interface ThemePreset {
  id: string;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  bgHex: string;
  surfaceHex: string;
  borderHex: string;
  contrastVibe: string;
  description: string;
}

interface FontPreset {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  vibe: string;
  headingDesc: string;
  bodyDesc: string;
}

interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  heroLayout: "centered" | "left" | "right";
  stickyHeader: boolean;
  ctaStyle: "primary" | "secondary" | "outline";
}

export default function DesignExplorer({ cmsDb, setCmsDb, currentLocale }: DesignExplorerProps) {
  const [activeArea, setActiveArea] = useState<"colors" | "fonts" | "layouts" | "css">("colors");
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [localCss, setLocalCss] = useState<string>(cmsDb.globalSettings.customCss || "");

  // 1. Color Themes
  const themes: ThemePreset[] = [
    {
      id: "elegant-dark",
      name: "Elegant Dark (Active)",
      tagline: "GitHub-Inspired Professional",
      primaryColor: "#58A6FF",
      secondaryColor: "#30363D",
      bgHex: "#0D1117",
      surfaceHex: "#161B22",
      borderHex: "#30363D",
      contrastVibe: "High Contrast Eye-Safe Slate",
      description: "Default developer workspace style using cool slate, deep blue links, dark ash layouts, and dense borders."
    },
    {
      id: "tokyo-neon",
      name: "Tokyo Neon",
      tagline: "Vibrant Night Cyberpunk",
      primaryColor: "#FF007F",
      secondaryColor: "#00FFFF",
      bgHex: "#08090C",
      surfaceHex: "#11141A",
      borderHex: "#222733",
      contrastVibe: "Hyper Glowing Vivid Pink & Cyan",
      description: "Infuses bright electric magenta, vibrant teal accents, and deep obsidian blocks for a modern high-adrenaline brand look."
    },
    {
      id: "swiss-architect",
      name: "Nordic Clean Alabaster",
      tagline: "Minimalist Light Architecture",
      primaryColor: "#0F4C3A",
      secondaryColor: "#7846C4",
      bgHex: "#F9F9FB",
      surfaceHex: "#FFFFFC",
      borderHex: "#E5E5EB",
      contrastVibe: "Clean, Warm High-Contrast Light Theme",
      description: "Sleek alpine off-whites and dark forest greens paired with elegant margins and sophisticated corporate lines."
    },
    {
      id: "deep-sea",
      name: "Pacific Deep Cobalt",
      tagline: "Oceanic Prestige",
      primaryColor: "#0EA5E9",
      secondaryColor: "#F43F5E",
      bgHex: "#0F172A",
      surfaceHex: "#1E293B",
      borderHex: "#334155",
      contrastVibe: "Deep Sapphire and Rose highlights",
      description: "Clean enterprise blue, dark slate cards, polished roundings, and rich rose accents designed for web app catalogs."
    },
    {
      id: "golden-ochre",
      name: "Imperial Solar Amber",
      tagline: "Warm Executive Elegance",
      primaryColor: "#F59E0B",
      secondaryColor: "#10B981",
      bgHex: "#1C1917",
      surfaceHex: "#292524",
      borderHex: "#44403C",
      contrastVibe: "Warm Amber, Gold and Forest Accents",
      description: "Rich organic gold paired with warm stone and deep forest highlights to evoke security, warmth, and high luxury content."
    }
  ];

  // 2. Font Pairings
  const fonts: FontPreset[] = [
    {
      id: "space-inter",
      name: "Space Grotesk + Inter",
      headingFont: "Space Grotesk",
      bodyFont: "Inter",
      vibe: "Tech Modernism & Geometric Authority",
      headingDesc: "Geometric, expressive Display cuts for commanding tech banners",
      bodyDesc: "Extremely legible Swiss-inspired body text with perfect neutral breathing spaces"
    },
    {
      id: "inter-mono",
      name: "Inter + SFMono Regular",
      headingFont: "Inter",
      bodyFont: "SFMono-Regular",
      vibe: "Developer-First & High-Information Rigor",
      headingDesc: "Clean contemporary sans-serif sans display curves",
      bodyDesc: "Technical mono-spaced spacing perfect for technical code, details, and metadata"
    },
    {
      id: "playfair-inter",
      name: "Playfair Display + Inter",
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      vibe: "Prestige Editorial & Luxury Narrative",
      headingDesc: "Elegant high-contrast serifs that evoke curated high-end content",
      bodyDesc: "Polished neutral reading copy that provides sharp modern contrast"
    },
    {
      id: "grotesk-mono",
      name: "Space Grotesk + SFMono-Regular",
      headingFont: "Space Grotesk",
      bodyFont: "SFMono-Regular",
      vibe: "Brutalist Developer Indie",
      headingDesc: "Punchy geometric headlines that stand out in cold-starts",
      bodyDesc: "Pure terminal mono-spaced body styling for a high-integrity layout feel"
    }
  ];

  // 3. Layout Options
  const layouts: LayoutPreset[] = [
    {
      id: "centered-clean",
      name: "Centered Modern Symmetric",
      description: "Focuses attention in the exact visual center of the browser, utilizing generous negative margins and balanced sections.",
      heroLayout: "centered",
      stickyHeader: true,
      ctaStyle: "primary"
    },
    {
      id: "left-heavy",
      name: "Asymmetric Split Left Heavy",
      description: "Places text elements securely on the left sidebar axis, leaving the right side wide-open for high-definition media frames.",
      heroLayout: "left",
      stickyHeader: true,
      ctaStyle: "secondary"
    },
    {
      id: "right-accent",
      name: "Asymmetric Split Right-Aligned",
      description: "Slightly less common alignment pairing often reserved for luxury portfolios or creative digital showcases.",
      heroLayout: "right",
      stickyHeader: false,
      ctaStyle: "outline"
    }
  ];

  const handleApplyTheme = (preset: ThemePreset) => {
    // Modify globalSettings primary and secondary colors in cmsDb
    const updatedSettings: GlobalSettings = {
      ...cmsDb.globalSettings,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      lastUpdatedAt: new Date().toISOString()
    };

    // Update index.css custom properties visually on-the-fly?
    // Since App reads variables from State, setting state updates SitePreview!
    setCmsDb({
      ...cmsDb,
      globalSettings: updatedSettings
    });

    // Notify user
    setAppliedNotification(`Applied Theme Palette: **${preset.name}** is now driving the Live connected site!`);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  const handleApplyFonts = (preset: FontPreset) => {
    const updatedSettings: GlobalSettings = {
      ...cmsDb.globalSettings,
      fontHeading: preset.headingFont,
      fontBody: preset.bodyFont,
      lastUpdatedAt: new Date().toISOString()
    };

    setCmsDb({
      ...cmsDb,
      globalSettings: updatedSettings
    });

    setAppliedNotification(`Applied Typography Pairing: Heading is now **${preset.headingFont}** & Body is **${preset.bodyFont}**!`);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  const handleApplyLayout = (preset: LayoutPreset) => {
    // Mutate first homepage section to match alignment, and header menus
    const pages = cmsDb.pages.map(page => {
      if (page.id === "page-home") {
        const sections = page.sections.map(sec => {
          if (sec.type === "hero") {
            return {
              ...sec,
              layout: preset.heroLayout
            };
          }
          return sec;
        });
        return {
          ...page,
          sections
        };
      }
      return page;
    });

    // Navigation styles
    const navigation = {
      ...cmsDb.navigation,
      stickyHeader: preset.stickyHeader,
      ctaStyle: preset.ctaStyle,
      lastUpdatedAt: new Date().toISOString()
    };

    setCmsDb({
      ...cmsDb,
      pages,
      navigation
    });

    setAppliedNotification(`Applied Layout Matrix: Hero is aligned **${preset.heroLayout}** & Sticky Header is ${preset.stickyHeader ? "Enabled" : "Disabled"}.`);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  return (
    <div className="space-y-6" id="design-theme-explorer-container">
      
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <span className="p-1 rounded bg-blue-900/40 text-blue-400 font-mono text-[10px] uppercase font-bold tracking-wider">
            Curated Presets Library
          </span>
          <h2 className="text-lg font-bold text-slate-100 font-heading flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-500 animate-none" />
            <span>Core UI Presets & Design Options</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Review of different aesthetic permutations. Toggle and apply color combinations, typography pair structures, and block layouts directly to witness real-time schema rendering changes.
          </p>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800" id="design-area-nav">
          <button
            onClick={() => setActiveArea("colors")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition ${
              activeArea === "colors" ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colors ({themes.length})</span>
          </button>
          <button
            onClick={() => setActiveArea("fonts")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition ${
              activeArea === "fonts" ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Fonts ({fonts.length})</span>
          </button>
          <button
            onClick={() => setActiveArea("layouts")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition ${
              activeArea === "layouts" ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Layouts ({layouts.length})</span>
          </button>
          <button
            onClick={() => setActiveArea("css")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition ${
              activeArea === "css" ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Custom CSS</span>
          </button>
        </div>
      </div>

      {appliedNotification && (
        <div className="bg-emerald-950/80 border border-emerald-900 text-emerald-400 p-3.5 rounded-lg text-xs flex items-center gap-2.5 animate-bounce">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* CORE OPTIONS WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: Interactive preseters list */}
        <div className="lg:col-span-8 space-y-4">
          
          <AnimatePresence mode="wait">
            {activeArea === "colors" && (
              <motion.div 
                key="colors" 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                id="design-palette-cards-grid"
              >
                {themes.map(p => {
                  const isActive = cmsDb.globalSettings.primaryColor === p.primaryColor && cmsDb.globalSettings.secondaryColor === p.secondaryColor;
                  return (
                    <div 
                      key={p.id}
                      className={`p-5 rounded-xl border transition-all flex flex-col justify-between h-full bg-slate-900 shadow-sm ${
                        isActive 
                          ? 'border-blue-500/80 ring-1 ring-blue-500/30' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-550 font-bold block">
                              {p.tagline}
                            </span>
                            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                              {p.name}
                              {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            </h4>
                          </div>
                          
                          {/* Circle swatches block */}
                          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-full border border-slate-850">
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-800 block shadow-inner" style={{ backgroundColor: p.primaryColor }} title={`Primary: ${p.primaryColor}`}></span>
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-800 block shadow-inner" style={{ backgroundColor: p.secondaryColor }} title={`Secondary: ${p.secondaryColor}`}></span>
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-800 block shadow-inner" style={{ backgroundColor: p.bgHex }} title={`Background: ${p.bgHex}`}></span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{p.description}</p>
                        
                        <div className="bg-slate-950 p-2.5 rounded border border-slate-850 space-y-1.5 text-[10px] font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-550">Contrast Vibe</span>
                            <span className="text-slate-300 font-bold">{p.contrastVibe}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-550">Branding Primary</span>
                            <span className="text-blue-400 font-bold font-mono">{p.primaryColor}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyTheme(p)}
                        className={`w-full mt-4 py-2 px-3 rounded-lg text-[11px] font-bold tracking-wider font-mono transition text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                          isActive 
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' 
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-850'
                        }`}
                      >
                        {isActive ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                        <span>{isActive ? "Theme Active & Deployed" : "Apply to Connected Frontend"}</span>
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeArea === "fonts" && (
              <motion.div 
                key="fonts" 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
                id="design-font-cards-list"
              >
                {fonts.map(p => {
                  const isActive = cmsDb.globalSettings.fontHeading === p.headingFont && cmsDb.globalSettings.fontBody === p.bodyFont;
                  return (
                    <div 
                      key={p.id}
                      className={`p-5 rounded-xl border bg-slate-900 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                        isActive 
                          ? 'border-blue-500/80 ring-1 ring-blue-500/30 font-bold' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-3 max-w-xl flex-grow">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-550 font-bold block">
                            {p.vibe}
                          </span>
                          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                            {p.name}
                            {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </h4>
                        </div>
                        
                        {/* Live typings visual guide previews */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950 p-3 rounded border border-slate-850">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-mono text-slate-550 block">Heading Class</span>
                            <span className="text-xs text-slate-200 block font-heading truncate">{p.headingFont} Title Cut</span>
                            <span className="text-[9.5px] text-slate-500 font-sans block">{p.headingDesc}</span>
                          </div>
                          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-850 pt-2 md:pt-0 md:pl-3">
                            <span className="text-[9px] uppercase font-mono text-slate-550 block">Body Copy Family</span>
                            <span className="text-xs text-slate-200 block font-sans truncate">{p.bodyFont} Regular</span>
                            <span className="text-[9.5px] text-slate-500 font-sans block">{p.bodyDesc}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyFonts(p)}
                        className={`py-2.5 px-4 rounded-lg text-[11px] font-bold tracking-wider font-mono transition text-center cursor-pointer flex-shrink-0 flex items-center justify-center gap-1.5 ${
                          isActive 
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' 
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-850'
                        }`}
                      >
                        {isActive ? <Check className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5 text-blue-400" />}
                        <span>{isActive ? "Active Pairing" : "Set Fonts"}</span>
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeArea === "layouts" && (
              <motion.div 
                key="layouts" 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
                id="design-layout-cards-list"
              >
                {layouts.map(p => {
                  const matchingHero = cmsDb.pages.find(pg => pg.id === "page-home")?.sections.some(sec => sec.type === "hero" && sec.layout === p.heroLayout);
                  const matchingNav = cmsDb.navigation.stickyHeader === p.stickyHeader;
                  const isActive = matchingHero && matchingNav;

                  return (
                    <div 
                      key={p.id}
                      className={`p-5 rounded-xl border bg-slate-900 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                        isActive 
                          ? 'border-blue-500/80 ring-1 ring-blue-500/30' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2.5 max-w-xl">
                        <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                          {p.name}
                          {isActive && <span className="bg-emerald-950 text-emerald-450 border border-emerald-900 text-[9px] px-2 py-0.5 rounded font-bold uppercase">Applied</span>}
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{p.description}</p>
                        
                        <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                          <span>Hero: <strong className="text-slate-300 uppercase">{p.heroLayout} ALIGN</strong></span>
                          <span>Sticky Nav: <strong className="text-slate-300">{p.stickyHeader ? "YES" : "NO"}</strong></span>
                          <span>CTA Theme: <strong className="text-slate-300">{p.ctaStyle}</strong></span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyLayout(p)}
                        className={`py-2 px-3.5 rounded-lg text-[11px] font-bold tracking-wider font-mono transition text-center cursor-pointer flex-shrink-0 flex items-center justify-center gap-1.5 ${
                          isActive 
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30' 
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-850'
                        }`}
                      >
                        {isActive ? <Check className="w-3.5 h-3.5" /> : <Layout className="w-3.5 h-3.5 text-blue-400" />}
                        <span>{isActive ? "Active Matrix" : "Align Sections"}</span>
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeArea === "css" && (
              <motion.div 
                key="css" 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-sm space-y-5"
                id="design-custom-css-panel"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-850 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-400" />
                      <span>Global CSS Stylesheet override Console</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Inject raw stylesheet rules to customize layout classes inside the <strong>Live Website Preview</strong> dynamically.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLocalCss("");
                        const updated = {
                          ...cmsDb.globalSettings,
                          customCss: "",
                          lastUpdatedAt: new Date().toISOString()
                        };
                        setCmsDb({ ...cmsDb, globalSettings: updated });
                        setAppliedNotification("Custom CSS completely cleared!");
                        setTimeout(() => setAppliedNotification(null), 3500);
                      }}
                      className="px-3 py-1.5 rounded bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-slate-100 transition cursor-pointer"
                    >
                      Clear File
                    </button>
                    <button
                      onClick={() => {
                        const updated = {
                          ...cmsDb.globalSettings,
                          customCss: localCss,
                          lastUpdatedAt: new Date().toISOString()
                        };
                        setCmsDb({ ...cmsDb, globalSettings: updated });
                        setAppliedNotification("Successfully compiled custom stylesheet! Live preview updated.");
                        setTimeout(() => setAppliedNotification(null), 3500);
                      }}
                      className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-[10px] font-mono font-bold text-white transition cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Compile & Save Layout</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* CSS Editor Sheet */}
                  <div className="lg:col-span-8 space-y-2">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">Stylesheet editor (.css)</label>
                    <div className="relative rounded-lg overflow-hidden border border-slate-800 text-xs font-mono bg-slate-950">
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-900 border-r border-slate-800 text-slate-500 flex flex-col items-center pt-3 select-none text-[10px] space-y-1 text-right pr-2">
                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span>
                      </div>
                      <textarea
                        value={localCss}
                        onChange={(e) => setLocalCss(e.target.value)}
                        placeholder="/* Type custom CSS selectors here... */"
                        className="w-full h-80 pl-11 pr-4 py-3 bg-transparent text-slate-200 resize-none focus:outline-none focus:ring-0 custom-scrollbar leading-relaxed font-mono"
                        spellCheck="false"
                      />
                    </div>
                  </div>

                  {/* Preloaded Overrides Palette */}
                  <div className="lg:col-span-4 space-y-3">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block font-bold">Recommended presets</label>
                    
                    <div className="space-y-2 select-none" id="css-presets-grid-shadow">
                      <button
                        onClick={() => {
                          const snippet = `\n/* 🔴 Rounded Pill Triggers */\n.preview-btn-primary {\n  border-radius: 9999px !important;\n  padding-left: 2rem !important;\n  padding-right: 2rem !important;\n  letter-spacing: 0.05em;\n  transition: all 0.3s ease-out !important;\n}\n\n.preview-btn-secondary {\n  border-radius: 9999px !important;\n}`;
                          setLocalCss(prev => prev + snippet);
                          setAppliedNotification("Appended snippet: Pill Buttons! Be sure to click 'Compile' to activate on preview.");
                          setTimeout(() => setAppliedNotification(null), 3000);
                        }}
                        className="w-full text-left p-2.5 rounded hover:bg-slate-850 bg-slate-950 border border-slate-850 hover:border-slate-850 text-[11px] font-mono text-slate-300 transition flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-bold text-blue-400">💊 Pills Buttons</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Add</span>
                      </button>

                      <button
                        onClick={() => {
                          const snippet = `\n/* 🟢 Custom Card Scales */\n.preview-custom-card-hover {\n  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s !important;\n}\n.preview-custom-card-hover:hover {\n  transform: translateY(-5px) scale(1.01) !important;\n  border-color: #58A6FF !important;\n  box-shadow: 0 10px 25px -5px rgba(88, 166, 255, 0.1) !important;\n}`;
                          setLocalCss(prev => prev + snippet);
                          setAppliedNotification("Appended snippet: Elevate Cards! Be sure to click 'Compile' to activate on preview.");
                          setTimeout(() => setAppliedNotification(null), 3000);
                        }}
                        className="w-full text-left p-2.5 rounded hover:bg-slate-850 bg-slate-950 border border-slate-850 hover:border-slate-850 text-[11px] font-mono text-slate-300 transition flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-bold text-emerald-400">🎴 Card Hover Elevates</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Add</span>
                      </button>

                      <button
                        onClick={() => {
                          const snippet = `\n/* 🔵 Neon Glow Header Active Banner */\n#custom-site-preview-root header {\n  box-shadow: 0 4px 30px rgba(88, 166, 255, 0.1) !important;\n  border-bottom: 1px solid rgba(88, 166, 255, 0.3) !important;\n  background: rgba(22, 27, 34, 0.95) !important;\n  backdrop-filter: blur(8px);\n}`;
                          setLocalCss(prev => prev + snippet);
                          setAppliedNotification("Appended snippet: Glowing Header! Be sure to click 'Compile' to activate on preview.");
                          setTimeout(() => setAppliedNotification(null), 3000);
                        }}
                        className="w-full text-left p-2.5 rounded hover:bg-slate-850 bg-slate-950 border border-slate-850 hover:border-slate-850 text-[11px] font-mono text-slate-300 transition flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-bold text-indigo-400">✨ Glowing Glass Header</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Add</span>
                      </button>

                      <button
                        onClick={() => {
                          const snippet = `\n/* 🟣 Elegant Gradient Heading Titles */\n#custom-site-preview-root h1 {\n  background: linear-gradient(135deg, #58A6FF, #D2A8FF, #FF7B72) !important;\n  -webkit-background-clip: text !important;\n  -webkit-text-fill-color: transparent !important;\n  filter: drop-shadow(0 2px 8px rgba(88,166,255,0.1));\n}`;
                          setLocalCss(prev => prev + snippet);
                          setAppliedNotification("Appended snippet: Gradient Hero Heading! Be sure to click 'Compile' to activate on preview.");
                          setTimeout(() => setAppliedNotification(null), 3000);
                        }}
                        className="w-full text-left p-2.5 rounded hover:bg-slate-850 bg-slate-950 border border-slate-850 hover:border-slate-850 text-[11px] font-mono text-slate-300 transition flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-bold text-amber-500">🎨 Gradient Hero Headings</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Add</span>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded border border-slate-850 text-[10px] text-slate-500 leading-relaxed font-sans">
                      <span className="text-[11px] block text-slate-400 font-semibold mb-1">Developer Notes:</span>
                      Target classes like <strong className="text-slate-350">.preview-btn-primary</strong>, <strong className="text-slate-350">.preview-custom-card-hover</strong>, or <strong className="text-slate-350">header, h1, p</strong> inside the live layout scope. Custom style blocks will strictly apply within the live preview container.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COMPONENT: Interactive visual playground mock of elements */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 border-b border-slate-850 pb-2">
            <Maximize2 className="w-4 h-4 text-indigo-400" />
            <span>Interactive Visual previewer</span>
          </h4>

          {/* Micro Card mockup displaying dynamic attributes */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-4 font-sans select-none">
            <div className="flex justify-between items-center text-[9px] text-slate-550 border-b border-slate-900 pb-2 font-mono">
              <span>DESIGN PREVIEW NODE</span>
              <span>100% SCALE</span>
            </div>

            {/* Simulated Hero component inside micro view */}
            <div className="space-y-2 py-2">
              <span className="text-[10px] font-bold inline-block px-2 py-0.5 rounded uppercase" style={{ backgroundColor: `${cmsDb.globalSettings.primaryColor}20`, color: cmsDb.globalSettings.primaryColor, border: `1px solid ${cmsDb.globalSettings.primaryColor}30` }}>
                Demo Badge
              </span>

              <h5 
                className="text-sm font-bold leading-snug tracking-tight text-white"
                style={{
                  fontFamily: cmsDb.globalSettings.fontHeading === "Space Grotesk" ? "Space Grotesk, sans-serif" : "inherit"
                }}
              >
                Building headlessly with custom parameters
              </h5>

              <p 
                className="text-[10px] text-slate-400 leading-normal"
                style={{
                  fontFamily: cmsDb.globalSettings.fontBody === "Space Grotesk" ? "Space Grotesk, sans-serif" : "inherit"
                }}
              >
                Select presets from the left sidebar to change font family rendering and brand tone color variables instantaneously.
              </p>
            </div>

            {/* CTAs element */}
            <div className="flex gap-2">
              <button 
                style={{ backgroundColor: cmsDb.globalSettings.primaryColor }}
                className="text-white text-[10px] font-bold px-3 py-1.5 rounded transition hover:brightness-110 flex-grow shadow-md shadow-blue-900/10"
              >
                Hero Trigger
              </button>
              <button 
                style={{ borderColor: cmsDb.globalSettings.primaryColor, color: cmsDb.globalSettings.primaryColor }}
                className="bg-transparent border text-[10px] font-bold px-3 py-1.5 rounded flex-grow"
              >
                Outline Button
              </button>
            </div>
          </div>

          <div className="bg-indigo-950/20 border border-indigo-900 p-3.5 rounded-lg flex gap-2 text-[10.5px]">
            <Info className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 font-sans text-slate-400 leading-relaxed">
              <strong className="text-indigo-200 font-bold block">Contrast-Compliant Standards</strong>
              <span>Our dynamic theme variables are structured to render using proper luminosity to remain WCAG 2.1 compliance verified across various device dimensions.</span>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-850 font-mono text-[9.5px] leading-relaxed text-slate-500">
            <div className="flex justify-between">
              <span>Primary Engine:</span>
              <span className="text-slate-300 font-bold">Vite 6 / Tailwind CSS v4</span>
            </div>
            <div className="flex justify-between">
              <span>Global Font Family Heading:</span>
              <span className="text-blue-400 font-semibold">{cmsDb.globalSettings.fontHeading}</span>
            </div>
            <div className="flex justify-between">
              <span>Global Font Family Body:</span>
              <span className="text-blue-400 font-semibold">{cmsDb.globalSettings.fontBody}</span>
            </div>
            <div className="flex justify-between">
              <span>Primary Brand Hue:</span>
              <span className="text-slate-350 font-bold">{cmsDb.globalSettings.primaryColor}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
