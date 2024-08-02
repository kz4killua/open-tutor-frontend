import React from 'react'
import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'


export function FormattedMarkdown({
  children
} : {
  children: string
}) {
  return (
    <Markdown className={"prose dark:prose-invert"} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
      {children}
    </Markdown>
  )
}