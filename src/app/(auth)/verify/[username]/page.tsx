"use client";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace("/signin");
    } catch (error) {
      console.error("Error in signin of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let erroMessage =
        axiosError.response?.data.message ??
        "There was a problem with your sign-in. Please try again.";

      toast({
        title: "Sign In failed",
        description: erroMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="relative flex justify-center items-center min-h-screen bg-black">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 h-full w-full object-cover z-0"
          src="/signup-background-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white  bg-opacity-70 backdrop-blur-md rounded-lg shadow-md">
          <div className="text-center ">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 ">
              Verify Your Account
            </h1>
            <p className="mb-4">
              Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="code" {...field} type="number" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Signin"
                )}
              </Button>
            </form>
          </Form>
          
        </div>
      </div>
    </div>
  );
};

export default page;
