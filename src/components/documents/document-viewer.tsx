"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import './document-viewer.modules.css';

import { pdfjs, Document, Page } from 'react-pdf';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { type DocumentSelection } from '@/types';
import { type Dispatch, type SetStateAction } from "react"

// This type represents a user uploaded document.
import { type Document as DocumentType } from "@/types"

import { SelectionListener } from '../shared/selection-listener';
import { useZoomLevel } from '@/app/providers';


// https://github.com/wojtekmaj/react-pdf/blob/main/README.md
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};


export function DocumentViewer({
  document, 
  selection, 
  setSelection
} : {
  document: DocumentType, 
  selection: DocumentSelection | null,
  setSelection: Dispatch<SetStateAction<DocumentSelection | null>>
}) {

  const { zoomLevel, setZoomLevel } = useZoomLevel()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pages, setPages] = useState<PDFPageProxy[]>([])
  const ref = useRef<HTMLDivElement>(null)


  function handleSelection(selection: Selection | null) {
    // Keep track of user selected text and the bounding rectangles.
    if (selection && selection.rangeCount > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect()
      const text = selection.toString().trim()
      setSelection({ text: text, boundingClientRect: rect })
    } else {
      setSelection(null)
    }
  }

  async function onDocumentLoadSuccess(pdf: PDFDocumentProxy) {    
    const pages: PDFPageProxy[] = []
    for (let i = 1; i <= pdf.numPages; i++) {
      pages.push(await pdf.getPage(i))
    }
    // By default, zoom the (first) page to fill the screen.
    if (pages.length) {
      setZoomLevel((window.innerWidth * 0.95) / pages[0].view[2])
    }
    setPages(pages)
  }

  function onDocumentLoadError() {
    toast.error("Oops. We couldn't load this document. Try again.")
  }

  return (
    <SelectionListener onSelection={handleSelection}>
      <div className='rendered-pdf' ref={ref}>
        <div className="rendered-pdf-container">
          <div className="rendered-pdf-container-document">
            <Document 
              file={document.file} 
              onLoadSuccess={onDocumentLoadSuccess} 
              onLoadError={onDocumentLoadError} 
              options={options}
            >
              {
                pages.map(page => (
                  <DocumentPage
                    key={page.pageNumber}
                    pageNumber={page.pageNumber}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageHeight={page.view[3]}
                    pageWidth={page.view[2]}
                  />
                ))
              }
            </Document>
          </div>
        </div>
      </div>
    </SelectionListener>
  )
}


function DocumentPage({ 
  pageNumber, 
  pageWidth,
  pageHeight,
  currentPage,
  setCurrentPage,
} : { 
  pageNumber: number, 
  pageWidth: number,
  pageHeight: number,
  currentPage: number,
  setCurrentPage: (pageNumber: number) => void,
}) {

  const ref = useRef<HTMLDivElement>(null)
  const { zoomLevel, setZoomLevel } = useZoomLevel()
  const [isLoaded, setIsLoaded] = useState(false)

  // Only load pages that are within 2 pages of the current page.
  const isWithinRange = Math.abs(currentPage - pageNumber) <= 2
  
  // Use an intersection observer to load pages as they come into view.
  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentPage(pageNumber)
        }
      },
      { threshold: 0.5 / zoomLevel }
    )

    const element = ref.current

    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [pageNumber, zoomLevel, setCurrentPage])

  useEffect(() => {
    setIsLoaded(false)
  }, [isWithinRange, zoomLevel])

  function onRenderSuccess(page: PDFPageProxy) {
    setIsLoaded(true)
  }

  function onPageLoadError(page: PDFPageProxy) {
    toast.error("We encountered an error loading this document. Please try again.")
  }

  const fallback = (
    <PageSkeleton 
      width={pageWidth} 
      height={pageHeight} 
      zoomLevel={zoomLevel}
    />
  )

  const element = (
    <Page
      pageNumber={pageNumber}
      width={pageWidth}
      scale={zoomLevel}
      onRenderSuccess={onRenderSuccess}
      onError={onPageLoadError}
    />
  )

  return (
    <div ref={ref}>
      {
        isWithinRange ? 
        <>
          {/* Only display the page when it is fully loaded. */}
          <div className={`${isLoaded ? 'hidden' : 'block'}`}>
            {fallback}
          </div> 
          <div className={`${isLoaded ? 'block' : 'hidden'}`}>
            {element}
          </div>
        </>
        :
        fallback
      }
    </div>
  )
}


function PageSkeleton({ 
  width, 
  height,
  zoomLevel 
} : { 
  width: number, 
  height: number,
  zoomLevel: number
}) {

  return (
    <div 
      className="react-pdf__Page" 
      style={{ width: width * zoomLevel, height: height * zoomLevel }} 
    />
  )
}