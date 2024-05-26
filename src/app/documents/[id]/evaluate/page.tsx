"use client"

import { useDocuments } from "@/app/providers";
import { Header, HeaderBreadcrumbLink } from "@/components/blocks/header";
import { type Flashcard } from "@/types"
import React, { useState } from "react";


export default function DocumentEvaluationPage({ 
  params 
} : {
  params : { id: string }
}) {

  const { documents, documentsDispatch } = useDocuments()
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

  const flashcard = {
    id: 1,
    referenced_page_number: 10,
    front: "What is the solar system?",
    back: "The solar system is a collection of planets, moons, asteroids, comets, and other objects orbiting the Sun, which is its central star."
  }

  return (
    <main>
      <Header links={headerlinks} />
      <FlashcardContainer>
        <Flashcard flashcard={flashcard} />
      </FlashcardContainer>
    </main>
  )
}


function FlashcardContainer({ 
  children
} : {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center">
      { children }
    </div>
  )
}


function Flashcard({
  flashcard
} : {
  flashcard: Flashcard
}) {

  const [isFlipped, setIsFlipped] = useState(false);

  function handleClick() {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="m-2 group size-96 [perspective:1000px] text-center" onClick={handleClick}>
      <div className={`relative size-full rounded-xl shadow-lg transition-all duration-300 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute inset-0 flex items-center justify-center p-2 [backface-visibility:hidden]">
          {flashcard.front}
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-2 absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {flashcard.back}
        </div>
      </div>
    </div>
  )
}