import Head from 'next/head';
import { useState, useRef, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/free-regular-svg-icons';
import Header from '../../components/header';
import Footer from '../../components/footer';
import ArtGallery4 from '../../components/explore/art-gallery4';
import axios from 'axios';
import { useRouter } from 'next/router';
import SuccessDialog from '../../components/dialog/success';
import LoaderDialog from '../../components/dialog/loader';
import { getCollectionNameById } from '../../utils/collections';
import { categories, Category } from '../../utils/categories';
import InputDialog from '../../components/dialog/input';

import { useMetaplex } from '../../hooks/useMetaplex';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  JsonMetadata,
  Metadata,
  toMetaplexFileFromBrowser,
} from '@metaplex-foundation/js';

import {
  MenuItem,
  TextField,
  Select,
  InputAdornment,
  Button,
  Modal,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import NftList from '../../components/nft/list';
import { Nft } from '../../infrastructure/class/nft';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import AppContainer from '../../components/common/container';

export default function NftPurchasedPage() {
  const { t } = useTranslation('common');
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const router = useRouter();
  const providerChanged = (provider) => {
    provider.on('accountsChanged', (_) => window.location.reload());
    provider.on('chainChanged', (_) => window.location.reload());
  };

  const [nftContract, setNFtContract] = useState(null);
  const [marketContract, setMarketContract] = useState(null);
  const [nftAddress, setNFtAddress] = useState(null);
  const [marketAddress, setMarketAddress] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [newPrice, setNewPrice] = useState(0);
  const [resellItems, setResellItems] = useState([]);

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
    let arr = purchasedItems;

    if (categoryFilter || searchFilter) {
      arr = purchasedItems.filter((item, index) => {
        if (item.attributes) {
          if (
            categoryFilter &&
            item.attributes[0]?.value !== ' ' &&
            item.attributes[0]?.value !== categoryFilter
          ) {
            return false;
          }

          if (
            searchFilter &&
            !item.name.toLowerCase().includes(searchFilter.toLowerCase().trim())
          )
            return false;
          return true;
        } else {
          if (categoryFilter && item.category !== categoryFilter) return false;
          if (
            searchFilter &&
            !item.name.toLowerCase().includes(searchFilter.toLowerCase().trim())
          )
            return false;
          return true;
        }
      });
    }
    return arr;
  }, [purchasedItems, categoryFilter, searchFilter]);

  const [isLoading, SetIsLoading] = useState(true);

  const goToNft = (nft: Nft) => {
    router.push(`/nft/${nft.address.toBase58()}`);
    // router.push(`/market/${nft.address.toBase58()}`);
  };

  useEffect(() => {
    const LoadNFTs = async () => {
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

            let nonCollection = {};
            if (!nft.collectionDetails) {
              const attributes = data.attributes
                ? data.attributes
                : [
                    {
                      traint_type: 'category',
                      value:
                        data.category !== undefined
                          ? data.category.toLowerCase()
                          : '',
                    },
                  ];

              // @ts-ignore
              const newAttributes = attributes[0].category
                ? // @ts-ignore
                  [
                    {
                      traint_type: 'category',
                      value:
                        attributes[0].category !== undefined
                          ? attributes[0].category.toLowerCase()
                          : '',
                    },
                  ]
                : attributes;

              const update = newAttributes.filter((p) => {
                if (
                  p.traint_type === 'category' &&
                  p.value !== '' &&
                  p.value !== undefined &&
                  p.value !== null
                ) {
                  return p;
                }
              });

              nonCollection = {
                ...nft,
                creator: nft.creators[0].address.toBase58(),
                mintAddress: data.mint,
                attributes: newAttributes,
                image: data.image,
                category: data.category ?? '',
              };
              return nonCollection;
            }

            // const resultNft = {
            //   ...nft,
            //   creator: nft.creators[0].address.toBase58(),
            //   mintAddress: data.mint,
            //   attributes: data.attributes ?? [],
            //   image: data.image,
            //   category: data.category ?? '',
            // };
            // console.log('RESULT NFT: ', resultNft);
            // return resultNft
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

    base58 && LoadNFTs();
  }, [base58, metaplex]);
  let [priceOpen, setPriceOpen] = useState(false);
  let inputPriceRef = useRef(null);
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
    closePriceModal();
    setLoaderOpen(true);

    setTimeout(purchaseSuccesss, 1000);
  }

  function closeSuccessModal() {
    closePriceModal();
    closeLoaderModal();
    setSuccessOpen(false);
  }

  function openSuccessModal() {
    setSuccessOpen(true);
  }

  function purchaseSuccesss() {
    closeLoaderModal();
  }

  const matchesDesktop = useMediaQuery('(min-width:905px)');

  return (
    <>
      <Head>
        <title>{t('nfts.myNFT')}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={-1}></Header>
      <AppContainer>
        <div className="content-page">
          <div className="content-page__header">
            <div className="content-page__title">{t('nfts.myNFT')}</div>
            <div className="content-page__description">
              {t('nfts.allYourNFTS')}
            </div>
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
                  {t(`categories.${categoryFilter}`) ??
                    t('auction.allCategories')}
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

                      minWidth: `${matchesDesktop ? '796px' : '100%'}`,
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
                          width: `${matchesDesktop ? '154px' : '100%'}`,
                          height: `${matchesDesktop ? '140px' : '70px'}`,
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
                            width: `${matchesDesktop ? '154px' : '100%'}`,
                            height: `${matchesDesktop ? '140px' : '70px'}`,
                            borderWidth: '1px',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: `${
                              matchesDesktop ? 'column' : 'row'
                            }`,
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
                            <img
                              src={item.icon}
                              width={matchesDesktop ? '50px' : '25px'}
                              alt=""
                            />
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
              <NftList
                items={filteredPurchasedItems}
                onItemClick={(nft) => goToNft(nft)}
                // onItemClick={(nft) => {}}
              />
            </div>
            <SuccessDialog show={false} closeSuccessModal={closeSuccessModal}>
              {{
                msg: 'PLease Connect Metamask With Goerli Network',
                title: 'Attention',
                buttonTitle: 'Cancel',
              }}
            </SuccessDialog>
            <LoaderDialog
              show={loaderOpen}
              openLoaderModal={openLoaderModal}
            ></LoaderDialog>
          </div>
        </div>
      </AppContainer>
      <Footer></Footer>
    </>
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
