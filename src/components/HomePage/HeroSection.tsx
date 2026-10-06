import ieeeWordmark from "@/assets/icons/IEEE_mainscreen.svg";
import { useFeaturedHackathon } from "@/hooks/useHackathons";
import { ButtonLink } from "@/components/hackathon/ui/Button";
import { HackathonSpotlight } from "./HackathonSpotlight";

export function HeroSection() {
  const { data: hackathon } = useFeaturedHackathon();

  return (
    <section className="relative isolate flex flex-col items-center pt-6 pb-12 text-center sm:pt-12 sm:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <div className="h-[360px] w-full max-w-4xl rounded-full bg-hk-accent/30 blur-[110px] sm:h-[460px]" />
      </div>

      <img src={ieeeWordmark} alt="IEEE" width={656} height={328} className="h-auto w-[min(440px,72vw)]" />
      <h1 className="text-glow mt-2 text-2xl font-semibold uppercase text-white sm:text-4xl">
        Student Branch at
        <br />
        Nazarbayev University
      </h1>
      <p className="mt-5 max-w-xl text-base text-zinc-300 sm:text-lg">
        Workshops, hackathons, field trips and networking events for engineering students at NU.
      </p>

      <div className="mt-10 w-full max-w-4xl">
        {hackathon ? (
          <HackathonSpotlight event={hackathon} />
        ) : (
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/events" size="lg">
              See our events
            </ButtonLink>
            <ButtonLink to="/#about" variant="secondary" size="lg">
              About us
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
