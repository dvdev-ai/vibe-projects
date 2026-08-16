import { Link, Navigate, useParams } from "react-router-dom";
import { PageHero, Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { work } from "@/data/profile";

export function WorkCasePage() {
  const { slug } = useParams();
  const item = work.find((entry) => entry.slug === slug);

  usePageMeta(
    item ? `${item.title} — Данила Вертий` : "Работа — Данила Вертий",
    item?.summary ?? "Кейс из портфолио.",
  );

  if (!item) return <Navigate to="/work" replace />;

  return (
    <>
      <PageHero eyebrow={item.tag} title={item.title} lead={item.summary} />
      <section className="container case" style={{ paddingBottom: "4rem" }}>
        <Reveal>
          <p className="muted" style={{ marginTop: 0 }}>
            Итог: {item.result}
          </p>
          <ul>
            {item.beats.map((beat) => (
              <li key={beat}>{beat}</li>
            ))}
          </ul>
          <div className="hero__actions">
            {item.link ? (
              <a className="btn btn--solid" href={item.link.href} target="_blank" rel="noreferrer">
                {item.link.label}
              </a>
            ) : null}
            <Link className="btn btn--ghost" to="/work">
              Все работы
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
