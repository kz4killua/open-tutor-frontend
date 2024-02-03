"use client"


import Link from "next/link"
import { useEffect, useState } from "react"
import { getJourneysRequest } from "../../../api/journeys"


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

      <div className="w-full max-w-3xl p-5 gap-y-5 flex flex-col items-center justify-center">

        <CreateJourneyButton />

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
    <Link className="w-72 h-16 max-w-full rounded-lg bg-blue-500 flex items-center justify-center" href={`/journeys/${journey.id}`}>
      <div className="text-white text-center font-semibold text-lg">
        { journey.title }
      </div>
    </Link>
  )
}


function CreateJourneyButton() {
  return (
    <div className="w-72 h-16 max-w-full rounded-lg bg-blue-500 flex items-center justify-center">
      <div className="text-white text-center font-semibold text-lg">
        Create Journey
      </div>
    </div>
  )
}