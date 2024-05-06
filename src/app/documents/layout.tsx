"use client"

import React from "react";
import { useEffect } from "react";
import { getDocumentsList } from "@/services/documents";
import { toast } from "sonner";
import { useDocuments } from "../providers";


export default function DocumentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { documents, documentsDispatch } = useDocuments()

  useEffect(() => {
    getDocumentsList()
    .then(response => {
      if (response.status >= 300) {
        throw "Oops. We couldn't fetch your documents. Try reloading the page."
      }
      return response;
    })
    .then(response => {
      documentsDispatch({ 
        type: "SET", documents: response.data
      })
    })
    .catch(message => {
      toast.error(message)
    })
  }, [])
  
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}