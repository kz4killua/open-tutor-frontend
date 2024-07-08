import { useEffect, useRef } from 'react'
import { Monitor, User } from 'lucide-react'
import { useDocumentMessages } from "@/app/providers"
import { type DocumentMessage } from "@/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FormattedMarkdown } from './formatted-markdown'


export function DocumentMessages() {

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
    <ScrollArea className="grow">
      <div className="divide-y" ref={ref}>
        {documentMessages.map(message => 
          <DocumentMessage key={message.id} message={message} />
        )}
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
          <FormattedMarkdown>
            { message.content }
          </FormattedMarkdown>
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

