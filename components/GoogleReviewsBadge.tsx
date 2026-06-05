"use client";

import { useEffect } from "react";

export function GoogleReviewsBadge() {
  useEffect(() => {
    const script = document.getElementById("merchantWidgetScript");
    if (!script) return;

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mw = (window as any)["merchantwidget"];
      if (mw) {
        mw.start({
          merchant_id: 5804859197,
          position: "BOTTOM_RIGHT",
          region: "KE",
        });
      }
    };

    script.addEventListener("load", init);
    return () => script.removeEventListener("load", init);
  }, []);

  return null;
}
