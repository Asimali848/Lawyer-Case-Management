type MetaOptions = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  if (typeof document === "undefined") return;
  const selector = `${attr}="${key}"`;
  let el = document.head.querySelector(`meta[${selector}]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function setMeta({ title, description, url, image }: MetaOptions) {
  if (typeof document === "undefined") return;

  if (title) {
    document.title = title;
    upsertMeta("property", "og:title", title);
    upsertMeta("name", "twitter:title", title);
  }

  if (description) {
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:description", description);
    upsertMeta("name", "twitter:description", description);
  }

  if (url) {
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:url", url);
  }

  if (image) {
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:card", "summary_large_image");
  } else {
    upsertMeta("name", "twitter:card", "summary");
  }

  upsertMeta("property", "og:type", "website");
}

export default setMeta;
