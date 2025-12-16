import { currencySymbols } from "@/constants";
import { useCallback, useEffect, useState } from "react";

type UseScrambleOptions = {
    randomOnEmpty?: boolean;
    length?: number;
    reveal?: boolean;
    continuous?: boolean;
    scramblePrice?: boolean;
    randomizeFrom?: string[];
    randomizeInterval?: number;
    animationSpeed?: number; // Speed of scrambling animation in ms (lower = faster)
};

export function useScrambleText(
    text = "",
    duration = 1000,
    options: UseScrambleOptions = {}
) {
    const {
        randomOnEmpty = false,
        length = 12,
        reveal = true,
        continuous = false,
        scramblePrice = false,
        randomizeFrom,
        randomizeInterval = 500,
        animationSpeed = 50 // Default 10ms (100 updates per second)
    } = options;

    const allCurrencySymbols = Object.values(currencySymbols).join("");
    const chars = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*${allCurrencySymbols}`;
    const letters = `abcdefghijklmnopqrstuvwxyz`;

    const getRandomChar = useCallback((charSet = chars) =>
        charSet[Math.floor(Math.random() * charSet.length)],
        [chars]
    );

    const getRandomLetter = useCallback(() =>
        letters[Math.floor(Math.random() * letters.length)],
        []
    );

    // Helper functions
    const getRandomCurrency = useCallback(() => {
        const keys = Object.keys(currencySymbols);
        return currencySymbols[keys[Math.floor(Math.random() * keys.length)]];
    }, []);

    const generatePriceBase = useCallback(() => {
        const currency = getRandomCurrency();
        const number = Math.floor(Math.random() * 10001);
        return `${currency} ${number.toLocaleString()}`;
    }, [getRandomCurrency]);

    const scrambleChar = useCallback((char: string, index: number, isPrice: boolean) => {
        if (char === " ") return " ";
        if (isPrice) {
            const charSet = index === 0
                ? `${allCurrencySymbols}ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*`
                : "0123456789";
            return getRandomChar(charSet);
        }
        return getRandomChar();
    }, [getRandomChar, allCurrencySymbols]);

    const [basePrice, setBasePrice] = useState(generatePriceBase);
    const [randomizedText, setRandomizedText] = useState(() => {
        if (randomizeFrom && randomizeFrom.length > 0) {
            return randomizeFrom[Math.floor(Math.random() * randomizeFrom.length)];
        }
        return text;
    });

    const baseText = (randomizeFrom ? randomizedText : text).trim() || (randomOnEmpty ? Array.from({ length }, () => getRandomChar()).join("") : "");

    const [displayText, setDisplayText] = useState(() => {
        if (scramblePrice) {
            return basePrice.split("").map((char, i) => scrambleChar(char, i, true)).join("");
        }
        if (!baseText) return "";
        return baseText.split("").map((char) => char === " " ? " " : getRandomChar()).join("");
    });

    // Randomize text from array at intervals
    useEffect(() => {
        if (randomizeFrom && randomizeFrom.length > 0) {
            const interval = setInterval(() => {
                setRandomizedText(
                    randomizeFrom[Math.floor(Math.random() * randomizeFrom.length)]
                );
            }, randomizeInterval);
            return () => clearInterval(interval);
        }
    }, [randomizeFrom, randomizeInterval]);

    useEffect(() => {
        if (scramblePrice) {
            let frame = 0;
            const interval = setInterval(() => {
                if (++frame % 60 === 0) setBasePrice(generatePriceBase());

                setDisplayText(
                    basePrice.split("").map((char, i) =>
                        char === " " ? " " : Math.random() < 0.3 ? char : scrambleChar(char, i, true)
                    ).join("")
                );
            }, animationSpeed);
            return () => clearInterval(interval);
        }

        if (!baseText) {
            setDisplayText("");
            return;
        }

        const scramble = (str: string, revealUpTo: number) =>
            str.split("").map((char, i) =>
                char === " " ? " " : (reveal && i < revealUpTo) ? char : getRandomChar()
            ).join("");

        if (continuous) {
            // Continuous scrambling - randomly reveal some characters from the actual text
            // Use letters for text scrambling instead of random symbols
            const interval = setInterval(() => {
                setDisplayText(
                    baseText.split("").map((char, i) => {
                        if (char === " ") return " ";
                        // Randomly show actual character or scrambled letter
                        return Math.random() < 0.3 ? char : getRandomLetter();
                    }).join("")
                );
            }, animationSpeed);
            return () => clearInterval(interval);
        }

        let frame = 0;
        const totalFrames = duration / animationSpeed;
        const interval = setInterval(() => {
            const revealIndex = reveal ? Math.floor((frame / totalFrames) * baseText.length) : 0;
            setDisplayText(scramble(baseText, revealIndex));

            if (reveal && ++frame >= totalFrames) {
                setDisplayText(baseText);
                clearInterval(interval);
            }
        }, animationSpeed);

        return () => clearInterval(interval);
    }, [baseText, duration, reveal, continuous, scramblePrice, basePrice, animationSpeed, getRandomChar, getRandomLetter, scrambleChar, generatePriceBase]);

    return displayText;
}
