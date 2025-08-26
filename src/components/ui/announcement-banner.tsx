"use client";

import { useEffect, useState } from "react";

import { useDataContext } from "../contexts/DataContext";
import { Button } from "./button";
import { Text } from "./text";

const ANNOUNCEMENT_DISMISSED_KEY = "announcement-banner-dismissed";

export function AnnouncementBanner() {
  const { dictionary } = useDataContext();
  const [isDismissed, setIsDismissed] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (dictionary?.announce && dictionary.announce.trim()) {
      const dismissed = localStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY);
      const isDismissed = dismissed === "true";
      setIsDismissed(isDismissed);
      setIsVisible(!isDismissed);
    }
  }, [dictionary?.announce]);

  const handleDismiss = () => {
    localStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, "true");
    setIsVisible(false);
  };

  if (!dictionary?.announce || !dictionary.announce.trim() || !isVisible) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 flex h-6 items-center justify-between bg-bgColor pr-2.5 text-textColor lg:pr-4">
      <Text className="flex-1 text-center">{dictionary.announce}</Text>
      <Button onClick={handleDismiss} className="uppercase">
        [x]
      </Button>
    </div>
  );
}
