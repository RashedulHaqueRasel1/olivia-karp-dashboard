"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordValues) {
    setIsLoading(true);
    try {
      console.log("Resetting password with:", values);
      toast.success("Password Reset Successful", {
        description: "You can now log in with your new password.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      toast.error("Error", {
        description: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[500px] bg-white rounded-[32px] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center">
      <div className="w-full space-y-8">
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

        <div className="space-y-3 text-center">
          <h2 className="text-[20px] font-bold text-[#1A1A1A]">
            Reset Password
          </h2>
          <p className="text-[#64748B] text-base">Create a new password</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
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
                        placeholder="Create New Password"
                        className="h-[56px] pl-12 pr-12 bg-white border-[#E2E8F0] rounded-xl text-[#1A1A1A] placeholder:text-[#94A3B8] focus:border-[#004343] focus:ring-0 transition-all font-medium"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#004343] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                        size={20}
                      />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        className="h-[56px] pl-12 pr-12 bg-white border-[#E2E8F0] rounded-xl text-[#1A1A1A] placeholder:text-[#94A3B8] focus:border-[#004343] focus:ring-0 transition-all font-medium"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#004343] transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-[56px] bg-[#004343] hover:bg-[#003333] text-white rounded-xl text-lg font-semibold transition-all shadow-lg shadow-[#004343]/10"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Send OTP
            </Button>
          </form>
        </Form>

        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-[#667085] hover:text-[#004343] transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
