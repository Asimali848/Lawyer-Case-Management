const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://judgmentcalc.com';
const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');
const srcDir = path.join(projectRoot, 'src');
const appFile = path.join(srcDir, 'app.tsx');
const excludedRoutes = new Set(['/interest-rate']);

function ensurePublic() {
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
}

function readAppFile() {
  try {
    return fs.readFileSync(appFile, 'utf8');
  } catch (e) {
    console.error('Could not read src/app.tsx', e.message);
    return '';
  }
}

function findPublicRoutes(appSource) {
  const routes = [];
  // Find the PublicLayout block
  const publicBlockMatch = appSource.match(/<Route\s+element=\{<PublicLayout\s*\/\>\}>([\s\S]*?)<\/Route>/m);
  const block = publicBlockMatch ? publicBlockMatch[1] : appSource;

  const routeRegex = /<Route\s+path=\s*["']([^"']+)["'][^>]*element=\{<\s*([A-Za-z0-9_]+)[^>]*\/?>\s*\}/g;
  let m;
  while ((m = routeRegex.exec(block)) !== null) {
    const rawPath = m[1];
    const comp = m[2];
    routes.push({ path: rawPath, component: comp });
  }

  // Also capture standalone public routes that might be outside the block but are public (e.g., root)
  // For simplicity, include any route where element references a page component and the path does not contain ':' and isn't clearly internal.
  return routes.filter((r) => !r.path.includes(':') && !excludedRoutes.has(r.path));
}

function listPageFiles() {
  const pagesDir = path.join(srcDir, 'pages');
  if (!fs.existsSync(pagesDir)) return [];
  return fs.readdirSync(pagesDir).filter((f) => f.endsWith('.tsx') || f.endsWith('.jsx') || f.endsWith('.js') || f.endsWith('.ts'));
}

function findPageFileForComponent(componentName, pageFiles) {
  const lower = componentName.toLowerCase();
  // Try several strategies
  // 1. exact kebab-case: AboutUs -> about-us
  const kebab = componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
  const candidates = [kebab + '.tsx', kebab + '.jsx', kebab + '.ts', kebab + '.js', componentName + '.tsx', componentName + '.jsx'];
  for (const c of candidates) {
    if (pageFiles.includes(c)) return path.join(srcDir, 'pages', c);
  }

  // 2. fuzzy match by filename containing parts
  for (const f of pageFiles) {
    const name = f.replace(/\.[^.]+$/, '').toLowerCase();
    if (name === lower) return path.join(srcDir, 'pages', f);
    if (name.includes(lower) || lower.includes(name)) return path.join(srcDir, 'pages', f);
  }

  return null;
}

function extractImagesFromFile(filePath) {
  try {
    const src = fs.readFileSync(filePath, 'utf8');
    const imgs = new Set();
    const importRegex = /import\s+[^'\"]+['\"]([^'\"]+\.(png|jpe?g|webp|svg|gif))['\"]/gi;
    let m;
    while ((m = importRegex.exec(src)) !== null) imgs.add(m[1]);

    const srcRegex = /src=\{?['\"]([^'\"]+\.(png|jpe?g|webp|svg|gif))['\"]\}?/gi;
    while ((m = srcRegex.exec(src)) !== null) imgs.add(m[1]);

    return Array.from(imgs);
  } catch (e) {
    return [];
  }
}

function normalizeUrl(value) {
  if (!value) return null;
  if (value.startsWith('http')) return value;
  if (value.startsWith('/')) return SITE_URL + value;
  // relative paths inside src - map to public if possible
  return SITE_URL + '/' + value.replace(/^\.\//, '');
}

function toIsoDate(d) {
  return d.toISOString();
}

function buildUrlEntry(item) {
  const imagesXml = (item.images || []).map((img) => `    <image:image>\n      <image:loc>${normalizeUrl(img)}</image:loc>\n    </image:image>`).join('\n');
  return `  <url>\n    <loc>${SITE_URL}${item.path}</loc>\n    <lastmod>${item.lastmod}</lastmod>${imagesXml ? '\n' + imagesXml : ''}\n  </url>`;
}

function writeFile(name, content) {
  ensurePublic();
  fs.writeFileSync(path.join(publicDir, name), content, 'utf8');
}

function generate() {
  const appSource = readAppFile();
  const routes = findPublicRoutes(appSource);
  const pageFiles = listPageFiles();

  const entries = routes.map((r) => {
    const file = findPageFileForComponent(r.component, pageFiles);
    let lastmod = new Date().toISOString();
    let images = [];
    if (file) {
      try {
        const stat = fs.statSync(file);
        lastmod = toIsoDate(stat.mtime);
      } catch (e) {}
      images = extractImagesFromFile(file);
    }
    return { path: r.path === '/' ? '/' : r.path.endsWith('/') ? r.path : r.path + '/', lastmod, images };
  });

  // Build page sitemap (include image namespace)
  const urlsetBody = entries.map(buildUrlEntry).join('\n');
  const pageSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urlsetBody}\n</urlset>`;
  writeFile('page-sitemap.xml', pageSitemap);

  // Build sitemap index - only include page-sitemap when entries exist
  const sitemapUrls = [];
  if (entries.length) sitemapUrls.push(`${SITE_URL}/page-sitemap.xml`);
  const sitemapIndexBody = sitemapUrls.map((loc) => `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </sitemap>`).join('\n');
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapIndexBody}\n</sitemapindex>`;
  writeFile('sitemap_index.xml', sitemapIndex);

  // robots
  const robots = `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap_index.xml\n`;
  writeFile('robots.txt', robots);

  console.log('Wrote:', fs.readdirSync(publicDir));
}

generate();
