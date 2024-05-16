import { getAccessToken } from "@/utilities/token";
import instance from "./base";


export async function getDocumentMessagesList(id: number) {
  return await instance.get(`/documents/${id}/messages`)
}


export async function createDocumentMessage(id: number, query: string, quote?: string) {
  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/documents/${id}/messages`, {
    method: "POST",
    headers: {
      'Authorization': `Token ${getAccessToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: query, quote: quote
    })
  })
}