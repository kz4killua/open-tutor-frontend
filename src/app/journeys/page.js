"use client"


import Link from "next/link"
import { useEffect, useState } from "react"
import { getJourneysRequest } from "../../../api/journeys"
import { FaPlus } from "react-icons/fa6"
import { IoBookSharp } from "react-icons/io5"


export default function JourneysListPage() {

  const [journeys, setJourneys] = useState([])

  // Fetch the list of journeys from the backend
  useEffect(() => {
    getJourneysRequest().then(response => {
      setJourneys(response.data)
    })
  }, [])

  return (
    <main className="w-screen flex flex-col items-center justify-center">

      <div className="w-full max-w-3xl px-5 py-10 grid grid-cols-2 gap-y-5 gap-x-3 justify-items-center">

        <div className="col-span-2 mt-7">
          <SectionHeading>
            Learn something new...
          </SectionHeading>
        </div>

        <CreateJourneyButton />

        <div className="col-span-2 mt-7">
          <SectionHeading>
            ... or pick up where you left off.
          </SectionHeading>
        </div>

        {
          journeys.map(
            journey => <JourneyLink key={journey.id} journey={journey} />
          )
        }
        
      </div>

    </main>
  )
}


function JourneyLink({ journey }) {
  return (
    <Link className="w-full h-16 p-2 max-w-full rounded-lg bg-blue-500 hover:bg-blue-700 flex items-center justify-center gap-x-2" href={`/journeys/${journey.id}`}>
      
      <IoBookSharp className="fill-white" />

      <div className="text-white text-center font-semibold text-lg">
        { journey.title }
      </div>
    </Link>
  )
}


function CreateJourneyButton() {
  return (
    <button className="col-span-2 w-full h-16 max-w-full rounded-lg bg-blue-500 hover:bg-blue-700 flex items-center justify-center">
      <div className="text-white text-center font-semibold text-lg flex items-center justify-center gap-x-3">
        <FaPlus /> Create a new learning journey.
      </div>
    </button>
    )
}


function SectionHeading({ children }) {
  return (
    <h1 className="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">
      { children }
    </h1>
  )
}