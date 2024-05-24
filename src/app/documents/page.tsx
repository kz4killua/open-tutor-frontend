"use client"


import Image from "next/image"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Loader, PlusCircle } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Document } from "@/types"
import { Header } from "@/components/blocks/header"
import { useDocuments } from "../providers"
import { createDocument, getDocumentsList } from "@/services/documents"
import { formatDate } from "@/utilities/dates"
import { toast } from "sonner"
import { useRouter } from "next/navigation";


export default function DocumentsPage() {

  const headerlinks = [
    {
      name: "Documents",
      href: "/documents"
    }
  ]

  return (
    <div>
      <Header 
        links={headerlinks} 
      />
      <main className="py-5 px-10">
        <div className="flex flex-col space-y-1.5 mt-4 mb-8">
          <h1 className="text-2xl font-semibold leading-none tracking-tight mb-1">
            Your Documents
          </h1>
          <p className="text-sm text-muted-foreground italic">
            &ldquo;Everything around you that you call life was made up by people who were no smarter than you. &rdquo;
          </p>
        </div>
        <div className="flex justify-end">
          <DocumentAddButton />
        </div>
        <DocumentsList />
      </main>
    </div>
  )
}


function DocumentsList() {

  const { documents, documentsDispatch } = useDocuments()
  const router = useRouter()

  return (
    <Table>
      <TableCaption>
        You can learn anything. 
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Date Added</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          documents.map(document => 
            <TableRow 
              key={document.id} 
              className="cursor-pointer"
              onClick={() => router.push(`/documents/${document.id}/view`)}
            >
              <TableCell>{document.name}</TableCell>
              <TableCell>{formatDate(document.created)}</TableCell>
            </TableRow>
          )
        }
      </TableBody>
    </Table>
  )
}


function DocumentAddButton() {

  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mb-2">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add a new document
          </DialogTitle>
          <DialogDescription>
            Upload a PDF file and choose a title.
          </DialogDescription>
        </DialogHeader>
        <DocumentAddForm closeDialog={() => setDialogOpen(false)} />
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


function DocumentAddForm({ 
  closeDialog 
} : { 
  closeDialog: () => void 
}) {

  const { documents, documentsDispatch } = useDocuments()

  const MAX_UPLOAD_SIZE = 1024 * 1024 * 20;

  const formSchema = z.object({
    name: z.string({ required_error: "This field is required." })
      .max(64, {
        message: "Document names cannot exceed 64 characters."
      }),
    file: z
      .any()
      .refine(file => file?.length === 1, "You must upload one file.")
      .refine(file => file[0]?.size <= MAX_UPLOAD_SIZE, "Documents cannot be larger than 20MB.")
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), 
    defaultValues: {
      name: "", file: ""
    }
  })

  const [loading, setLoading] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true)

    createDocument(values.name, values.file[0])
    .then(response => {
      if (response.status >= 300) {
        throw 'UPLOAD_FAILED'
      }
      return response
    })
    .then((response) => {
      documentsDispatch({ type: "ADD", document: response.data })
      closeDialog()
      toast.success("Your document has been uploaded.")
    })
    .catch(() => {
      toast.error("Something went wrong. Please try again.")
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField 
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Learning Docker" {...field} />
              </FormControl>
              <FormDescription>
                You can change this later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input type="file" accept=".pdf" {...form.register("file", { required: true })} />
              </FormControl>
              <FormDescription>
                Upload a valid PDF file. Uploads must be less than 20MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          { loading && <Loader className="mr-2 h-4 w-4 animate-spin" /> }
          Upload
        </Button>
      </form>
    </Form>
  )
}