"use client"

import { useEffect, useState } from "react"
import { getJourneyRequest, getJourneySectionsRequest } from "../../../../api/journeys"
import Link from "next/link"
import SectionHeading from "@/components/SectionHeading"


export default function JourneyViewPage({ params }) {

  const [journey, setJourney] = useState({})
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

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

    .then(() => {
      setLoading(false)
    })
    
  }, [])


  return (
    <main className="w-full h-full flex flex-col items-center gap-y-5 p-5 pt-10">

      { 
        ((sections.length === 0) && !loading)
        ? 
        <div className="w-full h-full py-10 flex flex-col items-center justify-around">
          <span className="text-2xl font-bold text-cyan-800/[.50]">
            Under construction...
          </span>
        </div>
        :
        <div className="flex flex-col items-center gap-y-5">

          <div className="my-2">
            <SectionHeading>
              Continue learning &quot;{journey.title}&quot;
            </SectionHeading>
          </div>
          
          {
            sections.map(
              (section, i) => <JourneySectionLink key={i} section={section} i={i} />
            ) 
          }
        </div>
      }
    </main>
  )
}


function JourneySectionLink({ section, i }) {
  return (
    <Link className={`w-72 h-16 max-w-full rounded-lg ${section.completed ? 'bg-green-500 hover:bg-green-500' : 'bg-blue-500 hover:bg-blue-700'} flex items-center justify-center`} href={`/journeys/${section.journey}/${section.id}`}>
      <div className="text-white text-center font-semibold text-lg">
        Section { i + 1 }
      </div>
    </Link>
  )
}