import { blurhashToBase64 } from "blurhash-base64";

type MosaicOptions = {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  pixelPreview?: string;
  blurhash?: string;
};

const images = new Map<string, Promise<HTMLImageElement>>();

function getImage(key: string, source: () => string) {
  let pending = images.get(key);
  if (!pending) {
    pending = new Promise((resolve, reject) => {
      const image = new window.Image();
      image.decoding = "async";
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Invalid image preview"));
      image.src = source();
    });
    images.set(key, pending);
  }
  return pending;
}

function drawStep(
  canvas: HTMLCanvasElement,
  preview: HTMLImageElement,
  width: number,
  boxRatio: number,
  cover: boolean,
) {
  if (!preview.naturalWidth || !preview.naturalHeight) return;
  const height = Math.max(1, Math.round(width * boxRatio));
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = preview.naturalWidth;
  let sourceHeight = preview.naturalHeight;
  const previewRatio = sourceHeight / sourceWidth;
  if (cover && previewRatio > boxRatio) {
    sourceHeight = sourceWidth * boxRatio;
    sourceY = (preview.naturalHeight - sourceHeight) / 2;
  } else if (cover) {
    sourceWidth = sourceHeight / boxRatio;
    sourceX = (preview.naturalWidth - sourceWidth) / 2;
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    preview,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height,
  );
  canvas.hidden = false;
}

export function startPixelMosaic({
  canvas,
  image,
  pixelPreview,
  blurhash,
}: MosaicOptions) {
  let cancelled = false;
  const timers: number[] = [];
  const box = canvas.parentElement?.getBoundingClientRect();
  canvas.hidden = true;
  if (
    image.complete ||
    !box?.width ||
    !box.height ||
    (!pixelPreview && !blurhash)
  )
    return () => {};

  const boxRatio = box.height / box.width;
  const show = (preview: HTMLImageElement, width: number, cover = true) => {
    if (!cancelled && !image.complete) {
      drawStep(canvas, preview, width, boxRatio, cover);
    }
  };
  const showBlurhash = () => {
    if (!blurhash || cancelled || image.complete) return;
    void getImage(`blurhash:${blurhash}`, () => blurhashToBase64(blurhash))
      .then((preview) => show(preview, 6, false))
      .catch(() => undefined);
  };

  if (pixelPreview) {
    void getImage(`preview:${pixelPreview}`, () => pixelPreview)
      .then((preview) => {
        if (cancelled || image.complete) return;
        show(preview, 2);
        for (const [index, width] of [3, 6].entries()) {
          timers.push(
            window.setTimeout(() => show(preview, width), (index + 1) * 90),
          );
        }
      })
      .catch(showBlurhash);
  } else {
    showBlurhash();
  }

  return () => {
    cancelled = true;
    timers.forEach(window.clearTimeout);
    canvas.hidden = true;
  };
}
