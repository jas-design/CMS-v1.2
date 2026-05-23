/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CmsDatabase } from '../types';
import { 
  Terminal, 
  Copy, 
  Check, 
  Send, 
  Globe, 
  FileCode, 
  Network, 
  Cpu, 
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';

interface ApiPlaygroundProps {
  cmsDb: CmsDatabase;
  currentLocale: string;
}

type Endpoint = 
  | "globalSettings" 
  | "navigation" 
  | "pages" 
  | "homePage"
  | "faqPage"
  | "products" 
  | "posts" 
  | "redirects"
  | "roles";

export default function ApiPlayground({ cmsDb, currentLocale }: ApiPlaygroundProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>("globalSettings");
  const [activeLangParam, setActiveLangParam] = useState<string>("all");
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState<string>(new Date().toUTCString());

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getEndpointPath = (): string => {
    const localeQuery = activeLangParam !== "all" ? `?locale=${activeLangParam}` : '';
    switch (selectedEndpoint) {
      case "globalSettings": return `/api/v1/global-settings${localeQuery}`;
      case "navigation": return `/api/v1/navigation${localeQuery}`;
      case "pages": return `/api/v1/pages${localeQuery}`;
      case "homePage": return `/api/v1/pages/home${localeQuery}`;
      case "faqPage": return `/api/v1/pages/faq${localeQuery}`;
      case "products": return `/api/v1/products${localeQuery}`;
      case "posts": return `/api/v1/posts${localeQuery}`;
      case "redirects": return `/api/v1/redirects`;
      case "roles": return `/api/v1/roles`;
    }
  };

  // Compile payload data based on endpoint and simulated locale binding
  const getCompiledPayload = (): any => {
    const filterLocale = (obj: any): any => {
      if (activeLangParam === "all") return obj;
      if (!obj) return obj;
      
      // If it's a simple localization dictionary { en, fr, pt }
      if (typeof obj === 'object' && !Array.isArray(obj)) {
        const keys = Object.keys(obj);
        const hasLocales = keys.some(k => cmsDb.globalSettings.locales.includes(k));
        if (hasLocales) {
          return obj[activeLangParam] || obj[cmsDb.globalSettings.defaultLocale] || Object.values(obj)[0];
        }
        
        // Traverse nested keys recurse
        const compiled: any = {};
        for (const [k, v] of Object.entries(obj)) {
          compiled[k] = filterLocale(v);
        }
        return compiled;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => filterLocale(item));
      }
      
      return obj;
    };

    switch (selectedEndpoint) {
      case "globalSettings":
        return filterLocale(cmsDb.globalSettings);
      case "navigation":
        return filterLocale(cmsDb.navigation);
      case "pages":
        return filterLocale(cmsDb.pages);
      case "homePage":
        return filterLocale(cmsDb.pages.find(p => p.slug === "/") || cmsDb.pages[0]);
      case "faqPage":
        return filterLocale(cmsDb.pages.find(p => p.slug === "/faq") || cmsDb.pages.find(p => p.id === "page-faq") || cmsDb.pages[0]);
      case "products":
        return filterLocale(cmsDb.products);
      case "posts":
        return filterLocale(cmsDb.posts);
      case "redirects":
        return cmsDb.redirects;
      case "roles":
        return cmsDb.roles;
    }
  };

  const payloadString = JSON.stringify(getCompiledPayload(), null, 2);

  // Auto-generate code snippets
  const getCurlCode = (): string => {
    return `curl -X GET "https://api.cms.my-website.com${getEndpointPath()}" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer apikey_production_live_992"`;
  };

  const getJsCode = (): string => {
    return `// Fetch ${selectedEndpoint} payload asynchronously
async function fetchCmsData() {
  const url = 'https://api.cms.my-website.com${getEndpointPath()}';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer apikey_production_live_992'
      }
    });
    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    const data = await response.json();
    console.log('CMS Entity Payload:', data);
    return data;
  } catch (error) {
    console.error('Core Headless Integration Error:', error);
  }
}

fetchCmsData();`;
  };

  const getTsCode = (): string => {
    const capitalizedName = selectedEndpoint.charAt(0).toUpperCase() + selectedEndpoint.slice(1);
    const interfaceMap: Record<Endpoint, string> = {
      globalSettings: "GlobalSettings",
      navigation: "Navigation",
      pages: "Page[]",
      homePage: "Page",
      faqPage: "Page",
      products: "Product[]",
      posts: "Post[]",
      redirects: "Redirect[]",
      roles: "Role[]"
    };
    const responseType = interfaceMap[selectedEndpoint];

    return `import { ${responseType.replace('[]', '')} } from './types';

export async function fetchCmsPayload<T = ${responseType}>(
  endpoint: string,
  locale?: string
): Promise<T> {
  const queryParams = locale ? \`?locale=\${locale}\` : '';
  const url = \`https://api.cms.my-website.com/api/v1/\${endpoint}\${queryParams}\`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer apikey_production_live_992',
      'X-CMS-Client': 'Apex-TS-Sdk/v1.2.0'
    }
  });

  if (!res.ok) {
    throw new Error(\`Failed to resolve CMS payload at \${endpoint}. HTTP: \${res.status}\`);
  }

  // Exposed timestamp indicates latest cache model state
  const lastUpdated = res.headers.get('Last-Modified');
  console.log('API cache compiled at:', lastUpdated);

  return res.json() as Promise<T>;
}`;
  };

  const codeSnippets = [
    { title: "Shell cURL", lang: "curl", code: getCurlCode() },
    { title: "JavaScript ES6 Fetch", lang: "javascript", code: getJsCode() },
    { title: "TypeScript Implementation", lang: "typescript", code: getTsCode() }
  ];

  const handleSimulateRequest = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setTimestamp(new Date().toUTCString());
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-xs font-mono h-full" id="api-playground-root">
      
      {/* LEFT SIDE: Request Controls & Headers */}
      <div className="xl:col-span-5 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2 font-heading">
            <Network className="w-4 h-4 text-emerald-500" />
            <span>Interactive API Rest Console</span>
          </h4>

          {/* Endpoint pickers */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold block">Target API Endpoint</label>
            <div className="relative">
              <select 
                value={selectedEndpoint}
                onChange={(e) => {
                  setSelectedEndpoint(e.target.value as Endpoint);
                  handleSimulateRequest();
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-slate-200 select-none cursor-pointer outline-none focus:border-blue-500"
              >
                <option value="globalSettings">GET /api/v1/global-settings (branding / settings)</option>
                <option value="navigation">GET /api/v1/navigation (menus / CTA)</option>
                <option value="pages">GET /api/v1/pages (complete routes layout)</option>
                <option value="homePage">GET /api/v1/pages/home (index layout sections)</option>
                <option value="faqPage">GET /api/v1/pages/faq (help Center answers)</option>
                <option value="products">GET /api/v1/products (inventory, price tags)</option>
                <option value="posts">GET /api/v1/posts (articles markdown, cover alt)</option>
                <option value="redirects">GET /api/v1/redirects (redirect maps)</option>
                <option value="roles">GET /api/v1/roles (permissions matrix)</option>
              </select>
            </div>
          </div>

          {/* Translation resolution parameters binding */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold block">Locale Parameter Binding (?locale=)</label>
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => {
                  setActiveLangParam("all");
                  handleSimulateRequest();
                }}
                className={`py-1.5 rounded transition font-bold text-[10px] uppercase border text-center ${
                  activeLangParam === "all" 
                    ? 'bg-blue-600/10 border-blue-500/80 text-blue-405' 
                    : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-350 bg-slate-950'
                }`}
              >
                All (RAW)
              </button>
              {cmsDb.globalSettings.locales.map(loc => (
                <button
                  key={loc}
                  onClick={() => {
                    setActiveLangParam(loc);
                    handleSimulateRequest();
                  }}
                  className={`py-1.5 rounded transition font-bold text-[10px] uppercase border text-center ${
                    activeLangParam === loc 
                      ? 'bg-blue-600/10 border-blue-500/80 text-blue-450' 
                      : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {loc} Output
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-sans block pt-1">
              Selecting a concrete locale parameter automatically compiles localized content structures on edge compilation nodes.
            </p>
          </div>
        </div>

        {/* HTTP Headers Mock view */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h5 className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>HTTP Headers / Telemetry logs</span>
            </h5>
            <button 
              onClick={handleSimulateRequest}
              className={`p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition ${isSimulating ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] leading-relaxed">
            <div className="grid grid-cols-12 gap-1 text-slate-500 border-b border-slate-900 pb-1">
              <span className="col-span-4 font-bold">HTTP State</span>
              <span className="col-span-8 font-semibold text-emerald-400">200 OK</span>
            </div>
            <div className="grid grid-cols-12 gap-1 text-slate-550">
              <span className="col-span-4 font-bold text-slate-500">Content-Type</span>
              <span className="col-span-8 text-slate-300">application/json; charset=utf-8</span>
            </div>
            <div className="grid grid-cols-12 gap-1 text-slate-550">
              <span className="col-span-4 font-bold text-slate-500">Cache-Control</span>
              <span className="col-span-8 text-slate-300">public, s-maxage=60, stale-while-revalidate=30</span>
            </div>
            <div className="grid grid-cols-12 gap-1 text-slate-550">
              <span className="col-span-4 font-bold text-slate-500">Timing Latency</span>
              <span className="col-span-8 text-slate-200 font-bold">1.2ms (Edge Cache Hit)</span>
            </div>
            <div className="grid grid-cols-12 gap-1 text-slate-550">
              <span className="col-span-4 font-bold text-slate-500">Last-Modified</span>
              <span className="col-span-8 text-slate-300 text-[10px]">{timestamp}</span>
            </div>
          </div>
        </div>

        {/* Integration guides callout link */}
        <div className="bg-indigo-950/20 border border-indigo-900 p-4 rounded-xl flex gap-3">
          <Terminal className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-[11px] font-sans">
            <h5 className="font-bold text-indigo-200">How to establish connection?</h5>
            <p className="text-slate-400 leading-relaxed">
              Retrieve content via this standard restful output to nourish client pages dynamically. In production, utilize webhooks to invalidate static caches on draft publish!
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive JSON Schema / Response View */}
      <div className="xl:col-span-7 space-y-4">
        
        {/* URL Bar Simulation */}
        <div className="bg-slate-950 border border-slate-800 p-2 rounded-xl flex items-center justify-between gap-3 text-[11px] text-slate-305">
          <div className="flex items-center gap-2 flex-grow">
            <span className="bg-emerald-950 text-emerald-450 text-[10px] px-2 py-1.5 border border-emerald-900 rounded font-bold uppercase">
              GET
            </span>
            <span className="text-slate-500 select-none">https://api.cms.my-website.com</span>
            <span className="text-slate-200 font-bold truncate max-w-sm">{getEndpointPath()}</span>
          </div>

          <button 
            onClick={() => handleCopyClipboard(`https://api.cms.my-website.com${getEndpointPath()}`)}
            className="flex items-center gap-1.5 border border-slate-800 bg-slate-900 p-2 rounded text-[10px] text-slate-400 hover:text-white transition active:scale-95"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? "Copied" : "Copy Path"}</span>
          </button>
        </div>

        {/* JSON Display viewport */}
        <div className="flex flex-col rounded-xl border border-slate-800 overflow-hidden bg-slate-950/80 shadow-md">
          <div className="bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-slate-800">
            <h5 className="text-[11px] font-bold text-slate-300">HTTP Response Body (JSON UTF-8)</h5>
            <button 
              onClick={() => handleCopyClipboard(payloadString)}
              className="p-1.5 text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Data Payload</span>
            </button>
          </div>

          <div className="p-4 max-h-[360px] overflow-auto custom-scrollbar bg-slate-950" id="api-visual-json-viewer">
            {isSimulating ? (
              <div className="flex items-center justify-center py-20 text-slate-500 animate-pulse font-sans">
                <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-500" />
                <span>Triggering Edge payload request...</span>
              </div>
            ) : (
              <pre className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre pr-2 select-text">{payloadString}</pre>
            )}
          </div>
        </div>

        {/* Integration Code Snippets Carousel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-920 border-b border-slate-800 px-4 py-2.5">
            <h5 className="text-xs font-semibold text-slate-350 flex items-center gap-1.5 font-heading">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>Developer SDK / Client Integration</span>
            </h5>
          </div>

          <div className="p-1 bg-slate-950 flex flex-wrap gap-1 border-b border-slate-850">
            {codeSnippets.map((snippet, idx) => (
              <button
                key={idx}
                id={`snippet-tab-${snippet.lang}`}
                onClick={() => {
                  const el = document.getElementById(`snippet-content-${idx}`);
                  if (el) {
                    const shown = !el.classList.contains('hidden');
                    document.querySelectorAll('[id^="snippet-content-"]').forEach(con => con.classList.add('hidden'));
                    document.querySelectorAll('[id^="snippet-tab-"]').forEach(t => t.classList.remove('bg-slate-900', 'text-white'));
                    if (!shown) {
                      el.classList.remove('hidden');
                      document.getElementById(`snippet-tab-${snippet.lang}`)?.classList.add('bg-slate-900', 'text-white');
                    }
                  }
                }}
                className={`px-3 py-1.5 rounded transition text-[10px] font-bold ${
                  idx === 0 ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-320"
                }`}
              >
                {snippet.title}
              </button>
            ))}
          </div>

          <div className="bg-slate-950 max-h-[300px] overflow-auto p-4 relative font-mono text-[10.5px] leading-relaxed leading-5">
            {codeSnippets.map((snippet, i) => (
              <pre 
                key={i} 
                id={`snippet-content-${i}`}
                className={`text-slate-300 whitespace-pre ${i === 0 ? "" : "hidden"}`}
              >
                <code>{snippet.code}</code>
              </pre>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
