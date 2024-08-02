import { useEffect, useRef, useState, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { type Document, type DocumentMessage, type UserInput } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { createDocumentMessage } from "@/services/messages"
import { EventSourceParserStream } from 'eventsource-parser/stream'
import { toast } from "sonner"
import StyledTooltip from "@/components/shared/styled-tooltip"
import { Button } from "@/components/ui/button"
import { useDocumentMessages } from "@/app/providers"
import { X, CornerDownLeft } from 'lucide-react'


export function DocumentMessageInput({
  document, 
  userInput, 
  setUserInput,
  streaming,
  setStreaming
} : {
  document: Document, 
  userInput: UserInput,
  setUserInput: Dispatch<SetStateAction<UserInput>>,
  streaming: boolean,
  setStreaming: (value: boolean) => void
}) {

  const { documentMessages, documentMessagesDispatch } = useDocumentMessages()
  const ref = useRef<HTMLTextAreaElement>(null)


  async function handleSend() {

    if (streaming || userInput.query.length === 0) {
      return
    }
    
    setStreaming(true)

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

    setUserInput({
      query: "", quote: ""
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
      setStreaming(false)
    })
  }


  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          className="resize-none min-h-0"
          ref={ref}
          rows={1}
        />
        <StyledTooltip text="Send message">
          <Button onClick={handleSend} disabled={streaming || userInput.query.length === 0}>
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
        <div className="flex items-start gap-x-2 bg-secondary px-2 py-3 rounded-md">
          <span className="text-sm">
            &ldquo;{userInput.quote}&rdquo;
          </span>
          <button onClick={handleQuoteCancel}>
            <X size={16} />
          </button>
        </div>
      }
    </>
  )
}