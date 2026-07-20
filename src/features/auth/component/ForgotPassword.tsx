"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "sonner";
import { ChevronLeft, Loader2, Mail } from "lucide-react";
import Image from "next/image";

const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgetPasswordValues = z.infer<typeof forgetPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgetPasswordValues>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgetPasswordValues) {
    setIsLoading(true);
    try {
      console.log("Reset Request for:", values.email);

      toast.success("Reset link sent!", {
        description: "Please check your email for instructions.",
      });

      // In a real flow, you might redirect to a success state or the login page
      setTimeout(() => {
        router.push("/verify-otp");
      }, 2000);
    } catch {
      toast.error("Error", {
        description: "Failed to send reset link. Please try again.",
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
            Forgot Password
          </h2>
          <p className="text-[#64748B] text-base">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
