"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
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


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};


interface UpdatedPDFPageProxy extends PDFPageProxy {
  height: number
}


export function DocumentViewer({
  document, selection, setSelection
} : {
  document: DocumentType, 
  selection: DocumentSelection | null,
  setSelection: Dispatch<SetStateAction<DocumentSelection | null>>
}) {

  const [numPages, setNumPages] = useState<number>()
  const [documentWidth, setDocumentWidth] = useState<number>()
  const [documentHeight, setDocumentHeight] = useState<number>()
  const { zoomLevel, setZoomLevel } = useZoomLevel()
  const [loadedPages, setLoadedPages] = useState<number[]>([0])

  const ref = useRef<HTMLDivElement>(null)

  // *Note*: The document width is separate from the scale (zoom level)
  useEffect(() => {
    setDocumentWidth(window.innerWidth * 0.95)
  }, [])

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

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages)
  }

  function onDocumentLoadError() {
    toast.error("Oops. We couldn't load this document. Try again.")
  }

  function onPageLoadSuccess(page: UpdatedPDFPageProxy) {
    // Set the document height based on the first page.
    if (page._pageIndex === 0) {
      setDocumentHeight(page.height)
    }
    // Stop at the last page.
    if (numPages === undefined || page._pageIndex === numPages - 1) {
      return
    }
    // Load each next page one at a time.
    if (!loadedPages.includes(page._pageIndex + 1)) {
      setLoadedPages([...loadedPages, page._pageIndex + 1])
    }
  }

  function onPageLoadError(page: PDFPageProxy) {
    toast.error("We encountered an error loading this document. Please try again.")
  }

  return (
    <SelectionListener onSelection={handleSelection}>
      <div className='rendered-pdf' ref={ref}>
        <div className="rendered-pdf-container">
          <div className="rendered-pdf-container-document">
            <Document file={document.file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} options={options}>
              {
                Array.from(new Array(numPages), (element, index) => (
                  loadedPages.includes(index) ?
                    <Page
                      key={index}
                      pageNumber={index + 1}
                      width={documentWidth}
                      scale={zoomLevel}
                      onLoadSuccess={onPageLoadSuccess}
                      onError={onPageLoadError}
                    /> 
                    :
                    documentWidth && documentHeight && <PageSkeleton
                      key={index}
                      width={documentWidth * zoomLevel}
                      height={documentHeight}
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


function PageSkeleton({ width, height }: { width: number, height: number }) {
  return (
    <div 
      className="react-pdf__Page" 
      style={{ width: width, height: height }} 
    />
  )
}