import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Web3 from 'web3';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/header';
import Footer from '../../components/footer';
import NFTItemCard from '../../components/explore/NFTItemCard';
import LoaderDialog from '../../components/dialog/loader';
import { getCollectionNameById } from '../../utils/collections';
import { useMetaplex } from '../../hooks/useMetaplex';
import { PublicKey } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';

interface INFTItemCardObj {
  jsonName: string;
  jsonImage: string;
  address: string;
  jsonDescription: string;
  jsonCategory: string;
  jsonTags: [];
  collection: string;
  jsonAttributes: [];
}

export default function SingleNftItem() {
  const [uniqid, setuniqid] = useState('');
  const [uniqtoken, setuniqtoken] = useState('');
  const [nft, setNft] = useState({});
  const [validToViewSinglePost, setValidToViewSinglePost] = useState(false);

  let [priceOpen, setPriceOpen] = useState(false);
  let [loaderOpen, setLoaderOpen] = useState(false);
  let [successOpen, setSuccessOpen] = useState(false);

  const [singleItem, setSingleItem] = useState<INFTItemCardObj>();
  const [isLoading, setIsLoading] = useState(true);

  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const router = useRouter();

  const { itemId } = router.query;
  const { id } = router.query;

  useEffect(() => {
    const initialize = (token, id) => {
      if (token && id) {
        setuniqid(id);
        setuniqtoken(token);
      } else {
        const href = window.location.href;
        const arr = href.split('/');
        const arr2 = arr[4].split('?id=');
        arr2[1] ? setuniqid(arr2[1]) : '';
        arr2[0] ? setuniqtoken(arr2[0]) : '';
      }
    };

    const getAllDataNFT = async () => {
      if (publicKey) {
        const nfts = await metaplex.nfts().findAllByOwner({
          owner: publicKey,
        });

        let address = nfts.filter((p) => {
          return p.address.toBase58() === itemId;
        });

        const nft = await metaplex.nfts().findByMint({
          //@ts-ignore
          mintAddress: address[0].mintAddress,
        });
        setNft(nft);
        // setSingleItem();

      }
    };
    getAllDataNFT();
    initialize(itemId, id);
  }, []);

  const buyNFT = () => {};

  function closePriceModal() {
    setPriceOpen(false);
  }

  function openPriceModal() {
    setPriceOpen(true);
  }

  function closeLoaderModal() {
    setLoaderOpen(false);
  }

  function openLoaderModal() {
    setLoaderOpen(true);
  }

  function closeSuccessModal() {
    setSuccessOpen(false);
  }

  function openSuccessModal() {
    setSuccessOpen(true);
  }

  return (
    <>
      <Head>
        <title>Beautiful Artwork</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={-1}></Header>

      <div className="bg-[#0D0F23] dark:bg-white">
        <div className="w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto">
          <div className="flex flex-col mx-8 sm:mx-16 lg:mx-[9vw] space-y-6 py-12">
            <div className="flex flex-col space-y-12">
              {/* <NFTItemCard data={}>{nft}</NFTItemCard> */}

              <div className="flex flex-cols items-center">
                <h1 className="flex-grow text-white text-2xl sm:text-4xl font-bold">
                  {/* Related {singleItem.category} Nfts{' '} */}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <LoaderDialog
          show={loaderOpen}
          openLoaderModal={openLoaderModal}
        ></LoaderDialog>
      </div>
      <Footer></Footer>
    </>
  );
}
