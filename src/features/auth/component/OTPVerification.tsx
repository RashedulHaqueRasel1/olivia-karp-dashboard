"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { toast } from "sonner";
import { Loader2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits." })
    .regex(/^\d+$/, { message: "OTP must contain only numbers." }),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export default function OTPVerification() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Update form value whenever individual boxes change
  useEffect(() => {
    form.setValue("otp", otpValues.join(""));
  }, [otpValues, form]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value.slice(-1); // Only take last char
    setOtpValues(newValues);

    // Move to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  async function onSubmit(values: OTPFormValues) {
    setIsLoading(true);
    try {
      console.log("Verifying OTP:", values.otp);
      toast.success("Verification Successful", {
        description: "Your identity has been verified.",
      });

      setTimeout(() => {
        router.push("/reset-password");
      }, 2000);
    } catch {
      toast.error("Error", {
        description: "Invalid OTP. Please try again.",
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
          <h2 className="text-[20px] font-bold text-[#1A1A1A]">Verify Email</h2>
          <p className="text-[#64748B] text-base">
            Enter your email to recover your password
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="otp"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-between gap-2 md:gap-4 px-2">
                      {otpValues.map((value, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            if (el) inputRefs.current[index] = el;
                          }}
                          type="text"
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-[15%] h-[60px] text-center border-2 border-[#E2E8F0] rounded-lg text-lg font-semibold text-[#1A1A1A] focus:border-[#004343] focus:ring-1 focus:ring-[#004343] outline-hidden transition-all bg-white"
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
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

        <div className="flex flex-col items-center space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-[#667085] hover:text-[#004343] transition-colors"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
