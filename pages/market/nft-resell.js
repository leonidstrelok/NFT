import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import Header from '../../components/header';
import Footer from '../../components/footer';
import ArtGallery5 from '../../components/explore/art-gallery5';
import axios from 'axios';
import { useRouter } from 'next/router';
import SuccessDialog from '../../components/dialog/success';
import LoaderDialog from '../../components/dialog/loader';
import { getCollectionNameById } from '../../utils/collections';
export default function NFtResell() {
  const router = useRouter();
  const providerChanged = (provider) => {
    provider.on('accountsChanged', (_) => window.location.reload());
    provider.on('chainChanged', (_) => window.location.reload());
  };

  let [priceOpen, setPriceOpen] = useState(false);
  let [loaderOpen, setLoaderOpen] = useState(false);
  let [successOpen, setSuccessOpen] = useState(false);

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

  const [nftContract, setNFtContract] = useState(null);
  const [marketContract, setMarketContract] = useState(null);
  const [nftAddress, setNFtAddress] = useState(null);
  const [marketAddress, setMarketAddress] = useState(null);
  const [purchasedItems, setpurchasedItems] = useState([]);
  const [newPrice, setNewPrice] = useState(0);
  const [resellItems, setResellItems] = useState([]);

  const [isLoading, SetIsLoading] = useState(true);

  const resellItemFunction = async (item, newPrice) => {};

  const cancelResellNFT = async (nftItem) => {
    const convertIdtoInt = Number(nftItem.itemId);
    openLoaderModal();

    if (account) {
      try {
        openLoaderModal();

        const result = await marketContract.methods
          .cancelResellWitholdPrice(nftAddress, convertIdtoInt)
          .send({ from: account });
        closeLoaderModal();
        router.reload();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      <Head>
        <title>My Sell Items</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={-1}></Header>

      <div className="bg-[#0D0F23] dark:bg-white">
        <div className="w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto">
          <div className="flex flex-col mx-8 sm:mx-16 lg:mx-[9vw] space-y-6 py-12">
            <div className="flex flex-col space-y-6">
              <h1 className="flex-grow text-white dark:text-gray-800 text-2xl sm:text-4xl font-bold">
                My Sell Items
              </h1>
              {isLoading ? (
                'ISLaoding'
              ) : (
                <ArtGallery5
                  galleries={resellItems}
                  openPriceModal={openPriceModal}
                  closePriceModal={closePriceModal}
                >
                  {{ cancelSellFucnction: cancelResellNFT }}
                </ArtGallery5>
              )}
            </div>
          </div>
        </div>
      </div>
      <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>
        {{
          msg: 'PLease Connect MetaMask With Roposten NetWork',
          title: 'Attention',
          buttonTitle: 'Cancel',
        }}
      </SuccessDialog>
      <LoaderDialog
        show={loaderOpen}
        openLoaderModal={openLoaderModal}
      ></LoaderDialog>

      <Footer></Footer>
    </>
  );
}
