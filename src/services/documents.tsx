import instance from "./base";


export async function getDocumentsList() {
  return await instance.get('/documents/')
}

export async function createDocument(name: string, file: File) {
  
  const formData = new FormData()
  formData.append('name', name)
  formData.append('file', file)

  return await instance.post('/documents/', formData, {
    headers: {
      "Content-Type": undefined
    }
  })
}

export async function getDocumentDetail(id: number) {
  return await instance.get(`/documents/${id}`)
}

export async function deleteDocument(id: number) {
  return await instance.delete(`/documents/${id}`)
}