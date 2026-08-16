import { usePageMeta } from "@/hooks/usePageMeta";
import { useReveal } from "@/hooks/useReveal";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className ? `reveal ${className}` : "reveal"}>
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="page-hero container">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display display--page">{title}</h1>
      <p className="lead">{lead}</p>
    </header>
  );
}

export { usePageMeta };
