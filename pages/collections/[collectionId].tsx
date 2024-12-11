import { useState, useRef, useEffect, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { AuctionCard } from '../../components/card/auction-card';
import { Tag } from '../../components/tag/tag';
import { CategoryTag } from '../../components/tag/category-tag';
import { categories, Category } from '../../utils/categories';
import {
  MenuItem,
  TextField,
  Select,
  InputAdornment,
  Button,
  Modal,
  Typography,
  Box,
} from '@mui/material';
import Sticky from 'react-stickynode';
import { PublicKey } from '@solana/web3.js';
import { useMetaplex } from '../../hooks/useMetaplex';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Sft,
  SftWithToken,
  Nft,
  NftWithToken,
  JsonMetadata,
  Metadata,
} from '@metaplex-foundation/js';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AppContainer from '../../components/common/container';
import ReactPlayer from 'react-player';
import NftCard from '../../components/nft/card';

export default function CollectionItemPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');

  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  // const [usdt, setUsdt] = useState('');

  const [isUser, setIsUser] = useState<boolean>(false);
  const [nfts, setNfts] = useState([]);
  const [collection, setCollection] = useState<
    Sft | SftWithToken | Nft | NftWithToken
  >();
  const [collectionMetadata, setCollectionMetadata] =
    useState<JsonMetadata<string>>();
  // const [collectionData, setCollectionData] = useState<NftData>();

  useEffect(() => {
    setIsUser(true);
  }, []);

  useEffect(() => {
    const LoadCollection = async () => {
      const { collectionId } = router.query;
      if (collectionId) {
        const mintAddress = new PublicKey(collectionId);

        const collectionResult = await metaplex.nfts().findByMint({
          mintAddress,
        });
        console.log(collectionResult, 'COLLECTION RESULT');

        setCollection(collectionResult);
        setCollectionMetadata(collectionResult.json);
      }
      // const converter = async () => {
      //   const { data } = await axios.get(
      //     'https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT',
      //   );
      //   setUsdt(data.price);
      // };
      // converter();
    };

    base58 && LoadCollection();
  }, [base58, router]);

  useEffect(() => {
    const LoadNFTs = async () => {
      const myNfts = await metaplex.nfts().findAllByOwner({
        owner: metaplex?.identity().publicKey,
      });

      const loadedItems = await Promise.all(
        myNfts
          .filter((nft) => {
            if (
              nft.collection &&
              nft.collection.verified &&
              nft.collection.address.toBase58() ==
                collection.mint.address.toBase58()
            ) {
              return nft;
            }
          })
          .map(async (nft: Metadata<JsonMetadata<string>>) => {
            const { data } = await axios.get(nft.uri);
            let category = '';
            if (data.attributes) {
              if (data.attributes[0].traint_type !== undefined) {
                category = data.attributes[0].value;
              } else {
                category = data.attributes[0].category;
              }
            }

            return {
              ...data,
              creator: nft.creators[0].address.toBase58(),
              id: nft.mintAddress.toBase58(),
              category: category,
            };
          }),
      );

      setNfts(loadedItems);
    };

    base58 && collection && LoadNFTs();
  }, [base58, collection]);

  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const handleCategoriesModalOpen = () => setCategoriesModalOpen(true);
  const handleCategoriesModalClose = () => setCategoriesModalOpen(false);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const handleSetCategoryFilter = (filter) => {
    setCategoryFilter(filter);
    handleCategoriesModalClose();
  };
  const filteredPurchasedItems = useMemo(() => {
    let arr = nfts;
    if (categoryFilter || searchFilter) {
      arr = nfts.filter((item, index) => {
        if (categoryFilter && item.attributes[0].value !== categoryFilter)
          return false;
        if (
          searchFilter &&
          !item.name.toLowerCase().includes(searchFilter.toLowerCase().trim())
        )
          return false;
        return true;
      });
    }
    return arr;
  }, [nfts, categoryFilter, searchFilter]);

  return (
    <div>
      <Head>
        <title>GOLDOR | Collection Item</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header current={2} />
      <div className="content-page ">
        <img
          className="content-page__banner"
          src={collectionMetadata?.banner as string}
          alt=""
        />
        <div className="content-page__logo">
          <div>
            <img src={collectionMetadata?.logo as string} alt="" />
          </div>
        </div>
        <AppContainer>
          <div className="content-page__header">
            <div className="content-page__chart">
              <h2 className="content-page__title">
                {collectionMetadata?.name}
              </h2>
              {/* {usdt !== '' ? (
                <div className="content-page__chart__title">
                  1 SOL = ${usdt.replace(/(\.\d*?[1-9])0+$/g, '$1')}
                </div>
              ) : (
                <></>
              )} */}
            </div>
            {collectionMetadata?.description !== '' && (
              <p className="content-page__description">
                {collectionMetadata?.description}
              </p>
            )}
            {collectionMetadata?.collectionVideo !== null && isUser && (
              <ReactPlayer
                //@ts-ignore
                url={collectionMetadata?.collectionVideo}
                controls
              />
            )}
          </div>
          <div className="content-page__content">
            <div className="content-page__action-bar">
              <TextField
                className="content-page__search-field"
                variant="outlined"
                placeholder={t('nfts.searchedByNFTS')}
                onChange={(e) => setSearchFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src="/assets/svg/search.svg" alt="" />
                    </InputAdornment>
                  ),
                }}
              ></TextField>
              <div className="content-page__filter-wrapper">
                <div className="content-page__filter-counter">
                  {filteredPurchasedItems.length % 10 === 1
                    ? `${filteredPurchasedItems.length} ${t('nfts.item')}`
                    : `${filteredPurchasedItems.length} ${t('nfts.items')}`}
                </div>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleCategoriesModalOpen}
                  sx={{
                    borderRadius: '8px',
                    height: '40px',
                    width: 'max-content',
                    color: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.06) !important',
                    textTransform: 'none',
                    padding: '4px 16px',
                    paddingRight: '12px',
                    ':hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                      cursor: 'pointer',
                    },
                  }}
                  endIcon={<img src="/assets/svg/arrow_right.svg" alt="" />}
                >
                  {categoryFilter ?? t('auction.allCategories')}
                </Button>
                <Modal
                  open={categoriesModalOpen}
                  onClose={handleCategoriesModalClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={{
                      color: '#fff',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',

                      minWidth: '796px',
                      backgroundColor: 'rgba(3, 20, 40, 1)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0px 20px 40px rgba(13, 16, 35, 0.6)',
                      borderRadius: '20px',
                      p: 4,
                    }}
                  >
                    <Typography
                      id="modal-modal-title"
                      sx={{
                         
                        fontStyle: 'normal',
                        fontWeight: '500',
                        fontSize: '24px',
                        lineHeight: '40px',
                        /* identical to box height, or 150% */

                        letterSpacing: '0.744416px',
                      }}
                    >
                      {t('auction.selectCategory')}
                    </Typography>
                    <Typography
                      id="modal-modal-description"
                      sx={{
                        mt: 2,
                        color: 'rgba(255, 255, 255, 0.7)',
                         
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '16px',
                        lineHeight: '24px',
                        /* identical to box height, or 150% */

                        letterSpacing: '0.744416px',
                      }}
                    >
                      {t('auction.maxSelectOneCategory')}
                    </Typography>
                    <Box
                      className="modal-category-list"
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '20px',
                        marginTop: '42px',
                      }}
                    >
                      <Button
                        className="modal-category-item"
                        variant="outlined"
                        onClick={() => handleSetCategoryFilter(null)}
                        sx={{
                          width: '154px',
                          height: '140px',
                          borderWidth: '1px',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '24px 40px 12px',
                          gap: '12px',
                           
                          fontStyle: 'normal',
                          fontWeight: '500',
                          fontSize: '16px',
                          /* identical to box height, or 262% */
                          textAlign: 'center',
                          letterSpacing: '0.744416px',
                          color: '#FFFFFF',
                          textTransform: 'capitalize',
                        }}
                      >
                        <div className="modal-category-title">
                          {t('auction.allCategories')}
                        </div>
                      </Button>
                      {categories.map((item, index) => (
                        <Button
                          className="modal-category-item"
                          variant="outlined"
                          onClick={() => handleSetCategoryFilter(item.name)}
                          key={index}
                          sx={{
                            width: '154px',
                            height: '140px',
                            borderWidth: '1px',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '24px 40px 12px',
                            gap: '12px',
                             
                            fontStyle: 'normal',
                            fontWeight: '500',
                            fontSize: '16px',
                            /* identical to box height, or 262% */
                            textAlign: 'center',
                            letterSpacing: '0.744416px',
                            color: '#FFFFFF',
                            textTransform: 'capitalize',
                          }}
                        >
                          {Boolean(item.icon) && (
                            <img src={item.icon} width="50px" alt="" />
                          )}
                          <div className="modal-category-title">
                            {t(`categories.${item.name}`)}
                          </div>
                        </Button>
                      ))}
                    </Box>
                  </Box>
                </Modal>
              </div>
            </div>
            <div className="content-nft-purchased__nft-list">
              {filteredPurchasedItems.map((item, index) => (
                <NftCard
                  key={index}
                  id={item.id}
                  // usdt={usdt}
                  categoryName={item.attributes[0].value}
                  name={item.name}
                  symbol={item.symbol}
                  royality={item.royality}
                  creator={
                    item.creator.slice(0, 7) +
                    '...' +
                    item.creator.slice(-4) +
                    ' (You)'
                  }
                  price={item.nftPrice}
                  image={item.image}
                  currency="SOL"
                  onClick={() => {}}
                  // onClick={(id) => router.push(`/nft/${id}`)}
                />
              ))}
            </div>
          </div>
        </AppContainer>
      </div>
      <Footer />
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

export async function getStaticPaths({ locale }) {
  return {
    paths: [
      // String variant:
      '/collections/123',
      // Object variant:
      {
        params: {
          collectionId: 'A9uL3S2881MFy5DgRtP8RPGhQtVZYQc3mXXa7jMwmbcP',
        },
      },
    ],
    fallback: true,
  };
}
