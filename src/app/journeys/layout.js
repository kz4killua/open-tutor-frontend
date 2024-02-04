"use client"


import LoginRequired from "@/components/LoginRequired"


export default function JourneysLayout({ children }) {
  return (
    <LoginRequired>
      { children }
    </LoginRequired>
  )
}