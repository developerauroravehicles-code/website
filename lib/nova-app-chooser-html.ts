export type NovaAppStoreUrls = {
  play: string;
  appStore: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function button(href: string | null, label: string): string {
  if (!href) {
    return `<span class="btn btn-disabled">${escapeHtml(label)} — not configured</span>`;
  }
  return `<a class="btn" href="${escapeHtml(href)}" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

/** Minimal standalone HTML for desktop / unknown devices (no site chrome). */
export function renderNovaAppChooserHtml(urls: NovaAppStoreUrls): string {
  const configured = Boolean(urls.play || urls.appStore);
  const hint = configured
    ? "Choose your store to download the Nova app."
    : "Store links are not configured yet. Please try again later.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Nova app</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background: #000;
      color: #f4f4f5;
    }
    .card {
      width: 100%;
      max-width: 22rem;
      padding: 2rem 1.5rem;
      border-radius: 1rem;
      border: 1px solid rgba(255,255,255,0.1);
      background: #0a0a0a;
      text-align: center;
    }
    h1 { margin: 0 0 0.5rem; font-size: 1.25rem; font-weight: 700; }
    p { margin: 0 0 1.5rem; font-size: 0.875rem; color: #a1a1aa; line-height: 1.5; }
    .actions { display: flex; flex-direction: column; gap: 0.75rem; }
    .btn {
      display: block;
      padding: 0.875rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      background: #ff4500;
      color: #000;
    }
    .btn:hover { background: #e63e00; }
    .btn-disabled {
      display: block;
      padding: 0.875rem 1rem;
      border-radius: 9999px;
      font-size: 0.8125rem;
      font-weight: 600;
      background: #27272a;
      color: #71717a;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Nova app</h1>
    <p>${escapeHtml(hint)}</p>
    <div class="actions">
      ${button(urls.play || null, "Google Play")}
      ${button(urls.appStore || null, "App Store")}
    </div>
  </div>
</body>
</html>`;
}
