import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { copyText, downloadText } from "@/lib/utils";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      {label}
      {children}
    </label>
  );
}

function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return <p className="toast" role="status">{text}</p>;
}

function useToast() {
  const [text, setText] = useState<string | null>(null);
  function show(next: string) {
    setText(next);
    window.setTimeout(() => setText(null), 1800);
  }
  return { text, show };
}

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRec) | null {
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function VoiceChecklistDemo() {
  const [raw, setRaw] = useState(
    "Завтра созвон с партнером в 12, вечером отметить привычки и набросать структуру портфолио.",
  );
  const [out, setOut] = useState("");
  const [listening, setListening] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([]);
  const recRef = useRef<SpeechRec | null>(null);
  const { text: toast, show } = useToast();

  function build(from = raw) {
    const parts = from
      .split(/[,.;\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    const title = parts[0] ? parts[0].slice(0, 48) : "Чеклист";
    const items = parts.map((item, i) => `${i + 1}. ${item}`);
    const priorities = parts.slice(0, 3).map((item, i) => `${i + 1}) ${item}`);
    setOut(`# ${title}\n\n${items.join("\n")}\n\nПриоритеты:\n${priorities.join("\n") || "—"}`);
    setChecked(parts.map(() => false));
  }

  function toggleListen() {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      show("Голос в этом браузере не поддержан. Вставьте текст вручную.");
      return;
    }
    if (listening && recRef.current) {
      recRef.current.stop();
      setListening(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "ru-RU";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (event) => {
      const chunk = Array.from(event.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (chunk) {
        setRaw((prev) => (prev.trim() ? `${prev.trim()}. ${chunk}` : chunk));
        show("Добавил распознанный текст");
      }
    };
    rec.onerror = () => {
      setListening(false);
      show("Не удалось распознать. Попробуйте еще раз.");
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  const liveItems = useMemo(
    () =>
      raw
        .split(/[,.;\n]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    [raw],
  );

  return (
    <>
      <Field label="Что сказал / надиктовал">
        <textarea value={raw} onChange={(e) => setRaw(e.target.value)} />
      </Field>
      <div className="actions">
        <button
          className={listening ? "btn btn--solid is-pulse" : "btn btn--ghost"}
          type="button"
          onClick={toggleListen}
        >
          {listening ? "Слушаю…" : "Говорить"}
        </button>
        <button className="btn btn--solid" type="button" onClick={() => build()}>
          Собрать чеклист
        </button>
        {out ? (
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => {
              downloadText("checklist.md", out);
              show("Скачал checklist.md");
            }}
          >
            Скачать .md
          </button>
        ) : null}
      </div>
      <Toast text={toast} />
      {liveItems.length > 0 && checked.length === liveItems.length ? (
        <ul className="check-list">
          {liveItems.map((item, i) => (
            <li key={`${item}-${i}`}>
              <label>
                <input
                  type="checkbox"
                  checked={checked[i] ?? false}
                  onChange={() =>
                    setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))
                  }
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}
      {out ? <pre className="out">{out}</pre> : null}
    </>
  );
}

const wardrobe = [
  "джинсы",
  "худи",
  "рубашка",
  "куртка",
  "кроссовки",
  "ботинки",
  "свитер",
  "плащ",
];

export function WearDemo() {
  const [city, setCity] = useState("Самара");
  const [weather, setWeather] = useState<"warm" | "cold" | "rain">("warm");
  const [picked, setPicked] = useState<string[]>(["джинсы", "худи", "кроссовки"]);

  function toggleItem(item: string) {
    setPicked((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  }

  const looks = useMemo(() => {
    const has = (word: string) => picked.some((p) => p.includes(word));
    const base =
      weather === "rain"
        ? "Слой от дождя сверху. Обувь, которую не жалко."
        : weather === "cold"
          ? "Теплый верх и закрытая обувь."
          : "Легкий верх, без лишних слоев.";

    return [
      {
        title: "Работа",
        line: [
          has("рубашка") ? "рубашка" : has("худи") ? "худи" : "чистый верх",
          has("джинсы") ? "джинсы" : "брюки",
          has("ботинки") ? "ботинки" : has("кроссовки") ? "кроссовки" : "обувь",
          weather === "rain" && has("плащ") ? "плащ" : weather === "cold" && has("куртка") ? "куртка" : null,
        ]
          .filter(Boolean)
          .join(" · "),
      },
      {
        title: "Прогулка",
        line: [
          has("худи") ? "худи" : has("свитер") ? "свитер" : "футболка / верх",
          has("джинсы") ? "джинсы" : "удобный низ",
          weather === "rain" ? "зонт" : null,
          base,
        ]
          .filter(Boolean)
          .join(" · "),
      },
      {
        title: "Вечер",
        line: [
          has("рубашка") ? "рубашка" : has("свитер") ? "свитер" : "аккуратный верх",
          has("джинсы") ? "темные джинсы" : "чистый низ",
          has("ботинки") ? "ботинки" : "обувь без спорта",
        ]
          .filter(Boolean)
          .join(" · "),
      },
    ];
  }, [picked, weather]);

  return (
    <>
      <Field label="Город">
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option>Самара</option>
          <option>Москва</option>
          <option>Санкт-Петербург</option>
        </select>
      </Field>
      <Field label="Погода">
        <select
          value={weather}
          onChange={(e) => setWeather(e.target.value as "warm" | "cold" | "rain")}
        >
          <option value="warm">Тепло</option>
          <option value="cold">Холодно</option>
          <option value="rain">Дождь</option>
        </select>
      </Field>
      <p className="field" style={{ marginTop: "0.8rem" }}>
        Что есть в шкафу
      </p>
      <div className="chip-row">
        {wardrobe.map((item) => (
          <button
            key={item}
            type="button"
            className={picked.includes(item) ? "chip-btn is-on" : "chip-btn"}
            onClick={() => toggleItem(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        {looks.map((look) => (
          <article className="outfit" key={look.title}>
            <strong>{look.title}</strong>
            <p style={{ margin: "0.25rem 0 0" }}>{look.line}</p>
          </article>
        ))}
        <p className="muted" style={{ marginTop: "1rem" }}>
          {city}: образы собираются из выбранных вещей и погоды.
        </p>
      </div>
    </>
  );
}

const defaultHabits = ["Вода", "Прогулка", "Без телефона перед сном"];
const HABIT_KEY = "dv-habits-v1";

function streakFromEnd(row: boolean[]) {
  let n = 0;
  for (let i = row.length - 1; i >= 0; i -= 1) {
    if (!row[i]) break;
    n += 1;
  }
  return n;
}

export function HabitDemo() {
  const [days, setDays] = useState<boolean[][]>(() => {
    try {
      const raw = localStorage.getItem(HABIT_KEY);
      if (raw) return JSON.parse(raw) as boolean[][];
    } catch {
      /* ignore */
    }
    return defaultHabits.map(() => Array.from({ length: 7 }, () => false));
  });

  useEffect(() => {
    localStorage.setItem(HABIT_KEY, JSON.stringify(days));
  }, [days]);

  function toggle(h: number, d: number) {
    setDays((prev) =>
      prev.map((row, i) => (i === h ? row.map((cell, j) => (j === d ? !cell : cell)) : row)),
    );
  }

  function reset() {
    setDays(defaultHabits.map(() => Array.from({ length: 7 }, () => false)));
  }

  const total = days.reduce((acc, row) => acc + row.filter(Boolean).length, 0);

  return (
    <>
      <p className="muted" style={{ marginTop: 0 }}>
        Отмечено за неделю: <strong>{total}</strong> · данные остаются в браузере
      </p>
      {defaultHabits.map((name, h) => {
        const streak = streakFromEnd(days[h]);
        const done = days[h].filter(Boolean).length;
        return (
          <div className="habit" key={name}>
            <div className="habit__head">
              <strong>
                {name} · {done}/7
              </strong>
              <span className="chip">{streak > 0 ? `серия ${streak}` : "серия 0"}</span>
            </div>
            <div className="week">
              {days[h].map((on, d) => (
                <button
                  key={d}
                  type="button"
                  className={on ? "day is-on" : "day"}
                  onClick={() => toggle(h, d)}
                  aria-label={`${name}, день ${d + 1}`}
                >
                  {d + 1}
                </button>
              ))}
            </div>
            <div className="bar" aria-hidden="true">
              <span style={{ width: `${(done / 7) * 100}%` }} />
            </div>
          </div>
        );
      })}
      <div className="actions">
        <button className="btn btn--ghost" type="button" onClick={reset}>
          Сбросить неделю
        </button>
      </div>
      <p className="muted">Пропуск не обнуляет жизнь. Серия считается с конца недели.</p>
    </>
  );
}

export function DocsDemo() {
  const [raw, setRaw] = useState(
    "Договор от 12.03.2026. ООО «Север» и ИП Иванов. Сумма 180 000 руб. Контакт: +7 927 000-00-00, hello@example.com",
  );
  const { text: toast, show } = useToast();

  const parsed = useMemo(() => {
    const dates = raw.match(/\d{1,2}[./]\d{1,2}[./]\d{2,4}/g) ?? [];
    const emails = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
    const phones = raw.match(/\+?\d[\d\s()-]{8,}\d/g) ?? [];
    const money = raw.match(/\d[\d\s]{2,}(?:\s?(?:руб|₽|млн))/gi) ?? [];
    return [
      ["Даты", dates.join(", ") || "—"],
      ["Почта", emails.join(", ") || "—"],
      ["Телефоны", phones.join(", ") || "—"],
      ["Суммы", money.join(", ") || "—"],
    ] as [string, string][];
  }, [raw]);

  const found = parsed.filter(([, v]) => v !== "—").length;

  function exportCsv() {
    const csv = ["Поле,Значение", ...parsed.map(([k, v]) => `"${k}","${v.replaceAll('"', '""')}"`)].join(
      "\n",
    );
    downloadText("entities.csv", csv);
    show("Скачал entities.csv");
  }

  return (
    <>
      <Field label="Вставьте текст документа">
        <textarea value={raw} onChange={(e) => setRaw(e.target.value)} />
      </Field>
      <p className="muted">
        Найдено полей: <strong>{found}</strong> из 4
      </p>
      <div className="actions" style={{ marginTop: 0 }}>
        <button className="btn btn--solid" type="button" onClick={exportCsv}>
          Скачать CSV
        </button>
        <button
          className="btn btn--ghost"
          type="button"
          onClick={async () => {
            await copyText(parsed.map(([k, v]) => `${k}: ${v}`).join("\n"));
            show("Скопировал таблицу");
          }}
        >
          Скопировать
        </button>
      </div>
      <Toast text={toast} />
      <div className="table-wrap" style={{ marginTop: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>Поле</th>
              <th>Значение</th>
            </tr>
          </thead>
          <tbody>
            {parsed.map(([k, v]) => (
              <tr key={k} className={v === "—" ? undefined : "row-hit"}>
                <td>{k}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
