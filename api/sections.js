import { parseResponse } from "./utilities"


export async function getSectionRequest(sectionId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sections/${sectionId}`, {
    headers: {
      'Authorization': `Token ${localStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}


export async function updateSectionRequest(sectionId, completed) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sections/${sectionId}`, {
    method: "PATCH",
    headers: {
      'Authorization': `Token ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed: completed,
    })
  })
  return parseResponse(response)
}


export async function queryQuestionAnswerRequest(sectionId, question) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sections/${sectionId}/chat`, {
    method: "POST",
    headers: {
      'Authorization': `Token ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: question,
    })
  })
  return parseResponse(response)
}