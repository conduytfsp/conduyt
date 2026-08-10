import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Briefcase, ClipboardList, Menu, ShieldCheck, UserRound, LogOut, Sliders } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAxiosInstance } from '@/config/axiosConfig';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, initials } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';

const NAV_ITEMS = [
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
  { to: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/dashboard/applications', label: 'Applications', icon: ClipboardList },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/security', label: 'Security', icon: ShieldCheck },
  { to: '/dashboard/extras', label: 'Extras', icon: Sliders }, // FIX: Added Extras Tab
];

export function DashboardLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const axios = useAxiosInstance();

  // ================= FETCH USER PROFILE =================
  const { data: profile, isLoading } = useQuery({
    queryKey: ['freelancer', 'profile'],
    queryFn: async () => {
      try {
        const res = await axios.get('/api/freelancers/profile');
        return res.data?.data || res.data;
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache profile for 5 minutes
  });

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
      <div className="min-h-screen flex flex-col bg-background font-sans antialiased">

        {/* ================= TOP NAVBAR ================= */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>

        {/* ================= PAGE LAYOUT ================= */}
        <div className="flex flex-1 pt-16 relative">

          {/* SIDEBAR */}
          <aside
              className={cn(
                  'fixed inset-y-0 left-0 top-16 z-40 flex h-[calc(100vh-64px)] w-64 flex-col border-r border-border bg-surface transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto',
                  mobileOpen ? 'translate-x-0' : '-translate-x-full'
              )}
          >
            {/* Profile Widget */}
            <div className="flex items-center gap-3 border-b border-border px-6 py-5">
              {isLoading ? (
                  <>
                    <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                    <div className="space-y-2 w-full overflow-hidden">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </>
              ) : (
                  <>
                    <Avatar className="h-11 w-11 border border-border">
                      <AvatarImage
                          src={profile?.avatarUrl || profile?.profileImage || profile?.pfpUrl}
                          alt={profile?.firstName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {profile ? initials(profile.firstName, profile.lastName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {profile ? `${profile.firstName} ${profile.lastName}` : 'Unknown User'}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {profile?.title || profile?.professionalTitle || 'Freelancer'}
                      </p>
                    </div>
                  </>
              )}
            </div>

            {/* Navigation Links */}
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
                          {/* Framer Motion Active Pill */}
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

            {/* Logout Button */}
            <div className="mt-auto border-t border-border p-4">
              <Link
                  to="/logout"
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Logout
              </Link>
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {mobileOpen && (
              <div
                  className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileOpen(false)}
                  aria-hidden="true"
              />
          )}

          {/* MAIN VIEW AREA */}
          <main className="flex-1 lg:ml-64 flex flex-col min-w-0 p-4 sm:p-6 md:p-10">

            {/* Mobile Sidebar Toggle Button */}
            <div className="lg:hidden mb-6">
              <button
                  onClick={() => setMobileOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
              >
                <Menu className="h-5 w-5" />
                Dashboard Menu
              </button>
            </div>

            <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
  );
}