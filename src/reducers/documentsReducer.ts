import { Document } from "@/types"


export type DocumentsAction = 
  | { type: "ADD", document: Document }
  | { type: "SET", documents: Document[] }
  | { type: "REMOVE", id: number }


export default function documentsReducer(documents: Document[], action: DocumentsAction) {
  switch (action.type) {
    case "ADD":
      return [...documents, action.document]
    case "SET":
      return action.documents
    case "REMOVE":
      return documents.filter(document => 
        document.id !== action.id
      )
    default:
      throw Error(`Unknown action type: ${action}`)
  }
}