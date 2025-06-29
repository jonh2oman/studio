
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Ship } from "lucide-react";
import Image from "next/image";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  const onEmailSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    if (!auth) {
        toast({
            variant: "destructive",
            title: "Configuration Error",
            description: "Firebase is not configured. Please check your environment variables.",
        });
        setIsLoading(false);
        return;
    }

    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Account Created", description: "You have been successfully signed up." });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6 p-6 sm:p-0">
          <div className="grid gap-4 text-center">
            <div className="flex justify-center">
                <div className="bg-primary/20 p-3 rounded-full">
                    <Ship className="w-8 h-8 text-primary" />
                </div>
            </div>
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
                Enter your information to create an account
            </p>
          </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                </Button>
                </form>
            </Form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-semibold text-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1200x1200.png"
          alt="Cadet elemental crests"
          width="1200"
          height="1200"
          className="h-full w-full object-cover"
          data-ai-hint="cadet crests"
        />
      </div>
    </div>
  );
}
