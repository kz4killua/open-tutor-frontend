"use client"

// https://github.com/wojtekmaj/react-pdf/wiki/Upgrade-guide-from-version-8.x-to-9.x
import 'core-js/proposals/promise-with-resolvers';

import React, { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from "react"
import type { DocumentSelection, Highlight, Document as DocumentType } from '@/types';
import { toast } from 'sonner';
import { Popover } from '@/components/ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import StyledTooltip from '../shared/styled-tooltip';
import { X } from 'lucide-react';
import { SelectionListener } from '@/components/shared/selection-listener';
import { useHighlights, useZoomLevel } from '@/app/providers';

import './document-viewer.modules.css';

// https://github.com/wojtekmaj/react-pdf/blob/main/README.md
import { pdfjs, Document, Page } from 'react-pdf';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
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

  const { setZoomLevel } = useZoomLevel()
  const { highlights } = useHighlights()
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
                    highlights={highlights.filter(highlight => highlight.page_number === page.pageNumber)}
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
  highlights,
} : { 
  pageNumber: number, 
  pageWidth: number,
  pageHeight: number,
  currentPage: number,
  setCurrentPage: (pageNumber: number) => void,
  highlights: Highlight[],
}) {

  const ref = useRef<HTMLDivElement>(null)
  const { zoomLevel } = useZoomLevel()
  const [isLoaded, setIsLoaded] = useState(false)

  // Only load pages that are within 2 pages of the user's current page.
  const isWithinRange = Math.abs(currentPage - pageNumber) <= 2
  
  // Use an intersection observer to load pages as they come into view.
  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentPage(pageNumber)
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] }
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
      className={"relative"}
    >
      {
        highlights.map(highlight => (
          <PageHighlight key={highlight.id} highlight={highlight} />
        ))
      }
    </Page>
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


function PageHighlight({
  highlight
} : {
  highlight: Highlight
}) {

  const [open, setOpen] = useState(false)
  const { highlightsDispatch } = useHighlights()

  function handleClick() {
    setOpen(true)
  }

  function handleRemoveHighlight() {
    highlightsDispatch({ type: "REMOVE", id: highlight.id })
    setOpen(false)
  }

  // Remove any rectangles with a width or height of 0.
  const highlightRects = highlight.client_rects.filter(
    rect => rect.width > 0 && rect.height > 0
  )

  if (highlightRects.length === 0) {
    return null
  }

  const popoverTriggerRect = highlightRects[0]

  return (
    <>

      {/* Highlight rectangles */}      
      <div className='group'>
        {
          highlightRects.map((rect, index) => (
            <div 
              key={index}
              className="absolute z-10 bg-primary rounded-sm opacity-20 group-hover:opacity-40 cursor-pointer"
              style={{
                left: `calc(${rect.left * 100}% - 2px)`,
                top: `calc(${rect.top * 100}% - 2px)`,
                width: `calc(${rect.width * 100}% + 4px)`,
                height: `calc(${rect.height * 100}% + 4px)`,
              }}
              onClick={handleClick}
            />
          ))
        }
      </div>

      {/* Popover for deleting highlights */}
      <Popover open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
        <PopoverTrigger asChild>
          <div className='absolute' style={{
            position: 'absolute',
            left: `calc(${popoverTriggerRect.left * 100}% - 2px)`,
            top: `calc(${popoverTriggerRect.top * 100}% - 2px)`,
            width: `calc(${popoverTriggerRect.width * 100}% + 4px)`,
            height: `calc(${popoverTriggerRect.height * 100}% + 4px)`
          }} />
        </PopoverTrigger>
        <PopoverContent className='z-40'>
          <StyledTooltip text='Remove highlight'>
            <button className="cursor-pointer p-2 border shadow-sm shadow-black focus:outline-0 rounded-full bg-background hover:bg-accent" onClick={handleRemoveHighlight}>
              <X size={16} />
            </button>
          </StyledTooltip>
        </PopoverContent>
      </Popover>
    </>
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