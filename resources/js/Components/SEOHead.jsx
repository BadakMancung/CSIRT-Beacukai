import { Head } from '@inertiajs/react';

export default function SEOHead({ 
    title = "CSIRT Bea Cukai - Computer Security Incident Response Team", 
    description = "Computer Security Incident Response Team Bea Cukai melayani pelaporan insiden keamanan siber 24/7, monitoring ancaman cyber, dan perlindungan infrastruktur IT Direktorat Jenderal Bea dan Cukai.",
    keywords = "CSIRT Bea Cukai, Cyber Security Bea Cukai, Keamanan Siber, Incident Response, Bea Cukai, DJBC, Kementerian Keuangan, Lapor Insiden Siber, Security Operations Center",
    url = "https://csirt.beacukai.go.id",
    image = "/images/logo_beacukai.png",
    type = "website",
    articleData = null 
}) {
    const fullTitle = title.includes('CSIRT Bea Cukai') ? title : `${title} | CSIRT Bea Cukai`;
    const fullUrl = url.startsWith('http') ? url : `https://csirt.beacukai.go.id${url}`;
    const fullImage = image.startsWith('http') ? image : `https://csirt.beacukai.go.id${image}`;

    // Structured Data untuk SEO
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "GovernmentOrganization",
        "name": "CSIRT Bea Cukai",
        "alternateName": "Computer Security Incident Response Team Bea Cukai",
        "description": description,
        "url": "https://csirt.beacukai.go.id",
        "logo": {
            "@type": "ImageObject",
            "url": fullImage,
            "width": 300,
            "height": 300
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-21-1234-5678",
            "contactType": "Emergency",
            "areaServed": "ID",
            "availableLanguage": "Indonesian"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Jenderal Ahmad Yani",
            "addressLocality": "Jakarta Pusat",
            "addressRegion": "DKI Jakarta",
            "postalCode": "10710",
            "addressCountry": "ID"
        },
        "parentOrganization": {
            "@type": "GovernmentOrganization",
            "name": "Direktorat Jenderal Bea dan Cukai",
            "url": "https://www.beacukai.go.id"
        },
        "department": {
            "@type": "GovernmentOrganization",
            "name": "Kementerian Keuangan Republik Indonesia",
            "url": "https://www.kemenkeu.go.id"
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "CSIRT Bea Cukai",
        "url": "https://csirt.beacukai.go.id",
        "description": description,
        "publisher": {
            "@type": "GovernmentOrganization",
            "name": "CSIRT Bea Cukai"
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://csirt.beacukai.go.id/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    // Article Schema jika ada data artikel
    const articleSchema = articleData ? {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": articleData.title,
        "description": articleData.content?.substring(0, 160),
        "author": {
            "@type": "Organization",
            "name": "CSIRT Bea Cukai"
        },
        "publisher": {
            "@type": "GovernmentOrganization",
            "name": "CSIRT Bea Cukai",
            "logo": {
                "@type": "ImageObject",
                "url": fullImage
            }
        },
        "datePublished": articleData.created_at,
        "dateModified": articleData.updated_at,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
        },
        "image": articleData.image_url ? `https://csirt.beacukai.go.id${articleData.image_url}` : fullImage
    } : null;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="CSIRT Bea Cukai" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="Indonesian" />
            <meta name="geo.region" content="ID" />
            <meta name="geo.country" content="Indonesia" />
            <meta name="geo.placename" content="Jakarta" />
            
            {/* Open Graph Meta Tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Logo CSIRT Bea Cukai" />
            <meta property="og:site_name" content="CSIRT Bea Cukai" />
            <meta property="og:locale" content="id_ID" />
            
            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
            <meta name="twitter:image:alt" content="Logo CSIRT Bea Cukai" />
            <meta name="twitter:site" content="@CSIRTBeaCukai" />
            <meta name="twitter:creator" content="@CSIRTBeaCukai" />
            
            {/* Additional SEO Meta Tags */}
            <meta name="theme-color" content="#1e40af" />
            <meta name="msapplication-TileColor" content="#1e40af" />
            <meta name="msapplication-TileImage" content={fullImage} />
            
            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />
            
            {/* Favicon */}
            <link rel="icon" type="image/x-icon" href="/images/logo_beacukai.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/logo_beacukai.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/logo_beacukai.png" />
            <link rel="apple-touch-icon" href="/images/logo_beacukai.png" />
            
            {/* Alternate Languages */}
            <link rel="alternate" hrefLang="id" href={fullUrl} />
            <link rel="alternate" hrefLang="x-default" href={fullUrl} />
            
            {/* DNS Prefetch untuk Performance */}
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />
            
            {/* Structured Data JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            {articleSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            )}
            
            {/* Google Search Console Verification */}
            <meta name="google-site-verification" content="your-google-verification-code" />
            
            {/* Bing Webmaster Verification */}
            <meta name="msvalidate.01" content="your-bing-verification-code" />
        </Head>
    );
}
