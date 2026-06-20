"use client"

import { useActionState, startTransition } from "react"
import Link from "next/link"
import { Sparkles, Loader2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { loginAction } from "@/app/actions/auth"

export default function LoginPage() {
  const [error, action, isPending] = useActionState(
    async (_state: string | null, formData: FormData) => {
      try {
        await loginAction(formData)
        return null
      } catch (err: any) {
        return err.message || "An unexpected error occurred."
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
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access the Culinary Operations Copilot
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3.5 text-xs font-semibold text-destructive animate-shake">
                {error}
              </div>
            )}
            
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline hover:text-primary/90 transition-colors"
            >
              Create one here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
