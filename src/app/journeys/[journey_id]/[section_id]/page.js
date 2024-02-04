"use client"

import { AiOutlineSend } from "react-icons/ai"
import { GrFormNextLink } from "react-icons/gr"

import { Stack, Radio, RadioGroup, Tooltip } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { getSectionRequest } from "../../../../../api/sections"

import SectionHeading from "@/components/SectionHeading"


export default function JourneySectionView({ params }) {

  const [section, setSection] = useState(null)

  useEffect(() => {

    getSectionRequest(params.section_id).then(response => {
      setSection(response.data)
    })

  }, [])

  return (
    <main className="w-screen h-screen flex flex-row overflow-hidden overflow-clip">
      <SectionTextAndEvaluation section={section} />
      <SectionChatWindow section={section} />  
    </main>
  )
}


function ChatInputField() {
  return (
    <form className="">
      
      <div className="flex flex-col bg-white rounded-lg w-full h-full border-2 border-cyan-800/[.25] text-gray-500 focus-within:border-cyan-700/[.75] transition-colors duration-500">

        <textarea className="resize-none p-4 rounded-lg grow text-lg outline-0" id="sandbox-input" placeholder="Ask me for help." />
        
        <div className="flex justify-between p-3">
          <Tooltip hasArrow label="Send a message">
            <button>
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

      <MultipleChoiceQuestion />
      <MultipleChoiceQuestion />
      <MultipleChoiceQuestion />
      <MultipleChoiceQuestion />
      <MultipleChoiceQuestion />

      <MarkSectionAsCompleteButton />

    </div>
  )
}


function SectionChatWindow({ section }) {

  const [response, setResponse] = useState('')

  return (
    <div className="w-full h-full p-5 overflow-hidden">

      <div className="mb-8 mt-6">
        <SectionHeading>
          Need help? Ask an AI.
        </SectionHeading>
      </div>
      
      <ChatInputField />

      <div className="w-full mt-5 whitespace-pre-wrap">
        { response }
      </div>

    </div>
  )
}


function MultipleChoiceQuestion() {

  const [selected, setSelected] = useState(null)

  const question = {
    "question": "What is the relationship between force and mass? ",
    "choices": [
        {"label": "A", "text": "Force is the product of mass and acceleration."},
        {"label": "B", "text": "Force is the sum of mass and acceleration."},
        {"label": "C", "text": "Force is the difference between mass and acceleration."},
        {"label": "D", "text": "There is no relationship between force and mass."}
    ],
    "answer": "A",
    "explanation": "Newton's second law states that F = m * a."
  }

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
              <Radio value={ choice.label }>{ choice.text } </Radio>
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


function MarkSectionAsCompleteButton() {
  return (
    <div className="px-3 mb-5">
      <button className="w-full h-16 max-w-full rounded-lg bg-blue-500 hover:bg-blue-700 flex items-center justify-center">
        <div className="text-white text-center font-semibold text-lg flex items-center justify-center gap-x-3">
          <GrFormNextLink /> Mark this section as complete.
        </div>
      </button>
    </div>
  )
}