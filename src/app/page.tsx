"use client"

import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Github, Moon, Rocket, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


export default function Home() {

  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`${darkMode ? "dark" : ""} transition-colors duration-700`}>
      <HomeHeader 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />
      <main className="pb-20 dark:bg-secondary">
        <Hero />
        <Features />
        <FrequentlyAskedQuestions />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}


function HomeHeader({
  darkMode, setDarkMode
} : {
  darkMode: boolean,
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}) {

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


  function toggleDarkMode() {
    setDarkMode(!darkMode)
  }

  return (
    <header className={`h-24 z-50 bg-white dark:bg-secondary flex justify-between items-center py-3 px-6 sticky top-0 transition-shadow ${isScrolled ? 'shadow' : ''}`}>

      <div className="flex items-center gap-x-10">
        <Link href={"/"} className="dark:text-primary dark:fill-primary">
          <div className="flex gap-x-1 items-center">
            <Icon width={30} height={30} />
            <span className="font-bold">Open Tutor</span>
          </div>
        </Link>
        <nav className="grow hidden sm:flex justify-center gap-x-7">
          <Link href={"/#features"} className="font-medium cursor-pointer text-foreground/60 hover:text-foreground/80 transition-colors">Features</Link>
          <Link href={"/#faq"} className="font-medium cursor-pointer text-foreground/60 hover:text-foreground/80 transition-colors">FAQ</Link>
        </nav>
      </div>

      <div className="flex gap-x-1 sm:gap-x-4">
        <div className="flex gap-x-3 items-center">
          <Link href={"/accounts/signup"}>
            <Button className="hidden sm:block">
              Sign up
            </Button>
          </Link>
          <Link href={"/accounts/signin"}>
            <Button variant={"secondary"}>
              Sign in
            </Button>
          </Link>
        </div>
        <div className="border-l ml-2" />
        <div>
          <Button 
            onClick={toggleDarkMode}
            variant={"ghost"} 
            className="px-1 sm:px-2 text-slate-400 hover:text-slate-500"
          >
            {
              darkMode ? 
              <Moon className="w-5 h-5" />
              :
              <Sun className="w-5 h-5" />
            }
          </Button>
        </div>
      </div>

    </header> 
  )
}


function Hero() {
  return (
    <section className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 px-10 mb-10">

      <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 md:py-12 lg:py-32">
        <h1 className="text-3xl md:text-5xl md:leading-tight font-bold">
          <span className="dark:text-primary">Everything you need to </span>
          <span className=" relative whitespace-nowrap">
            <span className="absolute bg-primary dark:bg-slate-900 opacity-80 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></span>
            <span className="relative text-white">study with AI</span>
          </span>
        </h1>
        <p className="mt-5 leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          More than just a chatbot, take advantage of diverse study tools to learn, grow, and excel. 
        </p>
        <div className="flex gap-x-3 items-center justify-center">
          <Button className="px-12 h-12">
            <Rocket className="w-5 h-5 mr-2" />
            Get started
          </Button>
          <Button className="px-12 h-12" variant={"secondary"}>
            <svg viewBox="0 0 16 16" className="w-5 h-5 mr-2" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View Github
          </Button>
        </div>
      </div>

      <div className="relative">
        <Image 
          src={"/hero-image.svg"} 
          alt="Studying with AI"
          className="px-10"
          fill
        />
      </div>

    </section>
  )
}


function Features() {
  return (
    <section id="features" className="flex flex-col items-center justify-center max-w-5xl mx-auto my-20">
      <SectionHeading>Features</SectionHeading>
      <SectionSubHeading>(Includes screenshots from the actual app!)</SectionSubHeading>
      <div className="flex flex-col gap-6 mt-5 w-full">
        <FeatureItem 
          imageSrc="/features-chat.png"
          imageAlt="chat window"
        >
          <FeatureItemHeading>
            Smart Tutor
          </FeatureItemHeading>
          <FeatureItemSubHeading>
            AI-driven chatbot that provides real-time answers and explanations.
          </FeatureItemSubHeading>
        </FeatureItem>
        <FeatureItem 
          imageSrc="/features-context.png"
          imageAlt="contextual queries"
        >
          <FeatureItemHeading>
            Contextual Help
          </FeatureItemHeading>
          <FeatureItemSubHeading>
            Offers suggestions and hints based on the current topic and user&apos;s progress.
          </FeatureItemSubHeading>
        </FeatureItem>
        <FeatureItem 
          imageSrc="/features-flashcard.png"
          imageAlt="dynamic flashcards"
        >
          <FeatureItemHeading>
            Dynamic flashcards
          </FeatureItemHeading>
          <FeatureItemSubHeading>
            Intelligent flashcards that adjust content based on user performance.
          </FeatureItemSubHeading>
        </FeatureItem>
        <FeatureItem 
          imageSrc="/features-evaluation.png"
          imageAlt="tailor-made progress reports"
        >
          <FeatureItemHeading>
            Progress Reports
          </FeatureItemHeading>
          <FeatureItemSubHeading>
            Detailed analytics on study habits, progress, and areas for improvement. 
          </FeatureItemSubHeading>
        </FeatureItem>
      </div>
    </section>
  )
}


function FeatureItem({ 
  imageSrc, imageAlt, children
} : {
  imageSrc: string, imageAlt: string, children: React.ReactNode
}) {
  return (
    <div className="group w-full grid sm:grid-cols-2 gap-4 justify-center px-10">
      <div className="relative min-h-64 sm:group-even:order-last">
        <Image 
          src={imageSrc}
          width={400}
          height={400}
          alt={imageAlt}
          className="rounded-lg border shadow mx-auto"
        />
      </div>
      <div className="p-12 flex flex-col justify-center gap-3">
        { children }
      </div>
    </div>
  )
}


function FeatureItemHeading({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h3 className="text-lg font-bold dark:text-primary">
      { children }
    </h3>
  )
}


function FeatureItemSubHeading({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <p className="text-muted-foreground">
      { children }
    </p>
  )
}


function FrequentlyAskedQuestions() {
  return (
    <section id="faq" className="flex flex-col items-center justify-center my-20">
      <SectionHeading>Got questions?</SectionHeading>
      <SectionSubHeading>We've got answers.</SectionSubHeading>
      <Accordion type="single" collapsible className="w-full max-w-3xl dark:text-primary">
        <AccordionItem value="item-1">
          <AccordionTrigger>Do I need to be a student to use Open Tutor?</AccordionTrigger>
          <AccordionContent>
            Nope. Anyone can use Open Tutor. All you need to do is be willing to learn. 
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How much does it cost to sign up?</AccordionTrigger>
          <AccordionContent>
            Open Tutor is free! 
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is Open Tutor suitable for all subjects?</AccordionTrigger>
          <AccordionContent>
            Yes, Open Tutor supports a wide range of subjects including math, science, literature, history, and more. Our AI is designed to adapt to different types of content and learning styles.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>I'm a developer. Can I contribute?</AccordionTrigger>
          <AccordionContent>
            Yes please! We are currently open-source and accepting contributions. Please check out our Github.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}


function FinalCTA() {
  return (
    <section className="mt-20 mb-10 mx-auto max-w-2xl">
      <SectionHeading>
        Ready to try it out?
      </SectionHeading>
      <SectionSubHeading>
        Sign up today and experience the power of our platform. Let&apos;s build something great together.
      </SectionSubHeading>
      <div className="text-center">
        <Button className="px-12 h-12">
          <Rocket className="w-5 h-5 mr-2" />
          Get started
        </Button>
      </div>
    </section>
  )
}


function SectionHeading({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h2 className="font-bold text-3xl md:text-5xl text-center mb-6 dark:text-primary">
      { children }
    </h2>
  )
}


function SectionSubHeading({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h2 className="text-muted-foreground text-lg md:text-xl text-center mb-6">
      { children }
    </h2>
  )
}


function Footer() {
  return (
    <footer className="flex items-center gap-x-1 px-6 pt-5 pb-10 dark:bg-secondary dark:text-primary">
      <Icon width={25} height={25} /> 
      Built by <Link href={"/"} className="font-medium underline underline-offset-4">Ifeanyi.</Link>
      The source code is available on <Link href={"/"} className="font-medium underline underline-offset-4">Github.</Link>
    </footer>
  )
}