import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function TextWrapper({ children, className }: Props) {
  return <div className={cn(className)}>{children}</div>;
}
