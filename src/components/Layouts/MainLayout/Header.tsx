import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ieeeIcon from '../../../assets/icons/ieee_icon.svg';
import { cn } from '@/lib/utils';
import { CloseIcon, MenuIcon } from '@/components/hackathon/ui/icons';
import { focusRing, navLinkClass } from '@/components/hackathon/ui/styles';

const navLinks = [
  { label: 'About us', to: '/#about' },
  { label: 'Events', to: '/events' },
  { label: 'Hackathon', to: '/hackathon' },
  { label: 'Podcasts', to: '/podcasts' }
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Auto-close when crossing lg (1024px)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handle = () => setOpen(false);
    mq.addEventListener?.('change', handle);
    return () => mq.removeEventListener?.('change', handle);
  }, []);

  return (
    <header className="hk-root sticky top-0 z-[9999] w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
        <Link to="/" aria-label="NU IEEE home" className={cn('flex items-center gap-3 rounded-lg', focusRing)}>
          <img src={ieeeIcon} alt="" width={54} height={55} className="h-9 w-auto" />
          <span className="text-base font-semibold text-white">NU IEEE</span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center justify-end gap-1 lg:flex">
          {navLinks.map(({ label, to }) => (
            <NavLink key={to} to={to} className={to.includes('#') ? navLinkClass({ isActive: false }) : navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={cn(
            'ml-auto grid size-11 cursor-pointer place-items-center rounded-lg text-white transition-colors hover:bg-white/[0.06] lg:hidden',
            focusRing
          )}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(v => !v)}
        >
          {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="site-menu"
          aria-label="Main"
          className="absolute inset-x-0 top-full animate-page-in border-b border-white/10 bg-black/95 px-6 py-2 motion-reduce:animate-none lg:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={cn('flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-white hover:bg-white/[0.06]', focusRing)}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
