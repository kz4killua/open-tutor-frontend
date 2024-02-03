import { parseResponse } from "./utilities"


export async function getJourneysRequest() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/journeys/`, {
    headers: {
      'Authorization': `Token ${sessionStorage.getItem('accessToken')}`
    }
  })
  return parseResponse(response)
}