import { type ReactNode } from 'react';
import type AbstractIntlMessages from './AbstractIntlMessages.js';
import type Formats from './Formats.js';
import type { InitializedIntlConfig } from './IntlConfig.js';
import IntlError from './IntlError.js';
import type { MessageKeys, NestedKeyOf, NestedValueOf } from './MessageKeys.js';
import type { MarkupTranslationValues, RichTranslationValues, TranslationValues } from './TranslationValues.js';
import { type Formatters, type IntlCache } from './formatters.js';
export type CreateBaseTranslatorProps<Messages> = InitializedIntlConfig & {
    cache: IntlCache;
    formatters: Formatters;
    namespace?: string;
    messagesOrError: Messages | IntlError;
};
export default function createBaseTranslator<Messages extends AbstractIntlMessages, NestedKey extends NestedKeyOf<Messages>>(config: Omit<CreateBaseTranslatorProps<Messages>, 'messagesOrError'>): {
    <TargetKey extends MessageKeys<NestedValueOf<Messages, NestedKey>, NestedKeyOf<NestedValueOf<Messages, NestedKey>>>>(key: TargetKey, values?: TranslationValues, formats?: Formats): string;
    rich: (key: string, values?: RichTranslationValues, formats?: Formats) => ReactNode;
    markup(key: Parameters<(key: string, values?: RichTranslationValues, formats?: Formats) => ReactNode>[0], values: MarkupTranslationValues, formats?: Parameters<(key: string, values?: RichTranslationValues, formats?: Formats) => ReactNode>[2]): string;
    raw(key: string): any;
    has(key: string): boolean;
};
