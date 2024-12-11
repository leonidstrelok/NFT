import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { History } from '../../components/transaction/history';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMetaplex } from '../../hooks/useMetaplex';
import GetAuctionHouseAddress from '../api/back/get-auction-house-address';
import { useTranslation } from 'next-i18next';
import { formatAmount, Listing, PublicKey } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import GetLotsByAddress from '../api/back/auction-house/get-lot-by-address';
import AppContainer from '../../components/common/container';

export default function Transaction() {
  const { metaplex } = useMetaplex();
  const { t } = useTranslation('common');
  const [items, setItems] = useState([]);
  const [isSellerState, setIsSeller] = useState(false);
  const { publicKey, wallet, disconnect, connected } = useWallet();
  useEffect(() => {
    const getListing = async (receiptAddress: string) => {

      const listingAddress = new PublicKey(receiptAddress);
      const auctionHouseAddress = await GetAuctionHouseAddress();
      const auction = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(auctionHouseAddress.auctionHouseAddress),
      });

      const getListingByReceipt: Listing = await metaplex
        .auctionHouse()
        .findListingByReceipt({
          auctionHouse: auction,
          receiptAddress: new PublicKey(listingAddress),
        });

      return getListingByReceipt;
    };

    const getTransactions = async () => {
      const auctionHouseAddress = await GetAuctionHouseAddress();
      let itemsLocal = [];
      const auction = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(auctionHouseAddress.auctionHouseAddress),
      });

      const purchases = await metaplex.auctionHouse().findPurchases({
        auctionHouse: auction,
      });
      if (publicKey) {
        const address = publicKey.toBase58();
        const lots = await GetLotsByAddress(address, 1);
        let localIsSeller = false;
        const lotsArray: any[] = [];
        for (let i = 0; i < Object.keys(lots).length; i++) {
          lotsArray.push(lots[i]);
        }

        let id = 1;

        for (const purchase of purchases) {
          if (lotsArray.length !== itemsLocal.length) {
            for (const item of lotsArray) {
              const lot = await getListing(item.lotAddress);
              let isSeller = item.sellerAddress === address ? true : false;
              localIsSeller = isSeller;
              let result = formatAmount(purchase.price);
              let priceComing = result.replace('SOL ', '');
              let priceBalanceBuyer = item.buyerBalance.replace('SOL ', '');
              let priceBalanceSeller = item.sellerBalance.replace('SOL ', '');
              let priceExpenditure = item.expenditure.replace('SOL ', '');
              const sellDate = new Date(Date.parse(item.sellDate));
              let format = `${sellDate.getDate()}.${sellDate.getMonth()}.${sellDate.getFullYear()} (${sellDate.getHours()}:${sellDate.getMinutes()})`;
              itemsLocal.push({
                id,
                idObject: item.id,
                sellDate: format,
                fromTransaction:
                  item.sellerAddress.slice(0, 5) +
                  '...' +
                  item.sellerAddress.slice(-4),
                coming: Number(priceComing).toFixed(3) + ' SOL',
                toTransaction:
                  item.buyerAddress.slice(0, 5) +
                  '...' +
                  item.buyerAddress.slice(-4),
                totalPrice: isSeller
                  ? Number(priceBalanceSeller).toFixed(3) + ' SOL'
                  : Number(priceBalanceBuyer).toFixed(3) + ' SOL',
                expenditure: Number(priceExpenditure).toFixed(3) + ' SOL',
                isSeller,
                lot: lot,
              });

              id += 1;
            }
          }
        }

        setIsSeller(localIsSeller);

        setItems(itemsLocal);
      }
    };
    getTransactions();
  }, [connected, publicKey, metaplex, wallet]);
  return (
    <>
      <Head>
        <title>GOLDOR | Transaction</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header current={4} />
      <AppContainer>
        <div className="content-page">
          <div className="content-page__header"></div>
          <div className="content-page__content">
            <History items={items} isSeller={isSellerState}></History>
          </div>
        </div>
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
