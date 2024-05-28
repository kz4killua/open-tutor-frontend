"use client"

import { useDocuments } from "@/app/providers";
import { Header, HeaderBreadcrumbLink } from "@/components/blocks/header";
import { Button } from "@/components/ui/button";
import { getFlashcardsList } from "@/services/flashcards";
import { type Flashcard } from "@/types"
import { shuffleArray } from "@/utilities/arrays";
import { Check, ChevronLeft, ChevronRight, RefreshCcw, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import Lottie from "lottie-react";
import seeSawAnimation from "@/lotties/see-saw.json"


export default function DocumentEvaluationPage({ 
  params 
} : {
  params : { id: string }
}) {

  const { documents, documentsDispatch } = useDocuments()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
  const [activeFlashcard, setActiveFlashcard] = useState(0)
  const [loading, setLoading] = useState(true)

  const document = documents.find(item => item.id.toString() === params.id)

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
  }, [documents])


  useEffect(() => {
    if (carouselApi) {
      setActiveFlashcard(carouselApi.selectedScrollSnap() + 1)

      carouselApi.on("select", () => {
        setActiveFlashcard(carouselApi.selectedScrollSnap() + 1)
      })
    }
  }, [carouselApi])


  function onCorrectAnswer() {
    carouselApi?.scrollNext()
  }

  function onWrongAnswer() {
    carouselApi?.scrollNext()
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header links={headerlinks} />
        {
          loading 
          ?
          <div className="grow flex flex-col items-center justify-center">
            <LoadingAnimation>
              <div className="font-bold text-gray-700 text-center">
                Loading...
              </div>
            </LoadingAnimation>
          </div>
          :
          <div className="my-5">
            <Carousel setApi={setCarouselApi}>
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


function LoadingAnimation({
  children
} : {
  children?: React.ReactNode
}) {

  const [loading, setLoading] = useState(true)

  return (
    <div>
      <Lottie 
        animationData={seeSawAnimation} 
        onDOMLoaded={() => setLoading(false)}
      />
      { !loading && children }
    </div>
  )
}