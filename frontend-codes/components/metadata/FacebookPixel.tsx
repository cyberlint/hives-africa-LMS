"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";
import * as pixel from "@/lib/marketing-and-analytics/fpixel";

const FacebookPixel = () => {
  const pathname = usePathname();
  const hasFiredInitialPageView = useRef(false);

  useEffect(() => {
    if (!window.fbq) return;

    // Avoid double PageView on first load
    if (hasFiredInitialPageView.current) {
      pixel.pageview();
    } else {
      hasFiredInitialPageView.current = true;
    }
  }, [pathname]);

  if (!pixel.FB_PIXEL_ID) return null;

  return (
    <Script
      id="facebook-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixel.FB_PIXEL_ID}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
};

export default FacebookPixel;