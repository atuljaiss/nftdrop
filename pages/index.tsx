import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Typewriter from 'typewriter-effect'

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-cyan-400 to-purple-600 ">
      <Head>
        <title>NFT DROP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='text-8xl font-bold text-center justify-center
                 text-BLACK mt-20 p-10'>NFT DROP</h1>
             <h2 className='text-5xl text-black text-center'>
             <Typewriter
                    onInit={(typewriter) => {
                    typewriter.typeString(
                     "Welcome to NFT DROP challenge " 
                    )
                    .pauseFor(2000)
                    .deleteAll()
                    .typeString(
                    "Click below link to see my build"
                    )
                    .pauseFor(2000)
                    .pause()
                    .start();
                    }}
                />
                </h2>
                <a className='text-4xl text-center p-10 text-white' 
                href="https://aj-nftdrop.vercel.app/nft/atul">My Day-2 Work(click me)</a>
      
      
    </div>
  )
}

export default Home
