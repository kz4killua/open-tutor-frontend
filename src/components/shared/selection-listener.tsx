"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';


export function SelectionListener({ 
  onSelection, children
} : {
  onSelection: (selection: Selection | null) => void,
  children: React.ReactNode
}) {

  const ref = useRef<HTMLDivElement>(null)
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);

  function handleMouseDown() {
    setIsMouseDown(true)
    setSelection(null)
  }

  function handleMouseUp() {
    setIsMouseDown(false)
  }

  function handleSelectionChange() {
    const selection = window.getSelection()
    if (ref.current && selection && ref.current.contains(selection.anchorNode)) {
      setSelection(selection)
    } else {
      setSelection(null)
    }
  }

  useEffect(() => {
    if (!isMouseDown) {
      onSelection(selection)
    }
  }, [selection, isMouseDown])

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <div ref={ref} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {children}
    </div>
  )
}