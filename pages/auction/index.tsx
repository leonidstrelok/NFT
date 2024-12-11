import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  MenuItem,
  Select,
  Button,
  Modal,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { categories } from '../../utils/categories';
import { AuctionCard } from '../../components/card/auction-card';
import { ILot } from '../../infrastructure/interfaces/i-lot';
import AuctionList from '../../components/auction/list';
import {
  amount,
  assertDateTime,
  AuctionHouse,
  FindListingsOutput,
  formatAmount,
  formatDateTime,
  isPurchase,
  Listing,
  Mint,
  now,
  PublicKey,
  sol,
  toDateTime,
  toListing,
  toOptionDateTime,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/js';
import { useMetaplex } from '../../hooks/useMetaplex';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { Nft } from '../../infrastructure/class/nft';
import GetAllAddress from '../api/back/get-all-address';
import GetAuctionHouseAddress from '../api/back/get-auction-house-address';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AppContainer from '../../components/common/container';
import AuctionPageAdaptive from './adaptive/index-adaptive';

export default function AuctionPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const [auctionItems, setAuctionItems] = useState([]);
  const [filterListings, setFilterListings] = useState([]);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const handleCategoriesModalOpen = () => setCategoriesModalOpen(true);
  const handleCategoriesModalClose = () => setCategoriesModalOpen(false);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSetCategoryFilter = (filter) => {
    setCategoryFilter(filter);
    handleCategoriesModalClose();
  };
  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
    handleCategoriesModalClose();
  };
  const matchesDesktop = useMediaQuery('(min-width:905px)');
  const goToLot = (id: string, receiptAddress: string) => {
    router.push(`/auction/${id}?receiptAddress=${receiptAddress}`);
  };

  useEffect(() => {
    const getAuctionByCreator = async () => {
      try {
        const auctionHouseAddress = await GetAuctionHouseAddress();
        const getCreator = await metaplex.auctionHouse().findByCreatorAndMint({
          creator: new PublicKey(auctionHouseAddress.auctionHouseAddress),
          treasuryMint: WRAPPED_SOL_MINT
        })
      
        const auction = await metaplex.auctionHouse().findByAddress({
          address: getCreator.address,
        });
        let allList = [];
        const listingsModel = await metaplex.auctionHouse().findListings({
          auctionHouse: auction,
        });

        if (listingsModel.length != 0) {
          allList.push(...listingsModel);
        }
        allList = allList.filter((p, key) => {
          //@ts-ignore
          if (p.purchaseReceiptAddress !== null) {
            return false;
          } else {
            return true;
          }
        });

        // const newList = [];

        // for (let i = 0; i < allList.length; i++) {
        //   const nft = await metaplex
        //     .nfts()
        //     .findByMetadata({ metadata: allList[i].metadataAddress });

        //   const array = nft.json?.receiptAddressListings as [];

        //   if (array.length === 0) {
        //     newList.push(allList[i]);
        //   } else {
        //     array.filter((p) => {
        //       if (
        //         allList[i].purchaseReceiptAddress === null &&
        //         p !== allList[i].receiptAddress.toBase58()
        //       ) {
        //         newList.push(allList[i]);
        //       }
        //     });
        //   }
        // }

        let listings = [];
        let index = 1;
        for (const listing of allList) {
          const nft = await metaplex
            .nfts()
            .findByMetadata({ metadata: listing.metadataAddress });

          const attributes = nft.json.attributes
            ? nft.json.attributes
            : [{ traint_type: 'category', value: nft.json.category }];

          // @ts-ignore
          const newAttributes = attributes[0].category
            ? // @ts-ignore
              [{ traint_type: 'category', value: attributes[0].category }]
            : attributes;
          if (nft.json?.receiptAddressListings) {
            listings.push({
              id: index,
              auctionHouseId: listing.auctionHouse.creatorAddress.toBase58(),
              author: listing.sellerAddress.toBase58(),
              entityId: listing.metadataAddress.toBase58(),
              entityName: nft.name,
              entityType: nft.collectionDetails ? 'collection' : 'nft',
              receiptAddress: listing.receiptAddress.toBase58(),
              image: nft.json.image,
              entityAmount: nft.collectionDetails
                ? nft.collectionDetails.size.toString()
                : '0',
              attributes: newAttributes,
              price: nft.json.maxPrice,
              // .replace(/(\.\d*?[1-9])0+$/g, '$1'),

              dateStart: '',
              dateEnd: '',
            });
          }

          index++;

        }
        setAuctionItems(listings);
      } catch (error) {
        console.log(error);
      }
    };
    // updateAuction();
    getAuctionByCreator();
  }, [metaplex]);

  const getFilterAuctionItems = useMemo(() => {
    let arr = auctionItems;

    if (categoryFilter || searchFilter || typeFilter) {
      console.log(categoryFilter);

      arr = arr.filter((item, index) => {
        if (
          typeFilter &&
          item.entityType !== typeFilter &&
          typeFilter !== 'all'
        ) {
          return false;
        }

        if (categoryFilter && item.attributes[0].value !== categoryFilter)
          return false;
        // if (searchFilter && !item.name.toLowerCase().includes(searchFilter.toLowerCase().trim()))
        //   return false;
        return true;
      });
    }
    return arr;
  }, [auctionItems, categoryFilter, searchFilter, typeFilter]);

  return (
    <>
      <Head>
        <title>GOLDOR | Auction</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header current={2} />
      <AppContainer>
        {!matchesDesktop ? (
          <AuctionPageAdaptive></AuctionPageAdaptive>
        ) : (
          <div className="content-page">
            <div className="content-page__header">
              <div className="content-page__title">
                {t('auction.sellOrBuy')}
              </div>
              <div className="content-page__description"></div>
            </div>
            <div className="content-page__content">
              <div className="content-page__action-bar">
                <Button
                  sx={{
                    background:
                      'linear-gradient(141.56deg, #365FFA -4.76%, #A736E0 120.26%) !important',
                    padding: '4px 32px',

                     
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '16px',
                    lineHeight: '42px',

                    letterSpacing: '0.5px',

                    color: '#FFFFFF',
                    borderRadius: '8px',

                    textTransform: 'none !important',
                  }}
                  onClick={() => router.push('/auction/create')}
                >
                  {t('auction.chooseNFTForSale')}
                </Button>
                <div className="content-page__filter-wrapper">
                  {/* <div className="content-page__filter-counter">
                {getFilterAuctionItems.length % 10 === 1
                  ? `${getFilterAuctionItems.length} item`
                  : `${getFilterAuctionItems.length} items`}
              </div> */}
                  <Select
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    notched={false}
                    sx={{
                      minWidth: '159px',
                      textAlign: 'left',
                      paddingLeft: '16px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                        fontSize: '14px !important',
                      },
                      borderRadius: '8px',
                      height: '40px',
                      width: 'max-content',
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.06) !important',
                    }}
                  >
                    <MenuItem
                      sx={{
                        minWidth: '159px',
                      }}
                      value="all"
                    >
                      {t('auction.allLots')}
                    </MenuItem>
                    <MenuItem value="nft">{t('auction.nftLots')}</MenuItem>
                    <MenuItem value="collection">
                      {t('auction.collectionLots')}
                    </MenuItem>
                    <MenuItem value="my">{t('auction.myLots')}</MenuItem>
                  </Select>
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
              <div className="content-page__card-gallery">
                <AuctionList
                  items={getFilterAuctionItems}
                  onItemClick={(auctionHouseId, receiptAddress) =>
                    goToLot(auctionHouseId, receiptAddress)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </AppContainer>

      <Footer />
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
