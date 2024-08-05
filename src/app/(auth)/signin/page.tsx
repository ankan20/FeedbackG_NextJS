"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  //zod implementation for hookform resolver.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

 

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    
    setIsSubmitting(true);
    const response = await signIn('credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password
    })
    
    if(response?.error){
      toast({
        title:'Login failed',
        description:"Incorrect email or password",
        variant:"destructive"
      })
    }

    if(response?.url){
      setIsSubmitting(false);
      router.replace('/dashboard')
    }
  };

  return (
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
            Join FeedbackG
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
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
        <div className="text-center mt-4">
          <p>
          Not a member yet?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default Page;
