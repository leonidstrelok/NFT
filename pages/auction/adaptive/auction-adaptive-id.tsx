import { useState, useRef, useEffect, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../../components/header';
import Footer from '../../../components/footer';
import { AuctionCard } from '../../../components/card/auction-card';
import { Tag } from '../../../components/tag/tag';
import { CategoryTag } from '../../../components/tag/category-tag';
import { categories, Category } from '../../../utils/categories';
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
import { useMetaplex } from '../../../hooks/useMetaplex';
import { WalletContextState, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  AuctionHouse,
  Bid,
  FindBidsOutput,
  formatAmount,
  formatDateTime,
  JsonMetadata,
  Listing,
  Metadata,
  Metaplex,
  Nft,
  NftWithToken,
  PrivateBid,
  PublicBid,
  Sft,
  SftWithToken,
  sol,
  SolAmount,
  toDateTime,
  token,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/js';
import GetAuctionHouseAddress from '../../api/back/get-auction-house-address';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddLot from '../../api/back/auction-house/add-lot';
import AddTransactionLot from '../../api/back/auction-house/add-transaction';
import React from 'react';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import AppContainer from '../../../components/common/container';
import s from './styles.module.scss';
import ReactPlayer from 'react-player';
import { WalletModal } from '@solana/wallet-adapter-react-ui';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#002046',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
  color: '#7F87DB',
};

const calculateTimeLeft = (eventTime: number): string => {
  const currentTime = Math.floor(Date.now() / 1000);
  const leftTime = eventTime - currentTime;
  let duration = moment.duration(leftTime, 'seconds');

  const isZeroTime =
    duration.hours() <= 0 && duration.minutes() <= 0 && duration.seconds() <= 0;

  if (isZeroTime) {
    return '00:00:00';
  }

  const withZero = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  duration = moment.duration(duration.asSeconds() - 1, 'seconds');
  return `${withZero(duration.hours())}:${withZero(
    duration.minutes(),
  )}:${withZero(duration.seconds())}`;
};

export interface IData {
  metaplex: Metaplex;
  wallet: WalletContextState;
}

const AuctionItemPageAdaptive: React.FC<IData> = ({ metaplex, wallet }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [listing, setListing] = useState<Listing>();
  const [bids, setBids] = useState([]);
  const [offerPrice, setOfferPrice] = useState(null);
  const [helperText, setHelperText] = useState('');
  const [isError, setError] = useState(false);
  const { auctionId, receiptAddress } = router.query;
  const [open, setOpen] = useState(false);
  const [eventTime, setEventTime] = useState<number>();
  const [timer, setTimer] = useState<NodeJS.Timer | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState<string>(
    calculateTimeLeft(eventTime),
  );
  const [isBuyNft, setBuyNft] = useState(false);
  const [timeEnded, setTimeEnded] = useState<boolean>(true);
  const [innerBids, setInnerBids] = useState<any>([]);

  const [idInterval, setIdInterval] = useState<any>();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createBid = async (isBuy: boolean) => {
    if (!isError) {
      const allPrices = [];
      const [filterBids] = bids.filter((p) => {
        if (
          p.buyerAddress.toBase58() ===
            metaplex.identity().publicKey.toBase58() &&
          p.canceledAt === null
        ) {
          return p;
        }
      });

      if (bids.length > 0 && filterBids !== undefined && filterBids !== null) {
        handleOpen();
      } else {
        const myNfts = await metaplex.nfts().findAllByOwner({
          owner: listing.sellerAddress,
        });
        const loadedItems = await Promise.all(
          myNfts.filter((nft) => {
            if (
              nft.collection &&
              nft.collection.verified &&
              nft.collection.address.toBase58() ==
                listing.asset.mint.address.toBase58()
            ) {
              return nft;
            }
          }),
        );
        let price = sol(0);
        if (isBuy) {
          //@ts-ignore
          price = sol(listing.asset.json.maxPrice);
          setBuyNft(true);
        } else {
          price =
            offerPrice !== '' && offerPrice !== '0'
              ? sol(parseFloat(offerPrice))
              : (listing.price as SolAmount);
        }
        if (loadedItems.length === 0) {
          try {
            const { bid } = await metaplex.auctionHouse().bid({
              auctionHouse: listing.auctionHouse,
              mintAccount: listing.asset.mint.address,
              price: price,
              seller: listing.sellerAddress,
              printReceipt: true,
            });
            const result = bids;

            result.unshift(bid);
            setBids(result);
            setOfferPrice(null);
          } catch (error) {
            console.error(error);
          }
        } else {
          const listings: Listing[] = await filterListings(loadedItems);
          const newArrays = [];
          try {
            let formatPrice = listing.asset.json.maxPrice.toString().split('.');
            const finalPrice =
              formatPrice.shift() +
              (formatPrice.length ? '.' + formatPrice.join('') : '');

            // const amount = await metaplex.auctionHouse().depositToBuyerAccount({
            //   amount: sol(Number(finalPrice)),
            //   buyer: metaplex.identity(),
            //   auctionHouse: listing.auctionHouse,
            // });
            // console.log('PART AMOUNT');

            const { bid } = await metaplex.auctionHouse().bid({
              auctionHouse: listing.auctionHouse,
              mintAccount: listing.asset.mint.address,
              price: price,
              seller: listing.sellerAddress,
              printReceipt: true,
            });

            const localObj = {
              bid: bid,
              receiptAddress: listing.receiptAddress.toBase58(),
              asset: listing.asset,
            };
            newArrays.push(localObj);
            const result = bids;

            result.unshift(bid);
            setBids(result);
            for (let list of listings) {
              const success = await metaplex
                .auctionHouse()
                .depositToBuyerAccount({
                  amount: list.price,
                  auctionHouse: listing.auctionHouse,
                  buyer: metaplex.identity(),
                });

              const bidUp = await metaplex.auctionHouse().bid({
                auctionHouse: listing.auctionHouse,
                mintAccount: list.asset.mint.address,
                //@ts-ignore
                price: sol(list.asset.json.nftPrice),
                seller: list.sellerAddress,
                printReceipt: true,
              });
              const newObj = {
                bid: bidUp.bid,
                receiptAddress: list.receiptAddress.toBase58(),
                asset: list.asset,
              };
              newArrays.unshift(newObj);

              setInnerBids(newArrays);
              setOfferPrice(null);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  };
  const buySimpleNFT = async (item: any) => {
    const bid = await metaplex.auctionHouse().findBidByReceipt({
      auctionHouse: listing.auctionHouse,
      receiptAddress: item.receiptAddress,
    });

    const publicBid = bid as PublicBid;
    const transactionBuilder = await metaplex.auctionHouse().builders().sell({
      auctionHouse: listing.auctionHouse,
      bid: publicBid,
      sellerToken: listing.asset.token,
      printReceipt: true,
    });
    const transaction = await metaplex
      .rpc()
      .sendAndConfirmTransaction(transactionBuilder);

    const receiptAddressListing = [];
    receiptAddressListing.push(listing.receiptAddress);
    const newJson = {
      ...listing.asset.json,
      receiptAddressListings: receiptAddressListing,
    };
    const uri = await metaplex.storage().uploadJson(newJson);
    await metaplex.nfts().update({
      nftOrSft: listing.asset,
      newUpdateAuthority: item.buyerAddress,
      creators: [{ address: item.buyerAddress, share: 100 }],
      uri: uri,
    });
    await AddLotAndTransaction(transaction, formatAmount(bid.price), bid);
    router.push('/auction');
  };
  const buyAuction = async () => {
    await createBid(true);
  };

  const buy = async () => {
    const myNfts = await metaplex.nfts().findAllByOwner({
      owner: listing.sellerAddress,
    });

    const loadedItems = await Promise.all(
      myNfts.filter((nft) => {
        if (
          nft.collection &&
          nft.collection.verified &&
          nft.collection.address.toBase58() ==
            listing.asset.mint.address.toBase58()
        ) {
          return nft;
        }
      }),
    );
    if (loadedItems.length === 0) {
      const result = await metaplex.auctionHouse().builders().buy({
        auctionHouse: listing.auctionHouse,
        listing,
        printReceipt: true,
        price: listing.price,
      });
      const transaction = await metaplex
        .rpc()
        .sendAndConfirmTransaction(result);

      // const receiptAddressListing = [];
      // receiptAddressListing.push(listing.receiptAddress);
      // const newJson = {
      //   ...listing.asset.json,
      //   receiptAddressListings: receiptAddressListing,
      // };
      // const uri = await metaplex.storage().uploadJson(newJson);
      // await metaplex.nfts().update({
      //   nftOrSft: listing.asset,
      //   newUpdateAuthority: metaplex.identity().publicKey,
      //   creators: [{ address: metaplex.identity().publicKey, share: 100 }],
      //   uri: uri,
      // });

      await AddLotAndTransactionSimpleBuy(
        transaction,
        formatAmount(listing.price),
      );
      router.push('/auction');
    } else {
      const listings = await filterListings(loadedItems);
      console.log('LISTINGS', listings);
      await buyCollectionsNotAuction(listings, listing.price);
      const result = await metaplex.auctionHouse().builders().buy({
        auctionHouse: listing.auctionHouse,
        listing,
        printReceipt: true,
        buyer: metaplex.identity(),
        price: listing.price,
      });
      const transaction = await metaplex
        .rpc()
        .sendAndConfirmTransaction(result);

      // const receiptAddressListing = [];
      // receiptAddressListing.push(listing.receiptAddress);
      // const newJson = {
      //   ...listing.asset.json,
      //   receiptAddressListings: receiptAddressListing,
      // };
      // const uri = await metaplex.storage().uploadJson(newJson);
      // await metaplex.nfts().update({
      //   nftOrSft: listing.asset,
      //   newUpdateAuthority: metaplex.identity().publicKey,
      //   creators: [{ address: metaplex.identity().publicKey, share: 100 }],
      //   uri: uri,
      // });
      await AddLotAndTransactionSimpleBuy(
        transaction,
        formatAmount(listing.price),
      );
      router.push('/auction');
    }
  };
  const buyCollectionsNotAuction = async (listings, price: any) => {
    for (const list of listings) {
      console.log(list, 'LIST');

      const result = await metaplex.auctionHouse().builders().buy({
        auctionHouse: listing.auctionHouse,
        listing: list,
        printReceipt: true,
        buyer: metaplex.identity(),
      });
      const transaction = await metaplex
        .rpc()
        .sendAndConfirmTransaction(result);
      const receiptAddressListing = [];
      // receiptAddressListing.push(list.receiptAddress);
      // const newJson = {
      //   ...list.asset.json,
      //   receiptAddressListings: receiptAddressListing,
      // };
      // console.log('IDENTITY', metaplex.identity().publicKey.toBase58());

      // const uri = await metaplex.storage().uploadJson(newJson);
      // console.log('IDENTITY', metaplex.identity().publicKey.toBase58());

      // await metaplex.nfts().update({
      //   nftOrSft: list.asset,
      //   uri: uri,
      // });

      await AddLotAndTransactionNotAuction(
        transaction,
        formatAmount(price),
        list,
      );
    }
  };

  const buyCollections = async (price: any) => {
    let i = 0;
    let receiptAddressListing = [];
    for (const bid of innerBids) {
      if (listing.receiptAddress.toBase58() === bid.receiptAddress) {
        const bidLocal = await metaplex.auctionHouse().findBidByReceipt({
          auctionHouse: listing.auctionHouse,
          receiptAddress: bid.bid.receiptAddress,
        });
        const result = await buySimpleNFT(bid.bid);
        continue;
      } else {
        receiptAddressListing = [];
        const bidLocalElse = await metaplex.auctionHouse().findBidByReceipt({
          auctionHouse: listing.auctionHouse,
          receiptAddress: bid.bid.receiptAddress,
        });

        const publicBidLocaL = bidLocalElse as PublicBid;
        const result = await metaplex.auctionHouse().builders().sell({
          auctionHouse: listing.auctionHouse,
          bid: publicBidLocaL,
          printReceipt: true,
          sellerToken: bid.asset.token,
        });
        const transaction = await metaplex
          .rpc()
          .sendAndConfirmTransaction(result);

        receiptAddressListing.push(bid.receiptAddress);
        const newJson = {
          ...bid.asset.json,
          receiptAddressListings: receiptAddressListing,
        };
        const uri = await metaplex.storage().uploadJson(newJson);
        await metaplex.nfts().update({
          nftOrSft: bid.asset,
          newUpdateAuthority: bid.bid.buyerAddress,
          creators: [{ address: bid.bid.buyerAddress, share: 100 }],
          uri: uri,
        });
        await AddLotAndTransaction(
          transaction,
          formatAmount(publicBidLocaL.price),
          bid.bid,
        );
        i++;
      }
    }
  };

  const filterListings = async (nfts) => {
    const getListings = await metaplex.auctionHouse().findListings({
      auctionHouse: listing.auctionHouse,
      seller: listing.sellerAddress,
    });
    let newArr: Listing[] = [];
    for (const nft of nfts) {
      for (const list of getListings) {
        const getListingByReceipt: Listing = await metaplex
          .auctionHouse()
          .findListingByReceipt({
            auctionHouse: listing.auctionHouse,
            receiptAddress: list.receiptAddress,
          });
        if (
          getListingByReceipt.asset.collection?.address.toBase58() ==
          nft.collection?.address.toBase58()
        ) {
          if (newArr.length > 0) {
            newArr = newArr?.filter((p) => {
              if (
                // @ts-ignore
                p.metadataAddress.toBase58() !==
                // @ts-ignore
                getListingByReceipt.metadataAddress.toBase58()
              ) {
                return true;
              }
              return false;
            });
          }
          newArr.push(getListingByReceipt);
        }
      }
    }
    return newArr;
  };

  const AddLotAndTransaction = async (
    transaction: any,
    price: string,
    bid: any,
  ) => {
    const date = new Date(formatDateTime(listing.createdAt));
    const lot = await AddLot({
      auctionHouseId: listing.auctionHouse.address.toBase58(),
      buyerAddress: bid.buyerAddress.toBase58(),
      lotAddress: listing.receiptAddress.toBase58(),
      sellDate: new Date().toLocaleString(),
      sellerAddress: listing.sellerAddress.toBase58(),
      sellerBalance: formatAmount(
        await metaplex.rpc().getBalance(listing?.sellerAddress),
      ),
      buyerBalance: formatAmount(
        await metaplex.rpc().getBalance(wallet.publicKey),
      ),
      expenditure: price.toString(),
    });

    await AddTransactionLot({
      blockHash: transaction.blockhash,
      lastValidBlockHeight: transaction.lastValidBlockHeight.toString(),
      signature: transaction.signature,
      lotId: lot.id,
    });
  };
  const AddLotAndTransactionNotAuction = async (
    transaction: any,
    price: string,
    list: any,
  ) => {
    const date = new Date(formatDateTime(listing.createdAt));
    const lot = await AddLot({
      auctionHouseId: listing.auctionHouse.address.toBase58(),
      buyerAddress: metaplex.identity().publicKey.toBase58(),
      lotAddress: list.receiptAddress.toBase58(),
      sellDate: new Date().toLocaleString(),
      sellerAddress: list.sellerAddress.toBase58(),
      sellerBalance: formatAmount(
        await metaplex.rpc().getBalance(list?.sellerAddress),
      ),
      buyerBalance: formatAmount(
        await metaplex.rpc().getBalance(wallet.publicKey),
      ),
      expenditure: price.toString(),
    });

    await AddTransactionLot({
      blockHash: transaction.blockhash,
      lastValidBlockHeight: transaction.lastValidBlockHeight.toString(),
      signature: transaction.signature,
      lotId: lot.id,
    });
  };
  const AddLotAndTransactionSimpleBuy = async (
    transaction: any,
    price: string,
  ) => {
    const date = new Date(formatDateTime(listing.createdAt));
    const lot = await AddLot({
      auctionHouseId: listing.auctionHouse.address.toBase58(),
      buyerAddress: metaplex.identity().publicKey.toBase58(),
      lotAddress: listing.receiptAddress.toBase58(),
      sellDate: new Date().toLocaleString(),
      sellerAddress: listing.sellerAddress.toBase58(),
      sellerBalance: formatAmount(
        await metaplex.rpc().getBalance(listing?.sellerAddress),
      ),
      buyerBalance: formatAmount(
        await metaplex.rpc().getBalance(wallet.publicKey),
      ),
      expenditure: price.toString(),
    });

    await AddTransactionLot({
      blockHash: transaction.blockhash,
      lastValidBlockHeight: transaction.lastValidBlockHeight.toString(),
      signature: transaction.signature,
      lotId: lot.id,
    });
  };

  const buyNFT = async (item) => {
    if (timeLeft !== '00:00:00') {
      const myNfts = await metaplex.nfts().findAllByOwner({
        owner: listing.sellerAddress,
      });
      const loadedItems = await Promise.all(
        myNfts.filter((nft) => {
          if (
            nft.collection &&
            nft.collection.verified &&
            nft.collection.address.toBase58() ==
              listing.asset.mint.address.toBase58()
          ) {
            return nft;
          }
        }),
      );
      if (loadedItems.length === 0) {
        await buySimpleNFT(item);
      } else {
        //@ts-ignore
        await buyCollections(listing.asset.json.maxPrice);

        router.push('/auction');
      }
    } else {
    }
  };

  const makeOffer = async () => {
    await createBid(false);
  };

  const cancelBid = async (bid, index, isModal: boolean = false) => {
    if (isModal) {
      const [result] = bids.filter((p, key) => {
        if (
          p.canceledAt === null &&
          p.buyerAddress.toBase58() === metaplex.identity().publicKey.toBase58()
        ) {
          index = key;

          return p;
        }
      });
      bid = result;
    }
    const bidLocal = await metaplex.auctionHouse().findBidByReceipt({
      auctionHouse: listing.auctionHouse,
      receiptAddress: bid.receiptAddress,
    });

    const result = await metaplex.auctionHouse().cancelBid({
      auctionHouse: listing.auctionHouse,
      bid: bidLocal,
    });

    const returnMoney = await metaplex.auctionHouse().withdrawFromBuyerAccount({
      auctionHouse: listing.auctionHouse,
      amount: bidLocal.price,
      buyer: metaplex.identity(),
    });

    const bidsLocal = bids;

    bidsLocal.splice(index, 1);

    setBids(bidsLocal);
    setBuyNft(false);
    handleClose();
  };

  // const cancelListing = async () => {
  //   const result = await metaplex.auctionHouse().cancelListing({
  //     auctionHouse: listing.auctionHouse,
  //     listing: listing,
  //   });
  //   const returnMoney = await metaplex.auctionHouse().withdrawFromBuyerAccount({
  //     auctionHouse: listing.auctionHouse,
  //     amount: {},
  //   });
  //   console.log('CANCEL LISTING: ', result);
  // };

  const timerTime = () => {
    setTimeLeft(calculateTimeLeft(eventTime));
  };

  const startTimer = () => {
    if (timer === undefined) {
      setTimer(setInterval(timerTime, 1000));
    }
  };

  useEffect(() => {
    const getAuction = async () => {
      const auctionHouseAddress = await GetAuctionHouseAddress();
      const auction = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(auctionHouseAddress.auctionHouseAddress),
      });

      const getListingByReceipt: Listing = await metaplex
        .auctionHouse()
        .findListingByReceipt({
          auctionHouse: auction,
          receiptAddress: new PublicKey(receiptAddress),
        });
      const createdListingDate = formatDateTime(getListingByReceipt.createdAt);
      const dateTimeListing = new Date(createdListingDate);
      if (getListingByReceipt.asset.json?.endTime) {
        //@ts-ignore
        const endDate: string = getListingByReceipt.asset.json.endTime;
        const endDateArray = endDate.split(/[.,: ]+/);
        const formattedArray = [];

        for (let i = 0; i < endDateArray.length; i++) {
          formattedArray.push(parseInt(endDateArray[i]));
        }

        let dateOne = moment(formattedArray, 'L, HH:mm:ss');
        const date1 = dateOne.toDate();

        setEventTime(date1.getTime());
        setTimeEnded(calculateTimeLeft(date1.getTime()) === '00:00:00');
      }

      const bidsArr = [];
      const bidsModel = await metaplex.auctionHouse().findBids({
        auctionHouse: auction,
        mint: getListingByReceipt.asset.mint.address,
      });

      for (const bid of bidsModel) {
        const createdBidDate = formatDateTime(bid.createdAt);
        const dateTime = new Date(createdBidDate);

        if (bid.canceledAt === null && bid.purchaseReceiptAddress === null) {
          if (dateTimeListing.getTime() < dateTime.getTime()) {
            bidsArr.push(bid);
          }
        }
      }

      bidsArr.sort((a, b) => {
        const firstPrice = Number(formatAmount(a.price).replace('SOL ', ''));
        const secondPrice = Number(formatAmount(b.price).replace('SOL ', ''));

        return secondPrice - firstPrice;
      });
      setBids(bidsArr);

      setListing(getListingByReceipt);
    };
    if (auctionId && receiptAddress) getAuction().catch(console.error);
  }, [auctionId, eventTime, metaplex, receiptAddress]);

  useEffect(() => {
    if (eventTime && !timeEnded) {
      startTimer();
    }
  }, [eventTime, timeEnded]);

  useEffect(() => {
    if (timeLeft === '00:00:00') {
      clearInterval(timer);
      setTimer(undefined);
      setTimeEnded(true);
    }
  }, [timeLeft]);

  return (
    listing && (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {t('auction.cancelBid')}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {t('auction.inAOrder')}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button
                sx={{
                  width: '100px',
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
                onClick={() => cancelBid(bids[0], 0, true)}
              >
                {t('auction.cancel')}
              </Button>
            </Typography>
          </Box>
        </Modal>

        <div className="content-page auction-item-page__mobile">
          <div className="auction-item-page__mobile__content">
            <section className="auction-item-page__mobile__image">
              <img
                src={listing.asset.json.image}
                alt=""
                width="482px"
                height="452px"
              />
              <section className="auction-item-page__mobile__name">
                <p>{listing?.asset?.json?.name}</p>
              </section>

              {listing?.asset.json.collectionVideo !== null && (
                <section
                  className={`auction-item-page__description ${s['description']}`}
                >
                  <ReactPlayer
                    //@ts-ignore
                    url={listing?.asset.json.collectionVideo}
                    controls
                  ></ReactPlayer>
                </section>
              )}
            </section>
            <section className="auction-item-page__mobile__meta">
              <div className="auction-item-page__mobile__meta__created-by">
                <img src="/assets/svg/user.svg" alt="" />
                <div>
                  <p className="button2">{t('auction.createdBy')}</p>
                  <p>
                    {listing?.sellerAddress?.toBase58()
                      ? listing?.sellerAddress?.toBase58().slice(0, 7) +
                        '...' +
                        listing?.sellerAddress?.toBase58().slice(-4)
                      : '0'}
                  </p>
                </div>
              </div>
              <div className="auction-item-page__collection">
                <img src="/assets/svg/img.svg" alt="img" />
                <div>
                  <p className="button2">{t('auction.collection')}</p>
                  <p>{listing.asset.json.name}</p>
                </div>
              </div>
            </section>
            <section className="auction-item-page__mobile__main-block">
              <section className="auction-item-page__mobile__main-block__current-offer">
                <section className="auction-item-page__mobile__main-block__current-offer__price">
                  <h3>{t('auction.price')}</h3>
                  <div>
                    <div>
                      <h5>
                        {Math.floor(
                          Number(
                            formatAmount(listing.price)
                              .replace('SOL ', '')
                              .replace(/(\.\d*?[1-9])0+$/g, '$1'),
                          ),
                        )}{' '}
                        <span>SOL</span>
                      </h5>
                    </div>
                  </div>
                </section>

                <div className="auction-item-page__mobile__main-block__current-offer__created-by">
                  <img src="/assets/svg/user.svg" alt="img" />
                  <div>
                    <p className="button2">{t('auction.ownedBy')}</p>
                    <p>
                      {listing?.sellerAddress?.toBase58()
                        ? listing?.sellerAddress?.toBase58().slice(0, 7) +
                          '...' +
                          listing?.sellerAddress?.toBase58().slice(-4)
                        : '0'}
                    </p>
                  </div>
                </div>
              </section>
              {listing.asset.json?.endTime ? (
                <section className="auction-item-page__current-offer">
                  <h4>{t('auction.auctionEnds')} </h4>
                  <h4>{timeLeft}</h4>
                </section>
              ) : (
                <></>
              )}
              {!isNaN(Number(auctionId)) ? (
                <section>
                  <div className="content-page__form-block">
                    <div className="content-page__form-block__description">
                      {t('auction.offerPrice')}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '60px',
                        flexDirection: 'row',
                        width: '100%',
                      }}
                    >
                      <TextField
                        placeholder={t('auction.create.enterPrice')}
                        type="number"
                        error={isError}
                        id="outlined-error-helper-text"
                        helperText={helperText}
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
                          width: '100%',
                        }}
                        fullWidth
                        onChange={(e) => {
                          let price = e.target.value;

                          if (Number(price) < 0) {
                            const listingPrice = formatAmount(listing.price);

                            e.target.value = listingPrice.replace('SOL ', '');
                            setOfferPrice(0);
                            setHelperText(
                              'A value less than zero cannot be entered',
                            );
                            setError(true);
                          } else {
                            setOfferPrice(price);
                            setError(false);
                            setHelperText('');
                          }
                          bids.map((p) => {
                            const bidsPrice = formatAmount(p.price);
                            const newPrice = bidsPrice.replace('SOL ', '');
                            if (price > newPrice) {
                              setError(false);
                              setHelperText('');
                              setOfferPrice(price);
                            } else {
                              setHelperText(
                                'Please enter a value greater than the previous one',
                              );
                              setError(true);
                              setOfferPrice(null);
                            }
                            return p;
                          });
                        }}
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
                      {metaplex.identity().publicKey.toBase58() !==
                      listing.sellerAddress.toBase58() ? (
                        <>
                          {!isBuyNft ? (
                            <Button
                              sx={{
                                width: '150px',
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
                              disabled={isError}
                              onClick={makeOffer}
                            >
                              {t('auction.placeBid')}
                            </Button>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </section>
              ) : (
                <></>
              )}
              {bids.length > 0 ? (
                <section className="auction-item-page__offers-history">
                  <h4>{t('auction.offerHistory')}</h4>
                  <div className="auction-item-page__offers-list">
                    {bids.map((item, index) => (
                      <div
                        key={index}
                        className="auction-item-page__offers-list-item"
                      >
                        <img src="/assets/svg/user.svg" alt="" />
                        <div className="auction-item-page__offers-list-item__info">
                          <h6>
                            {t('auction.offerPlacedBy')}{' '}
                            <span>{item.buyerAddress.toBase58()}</span>
                          </h6>
                        </div>
                        <h5>
                          {formatAmount(item.price).replace(
                            /(\.\d*?[1-9])0+$/g,
                            '$1',
                          )}
                        </h5>

                        {metaplex.identity().publicKey.toBase58() ===
                        item.bookkeeperAddress.toBase58() ? (
                          <Button
                            sx={{
                              width: '416px',
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
                            onClick={() => cancelBid(item, index)}
                          >
                            {t('auction.cancel')}
                          </Button>
                        ) : (
                          <></>
                        )}
                        {timeEnded ? (
                          <>
                            {metaplex.identity().publicKey.toBase58() ===
                            listing.sellerAddress.toBase58() ? (
                              <>
                                {index === 0 ? (
                                  <Button
                                    sx={{
                                      width: '416px',
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
                                    onClick={() => buyNFT(item)}
                                  >
                                    {t('auction.sell')}
                                  </Button>
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                        {isBuyNft ? (
                          <>
                            {metaplex.identity().publicKey.toBase58() ===
                            listing.sellerAddress.toBase58() ? (
                              <>
                                {index === 0 ? (
                                  <Button
                                    sx={{
                                      width: '416px',
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
                                    onClick={() => buyNFT(item)}
                                  >
                                    {t('auction.sell')}
                                  </Button>
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <></>
              )}
              <section
                className={`auction-item-page__description ${s['description']}`}
              >
                <h4>{t('auction.description')}</h4>
                <p>{listing?.asset?.json?.description}</p>
              </section>
              {listing.asset.json.isAuction ? (
                <>
                  {!isNaN(Number(auctionId)) ? (
                    <section className="auction-item-page__actions">
                      {metaplex.identity().publicKey.toBase58() !==
                      listing.sellerAddress.toBase58() ? (
                        <>
                          {!isBuyNft ? (
                            <Button
                              sx={{
                                width: '416px',
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
                              // disabled={isError}
                              onClick={buyAuction}
                            >
                              {t('auction.buy')}{' '}
                              {`${listing.asset.json.maxPrice}  SOL`}
                            </Button>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </section>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  {metaplex.identity().publicKey.toBase58() !==
                  listing.sellerAddress.toBase58() ? (
                    <>
                      {!isBuyNft ? (
                        <Button
                          sx={{
                            width: '416px',
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
                          // disabled={isError}
                          onClick={buy}
                        >
                          {t('auction.buy')}{' '}
                          {`${listing.asset.json.maxPrice}  SOL`}
                        </Button>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </section>
            <div className="auction-item-page__mobile__common">
              {listing.asset.json.attributes.length > 0 ? (
                <section className="auction-item-page__mobile__common__category">
                  <h4>{t('auction.category')}</h4>
                  <div>
                    <div className="auction-item-page__mobile__common__category__tag-list">
                      <CategoryTag
                        category={categories.find((cat) => {
                          if (listing.asset?.json?.attributes) {
                            if (
                              listing.asset?.json.attributes[0].value !== '' &&
                              listing.asset?.json.attributes[0].value !==
                                undefined
                            ) {
                              return (
                                cat.name ==
                                (
                                  listing.asset?.json?.attributes[0]
                                    .value as string
                                ).toLowerCase()
                              );
                            } else {
                              return (
                                cat.name ==
                                (
                                  listing.asset?.json?.attributes[0]
                                    .category as string
                                ).toLowerCase()
                              );
                            }
                          } else {
                            return (
                              cat.name ==
                              (
                                listing.asset?.json.category as string
                              ).toLowerCase()
                            );
                          }
                        })}
                      ></CategoryTag>
                    </div>
                  </div>
                </section>
              ) : (
                <></>
              )}
              {/* <p>
                  {
                    categories.find((cat) => {
                      if (listing.asset?.json?.attributes) {
                        return (
                          cat.name ==
                          (
                            listing.asset?.json?.attributes[0].value as string
                          ).toLowerCase()
                        );
                      } else {
                        return (
                          cat.name ==
                          (listing.asset?.json.category as string).toLowerCase()
                        );
                      }
                    })?.description
                  }
                </p> */}

              {listing.asset.json.attributes.length > 1 ? (
                <section className="auction-item-page__mobile__common__attributes">
                  <h4>{t('auction.attribute')}</h4>
                  <div className="auction-item-page__mobile__common__attributes__tag-list">
                    {listing.asset?.json?.attributes?.map((obj, key) => {
                      if (obj.trait_type !== 'category') {
                        return (
                          <div key={key}>
                            <Tag title={obj.trait_type} subtitle={obj.value} />
                          </div>
                        );
                      }
                    })}
                  </div>
                </section>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    )
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

export default AuctionItemPageAdaptive;
