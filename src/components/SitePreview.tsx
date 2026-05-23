/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CmsDatabase, Page, Section, Product, Post, Localized } from '../types';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SitePreviewProps {
  cmsDb: CmsDatabase;
  currentLocale: string;
}

export default function SitePreview({ cmsDb, currentLocale }: SitePreviewProps) {
  const [currentRoute, setCurrentRoute] = useState<string>("/");
  const [cartCount, setCartCount] = useState<number>(0);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  
  // Simulated form submission and newsletter states
  const [formSubmissions, setFormSubmissions] = useState<any[]>([]);
  const [formSuccessAlert, setFormSuccessAlert] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterSuccess, setNewsletterSuccess] = useState<boolean>(false);

  // Quick lookup helper for translations
  const t = <T extends any>(localized: Localized<T> | undefined | null, fallbackValue: T): T => {
    if (!localized) return fallbackValue;
    return localized[currentLocale] !== undefined 
      ? localized[currentLocale] as T 
      : (localized[cmsDb.globalSettings.defaultLocale] !== undefined 
          ? localized[cmsDb.globalSettings.defaultLocale] as T 
          : Object.values(localized)[0] as T);
  };

  // Find active simulated Page
  const activePage = cmsDb.pages.find(p => p.slug === currentRoute) || cmsDb.pages.find(p => p.id === "page-home")!;

  // Dynamic Styles Injector for Primary/Secondary colors and custom Fonts
  const primaryHex = cmsDb.globalSettings.primaryColor;
  const secondaryHex = cmsDb.globalSettings.secondaryColor;

  const fontHeadingStyle = {
    fontFamily: 
      cmsDb.globalSettings.fontHeading === "Space Grotesk" ? "'Space Grotesk', sans-serif" :
      cmsDb.globalSettings.fontHeading === "Playfair Display" ? "'Playfair Display', serif" :
      cmsDb.globalSettings.fontHeading === "SFMono-Regular" ? "'SFMono-Regular', monospace" :
      cmsDb.globalSettings.fontHeading === "Inter" ? "'Inter', sans-serif" : "inherit"
  };

  const fontBodyStyle = {
    fontFamily: 
      cmsDb.globalSettings.fontBody === "Space Grotesk" ? "'Space Grotesk', sans-serif" :
      cmsDb.globalSettings.fontBody === "Playfair Display" ? "'Playfair Display', serif" :
      cmsDb.globalSettings.fontBody === "SFMono-Regular" ? "'SFMono-Regular', monospace" :
      cmsDb.globalSettings.fontBody === "Inter" ? "'Inter', sans-serif" : "inherit"
  };

  // Render a Lucide Icon dynamically from name string
  const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const IconComponent = (Icons as any)[name];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    // Fallback icon
    return <Icons.Sparkles className={className} />;
  };

  // Handle lead submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>, formId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const newSub = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      formId,
      submittedAt: new Date().toISOString(),
      payload: data
    };

    setFormSubmissions([newSub, ...formSubmissions]);
    
    const matchedForm = cmsDb.forms.find(f => f.id === formId);
    const successMsg = matchedForm ? t(matchedForm.successMessage, "Successfully submitted.") : "Submitted.";
    setFormSuccessAlert(successMsg);
    e.currentTarget.reset();
    
    setTimeout(() => {
      setFormSuccessAlert(null);
    }, 5000);
  };

  return (
    <div 
      className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
      id="custom-site-preview-root"
      style={fontBodyStyle}
    >
      {/* Inject user-defined custom CSS overrides */}
      {cmsDb.globalSettings.customCss && (
        <style dangerouslySetInnerHTML={{ __html: cmsDb.globalSettings.customCss }} />
      )}
      
      {/* Route Simulator Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-bold">
            Live Connected Frontend
          </span>
        </div>

        {/* Path router buttons mimicking sitemap structure */}
        <div className="flex items-center gap-1.5 flex-wrap" id="simulated-browser-address-bar">
          {cmsDb.pages.map(p => {
            const isActive = currentRoute === p.slug;
            return (
              <button
                key={p.id}
                id={`preview-route-${p.id}`}
                onClick={() => setCurrentRoute(p.slug)}
                className={`px-3 py-1 text-xs rounded transition flex items-center gap-1.5 font-medium ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/40 ring-1 ring-blue-500/20' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100'
                }`}
              >
                <span>{t(p.title, p.id)}</span>
                <span className="text-[9px] text-slate-505 font-mono">{p.slug}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-450 flex items-center gap-1.5">
            <Icons.Globe className="w-4 h-4 text-emerald-500" />
            <span className="uppercase font-bold text-slate-300 font-mono text-[11px]">{currentLocale} simulation</span>
          </span>
          <div className="relative text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded flex items-center gap-1.5">
            <Icons.ShoppingCart className="w-3.5 h-3.5 text-blue-400" />
            <span>Bag</span>
            <span className="font-mono bg-blue-600 text-white font-bold text-[9px] rounded-full px-1.5 py-0.5 ml-1">{cartCount}</span>
          </div>
        </div>
      </div>

      {/* RENDERED WEBSITE PREVIEW CONTENT */}
      <div className="bg-slate-900 text-slate-100 min-h-[500px] select-none text-sm transition-colors relative">
        
        {/* HEADER SECTION */}
        <header 
          className={`px-6 py-4 border-b border-slate-800 flex items-center justify-between ${
            cmsDb.navigation.stickyHeader ? 'sticky top-0 bg-slate-950/90 backdrop-blur z-20' : 'relative bg-slate-950'
          }`}
          id="preview-site-header"
        >
          <div className="flex items-center gap-3">
            {cmsDb.globalSettings.logoUrl ? (
              <img 
                src={cmsDb.globalSettings.logoUrl} 
                alt="CMS Logo" 
                referrerPolicy="no-referrer"
                className="h-7 w-auto object-contain brightness-110" 
              />
            ) : (
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                <Icons.Layers className="w-5 h-5 text-blue-500" />
                <span>{t(cmsDb.globalSettings.siteName, "My Website")}</span>
              </span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-6" id="preview-site-nav">
            {cmsDb.navigation.items.map((nav, i) => (
              <button 
                key={i}
                onClick={() => setCurrentRoute(nav.href)}
                className={`text-slate-300 hover:text-white transition text-xs font-semibold ${
                  currentRoute === nav.href ? 'text-blue-400 border-b-2 border-blue-500 pb-0.5' : ''
                }`}
              >
                {t(nav.label, "")}
              </button>
            ))}
          </nav>

          <div>
            <button 
              onClick={() => setCurrentRoute(cmsDb.navigation.ctaHref)}
              style={{
                backgroundColor: cmsDb.navigation.ctaStyle === "primary" ? secondaryHex : 'transparent',
                borderColor: secondaryHex,
                borderWidth: '1px'
              }}
              className="text-xs text-white font-bold px-4 py-2 rounded-lg transition hover:brightness-110"
              id="preview-site-cta"
            >
              {t(cmsDb.navigation.ctaLabel, "Get Access")}
            </button>
          </div>
        </header>

        {/* MAIN BODY PAGES AND SECTIONS */}
        <main className="pb-16" id="preview-site-page-sections">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage.id + currentLocale}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activePage.sections.length === 0 ? (
                <div className="p-16 text-center text-slate-500">
                  <Icons.LayoutGrid className="w-12 h-12 mx-auto mb-3" />
                  <p>This route currently includes 0 configured section structures in metadata.</p>
                </div>
              ) : (
                activePage.sections.map((section, idx) => {
                  
                  // REUSABLE PAGE SECTIONS

                  // SECTION: HERO
                  if (section.type === "hero") {
                    const opacity = section.overlayOpacity !== undefined ? section.overlayOpacity : 0.5;
                    const layout = section.layout || "centered";
                    return (
                      <section 
                        key={idx}
                        className="relative min-h-[420px] flex items-center justify-center px-8 py-16 overflow-hidden border-b border-slate-850"
                        style={{
                          backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {/* Dim Overlay */}
                        <div 
                          className="absolute inset-0 bg-slate-950" 
                          style={{ opacity: opacity }}
                        ></div>

                        <div 
                          className={`relative z-10 w-full max-w-4xl text-white ${
                            layout === "left" ? "text-left" : layout === "right" ? "text-right" : "text-center"
                          }`}
                        >
                          <h1 
                            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-50"
                            style={fontHeadingStyle}
                          >
                            {t(section.headline, "")}
                          </h1>
                          <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-2xl leading-relaxed mx-auto">
                            {t(section.subheadline, "")}
                          </p>
                          <div className={`flex flex-wrap items-center gap-3 ${
                            layout === "left" ? "justify-start" : layout === "right" ? "justify-end" : "justify-center"
                          }`}>
                            <button
                              onClick={() => {
                                if (section.ctaPrimary?.href) {
                                  setCurrentRoute(section.ctaPrimary.href);
                                }
                              }}
                              style={{ backgroundColor: secondaryHex }}
                              className="preview-btn-primary px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-lg hover:brightness-110 transition cursor-pointer"
                            >
                              {t(section.ctaPrimary?.label, "Explore")}
                            </button>
                            {section.ctaSecondary && (
                              <button
                                onClick={() => {
                                  if (section.ctaSecondary?.href) {
                                    setCurrentRoute(section.ctaSecondary.href);
                                  }
                                }}
                                className="preview-btn-secondary px-5 py-2.5 rounded-lg text-xs font-bold bg-slate-850/80 hover:bg-slate-800 text-slate-100 border border-slate-700 transition"
                              >
                                {t(section.ctaSecondary.label, "Contact")}
                              </button>
                            )}
                          </div>
                        </div>
                      </section>
                    );
                  }

                  // SECTION: FEATURES
                  if (section.type === "features") {
                    return (
                      <section key={idx} className="px-6 py-16 bg-slate-950 border-b border-slate-850">
                        <div className="max-w-4xl mx-auto text-center col-span-full mb-12">
                          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-100 mb-3">{t(section.headline, "")}</h2>
                          <p className="text-slate-400 text-xs sm:text-sm">{t(section.subtitle, "")}</p>
                        </div>

                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                          {section.items?.map((feat, i) => (
                            <div key={i} className="preview-custom-card-hover p-5 rounded-xl bg-slate-900 border border-slate-850 space-y-3 transition-all duration-300">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                <DynamicIcon name={feat.icon} className="w-4 h-4 text-blue-400" />
                              </div>
                              <h3 className="text-xs font-bold text-slate-20s">{t(feat.title, "")}</h3>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{t(feat.description, "")}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  // SECTION: PRODUCTS
                  if (section.type === "products") {
                    const limit = section.limit || 3;
                    const itemsToShow = cmsDb.products.slice(0, limit);
                    
                    return (
                      <section key={idx} className="px-6 py-16 bg-slate-900/40 border-b border-slate-850">
                        <div className="max-w-4xl mx-auto text-center col-span-full mb-12">
                          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-100 mb-3">{t(section.headline, "")}</h2>
                          <p className="text-slate-400 text-xs sm:text-sm">{t(section.subtitle, "")}</p>
                        </div>

                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                          {itemsToShow.map(prod => (
                            <div key={prod.id} className="preview-custom-card-hover p-5 rounded-xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row gap-4 items-start justify-between transition-all duration-300">
                              <img 
                                src={prod.images[0]?.url || "https://images.unsplash.com/photo-1546074177-3a9617ad34c5?auto=format&fit=crop&w=150&q=80"} 
                                alt={prod.images[0]?.alt || "Product thumbnail"} 
                                referrerPolicy="no-referrer"
                                className="w-24 h-24 rounded-lg object-cover bg-slate-900 flex-shrink-0" 
                              />
                              <div className="space-y-2 flex-grow">
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-200">{t(prod.title, "")}</h4>
                                    <span className="text-[9px] font-mono p-1 rounded bg-slate-900 text-slate-500">SKU: {prod.sku}</span>
                                  </div>
                                  <span className="font-mono text-xs font-bold text-amber-400">${prod.price}</span>
                                </div>
                                <div 
                                  className="text-[11px] text-slate-450 leading-relaxed max-w-sm font-sans line-clamp-3"
                                  dangerouslySetInnerHTML={{ __html: t(prod.description, "") }}
                                ></div>
                                <button
                                  onClick={() => {
                                    setCartCount(prev => prev + 1);
                                  }}
                                  className="text-[10px] bg-blue-600/10 border border-blue-500/40 text-blue-400 px-3 py-1 rounded transition hover:bg-blue-600 hover:text-white"
                                >
                                  Add to Inventory Bag
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  // SECTION: TESTIMONIALS
                  if (section.type === "testimonials") {
                    return (
                      <section key={idx} className="px-6 py-16 bg-slate-950 border-b border-slate-850">
                        <div className="max-w-4xl mx-auto text-center col-span-full mb-12">
                          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-100 mb-3">{t(section.headline, "")}</h2>
                          <p className="text-slate-400 text-xs sm:text-sm">{t(section.subtitle, "")}</p>
                        </div>

                        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                          {cmsDb.testimonials.filter(it => it.featured).map(item => (
                            <div key={item.id} className="p-5 rounded-xl bg-slate-900 border border-slate-850 space-y-4">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: item.rating || 5 }).map((_, i) => (
                                  <Icons.Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                ))}
                              </div>
                              <p className="text-[11px] sm:text-xs text-slate-300 italic font-sans leading-relaxed">
                                "{t(item.quote, "")}"
                              </p>
                              <div className="flex items-center gap-3 border-t border-slate-850 pt-3">
                                {item.authorAvatar?.url && (
                                  <img 
                                    src={item.authorAvatar.url} 
                                    alt={item.authorAvatar.alt} 
                                    referrerPolicy="no-referrer"
                                    className="w-8 h-8 rounded-full object-cover" 
                                  />
                                )}
                                <div>
                                  <strong className="text-[10px] block text-slate-200">{item.authorName}</strong>
                                  <span className="text-[9px] text-slate-400">{t(item.authorRole, "")}, {item.authorCompany}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  }

                  // SECTION: FAQS
                  if (section.type === "faqs") {
                    return (
                      <section key={idx} className="px-6 py-16 bg-slate-900 border-b border-slate-850">
                        <div className="max-w-4xl mx-auto text-center col-span-full mb-12">
                          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-100 mb-3">{t(section.headline, "")}</h2>
                          <span className="text-slate-500 text-xs font-mono">Collapse Module payload</span>
                        </div>

                        <div className="max-w-3xl mx-auto space-y-2">
                          {cmsDb.faqs.map(faq => {
                            const isExpanded = expandedFaqId === faq.id;
                            return (
                              <div 
                                key={faq.id} 
                                className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950 transition"
                              >
                                <button
                                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                                  className="w-full text-left px-4 py-3 flex justify-between items-center bg-slate-950 hover:bg-slate-900/60 transition"
                                >
                                  <span className="text-xs font-semibold text-slate-200 font-sans">{t(faq.question, "")}</span>
                                  {isExpanded ? (
                                    <Icons.ChevronUp className="w-4 h-4 text-slate-500" />
                                  ) : (
                                    <Icons.ChevronDown className="w-4 h-4 text-slate-500" />
                                  )}
                                </button>
                                
                                {isExpanded && (
                                  <div className="p-4 border-t border-slate-900 text-slate-300 text-xs leading-relaxed font-sans bg-slate-950">
                                    {t(faq.answer, "")}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    );
                  }

                  // SECTION: CONTACT FORM
                  if (section.type === "contactForm") {
                    const activeForm = cmsDb.forms.find(f => f.id === section.formId) || cmsDb.forms[0];
                    if (!activeForm) return null;

                    return (
                      <section key={idx} className="px-6 py-16 bg-slate-950 border-b border-slate-850">
                        <div className="max-w-xl mx-auto text-center col-span-full mb-8">
                          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-100 mb-3">{t(section.headline, "")}</h2>
                          <p className="text-slate-400 text-xs font-mono">Linked Form: {activeForm.name}</p>
                        </div>

                        <div className="max-w-lg mx-auto bg-slate-900 border border-slate-850 p-6 rounded-xl shadow-sm">
                          {formSuccessAlert ? (
                            <div className="bg-emerald-950 border border-emerald-900 text-emerald-400 p-4 rounded-lg text-xs leading-relaxed text-center">
                              <Icons.CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-500-400" />
                              <span>{formSuccessAlert}</span>
                            </div>
                          ) : (
                            <form onSubmit={(e) => handleFormSubmit(e, activeForm.id)} className="space-y-4">
                              {activeForm.fields.map(field => (
                                <div key={field.id} className="space-y-1 text-xs">
                                  <label className="text-slate-350 block font-bold">
                                    {t(field.label, "")}
                                    {field.required && <span className="text-rose-500 ml-1">*</span>}
                                  </label>

                                  {field.type === "textarea" ? (
                                    <textarea 
                                      name={field.id}
                                      required={field.required}
                                      placeholder={t(field.placeholder, "")}
                                      rows={2}
                                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-slate-200"
                                    />
                                  ) : field.type === "select" ? (
                                    <select 
                                      name={field.id}
                                      required={field.required}
                                      className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300"
                                    >
                                      {field.options?.map((opt, i) => (
                                        <option key={i} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  ) : field.type === "checkbox" ? (
                                    <div className="flex gap-2 items-start mt-1">
                                      <input 
                                        type="checkbox"
                                        id={field.id}
                                        name={field.id}
                                        required={field.required}
                                        className="rounded text-blue-600 bg-slate-950 border-slate-850" 
                                      />
                                      <span className="text-[11px] text-slate-400 leading-none">{t(field.label, "")}</span>
                                    </div>
                                  ) : (
                                    <input 
                                      type={field.type}
                                      name={field.id}
                                      required={field.required}
                                      placeholder={t(field.placeholder, "")}
                                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-slate-200"
                                    />
                                  )}
                                </div>
                              ))}

                              <button
                                type="submit"
                                style={{ backgroundColor: primaryHex }}
                                className="w-full text-xs font-bold text-slate-200 tracking-wider hover:brightness-110 cursor-pointer block border border-slate-705 py-2 px-4 rounded-lg mt-4 shadow-sm"
                              >
                                {t(activeForm.submitLabel, "Submit")}
                              </button>
                            </form>
                          )}
                        </div>
                      </section>
                    );
                  }

                  return null;
                })
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* FOOTER SECTION */}
        <footer className="bg-slate-950 border-t border-slate-800 py-12 px-6 text-xs text-slate-400" id="preview-site-footer">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <strong className="text-white text-xs block">{t(cmsDb.globalSettings.siteName, "My Website")}</strong>
              <p className="text-[11px] leading-relaxed text-slate-500 font-sans">{t(cmsDb.globalSettings.defaultMetaDescription, "")}</p>
            </div>

            {cmsDb.footer.columns.map((col, i) => (
              <div key={i} className="space-y-3">
                <strong className="text-white text-[10px] tracking-widest uppercase font-mono">{t(col.heading, "")}</strong>
                <ul className="space-y-1.5">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => setCurrentRoute(link.href)}
                        className="hover:text-white transition text-left block text-[11px]"
                      >
                        {t(link.label, "")}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {cmsDb.footer.newsletterEnabled && (
              <div className="space-y-3" id="footer-newsletter-card">
                <strong className="text-white text-[10px] tracking-widest uppercase font-mono">Newsletter</strong>
                {newsletterSuccess ? (
                  <div className="text-[11px] text-emerald-450 font-bold bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40">
                    Sinc verified! Email registered successfully.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <input 
                      type="email" 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t(cmsDb.footer.newsletterPlaceholder, "Work email...")}
                      className="w-full bg-slate-900 border border-slate-850 px-2 rounded py-1.5 text-[10px]"
                    />
                    <button
                      onClick={() => {
                        if (newsletterEmail.trim() === "") return;
                        setNewsletterSuccess(true);
                        setNewsletterEmail("");
                      }}
                      className="w-full text-xs font-bold text-center border border-slate-700 bg-slate-900 text-white rounded py-1 transition hover:bg-slate-800"
                    >
                      Subscribe
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="max-w-5xl mx-auto border-t border-slate-900 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
            <span>{t(cmsDb.footer.copyrightText, "")}</span>
            <div className="flex gap-4">
              {cmsDb.footer.legalLinks.map((ll, i) => (
                <button key={i} className="hover:text-white">{t(ll.label, "")}</button>
              ))}
            </div>
          </div>
        </footer>

        {/* Dynamic Cookie Banner simulation */}
        {cmsDb.globalSettings.cookieBannerEnabled && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 shadow-2xl z-40 max-w-4xl mx-auto text-xs font-mono">
            <span className="text-slate-350">{t(cmsDb.globalSettings.cookieBannerText, "")}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const cb = { ...cmsDb.globalSettings, cookieBannerEnabled: false };
                  handleUpdate({ ...cmsDb, globalSettings: cb } as any);
                }}
                className="bg-blue-600 font-bold text-white text-[10px] px-3 py-1.5 rounded uppercase"
              >
                Accept Headers
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Server Submissions Log Panel */}
      <div className="bg-slate-950 p-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <Icons.Inbox className="w-4 h-4 text-cyan-400 animate-none" />
          <span>Simulated CMS Server Form Inbox ({formSubmissions.length} events logged)</span>
        </h4>
        
        {formSubmissions.length > 0 ? (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {formSubmissions.map((sub, i) => (
              <div key={i} className="p-3 rounded bg-slate-900 border border-slate-850 font-mono text-[10px] space-y-1.5">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-850 pb-1.5">
                  <span className="font-bold text-cyan-400">ID: {sub.id} (Form: {sub.formId})</span>
                  <span>{new Date(sub.submittedAt).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 leading-relaxed">
                  {Object.entries(sub.payload).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500 font-bold">{k}:</span> <span className="text-slate-300">{v as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-600 select-none italic text-center py-6 border border-dashed border-slate-850 rounded-lg">
            No submissions caught yet. Submit the Contact Us form section above to inspect JSON structured inputs in real-time.
          </p>
        )}
      </div>
    </div>
  );

  // Fallback handle localized update
  function handleUpdate(updatedDb: CmsDatabase) {
    // Parent update is handled by changing states recursively on CMS Console edits
  }
}
