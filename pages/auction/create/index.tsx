import { useState, useRef, useMemo, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import AuctionCard from '../../../components/auction/card';
import {
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Modal,
  Box,
  useMediaQuery,
} from '@mui/material';

import AppModal, { IAppModalRef } from '../../../components/common/modal';
import s from './styles.module.scss';
import NftList from '../../../components/nft/list';
import axios from 'axios';
import { useMetaplex } from '../../../hooks/useMetaplex';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  AuctionHouse,
  JsonMetadata,
  Metadata,
  WRAPPED_SOL_MINT,
  sol,
} from '@metaplex-foundation/js';
import { useRouter } from 'next/router';
import { PublicKey } from '@solana/web3.js';
import GetAuctionHouseAddress from '../../api/back/get-auction-house-address';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AppContainer from '../../../components/common/container';
import CreateAuctionPageAdaptive from '../adaptive/create-adaptive/index-create-adaptive';

const buttonRootStyle = {
  padding: '4px 32px',

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

const CreateAuctionPage: NextPage = () => {
  const { t } = useTranslation('common');
  // Calculating date picker default and min values
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const router = useRouter();
  // const [usdt, setUsdt] = useState('');
  const currentDate = new Date();

  const [purchasedItems, setPurchasedItems] = useState([]);
  const [modalState, setModalState] = useState({
    opened: false,
    title: t('create.loading'),
  });
  const [selectedNft, setSelectedNft] = useState(null);
  const [price, setPrice] = useState(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const modal = useRef<IAppModalRef>(null);

  const openSelectorForSaleNFT = async () => {
    if (modal.current) {
      await getAllNfts();
      modal.current.open();
    }
  };

  const openSelectorForSaleCollection = async () => {
    if (modal.current) {
      await getCollectionNfts();
      modal.current.open();
    }
  };

  const selectNft = (nft) => {
    console.log(nft.data);

    setPrice(nft.data.maxPrice ? nft.data.maxPrice : nft.data.price);
    setSelectedNft(nft);
    if (modal.current) {
      modal.current.close();
    }
  };

  const getAllNfts = async () => {
    const myNfts = await metaplex.nfts().findAllByOwner({
      owner: metaplex.identity().publicKey,
    });

    const loadedItems = await Promise.all(
      myNfts
        .filter((nft) => {
          return nft.uri.includes('arweave');
        })
        .map(async (nft) => {
          const { data } = await axios.get(nft.uri);

          const resultNft = {
            ...nft,
            creator: nft.creators[0].address.toBase58(),
            data: data,
            image: data.image,
            attributes: data.attributes,
          };
          return resultNft;
        }),
    );

    const results = loadedItems.filter((element) => {
      if (element !== undefined) {
        return true;
      }

      return false;
    });
    setPurchasedItems(results);
  };

  const getCollectionNfts = async () => {
    const myNfts = await metaplex.nfts().findAllByOwner({
      owner: metaplex?.identity().publicKey,
    });

    const loadedItems = await Promise.all(
      myNfts
        .filter((nft) => {
          if (nft.collectionDetails) {
            return nft;
          }
        })
        .map(async (nft: Metadata<JsonMetadata<string>>) => {
          const { data } = await axios.get(nft.uri);

          return {
            ...nft,
            creator: nft.creators[0].address.toBase58(),
            id: nft.mintAddress.toBase58(),
            attributes: data.attributes,
            image: data.image,
            data: data,
          };
        }),
    );

    const results = loadedItems.filter((element) => {
      if (element !== undefined) {
        return true;
      }

      return false;
    });
    setPurchasedItems(results);
  };

  const getAuctionByCreator = async (): Promise<AuctionHouse> => {
    try {
      const auctionHouseAddress = await GetAuctionHouseAddress();

      const getCreator = await metaplex.auctionHouse().findByCreatorAndMint({
        creator: new PublicKey(auctionHouseAddress.auctionHouseAddress),
        treasuryMint: WRAPPED_SOL_MINT
      })
    
      const auction = await metaplex.auctionHouse().findByAddress({
        address: getCreator.address,
      });

      return auction;
    } catch (error) {
      console.error('Error Get Auction By Creator: ', error);
    }
  };

  const createList = async (auction: AuctionHouse, mintAccount: any) => {
    try {
      const myNfts = await metaplex.nfts().findAllByOwner({
        owner: metaplex?.identity().publicKey,
      });
      const nfts = myNfts.filter((nft) => {
        if (
          nft.collection &&
          nft.collection?.address?.toBase58() ===
            selectedNft.mintAddress.toBase58()
        ) {
          return nft;
        }
      });

      for (const nft of nfts) {
        const nftsWithJson = await metaplex.storage().downloadJson(nft.uri);
        const { listing } = await metaplex.auctionHouse().list({
          auctionHouse: auction,
          // @ts-ignore
          mintAccount: nft.mintAddress,
          //@ts-ignore
          price: sol(nftsWithJson.maxPrice),
        });
      }
      const { listing } = await metaplex.auctionHouse().list({
        auctionHouse: auction,
        mintAccount: mintAccount,
        price: sol(price),
      });

      // return {};
      return listing;
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  // useEffect(() => {
  //   const converter = async () => {
  //     const { data } = await axios.get(
  //       'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
  //     );
  //     setUsdt(data.price);
  //   };
  //   converter();
  // });

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const auction = await getAuctionByCreator();

    try {
      setModalState({
        opened: true,
        title: t('create.creatingLot'),
      });
      const list = await createList(auction, selectedNft.mintAddress);

      // router.push('/auction');
    } catch (error) {
      setModalState({
        opened: false,
        title: t('create.failingCreatingLot'),
      });
      console.error(error);
    }

    router.push('/auction');
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#031428',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
    color: '#fff',
    h4: {
       
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '24px',
      lineHeight: '40px',
      /* identical to box height, or 167% */

      textAlign: 'center',
      letterSpacing: '0.744416px',

      /* Typography/Сolor 1 */

      color: '#FFFFFF',
    },
    div: {
      display: 'flex',
      justifyContent: 'center',
    },
  };
  const matchesDesktop = useMediaQuery('(min-width:905px)');
  return (
    <>
      <Head>
        <title>GOLDOR | Create auction lot</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header current={2} />
      <AppContainer>
        {!matchesDesktop ? (
          <CreateAuctionPageAdaptive></CreateAuctionPageAdaptive>
        ) : (
          <div className="content-page">
            <Modal open={modalState.opened}>
              <Box sx={style}>
                <h4>{modalState.title}</h4>
                <div>
                  <CircularProgress />
                </div>
              </Box>
            </Modal>
            <div className="content-page__header">
              <div className="content-page__chart">
                <div className="content-page__title">
                  {t('auction.create.createLot')}
                </div>
                {/* {usdt !== '' ? (
                <div className="content-page__chart__title">
                  1 SOL = ${usdt.replace(/(\.\d*?[1-9])0+$/g, '$1')}
                </div>
              ) : (
                <></>
              )} */}
              </div>
            </div>
            <div className="content-page__content">
              <form className="content-page__form" onSubmit={submitFormHandler}>
                <div className="content-page__form-content">
                  <div className="content-page__form-block">
                    <div className="content-page__form-block__description">
                      {t('auction.create.selectAnNFTOrCollection')}
                    </div>
                    <div className="content-page__form-block__group">
                      <Button
                        variant="outlined"
                        sx={{
                          ...buttonRootStyle,
                          border:
                            '1px solid rgba(255, 255, 255, 0.16) !important',
                        }}
                        onClick={openSelectorForSaleNFT}
                      >
                        {t('auction.create.selectNFT')}
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          ...buttonRootStyle,
                          border:
                            '1px solid rgba(255, 255, 255, 0.16) !important',
                        }}
                        onClick={openSelectorForSaleCollection}
                      >
                        {t('auction.create.selectCollection')}
                      </Button>
                    </div>
                  </div>

                  <div className="content-page__form-block">
                    <div className="content-page__form-block__description">
                      {t('auction.create.startPrice')}
                    </div>
                    <TextField
                      placeholder={t('auction.create.enterPrice')}
                      type="number"
                      value={price ? price : ''}
                      inputProps={{
                        step: 0.01,
                        min: 0,
                        inputMode: 'decimal',
                      }}
                      sx={{
                        '.MuiOutlinedInput-input': {
                          paddingLeft: '20px',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          fontSize: '16px',
                          lineHeight: '42px',
                          height: '42px',
                        },
                      }}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            sx={{
                              '.MuiTypography-body1': {
                                 
                                fontStyle: 'normal',
                                fontWeight: '500',
                                fontSize: '16px',
                                lineHeight: '42px',
                                letterSpacing: '0.5px',
                                color: 'rgba(255, 255, 255, 0.4)',
                              },
                            }}
                          >
                            SOL
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </div>

                  <div className="content-page__form-actions">
                    <Button
                      sx={{
                        ...buttonRootStyle,
                        minWidth: '189px',
                        background:
                          'linear-gradient(141.56deg, #365FFA -4.76%, #A736E0 120.26%) !important',
                      }}
                      type="submit"
                      disabled={false}
                    >
                      {t('auction.create.createLot')}
                    </Button>
                  </div>
                </div>
                <div className="content-page__form-preview">
                  <AuctionCard
                    isPreview={selectedNft ? false : true}
                    name={selectedNft?.name}
                    image={selectedNft?.data.image}
                    creator={selectedNft?.creator}
                    categoryName={selectedNft?.attributes[0].value}
                    price={price}
                    receiptAddress=""
                    entityType={'nft'}
                    dateEnd=""
                  />
                  <i className="dummy-bg" />
                </div>
              </form>
            </div>
          </div>
        )}

        <AppModal ref={modal}>
          <div className={s['auction-list-modal']}>
            <NftList items={purchasedItems} onItemClick={selectNft} />
          </div>
        </AppModal>
      </AppContainer>

      <Footer />
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default CreateAuctionPage;
