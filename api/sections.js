import { parseResponse } from "./utilities"


export async function getSectionRequest(sectionId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sections/${sectionId}`, {
    headers: {
      'Authorization': `Token ${localStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}