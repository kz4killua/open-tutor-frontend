"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"


export default function SignUpPage() {

  return (
    <main className="h-dvh flex items-center justify-center p-3">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Let&apos;s get started</CardTitle>
          <CardDescription>
            Create your account with an email and a password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className="text-sm">
            Already have an account? <Link href={"/accounts/signin"} className="font-medium underline-offset-4 hover:underline">Sign in</Link>. 
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}


function SignUpForm() {

  const formSchema = z.object({
    email: z.string().email({ 
      message: "This email address is invalid." 
    }),
    password: z.string().min(8, {
      message: "Your password must have at least 8 characters."
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "", password: ""
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField 
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We recommend using your school email.
              </FormDescription>
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
                <Input placeholder="" type="password" {...field} />
              </FormControl>
              <FormDescription>
                Enter a strong password with at least 8 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </Form>
  )
}