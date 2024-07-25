"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import './document-viewer.modules.css';

import { pdfjs, Document, Page } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { type DocumentSelection } from '@/types';
import { type Dispatch, type SetStateAction } from "react"

// This type represents a user uploaded document.
import { type Document as DocumentType } from "@/types"

import { SelectionListener } from '../selection-listener';
import { useZoomLevel } from '@/app/providers';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};


export function DocumentViewer({
  document, selection, setSelection
} : {
  document: DocumentType, 
  selection: DocumentSelection | null,
  setSelection: Dispatch<SetStateAction<DocumentSelection | null>>
}) {

  const [numPages, setNumPages] = useState<number>()
  const [documentWidth, setDocumentWidth] = useState<number>()
  const { zoomLevel, setZoomLevel } = useZoomLevel()

  const ref = useRef<HTMLDivElement>(null)

  // *Note*: The document width is separate from the scale (zoom level)
  useEffect(() => {
    setDocumentWidth(window.innerWidth * 0.95)
  }, [])

  function handleSelection(selection: Selection | null) {
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

  return (
    <SelectionListener onSelection={handleSelection}>
      <div className='rendered-pdf' ref={ref}>
        <div className="rendered-pdf-container">
          <div className="rendered-pdf-container-document">
            <Document file={document.file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} options={options}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page 
                  key={index} pageNumber={index + 1} width={documentWidth} scale={zoomLevel}
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    </SelectionListener>
  )
}