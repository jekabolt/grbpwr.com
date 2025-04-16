"use client";

import { useState } from "react";

export function useDisabledGroup({ fields }: { fields: string[] }) {
  const [isGroupDisabled, setIsGroupDisabled] = useState(false);

  return {
    isGroupDisabled,
  };
}
