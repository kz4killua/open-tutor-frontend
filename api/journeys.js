import { parseResponse } from "./utilities"


export async function getJourneysRequest() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journeys/`, {
    headers: {
      'Authorization': `Token ${localStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}


export async function getJourneyRequest(journeyId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journeys/${journeyId}`, {
    headers: {
      'Authorization': `Token ${localStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}


export async function getJourneySectionsRequest(journeyId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journeys/${journeyId}/sections`, {
    headers: {
      'Authorization': `Token ${localStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}


export async function createJourneyRequest(title, baseFile) {

  const formData = new FormData()  
  formData.append('title', title)
  formData.append('base_file', baseFile)

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journeys/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${localStorage.getItem('accessToken')}`,
    },
    body: formData
  })

  return parseResponse(response)

}