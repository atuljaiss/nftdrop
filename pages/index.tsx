import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Typewriter from 'typewriter-effect'
import {sanityClient, urlFor} from '../sanity'
import { Collection } from '../typing'

interface Props {
  collections: Collection[]
}
const Home =  ({collections}:Props) => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col py-20
    px-10 2xl-px-0 xl:m-auto">
      <Head>
        <title>NFT DROP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='w-52 cursor-pointer text-xl 
                    font-extralight sm:w-80 '>
                    The{' '} 
                    <span className='font-extrabold underline 
                    decoration-purple-600/50'>
                        Atul-Jaiss</span> {' '}
                    NFT Market Place
      </h1>
      <main className='bg-slate-100 p-10 shadow-xl shadow-rose-400/20'>
        <div className='grid space-x-3 md:grid-cols-2 
                lg:grid-cols-3 xl:grid-cols-4 '>
          {collections.map(collection =>(
            <Link href={`/nft/${collection.slug.current}`}>
            <div className='flex flex-col cursor-pointer
            transition-all duration-200 hover:scale-105 items-center'>
              <img className='h-96  w-60 rounded-2xl object-cover '
               src={urlFor(collection.mainImage).url()} alt=""
               />
                <div className='p-5'>
                 <h2 className='text-3xl'>{collection.title}</h2>
                 <p className='mt-2 text-sm text-gray-400'>
                   {collection.description}
                 </p>
                </div>
            </div>
            </Link>
          ))}
        </div>
      </main>

      {/*<h1 className='text-8xl font-bold text-center justify-center
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
      
                  */}
    </div>
  )
}

export default Home
export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == 'collection']{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage {
    asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug{
      current
    }
    }
  }`
  const collections = await sanityClient.fetch(query)
 
  return {
    props: {
      collections
    }
  }
}