import instance from "./base";
import type { Document, Flashcard } from "@/types";


export async function getFlashcardsList(documentId: Document["id"]) {
  return await instance.get(`/documents/${documentId}/flashcards`)
}


export async function getEvaluationFeedback(documentId: Document["id"], correct: Flashcard["id"][], wrong: Flashcard["id"][]) {
  return await instance.post(`/documents/${documentId}/flashcards/feedback`, {
    correct: correct, wrong: wrong
  })
}


export async function createFlashcardsFromText(documentId: Document["id"], text: string) {
  return await instance.post(`/documents/${documentId}/flashcards/from-text`, {
    text: text
  })
}