import Head from 'next/head';
import { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Paragraph1 from '../components/index/paragraph1';
import Paragraph2 from '../components/index/paragraph2';
import Paragraph3 from '../components/index/paragraph3';
import Paragraph4 from '../components/index/paragraph4';
import { useMetaplex } from '../hooks/useMetaplex';
import GetAllAddress from './api/back/get-all-address';
import AddAddress from './api/back/add-address';
import AddAuctionHouseAddress from './api/back/add-auction-house-address';
import GetAuctionHouseAddress from './api/back/get-auction-house-address';
import Admin from './admin/index';
import s from './styles.module.scss';

import Link from 'next/link';
import axios from 'axios';

// mui inports
import { Button, useMediaQuery } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import AppContainer from '../components/common/container';
import Image from 'next/image';
import { Cairo } from '../public/fonts/cairo/local-font';
import { Keypair } from '@solana/web3.js';
import { toMetaplexFileFromBrowser } from '@metaplex-foundation/js';

const buttonRootStyle = {
  padding: '4px 36px',

  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '16px',
  lineHeight: '42px',
  /* identical to box height, or 262% */

  letterSpacing: '0.744416px',

  color: '#FFFFFF',
  borderRadius: '8px',

  textTransform: 'none !important',
};
export default function ExplorePage() {
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const [themeMode, setThemeMode] = useState(true);
  const { t } = useTranslation('common');
  const [video, setVideo] = useState<File>();

  useEffect(() => {
    const test = async () => {
      const { auctionHouse } = await metaplex.auctionHouse().create({
        sellerFeeBasisPoints: 1000,
        requiresSignOff: false,
        canChangeSalePrice: true,
        feeWithdrawalDestination: metaplex.identity().publicKey,
        treasuryWithdrawalDestinationOwner: metaplex.identity().publicKey,
      });
      console.log("RESULT", auctionHouse);
      
    }
    // const addUser = async () => {
    //   const allAddresses = await GetAllAddress();
    //   if (allAddresses.length > 0) {
    //     const result = await allAddresses.filter((p) => {
    //       if (p.address === publicKey.toBase58()) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     });
    //     if (publicKey && !result) {
    //       await AddAddress(publicKey);
    //     }
    //   } else {
    //     if (publicKey) {
    //       await AddAddress(publicKey);
    //     }
    //   }
    // };

    // const generateNewKey = async () => {
    //   console.log(Keypair.generate());

    // }
    // generateNewKey()
    metaplex && publicKey;
  }, [metaplex, publicKey]);
  const matchesDesktop = useMediaQuery('(min-width:905px)');
  return (
    <div>
      <Head>
        <title>GOLDOR</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Header current={0}></Header>
      {!matchesDesktop ? (
        <main className={s['main-page-mobile']}>
          <AppContainer>
            <div className="content-page__mobile content-landing__mobile">
              <div className="content-landing__mobile__block-wrapper">
                <div className="content-landing-block-1__mobile">
                  <div className="content-landing-block-1__mobile__content">
                    <h1 className="content-landing-block-1__mobile__title">
                      {t('main.discoverCollectAndSellNFTs')}
                    </h1>
                    <p className="content-landing-block-1__mobile__description">
                      {t('main.createAnCurateNFTs')}
                    </p>
                  </div>
                  <div className="content-landing-block-1__mobile__actions">
                    <Link href="/nft/create" passHref legacyBehavior>
                      <Button
                        variant="contained"
                        sx={{
                          ...buttonRootStyle,
                          background:
                            'linear-gradient(141.56deg, #365FFA -4.76%, #A736E0 120.26%) !important',
                        }}
                      >
                        {t('header.createNft')}
                      </Button>
                    </Link>
                    <Link href="collections" passHref legacyBehavior>
                      <Button
                        variant="outlined"
                        sx={{
                          ...buttonRootStyle,
                          border:
                            '1px solid rgba(255, 255, 255, 0.16) !important',
                        }}
                      >
                        {t('header.myCollection')}
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="content-landing-block-2__mobile">
                  <div className="content-landing-block-2__mobile__sub-image-main">
                    <Image
                      src={'/assets/jpg/mainPage.png'}
                      alt=""
                      width={638}
                      height={510}
                    ></Image>
                  </div>
                </div>
              </div>
            </div>
          </AppContainer>
        </main>
      ) : (
        <main className={s['main-page']}>
          <AppContainer>
            <div className="content-page content-landing">
              <div className="content-landing__block-wrapper">
                <div className="content-landing-block-1">
                  <div className="content-landing-block-1__content">
                    <h1 className="content-landing-block-1__title">
                      {t('main.discoverCollectAndSellNFTs')}
                    </h1>
                    <p className="content-landing-block-1__description">
                      {t('main.createAnCurateNFTs')}
                    </p>
                  </div>
                  <div className="content-landing-block-1__actions">
                    <Link href="/nft/create" passHref legacyBehavior>
                      <Button
                        variant="contained"
                        sx={{
                          ...buttonRootStyle,
                          background:
                            'linear-gradient(141.56deg, #365FFA -4.76%, #A736E0 120.26%) !important',
                        }}
                      >
                        {t('header.createNft')}
                      </Button>
                    </Link>
                    <Link href="collections" passHref legacyBehavior>
                      <Button
                        variant="outlined"
                        sx={{
                          ...buttonRootStyle,
                          border:
                            '1px solid rgba(255, 255, 255, 0.16) !important',
                        }}
                      >
                        {t('header.myCollection')}
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="content-landing-block-2">
                  <div className="content-landing-block-2__sub-image-main">
                    <Image
                      src={'/assets/jpg/mainPage.png'}
                      alt=""
                      width={638}
                      height={510}
                    ></Image>
                  </div>
                </div>
              </div>
            </div>
          </AppContainer>
        </main>
      )}

      <Footer></Footer>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
