"use client"

import { useCallback, useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import './document-viewer.modules.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';

// This is the type representing a user uploaded document.
import { Document as DocumentType } from "@/types"
import { toast } from 'sonner';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};


export function DocumentViewer({
  document
} : {
  document: DocumentType
}) {

  const [numPages, setNumPages] = useState<number>()
  const [documentWidth, setDocumentWidth] = useState<number>()

  useEffect(() => {
    setDocumentWidth(window.innerWidth * 0.95)
  }, [])

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
    setNumPages(nextNumPages)
  }

  function onDocumentLoadError() {
    toast.error("Oops. We couldn't load this document. Try again.")
  }

  return (
    <div className='rendered-pdf'>
      <div className="rendered-pdf-container">
        <div className="rendered-pdf-container-document">
          <Document file={document.file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} options={options}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page 
                key={`page_${index + 1}`} pageNumber={index + 1} width={documentWidth} 
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  )
}