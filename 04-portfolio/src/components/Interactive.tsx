import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type NeedId = "bots" | "landing" | "ops" | "together" | "prompt";

const needs: { id: NeedId; label: string }[] = [
  { id: "bots", label: "Боты и ИИ-демо" },
  { id: "landing", label: "Лендинг / витрина" },
  { id: "ops", label: "Цифра и продукт" },
  { id: "together", label: "Быстрая сборка под задачу" },
  { id: "prompt", label: "ИИ в рабочую вещь" },
];

const verdict: Record<
  NeedId,
  { match: "yes" | "maybe"; title: string; body: string; cta: { to: string; label: string } }
> = {
  bots: {
    match: "yes",
    title: "Сильное совпадение",
    body: "Telegram-боты, быстрые демо и живые продукты — уже в работе. Смотрите Агору, VOID Connect и четыре демо в портфолио.",
    cta: { to: "/demos", label: "Открыть демо" },
  },
  landing: {
    match: "yes",
    title: "Подходит",
    body: "Сайты собираю под продукт, а не под картинку. Это портфолио — один из примеров, плюс VOID Connect.",
    cta: { to: "/work", label: "Смотреть работы" },
  },
  ops: {
    match: "yes",
    title: "Да, если нужен выход, а не отчет",
    body: "Связываю цифру и продукт. В агентстве QLAN закрываю задачи до понятного результата.",
    cta: { to: "/employer", label: "Почему нанять" },
  },
  together: {
    match: "yes",
    title: "Так я даю максимум",
    body: "Беру контур целиком и ускоряю сборку. Если рядом сильный инженер — вместе выходим быстрее, чем по отдельности.",
    cta: { to: "/employer", label: "Как я работаю" },
  },
  prompt: {
    match: "yes",
    title: "Промпт довожу до рабочей вещи",
    body: "Не оставляю текст в чате. На выходе — бот, страница, таблица. Это можно показать в тот же день.",
    cta: { to: "/demos", label: "Посмотреть, что кликается" },
  },
};

export function FitQuiz() {
  const [picked, setPicked] = useState<NeedId | null>(null);
  const result = picked ? verdict[picked] : null;

  return (
    <div className="panel quiz">
      <h3>Что нужно на выходе?</h3>
      <p className="muted" style={{ marginTop: 0 }}>
        Нажмите вариант — сразу будет понятно, чем я усилю работу.
      </p>
      <div className="chip-row">
        {needs.map((item) => (
          <button
            key={item.id}
            type="button"
            className={picked === item.id ? "chip-btn is-on" : "chip-btn"}
            onClick={() => setPicked(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {result ? (
        <div className={`quiz-result quiz-result--${result.match}`}>
          <strong>{result.title}</strong>
          <p>{result.body}</p>
          <Link className="btn btn--solid" to={result.cta.to}>
            {result.cta.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function AccordionList({
  items,
  tone,
}: {
  items: { title: string; body: string }[];
  tone: "strength" | "how";
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <article key={item.title} className={tone}>
            <button
              type="button"
              className="accordion__head"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <h3>{item.title}</h3>
              <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? <p>{item.body}</p> : null}
          </article>
        );
      })}
    </div>
  );
}

export function StackFilter({ items }: { items: string[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <label className="field">
        Быстрый поиск
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Например: Cursor, Sol, Speechbot"
        />
      </label>
      <div className="stack" style={{ marginTop: "1rem" }}>
        {filtered.map((item) => (
          <span className="pill" key={item}>
            {item}
          </span>
        ))}
        {filtered.length === 0 ? <p className="muted">Ничего не нашлось</p> : null}
      </div>
    </div>
  );
}

export function ToolkitSection({
  groups,
}: {
  groups: { title: string; body: string; items: string[] }[];
}) {
  return (
    <div className="toolkit">
      {groups.map((group) => (
        <article className="panel toolkit__card" key={group.title}>
          <h3>{group.title}</h3>
          <p className="muted">{group.body}</p>
          <div className="stack" style={{ marginTop: "0.85rem" }}>
            {group.items.map((item) => (
              <span className="pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
