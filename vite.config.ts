import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type Plugin } from "vite";

function sitemapRedirect(): Plugin {
  const redirect = (req: { url?: string }, res: { statusCode: number; setHeader: (name: string, value: string) => void; end: () => void }, next: () => void) => {
    const pathname = req.url?.split("?", 1)[0];

    if (pathname === "/sitemap.xml") {
      res.statusCode = 302;
      res.setHeader("Location", "/sitemap_index.xml");
      res.end();
      return;
    }

    next();
  };

  return {
    name: "sitemap-redirect",
    configureServer(server) {
      server.middlewares.use(redirect);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}

export default defineConfig({
  plugins: [sitemapRedirect(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
