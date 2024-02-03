export async function parseResponse(response) {
  
  var data

  try {
    data = await response.json()
  } catch (error) {
    data = null
  }

  return {
    status: response.status, message: response.statusText, data: data, ok: response.ok
  }

}