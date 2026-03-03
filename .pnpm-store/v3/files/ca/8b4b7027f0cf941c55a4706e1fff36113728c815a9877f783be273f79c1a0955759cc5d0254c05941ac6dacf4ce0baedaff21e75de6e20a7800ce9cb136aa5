import { IntlMessageFormat } from 'intl-messageformat';
import { isValidElement, cloneElement } from 'react';
import { memoize, strategies } from '@formatjs/fast-memoize';

class IntlError extends Error {
  constructor(code, originalMessage) {
    let message = code;
    if (originalMessage) {
      message += ': ' + originalMessage;
    }
    super(message);
    this.code = code;
    if (originalMessage) {
      this.originalMessage = originalMessage;
    }
  }
}

var IntlErrorCode = /*#__PURE__*/function (IntlErrorCode) {
  IntlErrorCode["MISSING_MESSAGE"] = "MISSING_MESSAGE";
  IntlErrorCode["MISSING_FORMAT"] = "MISSING_FORMAT";
  IntlErrorCode["ENVIRONMENT_FALLBACK"] = "ENVIRONMENT_FALLBACK";
  IntlErrorCode["INSUFFICIENT_PATH"] = "INSUFFICIENT_PATH";
  IntlErrorCode["INVALID_MESSAGE"] = "INVALID_MESSAGE";
  IntlErrorCode["INVALID_KEY"] = "INVALID_KEY";
  IntlErrorCode["FORMATTING_ERROR"] = "FORMATTING_ERROR";
  return IntlErrorCode;
}(IntlErrorCode || {});

/**
 * `intl-messageformat` uses separate keys for `date` and `time`, but there's
 * only one native API: `Intl.DateTimeFormat`. Additionally you might want to
 * include both a time and a date in a value, therefore the separation doesn't
 * seem so useful. We offer a single `dateTime` namespace instead, but we have
 * to convert the format before `intl-messageformat` can be used.
 */
function convertFormatsToIntlMessageFormat(globalFormats, inlineFormats, timeZone) {
  const mfDateDefaults = IntlMessageFormat.formats.date;
  const mfTimeDefaults = IntlMessageFormat.formats.time;
  const dateTimeFormats = {
    ...globalFormats?.dateTime,
    ...inlineFormats?.dateTime
  };
  const allFormats = {
    date: {
      ...mfDateDefaults,
      ...dateTimeFormats
    },
    time: {
      ...mfTimeDefaults,
      ...dateTimeFormats
    },
    number: {
      ...globalFormats?.number,
      ...inlineFormats?.number
    }
    // (list is not supported in ICU messages)
  };
  if (timeZone) {
    // The only way to set a time zone with `intl-messageformat` is to merge it into the formats
    // https://github.com/formatjs/formatjs/blob/8256c5271505cf2606e48e3c97ecdd16ede4f1b5/packages/intl/src/message.ts#L15
    ['date', 'time'].forEach(property => {
      const formats = allFormats[property];
      for (const [key, value] of Object.entries(formats)) {
        formats[key] = {
          timeZone,
          ...value
        };
      }
    });
  }
  return allFormats;
}

function joinPath(...parts) {
  return parts.filter(Boolean).join('.');
}

/**
 * Contains defaults that are used for all entry points into the core.
 * See also `InitializedIntlConfiguration`.
 */

function defaultGetMessageFallback(props) {
  return joinPath(props.namespace, props.key);
}
function defaultOnError(error) {
  console.error(error);
}

function createCache() {
  return {
    dateTime: {},
    number: {},
    message: {},
    relativeTime: {},
    pluralRules: {},
    list: {},
    displayNames: {}
  };
}
function createMemoCache(store) {
  return {
    create() {
      return {
        get(key) {
          return store[key];
        },
        set(key, value) {
          store[key] = value;
        }
      };
    }
  };
}
function memoFn(fn, cache) {
  return memoize(fn, {
    cache: createMemoCache(cache),
    strategy: strategies.variadic
  });
}
function memoConstructor(ConstructorFn, cache) {
  return memoFn((...args) => new ConstructorFn(...args), cache);
}
function createIntlFormatters(cache) {
  const getDateTimeFormat = memoConstructor(Intl.DateTimeFormat, cache.dateTime);
  const getNumberFormat = memoConstructor(Intl.NumberFormat, cache.number);
  const getPluralRules = memoConstructor(Intl.PluralRules, cache.pluralRules);
  const getRelativeTimeFormat = memoConstructor(Intl.RelativeTimeFormat, cache.relativeTime);
  const getListFormat = memoConstructor(Intl.ListFormat, cache.list);
  const getDisplayNames = memoConstructor(Intl.DisplayNames, cache.displayNames);
  return {
    getDateTimeFormat,
    getNumberFormat,
    getPluralRules,
    getRelativeTimeFormat,
    getListFormat,
    getDisplayNames
  };
}

// Placed here for improved tree shaking. Somehow when this is placed in
// `formatters.tsx`, then it can't be shaken off from `next-intl`.
function createMessageFormatter(cache, intlFormatters) {
  const getMessageFormat = memoFn((...args) => new IntlMessageFormat(args[0], args[1], args[2], {
    formatters: intlFormatters,
    ...args[3]
  }), cache.message);
  return getMessageFormat;
}
function resolvePath(locale, messages, key, namespace) {
  const fullKey = joinPath(namespace, key);
  if (!messages) {
    throw new Error(`No messages available at \`${namespace}\`.` );
  }
  let message = messages;
  key.split('.').forEach(part => {
    const next = message[part];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (part == null || next == null) {
      throw new Error(`Could not resolve \`${fullKey}\` in messages for locale \`${locale}\`.` );
    }
    message = next;
  });
  return message;
}
function prepareTranslationValues(values) {
  // Workaround for https://github.com/formatjs/formatjs/issues/1467
  const transformedValues = {};
  Object.keys(values).forEach(key => {
    let index = 0;
    const value = values[key];
    let transformed;
    if (typeof value === 'function') {
      transformed = chunks => {
        const result = value(chunks);
        return /*#__PURE__*/isValidElement(result) ? /*#__PURE__*/cloneElement(result, {
          key: key + index++
        }) : result;
      };
    } else {
      transformed = value;
    }
    transformedValues[key] = transformed;
  });
  return transformedValues;
}
function getMessagesOrError(locale, messages, namespace, onError = defaultOnError) {
  try {
    if (!messages) {
      throw new Error(`No messages were configured.` );
    }
    const retrievedMessages = namespace ? resolvePath(locale, messages, namespace) : messages;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!retrievedMessages) {
      throw new Error(`No messages for namespace \`${namespace}\` found.` );
    }
    return retrievedMessages;
  } catch (error) {
    const intlError = new IntlError(IntlErrorCode.MISSING_MESSAGE, error.message);
    onError(intlError);
    return intlError;
  }
}
function getPlainMessage(candidate, values) {
  // To improve runtime performance, only compile message if:
  return (
    // 1. Values are provided
    values ||
    // 2. There are escaped braces (e.g. "'{name'}")
    /'[{}]/.test(candidate) ||
    // 3. There are missing arguments or tags (dev-only error handling)
    /<|{/.test(candidate) ? undefined // Compile
    : candidate // Don't compile
  );
}
function createBaseTranslator(config) {
  const messagesOrError = getMessagesOrError(config.locale, config.messages, config.namespace, config.onError);
  return createBaseTranslatorImpl({
    ...config,
    messagesOrError
  });
}
function createBaseTranslatorImpl({
  cache,
  formats: globalFormats,
  formatters,
  getMessageFallback = defaultGetMessageFallback,
  locale,
  messagesOrError,
  namespace,
  onError,
  timeZone
}) {
  const hasMessagesError = messagesOrError instanceof IntlError;
  function getFallbackFromErrorAndNotify(key, code, message) {
    const error = new IntlError(code, message);
    onError(error);
    return getMessageFallback({
      error,
      key,
      namespace
    });
  }
  function translateBaseFn(/** Use a dot to indicate a level of nesting (e.g. `namespace.nestedLabel`). */
  key, /** Key value pairs for values to interpolate into the message. */
  values, /** Provide custom formats for numbers, dates and times. */
  formats) {
    if (hasMessagesError) {
      // We have already warned about this during render
      return getMessageFallback({
        error: messagesOrError,
        key,
        namespace
      });
    }
    const messages = messagesOrError;
    let message;
    try {
      message = resolvePath(locale, messages, key, namespace);
    } catch (error) {
      return getFallbackFromErrorAndNotify(key, IntlErrorCode.MISSING_MESSAGE, error.message);
    }
    if (typeof message === 'object') {
      let code, errorMessage;
      if (Array.isArray(message)) {
        code = IntlErrorCode.INVALID_MESSAGE;
        {
          errorMessage = `Message at \`${joinPath(namespace, key)}\` resolved to an array, but only strings are supported. See https://next-intl.dev/docs/usage/messages#arrays-of-messages`;
        }
      } else {
        code = IntlErrorCode.INSUFFICIENT_PATH;
        {
          errorMessage = `Message at \`${joinPath(namespace, key)}\` resolved to an object, but only strings are supported. Use a \`.\` to retrieve nested messages. See https://next-intl.dev/docs/usage/messages#structuring-messages`;
        }
      }
      return getFallbackFromErrorAndNotify(key, code, errorMessage);
    }
    let messageFormat;

    // Hot path that avoids creating an `IntlMessageFormat` instance
    const plainMessage = getPlainMessage(message, values);
    if (plainMessage) return plainMessage;

    // Lazy init the message formatter for better tree
    // shaking in case message formatting is not used.
    if (!formatters.getMessageFormat) {
      formatters.getMessageFormat = createMessageFormatter(cache, formatters);
    }
    try {
      messageFormat = formatters.getMessageFormat(message, locale, convertFormatsToIntlMessageFormat(globalFormats, formats, timeZone), {
        formatters: {
          ...formatters,
          getDateTimeFormat(locales, options) {
            // Workaround for https://github.com/formatjs/formatjs/issues/4279
            return formatters.getDateTimeFormat(locales, {
              timeZone,
              ...options
            });
          }
        }
      });
    } catch (error) {
      const thrownError = error;
      return getFallbackFromErrorAndNotify(key, IntlErrorCode.INVALID_MESSAGE, thrownError.message + ('originalMessage' in thrownError ? ` (${thrownError.originalMessage})` : '') );
    }
    try {
      const formattedMessage = messageFormat.format(
      // @ts-expect-error `intl-messageformat` expects a different format
      // for rich text elements since a recent minor update. This
      // needs to be evaluated in detail, possibly also in regards
      // to be able to format to parts.
      values ? prepareTranslationValues(values) : values);
      if (formattedMessage == null) {
        throw new Error(`Unable to format \`${key}\` in ${namespace ? `namespace \`${namespace}\`` : 'messages'}` );
      }

      // Limit the function signature to return strings or React elements
      return /*#__PURE__*/isValidElement(formattedMessage) ||
      // Arrays of React elements
      Array.isArray(formattedMessage) || typeof formattedMessage === 'string' ? formattedMessage : String(formattedMessage);
    } catch (error) {
      return getFallbackFromErrorAndNotify(key, IntlErrorCode.FORMATTING_ERROR, error.message);
    }
  }
  function translateFn(/** Use a dot to indicate a level of nesting (e.g. `namespace.nestedLabel`). */
  key, /** Key value pairs for values to interpolate into the message. */
  values, /** Provide custom formats for numbers, dates and times. */
  formats) {
    const result = translateBaseFn(key, values, formats);
    if (typeof result !== 'string') {
      return getFallbackFromErrorAndNotify(key, IntlErrorCode.INVALID_MESSAGE, `The message \`${key}\` in ${namespace ? `namespace \`${namespace}\`` : 'messages'} didn't resolve to a string. If you want to format rich text, use \`t.rich\` instead.` );
    }
    return result;
  }
  translateFn.rich = translateBaseFn;

  // Augment `translateBaseFn` to return plain strings
  translateFn.markup = (key, values, formats) => {
    const result = translateBaseFn(key,
    // @ts-expect-error -- `MarkupTranslationValues` is practically a sub type
    // of `RichTranslationValues` but TypeScript isn't smart enough here.
    values, formats);
    if (typeof result !== 'string') {
      const error = new IntlError(IntlErrorCode.FORMATTING_ERROR, "`t.markup` only accepts functions for formatting that receive and return strings.\n\nE.g. t.markup('markup', {b: (chunks) => `<b>${chunks}</b>`})");
      onError(error);
      return getMessageFallback({
        error,
        key,
        namespace
      });
    }
    return result;
  };
  translateFn.raw = key => {
    if (hasMessagesError) {
      // We have already warned about this during render
      return getMessageFallback({
        error: messagesOrError,
        key,
        namespace
      });
    }
    const messages = messagesOrError;
    try {
      return resolvePath(locale, messages, key, namespace);
    } catch (error) {
      return getFallbackFromErrorAndNotify(key, IntlErrorCode.MISSING_MESSAGE, error.message);
    }
  };
  translateFn.has = key => {
    if (hasMessagesError) {
      return false;
    }
    try {
      resolvePath(locale, messagesOrError, key, namespace);
      return true;
    } catch {
      return false;
    }
  };
  return translateFn;
}

/**
 * For the strictly typed messages to work we have to wrap the namespace into
 * a mandatory prefix. See https://stackoverflow.com/a/71529575/343045
 */
function resolveNamespace(namespace, namespacePrefix) {
  return namespace === namespacePrefix ? undefined : namespace.slice((namespacePrefix + '.').length);
}

const SECOND = 1;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * (365 / 12); // Approximation
const QUARTER = MONTH * 3;
const YEAR = DAY * 365;
const UNIT_SECONDS = {
  second: SECOND,
  seconds: SECOND,
  minute: MINUTE,
  minutes: MINUTE,
  hour: HOUR,
  hours: HOUR,
  day: DAY,
  days: DAY,
  week: WEEK,
  weeks: WEEK,
  month: MONTH,
  months: MONTH,
  quarter: QUARTER,
  quarters: QUARTER,
  year: YEAR,
  years: YEAR
};
function resolveRelativeTimeUnit(seconds) {
  const absValue = Math.abs(seconds);
  if (absValue < MINUTE) {
    return 'second';
  } else if (absValue < HOUR) {
    return 'minute';
  } else if (absValue < DAY) {
    return 'hour';
  } else if (absValue < WEEK) {
    return 'day';
  } else if (absValue < MONTH) {
    return 'week';
  } else if (absValue < YEAR) {
    return 'month';
  }
  return 'year';
}
function calculateRelativeTimeValue(seconds, unit) {
  // We have to round the resulting values, as `Intl.RelativeTimeFormat`
  // will include fractions like '2.1 hours ago'.
  return Math.round(seconds / UNIT_SECONDS[unit]);
}
function createFormatter(props) {
  const {
    _cache: cache = createCache(),
    _formatters: formatters = createIntlFormatters(cache),
    formats,
    locale,
    onError = defaultOnError,
    timeZone: globalTimeZone
  } = props;
  function applyTimeZone(options) {
    if (!options?.timeZone) {
      if (globalTimeZone) {
        options = {
          ...options,
          timeZone: globalTimeZone
        };
      } else {
        onError(new IntlError(IntlErrorCode.ENVIRONMENT_FALLBACK, `The \`timeZone\` parameter wasn't provided and there is no global default configured. Consider adding a global default to avoid markup mismatches caused by environment differences. Learn more: https://next-intl.dev/docs/configuration#time-zone` ));
      }
    }
    return options;
  }
  function resolveFormatOrOptions(typeFormats, formatOrOptions, overrides) {
    let options;
    if (typeof formatOrOptions === 'string') {
      const formatName = formatOrOptions;
      options = typeFormats?.[formatName];
      if (!options) {
        const error = new IntlError(IntlErrorCode.MISSING_FORMAT, `Format \`${formatName}\` is not available.` );
        onError(error);
        throw error;
      }
    } else {
      options = formatOrOptions;
    }
    if (overrides) {
      options = {
        ...options,
        ...overrides
      };
    }
    return options;
  }
  function getFormattedValue(formatOrOptions, overrides, typeFormats, formatter, getFallback) {
    let options;
    try {
      options = resolveFormatOrOptions(typeFormats, formatOrOptions, overrides);
    } catch {
      return getFallback();
    }
    try {
      return formatter(options);
    } catch (error) {
      onError(new IntlError(IntlErrorCode.FORMATTING_ERROR, error.message));
      return getFallback();
    }
  }
  function dateTime(value, formatOrOptions, overrides) {
    return getFormattedValue(formatOrOptions, overrides, formats?.dateTime, options => {
      options = applyTimeZone(options);
      return formatters.getDateTimeFormat(locale, options).format(value);
    }, () => String(value));
  }
  function dateTimeRange(start, end, formatOrOptions, overrides) {
    return getFormattedValue(formatOrOptions, overrides, formats?.dateTime, options => {
      options = applyTimeZone(options);
      return formatters.getDateTimeFormat(locale, options).formatRange(start, end);
    }, () => [dateTime(start), dateTime(end)].join(' – '));
  }
  function number(value, formatOrOptions, overrides) {
    return getFormattedValue(formatOrOptions, overrides, formats?.number, options => formatters.getNumberFormat(locale, options).format(value), () => String(value));
  }
  function getGlobalNow() {
    // Only read when necessary to avoid triggering a `dynamicIO` error
    // unnecessarily (`now` is only needed for `format.relativeTime`)
    if (props.now) {
      return props.now;
    } else {
      onError(new IntlError(IntlErrorCode.ENVIRONMENT_FALLBACK, `The \`now\` parameter wasn't provided to \`relativeTime\` and there is no global default configured, therefore the current time will be used as a fallback. See https://next-intl.dev/docs/usage/dates-times#relative-times-usenow` ));
      return new Date();
    }
  }
  function relativeTime(date, nowOrOptions) {
    try {
      let nowDate, unit;
      const opts = {};
      if (nowOrOptions instanceof Date || typeof nowOrOptions === 'number') {
        nowDate = new Date(nowOrOptions);
      } else if (nowOrOptions) {
        if (nowOrOptions.now != null) {
          nowDate = new Date(nowOrOptions.now);
        } else {
          nowDate = getGlobalNow();
        }
        unit = nowOrOptions.unit;
        opts.style = nowOrOptions.style;
        // @ts-expect-error -- Types are slightly outdated
        opts.numberingSystem = nowOrOptions.numberingSystem;
      }
      if (!nowDate) {
        nowDate = getGlobalNow();
      }
      const dateDate = new Date(date);
      const seconds = (dateDate.getTime() - nowDate.getTime()) / 1000;
      if (!unit) {
        unit = resolveRelativeTimeUnit(seconds);
      }

      // `numeric: 'auto'` can theoretically produce output like "yesterday",
      // but it only works with integers. E.g. -1 day will produce "yesterday",
      // but -1.1 days will produce "-1.1 days". Rounding before formatting is
      // not desired, as the given dates might cross a threshold were the
      // output isn't correct anymore. Example: 2024-01-08T23:00:00.000Z and
      // 2024-01-08T01:00:00.000Z would produce "yesterday", which is not the
      // case. By using `always` we can ensure correct output. The only exception
      // is the formatting of times <1 second as "now".
      opts.numeric = unit === 'second' ? 'auto' : 'always';
      const value = calculateRelativeTimeValue(seconds, unit);
      return formatters.getRelativeTimeFormat(locale, opts).format(value, unit);
    } catch (error) {
      onError(new IntlError(IntlErrorCode.FORMATTING_ERROR, error.message));
      return String(date);
    }
  }
  function list(value, formatOrOptions, overrides) {
    const serializedValue = [];
    const richValues = new Map();

    // `formatToParts` only accepts strings, therefore we have to temporarily
    // replace React elements with a placeholder ID that can be used to retrieve
    // the original value afterwards.
    let index = 0;
    for (const item of value) {
      let serializedItem;
      if (typeof item === 'object') {
        serializedItem = String(index);
        richValues.set(serializedItem, item);
      } else {
        serializedItem = String(item);
      }
      serializedValue.push(serializedItem);
      index++;
    }
    return getFormattedValue(formatOrOptions, overrides, formats?.list,
    // @ts-expect-error -- `richValues.size` is used to determine the return type, but TypeScript can't infer the meaning of this correctly
    options => {
      const result = formatters.getListFormat(locale, options).formatToParts(serializedValue).map(part => part.type === 'literal' ? part.value : richValues.get(part.value) || part.value);
      if (richValues.size > 0) {
        return result;
      } else {
        return result.join('');
      }
    }, () => String(value));
  }
  return {
    dateTime,
    number,
    relativeTime,
    list,
    dateTimeRange
  };
}

function validateMessagesSegment(messages, invalidKeyLabels, parentPath) {
  Object.entries(messages).forEach(([key, messageOrMessages]) => {
    if (key.includes('.')) {
      let keyLabel = key;
      if (parentPath) keyLabel += ` (at ${parentPath})`;
      invalidKeyLabels.push(keyLabel);
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (messageOrMessages != null && typeof messageOrMessages === 'object') {
      validateMessagesSegment(messageOrMessages, invalidKeyLabels, joinPath(parentPath, key));
    }
  });
}
function validateMessages(messages, onError) {
  const invalidKeyLabels = [];
  validateMessagesSegment(messages, invalidKeyLabels);
  if (invalidKeyLabels.length > 0) {
    onError(new IntlError(IntlErrorCode.INVALID_KEY, `Namespace keys can not contain the character "." as this is used to express nesting. Please remove it or replace it with another character.

Invalid ${invalidKeyLabels.length === 1 ? 'key' : 'keys'}: ${invalidKeyLabels.join(', ')}

If you're migrating from a flat structure, you can convert your messages as follows:

import {set} from "lodash";

const input = {
  "one.one": "1.1",
  "one.two": "1.2",
  "two.one.one": "2.1.1"
};

const output = Object.entries(input).reduce(
  (acc, [key, value]) => set(acc, key, value),
  {}
);

// Output:
//
// {
//   "one": {
//     "one": "1.1",
//     "two": "1.2"
//   },
//   "two": {
//     "one": {
//       "one": "2.1.1"
//     }
//   }
// }
` ));
  }
}

/**
 * Enhances the incoming props with defaults.
 */
function initializeConfig({
  formats,
  getMessageFallback,
  messages,
  onError,
  ...rest
}) {
  const finalOnError = onError || defaultOnError;
  const finalGetMessageFallback = getMessageFallback || defaultGetMessageFallback;
  {
    if (messages) {
      validateMessages(messages, finalOnError);
    }
  }
  return {
    ...rest,
    formats: formats || undefined,
    messages: messages || undefined,
    onError: finalOnError,
    getMessageFallback: finalGetMessageFallback
  };
}

export { IntlError as I, IntlErrorCode as a, createIntlFormatters as b, createFormatter as c, createCache as d, createBaseTranslator as e, defaultGetMessageFallback as f, defaultOnError as g, initializeConfig as i, resolveNamespace as r };
