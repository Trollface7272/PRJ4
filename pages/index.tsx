import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  if (typeof window === "undefined") return (<></>)
  useRouter().push("/login")
  return (<></>)
}

export default Home
