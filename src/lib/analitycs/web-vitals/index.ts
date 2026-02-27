import type { Metric } from "web-vitals";

import { pushCustomEvent } from "../utils";

function sendToDataLayer(metric: Metric): void {
  pushCustomEvent(metric.name, {
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value,
    ),
    metric_id: metric.id,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
  });
}

export function initWebVitals(): void {
  if (typeof window === "undefined") return;

  import("web-vitals").then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
    onLCP(sendToDataLayer);
    onINP(sendToDataLayer);
    onCLS(sendToDataLayer);
    onFCP(sendToDataLayer);
    onTTFB(sendToDataLayer);
  });
}
