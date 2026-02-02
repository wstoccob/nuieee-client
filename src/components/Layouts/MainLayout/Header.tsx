import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ieeeIcon from '../../../assets/icons/ieee_icon.svg';

const navLinks = [
  { label: 'HACKATHON 2.0', to: '/hackathon' },
  { label: 'ABOUT US', to: '/about' },
  { label: 'EVENTS', to: '/events' },
  { label: 'BOARD MEMBERS', to: '/board' },
  { label: 'CONTACT US', to: '/contact' },
];

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
    <header className={`sticky top-0 z-[9999] w-full overflow-x-clip ${GLASS}`}>

      <div className="mx-auto flex h-16 lg:h-[100px] w-full max-w-[1440px] px-4 xl:px-[126px]">

        <Link to="/" className="flex items-center h-16 lg:h-[100px] px-4 xl:px-[0px]">
          <img src={ieeeIcon} alt="IEEE Icon" className="h-16 w-auto lg:h-20" />
        </Link>

        {/* Desktop inline nav */}
        <nav className="hidden lg:flex flex-1 min-w-0 justify-center items-center gap-2 lg:gap-2.5">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="px-3 lg:px-3 xl:px-5 py-2 lg:py-2 xl:py-3 rounded-md hover:bg-black/10 shrink-0"
            >
              <span className="text-white text-sm md:text-base lg:text-lg xl:text-[22px] font-bold whitespace-nowrap">
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Desktop toggle (globe) */}

        {/* Mobile toggle (burger) */}
        <button
          className="ml-auto lg:hidden text-white px-3 py-2"
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
          <nav className="mx-auto max-w-[1440px] px-4 xl:px-[126px] py-2">
            {/* no borders/dividers -> continuous blur (no “hard lines”) */}
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="block px-3 py-3 text-white rounded-md hover:bg-black/80"
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
