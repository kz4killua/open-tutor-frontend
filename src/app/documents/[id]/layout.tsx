"use client"

import React from "react";
import { useEffect } from "react";
import { getDocumentsList } from "@/services/documents";
import { toast } from "sonner";
import { useDocumentMessages } from "@/app/providers";
import { getDocumentMessagesList } from "@/services/messages";



export default function DocumentDetailLayout({
  params, children,
}: Readonly<{
  params : { id: string };
  children: React.ReactNode;
}>) {

  const { documentMessages, documentMessagesDispatch } = useDocumentMessages()

  useEffect(() => {
    getDocumentMessagesList(parseInt(params.id))
    .then(response => {
      if (response.status >= 300) {
        throw "Oops. We couldn't fetch your conversations. Try reloading the page."
      }
      return response;
    })
    .then(response => {
      documentMessagesDispatch({ 
        type: "SET", documentMessages: response.data.toReversed()
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