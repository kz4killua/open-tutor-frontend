"use client"

import { AiOutlineSend } from "react-icons/ai"
import { Tooltip } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getSectionRequest } from "../../../../../api/sections"


export default function JourneySectionView({ params }) {

  const [section, setSection] = useState(null)

  useEffect(() => {

    getSectionRequest(params.section_id).then(response => {
      setSection(response.data)
    })

  }, [])

  const messages = [
    {"role": "user", "content": "Hello!"},
    {"role": "assistant", "content": "How can I help?"},
  ]

  return (
    <main className="w-screen h-screen flex flex-row">

      <div className="w-full p-3 flex items-center justify-center">
        { section && section.content }
      </div>

      <div className="w-full">

        <div className="w-full p-3 bg-blue-50 whitespace-pre-wrap">
          { messages.map((message, i) => <SectionChatMessage key={i} message={message} /> ) }
        </div>

        <ChatInputField />

      </div>
      
    </main>
  )
}


function ChatInputField() {
  return (
    <form className="bg-white px-5 py-5 rounded-t-xl shadow-lg text-center z-30">
      <div className="flex items-center justify-center">
        
        <textarea resize="none" className="rounded border-black border" rows={1} padding="5" placeholder="Need help? Ask me!" id="query" maxLength={4000} />

        <Tooltip hasArrow label="Send message">
          <div className="flex flex-col">
            <button type="submit">
              <AiOutlineSend />
            </button>
            <span className="text-orange-500">Submit</span>
          </div>
        </Tooltip>

      </div>
    </form>
  )
}


function SectionChatMessage({ message }) {
  return (
    <div className={`w-full p-3 ${message.role === "assistant" ? 'bg-blue-50' : ''} whitespace-pre-wrap`}>
      { message.content }
    </div>
  )
}