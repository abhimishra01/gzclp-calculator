// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
const config = {
  name: 'GZCLP Calculator',                 // shown in header, title, footer
  domain: 'gzclpcalculator.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'gzclp-calculator',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'GZCLP calculator',        // main keyword (search phrase)
  keywords: ['GZCLP spreadsheet', 'GZCLP weights', 'GZCLP progression', 'GZCLP workout tracker', 'GZCLP reset'],
  h1: 'GZCLP calculator',             // visible page heading
  title: 'GZCLP Calculator: Weights, Stages & Next Session', // home page title, under 60 chars
  tagline: 'Free GZCLP planner',
  description:
    'Free GZCLP calculator. Enter your weights, see today\'s T1, T2 and T3 sets, plates per side, and the next session after a pass or a fail.',
  email: 'hello@gzclpcalculator.com',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#0369a1',                   // brand color (hex)
  skin: 'retro',                      // visual skin: only retro exists on this site
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',
  category: 'HealthApplication',   // schema.org applicationCategory
  owner: 'GZCLP Calculator',                // name used in legal pages (person or business)
};

// Bingemind build (SITE_MODE=bingemind): the tool lives at https://bingemind.com/<slug>/.
// Canonical URLs point there in every build, including the GitHub Pages preview.
const bingemind = typeof process !== 'undefined' && process.env.SITE_MODE === 'bingemind';
const slug = config.cloudflareProject;
export default {
  ...config,
  bingemind,
  slug,
  canonicalBase: `https://bingemind.com/${slug}`,
  host: bingemind ? `bingemind.com/${slug}/` : config.domain,
  owner: bingemind ? 'Bingemind' : config.owner,
  // No invented mailbox: Bingemind builds link to the Bingemind contact section.
  contactHref: bingemind ? 'https://bingemind.com/#contact' : `mailto:${config.email}`,
  contactLabel: bingemind ? 'bingemind.com/#contact' : config.email,
};
