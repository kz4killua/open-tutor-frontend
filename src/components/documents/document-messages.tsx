import { useEffect, useRef } from 'react'
import { Loader, Monitor, User } from 'lucide-react'
import { useDocumentMessages } from "@/app/providers"
import { type DocumentMessage } from "@/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as RadixScrollArea from "@radix-ui/react-scroll-area"
import { FormattedMarkdown } from './formatted-markdown'


export function DocumentMessages({
  streaming, 
  setStreaming
} : {
  streaming: boolean,
  setStreaming: (value: boolean) => void
}) {

  const { documentMessages, documentMessagesDispatch } = useDocumentMessages()
  const ref = useRef<HTMLDivElement>(null)

  // Always start with the most recent messages (at the bottom).
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView(false)
    }
  }, [])

  // Scroll to the bottom when new messages are added.
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [documentMessages])

  return (
    <RadixScrollArea.Root className='grow relative overflow-hidden'>
      {/* https://github.com/radix-ui/primitives/issues/926#issuecomment-1447283516 */}
      <RadixScrollArea.Viewport className="h-full w-full rounded-[inherit] [&>div]:!block overscroll-contain">
        <div className='divide-y px-6 pr-[15px]'>
          {documentMessages.map((message, index) => 
            <DocumentMessage 
              key={message.id} 
              message={message} 
              streaming={streaming && index === documentMessages.length - 1}
            />
          )}
        </div>
        <div ref={ref} />
      </RadixScrollArea.Viewport>
      <RadixScrollArea.ScrollAreaScrollbar orientation="vertical" className="h-full w-2.5 border-l border-l-transparent p-[1px]">
        <RadixScrollArea.ScrollAreaThumb className="relative flex-1 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer" />
      </RadixScrollArea.ScrollAreaScrollbar>
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  )
}


function DocumentMessage({
  message, 
  streaming
} : {
  message: DocumentMessage,
  streaming: boolean
}) {
  return (
    <div className="flex flex-row gap-x-4 py-5">
      <div>
        { message.role === 'user' ? <DocumentMessageUserIcon /> : <DocumentMessageAssistantIcon /> }
      </div>
      <div className="w-full overflow-x-auto">
        { message.role === 'user' && message.quote &&
          <div className="mb-1">
            <span className="text-sm">
              &ldquo;{message.quote}&rdquo;
            </span>
          </div>
        }
        <div className='overflow-x-auto'>
          <FormattedMarkdown>
            { message.content }
          </FormattedMarkdown>
          
          {
            streaming && message.role === 'assistant' && 
            <DocumentMessageStreamingIcon />
          }          
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
    <div className="p-2 rounded shadow bg-primary text-white">
      <Monitor size={15} />
    </div>
  )
}


function DocumentMessageStreamingIcon() {
  return (
    <div className='h-7 flex items-center justify-center'>
      <Loader size={15} className='animate-spin'/>
    </div>
  )
}