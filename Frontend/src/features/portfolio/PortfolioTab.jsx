import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, ExternalLink, FileText, Globe, Loader2, Pencil, Trash2, UploadCloud } from 'lucide-react';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useAxiosInstance } from '@/config/axiosConfig';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

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

    // ================= FETCH PORTFOLIO =================
    const { data: portfolio, isLoading } = useQuery({
        queryKey: ['freelancer', 'portfolio'],
        queryFn: async () => {
            try {
                const res = await axios.get('/api/freelancers/portfolio');
                return res.data?.data || res.data || {};
            } catch (err) {
                // Return empty object on 404 (new user hasn't saved yet)
                return {};
            }
        }
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            githubUrl: '',
            linkedinUrl: '',
            portfolioUrl: '',
        },
    });

    // Sync form state when portfolio data arrives
    useEffect(() => {
        if (portfolio) {
            reset({
                githubUrl: portfolio.githubUrl || '',
                linkedinUrl: portfolio.linkedinUrl || '',
                portfolioUrl: portfolio.portfolioUrl || '',
            });
        }
    }, [portfolio, reset]);

    // ================= UPDATE LINKS MUTATION =================
    const updateLinksMutation = useMutation({
        mutationFn: async (payload) => {
            const res = await axios.put('/api/freelancers/portfolio', payload);
            return res.data?.data || res.data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(['freelancer', 'portfolio'], updated);
            setIsEditing(false);
            toast.success("Portfolio links saved successfully!");
        },
        onError: (err) => {
            toast.error("Failed to save portfolio links. Please try again.");
            console.error(err);
        },
    });

    // ================= UPLOAD RESUME MUTATION =================
    const uploadResumeMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post('/api/freelancers/resume', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data?.data || res.data;
        },
        onSuccess: (res) => {
            queryClient.setQueryData(['freelancer', 'portfolio'], (prev) => ({
                ...(prev || {}),
                resumeUrl: res.url,
                resumeFileName: res.fileName,
            }));
            toast.success("Résumé uploaded successfully!");
        },
        onError: (err) => {
            toast.error("Failed to upload résumé. Please try again.");
            console.error(err);
        }
    });

    // ================= DELETE RESUME MUTATION =================
    const deleteResumeMutation = useMutation({
        mutationFn: async () => {
            await axios.delete('/api/freelancers/resume');
        },
        onSuccess: () => {
            queryClient.setQueryData(['freelancer', 'portfolio'], (prev) => ({
                ...(prev || {}),
                resumeUrl: null,
                resumeFileName: null,
            }));
            toast.success("Résumé removed successfully!");
        },
        onError: (err) => {
            toast.error("Failed to remove résumé. Please try again.");
            console.error(err);
        }
    });

    const handleFile = (file) => {
        if (!file) return;
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size exceeds 5MB limit.');
            return;
        }
        uploadResumeMutation.mutate(file);
    };

    const cancelEditing = () => {
        reset({
            githubUrl: portfolio?.githubUrl || '',
            linkedinUrl: portfolio?.linkedinUrl || '',
            portfolioUrl: portfolio?.portfolioUrl || '',
        });
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-5xl space-y-6 w-full">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    const p = portfolio || {};
    const resumeName = p.resumeFileName;

    return (
        <div className="mx-auto max-w-5xl w-full">
            <PageHeader
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

            <div className="space-y-6">
                {/* Résumé / CV Card */}
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

                                    {resumeName && !uploadResumeMutation.isPending && (
                                        <ResumeFileCard
                                            name={resumeName}
                                            onDelete={() => deleteResumeMutation.mutate()}
                                            className="mt-4"
                                            axiosInstance={axios}
                                        />
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                    {resumeName ? (
                                        <ResumeFileCard name={resumeName} onDelete={() => deleteResumeMutation.mutate()} axiosInstance={axios} />
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
                                                href={p[key].startsWith('http') ? p[key] : `https://${p[key]}`}
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

function ResumeFileCard({ name, onDelete, className = '', axiosInstance }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (actionType) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/freelancers/resume/view');
            const fileUrl = response.data?.url || response.data;

            if (!fileUrl) {
                toast.error("No résumé file found.");
                return;
            }

            if (actionType === 'preview') {
                window.open(fileUrl, '_blank', 'noopener,noreferrer');
            } else if (actionType === 'download') {
                const a = document.createElement('a');
                a.href = fileUrl;
                a.target = '_blank';
                a.download = name || 'resume.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error("Failed to load PDF file:", err);
            toast.error("Could not load résumé file.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex items-center justify-between rounded-lg border border-border bg-surface p-3 ${className}`}>
            <div
                onClick={() => handleAction('preview')}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                title="Click to preview PDF"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{name}</p>
                    <p className="text-xs text-muted-foreground">Click to preview PDF · Attached to proposals</p>
                </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAction('download');
                    }}
                    disabled={isLoading}
                    className="p-2 text-muted-foreground transition hover:text-primary rounded-lg hover:bg-muted cursor-pointer"
                    title="Download PDF"
                >
                    <Download className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-2 text-muted-foreground transition hover:text-destructive rounded-lg hover:bg-muted cursor-pointer"
                    title="Remove résumé"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
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