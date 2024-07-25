import instance from "./base";


export async function getFlashcardsList(documentId: number) {
  return await instance.get(`/documents/${documentId}/flashcards`)
}


export async function getEvaluationFeedback(documentId: number, correct: number[], wrong: number[]) {
  return await instance.post(`/documents/${documentId}/flashcards/feedback`, {
    correct: correct, wrong: wrong
  })
}