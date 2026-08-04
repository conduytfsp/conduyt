import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, FileText, Globe, Pencil, Trash2, UploadCloud } from 'lucide-react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useAxiosInstance } from '@/config/axiosConfig';
import { freelancerApi } from '@/api/freelancerApi';
import { seedPortfolio } from '@/lib/mockData';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const urlPattern = {
  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/,
  message: 'Enter a valid URL',
};

const LINKS = [
  { key: 'githubUrl', label: 'GitHub', icon: FaGithub },
  { key: 'linkedinUrl', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'portfolioUrl', label: 'Portfolio website', icon: Globe },
];

export default function PortfolioTab() {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['freelancer', 'portfolio'],
    queryFn: () => freelancerApi.getPortfolio(axios),
    placeholderData: seedPortfolio,
  });

  const form = useForm({
    values: {
      githubUrl: portfolio?.githubUrl ?? seedPortfolio.githubUrl,
      linkedinUrl: portfolio?.linkedinUrl ?? seedPortfolio.linkedinUrl,
      portfolioUrl: portfolio?.portfolioUrl ?? seedPortfolio.portfolioUrl,
    },
  });
  const { register, handleSubmit, reset, formState: { errors } } = form;

  const updateLinksMutation = useMutation({
    mutationFn: (payload) => freelancerApi.updatePortfolioLinks(axios, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['freelancer', 'portfolio'], updated);
      setIsEditing(false);
    },
  });

  const uploadResumeMutation = useMutation({
    mutationFn: (file) => freelancerApi.uploadResume(axios, file),
    onSuccess: (res) =>
      queryClient.setQueryData(['freelancer', 'portfolio'], (prev) => ({
        ...(prev ?? seedPortfolio),
        resumeUrl: res.url,
        resumeFileName: res.fileName,
      })),
  });

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') return;
    uploadResumeMutation.mutate(file);
  };

  const cancelEditing = () => {
    reset({
      githubUrl: portfolio?.githubUrl ?? seedPortfolio.githubUrl,
      linkedinUrl: portfolio?.linkedinUrl ?? seedPortfolio.linkedinUrl,
      portfolioUrl: portfolio?.portfolioUrl ?? seedPortfolio.portfolioUrl,
    });
    setIsEditing(false);
  };

  const p = portfolio ?? seedPortfolio;
  const resumeName = p.resumeFileName;

  if (isLoading && !portfolio) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Tab 2 · Proof of work"
        title="Portfolio & Assets"
        description="Give clients a place to verify your work: your résumé and your best public links."
        action={
          !isEditing ? (
            <Button type="button" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" /> Edit portfolio
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button type="submit" form="portfolio-links-form" disabled={updateLinksMutation.isPending}>
                {updateLinksMutation.isPending ? 'Saving…' : 'Save links'}
              </Button>
            </div>
          )
        }
      />

      {updateLinksMutation.isSuccess && !isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700"
        >
          <CheckCircle2 className="h-4 w-4" /> Links saved
        </motion.div>
      )}

      <div className="space-y-6">
        {/* Resume — upload control shown only in edit mode, but the file card always shows */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé / CV</CardTitle>
            <CardDescription>PDF only. This is attached automatically to every proposal.</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      handleFile(e.dataTransfer.files?.[0]);
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                      dragActive ? 'border-primary bg-primary-soft' : 'border-border bg-muted/40'
                    }`}
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Drag and drop your résumé here</p>
                    <p className="mb-4 text-xs text-muted-foreground">or click below to browse — PDF, up to 5MB</p>
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      Choose PDF
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])}
                    />
                  </div>

                  {uploadResumeMutation.isPending && <p className="mt-3 text-xs text-primary">Uploading résumé…</p>}

                  {resumeName && !uploadResumeMutation.isPending && <ResumeFileCard name={resumeName} className="mt-4" />}
                </motion.div>
              ) : (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  {resumeName ? (
                    <ResumeFileCard name={resumeName} />
                  ) : (
                    <p className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                      No résumé uploaded yet. Click "Edit portfolio" to add one.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* External links */}
        <Card>
          <CardHeader>
            <CardTitle>External links</CardTitle>
            <CardDescription>Where clients can see more of your work.</CardDescription>
          </CardHeader>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.form
                key="edit"
                id="portfolio-links-form"
                onSubmit={handleSubmit((values) => updateLinksMutation.mutate(values))}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <CardContent className="space-y-5">
                  <LinkField
                    icon={<FaGithub className="h-4 w-4" />}
                    label="GitHub profile"
                    placeholder="https://github.com/yourname"
                    error={errors.githubUrl?.message}
                    registration={register('githubUrl', { pattern: urlPattern })}
                  />
                  <LinkField
                    icon={<FaLinkedin className="h-4 w-4" />}
                    label="LinkedIn profile"
                    placeholder="https://linkedin.com/in/yourname"
                    error={errors.linkedinUrl?.message}
                    registration={register('linkedinUrl', { pattern: urlPattern })}
                  />
                  <LinkField
                    icon={<Globe className="h-4 w-4" />}
                    label="Personal portfolio website"
                    placeholder="https://yourname.dev"
                    error={errors.portfolioUrl?.message}
                    registration={register('portfolioUrl', { pattern: urlPattern })}
                  />
                </CardContent>
                <div className="flex justify-end gap-3 p-6 pt-0 sm:hidden">
                  <Button type="button" variant="outline" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateLinksMutation.isPending}>
                    {updateLinksMutation.isPending ? 'Saving…' : 'Save links'}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <CardContent className="space-y-3">
                  {LINKS.map(({ key, label, icon: Icon }) =>
                    p[key] ? (
                      <a
                        key={key}
                        href={p[key]}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between rounded-lg border border-border bg-surface p-3 transition hover:border-primary/40 hover:bg-primary-soft"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{label}</p>
                            <p className="truncate text-xs text-muted-foreground">{p[key]}</p>
                          </div>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                      </a>
                    ) : null,
                  )}
                  {LINKS.every(({ key }) => !p[key]) && (
                    <p className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
                      No links added yet. Click "Edit portfolio" to add some.
                    </p>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

function ResumeFileCard({ name, className = '' }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border border-border bg-surface p-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">Uploaded and attached to proposals</p>
        </div>
      </div>
      <button type="button" className="text-muted-foreground transition hover:text-destructive" aria-label="Remove résumé">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function LinkField({ icon, label, placeholder, error, registration }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <Input placeholder={placeholder} className="pl-9" {...registration} />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
