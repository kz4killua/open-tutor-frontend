export function storeAccessToken(token: string) {
  localStorage.setItem('ACCESS_TOKEN', token)
}


export function getAccessToken() {
  return localStorage.getItem('ACCESS_TOKEN')
}