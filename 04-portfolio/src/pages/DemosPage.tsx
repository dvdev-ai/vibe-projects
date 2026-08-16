import { Link } from "react-router-dom";
import { PageHero, Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demos } from "@/data/profile";

export function DemosPage() {
  usePageMeta("Демо — Данила Вертий", "Четыре демо: чеклисты, образы, привычки, документы.");

  return (
    <>
      <PageHero
        eyebrow="Демо 1–4"
        title="Живые демо"
        lead="Кликабельные прототипы. Так можно проверить, как я собираю продукт, не дожидаясь созвона."
      />
      <section className="container" style={{ paddingBottom: "4rem" }}>
        <div className="cards">
          {demos.map((item) => (
            <Reveal key={item.slug}>
              <Link className="card" to={`/demos/${item.slug}`}>
                <span className="card__tag">{item.num}</span>
                <h3>{item.title}</h3>
                <p>{item.teaser}</p>
                <span className="card__meta">Открыть</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
