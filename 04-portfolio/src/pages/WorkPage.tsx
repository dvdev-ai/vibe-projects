import { Link } from "react-router-dom";
import { PageHero, Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { work } from "@/data/profile";

export function WorkPage() {
  usePageMeta("Работы — Данила Вертий", "Открытые кейсы: VPN, бот, документы, вебинар.");

  return (
    <>
      <PageHero
        eyebrow="Кейсы"
        title="Работы"
        lead="То, что можно открыть и проверить: VPN-сервис, Telegram-бот, документы, программа вебинара."
      />
      <section className="container" style={{ paddingBottom: "4rem" }}>
        <div className="cards">
          {work.map((item) => (
            <Reveal key={item.slug}>
              <Link className="card" to={`/work/${item.slug}`}>
                <span className="card__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span className="card__meta">{item.result}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
