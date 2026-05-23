/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CmsDatabase } from "./types";

const nowISO = "2026-05-23T02:00:00Z";

export const initialCmsDatabase: CmsDatabase = {
  globalSettings: {
    siteName: {
      en: "Apex Enterprise",
      fr: "Apex Entreprise",
      pt: "Apex Industrial"
    },
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=40&q=80",
    faviconUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=32&h=32&q=80",
    primaryColor: "#0f172a", // slate 900
    secondaryColor: "#3b82f6", // blue 500
    fontHeading: "Space Grotesk",
    fontBody: "Inter",
    defaultMetaTitle: {
      en: "Apex Enterprise | Next-Gen Cloud Platform",
      fr: "Apex Entreprise | Plateforme Cloud de Nouvelle Génération",
      pt: "Apex Industrial | Plataforma Cloud de Próxima Geração"
    },
    defaultMetaDescription: {
      en: "An API-first serverless framework designed to support headless integration patterns securely.",
      fr: "Un framework serverless orientée API conçu pour prendre en charge les modèles d'intégration headless.",
      pt: "Um framework serverless focado em API projetado para suportar padrões de integração headless."
    },
    googleAnalyticsId: "G-HEADLESS99",
    cookieBannerEnabled: true,
    cookieBannerText: {
      en: "We use essential analytics cookies to optimize headless cache invalidation. Accept parameters?",
      fr: "Nous utilisons des cookies analytiques pour optimiser l'invalidation du cache. Accepter?",
      pt: "Usamos cookies de analytics essenciais para otimizar invalidação de cache. Aceitar?"
    },
    defaultLocale: "en",
    locales: ["en", "fr", "pt"],
    customCss: `/* Custom CSS Override - Target elements inside the Preview website! */\n/* Example below: uncomment to try */\n\n/*\n.preview-hero-badge {\n  animation: pulse 2s infinite;\n  box-shadow: 0 0 15px currentColor;\n}\n\n.preview-btn-primary {\n  border-radius: 9999px !important;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n}\n\n.preview-custom-card-hover:hover {\n  transform: translateY(-4px) scale(1.02);\n  border-color: #58A6FF !important;\n}\n*/`,
    lastUpdatedAt: nowISO
  },
  navigation: {
    items: [
      {
        label: { en: "Home", fr: "Accueil", pt: "Início" },
        href: "/",
        openInNewTab: false,
        children: []
      },
      {
        label: { en: "Our Products", fr: "Nos Produits", pt: "Produtos" },
        href: "/products",
        openInNewTab: false,
        children: []
      },
      {
        label: { en: "Insights", fr: "Actualités", pt: "Artigos" },
        href: "/blog",
        openInNewTab: false,
        children: []
      },
      {
        label: { en: "About Us", fr: "À Propos", pt: "Sobre Nós" },
        href: "/about",
        openInNewTab: false,
        children: []
      },
      {
        label: { en: "Faq", fr: "Aide", pt: "Dúvidas" },
        href: "/faq",
        openInNewTab: false,
        children: []
      }
    ],
    ctaLabel: {
      en: "Portal Access",
      fr: "Accéder au Portail",
      pt: "Acessar Portal"
    },
    ctaHref: "/contact",
    ctaStyle: "primary",
    stickyHeader: true,
    transparentOnHero: true,
    lastUpdatedAt: nowISO
  },
  pages: [
    {
      id: "page-home",
      title: { en: "Home", fr: "Accueil", pt: "Início" },
      slug: "/",
      status: "published",
      metaTitle: {
        en: "Apex Headless | Enterprise Cloud Integrations",
        fr: "Apex Headless | Intégrations Cloud d'Entreprise",
        pt: "Apex Headless | Integrações de Nuvem Corporativa"
      },
      metaDescription: {
        en: "Powering fast websites with headless architecture, standard JSON payloads, and clean API endpoints.",
        fr: "Alimenter des sites rapides avec une architecture headless, des charges utiles JSON standard.",
        pt: "Alimentando sites rápidos com arquitetura headless, payloads JSON padrão e APIs limpas."
      },
      ogImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&h=630&q=80",
      sections: [
        {
          type: "hero",
          headline: {
            en: "Decoupled Speed. Dynamic Personalization.",
            fr: "Vitesse Découplée. Personnalisation Dynamique.",
            pt: "Velocidade Desacoplada. Personalização Dinâmica."
          },
          subheadline: {
            en: "Distribute your content to millions of modern channels asynchronously. Completely schema-safe, fully typed, and indexed for Global SEO.",
            fr: "Distribuez votre contenu sur des millions de canaux asynchrones. Entièrement sécurisé, typé et indexé.",
            pt: "Distribua seu conteúdo para milhões de canais modernos de forma assíncrona. Totalmente seguro contra esquemas e otimizado."
          },
          ctaPrimary: {
            label: { en: "Explore Products", fr: "Voir les Produits", pt: "Ver Produtos" },
            href: "/products"
          },
          ctaSecondary: {
            label: { en: "Request Access", fr: "Demander l'Accès", pt: "Solicitar Acesso" },
            href: "/contact"
          },
          backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&h=900&q=80",
          overlayOpacity: 0.65,
          layout: "centered"
        },
        {
          type: "features",
          headline: {
            en: "Architected for Content Sovereignty",
            fr: "Infrastructures de Souveraineté de Contenu",
            pt: "Arquitetado para Soberania de Conteúdo"
          },
          subtitle: {
            en: "A localized, multi-environment layout engine operating at edge speed.",
            fr: "Un moteur de mise en page localisé et multi-environnement fonctionnant à la vitesse de l'edge.",
            pt: "Um motor de layout localizado e multi-ambiente operando na velocidade da borda."
          },
          items: [
            {
              icon: "Languages",
              title: { en: "Universal Localizations", fr: "Localisations Universelles", pt: "Localização Universal" },
              description: {
                en: "Every single string can hold recursive translations. Toggle locale contexts transparently without database hits.",
                fr: "Chaque chaîne peut contenir des traductions récursives. Basculez de contexte de manière transparente.",
                pt: "Cada string individual pode conter traduções recursivas. Alterne contextos de idioma sem acessos pesados."
              }
            },
            {
              icon: "KeyRound",
              title: { en: "Strict Role Scopes", fr: "Portée de Rôle Stricte", pt: "Escopos de Perfis Estritos" },
              description: {
                en: "Granular administrative overrides. Secure editors, viewers, and authors natively based on OAuth standards.",
                fr: "Contrôles d'accès granulaires. Sécurisez des éditeurs et des auteurs via OAuth.",
                pt: "Controle refinado de permissões corporativas. Segurança nativa para editores e autores."
              }
            },
            {
              icon: "Zap",
              title: { en: "Optimal Core Web Vitals", fr: "Signaux Web Essentiels Optimaux", pt: "Foco total em Performance" },
              description: {
                en: "By severing database overhead, compile-time schema bundling reduces rendering times to milliseconds.",
                fr: "En coupant les serveurs de base de données, l'incorporation réduit les temps de chargement.",
                pt: "Ao desacoplar o banco de dados, o empacotamento reduz tempos de carregamento para milissegundos."
              }
            }
          ]
        },
        {
          type: "products",
          headline: {
            en: "Hot Offerings This Quarter",
            fr: "Nos Offres Phares de la Saison",
            pt: "Destaques Deste Trimestre"
          },
          subtitle: {
            en: "Directly connected into our inventory with secure GraphQL payload synchronization.",
            fr: "Directement connecté à notre inventaire avec une synchronisation sécurisée GraphQL.",
            pt: "Conectado diretamente ao estoque em tempo real via payloads JSON."
          },
          limit: 3
        },
        {
          type: "testimonials",
          headline: {
            en: "What Headless Architects Say",
            fr: "Les Avis des Architectes Headless",
            pt: "O que dizem os Arquitetos de Software"
          },
          subtitle: {
            en: "Hear from CTOs and Lead developers deploying Apex schemas in production.",
            fr: "Témoignages de directeurs techniques et de développeurs principaux.",
            pt: "Depoimentos de CTOs e Engenheiros líderes que utilizam nossos esquemas."
          }
        }
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
      lastUpdatedAt: nowISO
    },
    {
      id: "page-about",
      title: { en: "About Us", fr: "À Propos", pt: "Sobre Nós" },
      slug: "/about",
      status: "published",
      metaTitle: {
        en: "Our Integrity & Methodology | Apex Headless",
        fr: "Notre Intégrité et Méthodologie | Apex Headless",
        pt: "A Nossa Integridade e Metodologia | Apex"
      },
      metaDescription: {
        en: "Learn how we built a fail-safe framework providing headless assets for thousands of global websites.",
        fr: "Découvrez notre framework robuste fournissant du contenu pour des milliers de sites mondiaux.",
        pt: "Saiba como criamos um ecossistema seguro de renderização que atende milhares de portais corporativos."
      },
      ogImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=630&q=80",
      sections: [
        {
          type: "hero",
          headline: {
            en: "Formulated for Global Scale.",
            fr: "Formulé pour une Échelle Mondiale.",
            pt: "Formulado para Escala Global."
          },
          subheadline: {
            en: "We believe content should be structural, durable, and highly accessible across APIs. No complex rendering frameworks or legacy database bottlenecks.",
            fr: "Nous pensons que le contenu doit être structurel, durable et accessible par API. Sans goulots d'étranglement de bases héritées.",
            pt: "Acreditamos que o conteúdo deve ser estrutural, durável e altamente acessível por APIs, sem gargalos legados."
          },
          ctaPrimary: {
            label: { en: "Meet the Team", fr: "Rencontrer l'Équipe", pt: "Ver Equipe" },
            href: "/about#team"
          },
          backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=900&q=80",
          overlayOpacity: 0.7,
          layout: "left"
        },
        {
          type: "features",
          headline: {
            en: "Our Core Core Pillars",
            fr: "Nos Piliers Fondamentaux",
            pt: "Nossos Pilares Fundamentais"
          },
          subtitle: {
            en: "How we sustain performance across a distributed Content Delivery Network (CDN).",
            fr: "Comment nous soutenons les performances de bout en bout.",
            pt: "Como asseguramos alta performance de ponta a ponta no CDN."
          },
          items: [
            {
              icon: "Cpu",
              title: { en: "Extensible Schema Engine", fr: "Moteur de Schéma Extensible", pt: "Esquema Extensível" },
              description: {
                en: "Inject properties dynamic, define product variants, and register redirects without editing backend database rules.",
                fr: "Injectez des propriétés dynamiquement et enregistrez des redirections sans toucher au code.",
                pt: "Injete propriedades de forma dinâmica e configure redirecionamentos de URL com segurança."
              }
            },
            {
              icon: "Globe",
              title: { en: "Multi-Language Priority", fr: "Priorité Multilingue", pt: "Localização Padrão" },
              description: {
                en: "Built-in localization is standard. Say goodbye to external translations microservices and unaligned payloads.",
                fr: "Le multilingue est standard de base. Dites adieu aux microservices de traduction incohérents.",
                pt: "Internacionalização nativa. Chega de microserviços extras e payloads de tradução fragmentados."
              }
            }
          ]
        }
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
      lastUpdatedAt: nowISO
    },
    {
      id: "page-faq",
      title: { en: "FAQ", fr: "Aide", pt: "Dúvidas" },
      slug: "/faq",
      status: "published",
      metaTitle: {
        en: "Frequently Asked Questions | Help Center & Specs",
        fr: "Questions Fréquentes | Centre d'Aide",
        pt: "Dúvidas Frequentes | Central de Ajuda"
      },
      metaDescription: {
        en: "Your technical developer queries, cache concerns, and multi-currency integration patterns resolved.",
        fr: "FAQ technique, cache, multi-devises et modèles d'intégration résolus.",
        pt: "Informações técnicas, expiração de cache, e padrões de integração resolvidos."
      },
      ogImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&h=630&q=80",
      sections: [
        {
          type: "hero",
          headline: {
            en: "Developer Help Desk",
            fr: "Centre de Support Technique",
            pt: "Central do Desenvolvedor"
          },
          subheadline: {
            en: "Clear answers on webhooks, edge cache validation, localization parameters, and data-binding structure.",
            fr: "Réponses claires sur les webhooks, les caches CDN, les langues et les données.",
            pt: "Respostas claras sobre webhooks, invalidação de CDN, parâmetros de idiomas e payloads."
          },
          ctaPrimary: {
            label: { en: "Get in touch", fr: "Nous contacter", pt: "Fale conosco" },
            href: "/contact"
          },
          layout: "centered",
          backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&h=900&q=80",
          overlayOpacity: 0.8
        },
        {
          type: "faqs",
          headline: {
            en: "Core Headless Integration FAQ",
            fr: "FAQ d'Intégration Headless",
            pt: "Perguntas Frequentes de Integração"
          }
        }
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
      lastUpdatedAt: nowISO
    },
    {
      id: "page-contact",
      title: { en: "Contact Us", fr: "Contact", pt: "Contato" },
      slug: "/contact",
      status: "published",
      metaTitle: {
        en: "Inquire Access | Apex Enterprise",
        fr: "Demande de Renseignement | Apex",
        pt: "Fale Conosco | Apex Enterprise"
      },
      metaDescription: {
        en: "Get in touch for high-volume GraphQL endpoints, team provisioning, and security custom roles.",
        fr: "Contactez-nous pour des volumes élevés d'API, provisionnement et rôles.",
        pt: "Entre em contato para volumes corporativos de API, provisionamento automático e perfis de segurança."
      },
      ogImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&h=630&q=80",
      sections: [
        {
          type: "contactForm",
          headline: {
            en: "Connect with our CMS Architects",
            fr: "Échangez avec nos Architectes CMS",
            pt: "Fale com os nossos Arquitetos de CMS"
          },
          formId: "lead-capture"
        }
      ],
      createdAt: nowISO,
      updatedAt: nowISO,
      lastUpdatedAt: nowISO
    }
  ],
  footer: {
    columns: [
      {
        heading: { en: "Solutions", fr: "Solutions", pt: "Soluções" },
        links: [
          { label: { en: "Edge Decoupling", fr: "Découplage Edge", pt: "Borda Desacoplada" }, href: "/products#decouple" },
          { label: { en: "Multi-Language Sync", fr: "Sync Multilingue", pt: "Sincronização de Idiomas" }, href: "/products#locale" },
          { label: { en: "GraphQL Playgrounds", fr: "Aires de GraphQL", pt: "Consolas GraphQL" }, href: "/products#graphql" }
        ]
      },
      {
        heading: { en: "Resources", fr: "Ressources", pt: "Recursos" },
        links: [
          { label: { en: "Developer Specs", fr: "Specs Développeurs", pt: "Specs Técnicas" }, href: "/blog" },
          { label: { en: "Integration Guides", fr: "Guides d'Intégration", pt: "Guias Práticos" }, href: "/faq" },
          { label: { en: "Product Catalog", fr: "Catalogue Produits", pt: "Catálogo Geral" }, href: "/products" }
        ]
      }
    ],
    socialLinks: [
      { platform: "github", url: "https://github.com/apex-headless" },
      { platform: "linkedin", url: "https://linkedin.com/company/apex-headless" },
      { platform: "twitter", url: "https://twitter.com/apex_headless" }
    ],
    copyrightText: {
      en: "© 2026 Apex Headless Systems. Fully architected to secure client payload resolution rules.",
      fr: "© 2026 Systèmes Apex Headless. Entièrement conçu pour sécuriser les charges d'intégration.",
      pt: "© 2026 Sistemas Apex Headless. Arquitetado para garantir alta segurança no tráfego de dados."
    },
    legalLinks: [
      { label: { en: "Privacy Policy", fr: "Politique de Confidentialité", pt: "Práticas de Privacidade" }, href: "/privacy" },
      { label: { en: "Terms of Service", fr: "Conditions d'Utilisation", pt: "Termos de Uso" }, href: "/terms" }
    ],
    newsletterEnabled: true,
    newsletterPlaceholder: {
      en: "Enter business email...",
      fr: "Votre email pro...",
      pt: "Seu e-mail corporativo..."
    },
    lastUpdatedAt: nowISO
  },
  posts: [
    {
      id: "post-1",
      title: {
        en: "Building a Multi-Language CDN Strategy with Headless Payloads",
        fr: "Construire une stratégie CDN multilingue avec des charges utiles Headless",
        pt: "Construindo uma Estratégia de CDN Multilíngue com Payloads Headless"
      },
      slug: "headless-cdn-strategy",
      status: "published",
      publishedAt: "2026-05-18T10:00:00Z",
      author: "author-1",
      categories: ["Architecture", "Performance"],
      tags: ["CDN", "i18n", "GraphQL"],
      featuredImage: {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&h=500&q=80",
        alt: "Highly scalable server nodes in optical fibers representing global distribution nodes.",
        width: 800,
        height: 500
      },
      excerpt: {
        en: "How global websites utilize pre-compiled JSON schemas to reduce and flatten load latency, bypassing rendering engines completely.",
        fr: "Comment les sites mondiaux exploitent les schémas JSON précompilés pour réduire considérablement la latence.",
        pt: "Como portais globais utilizam esquemas JSON pré-compilados para eliminar latência de processamento de banco de dados."
      },
      body: {
        en: `<h3>Why Legacy Rendering Bottlenecks Content</h3><p>Traditional content management servers fetch from a single centralized SQL database on every page view, compile HTML server-side, and push it to users. When dealing with multilingual sites, this query complexity spirals. Each translation lookup adds joining operations, creating massive delays.</p><h3>The Headless Decoupled Alternative</h3><p>By outputting a structured type-safe JSON API standard, frontend frameworks like Next.js, Nuxt, and SvelteKit compile content at build-time or lazy load utilizing fast CDN caching. In this framework, localized blocks are resolved in milliseconds at the Edge.</p>`,
        fr: `<h3>Pourquoi les CMS classiques ralentissent le contenu</h3><p>Les serveurs classiques interrogent une base SQL unique à chaque clic, génèrent du code HTML et l'envoient. Avec le multilingue, cela devient complexe et lent.</p><h3>La réponse découplée en Headless</h3><p>En poussant des flux JSON légers et typés, les applications modernes les intègrent sur le CDN très rapidement.</p>`,
        pt: `<h3>Por que os CMS Legados Estrangulam a Velocidade</h3><p>Os servidores de conteúdo tradicionais realizam consultas SQL em tempo real a cada requisição, processam o HTML no servidor e o enviam. Sob múltiplos idiomas, a performance cai drasticamente.</p><h3>A Solução Decoupled Headless</h3><p>Ao expor uma API de arquivos JSON estáticos e tipados, frameworks compilam o conteúdo no build ou geram cache na borda reduzindo a latência para menos de 10ms.</p>`
      },
      readingTimeMinutes: 4,
      relatedPosts: ["post-2"],
      lastUpdatedAt: nowISO
    },
    {
      id: "post-2",
      title: {
        en: "Validating Structured Schema.org Markup Automatically",
        fr: "Valider automatiquement le balisage structuré Schema.org",
        pt: "Validando Marcação Estruturada Schema.org Automaticamente"
      },
      slug: "validating-schema-org",
      status: "published",
      publishedAt: "2026-05-22T08:30:00Z",
      author: "author-2",
      categories: ["SEO", "TypeScript"],
      tags: ["JSON-LD", "SEO", "TypeScript"],
      featuredImage: {
        url: "https://images.unsplash.com/photo-1546074177-3a9617ad34c5?auto=format&fit=crop&w=800&h=500&q=80",
        alt: "Clean lines of code containing structural metadata and JSON structures.",
        width: 800,
        height: 500
      },
      excerpt: {
        en: "Integrating JSON-LD microdata directly within the head element of localized routes, boosting indexability without inflating client bundles.",
        fr: "Intégrer les microdonnées JSON-LD directement dans l'élément head pour booster le référencement naturel.",
        pt: "Integrando microdados JSON-LD de forma nativa no elemento head para maximizar a indexação orgânica do site."
      },
      body: {
        en: `<h3>SEO as a First-Class Content Schema</h3><p>Modern headless integration does not leave SEO to chance. By linking structured data (SEO Block schemas) directly to your content pages, machines can parse entity hierarchies instantly using modern vocabulary protocols.</p>`,
        fr: `<h3>L'indexation SEO native et structurée</h3><p>Le SEO ne doit jamais être une option. Lier les données structurées directement à vos modules CMS assure une interprétation claire par Google.</p>`,
        pt: `<h3>SEO como Prática Fundamental de Produto</h3><p>Não deixe a indexação por conta de plugins terceiros. Ao atrelar blocos de metadados estruturados JSON-LD a cada página do CMS, os robôs do Google indexam as entidades perfeitamente.</p>`
      },
      readingTimeMinutes: 3,
      relatedPosts: ["post-1"],
      lastUpdatedAt: nowISO
    }
  ],
  authors: [
    {
      id: "author-1",
      name: "Marcus Vance",
      role: {
        en: "Director of CDN Engineering",
        fr: "Directeur de l'Ingénierie de CDN",
        pt: "Diretor de Engenharia de Distribuição"
      },
      bio: {
        en: "Marcus specializes in distributed network architectures, high-performance API structures, and edge caching algorithms.",
        fr: "Marcus est spécialiste en réseaux distribués, architectures API haute performance et caches CDN.",
        pt: "Marcus é especialista em redes distribuídas de alta performance e algoritmos inteligentes de cache de dados."
      },
      avatar: {
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        alt: "Professional portrait of Elena, professional glasses, neutral backdrop.",
        width: 150,
        height: 150
      },
      socialLinks: [
        { platform: "github", url: "https://github.com/mvance" },
        { platform: "linkedin", url: "https://linkedin.com/in/mvance-dev" }
      ],
      email: "m.vance@apex-headless.com",
      lastUpdatedAt: nowISO
    },
    {
      id: "author-2",
      name: "Elena Rostova",
      role: {
        en: "Head of Content Semantic Architect",
        fr: "Responsable d'Architecture Sémantique",
        pt: "Especialista em Arquitetura de Conteúdo"
      },
      bio: {
        en: "Elena has designed headless taxonomies for multi-national commerce sites. She enjoys typing complex metadata models.",
        fr: "Elena conçoit des taxonomies pour des plateformes multilingues mondiales. Passionnée de métadonnées complexes.",
        pt: "Elena projeta taxonomias estruturadas de comércio eletrônico internacional há mais de 10 anos."
      },
      avatar: {
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
        alt: "Elena Vance smiling portrait.",
        width: 150,
        height: 150
      },
      socialLinks: [
        { platform: "twitter", url: "https://twitter.com/erostova" }
      ],
      lastUpdatedAt: nowISO
    }
  ],
  testimonials: [
    {
      id: "test-1",
      quote: {
        en: "Apex provided the precise API structure that our platform engineering team requested. We decreased deployment times by 74% and completely avoided schema migration pains.",
        fr: "Apex nous a fourni l'exacte structure API requise par notre équipe. Nous avons réduit le temps d'intégration de 74%, sans aucune douleur migratoire.",
        pt: "A Apex nos entregou a estrutura exata e tipada de API que nosso time engineering precisava. Reduzimos o tempo de entrega em 74% e eliminamos problemas de migração."
      },
      authorName: "Silas Thorne",
      authorRole: {
        en: "Chief Architect",
        fr: "Architecte Principal",
        pt: "Arquiteto de Sistemas Web"
      },
      authorCompany: "Vertex Global Commerce",
      authorAvatar: {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
        alt: "Silas smiling portrait.",
        width: 100,
        height: 100
      },
      rating: 5,
      featured: true,
      lastUpdatedAt: nowISO
    },
    {
      id: "test-2",
      quote: {
        en: "The multilingual localization rules are pristine. We translate products, variants, meta tags, and FAQ categorizations simultaneously without bloating client bundles.",
        fr: "Les règles de traduction multilingue sont d'une clarté irréprochable. Nous traduisons produits, variantes et métadonnées à la volée.",
        pt: "As regras de tradução nativas são excepcionais. Traduzimos produtos, variantes e meta-tags simultaneamente sem sobrecarregar o cliente."
      },
      authorName: "Gabriela Duarte",
      authorRole: {
        en: "VP of Product Engineering",
        fr: "Directrice d'Ingénierie Produit",
        pt: "Diretora de Tecnologia e Engenharia"
      },
      authorCompany: "Vanguardo LTDA",
      authorAvatar: {
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
        alt: "Gabriela portrait.",
        width: 100,
        height: 100
      },
      rating: 5,
      featured: true,
      lastUpdatedAt: nowISO
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: {
        en: "Is this database queryable via REST or purely GraphQL?",
        fr: "Cette base est-elle interrogeable via REST ou uniquement GraphQL?",
        pt: "Esta base de dados é consultável via REST ou somente GraphQL?"
      },
      answer: {
        en: "Our schemas are natively compatible with both. Since we store variables as structured JSON payloads, you can invoke a GET request to obtain the entire tree or filter modules by content keys.",
        fr: "Nos schémas sont compatibles avec les deux. Le contenu étant stocké sous forme de fichiers JSON, vous pouvez via un GET classique récupérer l'arbre ou filtrer selon vos besoins.",
        pt: "Nossos esquemas são compatíveis com ambos. Como salvamos as variáveis como payloads JSON estruturados, você pode disparar um GET simples para obter o conteúdo inteiro ou realizar filtros específicos."
      },
      category: { en: "Architecture", fr: "Architecture", pt: "Arquitetura" },
      order: 1,
      lastUpdatedAt: nowISO
    },
    {
      id: "faq-2",
      question: {
        en: "How are language fallbacks resolved when an active locale is missing?",
        fr: "Comment les langues de rechange sont-elles gérées en cas de traduction manquante?",
        pt: "Como são resolvidos os fallbacks de idioma quando uma tradução não existe?"
      },
      answer: {
        en: "If a specific text field is missing values for a given locale (e.g., 'fr'), the API resolvers traverse to the defaultLocale declared in globalSettings, falling back sequentially to avoid returning null strings.",
        fr: "Si une traduction spécifique manque, les résolveurs basculent vers la langue par défaut (defaultLocale) déclarée dans les paramètres globaux (globalSettings).",
        pt: "Se um campo de texto não possuir valores no idioma solicitado, as rotas de API redirecionam inteligentemente para o idioma configurado em (defaultLocale)."
      },
      category: { en: "Localization", fr: "Traduction", pt: "Localização" },
      order: 2,
      lastUpdatedAt: nowISO
    }
  ],
  products: [
    {
      id: "prod-1",
      title: {
        en: "Headless Content Pipeline Plus",
        fr: "Pipeline de Contenu Headless Pro",
        pt: "Pipeline de Conteúdo Headless Plus"
      },
      slug: "content-pipeline-plus",
      description: {
        en: "<h3>Enterprise GraphQL Asset Optimizer</h3><p>An advanced webhook trigger pipeline designed to optimize media assets on the fly, compile localized sitemaps, and validate SEO structural schemas recursively.</p>",
        fr: "<h3>Outil d'Optimisation de Contenus Pro</h3><p>Un pipeline avancé de déclenchement de webhooks conçu pour optimiser les médias à la volée et générer des sitemaps conformes.</p>",
        pt: "<h3>Otimizador de Ativos de Mídia</h3><p>Um fluxo robusto disparado por webhooks para otimizar imagens, compilar sitemaps localizados e validar marcações estruturadas.</p>"
      },
      price: 149.00,
      compareAtPrice: 199.00,
      currency: "USD",
      images: [
        {
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400&q=80",
          alt: "Futuristic glowing pipeline interface detailing asset flow nodes.",
          width: 600,
          height: 400
        }
      ],
      sku: "APX-PIPE-PLUS",
      inventory: 340,
      variants: [
        { name: "Support Tier", options: ["Standard SLA", "24/7 Enterprise Assistance"] }
      ],
      categories: ["Developer Tools", "Automation"],
      featured: true,
      status: "active",
      lastUpdatedAt: nowISO
    },
    {
      id: "prod-2",
      title: {
        en: "Localized Cache Purging Edge Trigger",
        fr: "Déclencheur CDN pour Purge Localisée du Cache",
        pt: "Gatilho Inteligente de Cache Expirado"
      },
      slug: "cache-purging-trigger",
      description: {
        en: "<h3>Millisecond Cache Invalidation Engine</h3><p>Instantly send custom payload purge requests to global CDNs. Operates perfectly across Fastly, Cloudflare, and Akamai networks without cold start delays.</p>",
        fr: "<h3>Moteur d'Invalidation Instantanée</h3><p>Envoyez instantanément des demandes de purge de cache à vos serveurs mondiaux (Fastly, Cloudflare, etc.).</p>",
        pt: "<h3>Invalidação de Cache em Milissegundos</h3><p>Envie requisições automatizadas de purga de cache a CDNs mundiais de forma cirúrgica, evitando cold starts pesados.</p>"
      },
      price: 89.00,
      currency: "USD",
      images: [
        {
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&h=400&q=80",
          alt: "Vibrant abstract shapes showing quick cache invalidation spikes.",
          width: 600,
          height: 400
        }
      ],
      sku: "APX-EDGE-PURGE",
      inventory: 1200,
      variants: [
        { name: "Edge Servers", options: ["Standard Multi-region", "Edge Core Complete"] }
      ],
      categories: ["Performance", "Hosting"],
      featured: true,
      status: "active",
      lastUpdatedAt: nowISO
    }
  ],
  forms: [
    {
      id: "lead-capture",
      name: "Enterprise Access Inquiry",
      fields: [
        {
          id: "fullname",
          type: "text",
          label: { en: "Your Full Name", fr: "Votre Nom Complet", pt: "Seu Nome Completo" },
          placeholder: { en: "e.g. John Doe", fr: "Ex: Jean Dupont", pt: "Ex: João Silva" },
          required: true,
          options: []
        },
        {
          id: "email",
          type: "email",
          label: { en: "Corporate Email Address", fr: "E-mail Professionnel", pt: "E-mail Corporativo" },
          placeholder: { en: "e.g. john@company.com", fr: "Ex: jean@entreprise.fr", pt: "Ex: joao@empresa.com.br" },
          required: true,
          options: []
        },
        {
          id: "target_locale",
          type: "select",
          label: { en: "Preferred Dev Language", fr: "Langue Préférée de l'Équipe", pt: "Idioma Principal do Time" },
          placeholder: { en: "Select a language...", fr: "Choisir...", pt: "Selecione..." },
          required: true,
          options: ["TypeScript (Client-side)", "Python GraphQL SDK", "Rust Edge Worker"]
        },
        {
          id: "inquiry_details",
          type: "textarea",
          label: { en: "Project Scope & Volume Requirements", fr: "Détails du Projet", pt: "Escopo do Projeto & Volume de Requisições" },
          placeholder: { en: "Tell us about your headless strategy...", fr: "Saisissez les détails de vos volumes d'API...", pt: "Descreva a sua estratégia de arquitetura decoupled..." },
          required: false,
          options: []
        },
        {
          id: "terms",
          type: "checkbox",
          label: {
            en: "I consent to receiving schema updates and system alerts recursively.",
            fr: "J'accepte de recevoir des notifications de mise à jour système.",
            pt: "Eu concordo em receber atualizações de esquemas e alertas do sistema."
          },
          placeholder: { en: "", fr: "", pt: "" },
          required: true,
          options: []
        }
      ],
      submitLabel: {
        en: "Establish Connection",
        fr: "Établir la Connexion",
        pt: "Enviar Solicitação"
      },
      successMessage: {
        en: "Endpoint authenticated successfully. Our lead CMS architect will review your schema inputs and respond via notifyEmail inside 120 minutes.",
        fr: "Point de terminaison authentifié. Notre architecte CMS examinera vos paramètres sous 2 heures.",
        pt: "Acesso autenticado com sucesso! Nossos arquitetos vão analisar o escopo e responderão em até 120 minutos."
      },
      redirectUrl: "/contact#success",
      notifyEmail: "provisioning@apex-headless.com",
      lastUpdatedAt: nowISO
    }
  ],
  redirects: [
    {
      id: "redir-1",
      from: "/old-products-index",
      to: "/products",
      statusCode: 301,
      enabled: true,
      lastUpdatedAt: nowISO
    },
    {
      id: "redir-2",
      from: "/v1-documentation",
      to: "/faq",
      statusCode: 302,
      enabled: true,
      lastUpdatedAt: nowISO
    }
  ],
  roles: [
    {
      id: "role-admin",
      name: "admin",
      permissions: [
        { module: "globalSettings", actions: ["read", "create", "update", "delete"] },
        { module: "navigation", actions: ["read", "create", "update", "delete"] },
        { module: "pages", actions: ["read", "create", "update", "delete"] },
        { module: "posts", actions: ["read", "create", "update", "delete"] },
        { module: "products", actions: ["read", "create", "update", "delete"] },
        { module: "redirects", actions: ["read", "create", "update", "delete"] }
      ],
      lastUpdatedAt: nowISO
    },
    {
      id: "role-editor",
      name: "editor",
      permissions: [
        { module: "pages", actions: ["read", "update"] },
        { module: "posts", actions: ["read", "create", "update"] },
        { module: "products", actions: ["read", "update"] }
      ],
      lastUpdatedAt: nowISO
    },
    {
      id: "role-viewer",
      name: "viewer",
      permissions: [
        { module: "globalSettings", actions: ["read"] },
        { module: "navigation", actions: ["read"] },
        { module: "pages", actions: ["read"] },
        { module: "posts", actions: ["read"] }
      ],
      lastUpdatedAt: nowISO
    }
  ]
};
