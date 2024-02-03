"use client"

import { useToast } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { signUpRequest } from "../../../../api/accounts"
import { requestAccessTokenRequest } from "../../../../api/accounts"


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
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign in
            </button>
          </div>
        </form>

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