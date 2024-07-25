import instance from "./base";


export async function requestAccessToken(email: string, password: string) {
  return await instance.post('/accounts/token/request', {
    email: email, password: password
  })
}

export async function signUp(email: string, password: string) {
  return await instance.post('/accounts/signup', {
    email: email, password: password
  })
}