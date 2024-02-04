"use client"

import { useToast } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { signUpRequest } from "../../../../api/accounts"
import { requestAccessTokenRequest } from "../../../../api/accounts"
import AccountsForm from "@/components/AccountsForm"
import Logo from "@/components/Logo"


export default function SignInPage() {

  const toast = useToast()
  const router = useRouter()

  async function handleSignUp(e) {

    e.preventDefault()

    // Retrieve the user's entered details
    const username = document.querySelector('input#username').value
    const password = document.querySelector('input#password').value

    // Create an account
    let response = await signUpRequest(username, password)

    // Handle failed signup attempts
    if (!response.ok) {
      toast({
        "title": "Failed to create an account.",
        "status": "error"
      })
      return
    }

    // Retrieve the user's access token
    response = await requestAccessTokenRequest(username, password)

    // Handle invalid sign in attempts
    if (!response.ok) {
      toast({
        "title": "Failed to sign in.",
        "status": "error"
      })
      return
    }

    // Save the token in local and session storage
    const accessToken = response["data"]["token"]
    sessionStorage.setItem('accessToken', accessToken)
    localStorage.setItem('accessToken', accessToken)

    // Redirect to the home page
    router.push("/")    

  }

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        
        <AccountsForm onSubmit={handleSignUp} />

        <p className="mt-10 text-center text-sm text-gray-500">
          
          <span className="mr-3">
            Already have an account?
          </span>
          <a href="/accounts/signin" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
            Sign in now
          </a>
        </p>
      </div>
    </div>
  )
}