import { cva } from "class-variance-authority";

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-hk-accent-fg/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

export const buttonStyles = cva(
  `inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`,
  {
    variants: {
      variant: {
        primary: "bg-hk-accent text-white shadow-sm shadow-black/40 hover:bg-hk-accent-hover",
        secondary: "border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.1]",
        ghost: "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
        danger: "bg-red-600 text-white hover:bg-red-500",
        dangerGhost: "text-red-300 hover:bg-red-500/10 hover:text-red-200",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export const controlStyles =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-base text-white placeholder:text-zinc-500 transition-colors hover:border-white/20 focus:border-hk-accent-fg/70 focus:ring-2 focus:ring-hk-accent/40 outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400/60 aria-invalid:focus:ring-red-400/25 sm:text-[15px]";
