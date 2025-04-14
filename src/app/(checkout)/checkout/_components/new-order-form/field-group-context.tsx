"use client";

import { createContext, useState } from "react";

export const FieldsGroupContext = createContext<{
  groupContextName: string | null;
  setGroupContextName: (name: string | null) => void;
}>({
  groupContextName: null,
  setGroupContextName: () => {},
});
export function FieldsGroupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [groupContextName, setGroupContextName] = useState<string | null>(null);

  return (
    <FieldsGroupContext.Provider
      value={{ groupContextName, setGroupContextName }}
    >
      {children}
    </FieldsGroupContext.Provider>
  );
}
