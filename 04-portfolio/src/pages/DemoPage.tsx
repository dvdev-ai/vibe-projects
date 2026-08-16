import { Navigate, useParams } from "react-router-dom";
import { PageHero, Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { demos } from "@/data/profile";
import {
  DocsDemo,
  HabitDemo,
  VoiceChecklistDemo,
  WearDemo,
} from "@/demos/widgets";

const widgets = {
  "voice-checklists": VoiceChecklistDemo,
  "what-to-wear": WearDemo,
  "habit-tracker": HabitDemo,
  "document-chaos": DocsDemo,
} as const;

export function DemoPage() {
  const { slug } = useParams();
  const item = demos.find((entry) => entry.slug === slug);
  const Widget = slug && slug in widgets ? widgets[slug as keyof typeof widgets] : null;

  usePageMeta(
    item ? `${item.title} — демо` : "Демо",
    item?.teaser ?? "Рабочий прототип из портфолио.",
  );

  if (!item || !Widget) return <Navigate to="/demos" replace />;

  return (
    <>
      <PageHero eyebrow={`Демо ${item.num}`} title={item.title} lead={item.teaser} />
      <section className="container demo-layout">
        <Reveal>
          <div className="panel">
            <h3>Как пользоваться</h3>
            <p className="muted">
              Рабочий прототип в браузере. Можно проверить подход сразу.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="panel">
            <Widget />
          </div>
        </Reveal>
      </section>
    </>
  );
}
