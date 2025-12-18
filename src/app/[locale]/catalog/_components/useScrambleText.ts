"use client";

import { FIT_OPTIONS, TOP_CATEGORIES, currencySymbols } from "@/constants";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

const SCRAMBLE_INTERVAL_MS = 40;
const WORD_CHANGE_INTERVAL_MS = 1200;
const SCRAMBLE_STEPS = 10;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomItem<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function createRandomCurrencyPhrase() {
    const currency = getRandomItem(Object.values(currencySymbols));
    const value = Math.floor(Math.random() * 10_001);
    const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${currency} ${formatted}`;
}

// Unified scramble animation hook
function useScrambleAnimation(target: string, shouldRepeat = false) {
    const [display, setDisplay] = useState(target);
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        if (!shouldRepeat || !target) return;

        const id = setInterval(() => {
            setCycle((c) => c + 1);
        }, WORD_CHANGE_INTERVAL_MS);

        return () => clearInterval(id);
    }, [shouldRepeat, target]);

    useEffect(() => {
        if (!target) return;

        let step = 0;
        const intervalId = setInterval(() => {
            step += 1;
            const progress = step / SCRAMBLE_STEPS;

            const next = target
                .split("")
                .map((char) => {
                    if (char === " ") return " ";
                    return Math.random() < progress
                        ? char
                        : CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("");

            setDisplay(next);

            if (step >= SCRAMBLE_STEPS) {
                clearInterval(intervalId);
                setDisplay(target);
            }
        }, SCRAMBLE_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [target, cycle]);

    return display;
}

// Generic hook for auto-updating text
function useAutoScrambleText(generatePhrase: () => string) {
    const [target, setTarget] = useState("");

    useEffect(() => {
        setTarget(generatePhrase());

        const intervalId = setInterval(() => {
            setTarget(generatePhrase());
        }, WORD_CHANGE_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [generatePhrase]);

    return useScrambleAnimation(target);
}


export function useScrambleText() {
    const t = useTranslations("categories");
    const tFit = useTranslations("fit");

    const createRandomPhrase = useCallback(() => {
        const fit = getRandomItem(FIT_OPTIONS);
        const category = getRandomItem(TOP_CATEGORIES);
        const translatedFit = tFit(fit);
        const translatedCategory =
            category.key === "loungewear_sleepwear"
                ? category.label
                : t(category.key);
        return `${translatedFit} ${translatedCategory}`;
    }, [t, tFit]);

    return useAutoScrambleText(createRandomPhrase);
}

export function useScrambleCurrencyText() {
    return useAutoScrambleText(createRandomCurrencyPhrase);
}

export function useScrambleStaticText(target: string) {
    return useScrambleAnimation(target, true);
}
