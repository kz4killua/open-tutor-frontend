import { parseResponse } from "./utilities"


export async function getJourneysRequest() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journeys/`, {
    headers: {
      'Authorization': `Token ${sessionStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}


export async function getJourneyRequest(journeyId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journeys/${journeyId}`, {
    headers: {
      'Authorization': `Token ${sessionStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}


export async function getJourneySectionsRequest(journeyId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journeys/${journeyId}/sections`, {
    headers: {
      'Authorization': `Token ${sessionStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}