"use client";

import { useEffect, useState } from "react";
import { useForm, useFormContext, useFormState } from "react-hook-form";

import { useDataContext } from "@/components/DataContext";

import {
  CONTACT_GROUP_FIELDS,
  PAYMENT_GROUP_FIELDS,
  SHIPPING_GROUP_FIELDS,
} from "./constants";

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
