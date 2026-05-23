/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, FileCode, BookOpen, Layers, Terminal, Sparkles, AlertCircle } from 'lucide-react';

export default function IntegrationHelper() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const clientIntegrationCode = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Apex Headless CMS Integration Helper Client SDK
 * Save as: /lib/cms-client.ts
 */

import { 
  CmsDatabase, 
  GlobalSettings, 
  Navigation, 
  Page, 
  Product, 
  Post, 
  Localized 
} from './types';

export class HeadlessCmsClient {
  private apiEndpoint: string;
  private apiToken: string;
  private defaultLocale: string;

  constructor(endpoint: string, token: string, defaultLocale = 'en') {
    this.apiEndpoint = endpoint;
    this.apiToken = token;
    this.defaultLocale = defaultLocale;
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(\`\${this.apiEndpoint}\${path}\`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': \`Bearer \${this.apiToken}\`,
        'X-Client-SDK': 'Apex-SDK/v1.2.0'
      }
    });

    if (!response.ok) {
      throw new Error(\`CMS API Error [\${response.status}]: Failed to fetch path "\${path}".\`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Helper to compile localized translation paths, resolving fallbacks
   */
  public translate<T>(localized: Localized<T> | undefined | null, activeLocale: string): T {
    if (!localized) return "" as unknown as T;
    if (localized[activeLocale] !== undefined) {
      return localized[activeLocale];
    }
    if (localized[this.defaultLocale] !== undefined) {
      return localized[this.defaultLocale];
    }
    // Final defensive fallback: return first defined localization language
    return Object.values(localized)[0] || "" as unknown as T;
  }

  /**
   * a. Fetch Global Settings & apply styling tokens
   */
  public async getGlobalSettings(): Promise<GlobalSettings> {
    return this.request<GlobalSettings>('/api/v1/global-settings');
  }

  /**
   * b. Fetch Global Navigation menus
   */
  public async getNavigation(): Promise<Navigation> {
    return this.request<Navigation>('/api/v1/navigation');
  }

  /**
   * c. Resolve custom Page Route layouts by slug
   */
  public async getPageBySlug(slug: string, locale?: string): Promise<Page> {
    const localeFilter = locale ? \`?locale=\${locale}\` : '';
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
    return this.request<Page>(\`/api/v1/pages/\${cleanSlug || 'home'}\${localeFilter}\`);
  }

  /**
   * d. Get paginated products for catalog indexes
   */
  public async getProducts(categories?: string[]): Promise<Product[]> {
    const params = categories ? \`?categories=\${categories.join(',')}\` : '';
    return this.request<Product[]>(\`/api/v1/products\${params}\`);
  }

  /**
   * e. Fetch blog insights sorted and compiled
   */
  public async getBlogPosts(): Promise<Post[]> {
    return this.request<Post[]>('/api/v1/posts');
  }
}
`;

  const setupGuideHtml = `<!-- Render visual page components recursively by layout section Block type in your Frontend router -->
<div>
  {activeCmsPage.sections.map((section, index) => {
    switch (section.type) {
      case "hero":
        return <HeroComponent key={index} data={section} />;
      case "features":
        return <FeaturesGridComponent key={index} data={section} />;
      case "products":
        return <InventoryCarouselComponent key={index} data={section} limit={section.limit} />;
      case "testimonials":
        return <TestimonialsGridComponent key={index} data={section} />;
      case "faqs":
        return <FaqsAccordionComponent key={index} data={section} />;
      case "contactForm":
        return <ValidatedFormComponent key={index} formId={section.formId} data={section} />;
      default:
        console.warn(\`Unmapped CMS structural layout section type: \${section.type}\`);
        return null;
    }
  })}
</div>`;

  return (
    <div className="space-y-6 text-slate-300 font-sans" id="headless-developer-guide">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="p-1 rounded bg-slate-800 text-blue-400 font-mono text-[10px] uppercase font-bold tracking-wider">
            Sitemap Blueprint & Typings
          </span>
          <h2 className="text-lg font-bold text-slate-100 font-heading">
            Connect "My Website" to the Headless CMS API
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Follow this architect-approved integration protocol to safely fetch settings, resolve responsive layout structures, handle multi-language translations, and support SEO.
          </p>
        </div>
        <BookOpen className="w-10 h-10 text-blue-500/20 hidden md:block" />
      </div>

      {/* Structured Guidelines Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 border-b border-slate-850 pb-2 font-heading">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Connection Protocol</span>
          </h3>

          <ol className="space-y-4 relative pl-3 border-l border-slate-800 text-xs">
            <li className="space-y-1 relative" id="guide-step-a">
              <span className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-slate-900"></span>
              <strong className="text-slate-200 block text-[11px] font-mono">1. Boot Global Tokens (app init)</strong>
              <p className="text-slate-400 leading-relaxed">
                Fetch <code className="text-blue-400 font-mono text-[10px]">globalSettings</code> at startup. Inject dynamic brand guidelines (primary hex, headings font, analytics ID, cookie banner text) globally.
              </p>
            </li>

            <li className="space-y-1 relative" id="guide-step-b">
              <span className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-emerald-650 ring-4 ring-slate-900"></span>
              <strong className="text-slate-200 block text-[11px] font-mono">2. Build Header Menu</strong>
              <p className="text-slate-400 leading-relaxed">
                Pull <code className="text-emerald-450 font-mono text-[10px]">navigation</code> metadata and render your global menus, validating nested links and target variables recursively.
              </p>
            </li>

            <li className="space-y-1 relative" id="guide-step-c">
              <span className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-indigo-650 ring-4 ring-slate-900"></span>
              <strong className="text-slate-200 block text-[11px] font-mono">3. Dynamic Slug Routing</strong>
              <p className="text-slate-400 leading-relaxed">
                On route changes, bind path parameter slug, call <code className="text-indigo-400 font-mono text-[10px]">/pages/:slug?locale=pt</code>, and loop through content block list arrays (sections).
              </p>
            </li>

            <li className="space-y-1 relative" id="guide-step-d">
              <span className="absolute -left-5 top-0 w-3 h-3 rounded-full bg-pink-650 ring-4 ring-slate-900"></span>
              <strong className="text-slate-200 block text-[11px] font-mono">4. Mount Global Footer</strong>
              <p className="text-slate-400 leading-relaxed">
                Evaluate legal terms, copyrighted text templates, social link arrays and newsletter capture targets dynamically at footer elements.
              </p>
            </li>
          </ol>
        </div>

        {/* Integration Client SDK Code block */}
        <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-800 overflow-hidden bg-slate-950 shadow-md">
          <div className="bg-slate-900 px-5 py-3 flex justify-between items-center border-b border-slate-800">
            <h4 className="text-xs font-semibold text-slate-350 flex items-center gap-1.5 font-heading">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Copyable TypeScript CMS Client SDK</span>
            </h4>
            <button
              onClick={() => handleCopyClipboard("sdk", clientIntegrationCode)}
              className="flex items-center gap-1 bg-slate-800 px-3 py-1 text-[10px] text-slate-300 rounded border border-slate-700 hover:text-white transition"
            >
              {copiedSection === "sdk" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === "sdk" ? "Copied" : "Copy SDK"}</span>
            </button>
          </div>

          <div className="p-4 max-h-[440px] overflow-auto custom-scrollbar font-mono text-[10.5px] leading-relaxed leading-5">
            <pre className="text-slate-300"><code>{clientIntegrationCode}</code></pre>
          </div>
        </div>
      </div>

      {/* Frontend Router Layout code block */}
      <div className="flex flex-col rounded-xl border border-slate-800 overflow-hidden bg-slate-950 shadow-md">
        <div className="bg-slate-900 px-5 py-3 flex justify-between items-center border-b border-slate-800">
          <h4 className="text-xs font-semibold text-slate-350 flex items-center gap-1.5 font-heading">
            <FileCode className="w-4 h-4 text-amber-500" />
            <span>Structured Section Routing (Frontend Side)</span>
          </h4>
          <button
            onClick={() => handleCopyClipboard("router", setupGuideHtml)}
            className="flex items-center gap-1 bg-slate-800 px-3 py-1 text-[10px] text-slate-300 rounded border border-slate-700 hover:text-white transition"
          >
            {copiedSection === "router" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === "router" ? "Copy Code" : "Copy Code"}</span>
          </button>
        </div>

        <div className="p-4 max-h-56 overflow-auto custom-scrollbar font-mono text-[10.5px] leading-relaxed leading-5 bg-slate-950">
          <pre className="text-slate-300"><code>{setupGuideHtml}</code></pre>
        </div>
      </div>

      {/* Security alert / best practices footer */}
      <div className="bg-emerald-950/20 border border-emerald-900/60 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-400">
        <AlertCircle className="w-5 h-5 text-emerald-555 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-emerald-250 font-bold">Headless CDN Best Practice</strong>
          <p>
            Always configure a secondary Cache Invalidation webhook on publish updates. When content architects publish changes in this back-office dashboard, the webhook should purge global edge servers instantaneously to prevent stale-state payloads.
          </p>
        </div>
      </div>
    </div>
  );
}
