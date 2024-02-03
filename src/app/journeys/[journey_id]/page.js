export default function JourneyViewPage() {

  const journey = {

  }

  const sections = [
    {"id": 1},
    {"id": 2},
    {"id": 3},
    {"id": 4},
    {"id": 5},
  ]


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