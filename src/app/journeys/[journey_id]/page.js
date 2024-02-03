"use client"

import { useEffect, useState } from "react"
import { getJourneyRequest, getJourneySectionsRequest } from "../../../../api/journeys"


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
          (section, i) => <JourneySectionLink section={section} i={i} />
        ) 
      }
    </main>
  )
}


function JourneySectionLink({ section, i }) {
  return (
    <div className="w-72 h-16 max-w-full rounded-lg bg-blue-500 flex items-center justify-center">
      <div className="text-white text-center font-semibold text-lg">
        Section { i + 1 }
      </div>
    </div>
  )
}