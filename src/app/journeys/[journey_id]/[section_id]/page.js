"use client"

import { AiOutlineSend } from "react-icons/ai"
import { GrFormNextLink } from "react-icons/gr"
import { FaSpinner } from "react-icons/fa"

import { Stack, Radio, RadioGroup, Tooltip, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getSectionRequest, queryQuestionAnswerRequest, updateSectionRequest } from "../../../../../api/sections"

import SectionHeading from "@/components/SectionHeading"
import { useRouter } from "next/navigation"


export default function JourneySectionView({ params }) {

  const [section, setSection] = useState(null)

  useEffect(() => {

    getSectionRequest(params.section_id).then(response => {
      setSection(response.data)
    })

  }, [])

  return (
    <main className="w-screen h-screen flex flex-row overflow-hidden overflow-clip">
      {
        section && <>
          <SectionTextAndEvaluation section={section} />
          <SectionChatWindow section={section} />  
        </>
      }
    </main>
  )
}


function ChatInputField({ section, setResponse, setLoading }) {

  const toast = useToast()

  async function handleSendMessage(e) {

    e.preventDefault()

    setLoading(true)

    const question = document.querySelector('textarea#question').value
    const response = await queryQuestionAnswerRequest(section.id, question)

    if (!response.ok) {
      toast({
        title: "The bot didn't respond.",
        description: "Perhaps try refreshing the page.",
        status: "error"
      })
      setLoading(false)
      return
    }

    // Update the AI response
    setResponse(response.data.answer)
    setLoading(false)

  }

  return (
    <form className="" onSubmit={handleSendMessage}>
      
      <div className="flex flex-col bg-white rounded-lg w-full h-full border-2 border-cyan-800/[.25] text-gray-500 focus-within:border-cyan-700/[.75] transition-colors duration-500">

        <textarea className="resize-none p-4 rounded-lg grow text-lg outline-0" id="question" placeholder="Ask me for help." />
        
        <div className="flex justify-between p-3">
          <Tooltip hasArrow label="Send a message">
            <button type="submit">
              <AiOutlineSend size={32} className="fill-cyan-700" />
            </button> 
          </Tooltip>
        </div>

      </div>

    </form>
  )
}


function SectionTextAndEvaluation({ section }) {

  return (
    <div className="w-full p-5 flex flex-col gap-y-5 overflow-y-auto">

      <div className="mb-2 mt-6">
        <SectionHeading>
          Read the text.
        </SectionHeading>
      </div>

      { section && section.content }

      <div className="my-2">
        <SectionHeading>
          Now test your knowledge.
        </SectionHeading>
      </div>

      {
        section.evaluation.evaluation.map((question, i) => 
          <MultipleChoiceQuestion key={i} question={question} />
        )
      }

      <MarkSectionAsCompleteButton section={section} />

    </div>
  )
}


function SectionChatWindow({ section }) {

  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="w-full h-full p-5 overflow-hidden">

      <div className="mb-8 mt-6">
        <SectionHeading>
          Need help? Ask an AI.
        </SectionHeading>
      </div>
      
      <ChatInputField section={section} setResponse={setResponse} setLoading={setLoading} />

      <div className="w-full mt-5 whitespace-pre-wrap">
        { response }
      </div>

      {
        loading &&
        <div className="w-full text-center flex justify-center items-center">
          <FaSpinner className="animate-spin" />
        </div>
      }

    </div>
  )
}


function MultipleChoiceQuestion({ question }) {

  const [selected, setSelected] = useState(null)


  return (
    <div className="mb-3">
      
      <h2 className="font-semibold mb-1">
        { question.question }
      </h2>

      <RadioGroup onChange={setSelected} value={selected} className="mb-4">
        <Stack direction='column'>
          { 
          question.choices.map(
            choice => 
              <Radio key={choice.label} value={ choice.label }>{ choice.text } </Radio>
            ) 
          }
        </Stack>
      </RadioGroup>

      { 
        selected && 
        <div className={`py-2 px-3 ${selected !== question.answer ? 'bg-red-100' : 'bg-green-100'} rounded-md`}>
          <h2 className={`font-semibold ${selected !== question.answer ? 'text-red-700' : 'text-green-700'} `}>
            {
              selected === question.answer ? "Correct" : "Incorrect"
            }
          </h2>
          <div>
            { question.explanation }
          </div>
        </div>
      }

    </div>
  )

}


function MarkSectionAsCompleteButton({ section }) {

  const toast = useToast()
  const router = useRouter()

  async function handleMarkAsComplete() {

    const response = await updateSectionRequest(section.id, true)

    if (response.ok) {
        
      // Provide a confirmation message
      toast({
        title: "Good job.",
        description: "You've completed this section.",
        status: "success"
      })

      // Return to the journey page
      router.push(`/journeys/${section.journey}`)
        
      }

  }

  return (
    <div className="px-3 mb-5">
      <button className="w-full h-16 max-w-full rounded-lg bg-blue-500 hover:bg-blue-700 flex items-center justify-center" onClick={handleMarkAsComplete}>
        <div className="text-white text-center font-semibold text-lg flex items-center justify-center gap-x-3">
          <GrFormNextLink /> Mark this section as complete.
        </div>
      </button>
    </div>
  )
}