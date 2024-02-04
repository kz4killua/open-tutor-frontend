import { parseResponse } from "./utilities"


export async function signUpRequest(username, password) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    })
  })
  return parseResponse(response)
}


export async function requestAccessTokenRequest(username, password) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/token/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    })
  })
  return parseResponse(response)
}


export async function verifyAccessTokenRequest(token) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/token/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
    })
  })
  return parseResponse(response)
}