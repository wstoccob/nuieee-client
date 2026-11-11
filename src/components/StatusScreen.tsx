import ieeeIcon from "@/assets/icons/ieee_icon.svg";
import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/hackathon/ui/styles";

interface StatusScreenProps {
  eyebrow: string;
  title: string;
  message: string;
  alert?: boolean;
}

// Uses a plain link so it also works above the router, where the error boundary sits.
export function StatusScreen({ eyebrow, title, message, alert = false }: StatusScreenProps) {
  return (
    <main className="hk-root grid min-h-screen place-items-center bg-black px-6 py-16">
      <section
        role={alert ? "alert" : undefined}
        aria-labelledby="status-title"
        className="flex max-w-md animate-page-in flex-col items-center text-center motion-reduce:animate-none"
      >
        <img src={ieeeIcon} alt="" width={54} height={55} className="h-14 w-auto" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-hk-accent-fg">{eyebrow}</p>
        <h1 id="status-title" className="mt-3 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base text-zinc-400">{message}</p>
        <a href="/" className={cn(buttonStyles({ size: "lg" }), "mt-8")}>
          Return to homepage
        </a>
      </section>
    </main>
  );
}
