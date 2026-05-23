/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Localized Type representation.
 * Every text-bearing field supports multi-language values as an object.
 * e.g., { "en": "Hello", "fr": "Bonjour", "pt": "Olá" }
 */
export type Localized<T = string> = {
  [locale: string]: T;
};

/**
 * Helper to get active translation with fallback
 */
export function getTranslation(localized: Localized<string> | undefined | null, locale: string, defaultLocale = 'en'): string {
  if (!localized) return '';
  return localized[locale] || localized[defaultLocale] || Object.values(localized)[0] || '';
}

export interface ImageObject {
  url: string;
  alt: string; // Required, never empty
  width: number;
  height: number;
  caption?: Localized<string>;
  srcSet?: {
    "640w"?: string;
    "1280w"?: string;
    "1920w"?: string;
  };
}

export interface VideoEmbed {
  provider: "youtube" | "vimeo" | "custom";
  videoId?: string;
  customUrl?: string;
  posterImage?: ImageObject;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
}

export interface GlobalSettings {
  siteName: Localized<string>;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  fontHeading: string;
  fontBody: string;
  defaultMetaTitle: Localized<string>;
  defaultMetaDescription: Localized<string>;
  googleAnalyticsId?: string;
  cookieBannerEnabled: boolean;
  cookieBannerText: Localized<string>;
  defaultLocale: string;
  locales: string[]; // list of active language codes, e.g. ["en", "fr", "pt"]
  lastUpdatedAt: string;
}

export interface NavItem {
  label: Localized<string>;
  href: string;
  openInNewTab: boolean;
  children: NavItem[];
}

export interface Navigation {
  items: NavItem[];
  ctaLabel: Localized<string>;
  ctaHref: string;
  ctaStyle: "primary" | "secondary" | "outline";
  stickyHeader: boolean;
  transparentOnHero: boolean;
  lastUpdatedAt: string;
}

export type SectionType = "hero" | "features" | "products" | "blog" | "testimonials" | "faqs" | "contactForm";

export interface HeroSectionBlock {
  type: "hero";
  headline: Localized<string>;
  subheadline: Localized<string>;
  ctaPrimary: { label: Localized<string>; href: string };
  ctaSecondary?: { label: Localized<string>; href: string };
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity: number; // 0-1
  layout: "centered" | "left" | "right";
}

export interface FeaturesSectionBlock {
  type: "features";
  headline: Localized<string>;
  subtitle: Localized<string>;
  items: {
    icon: string; // lucide icon name
    title: Localized<string>;
    description: Localized<string>;
  }[];
}

export interface ProductsSectionBlock {
  type: "products";
  headline: Localized<string>;
  subtitle: Localized<string>;
  limit: number;
}

export interface BlogSectionBlock {
  type: "blog";
  headline: Localized<string>;
  subtitle: Localized<string>;
  limit: number;
}

export interface TestimonialsSectionBlock {
  type: "testimonials";
  headline: Localized<string>;
  subtitle: Localized<string>;
}

export interface FaqsSectionBlock {
  type: "faqs";
  headline: Localized<string>;
}

export interface ContactFormSectionBlock {
  type: "contactForm";
  headline: Localized<string>;
  formId: string;
}

export type Section = 
  | HeroSectionBlock 
  | FeaturesSectionBlock 
  | ProductsSectionBlock 
  | BlogSectionBlock 
  | TestimonialsSectionBlock 
  | FaqsSectionBlock 
  | ContactFormSectionBlock;

export interface Page {
  id: string;
  title: Localized<string>;
  slug: string; // e.g. "/about" or "/"
  status: "draft" | "published";
  metaTitle: Localized<string>;
  metaDescription: Localized<string>;
  ogImage: string;
  sections: Section[];
  createdAt: string; // ISO Code
  updatedAt: string; // ISO Code
  lastUpdatedAt: string;
}

export interface FooterColumn {
  heading: Localized<string>;
  links: { label: Localized<string>; href: string }[];
}

export interface Footer {
  columns: FooterColumn[];
  socialLinks: { platform: "twitter" | "instagram" | "linkedin" | "youtube" | "github"; url: string }[];
  copyrightText: Localized<string>;
  legalLinks: { label: Localized<string>; href: string }[];
  newsletterEnabled: boolean;
  newsletterPlaceholder: Localized<string>;
  lastUpdatedAt: string;
}

export interface Post {
  id: string;
  title: Localized<string>;
  slug: string;
  status: "draft" | "published";
  publishedAt: string; // ISO
  author: string; // Reference Author ID
  categories: string[];
  tags: string[];
  featuredImage: ImageObject;
  excerpt: Localized<string>;
  body: Localized<string>; // HTML string
  readingTimeMinutes: number;
  relatedPosts: string[]; // post IDs
  lastUpdatedAt: string;
}

export interface Author {
  id: string;
  name: string;
  role: Localized<string>;
  bio: Localized<string>;
  avatar: ImageObject;
  socialLinks: { platform: string; url: string }[];
  email?: string;
  lastUpdatedAt: string;
}

export interface Testimonial {
  id: string;
  quote: Localized<string>;
  authorName: string;
  authorRole: Localized<string>;
  authorCompany: string;
  authorAvatar?: ImageObject;
  rating?: number; // 1-5
  featured: boolean;
  lastUpdatedAt: string;
}

export interface FaqItem {
  id: string;
  question: Localized<string>;
  answer: Localized<string>; // RichText
  category?: Localized<string>;
  order: number;
  lastUpdatedAt: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  title: Localized<string>;
  slug: string;
  description: Localized<string>; // RichText
  price: number;
  compareAtPrice?: number;
  currency: string; // ISO e.g "USD", "BRL"
  images: ImageObject[];
  sku: string;
  inventory: number;
  variants: ProductVariant[];
  categories: string[];
  featured: boolean;
  status: "active" | "archived";
  lastUpdatedAt: string;
}

export interface FormField {
  id: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  label: Localized<string>;
  placeholder: Localized<string>;
  required: boolean;
  options: string[]; // For select types
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
  submitLabel: Localized<string>;
  successMessage: Localized<string>;
  redirectUrl?: string;
  notifyEmail: string;
  lastUpdatedAt: string;
}

export interface SeoBlock {
  metaTitle: Localized<string>;
  metaDescription: Localized<string>;
  canonicalUrl: string;
  ogTitle: Localized<string>;
  ogDescription: Localized<string>;
  ogImage: ImageObject;
  twitterCard: "summary" | "summary_large_image";
  noIndex: boolean;
  noFollow: boolean;
  structuredData?: string; // JSON-LD string
}

export interface Redirect {
  id: string;
  from: string;
  to: string;
  statusCode: 301 | 302;
  enabled: boolean;
  lastUpdatedAt: string;
}

export interface Role {
  id: string;
  name: "admin" | "editor" | "viewer" | string;
  permissions: {
    module: string;
    actions: ("read" | "create" | "update" | "delete")[];
  }[];
  lastUpdatedAt: string;
}

export interface CmsDatabase {
  globalSettings: GlobalSettings;
  navigation: Navigation;
  pages: Page[];
  footer: Footer;
  posts: Post[];
  authors: Author[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  products: Product[];
  forms: Form[];
  redirects: Redirect[];
  roles: Role[];
}
