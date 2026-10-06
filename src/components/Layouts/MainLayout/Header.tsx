import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ieeeIcon from '../../../assets/icons/ieee_icon.svg';
import { cn } from '@/lib/utils';
import { focusRing } from '@/components/hackathon/ui/styles';

const navLinks = [
  { label: 'About us', to: '/#about' },
  { label: 'Events', to: '/events' },
  { label: 'Hackathon', to: '/hackathon' },
  { label: 'Podcasts', to: '/podcasts' }
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-base font-medium transition-colors hover:text-white',
    isActive ? 'text-white' : 'text-zinc-300',
    focusRing
  );

// one source of truth for the “frosted” look
const GLASS = "backdrop-blur-md bg-black/50";

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
    <header className={`sticky top-0 z-[9999] w-full ${GLASS}`}>

      <div className="mx-auto flex h-16 lg:h-20 w-full max-w-6xl items-center px-6">

        <Link to="/" aria-label="NU IEEE home" className={cn('flex items-center rounded-lg', focusRing)}>
          <img src={ieeeIcon} alt="" className="h-11 w-auto lg:h-12" />
        </Link>

        {/* Desktop inline nav */}
        <nav aria-label="Main" className="hidden lg:flex flex-1 justify-end items-center gap-1">
          {navLinks.map(({ label, to }) => (
            <NavLink key={to} to={to} className={to.includes('#') ? linkClass({ isActive: false }) : linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>
        {/* Mobile toggle (burger) */}
        <button
          className="ml-auto lg:hidden text-white px-3 py-2"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(v => !v)}
        >
          ☰
        </button>
      </div>

      {/* Panel — uses the SAME GLASS as header (identical blurriness) */}
      <div
        id="site-menu"
        className={`absolute inset-x-0 top-full z-[9998] ${open ? 'block' : 'hidden'}`}
      >
        <div className={`${GLASS} overflow-x-clip`}>
          <nav aria-label="Main" className="mx-auto max-w-6xl px-6 py-2">
            {/* no borders/dividers -> continuous blur (no “hard lines”) */}
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={cn('block rounded-lg px-3 py-3 text-base font-medium text-white hover:bg-white/[0.06]', focusRing)}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
