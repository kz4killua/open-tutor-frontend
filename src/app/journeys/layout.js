"use client"


import Header from "@/components/Header"
import LoginRequired from "@/components/LoginRequired"


export default function JourneysLayout({ children }) {
  return (
    <LoginRequired>
      <div className="min-w-screen min-h-screen h-screen max-h-screen flex flex-col bg-blue-50/[.50] overflow-y-hidden">
        <Header />
        { children }
      </div>
    </LoginRequired>
  )
}