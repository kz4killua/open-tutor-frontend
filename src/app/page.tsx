"use client"

import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SparklesText from "@/components/magicui/sparkles-text";
import clsx from "clsx";
import Container from "@/components/shared/container";
import DarkModeSwitch from "@/components/shared/dark-mode-switch";


export default function Home() {


  return (
    <div className="transition-colors duration-300">
      <Header />
      <main className="pb-20 bg-background">
        <Hero />
        <Features />
        <FrequentlyAskedQuestions />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}


function Header() {

  const [isScrolled, setIsScrolled] = useState(false)

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
    <header className={`z-50 bg-background sticky top-0 transition-shadow ${isScrolled ? 'shadow' : ''}`}>
      <Container className="h-20 py-3 flex justify-between items-center">
        <div className="flex items-center gap-x-10">
          <Link href={"/"}>
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

        <div className="flex gap-x-3 items-center">
          <Link href={"/accounts/signin"}>
            <Button variant={"outline"} className="font-bold">
              Log in
            </Button>
          </Link>
          <Link href={"/accounts/signup"}>
            <Button className="font-bold">
              Sign up
            </Button>
          </Link>
          <DarkModeSwitch />
        </div>
      </Container>
    </header> 
  )
}


function Hero() {
  return (
    <section>
      <Container className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1">

        <div className="flex flex-col justify-center items-center sm:items-start text-center sm:text-left space-y-6 py-6 md:py-12 lg:py-32">
          <h1 className="text-3xl leading-snug md:text-5xl md:leading-tight font-bold">
            <span>Everything you need to </span>
            <br />
            <SparklesText 
              className="text-primary"
              text="study with AI" 
              sparklesCount={5}
            />
            <DoubleUnderline className="mx-auto sm:mx-0 max-w-[200px] sm:max-w-[300px]" />
          </h1>
          <p className="mt-5 leading-normal sm:text-xl sm:leading-8">
            More than just a chatbot, take advantage of diverse AI-powered study tools to crush your study goals.
          </p>
          <div className="flex gap-5 sm:gap-10">
            <Link href={"/accounts/signup"}>
              <Button className="px-3 sm:px-6 md:px-12 h-12">
                <Rocket className="w-5 h-5 mr-2" />
                Get started
              </Button>
            </Link>
            <Link href={"https://github.com/kz4killua/open-tutor-frontend"}>
              <Button className="px-3 sm:px-6 md:px-12 h-12" variant={"secondary"}>
                <svg viewBox="0 0 16 16" className="w-5 h-5 mr-2" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View Github
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative min-h-40">
          <Image 
            src={"/hero-image.svg"} 
            alt="Studying with AI"
            className="px-10"
            fill
          />
        </div>
      </Container>
    </section>
  )
}


function Features() {
  return (
    <section id="features">
      <Container className="flex flex-col items-center justify-center pt-0 sm:pt-24 mb-20">
        <SectionHeading>Power-packed with <span className="text-primary">features</span></SectionHeading>
        <SectionSubHeading>Make the most of your study sessions.</SectionSubHeading>

        <div className="flex flex-col gap-16 mt-10">
          <FeatureItem 
            imageSrc="/features-ai.gif"
            imageAlt=""
          >
            <FeatureItemHeading>
              AI assistance whenever you need it
            </FeatureItemHeading>
            <FeatureItemText>
              Get explanations, answers to questions, and much more with our powerful AI tutor.
            </FeatureItemText>
          </FeatureItem>
          <FeatureItem 
            imageSrc="/features-flashcards.gif"
            imageAlt=""
          >
            <FeatureItemHeading>
              Intelligent flashcards that get you
            </FeatureItemHeading>
            <FeatureItemText>
              Create flashcards at the click of a button. Flashcards can adjust to help you focus on your weaknesses.
            </FeatureItemText>
          </FeatureItem>
          <FeatureItem 
            imageSrc="/features-feedback.gif"
            imageAlt=""
          >
            <FeatureItemHeading>
              Detailed progress reports
            </FeatureItemHeading>
            <FeatureItemText>
              Get detailed feedback on your performance as well as suggested study areas.
            </FeatureItemText>
          </FeatureItem>
        </div>
      </Container>
    </section>
  )
}


function FeatureItem({ 
  imageSrc, imageAlt, children
} : {
  imageSrc: string, imageAlt: string, children: React.ReactNode
}) {
  return (
    <div className="group w-full grid sm:grid-cols-2 gap-x-4 gap-y-12 justify-center">
      <div className="relative flex items-center min-h-64 sm:group-even:order-last">
        <Image 
          unoptimized
          src={imageSrc}
          width={1200}
          height={1200}
          alt={imageAlt}
          className="rounded-2xl border-2 border-primary shadow mx-auto aspect-video object-cover"
        />
      </div>
      <div className="sm:py-12 sm:group-odd:pl-12 group-even:pr-12 flex flex-col text-left justify-center gap-3">
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
    <h3 className="text-2xl font-bold">
      { children }
    </h3>
  )
}


function FeatureItemText({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <p className="text-lg">
      { children }
    </p>
  )
}


function DoubleUnderline(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1283 132"
      fill="#0D9488"
      {...props}
    >
      <path d="M1282.46 5.79c-.91-3.88-5.18-6.65-9.04-5.54-104.37 29.02-193.78 56.87-361.6 74.53-268.41 28.16-539.6 14.6-803.08-26.38C94.9 47.97-.34 26.24.08 41.38c-1.56 14.21 19.47 12.91 29.6 17.24 32.82 8.6 66.1 15.33 99.4 21.81 238.99 44.43 482.98 55.29 725.63 49.01 92.37-4.11 185.68-9.96 275.51-33.09 18.68-6.31 42.79-9.21 55.18-25.89 6.76-13.28-12.41-21.16-13.83-6.12-17.69 11.67-39.31 15.61-59.45 21.34-114.56 25.18-245.31 30.46-361.99 30.36-191.39.45-383.13-10.13-572-42.21 277.31 36.42 560.77 44.96 837.82 2.23 104.21-15.4 195.11-42.74 260.97-61.22a7.57 7.57 0 005.54-9.05z" />
    </svg>
  )
}


function FrequentlyAskedQuestions() {
  return (
    <section id="faq" className="px-7 pt-0 sm:pt-24 flex flex-col items-center justify-center mb-20">
      <SectionHeading>Got <span className="text-primary">questions</span>?</SectionHeading>
      <SectionSubHeading>We&apos;ve got answers.</SectionSubHeading>
      <Accordion type="single" collapsible className="w-full max-w-3xl text-left">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">Do I need to be a student to use Open Tutor?</AccordionTrigger>
          <AccordionContent className="text-base">
            Nope. Anyone can use Open Tutor. All you need to do is be willing to learn. 
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">How much does it cost to sign up?</AccordionTrigger>
          <AccordionContent className="text-base">
            Open Tutor is free! 
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">Is Open Tutor suitable for all subjects?</AccordionTrigger>
          <AccordionContent className="text-base">
            Yes, Open Tutor supports a wide range of subjects including math, science, literature, history, and more. Our AI is designed to adapt to different types of content and learning styles.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">I&apos;m a developer. Can I contribute?</AccordionTrigger>
          <AccordionContent className="text-base">
            Yes please! We are currently open-source and accepting contributions. Please check out our Github.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}


function CTA() {
  return (
    <section className="pt-0 sm:pt-24 mb-10">
      <Container>
        <div className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-16 md:py-20">
          <SectionHeading>
            Well, what are you waiting for?
          </SectionHeading>
          <SectionSubHeading>
            Sign up today and let&apos;s up your study game.
          </SectionSubHeading>
          <div className="text-center">
            <Link href={"/accounts/signup"}>
              <Button className="bg-background dark:bg-foreground hover:brightness-90 text-primary px-12 h-12">
                <Rocket className="w-5 h-5 mr-2" />
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}


function SectionHeading({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h2 className="font-bold text-2xl md:text-4xl text-center mb-6">
      { children }
    </h2>
  )
}


function SectionSubHeading({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <h2 className={clsx("text-lg md:text-xl text-center mb-6", className)}>
      { children }
    </h2>
  )
}


function Footer() {
  return (
    <footer>
      <Container className="flex flex-col sm:flex-row items-center gap-x-1 gap-y-4 pt-5 pb-10">
        <Icon width={25} height={25} /> 
        <div className="text-center sm:text-left">  
          Made with ❤️ by <Link href={"https://www.ifeanyiobinelo.com/"} target="_blank" className="text-primary font-medium hover:underline underline-offset-4">Ifeanyi</Link>.
          The source code is available on <Link href={"https://github.com/kz4killua/open-tutor-frontend"} target="_blank" className="text-primary font-medium hover:underline underline-offset-4">Github</Link>.
        </div>
      </Container>
    </footer>
  )
}