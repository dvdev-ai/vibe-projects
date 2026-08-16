import { Link } from "react-router-dom";
import { AccordionList, FitQuiz, StackFilter, ToolkitSection } from "@/components/Interactive";
import { PageHero, Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  experience,
  firstMonth,
  fitBest,
  fitYes,
  hireReasons,
  howIWork,
  stack,
  strengths,
  toolkit,
} from "@/data/profile";

export function EmployerPage() {
  usePageMeta(
    "Почему нанять — Данила Вертий",
    "ИИ-продукты в агентстве QLAN. Живые кейсы, первые 30 дней, сильные стороны.",
  );

  return (
    <>
      <PageHero
        eyebrow="Для HR и руководителя"
        title="Человек, который приносит рабочий результат"
        lead="В агентстве QLAN собираю ИИ-продукты до состояния «можно пользоваться»: бот, сайт, кабинет. Есть живые кейсы в сети — их можно открыть до созвона. За первые недели даю первую рабочую версию, а не презентацию о планах."
      />

      <section className="section container" style={{ paddingTop: "1.2rem" }}>
        <Reveal>
          <p className="eyebrow">За 10 секунд</p>
          <h2 className="display display--page">Чем я усилю работу</h2>
        </Reveal>
        <div className="grid-2" style={{ marginTop: "1.4rem" }}>
          {hireReasons.map((item) => (
            <Reveal key={item.title}>
              <article className="card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Первые 30 дней</p>
          <h2 className="display display--page">Что будет на выходе</h2>
          <p className="lead">Руководителю нужен не процесс, а первая рабочая версия. Вот контур.</p>
        </Reveal>
        <div className="cards" style={{ marginTop: "1.4rem" }}>
          {firstMonth.map((item) => (
            <Reveal key={item.title}>
              <article className="card">
                <span className="card__tag">{item.title}</span>
                <p>{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Совпадение</p>
        </Reveal>
        <div style={{ marginTop: "1rem" }}>
          <Reveal>
            <FitQuiz />
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Где я дам максимум</p>
        </Reveal>
        <div className="split" style={{ marginTop: "1rem" }}>
          <Reveal>
            <div className="panel">
              <h3>Роли, где я закрываю задачу</h3>
              <ul>
                {fitYes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="panel">
              <h3>Когда я особенно полезен</h3>
              <ul>
                {fitBest.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Сильные стороны</p>
          <h2 className="display display--page">На что можно опереться</h2>
        </Reveal>
        <div style={{ marginTop: "1.4rem" }}>
          <Reveal>
            <AccordionList items={strengths} tone="strength" />
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Как я работаю</p>
          <h2 className="display display--page">Честно и в плюс результату</h2>
          <p className="lead">Не прячу ограничения. Показываю, как они работают на выход.</p>
        </Reveal>
        <div style={{ marginTop: "1.4rem" }}>
          <Reveal>
            <AccordionList items={howIWork} tone="how" />
          </Reveal>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Опыт</p>
          <h2 className="display display--page">Работа</h2>
          <p className="lead">Сейчас — агентство QLAN. Открытые продукты можно проверить сразу.</p>
        </Reveal>
        {experience.map((job) => (
          <Reveal key={job.role}>
            <article className="job">
              <h3>{job.role}</h3>
              <p className="muted">{job.period}</p>
              <ul>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="section container">
        <Reveal>
          <p className="eyebrow">Инструменты</p>
          <h2 className="display display--page">Чем собираю</h2>
          <p className="lead">
            Не один чат. Рабочий контур: среда, модели под задачу, расшифровка голоса и сборка продукта.
          </p>
        </Reveal>
        <div style={{ marginTop: "1.4rem" }}>
          <Reveal>
            <ToolkitSection groups={toolkit} />
          </Reveal>
        </div>
        <div style={{ marginTop: "1.4rem" }}>
          <Reveal>
            <StackFilter items={stack} />
          </Reveal>
        </div>
        <div className="hero__actions">
          <Link className="btn btn--solid" to="/work">
            Смотреть работы
          </Link>
          <Link className="btn btn--ghost" to="/contact">
            Связаться
          </Link>
        </div>
      </section>
    </>
  );
}
