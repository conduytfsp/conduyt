import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useAxiosInstance } from '@/config/axiosConfig';
import { freelancerApi } from '@/api/freelancerApi';
import { seedSecurity, seedProfile } from '@/lib/mockData';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function SecurityTab() {
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const [otp, setOtp] = useState('');
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);

  const { data: security, isLoading } = useQuery({
    queryKey: ['freelancer', 'security'],
    queryFn: () => freelancerApi.getSecuritySettings(axios),
    placeholderData: seedSecurity,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const changePasswordMutation = useMutation({
    mutationFn: (payload) => freelancerApi.changePassword(axios, payload),
    onSuccess: () => reset(),
  });

  const toggleTwoFactorMutation = useMutation({
    mutationFn: (enabled) => freelancerApi.toggleTwoFactor(axios, enabled),
    onSuccess: (updated) => {
      queryClient.setQueryData(['freelancer', 'security'], updated);
      if (updated.twoFactorEnabled) setOtpDialogOpen(true);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (code) => freelancerApi.verifyTwoFactorOtp(axios, code),
    onSuccess: () => {
      setOtpDialogOpen(false);
      setOtp('');
    },
  });

  const newPassword = watch('newPassword');
  const isEnabled = security?.twoFactorEnabled ?? seedSecurity.twoFactorEnabled;

  if (isLoading && !security) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Tab 5 · Access control"
        title="Security"
        description="Keep your account locked down with a strong password and two-factor sign-in."
      />

      <div className="space-y-6">
        {/* Change password */}
        <Card>
          <form
            onSubmit={handleSubmit((values) => {
              if (values.newPassword !== values.confirmPassword) return;
              changePasswordMutation.mutate(values);
            })}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Change password
              </CardTitle>
              <CardDescription>Use a password you're not using anywhere else.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register('currentPassword', { required: 'Enter your current password' })}
                />
                {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register('newPassword', {
                    required: 'Enter a new password',
                    minLength: { value: 8, message: 'At least 8 characters' },
                  })}
                />
                {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirm your new password',
                    validate: (v) => v === newPassword || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>
            </CardContent>
            <div className="flex items-center justify-end gap-3 p-6 pt-0">
              {isSubmitSuccessful && changePasswordMutation.isSuccess && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Password updated
                </span>
              )}
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? 'Updating…' : 'Update password'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Two-factor authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Two-factor authentication
            </CardTitle>
            <CardDescription>
              We'll email a 6-digit code to <span className="font-medium text-foreground">{seedProfile.email}</span> each time you sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Email OTP at sign-in</p>
                <p className="text-xs text-muted-foreground">{isEnabled ? 'Enabled — you will be asked for a code on your next login' : 'Off — sign-in only requires your password'}</p>
              </div>
              <Switch
                checked={isEnabled}
                disabled={toggleTwoFactorMutation.isPending}
                onCheckedChange={(checked) => toggleTwoFactorMutation.mutate(checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OTP verification dialog, triggered after enabling 2FA */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <DialogTitle>Confirm it's you</DialogTitle>
            <DialogDescription>
              We sent a 6-digit code to {seedProfile.email}. Enter it below to finish turning on two-factor authentication.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            inputMode="numeric"
            className="text-center font-mono text-lg tracking-[0.5em]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOtpDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={otp.length !== 6 || verifyOtpMutation.isPending}
              onClick={() => verifyOtpMutation.mutate(otp)}
            >
              {verifyOtpMutation.isPending ? 'Verifying…' : 'Verify & enable'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
