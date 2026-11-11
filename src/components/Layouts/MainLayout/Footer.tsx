import ieeeIcon from '../../../assets/icons/ieee_icon.svg';
import { cn } from '@/lib/utils';
import { focusRing } from '@/components/hackathon/ui/styles';

const LINK_GROUPS = [
  {
    title: 'Related',
    links: [
      { label: 'IEEE Signal Processing Society', href: 'https://signalprocessingsociety.org/' },
      { label: 'ASP-LAB', href: 'https://sites.google.com/nu.edu.kz/asp-lab' },
      { label: 'Nazarbayev University', href: 'https://nu.edu.kz/' },
    ],
  },
  {
    title: 'Global',
    links: [
      { label: 'IEEE Official', href: 'https://www.ieee.org/' },
      { label: 'IEEE Xplore', href: 'https://ieeexplore.ieee.org/Xplore/home.jsp' },
      { label: 'IEEE Membership', href: 'https://www.ieee.org/membership' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ieeenu/' },
      { label: 'YouTube', href: 'https://youtube.com/@nu_ieee' },
      { label: 'Instagram', href: 'https://www.instagram.com/nuieee_sb' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@nu_ieee' },
      { label: 'Telegram', href: 'https://t.me/nu_ieee' },
    ],
  },
];

const linkClass = cn(
  'inline-flex min-h-11 items-center rounded-lg text-sm text-zinc-300 transition-colors hover:text-white',
  focusRing
);

export default function Footer() {
  return (
    <footer className="hk-root border-t border-white/10 px-6 pt-12 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img src={ieeeIcon} alt="" width={54} height={55} loading="lazy" className="h-10 w-auto" />
              <p className="text-base font-semibold text-white">NU IEEE Student Branch</p>
            </div>
            <p className="mt-4 max-w-xs text-sm text-zinc-400">
              Nazarbayev University, 53 Kabanbay Batyr Avenue, Astana, Kazakhstan.
            </p>
            <a href="mailto:ieee@nu.edu.kz" className={cn(linkClass, 'mt-2 text-hk-accent-fg')}>
              ieee@nu.edu.kz
            </a>
          </div>

          {LINK_GROUPS.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{title}</h2>
              <ul className="mt-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} IEEE Student Branch at Nazarbayev University
        </p>
      </div>
    </footer>
  );
}
