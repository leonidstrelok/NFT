import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadMyCollections,
  selectMyCollections,
  selectMyCollectionsState,
} from '../../../store/my-collections';
import { LoadingState } from '../../../utils/loading-state';
import { useRouter } from 'next/router';
import { Loading } from '../../../components/loading';
import Head from 'next/head';
import Header from '../../../components/header';
import { CollectionCard } from '../../../components/card/collection-card';
import { ipfsToUrl } from '../../../utils/ipfsToUrl';
import { getCategoryByName } from '../../../utils/categories';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useMetaplex } from '../../../hooks/useMetaplex';
import { JsonMetadata, Metadata, PublicKey } from '@metaplex-foundation/js';
import Footer from '../../../components/footer';
import GetAuctionHouseAddress from '../../api/back/get-auction-house-address';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AppContainer from '../../../components/common/container';

export default function MyCollectionPageAdaptive() {
  const { t } = useTranslation('common');
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const myCollectionsStoreState = useSelector(selectMyCollectionsState);
  // const myCollections = useSelector(selectMyCollections);
  const [myCollections, setMycollections] = useState([]);
  const router = useRouter();
  const isLoading =
    myCollectionsStoreState === LoadingState.INITIAL ||
    myCollectionsStoreState === LoadingState.PENDING;

  useEffect(() => {
    const LoadNFTs = async () => {
      const myCollections = await metaplex.nfts().findAllByOwner({
        owner: metaplex.identity().publicKey,
      });

      const loadedItems = await Promise.all(
        myCollections
          .filter(
            (nft: Metadata<JsonMetadata<string>>) =>
              nft.collectionDetails !== null,
          )
          .map(async (nft: Metadata<JsonMetadata<string>>) => {
            const { data } = await axios.get(nft.uri);

            if (nft.collectionDetails) {
              return {
                ...data,
                creator: nft.creators[0].address.toBase58(),
                id: nft.mintAddress.toBase58(),
                size: nft.collectionDetails.size.toString(),
              };
            }
          }),
      );

      const results = loadedItems.filter((element) => {
        if (element !== undefined) {
          return true;
        }
        return false;
      });

      setMycollections(results);
    };

    base58 && LoadNFTs();
  }, [base58]);

  return !isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="content-page__mobile">
        <div className="content-page__mobile__header">
          <div className="content-page__mobile__header__chart">
            <h1 className="content-page__mobile__header__chart__title">
              {t('collections.myCollections')}
            </h1>
            <p className="content-page__mobile__description">
              {t('main.createAnCurateNFTs')}
            </p>
          </div>
        </div>
        <div className="content-page__mobile__content">
          <div className="content-page__mobile__card-gallery">
            {myCollections.map((collection) => (
              <CollectionCard
                id={collection.id}
                name={collection.name}
                price={collection.collectionPrice}
                logo={collection.image}
                count={collection.size}
                banner={collection.banner}
                category={getCategoryByName(collection.attributes[0].value)}
                onClick={(id) => router.push(`/collections/${id}`)}
                key={collection.id}
              />
            ))}
          </div>
          <div className="content-page__mobile__content__create-collection-banner">
            <div className="content-page__mobile__content__create-collection-banner__title">
              {t('collections.createNewCollection')}
            </div>
            <div className="content-page__mobile__content__create-collection-banner__description">
              {t('collections.createCollectionOfUniq')}
            </div>
            <Link href="/collections/create" passHref legacyBehavior>
              <button className="rounded-lg bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base px-6 sm:px-10 py-2 shadow-md m-auto">
                {t('header.createCollection')}
              </button>
            </Link>
          </div>
        </div>
      </div>
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
