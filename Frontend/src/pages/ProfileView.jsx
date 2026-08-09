import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  MapPin,
  Star,
  Clock,
  Briefcase,
  CalendarDays,
  MessageSquareText,
  Languages as LanguagesIcon,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

import { useAxiosInstance } from '@/config/axiosConfig';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// ---------------------------------------------------------------------------
// MOCK DATA
// Used while testing the frontend without the backend.
// Set USE_MOCK = false when the real API is ready.
// ---------------------------------------------------------------------------
const MOCK_PROFILE = {
  id: 'usr_8841',
  name: 'Amara Fields',
  title: 'Senior Product Designer · Design Systems & Motion',
  avatarUrl:
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=faces',
  verified: true,
  online: true,
  location: 'Lisbon, Portugal',
  memberSince: '2021',
  rating: 4.9,
  reviewCount: 132,
  responseTime: 'Within 2 hours',
  hourlyRate: 65,
  currency: 'USD',
  bio: "I help fast-moving product teams turn rough ideas into shipped, well-tested interfaces. Ten years in product design, the last four focused on design systems and motion — the kind of work that makes a product feel considered rather than assembled.\n\nI usually work with founders and small teams who need a senior hand without a full-time hire: audits, systems, and end-to-end feature design.",
  skills: [
    'Design Systems',
    'Figma',
    'Motion Design',
    'React',
    'Tailwind CSS',
    'User Research',
    'Prototyping',
    'Accessibility',
  ],
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Portuguese', level: 'Fluent' },
    { name: 'Spanish', level: 'Conversational' },
  ],
  stats: {
    jobsCompleted: 87,
    hoursWorked: 3120,
    repeatClients: 34,
  },
  portfolio: [
    { id: 'p1', title: 'Fintech dashboard redesign', imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop' },
    { id: 'p2', title: 'Design system tokens', imageUrl: 'https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=400&h=400&fit=crop' },
    { id: 'p3', title: 'Onboarding flow', imageUrl: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=400&h=400&fit=crop' },
    { id: 'p4', title: 'Motion prototype', imageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=400&fit=crop' },
    { id: 'p5', title: 'Marketing site', imageUrl: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400&h=400&fit=crop' },
    { id: 'p6', title: 'Mobile app UI kit', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop' },
  ],
};

const USE_MOCK = true;

function useUserProfile(userId) {
  const axiosInstance = useAxiosInstance();

  return useQuery({
    queryKey: ['user-profile', userId ?? 'mock'],
    queryFn: async () => {
      if (USE_MOCK) return MOCK_PROFILE;

      if (!userId) {
        throw new Error('A userId is required when mock mode is disabled.');
      }

      const { data } = await axiosInstance.get(`/users/${userId}/profile`);
      return data;
    },
    enabled: USE_MOCK || Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function initialsOf(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function StatBlock({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1F6F5C]/10 text-[#1F6F5C]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>

      <div>
        <p className="font-mono text-sm font-semibold text-[#14213D]">{value}</p>
        <p className="text-xs text-[#5C6370]">{label}</p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Card className="border-none bg-white shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

function ProfileError({ onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
      <AlertTriangle className="h-8 w-8 text-[#C9971D]" aria-hidden="true" />

      <h2 className="text-lg font-semibold text-[#14213D]">
        Couldn't load this profile
      </h2>

      <p className="text-sm text-[#5C6370]">
        The profile didn't load. Check the connection and try again.
      </p>

      <Button
        variant="outline"
        onClick={onRetry}
        className="border-[#1F6F5C] text-[#1F6F5C] hover:bg-[#1F6F5C]/10"
      >
        Try again
      </Button>
    </div>
  );
}

export default function ProfileView() {
  const { userId } = useParams();

  const {
    data: profile,
    isPending,
    isError,
    refetch,
  } = useUserProfile(userId);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: profile?.currency ?? 'USD',
        maximumFractionDigits: 0,
      }),
    [profile?.currency],
  );

  if (isPending) return <ProfileSkeleton />;

  if (isError || !profile) {
    return <ProfileError onRetry={refetch} />;
  }

  const {
    name,
    title,
    avatarUrl,
    verified,
    online,
    location,
    memberSince,
    rating,
    reviewCount,
    responseTime,
    hourlyRate,
    bio,
    skills = [],
    languages = [],
    stats = {},
    portfolio = [],
  } = profile;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <Card className="overflow-hidden border-none bg-white shadow-sm">
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="bg-[#14213D] text-lg text-white">
                    {initialsOf(name)}
                  </AvatarFallback>
                </Avatar>

                {online && (
                  <span className="absolute bottom-1 right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6B8F71] opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-[#6B8F71]" />
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-2xl font-semibold text-[#14213D]">
                    {name}
                  </h1>

                  {verified && (
                    <span
                      className="inline-flex items-center gap-1 text-[#C9971D]"
                      title="Identity verified"
                    >
                      <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Verified</span>
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[#5C6370]">{title}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5C6370]">
                  {location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {location}
                    </span>
                  )}

                  {memberSince && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      Member since {memberSince}
                    </span>
                  )}

                  {typeof rating === 'number' && (
                    <span className="inline-flex items-center gap-1">
                      <Star
                        className="h-4 w-4 fill-[#C9971D] text-[#C9971D]"
                        aria-hidden="true"
                      />
                      <span className="font-mono font-semibold text-[#14213D]">
                        {rating.toFixed(1)}
                      </span>
                      {typeof reviewCount === 'number' && `(${reviewCount})`}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                {typeof hourlyRate === 'number' && (
                  <p className="font-mono text-xl font-semibold text-[#14213D]">
                    {currencyFormatter.format(hourlyRate)}
                    <span className="text-sm font-normal text-[#5C6370]">
                      /hr
                    </span>
                  </p>
                )}

                <div className="flex gap-2">
                  <Button className="bg-[#1F6F5C] text-white hover:bg-[#1B5F50]">
                    <MessageSquareText
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Message
                  </Button>

                  <Button
                    variant="outline"
                    className="border-[#14213D] text-[#14213D] hover:bg-[#14213D]/5"
                  >
                    Hire
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {bio && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
              >
                <Card className="border-none bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="mb-3 font-serif text-lg font-semibold text-[#14213D]">
                      About
                    </h2>

                    <p className="whitespace-pre-line text-sm leading-relaxed text-[#5C6370]">
                      {bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {skills.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
              >
                <Card className="border-none bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="mb-3 font-serif text-lg font-semibold text-[#14213D]">
                      Skills
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="cursor-default bg-[#14213D]/5 text-[#14213D] transition-transform hover:-translate-y-0.5 hover:bg-[#14213D]/10"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {portfolio.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
              >
                <Card className="border-none bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="mb-3 font-serif text-lg font-semibold text-[#14213D]">
                      Portfolio
                    </h2>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {portfolio.map((item) => (
                        <div
                          key={item.id}
                          className="group aspect-square overflow-hidden rounded-lg bg-[#14213D]/5"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
            >
              <Card className="border-none bg-white shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <h2 className="font-serif text-lg font-semibold text-[#14213D]">
                    At a glance
                  </h2>

                  {typeof stats.jobsCompleted === 'number' && (
                    <StatBlock
                      icon={Briefcase}
                      label="Jobs completed"
                      value={stats.jobsCompleted}
                    />
                  )}

                  {typeof stats.hoursWorked === 'number' && (
                    <StatBlock
                      icon={Clock}
                      label="Hours worked"
                      value={stats.hoursWorked}
                    />
                  )}

                  {responseTime && (
                    <StatBlock
                      icon={ShieldCheck}
                      label="Response time"
                      value={responseTime}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {languages.length > 0 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
              >
                <Card className="border-none bg-white shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-[#14213D]">
                      <LanguagesIcon className="h-4 w-4" aria-hidden="true" />
                      Languages
                    </h2>

                    <ul className="space-y-2 text-sm">
                      {languages.map((lang) => (
                        <li
                          key={lang.name}
                          className="flex items-center justify-between"
                        >
                          <span className="text-[#14213D]">{lang.name}</span>
                          <span className="text-[#5C6370]">{lang.level}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}