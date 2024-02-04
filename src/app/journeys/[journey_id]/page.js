"use client"

import { useEffect, useState } from "react"
import { getJourneyRequest, getJourneySectionsRequest } from "../../../../api/journeys"
import Link from "next/link"


export default function JourneyViewPage({ params }) {

  const [journey, setJourney] = useState({})
  const [sections, setSections] = useState([])

  // Fetch the journey and its sections
  useEffect(() => {
    
    getJourneyRequest(params.journey_id).then(response => {
      setJourney(response.data)
    })

    .then(() => {
      getJourneySectionsRequest(params.journey_id).then(response => {
        setSections(response.data)
      })
    })
    
  }, [])

  return (
    <main className="w-screen h-screen flex flex-col gap-y-5 p-5">
      { 
        sections.map(
          (section, i) => <JourneySectionLink key={i} section={section} i={i} />
        ) 
      }
    </main>
  )
}


function JourneySectionLink({ section, i }) {
  return (
    <Link className="w-72 h-16 max-w-full rounded-lg bg-blue-500 flex items-center justify-center" href={`/journeys/${section.journey}/${section.id}`}>
      <div className="text-white text-center font-semibold text-lg">
        Section { i + 1 }
      </div>
    </Link>
  )
}