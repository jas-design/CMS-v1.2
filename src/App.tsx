/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { initialCmsDatabase } from './mockData';
import { CmsDatabase } from './types';
import CmsConsole from './components/CmsConsole';
import SitePreview from './components/SitePreview';
import ApiPlayground from './components/ApiPlayground';
import IntegrationHelper from './components/IntegrationHelper';
import DesignExplorer from './components/DesignExplorer';
import { 
  Database, 
  Eye, 
  Terminal, 
  BookOpen, 
  Settings, 
  RefreshCw, 
  Globe, 
  CheckCircle,
  HelpCircle,
  Palette
} from 'lucide-react';

export default function App() {
  const [cmsDb, setCmsDb] = useState<CmsDatabase>(initialCmsDatabase);
  const [currentLocale, setCurrentLocale] = useState<string>("en");
  const [activeTab, setActiveTab] = useState<"cms" | "preview" | "api" | "integration" | "design">("cms");

  const handleResetDatabase = () => {
    if (window.confirm("Are you sure you want to reset all CMS content to original translation defaults? This removes current modifications.")) {
      setCmsDb(initialCmsDatabase);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100 flex flex-col selection:bg-blue-600/30 font-sans" id="headless-cms-suite-container">
      
      {/* GLOBAL ARCHITECT HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 shrink-0" id="header-brand-belt">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-500">
              <Database className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white font-heading">Apex Headless Suite</h1>
                <span className="text-[10px] bg-emerald-950 text-emerald-450 border border-emerald-900 py-0.5 px-2 rounded-full font-bold">API Stable</span>
              </div>
              <p className="text-[11px] text-slate-400">Headless CMS Architect & Connected Site Integrator</p>
            </div>
          </div>

          {/* Core Tab Navigations */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800" id="main-app-tabs">
            <button
              id="tab-btn-cms"
              onClick={() => setActiveTab("cms")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "cms" 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>CMS Editorial Dashboard</span>
            </button>

            <button
              id="tab-btn-preview"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "preview" 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Website Preview</span>
            </button>

            <button
              id="tab-btn-design"
              onClick={() => setActiveTab("design")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "design" 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design Options</span>
            </button>

            <button
              id="tab-btn-api"
              onClick={() => setActiveTab("api")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "api" 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>REST JSON Playground</span>
            </button>

            <button
              id="tab-btn-integration"
              onClick={() => setActiveTab("integration")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "integration" 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Developer Specs</span>
            </button>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-start border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
            <button
              onClick={handleResetDatabase}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 transition px-2.5 py-1.5 bg-slate-950/40 border border-slate-800 rounded-lg hover:border-slate-700"
            >
              <RefreshCw className="w-3 h-3 text-slate-450" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </header>

      {/* CORE DISPLAY WINDOW */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8" id="core-display-viewport">
        {activeTab === "cms" && (
          <CmsConsole 
            cmsDb={cmsDb} 
            setCmsDb={setCmsDb} 
            currentLocale={currentLocale} 
            setCurrentLocale={setCurrentLocale} 
          />
        )}

        {activeTab === "preview" && (
          <div className="space-y-6" id="preview-tab-viewport">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Simulated live connection to <strong>{t(cmsDb.globalSettings.siteName, "My Website")}</strong> is active.</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Dynamic brand elements are mapped on-the-fly.</span>
            </div>
            
            <SitePreview cmsDb={cmsDb} currentLocale={currentLocale} />
          </div>
        )}

        {activeTab === "design" && (
          <DesignExplorer 
            cmsDb={cmsDb} 
            setCmsDb={setCmsDb} 
            currentLocale={currentLocale} 
          />
        )}

        {activeTab === "api" && (
          <ApiPlayground 
            cmsDb={cmsDb} 
            currentLocale={currentLocale} 
          />
        )}

        {activeTab === "integration" && (
          <IntegrationHelper />
        )}
      </main>

      {/* SYSTEM ARCHITECTURE FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-6 shrink-0 text-slate-500 text-[11px] font-mono" id="system-architect-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>Schema integrity compliance status: <strong className="text-emerald-450">Active & Fully Audited</strong></span>
          <div className="flex gap-4">
            <span>Spec: Standard i18n JSON</span>
            <span>Edge Nodes: Global</span>
          </div>
        </div>
      </footer>
    </div>
  );

  // Translation lookup helper
  function t(localized: any, fallback: string): string {
    if (!localized) return fallback;
    return localized[currentLocale] || localized[cmsDb.globalSettings.defaultLocale] || Object.values(localized)[0] || fallback;
  }
}
