import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'profile';
  imageUrl?: string;
  structuredData?: Record<string, any>;
}

export function SEO({ 
  title, 
  description = "Welcome to RCCG Impact House — a vibrant church community raising impactful youths, rooted in faith, love, and the word of God.", 
  canonicalUrl,
  type = 'website',
  imageUrl = 'https://rccgimpacthouse.org/hero-bg.jpg',
  structuredData
}: SEOProps) {
  
  const siteName = 'RCCG Impact House';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const url = canonicalUrl ? `https://rccgimpacthouse.org${canonicalUrl}` : 'https://rccgimpacthouse.org';

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
