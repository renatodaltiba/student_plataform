import { getAccessToken, useUser } from '@auth0/nextjs-auth0'
import { GetServerSideProps } from 'next'

export default function Home() {
  const { user } = useUser()
  return (
    <>
      <h1>{user?.name}</h1> <a href="/api/auth/logout">Logout</a>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getAccessToken(req, res)

  console.log(token)

  return {
    props: {}
  }
}
