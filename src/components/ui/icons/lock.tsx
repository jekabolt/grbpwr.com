import { SVGProps } from "react";

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 7.25H12V13H4V7.25Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 7.25V5.5C5.75 4.25736 6.75736 3.25 8 3.25C9.24264 3.25 10.25 4.25736 10.25 5.5V7.25"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
