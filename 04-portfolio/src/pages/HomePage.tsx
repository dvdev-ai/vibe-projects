import { Link } from "react-router-dom";
import { FitQuiz } from "@/components/Interactive";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demos, metrics, profile, work } from "@/data/profile";

export function HomePage() {
  usePageMeta(
    "Данила Вертий — портфолио",
    "ИИ-продукты в агентстве QLAN. Живые кейсы и четыре демо, которые можно проверить сразу.",
  );

  return (
    <>
      <section className="container hero">
        <div>
          <p className="eyebrow">{profile.location}</p>
          <h1 className="display">{profile.name}</h1>
          <p className="lead">{profile.headline}</p>
          <div className="hero__actions">
            <Link className="btn btn--solid" to="/employer">
              Почему нанять
            </Link>
            <Link className="btn btn--ghost" to="/demos">
              Живые демо
            </Link>
          </div>
        </div>
        <aside className="hero-panel">
          <strong>{profile.role}</strong>
          <p>{profile.pitch}</p>
        </aside>
      </section>

      <section className="container" style={{ paddingBottom: "3.5rem" }}>
        <div className="metrics">
          {metrics.map((item) => (
            <div className="metric" key={item.label}>
              <b>{item.value}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 0 }}>
        <Reveal>
          <p className="eyebrow">Интерактив</p>
          <h2 className="display display--page">Проверьте за 10 секунд</h2>
          <p className="lead">Нажмите, что нужно на выходе — сразу будет понятно, чем я усилю работу.</p>
        </Reveal>
        <div style={{ marginTop: "1.4rem" }}>
          <Reveal>
            <FitQuiz />
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Уже сделано</p>
          <h2 className="display display--page">Открытые работы</h2>
          <p className="lead">Можно открыть и проверить. С февраля 2026 работаю в агентстве QLAN.</p>
        </Reveal>
        <div className="cards" style={{ marginTop: "1.6rem" }}>
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

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Демо 1–4</p>
          <h2 className="display display--page">Можно потыкать прямо здесь</h2>
          <p className="lead">Так проверяют, как я собираю продукт: не слайд, а рабочая вещь.</p>
        </Reveal>
        <div className="cards" style={{ marginTop: "1.6rem" }}>
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
