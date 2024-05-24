"use client"

import { Header } from "@/components/blocks/header";
import { Button } from "@/components/ui/button";
import { Download, Trash } from "lucide-react";
import { useState } from "react";
import { HeaderBreadcrumbLink } from "@/components/blocks/header";
import { useDocuments } from "@/app/providers";
import { formatDate } from "@/utilities/dates";


export default function DocumentPage({ 
  params 
} : {
  params : { id: string }
}) {

  const { documents, documentsDispatch } = useDocuments()
  const document = documents.find(item => item.id.toString() === params.id)

  const headerlinks: HeaderBreadcrumbLink[] = [
    {
      name: "Documents",
      href: "/documents"
    }
  ]

  if (document) {
    headerlinks.push({
      name: document.name,
      href: window.location.href
    })
  }

  return (
    <div>
      <Header links={headerlinks} />
      {document && 
        <main className="flex flex-col max-w-2xl mx-auto p-6 space-y-6">
          <div>
            <h1 className="text-2xl text-center font-bold">
              {document.name}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-x-5">
            <Button variant={"default"} className="w-32 py-6">
              Read
            </Button>
            <Button variant={"secondary"} className="w-32 py-6">
              Evaluate
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="grow bg-gray-100 rounded-lg p-4">
              <h1 className="font-medium mb-4">
                Document Details
              </h1>
                <div className="flex flex-col gap-y-2">
                  <div>
                    <h3 className="text-sm text-gray-500">Title</h3>
                    <div>{document.name}</div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">Created</h3>
                    <div>{formatDate(document.created)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500">File Size</h3>
                    <div>... MB</div>
                  </div>
                </div>
            </div>
            <div className="flex flex-row md:flex-col gap-3 divide-y">
              <Button variant={"outline"} className="w-32">
                <Download size={16} className="me-2" />
                Download
              </Button>
              <Button variant={"outline"} className="w-32">
                <Trash size={16} className="me-2" />
                Delete
              </Button>
            </div>
          </div>
        </main>
      }
    </div>
  )
}

