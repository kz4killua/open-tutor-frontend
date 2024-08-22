"use client"

import { useEffect, useState } from "react"
import { HeaderBreadcrumbLink, Header } from "@/components/shared/header"
import { type DocumentSelection, type UserInput } from "@/types"
import { DocumentViewer } from "@/components/documents/document-viewer"
import { useDocuments } from "@/app/providers"
import Toolbar from "@/components/documents/toolbar"
import { ActionsMenu } from "@/components/documents/actions-menu"
import { SidePanel } from "@/components/documents/side-panel"


export default function DocumentViewPage({ 
  params 
} : {
  params : { id: string }
}) {

  const { documents } = useDocuments()
  const document = documents.find(item => item.id.toString() === params.id)
  const [selection, setSelection] = useState<DocumentSelection | null>(null)
  const [userInput, setUserInput] = useState<UserInput>({ 
    query: "", quote: "" 
  })
  const [sidePanelOpen, setSidePanelOpen] = useState(false)

  // Disable Microsoft Edge's default text selection popup.
  // https://learn.microsoft.com/en-us/answers/questions/1508004/on-microsoft-edge-as-a-developer-who-runs-a-websit
  useEffect(() => {
    window.onmouseup = event => event.preventDefault();
  }, [])
  
  const headerlinks: HeaderBreadcrumbLink[] = [
    {
      name: "Documents",
      href: "/documents"
    }
  ]

  if (document) {
    headerlinks.push({
      name: document.name,
      href: `/documents/${params.id}`
    })
    headerlinks.push({
      name: "View",
      href: window.location.href
    })
  }


  return (
    <div className="flex flex-col">
      <Header links={headerlinks} className="shadow" />
      { document &&
        <div className="bg-secondary">
          <main>
            <ActionsMenu 
              selection={selection}  
              setUserInput={setUserInput} 
              setSidePanelOpen={setSidePanelOpen} 
            />
            <DocumentViewer 
              document={document} 
              selection={selection} 
              setSelection={setSelection} 
            />
            <SidePanel 
              sidePanelOpen={sidePanelOpen} 
              setSidePanelOpen={setSidePanelOpen} 
              document={document} userInput={userInput} 
              setUserInput={setUserInput} 
            />
            <Toolbar />
          </main>
        </div>
      }
    </div>
  )
}
