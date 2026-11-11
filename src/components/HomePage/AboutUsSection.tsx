import type { ReactNode } from "react";
import { CodeIcon, MapPinIcon, UsersIcon, WrenchIcon } from "@/components/hackathon/ui/icons";
import { Words } from "./Words";

const STATEMENT =
  "The NU IEEE Student Branch is a community of engineering students at Nazarbayev University, dedicated to advancing knowledge in electrical, computer and engineering fields.";

const ACTIVITIES: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <WrenchIcon />, title: "Workshops", text: "Hands-on learning beyond the lectures." },
  { icon: <CodeIcon />, title: "Hackathons", text: "Apply what you know to real-world challenges." },
  { icon: <MapPinIcon />, title: "Field trips", text: "See engineering at work outside campus." },
  { icon: <UsersIcon />, title: "Networking", text: "Meet industry leaders and the global IEEE network." },
];

export const AboutUsSection = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 border-t border-white/10 py-12 sm:py-16">
      <h2 id="about-title" className="text-xs font-semibold uppercase tracking-widest text-hk-accent-fg">
        About us
      </h2>
      <p className="lit-text mt-4 max-w-4xl text-2xl leading-snug font-semibold text-balance text-white sm:text-3xl">
        <Words text={STATEMENT} wordClassName="lit-word" />
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="reveal max-w-prose space-y-4 text-base leading-relaxed text-zinc-300">
          <p>
            As part of the global IEEE network, we connect students with industry leaders and create
            opportunities for hands-on learning.
          </p>
          <p>
            Through workshops, hackathons, field trips and networking events, we help students apply what
            they learn to real-world challenges, and prepare the next generation of engineers for their
            careers.
          </p>
        </div>

        <ol className="border-b border-white/10">
          {ACTIVITIES.map(({ icon, title, text }, index) => (
            <li key={title} className="reveal flex items-start gap-4 border-t border-white/10 py-5">
              <span className="w-6 pt-1 text-xs tabular-nums text-zinc-500">{String(index + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{text}</p>
              </div>
              <span className="pt-1 text-hk-accent-fg [&>svg]:size-5">{icon}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
