import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, CheckCircle2, Lock, Mail, Pencil, Plus, ShieldCheck, X } from 'lucide-react';
import { useAxiosInstance } from '@/config/axiosConfig';
import { freelancerApi } from '@/api/freelancerApi';
import { seedProfile } from '@/lib/mockData';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { initials } from '@/lib/utils';

export default function ProfileTab() {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(seedProfile.skills);
  const [skillDraft, setSkillDraft] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(seedProfile.avatarUrl);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['freelancer', 'profile'],
    queryFn: () => freelancerApi.getProfile(axios),
    placeholderData: seedProfile,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: seedProfile.firstName,
      lastName: seedProfile.lastName,
      professionalTitle: seedProfile.professionalTitle,
      bio: seedProfile.bio,
    },
  });

  // Keep the form + local state in sync with whatever the server/placeholder data is
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        professionalTitle: profile.professionalTitle,
        bio: profile.bio,
      });
      setSkills(profile.skills);
      setAvatarPreview(profile.avatarUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const updateProfileMutation = useMutation({
    mutationFn: (payload) => freelancerApi.updateProfile(axios, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['freelancer', 'profile'], updated);
      setIsEditing(false);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file) => freelancerApi.uploadAvatar(axios, file),
  });

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    uploadAvatarMutation.mutate(file);
  };

  const addSkill = () => {
    const value = skillDraft.trim();
    if (value && !skills.includes(value)) {
      setSkills((prev) => [...prev, value]);
    }
    setSkillDraft('');
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const onSubmit = (values) => {
    updateProfileMutation.mutate({ ...values, skills });
  };

  const cancelEditing = () => {
    // Revert any unsaved changes back to the last known-good data
    const p = profile ?? seedProfile;
    reset({
      firstName: p.firstName,
      lastName: p.lastName,
      professionalTitle: p.professionalTitle,
      bio: p.bio,
    });
    setSkills(p.skills);
    setAvatarPreview(p.avatarUrl);
    setIsEditing(false);
  };

  if (isLoading && !profile) {
    return <ProfileSkeleton />;
  }

  const p = profile ?? seedProfile;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Tab 1 · Storefront"
        title="Professional Profile"
        description="This is what clients see first when they open your proposal. Make it count."
        action={
          !isEditing ? (
            <Button type="button" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" /> Edit profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button type="submit" form="profile-form" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          )
        }
      />

      {updateProfileMutation.isSuccess && !isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700"
        >
          <CheckCircle2 className="h-4 w-4" /> Profile saved
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.form
            key="edit"
            id="profile-form"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Basic info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic information</CardTitle>
                <CardDescription>Your name and photo, shown on every proposal you send.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarPreview ?? undefined} alt={p.firstName} />
                      <AvatarFallback className="text-xl">{initials(p.firstName, p.lastName)}</AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-primary text-white shadow-soft transition hover:brightness-110"
                      aria-label="Upload avatar"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Profile photo</p>
                    <p className="text-xs text-muted-foreground">JPG or PNG, uploaded to Cloudinary. 400×400px recommended.</p>
                    {uploadAvatarMutation.isPending && <p className="mt-1 text-xs text-primary">Uploading…</p>}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" {...register('firstName', { required: 'First name is required' })} />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" {...register('lastName', { required: 'Last name is required' })} />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Title & Bio */}
            <Card>
              <CardHeader>
                <CardTitle>Headline & summary</CardTitle>
                <CardDescription>A sharp title and a short story about how you work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="professionalTitle">Professional title</Label>
                  <Input
                    id="professionalTitle"
                    placeholder="e.g. Senior React & Tailwind Developer"
                    {...register('professionalTitle', {
                      required: 'Add a title',
                      maxLength: { value: 80, message: 'Keep it under ~10 words' },
                    })}
                  />
                  <p className="text-xs text-muted-foreground">5–10 words clients will see beside your name.</p>
                  {errors.professionalTitle && <p className="text-xs text-destructive">{errors.professionalTitle.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio / summary</Label>
                  <Textarea
                    id="bio"
                    rows={6}
                    placeholder="Tell clients about your experience and how you approach work…"
                    {...register('bio', { required: 'A short bio helps clients trust you' })}
                  />
                  {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Core skills</CardTitle>
                <CardDescription>Your tech stack, at a glance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <motion.div key={skill} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                      <Badge className="gap-1.5 py-1 pl-3 pr-2 text-[13px]">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
                          <X className="h-3 w-3 opacity-60 hover:opacity-100" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                  {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={skillDraft}
                    onChange={(e) => setSkillDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill, e.g. Spring Boot"
                    className="max-w-xs"
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact info (still read-only, even while editing) */}
            <ContactInfoCard profile={p} />

            {/* Bottom action bar mirrors the header actions, handy on long forms */}
            <div className="flex items-center justify-end gap-3 pb-4 sm:hidden">
              <Button type="button" variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Storefront preview */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <Avatar className="h-24 w-24 shrink-0">
                    <AvatarImage src={p.avatarUrl ?? undefined} alt={p.firstName} />
                    <AvatarFallback className="text-2xl">{initials(p.firstName, p.lastName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
                      {p.firstName} {p.lastName}
                    </h2>
                    <p className="mt-0.5 text-sm font-medium text-primary">{p.professionalTitle}</p>
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
                  {p.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                  {p.skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet.</p>}
                </div>
              </CardContent>
            </Card>

            <ContactInfoCard profile={p} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactInfoCard({ profile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact information</CardTitle>
        <CardDescription>Kept private until a client officially hires you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{profile.email}</p>
              <p className="text-xs text-muted-foreground">
                {profile.emailVerified ? 'Verified' : 'Not verified'} · Hidden from clients until hired
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Private
          </div>
        </div>
        {profile.emailVerified && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" /> Email verified — clients will trust this profile more.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
