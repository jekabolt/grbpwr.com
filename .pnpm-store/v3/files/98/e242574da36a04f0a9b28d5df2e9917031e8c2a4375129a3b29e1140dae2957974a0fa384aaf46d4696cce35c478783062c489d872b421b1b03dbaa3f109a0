import { getAcceptLanguageLocale } from './resolveLocale.js';

function syncCookie(request, response, locale, routing, domain) {
  if (!routing.localeCookie) return;
  const {
    name,
    ...rest
  } = routing.localeCookie;
  const acceptLanguageLocale = getAcceptLanguageLocale(request.headers, domain?.locales || routing.locales, routing.defaultLocale);
  const hasLocaleCookie = request.cookies.has(name);
  const hasOutdatedCookie = hasLocaleCookie && request.cookies.get(name)?.value !== locale;
  if (hasLocaleCookie ? hasOutdatedCookie : acceptLanguageLocale !== locale) {
    response.cookies.set(name, locale, {
      path: request.nextUrl.basePath || undefined,
      ...rest
    });
  }
}

export { syncCookie as default };
