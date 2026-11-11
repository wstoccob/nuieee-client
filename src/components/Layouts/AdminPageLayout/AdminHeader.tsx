import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "@/auth/useAuth";
import ieeeIcon from '../../../assets/icons/ieee_icon.svg';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/hackathon/ui/Badge';
import { Button, ButtonLink } from '@/components/hackathon/ui/Button';
import { focusRing, navLinkClass } from '@/components/hackathon/ui/styles';

const adminNavLinks = [
  { label: 'Events', to: '/admin/events' },
  { label: 'Hackathons', to: '/admin/hackathons' },
];

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login', { replace: true });
  };

  return (
    <header className="hk-root sticky top-0 z-40 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-1 px-4 sm:px-6">
        <Link to="/admin" aria-label="Admin home" className={cn('mr-auto flex items-center gap-3 rounded-lg', focusRing)}>
          <img src={ieeeIcon} alt="" width={54} height={55} className="h-9 w-auto" />
          <span className="hidden text-base font-semibold text-white sm:inline">NU IEEE</span>
          <Badge tone="blue" className="hidden sm:inline-flex">Admin</Badge>
        </Link>

        <nav aria-label="Admin" className="flex items-center gap-1">
          {adminNavLinks.map(({ label, to }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {user ? (
          <Button variant="ghost" size="md" onClick={handleLogout}>
            Log out
          </Button>
        ) : (
          <ButtonLink variant="ghost" size="md" to="/auth/login">
            Log in
          </ButtonLink>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
