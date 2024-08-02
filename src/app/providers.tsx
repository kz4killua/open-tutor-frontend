"use client"

import { Document, DocumentMessage } from "@/types";
import { DocumentsAction } from "@/reducers/documentsReducer";
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import documentsReducer from "@/reducers/documentsReducer";
import documentMessagesReducer, { DocumentMessagesAction } from "@/reducers/documentMessagesReducer";


const DocumentsContext = createContext<{ documents: Document[], documentsDispatch: React.Dispatch<DocumentsAction> } | undefined>(undefined)
const DocumentMessagesContext = createContext<{ documentMessages: DocumentMessage[], documentMessagesDispatch: React.Dispatch<DocumentMessagesAction> } | undefined>(undefined)
const ZoomLevelContext = createContext<{ zoomLevel: number, setZoomLevel: React.Dispatch<React.SetStateAction<number>> } | undefined>(undefined)
const DarkModeContext = createContext<{ darkMode: boolean, setDarkMode: React.Dispatch<React.SetStateAction<boolean>> } | undefined>(undefined)


function DocumentsProvider({ 
  children 
} : Readonly<{
  children: React.ReactNode;
}>) {

  const [documents, documentsDispatch] = useReducer(documentsReducer, []);

  return (
    <DocumentsContext.Provider value={{ documents, documentsDispatch }}>
      { children }
    </DocumentsContext.Provider>
  )
}


function DocumentMessagesProvider({ 
  children 
} : Readonly<{
  children: React.ReactNode;
}>) {

  const [documentMessages, documentMessagesDispatch] = useReducer(documentMessagesReducer, []);

  return (
    <DocumentMessagesContext.Provider value={{ documentMessages, documentMessagesDispatch }}>
      { children }
    </DocumentMessagesContext.Provider>
  )
}


function ZoomLevelProvider({
  children
} : Readonly<{
  children: React.ReactNode;
}>) {

  const [zoomLevel, setZoomLevel] = useState(1.0)

  return (
    <ZoomLevelContext.Provider value={{ zoomLevel, setZoomLevel }}>
      { children }
    </ZoomLevelContext.Provider>
  )
}


function DarkModeProvider({
  children
} : Readonly<{
  children: React.ReactNode;
}>) {

  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const darkMode = JSON.parse(localStorage.getItem("DARK_MODE") || "false")
    setDarkMode(darkMode)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) {
      return
    }
    localStorage.setItem("DARK_MODE", JSON.stringify(darkMode))
    if (darkMode) {
      document.body.classList.add("dark")
    }
    else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      { children }
    </DarkModeContext.Provider>
  )
}


export function useDocuments() {
  const context = useContext(DocumentsContext)
  if (!context) {
    throw new Error("useDocuments() must be used within the appropriate provider.")
  }
  return context
}


export function useDocumentMessages() {
  const context = useContext(DocumentMessagesContext)
  if (!context) {
    throw new Error("useDocumentMessages() must be used within the appropriate provider.")
  }
  return context
}


export function useZoomLevel() {
  const context = useContext(ZoomLevelContext)
  if (!context) {
    throw new Error("useZoomLevel() must be used within the appropriate provider.")
  }
  return context
}


export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode() must be used within the appropriate provider.")
  }
  return context
}


export function Providers({ 
  children 
} : Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DarkModeProvider>
      <DocumentsProvider>
        <DocumentMessagesProvider>
          <ZoomLevelProvider>
            { children }
          </ZoomLevelProvider>
        </DocumentMessagesProvider>
      </DocumentsProvider>    
    </DarkModeProvider>
  )
}