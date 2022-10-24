import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza App</title>
        <meta name="description" content="Pizza yummy, Yummy Pizza" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='bg-red-900'>
        Pizza App

      </h1>
    </div>
  )
}
