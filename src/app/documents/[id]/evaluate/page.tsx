"use client"

import { useDocuments } from "@/app/providers";
import { Header, HeaderBreadcrumbLink } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getEvaluationFeedback, getFlashcardsList } from "@/services/flashcards";
import { type Document, type Flashcard } from "@/types"
import { removeDuplicates, shuffleArray } from "@/utilities/arrays";
import { Check, CheckIcon, RefreshCcw, TrophyIcon, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Lottie from "lottie-react";
import seeSawAnimation from "@/lotties/see-saw.json"


interface UserAnswers
{
  correct: number[],
  wrong: number[]
}


export default function DocumentEvaluationPage({ 
  params 
} : {
  params : { id: string }
}) {

  const { documents, documentsDispatch } = useDocuments()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const userAnswers = useRef<UserAnswers>({
    correct: [], wrong: []
  })
  const [quizComplete, setQuizComplete] = useState(false)

  const document = documents.find(
    item => item.id.toString() === params.id
  )

  const headerlinks: HeaderBreadcrumbLink[] = [
    {
      name: "Documents",
      href: "/documents"
    }
  ]

  if (document) {
    headerlinks.push({
      name: document.name,
      href: `/documents/${params.id}`
    })
    headerlinks.push({
      name: "Evaluate",
      href: window.location.href
    })
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header links={headerlinks} />
      {
        quizComplete ?
        <EvaluationReport 
          document={document}
          userAnswers={userAnswers} 
          flashcards={flashcards}
        />
        :
        <EvaluationQuiz 
          document={document}
          userAnswers={userAnswers}
          flashcards={flashcards}
          setFlashcards={setFlashcards}
          setQuizComplete={setQuizComplete}
        />
      }
    </div>
  )
}


function EvaluationReport({
  userAnswers,
  flashcards,
  document
} : {
  userAnswers: React.MutableRefObject<UserAnswers>,
  flashcards: Flashcard[],
  document: Document | undefined
}) {

  const [feedback, setFeedback] = useState<string[]>()

  const percentage = userAnswers.current.correct.length / (
    userAnswers.current.correct.length + 
    userAnswers.current.wrong.length
  ) * 100

  useEffect(() => {

    if (document === undefined) {
      return
    }

    getEvaluationFeedback(
      document.id,
      userAnswers.current.correct, 
      userAnswers.current.wrong
    )
    .then(response => {
      if (response.status !== 200) {
        throw new Error("Failed to get evaluation feedback.")
      }
      setFeedback(response.data.feedback)
    })
    .catch(error => {
      toast.error(error.message)
    })
  }, [])

  return (
    <main className="grow flex flex-col items-center justify-center gap-8">
      <Card className="w-full max-w-md p-6">

        <CardHeader className="flex flex-col items-center gap-2">
          <TrophyIcon className="w-12 h-12 text-black" />
          <CardTitle className="text-2xl font-bold">
            {
              percentage > 50 ?
              "Great job!"
              :
              "You're making progress."
            }
          </CardTitle>
          <CardDescription>
            You scored {percentage}% on the quiz.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">
              Recommendations
            </div>
          </div>

          <ul className="space-y-2 text-sm text-black">
            {
              feedback !== undefined ?
              feedback.map((item, index) => 
                <li key={index} className="flex items-center">
                  <CheckIcon className="shrink-0 w-4 h-4 mr-2 text-green-500" />
                  {item}
                </li>
              )
              :
              Array.from({ length: 3 }, (_, i) => i).map(item => 
                <li key={item}>
                  <Skeleton className="h-5 w-full rounded-lg" />
                </li>
              )
            }
          </ul>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Link
            href="/documents"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-950 disabled:pointer-events-none disabled:opacity-50"
          >
            Return to documents
          </Link>
        </CardFooter>

      </Card>
    </main>
  )
}


function EvaluationQuiz({ 
  document, userAnswers, flashcards, setFlashcards, setQuizComplete
} : {
  document: Document | undefined,
  userAnswers: React.MutableRefObject<UserAnswers>,
  flashcards: Flashcard[],
  setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>,
  setQuizComplete: React.Dispatch<React.SetStateAction<boolean>>
}) {

  const [loading, setLoading] = useState(true)
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0)
  const { documents, documentsDispatch } = useDocuments()


  useEffect(() => {

    const fetchFlashcards = async () => {
      if (document) {

        const MAX_FLASHCARDS = 10
        let list: Flashcard[] = []

        let pages = Array.from({ length: document.page_count }, (_, i) => i + 1)
        pages = shuffleArray(pages)

        for (const page of pages) {

          const response = await getFlashcardsList(document.id, page)
          if (response.status === 200) {
            list = [...list, ...response.data]
          }

          // Limit the number of flashcards that are fetched
          if (list.length >= MAX_FLASHCARDS) {
            list = list.slice(0, MAX_FLASHCARDS)
            break
          }
        }

        setFlashcards(list)
        setLoading(false)
      }
    }

    fetchFlashcards()
  }, [documents, document, setFlashcards])


  useEffect(() => {
    if (carouselApi) {
      setActiveFlashcardIndex(carouselApi.selectedScrollSnap())

      carouselApi.on("select", () => {
        setActiveFlashcardIndex(carouselApi.selectedScrollSnap())
      })
    }
  }, [carouselApi])


  function onCorrectAnswer() {
    userAnswers.current.correct.push(
      flashcards[activeFlashcardIndex].id
    )
    scrollToNextQuestion()
  }

  function onWrongAnswer() {
    userAnswers.current.wrong.push(
      flashcards[activeFlashcardIndex].id
    )
    scrollToNextQuestion()
  }

  function scrollToNextQuestion() {
    if (carouselApi?.canScrollNext()) {
      carouselApi.scrollNext()
    } else if (!loading) {
      triggerEvaluationReport()
    }
  }

  function triggerEvaluationReport() {
    toast.success("You've reached the end of the quiz!")
    setQuizComplete(true)
  }

  return (
    <main>
      {
        <LoadingSuspense loading={loading}>
          <div className="my-5">
            <Carousel 
              setApi={setCarouselApi}
              opts={{
                dragFree: true,
                watchDrag: false
              }}
            >
              <CarouselContent>
                {flashcards.map(flashcard => 
                  <CarouselItem key={flashcard.id}>
                    <div className="w-full flex justify-center item-center">
                      <Flashcard 
                        flashcard={flashcard} 
                        onCorrectAnswer={onCorrectAnswer}
                        onWrongAnswer={onWrongAnswer}
                      />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
          </div>
        </LoadingSuspense>        
      }
    </main>
  )
}


function Flashcard({
  flashcard, onCorrectAnswer, onWrongAnswer
} : {
  flashcard: Flashcard, 
  onCorrectAnswer: () => void,
  onWrongAnswer: () => void
}) {

  const [isFlipped, setIsFlipped] = useState(false);

  function handleClick() {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="w-full flex flex-col items-center gap-5 px-5">

      <div className="group w-full max-w-2xl h-96 [perspective:1000px] text-center" onClick={handleClick}>
        <div className={`relative size-full border rounded-xl shadow-lg transition-all duration-300 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          <div className="absolute inset-0 flex items-center justify-center p-2 [backface-visibility:hidden]">
            {flashcard.front}
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-2 absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {flashcard.back}
          </div>
        </div>
      </div>

      <div>
        {
          isFlipped ?
          <div className="flex gap-2">
            <Button onClick={onCorrectAnswer}>
              <Check size={16} />
            </Button>
            <Button onClick={onWrongAnswer}>
              <X size={16} />
            </Button>
          </div>
          :
          <div>
            <Button onClick={handleClick}>
              <RefreshCcw size={16} className="mr-2" />
              Show Answer
            </Button>
          </div>
        }
      </div>
    </div>
  )
}


function LoadingSuspense({
  loading, children
} : {
  loading: boolean,
  children?: React.ReactNode
}) {

  return (
    <>
    {
      loading ?
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Lottie 
            animationData={seeSawAnimation} 
          />
          <div className="font-semibold sm:text-lg text-gray-700">
            Hang on. We're preparing a quiz for you.
          </div>
        </div>
      </div>
      :
      <>
        { children }
      </>
    }
    </>
  )
}