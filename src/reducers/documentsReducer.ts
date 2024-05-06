import { Document } from "@/types"


export type DocumentsAction = 
  | { type: "ADD", document: Document }
  | { type: "SET", documents: Document[] }


export default function documentsReducer(documents: Document[], action: DocumentsAction) {
  switch (action.type) {
    case "ADD":
      return [...documents, action.document]
    case "SET":
      return action.documents
    default:
      throw Error(`Unknown action type: ${action}`)
  }
}