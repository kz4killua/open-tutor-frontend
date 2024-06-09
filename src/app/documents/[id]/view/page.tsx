"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import { type Dispatch, type SetStateAction } from "react"
import { HeaderBreadcrumbLink, Header, HeaderHeight } from "@/components/shared/header"
import { type Document, type DocumentMessage, type DocumentSelection } from "@/types"
import { DocumentViewer } from "@/components/shared/viewer/document-viewer"
import { useDocumentMessages, useDocuments } from "@/app/providers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { BookOpenText, CornerDownLeft, GraduationCap, MessageCircleQuestion, Monitor, Send, User, X } from "lucide-react"
import { createDocumentMessage } from "@/services/messages"
import { EventSourceParserStream } from 'eventsource-parser/stream'
import { toast } from "sonner"
import StyledTooltip from "@/components/shared/styled-tooltip"


interface UserInput {
  query: string;
  quote: string;
}


export default function DocumentViewPage({ 
  params 
} : {
  params : { id: string }
}) {

  const { documents, documentsDispatch } = useDocuments()
  const document = documents.find(item => item.id.toString() === params.id)
  const [selection, setSelection] = useState<DocumentSelection | null>(null)
  const [userInput, setUserInput] = useState<UserInput>({ 
    query: "", quote: "" 
  })
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  
  
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
      name: "View",
      href: window.location.href
    })
  }


  return (
    <div className="flex flex-col">
      <Header links={headerlinks} />
      { document &&
        <div>
          <main>
            <ActionsMenu 
              selection={selection}  
              setUserInput={setUserInput} 
              setSidePanelOpen={setSidePanelOpen} 
            />
            <DocumentViewer 
              document={document} 
              selection={selection} 
              setSelection={setSelection} 
            />
            <SidePanel 
              sidePanelOpen={sidePanelOpen} 
              setSidePanelOpen={setSidePanelOpen} 
              document={document} userInput={userInput} 
              setUserInput={setUserInput} 
            />
          </main>
        </div>
      }
    </div>
  )
}


function SidePanel({ 
  document, sidePanelOpen, setSidePanelOpen, userInput, setUserInput
} : {
  document: Document,
  sidePanelOpen: boolean,
  setSidePanelOpen: Dispatch<SetStateAction<boolean>>,
  userInput: UserInput,
  setUserInput: Dispatch<SetStateAction<UserInput>>
}) {

  return (
    <Sheet open={sidePanelOpen} onOpenChange={(value) => setSidePanelOpen(value)} modal={false}>
      <StyledTooltip text="Ask AI">
        <SheetTrigger asChild>
          <Button variant="outline" className="fixed bottom-5 right-5 z-50 rounded-full h-auto p-3 shadow-md">
            <MessageCircleQuestion />
          </Button>
        </SheetTrigger>
      </StyledTooltip>
      <SheetContent className="flex flex-col w-full max-w-full sm:w-[500px] sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Chat with an AI.</SheetTitle>
        </SheetHeader>
        <DocumentMessages />
        <DocumentMessageInput document={document} userInput={userInput} setUserInput={setUserInput} />
      </SheetContent>
    </Sheet>
  )
}


function ActionsMenu({ 
  selection, setUserInput, setSidePanelOpen
} : {
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


  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (selection?.text) {
      if (selection.text.length >= 1024) {
        toast.info("To use document actions, highlight a smaller piece of text.")
      } else {
        setOpen(true)
      }
    }
  }, [selection])

  return (
    <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
      <DropdownMenuTrigger asChild>
        <div style={{
          position: 'absolute',
          top: selection ? selection.boundingClientRect.top + window.scrollY : 0,
          left: selection ? selection.boundingClientRect.left + window.scrollX : 0,
          width: selection ? selection.boundingClientRect.width : 0,
          height: selection ? selection.boundingClientRect.height : 0
        }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" sideOffset={10}>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function DocumentMessages() {

  const { documentMessages, documentMessagesDispatch } = useDocumentMessages()
  const ref = useRef<HTMLDivElement>(null)

  // Always start with the most recent messages (at the bottom).
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView(false)
    }
  }, [])

  return (
    <ScrollArea className="grow">
      <div className="divide-y" ref={ref}>
        { documentMessages.map(message => 
          <DocumentMessage key={message.id} message={message} />
        ) }
      </div>
    </ScrollArea>
  )
}


function DocumentMessage({
  message
} : {
  message: DocumentMessage
}) {
  return (
    <div className="flex flex-row gap-x-4 py-5">
      <div>
        { message.role === 'user' ? <DocumentMessageUserIcon /> : <DocumentMessageAssistantIcon /> }
      </div>
      <div className="w-full">
        { message.role === 'user' && message.quote &&
          <div className="mb-1">
            <span className="text-sm text-slate-500">
              &ldquo;{message.quote}&rdquo;
            </span>
          </div>
        }
        <div>
          <span className="whitespace-pre-wrap">
            { message.content }
          </span>
        </div>
      </div>
    </div>
  )
}


function DocumentMessageUserIcon() {
  return (
    <div className="p-2 rounded shadow">
      <User size={15} />
    </div>
  )
}


function DocumentMessageAssistantIcon() {
  return (
    <div className="p-2 rounded shadow bg-gray-800 text-white">
      <Monitor size={15} />
    </div>
  )
}


function DocumentMessageInput({
  document, userInput, setUserInput
} : {
  document: Document, 
  userInput: UserInput,
  setUserInput: Dispatch<SetStateAction<UserInput>>
}) {

  const { documentMessages, documentMessagesDispatch } = useDocumentMessages()
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)


  async function handleClick() {
    
    setLoading(true)

    const userMessage: DocumentMessage = {
      id: -1, 
      role: 'user', 
      content: userInput.query, 
      quote: userInput.quote,
      created: new Date().toISOString()
    }
    const assistantMessage: DocumentMessage = {
      id: -2, 
      role: 'assistant', 
      content: '',
      created: new Date().toISOString()
    }

    documentMessagesDispatch({
      type: "ADD", documentMessage: userMessage
    })
    documentMessagesDispatch({
      type: "ADD", documentMessage: assistantMessage
    })
    
    createDocumentMessage(document.id, userMessage.content, userMessage.quote)
    .then(response => {
      if (!response.ok) {
        throw "Oops. We couldn't send your message. Try again."
      }
      return response
    })
    .then(async response => {
      if (response.body) {

        // Use the eventsource-parser library to parse SSE responses
        const stream = response.body
          .pipeThrough(new TextDecoderStream())
          .pipeThrough(new EventSourceParserStream())
        
        const reader = stream.getReader()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const data = JSON.parse(value.data)
          userMessage.id = data.user_message_id;
          assistantMessage.id = data.assistant_message_id;
          assistantMessage.content += data.token;

          documentMessagesDispatch({
            type: "UPDATE", documentMessage: userMessage
          })
          documentMessagesDispatch({
            type: "UPDATE", documentMessage: assistantMessage
          })
        }
      }
    })
    .then(() => {
      setUserInput({
        query: "", quote: ""
      })
    })
    .catch((error) => {

      toast.error(error)

      documentMessagesDispatch({
        type: "REMOVE", id: userMessage.id
      })
      documentMessagesDispatch({
        type: "REMOVE", id: assistantMessage.id
      })

    })
    .finally(() => {
      setLoading(false)
    })
  }


  function adjustTextAreaHeight() {    
    if (ref.current) {

      ref.current.style.height = 'auto';

      const maxRows = 5
      const style = window.getComputedStyle(ref.current)
      const lineHeight = parseInt(style.lineHeight)
      const maxHeight = lineHeight * maxRows;

      if (ref.current.scrollHeight > maxHeight) {
        ref.current.style.height = `${maxHeight}px`
        ref.current.style.overflowY = 'scroll'
      } else {
        ref.current.style.height = `${ref.current.scrollHeight}px`
        ref.current.style.overflowY = 'hidden'
      }
    }
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setUserInput({
      ...userInput, query: e.target.value
    })
    adjustTextAreaHeight()
  }

  useEffect(() => {
    adjustTextAreaHeight();
  }, []);


  return (
    <div className="grid w-full gap-2">
      <DocumentMessageInputQuote userInput={userInput} setUserInput={setUserInput} />
      <div className="flex items-end justify-center gap-x-2">
        <Textarea 
          placeholder="Type your message here." 
          value={userInput.query}
          onChange={handleChange}
          className="resize-none min-h-0"
          ref={ref}
          rows={1}
        />
        <StyledTooltip text="Send message">
          <Button onClick={handleClick}>
            <CornerDownLeft />
          </Button>
        </StyledTooltip>
      </div>
    </div>
  )
}


function DocumentMessageInputQuote({ 
  userInput, setUserInput
} : {
  userInput: UserInput,
  setUserInput: Dispatch<SetStateAction<UserInput>>
}) {

  function handleQuoteCancel() {
    setUserInput({
      ...userInput, quote: ""
    })
  }

  return (
    <>
      { userInput.quote.length !== 0 &&    
        <div className="flex items-start gap-x-2 bg-gray-100 px-2 py-3 rounded-md">
          <span className="text-sm text-slate-500">
            &ldquo;{userInput.quote}&rdquo;
          </span>
          <button onClick={handleQuoteCancel}>
            <X size={16} className="text-slate-500" />
          </button>
        </div>
      }
    </>
  )
}