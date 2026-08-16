import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero, Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { contact, hrPitch, profile } from "@/data/profile";
import { copyText } from "@/lib/utils";

export function ContactPage() {
  usePageMeta("Контакт — Данила Вертий", "Как связаться. Короткое письмо для HR можно скопировать.");
  const [copied, setCopied] = useState(false);

  const hasEmail = Boolean(contact.email);
  const hasTelegram = Boolean(contact.telegram);

  async function copyPitch() {
    await copyText(hrPitch);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <PageHero
        eyebrow="Следующий шаг"
        title="Давайте созвонимся по задаче"
        lead="Напишите роль и что нужно закрыть за первые 30 дней. Отвечу по делу — без длинного рассказа «о себе»."
      />
      <section className="container" style={{ paddingBottom: "4rem" }}>
        <Reveal>
          <div className="panel">
            <h3>{profile.name}</h3>
            <p className="muted">{profile.location} · {profile.role}</p>
            <div className="hero__actions">
              {hasEmail ? (
                <a className="btn btn--solid" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : null}
              {hasTelegram ? (
                <a
                  className="btn btn--ghost"
                  href={`https://t.me/${contact.telegram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram {contact.telegram}
                </a>
              ) : (
                <button className="btn btn--solid" type="button" onClick={copyPitch}>
                  {copied ? "Скопировал письмо" : "Скопировать письмо для HR"}
                </button>
              )}
            </div>
            {!hasEmail && !hasTelegram ? (
              <p className="muted" style={{ marginTop: "1rem" }}>
                {contact.note}
              </p>
            ) : null}
            <pre className="out" style={{ marginTop: "1.2rem" }}>
              {hrPitch}
            </pre>
            <p style={{ marginTop: "1.2rem" }}>
              <Link to="/employer">Сначала — почему имеет смысл нанять</Link>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
