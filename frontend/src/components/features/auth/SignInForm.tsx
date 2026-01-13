"use client"

/**
 * SignInForm Component
 *
 * User authentication form with real-time validation and 3D animations
 * Uses React Hook Form + Zod for validation
 */

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { signInSchema, type SignInFormData } from "@/schemas/auth"

export function SignInForm() {
  const { signIn, isLoading } = useAuth()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    await signIn(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-white/90">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    disabled={isLoading}
                    className="bg-white/80 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/50 focus:border-purple-500 dark:focus:border-purple-500/50 focus:ring-purple-500/30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-white/90">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    disabled={isLoading}
                    className="bg-white/80 dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/50 focus:border-purple-500 dark:focus:border-purple-500/50 focus:ring-purple-500/30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-slate-400 dark:border-white/40 bg-white dark:bg-white/10 text-purple-600 focus:ring-purple-500/50 focus:ring-offset-0 accent-purple-600"
                  />
                </FormControl>
                <FormLabel className="!mt-0 text-sm font-normal text-slate-700 dark:text-white/70 cursor-pointer">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatedButton
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </AnimatedButton>
        </motion.div>
      </form>
    </Form>
  )
}
