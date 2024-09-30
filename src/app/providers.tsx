"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import type { Document, DocumentMessage, Highlight } from "@/types";
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import documentsReducer, { DocumentsAction } from "@/reducers/documentsReducer";
import documentMessagesReducer, { DocumentMessagesAction } from "@/reducers/documentMessagesReducer";
import highlightsReducer, { HighlightsAction } from "@/reducers/highlightsReducer";


const DocumentsContext = createContext<{ documents: Document[], documentsDispatch: React.Dispatch<DocumentsAction> } | undefined>(undefined)
const DocumentMessagesContext = createContext<{ documentMessages: DocumentMessage[], documentMessagesDispatch: React.Dispatch<DocumentMessagesAction> } | undefined>(undefined)
const ZoomLevelContext = createContext<{ zoomLevel: number, setZoomLevel: React.Dispatch<React.SetStateAction<number>> } | undefined>(undefined)
const HighlightsContext = createContext<{ highlights: Highlight[], highlightsDispatch: React.Dispatch<HighlightsAction> } | undefined>(undefined)


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


function HighlightsProvider({
  children
} : Readonly<{
  children: React.ReactNode;
}>) {

  const [highlights, highlightsDispatch] = useReducer(highlightsReducer, [])

  return (
    <HighlightsContext.Provider value={{ highlights, highlightsDispatch }}>
      { children }
    </HighlightsContext.Provider>
  )
}


function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
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


export function useHighlights() {
  const context = useContext(HighlightsContext)
  if (!context) {
    throw new Error("useHighlights() must be used within the appropriate provider.")
  }
  return context
}


export function Providers({ 
  children 
} : Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DocumentsProvider>
        <DocumentMessagesProvider>
          <ZoomLevelProvider>
            <HighlightsProvider>
              { children }
            </HighlightsProvider>
          </ZoomLevelProvider>
        </DocumentMessagesProvider>
      </DocumentsProvider>    
    </ThemeProvider>
  )
}