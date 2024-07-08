import React from 'react'
import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'


const components: Components = {
  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-3" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-3" {...props} />,
  h4: ({node, ...props}) => <h3 className="font-semibold mb-2" {...props} />,
  p: ({node, ...props}) => <p className="mb-2" {...props} />,
  a: ({node, ...props}) => <a className="text-blue-600 underline" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4" {...props} />,
  li: ({node, ...props}) => <li className="mb-2" {...props} />,
  table: ({node, ...props}) => <table className="table-auto w-full my-4" {...props} />,
  thead: ({node, ...props}) => <thead className="bg-gray-200" {...props} />,
  tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-300" {...props} />,
  tr: ({node, ...props}) => <tr className="border-t border-gray-300" {...props} />,
  th: ({node, ...props}) => <th className="px-4 py-2 text-left" {...props} />,
  td: ({node, ...props}) => <td className="px-4 py-2" {...props} />,
  strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
};


export function FormattedMarkdown({
  children
} : {
  children: string
}) {
  return (
    <Markdown components={components} remarkPlugins={[remarkGfm]}>
      {children}
    </Markdown>
  )
}