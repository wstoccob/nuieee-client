import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { cn } from "@/lib/utils";
import { AdminShell, PageHeader } from "@/components/hackathon/Shells";
import { ArrowRightIcon, CalendarIcon, CodeIcon } from "@/components/hackathon/ui/icons";
import { focusRing } from "@/components/hackathon/ui/styles";

const SECTIONS: { to: string; title: string; text: string; icon: ReactNode }[] = [
  {
    to: "/admin/events",
    title: "Events",
    text: "Publish events with photos and registration links, or remove old ones.",
    icon: <CalendarIcon />,
  },
  {
    to: "/admin/hackathons",
    title: "Hackathons",
    text: "Create hackathons, open registration and follow team sign-ups.",
    icon: <CodeIcon />,
  },
];

const AdminMainPage = () => {
  const { user } = useAuth();

  return (
    <AdminShell>
      <PageHeader
        title="Admin"
        description={user ? `Signed in as ${user.username}. Changes here go live on the public site.` : undefined}
      />
      <ul className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map(({ to, title, text, icon }) => (
          <li key={to}>
            <Link
              to={to}
              className={cn(
                "group/section flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-hk-accent-fg/40 sm:p-6",
                focusRing
              )}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-hk-accent/15 text-hk-accent-fg [&>svg]:size-5">
                {icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-semibold text-white">{title}</span>
                <span className="mt-1 block text-sm text-zinc-400">{text}</span>
              </span>
              <ArrowRightIcon className="mt-1.5 text-zinc-500 transition-transform duration-200 group-hover/section:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
};

export default AdminMainPage;
