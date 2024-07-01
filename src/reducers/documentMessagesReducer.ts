import { DocumentMessage } from "@/types";


export type DocumentMessagesAction = 
  | { type: "ADD", documentMessage: DocumentMessage }
  | { type: "SET", documentMessages: DocumentMessage[] }
  | { type: "UPDATE", documentMessage: DocumentMessage }
  | { type: "REMOVE", id: number }


export default function documentMessagesReducer(documentMessages: DocumentMessage[], action: DocumentMessagesAction) {
  switch (action.type) {

    case "ADD":
      return [...documentMessages, action.documentMessage]

    case "SET":
      return action.documentMessages

    case "UPDATE":
      return documentMessages.map(message => 
        message.id === action.documentMessage.id
        ? action.documentMessage
        : message
      )

    case "REMOVE":
      return documentMessages.filter(message => 
        message.id !== action.id
      )
      
    default:
      throw Error(`Unknown action type: ${action}`)
  }
}