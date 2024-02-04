import { useEffect, useState } from "react"
import { verifyAccessTokenRequest } from "../../api/accounts"
import { useRouter } from "next/navigation"


export default function LoginRequired({ children }) {

  const [signedIn, setSignedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {

    // Attempt to retrieve a token from localstorage
    const token = localStorage.getItem('accessToken')

    if (token === null) {
      router.push('/accounts/signin')
      return
    }
    
    // If a token exists, check it's validity
    verifyAccessTokenRequest(token).then(response => {
      if (!response.ok) {
        router.push("/accounts/signin")
      }
      else {
        setSignedIn(true)
      }
    })
    
  }, [])

  return (
    <>
      { signedIn && children }
    </>
  )

}