"use client"

import { useEffect, useState } from "react"
import { HeaderBreadcrumbLink, Header } from "@/components/blocks/header"
import { getDocumentDetail } from "@/services/documents"
import { Document } from "@/types"
import { DocumentViewer } from "@/components/blocks/viewer/document-viewer"
import { useDocuments } from "@/app/providers"


export default function DocumentViewPage({ 
  params 
} : {
  params : { id: string }
}) {

  const { documents, documentsDispatch } = useDocuments()
  const [document, setDocument] = useState<Document>()
  const [headerLinks, setHeaderLinks] = useState<HeaderBreadcrumbLink[]>([
    {
      name: "Documents",
      href: "/documents"
    }
  ])

  useEffect(() => {
    const document = documents.find(item => item.id.toString() === params.id)
    if (document) {
      setDocument(document)
      setHeaderLinks([
        headerLinks[0],
        {
          name: document.name,
          href: document.file
        }
      ])
    }
  }, [documents])

  return (
    <div>
      <Header links={headerLinks} />
      {
        document &&
        <main>
          {document && <DocumentViewer document={document} />}
        </main>
      }
    </div>
  )
}