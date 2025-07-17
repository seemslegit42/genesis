'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { SignUpPayload, SignUpPayloadSchema } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SignupProps {
    onSwitchToLogin: () => void;
}

export function Signup({ onSwitchToLogin }: SignupProps) {
  const { signUp, loading } = useAuth();
  const { toast } = useToast();
  const form = useForm<SignUpPayload>({
    resolver: zodResolver(SignUpPayloadSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: SignUpPayload) {
    const result = await signUp(data);
    if (result && !result.success) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: result.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <Card className="mx-auto max-w-sm w-full glassmorphism">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-headline text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">Become an Initiate</CardTitle>
        <CardDescription className="text-center">
          Create your account to begin your journey with Genesis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="initiate@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Button variant="link" onClick={onSwitchToLogin} className="px-1">
            Sign in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
