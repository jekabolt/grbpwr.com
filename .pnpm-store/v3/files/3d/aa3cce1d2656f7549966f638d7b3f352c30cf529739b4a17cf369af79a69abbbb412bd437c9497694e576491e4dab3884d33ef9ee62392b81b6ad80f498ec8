import createMessagesDeclaration from './createMessagesDeclaration.js';
import getNextConfig from './getNextConfig.js';
import { warn } from './utils.js';

function initPlugin(pluginConfig, nextConfig) {
  if (nextConfig?.i18n != null) {
    warn("\n[next-intl] An `i18n` property was found in your Next.js config. This likely causes conflicts and should therefore be removed if you use the App Router.\n\nIf you're in progress of migrating from the Pages Router, you can refer to this example: https://next-intl.dev/examples#app-router-migration\n");
  }
  const messagesPathOrPaths = pluginConfig.experimental?.createMessagesDeclaration;
  if (messagesPathOrPaths) {
    createMessagesDeclaration(typeof messagesPathOrPaths === 'string' ? [messagesPathOrPaths] : messagesPathOrPaths);
  }
  return getNextConfig(pluginConfig, nextConfig);
}
function createNextIntlPlugin(i18nPathOrConfig = {}) {
  const config = typeof i18nPathOrConfig === 'string' ? {
    requestConfig: i18nPathOrConfig
  } : i18nPathOrConfig;
  return function withNextIntl(nextConfig) {
    return initPlugin(config, nextConfig);
  };
}

export { createNextIntlPlugin as default };
