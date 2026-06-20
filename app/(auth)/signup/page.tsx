"use client"

import { useActionState, startTransition } from "react"
import Link from "next/link"
import { Sparkles, Loader2, ArrowRight } from "lucide-react"
import { isRedirectError } from "next/dist/client/components/redirect-error"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { signupAction } from "@/app/actions/auth"

export default function SignupPage() {
  const [state, action, isPending] = useActionState(
    async (
      _state: { success?: boolean; message?: string; error?: string } | null,
      formData: FormData
    ) => {
      try {
        const res = await signupAction(formData)
        if (res?.needsConfirmation) {
          return { success: true, message: res.message }
        }
        return { success: true, message: "Account created successfully! Redirecting..." }
      } catch (err: any) {
        if (isRedirectError(err)) {
          throw err
        }
        return { success: false, error: err.message || "An unexpected error occurred." }
      }
    },
    null
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      action(formData)
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 bg-radial from-background via-background/95 to-muted/10">
      <Card className="w-full max-w-md border-border bg-card/65 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden transition-all hover:border-primary/20">
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
          <CardDescription>
            Join TSA Culinary to begin coordinating culinary operations
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {state?.error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3.5 text-xs font-semibold text-destructive animate-shake">
                {state.error}
              </div>
            )}

            {state?.success && state?.message && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs font-semibold text-emerald-500 animate-fade-in">
                {state.message}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Albert Yorn"
                className="h-10 text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@domain.com"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className="h-10 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-10 mt-6 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline hover:text-primary/90 transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
