import type { ReactNode } from "react";
import { CodeIcon, MapPinIcon, UsersIcon, WrenchIcon } from "@/components/hackathon/ui/icons";

const ACTIVITIES: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <WrenchIcon />, title: "Workshops", text: "Hands-on learning beyond the lectures." },
  { icon: <CodeIcon />, title: "Hackathons", text: "Apply what you know to real-world challenges." },
  { icon: <MapPinIcon />, title: "Field trips", text: "See engineering at work outside campus." },
  { icon: <UsersIcon />, title: "Networking", text: "Meet industry leaders and the global IEEE network." },
];

export const AboutUsSection = () => {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-24 py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 id="about-title" className="text-2xl font-semibold text-white sm:text-3xl">
            About us
          </h2>
          <div className="mt-5 max-w-prose space-y-4 text-base leading-relaxed text-zinc-300">
            <p>
              The NU IEEE Student Branch is a community of engineering students at Nazarbayev University,
              dedicated to advancing knowledge in electrical, computer and engineering fields. As part of the
              global IEEE network, we connect students with industry leaders and create opportunities for
              hands-on learning.
            </p>
            <p>
              Through workshops, hackathons, field trips and networking events, we help students apply what
              they learn to real-world challenges, and prepare the next generation of engineers for their
              careers.
            </p>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {ACTIVITIES.map(({ icon, title, text }) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:block sm:p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-hk-accent/15 text-hk-accent-fg [&>svg]:size-5">
                {icon}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white sm:mt-4">{title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
