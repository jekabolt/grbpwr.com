"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

import GlobalLink from "@/components/global/Link";
import { LinkStyle } from "@/components/global/Link/styles";

export default function useMovileMenu() {
  const [isOpen, setOpenStatus] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => {
    setOpenStatus(false);
  });

  return {
    triggerElement: <MobileMenuTrigger setOpenStatus={setOpenStatus} />,
    dropdownElement: isOpen ? (
      <div ref={ref}>
        <MobileMenuDropdown setOpenStatus={setOpenStatus} />
      </div>
    ) : null,
  };
}

function MobileMenuTrigger({
  setOpenStatus,
}: {
  setOpenStatus: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <button className="text-sm underline" onClick={() => setOpenStatus(true)}>
      menu
    </button>
  );
}

function MobileMenuDropdown({
  setOpenStatus,
}: {
  setOpenStatus: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="absolute left-0 top-[72px] w-full border-t border-gray-300 bg-bgColor p-3 pb-5 text-textColor">
      <button
        className="absolute right-3 top-3"
        onClick={() => setOpenStatus(false)}
      >
        {"[x]"}
      </button>
      <nav className="space-y-6">
        <GlobalLink
          style={LinkStyle.mainNavigation}
          title="catalog"
          href="/catalog"
        />
        <GlobalLink
          style={LinkStyle.mainNavigation}
          title="archive"
          href="/archive"
        />
        <GlobalLink
          style={LinkStyle.mainNavigation}
          title="about"
          href="/about"
        />
        <GlobalLink
          style={LinkStyle.mainNavigation}
          title="shipping"
          href="/shipping"
        />
        <GlobalLink
          style={LinkStyle.mainNavigation}
          title="contacts"
          href="/contacts"
        />
      </nav>
    </div>
  );
}
