import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Briefcase, ClipboardList, Menu, ShieldCheck, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { seedProfile } from '@/lib/mockData';
import { cn, initials } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
  { to: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/dashboard/applications', label: 'Applications', icon: ClipboardList },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/security', label: 'Security', icon: ShieldCheck },
];

export function DashboardLayout() {
  const mode = useAppStore((s) => s.mode);
  const toggleMode = useAppStore((s) => s.toggleMode);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Wordmark />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-border p-2 text-foreground"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="mx-auto flex max-w-[1440px]">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >

          {import.meta.env.VITE_API_MODE !== 'live' && (
            <div className="mx-4 mb-1 flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-[11px] font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Mock data — no backend connected
            </div>
          )}

          <div className="flex items-center gap-3 border-y border-border px-6 py-4">
            <Avatar className="h-11 w-11">
              <AvatarImage src={seedProfile.avatarUrl ?? undefined} alt={seedProfile.firstName} />
              <AvatarFallback>{initials(seedProfile.firstName, seedProfile.lastName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {seedProfile.firstName} {seedProfile.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">{seedProfile.professionalTitle}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className="relative block">
                {({ isActive }) => (
                  <div
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-pill"
                        className="absolute inset-0 rounded-lg bg-primary-soft"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <item.icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{item.label}</span>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Signature element: dual-brand mode switch */}
          <div className="border-t border-border p-4">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Viewing as
            </p>
            <button
              onClick={toggleMode}
              className="relative flex w-full items-center rounded-full border border-border bg-muted p-1 text-xs font-semibold"
              aria-label="Switch between Freelancer and Client mode"
            >
              <motion.div
                className="absolute inset-y-1 w-1/2 rounded-full shadow-soft [background-image:var(--mode-gradient)]"
                animate={{ x: mode === 'freelancer' ? '0%' : '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
              <span className={cn('relative z-10 flex-1 rounded-full py-1.5 text-center transition-colors', mode === 'freelancer' ? 'text-white' : 'text-muted-foreground')}>
                Freelancer
              </span>
              <span className={cn('relative z-10 flex-1 rounded-full py-1.5 text-center transition-colors', mode === 'client' ? 'text-white' : 'text-muted-foreground')}>
                Client
              </span>
            </button>
          </div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-white [background-image:var(--mode-gradient)]">
        C
      </div>
      <span className="font-display text-lg font-extrabold tracking-tight text-foreground">Conduyt</span>
    </div>
  );
}
