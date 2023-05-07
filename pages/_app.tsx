import React from 'react'
import { AppProps } from 'next/app'

import '../styles/index.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <title>flyq.no</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
      </Head>
      <Component {...pageProps} />
    </>
  )

}

export default MyApp