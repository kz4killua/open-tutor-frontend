"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { requestAccessToken } from "@/services/accounts"
import { storeAccessToken } from "@/utilities/token"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader } from "lucide-react"
import { Suspense } from 'react'


export default function SignInPage() {

  return (
    <main className="h-dvh flex items-center justify-center p-3">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <SignInForm />
          </Suspense>
        </CardContent>
        <CardFooter>
          <p className="text-sm">
            Don&apos;t have an account? <Link href={"/accounts/signup"} className="font-medium underline-offset-4 hover:underline">Sign up</Link> instead. 
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}


function SignInForm() {

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

  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    // Request an access token, handling any errors
    requestAccessToken(values.email, values.password)
    .then(response => {
      if (response.status >= 300) {
        throw 'TOKEN_REQUEST_ERROR'
      }
      return response
    })
    .then(response => {
      // Store the access token and navigate to the next page
      storeAccessToken(response.data.token)
      router.push(searchParams.get('next') || "/")
      toast.success("Welcome! We're glad you're here.")
    })
    .catch(() => {
      toast.error("Oops. We didn't get that right. Please try again.")
    })
    .finally(() => setLoading(false))
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          { loading && <Loader className="mr-2 h-4 w-4 animate-spin" /> }
          Sign In
        </Button>
      </form>
    </Form>
  )
}