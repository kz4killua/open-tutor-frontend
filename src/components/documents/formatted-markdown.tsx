import React from 'react'
import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'


export function FormattedMarkdown({
  children
} : {
  children: string
}) {
  return (
    <Markdown className={"prose"} remarkPlugins={[remarkGfm]}>
      {children}
    </Markdown>
  )
}