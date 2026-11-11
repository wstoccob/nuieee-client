import type { ComponentProps } from "react";
import { Link } from "react-router-dom";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonStyles } from "./styles";
import { Spinner } from "./Spinner";

type ButtonVariants = VariantProps<typeof buttonStyles>;

type ButtonProps = ComponentProps<"button"> & ButtonVariants & { loading?: boolean };

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonVariants) {
  return <Link className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

/** For links that leave the site; opens in a new tab. */
export function ButtonAnchor({ variant, size, className, ...props }: ComponentProps<"a"> & ButtonVariants) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}
