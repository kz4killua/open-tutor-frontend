"use client"

import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Github, Moon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Home() {
  return (
    <div>
      <HomeHeader />
      <Hero />
    </div>
  );
}


function HomeHeader() {

  const [isScrolled, setIsScrolled] = useState(false)

  // Add a shadow when the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  return (
    <header className={`h-24 flex justify-between items-center py-3 px-6 sticky top-0 transition-shadow ${isScrolled ? 'shadow' : ''}`}>

      <div className="flex items-center gap-x-10">
        <Link href={""}>
          <div className="flex gap-x-1 items-center">
            <Icon width={30} height={30} />
            <span className="font-bold">Open Tutor</span>
          </div>
        </Link>
        <nav className="grow hidden sm:flex justify-center gap-x-7">
          <Link href={"/"} className="font-medium cursor-pointer text-foreground/60 hover:text-foreground/80 transition-colors">Features</Link>
          <Link href={"/"} className="font-medium cursor-pointer text-foreground/60 hover:text-foreground/80 transition-colors">FAQ</Link>
        </nav>
      </div>

      <div className="flex gap-x-1 sm:gap-x-4">
        <div className="flex gap-x-3 items-center">
          <Button className="hidden sm:block">
            Sign up
          </Button>
          <Button variant={"secondary"}>
            Sign in
          </Button>
        </div>
        <div className="border-l ml-2" />
        <div>
          <Button variant={"ghost"} className="px-1 sm:px-2 text-slate-400 hover:text-slate-500">
            <Moon className="w-5 h-5" />
          </Button>
        </div>
      </div>

    </header> 
  )
}


function Hero() {
  return (
    <div className="h-screen">

    </div>
  )
}