"use client"

import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import type { Document, DocumentSelection, UserInput } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpenText, GraduationCap, Highlighter, MessageCircleQuestion, Pen } from "lucide-react"
import { toast } from "sonner"
import { createFlashcardsFromText } from "@/services/flashcards"
import { isContained } from "@/utilities/rects"
import { useHighlights } from "@/app/providers"


export function ActionsMenu({ 
  document,
  selection, 
  setUserInput, 
  setSidePanelOpen
} : {
  document: Document,
  selection: DocumentSelection | null,
  setUserInput: Dispatch<SetStateAction<UserInput>>
  setSidePanelOpen: Dispatch<SetStateAction<boolean>>
}) {

  const { highlightsDispatch } = useHighlights()

  function handleExplain() {
    if (selection?.text) {
      setUserInput({
        query: "Explain this.",
        quote: selection.text
      })
      setSidePanelOpen(true)
    }
  }

  function handleDefine() {
    if (selection?.text) {
      setUserInput({
        query: "Define this.",
        quote: selection.text
      })
      setSidePanelOpen(true)
    } 
  }

  function handleQuestion() {
    if (selection?.text) {
      setUserInput({
        query: "",
        quote: selection.text
      })
      setSidePanelOpen(true)
    }
  }

  async function handleCreateFlashcard() {
    if (selection?.text) {
      const response = await createFlashcardsFromText(document.id, selection.text);
      if (response.status >= 300) {
        toast.error("Oops. Something went wrong.")
      } else {
        toast.success("Flashcard created. Easy peasy.")
      }
    }
  }


  async function handleHighlight() {

    const selection = window.getSelection()
    if (!selection) return

    const range = selection.getRangeAt(0)

    const pages = window.document.querySelectorAll(".react-pdf__Page")
    if (!pages) return

    // Find the page that contains the selection
    const page = Array.from(pages).find((page, index) => {
      if (isContained(range.getBoundingClientRect(), page.getBoundingClientRect())) {
        return true
      }
    })
    if (!page) {
      toast.info("Highlighting is only available for single-page selections.")
      return
    }

    const dataPageNumber = page.getAttribute("data-page-number")
    if (!dataPageNumber) {
      toast.error("Oops. Something went wrong. Try again.")
      return
    }
    const pageNumber = parseInt(dataPageNumber)
    
    const { 
      width: pageWidth, height: pageHeight, top: pageTop, left: pageLeft 
    } = page.getBoundingClientRect();
    
    // Get the dimensions of each client rect relative to the page
    const rects = Array.from(range.getClientRects()).map(rect => {
      return {
        left: (rect.left - pageLeft) / pageWidth,
        top: (rect.top - pageTop) / pageHeight,
        width: rect.width / pageWidth,
        height: rect.height / pageHeight
      }
    })
    
    highlightsDispatch({ type: "ADD", highlight: {
      id: Math.random(),
      page_number: pageNumber,
      client_rects: rects,
      text: selection.toString()
    }})

  }

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!selection || selection.text.length === 0) {
      setOpen(false)
    } else if (selection.text.length >= 1024) {
      toast.info("To use document actions, highlight a smaller piece of text.")
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [selection])

  if (!selection || !open) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
      <DropdownMenuTrigger asChild>
        <div style={{
          position: 'absolute',
          top: selection.boundingClientRect.top + window.scrollY,
          left: selection.boundingClientRect.left + window.scrollX,
          width: selection.boundingClientRect.width,
          height: selection.boundingClientRect.height
        }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-40" align="start" sideOffset={10}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleExplain} className="cursor-pointer">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Explain</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDefine} className="cursor-pointer">
            <BookOpenText className="mr-2 h-4 w-4" />
            <span>Define</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleQuestion} className="cursor-pointer">
            <MessageCircleQuestion className="mr-2 h-4 w-4" />
            <span>Ask a question</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCreateFlashcard} className="cursor-pointer">
            <Pen className="mr-2 h-4 w-4" />
            <span>Create flashcard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleHighlight} className="cursor-pointer">
            <Highlighter className="mr-2 h-4 w-4" />
            <span>Highlight</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
