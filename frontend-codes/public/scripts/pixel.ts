const PIXEL_ID = document.currentScript?.getAttribute("data-pixel-id");

function initializeFacebookPixel(f: Window, b: Document, e: string, v: string, n?: any, t?: HTMLScriptElement, s?: Element): void {
  if ((f as any).fbq) return;
  n = (f as any).fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!(f as any)._fbq) (f as any)._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = "2.0";
  n.queue = [];
  t = b.createElement(e) as HTMLScriptElement;
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  if (s && s.parentNode) {
    s.parentNode.insertBefore(t, s);
  }
}

initializeFacebookPixel(
  window,
  document,
  "script",
  "https://connect.facebook.net/en_US/fbevents.js",
);

(window as any).fbq("init", PIXEL_ID);