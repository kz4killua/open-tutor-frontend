"use client"

import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Download, GraduationCap, Pencil, Trash } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HeaderBreadcrumbLink } from "@/components/shared/header";
import { useDocuments } from "@/app/providers";
import { formatDate } from "@/utilities/dates";
import Link from "next/link";
import { formatFileSize } from "@/utilities/files";
import { type Document } from "@/types";
import { deleteDocument, getDocumentOverview } from "@/services/documents";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Markdown } from "@/components/documents/markdown";
import { useEffect, useState } from "react";


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
        <main className="flex flex-col max-w-2xl mx-auto mt-5 p-6 space-y-6">
          <div>
            <h1 className="text-2xl text-center font-bold">
              {document.name}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-x-5">
            <Link href={`/documents/${params.id}/read`}>
              <Button variant={"default"} className="w-32 py-6">
                <BookOpen size={16} className="shrink-0 mr-2" /> Read
              </Button>
            </Link>
            <Link href={`/documents/${params.id}/practice`}>
              <Button variant={"secondary"} className="w-32 py-6">
                <Pencil size={16} className="shrink-0 mr-2" /> Practice
              </Button>
            </Link>
          </div>
          <div>
            <DocumentOverview document={document} />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <DocumentDetails document={document} />
            <div className="flex flex-row justify-center md:justify-start md:flex-col gap-3 divide-y">
              <Link href={document.file} target="_blank">
                <Button variant={"outline"} className="w-32">
                  <Download size={16} className="me-2" />
                  Download
                </Button>
              </Link>
              <DocumentDeletionButtonAndDialog document={document} />
            </div>
          </div>
        </main>
      }
    </div>
  )
}


function DocumentOverview({ document }: { document: Document }) {

  const [overview, setOverview] = useState<string>()

  useEffect(() => {
    getDocumentOverview(document.id)
    .then(response => {
      if (response.status >= 300) {
        throw "Oops. We couldn't fetch the overview. Try again."
      }
      return response
    })
    .then(response => {
      setOverview(response.data.overview)
    })
  }, [])

  return (
    <div className="border shadow rounded-lg p-4">
      <h1 className="font-medium mb-4">
        📝 Overview
      </h1>
      {
        overview ? 
          <Markdown>
            {overview}
          </Markdown>
        :
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
      }
    </div>
  )
}


function DocumentDetails({ document }: { document: Document }) {
  return (
    <div className="grow border shadow rounded-lg p-4">
      <h1 className="font-medium mb-4">
        🛠️ Details
      </h1>
      <div className="flex flex-col gap-y-2 text-sm">
        <div>
          <h3 className="font-medium">Title</h3>
          <div>{document.name}</div>
        </div>
        <div>
          <h3 className="font-medium">Created</h3>
          <div>{formatDate(document.created)}</div>
        </div>
        <div>
          <h3 className="font-medium">File Size</h3>
          <div>{formatFileSize(document.size)}</div>
        </div>
      </div>
    </div>
  )
}


function DocumentDeletionButtonAndDialog({
  document
}: {
  document: Document
}) {

  const { documents, documentsDispatch } = useDocuments()
  const router = useRouter()

  function handleDeletion() {
    deleteDocument(document.id)
    .then(response => {
      if (response.status >= 300) {
        throw "Oops. We couldn't delete your document. Try again."
      }
      return response
    })
    .then(() => {
      documentsDispatch({
        type: "REMOVE", id: document.id
      })
      toast.success("Document deleted successfully.")
      router.push("/documents")
    })
    .catch(error => toast.error(error))
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-32">
          <Trash size={16} className="me-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will delete this document, all associated messages and evaluations permanently. 
            You cannot undo this action. 
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant={"destructive"} onClick={handleDeletion}>
            Yes, I&apos;m sure.
          </Button>
          <DialogClose asChild>
            <Button variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}