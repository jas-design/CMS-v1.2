/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CmsDatabase, 
  GlobalSettings, 
  Navigation, 
  Page, 
  Section, 
  Post, 
  Author, 
  Testimonial, 
  FaqItem, 
  Product, 
  Form, 
  Redirect, 
  Role,
  Localized,
  NavItem
} from '../types';
import { 
  Settings, 
  Compass, 
  FileText, 
  ShoppingBag, 
  BookOpen, 
  MessageSquare, 
  HelpCircle, 
  Users, 
  Terminal, 
  Layers, 
  Plus, 
  Trash, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  MoveUp, 
  MoveDown,
  Globe,
  PlusCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Shield,
  Shuffle
} from 'lucide-react';

interface CmsConsoleProps {
  cmsDb: CmsDatabase;
  setCmsDb: React.Dispatch<React.SetStateAction<CmsDatabase>>;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
}

type CmsTab = 
  | "globalSettings" 
  | "navigation" 
  | "pages" 
  | "products" 
  | "posts" 
  | "testimonials" 
  | "faqs" 
  | "forms" 
  | "redirects" 
  | "roles"
  | "authors";

const tabMetadata: Record<CmsTab, { label: string; icon: React.ComponentType<any>; color: string }> = {
  globalSettings: { label: "Global Settings", icon: Settings, color: "text-blue-500" },
  navigation: { label: "Navigation Menus", icon: Compass, color: "text-emerald-500" },
  pages: { label: "Page Manager", icon: Layers, color: "text-indigo-500" },
  products: { label: "Product Catalog", icon: ShoppingBag, color: "text-amber-500" },
  posts: { label: "Insights / Blog", icon: BookOpen, color: "text-pink-500" },
  testimonials: { label: "Testimonials", icon: MessageSquare, color: "text-rose-500" },
  faqs: { label: "FAQ Center", icon: HelpCircle, color: "text-teal-500" },
  forms: { label: "Lead Captures", icon: FileText, color: "text-cyan-500" },
  redirects: { label: "URL Redirects", icon: Shuffle, color: "text-purple-500" },
  roles: { label: "Roles & Scopes", icon: Shield, color: "text-violet-500" },
  authors: { label: "Team Members", icon: Users, color: "text-fuchsia-500" }
};

export default function CmsConsole({ cmsDb, setCmsDb, currentLocale, setCurrentLocale }: CmsConsoleProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState<CmsTab>("globalSettings");
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeLangMode, setActiveLangMode] = useState<"single" | "all">("all");
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const triggerSaveNotification = (message: string) => {
    setSaveToast(message);
    setTimeout(() => setSaveToast(null), 3000);
  };

  /**
   * Run Real-Time Validation on current Database State
   */
  const validateSchema = (db: CmsDatabase): string[] => {
    const errors: string[] = [];

    // Rule 1: Every image field must include an alt attribute – never empty.
    const checkImagesInObject = (obj: any, path: string) => {
      if (!obj) return;
      if (typeof obj === 'object') {
        if ('url' in obj && typeof obj.url === 'string') {
          if (!('alt' in obj) || typeof obj.alt !== 'string' || obj.alt.trim() === '') {
            errors.push(`Missing image alternative text: Asset at reference "${path}" must define a valid non-empty Alt string for proper SEO.`);
          }
        }
        for (const k of Object.keys(obj)) {
          checkImagesInObject(obj[k], `${path} ➔ ${k}`);
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => checkImagesInObject(item, `${path}[${index}]`));
      }
    };

    checkImagesInObject(db, "Root");

    // Rule 2: Every page must expose a slug, metaTitle, and metaDescription for SEO.
    db.pages.forEach(page => {
      const pageName = page.title["en"] || page.id;
      if (!page.slug || page.slug.trim() === '') {
        errors.push(`Page validation failed: "${pageName}" is missing a valid path slug.`);
      }
      db.globalSettings.locales.forEach(loc => {
        if (!page.metaTitle?.[loc] || page.metaTitle[loc].trim() === '') {
          errors.push(`SEO warning: "${pageName}" is missing page Meta Title for language spec [${loc.toUpperCase()}].`);
        }
        if (!page.metaDescription?.[loc] || page.metaDescription[loc].trim() === '') {
          errors.push(`SEO warning: "${pageName}" is missing page Meta Description for language spec [${loc.toUpperCase()}].`);
        }
      });
    });

    // Rule 3: Products validate SKU and currency
    db.products.forEach(p => {
      if (!p.sku || p.sku.trim() === "") {
        errors.push(`Product schema threat: Product "${p.title["en"] || p.id}" must state a physical SKU reference.`);
      }
      if (!p.price || p.price <= 0) {
        errors.push(`Pricing validation: "${p.title["en"] || p.id}" price is unset or invalid.`);
      }
    });

    // Rule 4: Redirect validation
    db.redirects.forEach(r => {
      if (r.from === r.to) {
        errors.push(`Redirect Loop Alert: Source path "${r.from}" matches target path, causing circular redirects.`);
      }
    });

    return errors;
  };

  const handleUpdate = (updatedDb: CmsDatabase) => {
    const freshDb = {
      ...updatedDb,
      globalSettings: {
        ...updatedDb.globalSettings,
        lastUpdatedAt: new Date().toISOString()
      }
    };
    setCmsDb(freshDb);
    const errors = validateSchema(freshDb);
    setValidationErrors(errors);
  };

  // Helper for localized changes
  const handleLocalizedFieldChange = (
    moduleKey: CmsTab,
    fieldName: string,
    locale: string,
    value: string,
    nestedId?: string
  ) => {
    if (moduleKey === "globalSettings") {
      const field = cmsDb.globalSettings[fieldName as keyof GlobalSettings] as Localized<string>;
      const nextField = { ...field, [locale]: value };
      handleUpdate({
        ...cmsDb,
        globalSettings: {
          ...cmsDb.globalSettings,
          [fieldName]: nextField
        }
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full" id="cms-editor-container">
      {/* LEFT COLUMN: Sidebar Selection */}
      <div className="lg:col-span-3 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm" id="cms-nav-rail">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-slate-800 text-amber-500 font-mono text-xs">CMS Panel</span>
              <h3 className="text-sm font-semibold text-slate-100 font-heading">Content Modules</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">v1.2.0</span>
          </div>

          <div className="space-y-1">
            {(Object.keys(tabMetadata) as CmsTab[]).map(tabKey => {
              const tab = tabMetadata[tabKey];
              const Icon = tab.icon;
              const isActive = activeConsoleTab === tabKey;
              return (
                <button
                  key={tabKey}
                  id={`cms-tab-btn-${tabKey}`}
                  onClick={() => {
                    setActiveConsoleTab(tabKey);
                    setSelectedDocId("");
                  }}
                  className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tabKey === "pages" && (
                    <span className="bg-indigo-950 text-indigo-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-indigo-900">
                      {cmsDb.pages.length}
                    </span>
                  )}
                  {tabKey === "products" && (
                    <span className="bg-amber-950 text-amber-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-amber-900">
                      {cmsDb.products.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Translation Assistant Widgets & Language Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3" id="cms-localization-card">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Language Manager</span>
            </h4>
            <div className="flex gap-1 bg-slate-800/80 rounded p-0.5 text-[10px]">
              <button 
                onClick={() => setActiveLangMode("all")}
                className={`px-1.5 py-0.5 rounded transition ${activeLangMode === "all" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-slate-200"}`}
              >
                All Languages
              </button>
              <button 
                onClick={() => setActiveLangMode("single")}
                className={`px-1.5 py-0.5 rounded transition ${activeLangMode === "single" ? "bg-blue-600 text-white font-medium" : "text-slate-400 hover:text-slate-200"}`}
              >
                Tabs
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed">
            All text fields natively support translation objects. Choose active simulation locale for page rendering:
          </div>

          <div className="grid grid-cols-3 gap-1.5" id="locale-context-toggles">
            {cmsDb.globalSettings.locales.map(loc => {
              const isActive = currentLocale === loc;
              return (
                <button
                  key={loc}
                  id={`locale-btn-${loc}`}
                  onClick={() => setCurrentLocale(loc)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                    isActive
                      ? 'bg-blue-500/10 border-blue-500/80 text-blue-400 font-bold text-xs ring-1 ring-blue-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 text-xs'
                  }`}
                >
                  <span className="uppercase text-[10px] tracking-wider block font-mono">{loc}</span>
                  <span className="text-[9px] text-slate-500">
                    {loc === "en" ? "English" : loc === "fr" ? "Français" : "Português"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-950/30 border border-amber-900/40 p-2 rounded">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>Default locale fallback: <strong>{cmsDb.globalSettings.defaultLocale.toUpperCase()}</strong></span>
          </div>
        </div>

        {/* Validation Errors Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm" id="schema-validator-alerts">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span>Diagnostic Audits</span>
            </h4>
            <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-full ${
              validationErrors.length > 0 
                ? 'bg-amber-950 text-amber-400 border border-amber-900' 
                : 'bg-emerald-950 text-emerald-400 border border-emerald-900'
            }`}>
              {validationErrors.length} notices
            </span>
          </div>

          {validationErrors.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {validationErrors.map((err, i) => (
                <div key={i} className="p-2 rounded bg-slate-950 border-l-2 border-amber-500 text-[10px] text-slate-300 flex gap-1.5 leading-relaxed">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center rounded bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 text-xs font-medium py-4">
              <CheckCircle className="w-6 h-6 mx-auto mb-1.5 text-emerald-500" />
              <span>Perfect validation health. No schema errors detected!</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Console Workspace */}
      <div className="lg:col-span-9">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm min-h-[600px] flex flex-col justify-between" id="cms-editor-viewport">
          <div>
            {/* Top Editor Bar: active heading & actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-6 gap-3">
              <div>
                <span className="text-slate-500 text-[10px] font-mono tracking-widest uppercase">Active Headless Stream</span>
                <h2 className="text-lg font-bold text-slate-100 font-heading">
                  {tabMetadata[activeConsoleTab].label}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const errors = validateSchema(cmsDb);
                    setValidationErrors(errors);
                    triggerSaveNotification("CMS document tree successfully audited and compiled.");
                  }}
                  className="flex items-center gap-1.5 text-xs bg-slate-800 text-slate-200 border border-slate-700 hover:text-white hover:border-slate-600 px-3 py-1.5 rounded-lg font-medium transition"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Validate API</span>
                </button>
                <button
                  onClick={() => {
                    triggerSaveNotification("Content schema successfully synchronized to Cloud API memory.");
                  }}
                  className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg font-medium transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish Drafts</span>
                </button>
              </div>
            </div>

            {/* Content Forms based on module selection */}

            {/* MODULE: Global Settings */}
            {activeConsoleTab === "globalSettings" && (
              <div className="space-y-6" id="editor-globalSettings-module">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Site Name and Logo */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">Identity Settings</h4>
                    
                    {/* Multilingual Site Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300 block">Site Name</label>
                      {activeLangMode === "all" ? (
                        <div className="space-y-2">
                          {cmsDb.globalSettings.locales.map(loc => (
                            <div key={loc} className="flex gap-2">
                              <span className="bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center uppercase w-10">
                                {loc}
                              </span>
                              <input 
                                type="text"
                                value={cmsDb.globalSettings.siteName[loc] || ""}
                                onChange={(e) => {
                                  const name = { ...cmsDb.globalSettings.siteName, [loc]: e.target.value };
                                  handleUpdate({
                                    ...cmsDb,
                                    globalSettings: { ...cmsDb.globalSettings, siteName: name }
                                  });
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 focus:outline-none focus:border-blue-500" 
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <input 
                          type="text"
                          value={cmsDb.globalSettings.siteName[currentLocale] || ""}
                          onChange={(e) => {
                            const name = { ...cmsDb.globalSettings.siteName, [currentLocale]: e.target.value };
                            handleUpdate({
                              ...cmsDb,
                              globalSettings: { ...cmsDb.globalSettings, siteName: name }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 focus:outline-none focus:border-blue-500" 
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300 block">Logo URL</label>
                      <input 
                        type="text"
                        value={cmsDb.globalSettings.logoUrl}
                        onChange={(e) => {
                          handleUpdate({
                            ...cmsDb,
                            globalSettings: { ...cmsDb.globalSettings, logoUrl: e.target.value }
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 focus:outline-none focus:border-blue-500 font-mono" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300 block">Favicon URL</label>
                      <input 
                        type="text"
                        value={cmsDb.globalSettings.faviconUrl}
                        onChange={(e) => {
                          handleUpdate({
                            ...cmsDb,
                            globalSettings: { ...cmsDb.globalSettings, faviconUrl: e.target.value }
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 focus:outline-none focus:border-blue-500 font-mono" 
                      />
                    </div>
                  </div>

                  {/* Themes, colors, fonts */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">styling variables</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300 block">Primary Hex</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={cmsDb.globalSettings.primaryColor}
                            onChange={(e) => {
                              handleUpdate({
                                ...cmsDb,
                                globalSettings: { ...cmsDb.globalSettings, primaryColor: e.target.value }
                              });
                            }}
                            className="bg-transparent border border-slate-800 rounded w-8 h-8 cursor-pointer p-0 block"
                          />
                          <input 
                            type="text"
                            value={cmsDb.globalSettings.primaryColor}
                            onChange={(e) => {
                              handleUpdate({
                                ...cmsDb,
                                globalSettings: { ...cmsDb.globalSettings, primaryColor: e.target.value }
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1 text-slate-100 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300 block">Secondary Hex</label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={cmsDb.globalSettings.secondaryColor}
                            onChange={(e) => {
                              handleUpdate({
                                ...cmsDb,
                                globalSettings: { ...cmsDb.globalSettings, secondaryColor: e.target.value }
                              });
                            }}
                            className="bg-transparent border border-slate-800 rounded w-8 h-8 cursor-pointer p-0 block"
                          />
                          <input 
                            type="text"
                            value={cmsDb.globalSettings.secondaryColor}
                            onChange={(e) => {
                              handleUpdate({
                                ...cmsDb,
                                globalSettings: { ...cmsDb.globalSettings, secondaryColor: e.target.value }
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-1 text-slate-100 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-850">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300 block">Font Heading</label>
                        <select 
                          value={cmsDb.globalSettings.fontHeading}
                          onChange={(e) => handleUpdate({
                            ...cmsDb,
                            globalSettings: { ...cmsDb.globalSettings, fontHeading: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100"
                        >
                          <option value="Space Grotesk">Space Grotesk (Tech)</option>
                          <option value="Inter">Inter (Swiss Modern)</option>
                          <option value="Playfair Display">Playfair Display (Serif)</option>
                          <option value="JetBrains Mono">JetBrains Mono (Console)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300 block">Font Body</label>
                        <select 
                          value={cmsDb.globalSettings.fontBody}
                          onChange={(e) => handleUpdate({
                            ...cmsDb,
                            globalSettings: { ...cmsDb.globalSettings, fontBody: e.target.value }
                          })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100"
                        >
                          <option value="Inter">Inter (Swiss Modern)</option>
                          <option value="Space Grotesk">Space Grotesk</option>
                          <option value="JetBrains Mono">JetBrains Mono</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300 block">Google Analytics ID</label>
                      <input 
                        type="text"
                        value={cmsDb.globalSettings.googleAnalyticsId || ""}
                        onChange={(e) => {
                          handleUpdate({
                            ...cmsDb,
                            globalSettings: { ...cmsDb.globalSettings, googleAnalyticsId: e.target.value }
                          });
                        }}
                        placeholder="G-XXXXXX"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 font-mono focus:outline-none" 
                      />
                    </div>
                  </div>
                </div>

                {/* Localized Default SEO fallback values */}
                <div className="space-y-4" id="localized-seo-defaults">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">SEO Global Defaults</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300 block flex justify-between">
                        <span>Default SEO Title</span>
                        <span className="text-[9px] text-indigo-400">Localized</span>
                      </label>
                      {activeLangMode === "all" ? (
                        <div className="space-y-2">
                          {cmsDb.globalSettings.locales.map(loc => (
                            <div key={loc} className="flex gap-2">
                              <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[10px] uppercase font-mono text-slate-400 w-10 flex items-center justify-center">{loc}</span>
                              <input 
                                type="text"
                                value={cmsDb.globalSettings.defaultMetaTitle[loc] || ""}
                                onChange={(e) => {
                                  const text = { ...cmsDb.globalSettings.defaultMetaTitle, [loc]: e.target.value };
                                  handleUpdate({
                                    ...cmsDb,
                                    globalSettings: { ...cmsDb.globalSettings, defaultMetaTitle: text }
                                  });
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 focus:outline-none" 
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <input 
                          type="text"
                          value={cmsDb.globalSettings.defaultMetaTitle[currentLocale] || ""}
                          onChange={(e) => {
                            const text = { ...cmsDb.globalSettings.defaultMetaTitle, [currentLocale]: e.target.value };
                            handleUpdate({
                              ...cmsDb,
                              globalSettings: { ...cmsDb.globalSettings, defaultMetaTitle: text }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 focus:outline-none" 
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300 block flex justify-between">
                        <span>Default Meta Description</span>
                        <span className="text-[9px] text-indigo-400">Localized</span>
                      </label>
                      {activeLangMode === "all" ? (
                        <div className="space-y-2">
                          {cmsDb.globalSettings.locales.map(loc => (
                            <div key={loc} className="flex gap-2">
                              <span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[10px] uppercase font-mono text-slate-400 w-10 flex items-center justify-center">{loc}</span>
                              <textarea 
                                rows={2}
                                value={cmsDb.globalSettings.defaultMetaDescription[loc] || ""}
                                onChange={(e) => {
                                  const text = { ...cmsDb.globalSettings.defaultMetaDescription, [loc]: e.target.value };
                                  handleUpdate({
                                    ...cmsDb,
                                    globalSettings: { ...cmsDb.globalSettings, defaultMetaDescription: text }
                                  });
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 focus:outline-none" 
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <textarea 
                          rows={3}
                          value={cmsDb.globalSettings.defaultMetaDescription[currentLocale] || ""}
                          onChange={(e) => {
                            const text = { ...cmsDb.globalSettings.defaultMetaDescription, [currentLocale]: e.target.value };
                            handleUpdate({
                              ...cmsDb,
                              globalSettings: { ...cmsDb.globalSettings, defaultMetaDescription: text }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3 py-1.5 text-slate-100 focus:outline-none" 
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Cookie Banner Configuration */}
                <div className="space-y-4 p-4 rounded-lg bg-slate-950 border border-slate-850">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Cookie Compliance Banner</h4>
                      <p className="text-[11px] text-slate-500">Show a localized consent banner on initial site visits.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cmsDb.globalSettings.cookieBannerEnabled}
                        onChange={(e) => {
                          handleUpdate({
                            ...cmsDb,
                            globalSettings: { ...cmsDb.globalSettings, cookieBannerEnabled: e.target.checked }
                          });
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white peer-checked:after:border-white"></div>
                    </label>
                  </div>

                  {cmsDb.globalSettings.cookieBannerEnabled && (
                    <div className="space-y-2 mt-3">
                      <label className="text-xs font-semibold text-slate-400 block">Banner Text Message (Translations)</label>
                      {cmsDb.globalSettings.locales.map(loc => (
                        <div key={loc} className="flex gap-2">
                          <span className="bg-slate-800 text-[9px] uppercase font-mono px-2 py-1.5 rounded flex items-center justify-center w-10 text-slate-400 border border-slate-700">{loc}</span>
                          <input 
                            type="text"
                            value={cmsDb.globalSettings.cookieBannerText[loc] || ""}
                            onChange={(e) => {
                              const cbText = { ...cmsDb.globalSettings.cookieBannerText, [loc]: e.target.value };
                              handleUpdate({
                                ...cmsDb,
                                globalSettings: { ...cmsDb.globalSettings, cookieBannerText: cbText }
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-850 rounded-lg text-xs px-3 py-1 text-slate-200" 
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODULE: Navigation */}
            {activeConsoleTab === "navigation" && (
              <div className="space-y-6" id="editor-navigation-module">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Left panel: List menu items */}
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Header Menu Items</h4>
                      <button
                        onClick={() => {
                          const newItem: NavItem = {
                            label: { en: "New Link", fr: "Nouveau Lien", pt: "Novo Link" },
                            href: "/new-link",
                            openInNewTab: false,
                            children: []
                          };
                          handleUpdate({
                            ...cmsDb,
                            navigation: {
                              ...cmsDb.navigation,
                              items: [...cmsDb.navigation.items, newItem]
                            }
                          });
                        }}
                        className="flex items-center gap-1 text-[11px] bg-slate-800 text-slate-200 hover:text-white px-2 py-1 rounded border border-slate-700"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Link</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {cmsDb.navigation.items.map((item, index) => (
                        <div key={index} className="p-3 rounded-lg bg-slate-950 border border-slate-850 space-y-3">
                          <div className="flex justify-between items-center bg-slate-900/50 p-1.5 rounded">
                            <span className="text-[11px] font-bold text-blue-400 font-mono">Menu Link #{index + 1}</span>
                            <div className="flex items-center gap-1.5">
                              {index > 0 && (
                                <button
                                  onClick={() => {
                                    const nextItems = [...cmsDb.navigation.items];
                                    const temp = nextItems[index];
                                    nextItems[index] = nextItems[index - 1];
                                    nextItems[index - 1] = temp;
                                    handleUpdate({
                                      ...cmsDb,
                                      navigation: { ...cmsDb.navigation, items: nextItems }
                                    });
                                  }}
                                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded"
                                >
                                  <MoveUp className="w-3 h-3" />
                                </button>
                              )}
                              {index < cmsDb.navigation.items.length - 1 && (
                                <button
                                  onClick={() => {
                                    const nextItems = [...cmsDb.navigation.items];
                                    const temp = nextItems[index];
                                    nextItems[index] = nextItems[index + 1];
                                    nextItems[index + 1] = temp;
                                    handleUpdate({
                                      ...cmsDb,
                                      navigation: { ...cmsDb.navigation, items: nextItems }
                                    });
                                  }}
                                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded"
                                >
                                  <MoveDown className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  const items = cmsDb.navigation.items.filter((_, idx) => idx !== index);
                                  handleUpdate({
                                    ...cmsDb,
                                    navigation: { ...cmsDb.navigation, items }
                                  });
                                }}
                                className="p-1 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Label ({currentLocale.toUpperCase()})</label>
                              <input 
                                type="text"
                                value={item.label[currentLocale] || ""}
                                onChange={(e) => {
                                  const nextItems = [...cmsDb.navigation.items];
                                  nextItems[index].label = { ...nextItems[index].label, [currentLocale]: e.target.value };
                                  handleUpdate({
                                    ...cmsDb,
                                    navigation: { ...cmsDb.navigation, items: nextItems }
                                  });
                                }}
                                className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-100" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400">Path Destination</label>
                              <input 
                                type="text"
                                value={item.href}
                                onChange={(e) => {
                                  const nextItems = [...cmsDb.navigation.items];
                                  nextItems[index].href = e.target.value;
                                  handleUpdate({
                                    ...cmsDb,
                                    navigation: { ...cmsDb.navigation, items: nextItems }
                                  });
                                }}
                                className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-100 font-mono" 
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1">
                            <input 
                              type="checkbox"
                              checked={item.openInNewTab}
                              onChange={(e) => {
                                const nextItems = [...cmsDb.navigation.items];
                                nextItems[index].openInNewTab = e.target.checked;
                                handleUpdate({
                                  ...cmsDb,
                                  navigation: { ...cmsDb.navigation, items: nextItems }
                                });
                              }}
                              className="rounded text-blue-600 bg-slate-900 border-slate-850"
                            />
                            <span className="text-[10px] text-slate-400">Open link in a new browser tab</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right panel: CTA action & options */}
                  <div className="md:col-span-2 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">Action Button & UX</h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">CTA Label ({currentLocale.toUpperCase()})</label>
                        <input 
                          type="text"
                          value={cmsDb.navigation.ctaLabel[currentLocale] || ""}
                          onChange={(e) => {
                            const ctaLabel = { ...cmsDb.navigation.ctaLabel, [currentLocale]: e.target.value };
                            handleUpdate({
                              ...cmsDb,
                              navigation: { ...cmsDb.navigation, ctaLabel }
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200" 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">CTA Destination Path</label>
                        <input 
                          type="text"
                          value={cmsDb.navigation.ctaHref}
                          onChange={(e) => {
                            handleUpdate({
                              ...cmsDb,
                              navigation: { ...cmsDb.navigation, ctaHref: e.target.value }
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-200 font-mono" 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400">CTA Style Variant</label>
                        <select 
                          value={cmsDb.navigation.ctaStyle}
                          onChange={(e) => handleUpdate({
                            ...cmsDb,
                            navigation: { ...cmsDb.navigation, ctaStyle: e.target.value as any }
                          })}
                          className="w-full bg-slate-900 border border-slate-850 rounded text-xs px-2 py-1.5 text-slate-200"
                        >
                          <option value="primary">Primary Filled</option>
                          <option value="secondary">Secondary Accent</option>
                          <option value="outline">Border Outline</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-850">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase">Header Layout Directives</h5>
                      
                      <label className="flex items-center gap-2 text-xs text-slate-300">
                        <input 
                          type="checkbox"
                          checked={cmsDb.navigation.stickyHeader}
                          onChange={(e) => handleUpdate({
                            ...cmsDb,
                            navigation: { ...cmsDb.navigation, stickyHeader: e.target.checked }
                          })}
                          className="rounded text-blue-600 border-slate-800 bg-slate-900"
                        />
                        <span>Sticky fixed header on scroll</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-300">
                        <input 
                          type="checkbox"
                          checked={cmsDb.navigation.transparentOnHero}
                          onChange={(e) => handleUpdate({
                            ...cmsDb,
                            navigation: { ...cmsDb.navigation, transparentOnHero: e.target.checked }
                          })}
                          className="rounded text-blue-600 border-slate-800 bg-slate-900"
                        />
                        <span>Transparent header overlay on Hero</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE: Pages / Sitemap */}
            {activeConsoleTab === "pages" && (
              <div className="space-y-6" id="editor-pages-module">
                {/* Visual Pages Selector & Sitemap builder */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Web Routes (Pages)</h4>
                      <button
                        onClick={() => {
                          const newSlug = `/new-route-${cmsDb.pages.length + 1}`;
                          const newId = `page-new-${Date.now().toString().slice(-4)}`;
                          const newPage: Page = {
                            id: newId,
                            title: { en: "Untitled Page", fr: "Page sans titre", pt: "Nova Página" },
                            slug: newSlug,
                            status: "draft",
                            metaTitle: { en: "SEO Title", fr: "SEO Title", pt: "SEO Title" },
                            metaDescription: { en: "SEO Description", fr: "SEO Description", pt: "SEO Description" },
                            ogImage: "",
                            sections: [
                              {
                                type: "hero",
                                headline: { en: "Elevate your Web Core", fr: "Traduire", pt: "Nova Headline" },
                                subheadline: { en: "Describe sub-content clearly here.", fr: "Sub", pt: "Sub" },
                                ctaPrimary: { label: { en: "Button", fr: "Button", pt: "Botão" }, href: "/" },
                                overlayOpacity: 0.5,
                                layout: "centered"
                              }
                            ],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            lastUpdatedAt: new Date().toISOString()
                          };
                          handleUpdate({
                            ...cmsDb,
                            pages: [...cmsDb.pages, newPage]
                          });
                          setSelectedDocId(newId);
                          triggerSaveNotification(`Created draft page: ${newSlug}`);
                        }}
                        className="flex items-center gap-1 text-[10px] bg-indigo-900 border border-indigo-700 hover:bg-indigo-800 text-indigo-100 px-2 py-1 rounded"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Page</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                      {cmsDb.pages.map(page => {
                        const isSelected = selectedDocId === page.id || (!selectedDocId && page.id === "page-home");
                        const name = page.title[currentLocale] || page.title["en"] || page.id;
                        return (
                          <div
                            key={page.id}
                            onClick={() => setSelectedDocId(page.id)}
                            className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                              isSelected 
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-200' 
                                : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-semibold block truncate max-w-32">{name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                                page.status === "published" ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                              }`}>
                                {page.status}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 block mt-1">{page.slug}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Visual Page Metadata & Content Blocks Manager */}
                  <div className="md:col-span-8 space-y-6">
                    {(() => {
                      const activePage = cmsDb.pages.find(p => p.id === selectedDocId) || cmsDb.pages.find(p => p.id === "page-home");
                      if (!activePage) return <div className="text-slate-400 text-sm">Select a page to modify schemas.</div>;

                      return (
                        <div className="space-y-6" id={`visual-page-settings-${activePage.id}`}>
                          {/* Route properties */}
                          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
                            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex justify-between items-center">
                              <span>Page Route Definition [#{activePage.id}]</span>
                              <button
                                onClick={() => {
                                  if (activePage.id === "page-home") {
                                    triggerSaveNotification("Cannot erase primary index homepage page.");
                                    return;
                                  }
                                  const filtered = cmsDb.pages.filter(p => p.id !== activePage.id);
                                  handleUpdate({ ...cmsDb, pages: filtered });
                                  setSelectedDocId("page-home");
                                  triggerSaveNotification("Deleted page draft successfully.");
                                }}
                                className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 bg-rose-950/20 border border-rose-950 px-2 py-1 rounded"
                              >
                                <Trash className="w-3 h-3" />
                                <span>Delete Entire Route</span>
                              </button>
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">Page Navigation Title ({currentLocale})</label>
                                <input 
                                  type="text"
                                  value={activePage.title[currentLocale] || ""}
                                  onChange={(e) => {
                                    const pages = cmsDb.pages.map(p => p.id === activePage.id 
                                      ? { ...p, title: { ...p.title, [currentLocale]: e.target.value } }
                                      : p
                                    );
                                    handleUpdate({ ...cmsDb, pages });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-200" 
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">URL Slug Path</label>
                                <input 
                                  type="text"
                                  value={activePage.slug}
                                  onChange={(e) => {
                                    const pages = cmsDb.pages.map(p => p.id === activePage.id 
                                      ? { ...p, slug: e.target.value }
                                      : p
                                    );
                                    handleUpdate({ ...cmsDb, pages });
                                  }}
                                  disabled={activePage.id === "page-home"}
                                  className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-200 font-mono disabled:opacity-50" 
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400">Publishing Status</label>
                                <select 
                                  value={activePage.status}
                                  onChange={(e) => {
                                    const pages = cmsDb.pages.map(p => p.id === activePage.id 
                                      ? { ...p, status: e.target.value as any }
                                      : p
                                    );
                                    handleUpdate({ ...cmsDb, pages });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-850 rounded text-xs px-2 py-1 text-slate-200"
                                >
                                  <option value="draft">Draft State</option>
                                  <option value="published">Published Live</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Localized SEO Block on page */}
                          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
                            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex justify-between">
                              <span>Localized Meta SEO Headers</span>
                              <span className="text-[9px] text-indigo-400">Required fields</span>
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 block pb-0.5">Meta SEO Title ({currentLocale})</label>
                                <input 
                                  type="text"
                                  value={activePage.metaTitle?.[currentLocale] || ""}
                                  onChange={(e) => {
                                    const pages = cmsDb.pages.map(p => p.id === activePage.id 
                                      ? { ...p, metaTitle: { ...p.metaTitle, [currentLocale]: e.target.value } }
                                      : p
                                    );
                                    handleUpdate({ ...cmsDb, pages });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-slate-200" 
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 block pb-0.5">Meta SEO Description ({currentLocale})</label>
                                <textarea 
                                  rows={2}
                                  value={activePage.metaDescription?.[currentLocale] || ""}
                                  onChange={(e) => {
                                    const pages = cmsDb.pages.map(p => p.id === activePage.id 
                                      ? { ...p, metaDescription: { ...p.metaDescription, [currentLocale]: e.target.value } }
                                      : p
                                    );
                                    handleUpdate({ ...cmsDb, pages });
                                  }}
                                  className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 translate-y-[2px] text-xs text-slate-200 focus:outline-none" 
                                />
                              </div>
                            </div>
                          </div>

                          {/* Page Sections Blocks (Order List) */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                              <div>
                                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Visual Section Blocks</h4>
                                <p className="text-[10px] text-slate-500">Add, drag, and build content components.</p>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <select 
                                  id="add-section-select"
                                  defaultValue="features"
                                  className="bg-slate-950 border border-slate-850 rounded text-xs px-2 py-1 text-slate-300"
                                >
                                  <option value="hero">Add Hero block</option>
                                  <option value="features">Add Features Grid</option>
                                  <option value="products">Add Products Grid</option>
                                  <option value="testimonials">Add Testimonials</option>
                                  <option value="faqs">Add FAQs</option>
                                  <option value="contactForm">Add Form block</option>
                                </select>
                                <button
                                  onClick={() => {
                                    const select = document.getElementById("add-section-select") as HTMLSelectElement;
                                    const type = select.value;
                                    let newSec: Section;
                                    
                                    if (type === "hero") {
                                      newSec = {
                                        type: "hero",
                                        headline: { en: "Dynamic Heading", fr: "En-tête", pt: "Título Principal" },
                                        subheadline: { en: "Dynamic subtext copy", fr: "Texte secondaire", pt: "Subtítulo dinâmico" },
                                        ctaPrimary: { label: { en: "Check Out", fr: "Voir", pt: "Ação" }, href: "/products" },
                                        overlayOpacity: 0.5,
                                        layout: "centered"
                                      };
                                    } else if (type === "features") {
                                      newSec = {
                                        type: "features",
                                        headline: { en: "Why Deploy Apex?", fr: "Pourquoi Apex?", pt: "Vantagens Apex" },
                                        subtitle: { en: "Highlight core developer traits.", fr: "Caractéristiques", pt: "Destaques corporativos" },
                                        items: [
                                          { icon: "Zap", title: { en: "Feature Title", fr: "Titre", pt: "Título" }, description: { en: "Description detail", fr: "Détail", pt: "Descrição" } }
                                        ]
                                      };
                                    } else if (type === "products") {
                                      newSec = {
                                        type: "products",
                                        headline: { en: "Showcase Catalog", fr: "Nos Produits", pt: "Soluções" },
                                        subtitle: { en: "Connected to inventory", fr: "Inventaire", pt: "Estoque sincronizado" },
                                        limit: 3
                                      };
                                    } else if (type === "testimonials") {
                                      newSec = {
                                        type: "testimonials",
                                        headline: { en: "Success validation Stories", fr: "Témoignages", pt: "Casos de Sucesso" },
                                        subtitle: { en: "Real reports", fr: "Avis", pt: "Relatos" }
                                      };
                                    } else if (type === "faqs") {
                                      newSec = {
                                        type: "faqs",
                                        headline: { en: "Quick Help questions", fr: "FAQ", pt: "Dúvidas Frequentes" }
                                      };
                                    } else {
                                      newSec = {
                                        type: "contactForm",
                                        headline: { en: "Trigger Callback Request", fr: "Formulaire", pt: "Formulário de Contato" },
                                        formId: "lead-capture"
                                      };
                                    }

                                    const nextSecs = [...activePage.sections, newSec];
                                    const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                    handleUpdate({ ...cmsDb, pages });
                                    triggerSaveNotification(`Added visual "${type}" module to page.`);
                                  }}
                                  className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" />
                                  <span>Inject</span>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {activePage.sections.map((sec, secIdx) => (
                                <div key={secIdx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-850">
                                    <div className="flex items-center gap-2">
                                      <span className="p-1 rounded bg-indigo-900/40 text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wide">
                                        Block #{secIdx + 1}: {sec.type}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {secIdx > 0 && (
                                        <button
                                          onClick={() => {
                                            const nextSecs = [...activePage.sections];
                                            const temp = nextSecs[secIdx];
                                            nextSecs[secIdx] = nextSecs[secIdx - 1];
                                            nextSecs[secIdx - 1] = temp;
                                            const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                            handleUpdate({ ...cmsDb, pages });
                                          }}
                                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                                        >
                                          <MoveUp className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      {secIdx < activePage.sections.length - 1 && (
                                        <button
                                          onClick={() => {
                                            const nextSecs = [...activePage.sections];
                                            const temp = nextSecs[secIdx];
                                            nextSecs[secIdx] = nextSecs[secIdx + 1];
                                            nextSecs[secIdx + 1] = temp;
                                            const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                            handleUpdate({ ...cmsDb, pages });
                                          }}
                                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                                        >
                                          <MoveDown className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          const nextSecs = activePage.sections.filter((_, i) => i !== secIdx);
                                          const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                          handleUpdate({ ...cmsDb, pages });
                                          triggerSaveNotification("Erase block success.");
                                        }}
                                        className="p-1 hover:bg-rose-950 text-slate-400 hover:text-rose-450 rounded"
                                      >
                                        <Trash className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Render inline properties editor depending on section type */}
                                  {sec.type === "hero" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Headline Heading ({currentLocale})</label>
                                        <input 
                                          type="text" 
                                          value={sec.headline?.[currentLocale] || ""}
                                          onChange={(e) => {
                                            const nextSecs = [...activePage.sections];
                                            const hero = nextSecs[secIdx] as any;
                                            nextSecs[secIdx] = { ...hero, headline: { ...hero.headline, [currentLocale]: e.target.value } };
                                            const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                            handleUpdate({ ...cmsDb, pages });
                                          }}
                                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Subheadline Paragraph ({currentLocale})</label>
                                        <input 
                                          type="text" 
                                          value={sec.subheadline?.[currentLocale] || ""}
                                          onChange={(e) => {
                                            const nextSecs = [...activePage.sections];
                                            const hero = nextSecs[secIdx] as any;
                                            nextSecs[secIdx] = { ...hero, subheadline: { ...hero.subheadline, [currentLocale]: e.target.value } };
                                            const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                            handleUpdate({ ...cmsDb, pages });
                                          }}
                                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">CTA Label ({currentLocale})</label>
                                        <input 
                                          type="text" 
                                          value={sec.ctaPrimary?.label?.[currentLocale] || ""}
                                          onChange={(e) => {
                                            const nextSecs = [...activePage.sections];
                                            const hero = nextSecs[secIdx] as any;
                                            nextSecs[secIdx] = { ...hero, ctaPrimary: { ...hero.ctaPrimary, label: { ...hero.ctaPrimary.label, [currentLocale]: e.target.value } } };
                                            const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                            handleUpdate({ ...cmsDb, pages });
                                          }}
                                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200"
                                        />
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                          <label className="text-[10px] font-bold text-slate-400">Hero Layout</label>
                                          <select 
                                            value={sec.layout}
                                            onChange={(e) => {
                                              const nextSecs = [...activePage.sections];
                                              const block = nextSecs[secIdx] as any;
                                              nextSecs[secIdx] = { ...block, layout: e.target.value as any };
                                              const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                              handleUpdate({ ...cmsDb, pages });
                                            }}
                                            className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-300"
                                          >
                                            <option value="centered">Centered</option>
                                            <option value="left">Left-Aligned</option>
                                            <option value="right">Right-Aligned</option>
                                          </select>
                                        </div>

                                        <div className="space-y-1">
                                          <label className="text-[10px] font-bold text-slate-400">Dim Overlay (0-1)</label>
                                          <input 
                                            type="number"
                                            step="0.05"
                                            min="0"
                                            max="1"
                                            value={sec.overlayOpacity}
                                            onChange={(e) => {
                                              const nextSecs = [...activePage.sections];
                                              const block = nextSecs[secIdx] as any;
                                              nextSecs[secIdx] = { ...block, overlayOpacity: parseFloat(e.target.value) || 0 };
                                              const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                              handleUpdate({ ...cmsDb, pages });
                                            }}
                                            className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-200 font-mono"
                                          />
                                        </div>
                                      </div>

                                      <div className="sm:col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 block">Cover Background Image URL</label>
                                        <input 
                                          type="text" 
                                          value={sec.backgroundImage || ""}
                                          onChange={(e) => {
                                            const nextSecs = [...activePage.sections];
                                            const block = nextSecs[secIdx] as any;
                                            nextSecs[secIdx] = { ...block, backgroundImage: e.target.value };
                                            const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                            handleUpdate({ ...cmsDb, pages });
                                          }}
                                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 font-mono"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {sec.type !== "hero" && (
                                    <p className="text-[11px] text-slate-500 italic">
                                      This static grid block references content modules defined globally (e.g. products map to Product Catalog automatically).
                                      Adjust layout heading:
                                      <input 
                                        type="text" 
                                        value={sec.headline?.[currentLocale] || ""}
                                        onChange={(e) => {
                                          const nextSecs = [...activePage.sections];
                                          const item = nextSecs[secIdx] as any;
                                          nextSecs[secIdx] = { ...item, headline: { ...item.headline, [currentLocale]: e.target.value } };
                                          const pages = cmsDb.pages.map(p => p.id === activePage.id ? { ...p, sections: nextSecs } : p);
                                          handleUpdate({ ...cmsDb, pages });
                                        }}
                                        placeholder="Section Headline Label"
                                        className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 mt-1"
                                      />
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE: Product Catalog */}
            {activeConsoleTab === "products" && (
              <div className="space-y-4" id="editor-products-module">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Commercial Products inventory</h4>
                  <button
                    onClick={() => {
                      const newId = `prod-new-${Date.now().toString().slice(-4)}`;
                      const newProduct: Product = {
                        id: newId,
                        title: { en: "Developer Access Pack", fr: "Pack Développeur", pt: "Pacote de Desenvolvedor" },
                        slug: "developer-access-pack",
                        description: { en: "<p>Describe item body...</p>", fr: "<p>Rédiger...</p>", pt: "<p>Descrever...</p>" },
                        price: 49.00,
                        currency: "USD",
                        sku: "APX-DEV-PRO",
                        inventory: 100,
                        variants: [{ name: "Format", options: ["JSON Standard", "TypeScript Shared"] }],
                        categories: ["Services"],
                        featured: true,
                        status: "active",
                        images: [{ url: "https://images.unsplash.com/photo-1546074177-3a9617ad34c5?auto=format&fit=crop&w=300&q=80", alt: "Physical CD image.", width: 300, height: 300 }],
                        lastUpdatedAt: new Date().toISOString()
                      };
                      handleUpdate({
                        ...cmsDb,
                        products: [...cmsDb.products, newProduct]
                      });
                      setSelectedDocId(newId);
                      triggerSaveNotification("Created catalog product entry.");
                    }}
                    className="flex items-center gap-1 text-xs bg-amber-900 border border-amber-700 hover:bg-amber-800 text-amber-100 px-3 py-1 rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Product</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cmsDb.products.map(p => {
                    const isSelected = selectedDocId === p.id;
                    return (
                      <div 
                        key={p.id}
                        onClick={() => setSelectedDocId(p.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition ${
                          isSelected ? 'bg-amber-500/10 border-amber-500/70 text-amber-200' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold truncate max-w-40">{p.title[currentLocale] || p.title["en"]}</span>
                          <span className="font-mono text-[10px] text-amber-400">${p.price}</span>
                        </div>
                        <span className="text-[9px] font-mono p-1 rounded bg-slate-900 text-slate-500 block border border-slate-850">SKU: {p.sku}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Specific selected product visual form */}
                {(() => {
                  const activeProd = cmsDb.products.find(p => p.id === selectedDocId) || cmsDb.products[0];
                  if (!activeProd) return null;

                  return (
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 space-y-4 shadow-sm" id={`prod-editor-form-${activeProd.id}`}>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-amber-400 font-mono">Modifying Product Code: {activeProd.sku}</span>
                        <button
                          onClick={() => {
                            const filtered = cmsDb.products.filter(p => p.id !== activeProd.id);
                            handleUpdate({ ...cmsDb, products: filtered });
                            setSelectedDocId("");
                            triggerSaveNotification("Product entry removed.");
                          }}
                          className="text-[10px] text-rose-400 hover:text-rose-300"
                        >
                          Erase Product
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Product Title ({currentLocale})</label>
                          <input 
                            type="text"
                            value={activeProd.title[currentLocale] || ""}
                            onChange={(e) => {
                              const products = cmsDb.products.map(p => p.id === activeProd.id 
                                ? { ...p, title: { ...p.title, [currentLocale]: e.target.value } }
                                : p
                              );
                              handleUpdate({ ...cmsDb, products });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-250" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Pricing Price ($ USD)</label>
                          <input 
                            type="number"
                            value={activeProd.price}
                            onChange={(e) => {
                              const products = cmsDb.products.map(p => p.id === activeProd.id 
                                ? { ...p, price: parseFloat(e.target.value) || 0 }
                                : p
                              );
                              handleUpdate({ ...cmsDb, products });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">SKU Reference</label>
                          <input 
                            type="text"
                            value={activeProd.sku}
                            onChange={(e) => {
                              const products = cmsDb.products.map(p => p.id === activeProd.id 
                                ? { ...p, sku: e.target.value }
                                : p
                              );
                              handleUpdate({ ...cmsDb, products });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Inventory Stocks</label>
                          <input 
                            type="number"
                            value={activeProd.inventory}
                            onChange={(e) => {
                              const products = cmsDb.products.map(p => p.id === activeProd.id 
                                ? { ...p, inventory: parseInt(e.target.value) || 0 }
                                : p
                              );
                              handleUpdate({ ...cmsDb, products });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Product Image URL</label>
                          <input 
                            type="text"
                            value={activeProd.images[0]?.url || ""}
                            onChange={(e) => {
                              const nextImages = [...activeProd.images];
                              if (nextImages[0]) {
                                nextImages[0].url = e.target.value;
                              } else {
                                nextImages.push({ url: e.target.value, alt: "Product view.", width: 400, height: 400 });
                              }
                              const products = cmsDb.products.map(p => p.id === activeProd.id ? { ...p, images: nextImages } : p);
                              handleUpdate({ ...cmsDb, products });
                            }}
                            className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-200 font-mono animate-none" 
                          />
                        </div>

                        <div className="space-y-1 font-sans">
                          {/* Rule 1 Warning: Required Alt Text */}
                          <label className="text-[10px] font-bold text-slate-405 block">
                            <span>Image Alt Text (SEO Mandatory)</span>
                            {(!activeProd.images[0]?.alt) && <span className="text-rose-500 ml-1 font-bold">*Required</span>}
                          </label>
                          <input 
                            type="text"
                            value={activeProd.images[0]?.alt || ""}
                            placeholder="Describe visual content precisely..."
                            onChange={(e) => {
                              const nextImages = [...activeProd.images];
                              if (nextImages[0]) {
                                nextImages[0].alt = e.target.value;
                              } else {
                                nextImages.push({ url: "", alt: e.target.value, width: 400, height: 400 });
                              }
                              const products = cmsDb.products.map(p => p.id === activeProd.id ? { ...p, images: nextImages } : p);
                              handleUpdate({ ...cmsDb, products });
                            }}
                            className={`w-full bg-slate-900 border rounded px-2.5 py-1 text-xs text-slate-200 ${
                              !activeProd.images[0]?.alt ? "border-rose-900 focus:border-rose-500" : "border-slate-800 focus:border-blue-500"
                            }`} 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">HTML Rich Text Description ({currentLocale})</label>
                        <textarea 
                          rows={3}
                          value={activeProd.description[currentLocale] || ""}
                          onChange={(e) => {
                            const products = cmsDb.products.map(p => p.id === activeProd.id 
                              ? { ...p, description: { ...p.description, [currentLocale]: e.target.value } }
                              : p
                            );
                            handleUpdate({ ...cmsDb, products });
                          }}
                          className="w-full bg-slate-900 border border-slate-850 rounded-lg text-xs px-3 py-2 text-slate-200 font-mono focus:outline-none" 
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MODULE: Blog Posts */}
            {activeConsoleTab === "posts" && (
              <div className="space-y-4" id="editor-posts-module">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Indexed Blog & Articles</h4>
                  <button
                    onClick={() => {
                      const newId = `post-new-${Date.now().toString().slice(-4)}`;
                      const newPost: Post = {
                        id: newId,
                        title: { en: "Uncovering Headless Best Practices", fr: "Pratiques Headless", pt: "Boas Práticas Headless" },
                        slug: "uncovering-headless-standards",
                        status: "draft",
                        publishedAt: new Date().toISOString(),
                        author: "author-1",
                        categories: ["Developer Tools"],
                        tags: ["Framework"],
                        featuredImage: { 
                          url: "https://images.unsplash.com/photo-1546074177-3a9617ad34c5?auto=format&fit=crop&w=300&q=80", 
                          alt: "Illustration of codes.",
                          width: 300,
                          height: 200
                        },
                        excerpt: { en: "Quick intro text localized", fr: "Prélude", pt: "Resumo localizado" },
                        body: { en: "<p>Text content HTML</p>", fr: "<p>Texte</p>", pt: "<p>Corpo de texto</p>" },
                        readingTimeMinutes: 3,
                        relatedPosts: [],
                        lastUpdatedAt: new Date().toISOString()
                      };
                      handleUpdate({ ...cmsDb, posts: [...cmsDb.posts, newPost] });
                      setSelectedDocId(newId);
                      triggerSaveNotification("Created blog article draft.");
                    }}
                    className="flex items-center gap-1 text-xs bg-pink-900 hover:bg-pink-850 border border-pink-700 text-pink-100 px-3 py-1 rounded"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Post</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cmsDb.posts.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedDocId(p.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                        selectedDocId === p.id ? 'bg-pink-500/10 border-pink-500/80 text-pink-200' : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-100'
                      }`}
                    >
                      <h5 className="text-xs font-semibold truncate">{p.title[currentLocale] || p.title["en"]}</h5>
                      <span className="text-[10px] text-slate-500 block mt-1 font-mono">slug: {p.slug}</span>
                    </div>
                  ))}
                </div>

                {/* Specific Post Editor Panel */}
                {(() => {
                  const activePost = cmsDb.posts.find(p => p.id === selectedDocId) || cmsDb.posts[0];
                  if (!activePost) return null;

                  return (
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-850 space-y-4" id={`post-form-node-${activePost.id}`}>
                      <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                        <span className="text-xs font-mono font-bold text-pink-400">Editing Document Key: {activePost.id}</span>
                        <button
                          onClick={() => {
                            const filtered = cmsDb.posts.filter(p => p.id !== activePost.id);
                            handleUpdate({ ...cmsDb, posts: filtered });
                            setSelectedDocId("");
                            triggerSaveNotification("Post database reference erased.");
                          }}
                          className="text-[10px] text-rose-450 hover:text-rose-400"
                        >
                          Erase Article
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Post Title ({currentLocale})</label>
                          <input 
                            type="text"
                            value={activePost.title[currentLocale] || ""}
                            onChange={(e) => {
                              const posts = cmsDb.posts.map(p => p.id === activePost.id 
                                ? { ...p, title: { ...p.title, [currentLocale]: e.target.value } }
                                : p
                              );
                              handleUpdate({ ...cmsDb, posts });
                            }}
                            className="w-full bg-slate-905 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-205" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Article URI Path</label>
                          <input 
                            type="text"
                            value={activePost.slug}
                            onChange={(e) => {
                              const posts = cmsDb.posts.map(p => p.id === activePost.id 
                                ? { ...p, slug: e.target.value }
                                : p
                              );
                              handleUpdate({ ...cmsDb, posts });
                            }}
                            className="w-full bg-slate-905 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 font-mono" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Assigned Author</label>
                          <select
                            value={activePost.author}
                            onChange={(e) => {
                              const posts = cmsDb.posts.map(p => p.id === activePost.id 
                                ? { ...p, author: e.target.value }
                                : p
                              );
                              handleUpdate({ ...cmsDb, posts });
                            }}
                            className="w-full bg-slate-905 border border-slate-800 rounded text-xs px-1.5 py-1.5 text-slate-200"
                          >
                            {cmsDb.authors.map(a => (
                              <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400">Featured Cover Image URL</label>
                          <input 
                            type="text"
                            value={activePost.featuredImage.url}
                            onChange={(e) => {
                              const posts = cmsDb.posts.map(p => p.id === activePost.id 
                                ? { ...p, featuredImage: { ...p.featuredImage, url: e.target.value } }
                                : p
                              );
                              handleUpdate({ ...cmsDb, posts });
                            }}
                            className="w-full bg-slate-905 border border-slate-850 rounded px-2 py-1 text-xs text-slate-200 font-mono" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 block justify-between">
                            <span>Cover Image Alt Text (SEO Alt Mandatory)</span>
                            {!activePost.featuredImage.alt && <span className="text-rose-500 ml-1">*Missing</span>}
                          </label>
                          <input 
                            type="text"
                            value={activePost.featuredImage.alt}
                            onChange={(e) => {
                              const posts = cmsDb.posts.map(p => p.id === activePost.id 
                                ? { ...p, featuredImage: { ...p.featuredImage, alt: e.target.value } }
                                : p
                              );
                              handleUpdate({ ...cmsDb, posts });
                            }}
                            className={`w-full bg-slate-905 border rounded px-2 py-1 text-xs text-slate-200 ${
                              !activePost.featuredImage.alt ? "border-rose-900" : "border-slate-850"
                            }`} 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">Short Excerpt Summary ({currentLocale})</label>
                        <input 
                          type="text"
                          value={activePost.excerpt[currentLocale] || ""}
                          onChange={(e) => {
                            const posts = cmsDb.posts.map(p => p.id === activePost.id 
                              ? { ...p, excerpt: { ...p.excerpt, [currentLocale]: e.target.value } }
                              : p
                            );
                            handleUpdate({ ...cmsDb, posts });
                          }}
                          className="w-full bg-slate-905 border border-slate-850 rounded px-2 py-1.5 text-xs text-slate-200" 
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400">Markdown / HTML Article Content ({currentLocale})</label>
                        <textarea 
                          rows={4}
                          value={activePost.body[currentLocale] || ""}
                          onChange={(e) => {
                            const posts = cmsDb.posts.map(p => p.id === activePost.id 
                              ? { ...p, body: { ...p.body, [currentLocale]: e.target.value } }
                              : p
                            );
                            handleUpdate({ ...cmsDb, posts });
                          }}
                          className="w-full bg-slate-905 border border-slate-850 rounded text-xs px-3 py-2 text-slate-200 font-mono focus:outline-none" 
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* MODULE: Testimonials */}
            {activeConsoleTab === "testimonials" && (
              <div className="space-y-4" id="editor-testimonials-module">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Social Proof Carousel</h4>
                  <button
                    onClick={() => {
                      const newId = `test-new-${Date.now().toString().slice(-4)}`;
                      const newTest: Testimonial = {
                        id: newId,
                        quote: { en: "Excellent headless framework schemas.", fr: "Excellent.", pt: "Excelente." },
                        authorName: "New Advocate",
                        authorRole: { en: "Developer", fr: "Développeur", pt: "Desenvolvedor" },
                        authorCompany: "Apex Partner",
                        rating: 5,
                        featured: true,
                        lastUpdatedAt: new Date().toISOString()
                      };
                      handleUpdate({ ...cmsDb, testimonials: [...cmsDb.testimonials, newTest] });
                      setSelectedDocId(newId);
                    }}
                    className="text-xs bg-rose-900 hover:bg-rose-850 border border-rose-700 text-rose-100 px-2.5 py-1 rounded"
                  >
                    + Add Quote
                  </button>
                </div>

                <div className="space-y-3">
                  {cmsDb.testimonials.map((t, idx) => (
                    <div key={t.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-rose-400 font-bold">Reviewer: {t.authorName} ({t.authorCompany})</span>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number"
                            min="1"
                            max="5"
                            value={t.rating || 5}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 5;
                              const testimonials = cmsDb.testimonials.map(item => item.id === t.id ? { ...item, rating: val } : item);
                              handleUpdate({ ...cmsDb, testimonials });
                            }}
                            className="bg-slate-900 border border-slate-800 text-[10px] px-1 py-0.5 rounded text-yellow-500 w-10 text-center font-mono"
                          />
                          <button
                            onClick={() => {
                              const filtered = cmsDb.testimonials.filter(item => item.id !== t.id);
                              handleUpdate({ ...cmsDb, testimonials: filtered });
                              triggerSaveNotification("Removed quote.");
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 px-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Advocate Name</label>
                          <input 
                            type="text" 
                            value={t.authorName}
                            onChange={(e) => {
                              const testimonials = cmsDb.testimonials.map(item => item.id === t.id ? { ...item, authorName: e.target.value } : item);
                              handleUpdate({ ...cmsDb, testimonials });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-0.5"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Quote text content ({currentLocale})</label>
                          <input 
                            type="text" 
                            value={t.quote[currentLocale] || ""}
                            onChange={(e) => {
                              const testimonials = cmsDb.testimonials.map(item => item.id === t.id ? { ...item, quote: { ...item.quote, [currentLocale]: e.target.value } } : item);
                              handleUpdate({ ...cmsDb, testimonials });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE: FAQs */}
            {activeConsoleTab === "faqs" && (
              <div className="space-y-4" id="editor-faqs-module">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Help Accordion Database</h4>
                  <button
                    onClick={() => {
                      const newId = `faq-new-${Date.now().toString().slice(-4)}`;
                      const newFaq: FaqItem = {
                        id: newId,
                        question: { en: "New technical question?", fr: "Question?", pt: "Pergunta?" },
                        answer: { en: "<p>Answer content</p>", fr: "<p>Réponse</p>", pt: "<p>Resposta</p>" },
                        category: { en: "General", fr: "Général", pt: "Geral" },
                        order: cmsDb.faqs.length + 1,
                        lastUpdatedAt: new Date().toISOString()
                      };
                      handleUpdate({ ...cmsDb, faqs: [...cmsDb.faqs, newFaq] });
                      setSelectedDocId(newId);
                    }}
                    className="text-xs bg-teal-900 hover:bg-teal-850 border border-teal-700 text-teal-100 px-3 py-1 rounded"
                  >
                    + Add Accordion
                  </button>
                </div>

                <div className="space-y-3">
                  {cmsDb.faqs.map(f => (
                    <div key={f.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
                      <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                        <span className="text-[10px] font-bold text-teal-400">Accordion ID: #{f.id}</span>
                        <button
                          onClick={() => {
                            const filtered = cmsDb.faqs.filter(item => item.id !== f.id);
                            handleUpdate({ ...cmsDb, faqs: filtered });
                          }}
                          className="text-[10px] text-rose-450 hover:text-rose-400"
                        >
                          Erase
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 block">Question Title / Collapse Header ({currentLocale})</label>
                          <input 
                            type="text"
                            value={f.question[currentLocale] || ""}
                            onChange={(e) => {
                              const nextFaqs = cmsDb.faqs.map(item => item.id === f.id 
                                ? { ...item, question: { ...item.question, [currentLocale]: e.target.value } } 
                                : item
                              );
                              handleUpdate({ ...cmsDb, faqs: nextFaqs });
                            }}
                            className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-200" 
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 block">Rich Text Answer Body ({currentLocale})</label>
                          <textarea 
                            rows={2}
                            value={f.answer[currentLocale] || ""}
                            onChange={(e) => {
                              const nextFaqs = cmsDb.faqs.map(item => item.id === f.id 
                                ? { ...item, answer: { ...item.answer, [currentLocale]: e.target.value } } 
                                : item
                              );
                              handleUpdate({ ...cmsDb, faqs: nextFaqs });
                            }}
                            className="w-full bg-slate-900 border border-slate-850 rounded text-xs px-2.5 py-1 text-slate-250 font-mono" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE: Forms */}
            {activeConsoleTab === "forms" && (
              <div className="space-y-4" id="editor-forms-module">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Lead Collection Forms fields</h4>
                </div>

                {cmsDb.forms.map(form => (
                  <div key={form.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
                    <span className="p-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold block mb-2 w-max">
                      Form Identity: {form.id}
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Success Alert Message ({currentLocale})</label>
                        <input 
                          type="text" 
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1"
                          value={form.successMessage[currentLocale] || ""}
                          onChange={(e) => {
                            const forms = cmsDb.forms.map(fm => fm.id === form.id 
                              ? { ...fm, successMessage: { ...fm.successMessage, [currentLocale]: e.target.value } }
                              : fm
                            );
                            handleUpdate({ ...cmsDb, forms });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500">Notification Email Dispatch (Receipient)</label>
                        <input 
                          type="text" 
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 font-mono text-slate-300"
                          value={form.notifyEmail}
                          onChange={(e) => {
                            const forms = cmsDb.forms.map(fm => fm.id === form.id ? { ...fm, notifyEmail: e.target.value } : fm);
                            handleUpdate({ ...cmsDb, forms });
                          }}
                        />
                      </div>
                    </div>

                    {/* Simple list of fields */}
                    <div className="space-y-2 mt-3 pt-3 border-t border-slate-850">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Generated Fields</span>
                      {form.fields.map((f, fieldIdx) => (
                        <div key={f.id} className="flex gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-850 items-center justify-between text-xs">
                          <div className="flex gap-4 items-center">
                            <span className="font-mono text-[10px] text-slate-500">#{fieldIdx + 1}</span>
                            <span className="font-semibold">{f.label[currentLocale] || f.label["en"]}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 font-mono font-bold text-cyan-400">{f.type}</span>
                          </div>
                          
                          <input 
                            type="checkbox"
                            checked={f.required}
                            onChange={(e) => {
                              const nextFields = [...form.fields];
                              nextFields[fieldIdx].required = e.target.checked;
                              const forms = cmsDb.forms.map(fm => fm.id === form.id ? { ...fm, fields: nextFields } : fm);
                              handleUpdate({ ...cmsDb, forms });
                            }}
                            className="bg-slate-900 border-slate-800 text-blue-600 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MODULE: Redirects */}
            {activeConsoleTab === "redirects" && (
              <div className="space-y-4" id="editor-redirects-module">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">301/302 Redirect Maps (Routing)</h4>
                  <button
                    onClick={() => {
                      const newId = `redir-new-${Date.now().toString().slice(-4)}`;
                      const newRedir: Redirect = {
                        id: newId,
                        from: `/old-path-${cmsDb.redirects.length + 1}`,
                        to: "/products",
                        statusCode: 301,
                        enabled: true,
                        lastUpdatedAt: new Date().toISOString()
                      };
                      handleUpdate({ ...cmsDb, redirects: [...cmsDb.redirects, newRedir] });
                    }}
                    className="text-xs bg-purple-900 hover:bg-purple-850 border border-purple-700 text-purple-100 px-3 py-1 rounded"
                  >
                    + Add Rule
                  </button>
                </div>

                <div className="space-y-3">
                  {cmsDb.redirects.map((r, i) => (
                    <div key={r.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-5 space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500">Source Path</label>
                        <input 
                          type="text" 
                          value={r.from}
                          onChange={(e) => {
                            const redirects = cmsDb.redirects.map(item => item.id === r.id ? { ...item, from: e.target.value } : item);
                            handleUpdate({ ...cmsDb, redirects });
                          }}
                          className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-205 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-1 text-center font-mono text-slate-600">➔</div>

                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500">Target Path</label>
                        <input 
                          type="text" 
                          value={r.to}
                          onChange={(e) => {
                            const redirects = cmsDb.redirects.map(item => item.id === r.id ? { ...item, to: e.target.value } : item);
                            handleUpdate({ ...cmsDb, redirects });
                          }}
                          className="w-full bg-slate-900 border border-slate-850 rounded px-2.5 py-1 text-xs text-slate-205 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500">Status</label>
                        <select
                          value={r.statusCode}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) as 301 | 302;
                            const redirects = cmsDb.redirects.map(item => item.id === r.id ? { ...item, statusCode: val } : item);
                            handleUpdate({ ...cmsDb, redirects });
                          }}
                          className="w-full bg-slate-900 border border-slate-850 rounded text-xs px-1.5 py-1.5 text-slate-300"
                        >
                          <option value="301">301 - Permanent</option>
                          <option value="302">302 - Temp</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE: Roles & Permissions */}
            {activeConsoleTab === "roles" && (
              <div className="space-y-4" id="editor-roles-module">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Administrative Roles & OAuth Permissions</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cmsDb.roles.map(role => (
                    <div key={role.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                        <span className="text-xs font-bold text-violet-400 capitalize">{role.name} Status</span>
                        <span className="text-[9px] font-mono p-1 rounded bg-slate-900 text-slate-500 border border-slate-850">ID: {role.id}</span>
                      </div>

                      <ul className="text-[11px] text-slate-400 space-y-1.5 max-h-32 overflow-y-auto">
                        {role.permissions.map((p, idx) => (
                          <li key={idx} className="flex flex-col gap-1 inline-block pb-1.5 border-b border-slate-900/60 leading-relaxed">
                            <strong className="text-[10px] uppercase text-slate-300 block">{p.module} permissions:</strong>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {p.actions.map(act => (
                                <span key={act} className="text-[9px] font-mono bg-violet-950/40 border border-violet-900/30 text-violet-400 px-1 py-0.5 rounded uppercase">
                                  {act}
                                </span>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE: Authors Team */}
            {activeConsoleTab === "authors" && (
              <div className="space-y-4" id="editor-authors-module">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">CMS Contributors & Team Members</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cmsDb.authors.map(author => (
                    <div key={author.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex gap-4">
                      <img 
                        src={author.avatar.url} 
                        alt={author.avatar.alt} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-slate-700 mt-1" 
                      />
                      <div className="space-y-2 flex-1">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{author.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{author.role[currentLocale] || author.role["en"]}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed block italic py-1.5 border-t border-slate-900">
                          {author.bio[currentLocale] || author.bio["en"]}
                        </p>
                        <span className="text-[9px] font-mono text-slate-500 block">Contributor key: {author.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-slate-850 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Edge Server compile: 0.1ms</span>
            </span>
            <span className="text-slate-400">Last database sync: <strong className="font-mono text-xs">{new Date(cmsDb.globalSettings.lastUpdatedAt).toLocaleTimeString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-slate-200 border-l-4 border-emerald-500 border border-slate-800 shadow-xl p-4 rounded-lg flex items-center gap-2 z-50 animate-pulse text-xs">
          <CheckCircle className="w-4 h-4 text-emerald-450" />
          <span>{saveToast}</span>
        </div>
      )}
    </div>
  );
}
