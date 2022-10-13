import Header from 'components/Header'
import Head from 'next/head'

export default function Home () {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
        <title>Schooldev</title>
      </Head>
      <Header />
    </>
  )
}
