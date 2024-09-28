import instance from "./base";
import type { Document } from "@/types";


export async function getDocumentsList() {
  return await instance.get('/documents/')
}

export async function createDocument(name: Document['name'], file: File) {
  
  const formData = new FormData()
  formData.append('name', name)
  formData.append('file', file)

  return await instance.post('/documents/', formData, {
    headers: {
      "Content-Type": undefined
    }
  })
}

export async function getDocumentDetail(id: Document['id']) {
  return await instance.get(`/documents/${id}`)
}

export async function deleteDocument(id: Document['id']) {
  return await instance.delete(`/documents/${id}`)
}

export async function getDocumentOverview(id: Document['id']) {
  return await instance.get(`/documents/${id}/overview`)
}