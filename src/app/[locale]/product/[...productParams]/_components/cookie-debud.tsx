"use client";

import { useEffect, useMemo, useState } from "react";

export default function CookiesDebug() {
  const [cookieStr, setCookieStr] = useState("");

  useEffect(() => {
    // Console
    console.log("document.cookie:", document.cookie);
    setCookieStr(document.cookie || "");
  }, []);

  const cookies = useMemo(() => {
    const map: Record<string, string> = {};
    for (const part of cookieStr.split("; ")) {
      const [k, ...rest] = part.split("=");
      if (!k) continue;
      map[k] = rest.join("=");
    }
    return map;
  }, [cookieStr]);

  return (
    <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {JSON.stringify(cookies, null, 2)}
    </pre>
  );
}
