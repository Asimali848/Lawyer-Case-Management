<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  exclude-result-prefixes="s image">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>XML Sitemap</title>
        <style>
          body { font-family: Inter, Roboto, Arial, sans-serif; background:#f3f4f6; margin:0; padding:32px; }
          .hero { background:#0ea5e9; color:white; padding:24px; border-radius:8px; margin-bottom:24px; }
          .container { max-width:980px; margin:0 auto; background:white; padding:16px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.06); }
          h1 { margin:0; font-size:20px; }
          p.lead { margin:8px 0 0; color:rgba(255,255,255,0.9); }
          table { width:100%; border-collapse:collapse; margin-top:16px; }
          th { text-align:left; background:#0ea5e9; color:white; padding:12px; }
          td { padding:10px; border-bottom:1px solid #e5e7eb; }
          tr:nth-child(odd) td { background:#fbfbfb; }
          a { color:#0b69a3; text-decoration:none; }
          .muted { color:#6b7280; }
          .back { margin-bottom:12px; display:inline-block; }
          @media (max-width:640px){ .container{padding:12px} table{font-size:13px} }
        </style>
      </head>
      <body>
        <div class="hero container">
          <h1>XML Sitemap</h1>
          <p class="lead">This XML Sitemap helps search engines discover and crawl the pages on this website.</p>
        </div>
        <div class="container">
          <!-- sitemapindex view -->
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <p class="muted">This XML Sitemap Index file contains <xsl:value-of select="count(s:sitemapindex/s:sitemap)"/> sitemap(s).</p>
              <table>
                <thead>
                  <tr>
                    <th>Sitemap</th>
                    <th>Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="s:sitemapindex/s:sitemap">
                    <tr>
                      <td><a><xsl:attribute name="href"><xsl:value-of select="s:loc"/></xsl:attribute><xsl:value-of select="s:loc"/></a></td>
                      <td><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>

            <!-- urlset view -->
            <xsl:when test="s:urlset">
              <p class="muted">This XML Sitemap contains <xsl:value-of select="count(s:urlset/s:url)"/> URL(s).</p>
              <div class="back"><a href="/sitemap_index.xml">← Sitemap Index</a></div>
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Images</th>
                    <th>Last Mod.</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="s:urlset/s:url">
                    <tr>
                      <td><a><xsl:attribute name="href"><xsl:value-of select="s:loc"/></xsl:attribute><xsl:value-of select="s:loc"/></a></td>
                      <td><xsl:value-of select="count(image:image)"/></td>
                      <td><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>

            <xsl:otherwise>
              <p>No sitemap content found.</p>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
