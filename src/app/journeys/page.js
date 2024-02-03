import Link from "next/link"


export default function JourneysPage() {

  const journeys = [
    {"id": 1, "title": "Artificial Intelligence"},
    {"id": 2, "title": "Artificial Intelligence"},
    {"id": 3, "title": "Artificial Intelligence"},
    {"id": 3, "title": "Artificial Intelligence"},
    {"id": 4, "title": "Artificial Intelligence"},
    {"id": 5, "title": "Artificial Intelligence"},
    {"id": 6, "title": "Artificial Intelligence"},
  ]

  return (
    <main className="w-screen flex flex-col items-center justify-center">

      <div className="w-full max-w-3xl p-5 gap-y-5 flex flex-col items-center justify-center">

        <CreateJourneyButton />

        {
          journeys.map(journey => <JourneyLink key={journey.id} journey={journey} />)
        }
        
      </div>

    </main>
  )
}


function JourneyLink({ journey }) {
  return (
    <div className="w-72 h-16 max-w-full rounded-lg bg-blue-500 flex items-center justify-center">
      <div className="text-white text-center font-semibold text-lg">
        { journey.title }
      </div>
    </div>
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