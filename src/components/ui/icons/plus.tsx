import { SVGProps } from "react";

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="9"
      height="8"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.875 10H4.625V5.625H0.25V4.375H4.625V0H5.875V4.375H10.25V5.625H5.875V10Z"
        fill="black"
      />
    </svg>
  );
}
