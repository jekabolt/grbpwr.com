"use client";

import { useState } from "react";
import { useFormState } from "react-hook-form";

export function useDisabledGroup({ fields }: { fields: string[] }) {
  const [isGroupDisabled, setIsGroupDisabled] = useState(false);
  const { errors, dirtyFields, touchedFields } = useFormState();

  // console.log(touchedFields);

  // useEffect(() => {
  //   const isAllFieldsTouched = fields.every((field) => touchedFields[field]);
  //   const noErrorsInTheGroup = fields.every((field) => !errors[field]);

  //   const enableGroup = isAllFieldsTouched && noErrorsInTheGroup;

  //   console.log(isAllFieldsTouched, noErrorsInTheGroup);

  //   console.log(enableGroup);

  //   if (enableGroup) {
  //     setIsGroupDisabled(false);
  //   }
  // }, [errors, touchedFields, fields, dirtyFields]);

  return {
    isGroupDisabled,
  };
}
