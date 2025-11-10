import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10", className)}
      aria-label="FastFind360 Logo"
    >
      <style>
        {`
          .fast-text {
            fill: hsl(var(--foreground));
            font-family: var(--font-space-grotesk), sans-serif;
            font-weight: 700;
            font-size: 24px;
          }
          .find-text {
            fill: hsl(var(--accent));
            font-family: var(--font-space-grotesk), sans-serif;
            font-weight: 700;
            font-size: 24px;
          }
          .underline {
            fill: hsl(var(--accent));
          }
        `}
      </style>
      <text x="0" y="24" className="fast-text">Fast</text>
      <text x="58" y="24" className="find-text">Find360</text>
      <rect x="0" y="34" width="195" height="3" className="underline" rx="1.5" />
    </svg>
  );
}
