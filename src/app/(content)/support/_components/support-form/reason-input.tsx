"use client";

import { Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { SupportData } from "./schema";

const reasons = [
  "REFUND",
  "SHIPMENT",
  "PAYMENT",
  "RETURN",
  "WRONG ITEM",
  "CANCEL ORDER",
  "OTHER",
] as const;

interface ReasonInputProps {
  control: Control<SupportData>;
  reasonSelected: string;
}

export function ReasonInput({ control, reasonSelected }: ReasonInputProps) {
  return (
    <FormField
      control={control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">reason:</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-3">
              {reasons.map((r) => (
                <Button
                  key={r}
                  variant={r === reasonSelected ? "main" : "secondary"}
                  size="lg"
                  onClick={() => field.onChange(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
