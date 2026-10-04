import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/Layouts/MainLayout/MainLayout";
import AdminHeader from "@/components/Layouts/AdminPageLayout/AdminHeader";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "./ui/icons";
import { focusRing } from "./ui/styles";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <MainLayout>
      <div className="hk-root mx-auto w-full max-w-3xl">{children}</div>
    </MainLayout>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />
      <div className="hk-root mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</div>
    </div>
  );
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={cn(
        "mb-6 inline-flex items-center gap-1.5 rounded-md text-sm text-zinc-400 transition-colors hover:text-white",
        focusRing
      )}
    >
      <ArrowLeftIcon />
      {children}
    </Link>
  );
}

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2 text-sm font-medium text-hk-accent-fg">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">{title}</h1>
        {description && <div className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
