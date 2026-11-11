import { useFeaturedHackathon } from "@/hooks/useHackathons";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { ArrowRightIcon } from "@/components/hackathon/ui/icons";
import { HackathonSpotlight } from "./HackathonSpotlight";
import { IeeeEmblem } from "./emblem/IeeeEmblem";
import { Words } from "./Words";

const TITLE = "IEEE Student Branch";
const TITLE_PLACE = "at Nazarbayev University";
const TITLE_WORD_COUNT = TITLE.split(" ").length;

export function HeroSection() {
  const { data: hackathon } = useFeaturedHackathon();

  return (
    <section className="relative isolate grid items-center gap-x-12 gap-y-8 pb-12 sm:pb-16 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[1.15fr_1fr]">
      <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute -inset-x-6 -top-12 bottom-0 -z-10 lg:-inset-x-32" />

      <IeeeEmblem className="mx-auto w-56 sm:w-72 lg:order-2 lg:w-full lg:max-w-lg" />

      <div className="lg:order-1">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-hk-accent-fg">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-hk-accent-fg" />
          Astana, Kazakhstan
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
          <Words text={TITLE} wordClassName="rise-word" />
          <span className="text-zinc-400">
            <Words text={TITLE_PLACE} wordClassName="rise-word" startIndex={TITLE_WORD_COUNT} />
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-base text-zinc-300 sm:text-lg">
          Workshops, hackathons, field trips and networking events for engineering students at NU.
        </p>

        {!hackathon && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/events" size="lg">
              See our events
              <ArrowRightIcon />
            </ButtonLink>
            <ButtonLink to="/#about" variant="secondary" size="lg">
              About us
            </ButtonLink>
          </div>
        )}
      </div>

      {hackathon && (
        <div className="lg:order-3 lg:col-span-2">
          <HackathonSpotlight event={hackathon} />
        </div>
      )}
    </section>
  );
}
