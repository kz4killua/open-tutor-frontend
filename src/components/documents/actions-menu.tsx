"use client"

import { useEffect, useState } from "react"
import { type Dispatch, type SetStateAction } from "react"
import type { Document, DocumentSelection, UserInput } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpenText, GraduationCap, MessageCircleQuestion, Pen } from "lucide-react"
import { toast } from "sonner"
import { createFlashcardsFromText } from "@/services/flashcards"


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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
