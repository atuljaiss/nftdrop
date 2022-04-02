import React, { useEffect, useState } from 'react'
import { useAddress, useDisconnect, useMetamask,useNFTDrop } from "@thirdweb-dev/react";
import Typewriter from 'typewriter-effect';

import type {GetServerSideProps} from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typing';
import Link from 'next/link';
import { BigNumber } from 'ethers';
import toast, {Toaster,Toast} from 'react-hot-toast'
interface Props {
    collection:Collection
}
function NFTDropPage({collection}:Props) {

    const [claimedSupply,setClaimSupply] = useState<number>(0);
    const [totalSupply,setTotalSupply] = useState<BigNumber>();
    const [loading,setLoading] = useState<boolean>(true)
    const nftdrop = useNFTDrop(collection.address);
    const [priceInEth,setPriceInEth] = useState<string>();
    
    
    //nft auth
    const connectWithMetamask = useMetamask()
    const address = useAddress()
    const disconnect = useDisconnect()
    //nft auth

    useEffect(()=>{
      if(!nftdrop){
        return;
      }
    const fetchPrice =async () => {
      const claimConditions = await nftdrop.claimConditions.getAll();
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue )
    }  
    fetchPrice()
    },[nftdrop])
    useEffect(() => {
      if(!nftdrop){
        return;
      }
      const fetchNFTDropData = async () => {
        setLoading(true)
        const claimed = await nftdrop.getAllClaimed();
        const total = await nftdrop.totalSupply();
        setClaimSupply(claimed.length)
        setTotalSupply(total)
        setLoading(false)
      }
      fetchNFTDropData();
    }, [nftdrop])
    const mintNft = ()=>{

      if(!nftdrop || !address)return;
      const quantity = 1;//no of nft to claim
      setLoading(true)
      const notification = toast.loading('Minting...',{
        style:{
          background:'white',
          color:'green',
          fontWeight:'bolder',
          fontSize:'17px',
          padding:'10px'

        }
      })
      nftdrop.claimTo(address,quantity).then(async (tx)=>{
      const reciept = tx[0].receipt
      const claimedTokenId = tx[0].id
      const claimedNft = await tx[0].data()
      toast("Hurray.. You Succesfully Minted!",{
        duration:8000,
      style:{
        background:'green',
          color:'white',
          fontWeight:'bolder',
          fontSize:'17px',
          padding:'10px'
      }
    })
        console.log(reciept,claimedTokenId,claimedNft)

      }).catch(err => {
        console.log(err)
        toast("Oops Error occured while Minting!",{
          duration:8000,
        style:{
          background:'red',
            color:'white',
            fontWeight:'bolder',
            fontSize:'17px',
            padding:'10px'
        }
      })
      }).finally(()=>{
        setLoading(false)
        toast.dismiss(notification)
      })
    }
  return (
    
    <div className=' flex h-screen flex-col 
        lg:grid lg:grid-cols-10'>
        {/* left */}
        <Toaster position='bottom-center'/>
        <div className='bg-gradient-to-br lg:col-span-4
        from-cyan-400 to-purple-600'>
          <div className=' flex flex-col 
            items-center justify-center
            py-2 lg:min-h-screen '>
              <div className=' bg-gradient-to-br rounded-xl
              from-blue-800 to-pink-400 '>
                <img className='w-44 rounded-xl p-2
                    object-cover lg:h-96 lg:w-72'
                    src={urlFor(collection.previewImage).url()}
                    alt=''
                />
              </div>
             
             <div className=' p-5 text-center space-y-2 '>
             <h1 className='text-4xl font-bold
                 text-white '>{collection.nftCollectionName}</h1>
             <h2 className='text-xl text-gray-300'>
             <Typewriter
                    onInit={(typewriter) => {
                    typewriter.typeString(
                        `${collection.description}`
                    )
                    .pause()
                    .start();
                    }}
                />
                </h2>
             
                
             </div>

          </div>
        </div> 
        {/*right*/}
        <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
            {/* header */}

            <header className='flex items-center justify-between'>
                <Link href={'/'}>
                <h1 className='w-52 cursor-pointer text-xl 
                    font-extralight sm:w-80 '>
                    The{' '} 
                    <span className='font-extrabold underline 
                    decoration-purple-600/50'>
                        Atul-Jaiss</span> {' '}
                    NFT Market Place
                </h1>
                </Link>
                <button onClick={()=>{
                    address? disconnect():connectWithMetamask()
                }} className='rounded-full bg-purple-500 px-4 py-2
                 text-xs font-bold text-white lg:px-5 lg:py-3'>
                     {address?'Sign out':'Sign in'}</button>
            </header>
            <hr className='my-2 border' />
            {address && (
                <p className='text-center text-sm text-green-600'>
                    You're login in with wallet {address.substring(0,5)}...{address.substring(address.length-5)}</p>
            )}
            {/* content */}
            <div className='mt-10 flex flex-1 flex-col items-center 
            space-y-6 text-center lg:space-y-0 lg:justify-center'>
                <img className='w-80 object-cover pb-10 lg:h-40' src={urlFor(collection.mainImage).url()} 
                alt="" ></img>
                <h1 className='text-3xl font-bold lg:font-extrabold
                lg:text-5xl'>
                <Typewriter
                    onInit={(typewriter) => {
                    typewriter.typeString(
                         `${collection.title} `
                    ).start()
                }}
                />
                </h1>
                {loading?(<p className='text-green-500 animate-bounce mt-3'>Loading Supply Count...</p>):(
                <p className='pt-2 text-xl text-bold text-green-500'>
                    {claimedSupply} / {totalSupply?.toString()} NFT's claimed</p>
                    )
                }
                {
                 loading &&
                 <img className='h-80 w-80 object-contain'
                 src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"></img>
                }
            </div>
            
    <div>
      
      
    </div>

            {/* Mint button*/}
            <button disabled={loading || claimedSupply===totalSupply?.toNumber()
            || !address } 
            className='h-16 bg-purple-600 w-full text-white 
            font-bold rounded-full disabled:bg-gray-400'
            onClick={mintNft}>
              {loading? (
                <>Loading...</>
              ):claimedSupply===totalSupply?.toNumber()?(
                <>Sold Out</>
              ):!address?(
                <>Sign In to Mint</>
              ):(
                <span>Mint NFT ({priceInEth})</span>
              )
              }
                
            </button>
        </div> 
    </div>

  )
}

export default NFTDropPage
export const getServerSideProps: GetServerSideProps = async({params})=>{
    const query = `*[_type == 'collection' && slug.current == $id][0]{
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
      const collection = await  sanityClient.fetch(query,{
          id:params?.id
      })
      if(!collection){
          return{
          notFound:true
      }
    }
    return {
          props:{
            collection
          }
      }
}