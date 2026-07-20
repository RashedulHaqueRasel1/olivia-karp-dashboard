"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login Failed", {
          description: result.error,
        });
      } else {
        toast.success("Login Successful", {
          description: "Welcome back to Olivia Karp Dashboard!",
        });
        router.push("/dashboard-overview");
      }
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[500px] bg-white rounded-[32px] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
      {/* Logo + Title */}
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Act On Climate"
            width={120}
            height={60}
            className="h-auto w-auto"
            priority
          />
        </div>
        <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2">Login</h2>
        <p className="text-[#667085] text-base">
          Secure access for moderation & support
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                      size={20}
                    />
                    <Input
                      placeholder="Enter your email"
                      className="h-[56px] pl-12 bg-white border-[#E2E8F0] rounded-xl text-[#1A1A1A] placeholder:text-[#94A3B8] focus:border-[#004343] focus:ring-0 transition-all"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                      size={20}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      className="h-[56px] pl-12 pr-12 bg-white border-[#E2E8F0] rounded-xl text-[#1A1A1A] placeholder:text-[#94A3B8] focus:border-[#004343] focus:ring-0 transition-all"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-[#CBD5E1] data-[state=checked]:bg-[#004343] data-[state=checked]:border-[#004343]"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium text-[#94A3B8] cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />

            <Link
              href="/forget-password"
              className="text-sm font-medium text-[#FB5151] hover:text-[#E04444] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-[56px] bg-[#004343] hover:bg-[#003333] text-white rounded-xl text-lg font-semibold transition-all shadow-lg shadow-[#004343]/10"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
}
