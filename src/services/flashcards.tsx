import instance from "./base";


export async function getFlashcardsList(documentId: number, pageNumber: number) {
  return await instance.get(`/documents/${documentId}/flashcards?page_number=${pageNumber}`)
}