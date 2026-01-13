"use client"

/**
 * SignUpForm Component
 *
 * User registration form with real-time validation, password strength indicator, and 3D animations
 * Uses React Hook Form + Zod for validation
 */

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { signUpSchema, type SignUpFormData } from "@/schemas/auth"
import { PasswordStrength } from "./PasswordStrength"

export function SignUpForm() {
  const { signUp, isLoading } = useAuth()

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    await signUp(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-white/90">Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
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
          transition={{ delay: 0.15 }}
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
                <PasswordStrength password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-white/90">Confirm Password</FormLabel>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatedButton
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </AnimatedButton>
        </motion.div>
      </form>
    </Form>
  )
}
