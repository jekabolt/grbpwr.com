"use client";

import { useEffect, useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";


import {
  CONTACT_GROUP_FIELDS,
  PAYMENT_GROUP_FIELDS,
  SHIPPING_GROUP_FIELDS,
} from "./constants";

export function useDisabledGroup({ fields }: { fields: string[] }) {
  const [isGroupDisabled, setIsGroupDisabled] = useState(false);
  const formContext = useFormContext();
  const { errors } = useFormState({ control: formContext.control });

  // Get form values
  const formValues = formContext.watch();

  useEffect(() => {
    // Check if fields in the previous group are completed
    // For shipping fields, check if contact fields are completed
    // For payment fields, check if shipping fields are completed

    // Determine which fields to check based on the current group
    let fieldsToCheck = [];

    if (fields === SHIPPING_GROUP_FIELDS) {
      fieldsToCheck = CONTACT_GROUP_FIELDS;

      // Also check if terms are accepted
      const termsAccepted = formValues.termsOfService;
      const allContactFieldsValid = fieldsToCheck.every(field =>
        formValues[field as keyof typeof formValues] &&
        !errors[field as keyof typeof errors]
      );

      setIsGroupDisabled(!(allContactFieldsValid && termsAccepted));
    }
    else if (fields === PAYMENT_GROUP_FIELDS) {
      fieldsToCheck = SHIPPING_GROUP_FIELDS;
      const requiredShippingFields = [
        "firstName",
        "lastName",
        "country",
        "city",
        "address",
        "postalCode",
        "shipmentCarrierId",
      ];

      const allShippingFieldsValid = requiredShippingFields.every(field =>
        formValues[field as keyof typeof formValues] &&
        !errors[field as keyof typeof errors]
      );

      setIsGroupDisabled(!allShippingFieldsValid);
    }

  }, [fields, formValues, errors]);

  return {
    isGroupDisabled,
  };
}
