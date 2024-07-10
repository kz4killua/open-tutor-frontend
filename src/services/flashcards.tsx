import instance from "./base";


export async function getFlashcardsList(documentId: number, pageNumber: number) {
  return await instance.get(`/documents/${documentId}/flashcards?page_number=${pageNumber}`)
}


export async function getEvaluationFeedback(documentId: number, correct: number[], wrong: number[]) {
  return await instance.post(`/documents/${documentId}/flashcards/feedback`, {
    correct: correct, wrong: wrong
  })
}