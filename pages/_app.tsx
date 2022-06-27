import React from 'react'
import { AppProps } from 'next/app'

import '../styles/index.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <title>flykø.no</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )

}

export default MyApp