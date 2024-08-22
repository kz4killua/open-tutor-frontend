"use client"

import { useState } from "react"
import { type Dispatch, type SetStateAction } from "react"
import { type Document, type UserInput } from "@/types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MessageCircleQuestion, Sparkle } from "lucide-react"
import StyledTooltip from "@/components/shared/styled-tooltip"
import { DocumentMessages } from "@/components/documents/document-messages"
import { DocumentMessageInput } from "@/components/documents/document-message-input"


export function SidePanel({ 
  document, sidePanelOpen, setSidePanelOpen, userInput, setUserInput
} : {
  document: Document,
  sidePanelOpen: boolean,
  setSidePanelOpen: Dispatch<SetStateAction<boolean>>,
  userInput: UserInput,
  setUserInput: Dispatch<SetStateAction<UserInput>>
}) {

  const [streaming, setStreaming] = useState(false)

  return (
    <Sheet open={sidePanelOpen} onOpenChange={(value) => setSidePanelOpen(value)} modal={false}>
      <StyledTooltip text="Ask AI">
        <SheetTrigger asChild>
          <Button variant="outline" className="fixed bg-background bottom-5 right-5 z-50 rounded-full h-auto p-3 shadow-md">
            <MessageCircleQuestion />
          </Button>
        </SheetTrigger>
      </StyledTooltip>
      <SheetContent className="flex flex-col gap-y-0 w-full max-w-full sm:w-[500px] sm:max-w-[500px] p-0">
        <div className="p-6">
          <SheetHeader>
            <SheetTitle className="flex gap-x-1 items-center">
              Chat with AI <Sparkle height={24} className="fill-primary stroke-0" />
            </SheetTitle>
          </SheetHeader>
        </div>
        <DocumentMessages 
          streaming={streaming}
          setStreaming={setStreaming}
        />
        <div className="p-6">
          <DocumentMessageInput 
            document={document} 
            userInput={userInput} 
            setUserInput={setUserInput}
            streaming={streaming}
            setStreaming={setStreaming}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}