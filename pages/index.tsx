import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const router = useRouter()
  if (typeof window === "undefined") return (<></>)
  router.push("/login")
  return (<></>)
}

export default Home
