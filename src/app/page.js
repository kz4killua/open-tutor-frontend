"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Home() {

  const router = useRouter()

  // Redirect the index page to the journey's route
  useEffect(() => {
    router.push('/journeys')
  }, [])

  return (
    <main>
      
    </main>
  );
}
