import { useState, useRef, useEffect, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { AuctionCard } from '../../components/card/auction-card';
import { Tag } from '../../components/tag/tag';
import { CategoryTag } from '../../components/tag/category-tag';
import {
  categories,
  Category,
  getCategoryByName,
} from '../../utils/categories';
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
} from '@metaplex-foundation/js';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import s from './styles.module.scss';

export default function NftItemPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { nftId } = router.query;
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const [nft, setNft] = useState<Sft | SftWithToken | Nft | NftWithToken>();
  const [nftMetadata, setNftMetadata] = useState<JsonMetadata<string>>();

  useEffect(() => {
    const LoadNft = async () => {
      if (publicKey) {
        const nfts = await metaplex.nfts().findAllByOwner({
          owner: publicKey,
        });

        let address = nfts.filter((p) => {
          return p.address.toBase58() === nftId;
        });

        const nft = await metaplex.nfts().findByMint({
          //@ts-ignore
          mintAddress: address[0].mintAddress,
        });

        setNft(nft);
        setNftMetadata(nft.json);
      }
    };

    // LoadNft();
    base58 && LoadNft();
  }, [base58]);

  return (
    <>
      <Head>
        <title>GOLDOR | {nft?.json.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header current={2} />
      {nft && (
        <div className="content-page auction-item-page">
          <div className="content-page__content nft-item-page__content">
            <section className="auction-item-page__image">
              <img
                src={nft.json?.image}
                alt=""
                width="482px"
                height="452px"
                style={{ objectFit: 'cover' }}
              />
            </section>

            <section className="auction-item-page__main-block">
              <h2>{nft.json?.name}</h2>
              <section className="auction-item-page__meta">
                <div className="auction-item-page__created-by">
                  <img src="/assets/svg/user.svg" alt="" />
                  <div>
                    <p className="button2">{t('auction.createdBy')}</p>
                    <p>
                      {nft?.creators[0].address
                        .toBase58()
                        .toString()
                        .slice(0, 7) + '...'}
                    </p>
                  </div>
                </div>
                {nft?.collection && nft.collection.verified && (
                  <div className="auction-item-page__collection">
                    <img src="/assets/svg/user.svg" alt="" />
                    <div>
                      <p className="button2">Collection</p>
                      <p>Collection name</p>
                    </div>
                  </div>
                )}
              </section>

              <section className="auction-item-page__current-offer">
                <h6>{t('auction.currentOffer')}</h6>
                <div>
                  <div>
                    <h3>{`${nft.json.nftPrice} SOL`}</h3>
                  </div>
                  <div className="auction-item-page__current-offer__owner-wrapper">
                    <img src="/assets/svg/user.svg" alt="" />
                    <div>
                      <p className="button2">{t('auction.ownedBy')}</p>
                      <p>
                        {nft.updateAuthorityAddress
                          .toBase58()
                          .toString()
                          .slice(0, 7) + '...'}
                      </p>
                      {/* <p>0x2ED...c5F9</p> */}
                    </div>
                  </div>
                </div>
              </section>

              {/* <section className="auction-item-page__actions">
                <Button
                  sx={{
                    width: '100%',
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
                >
                  Update
                </Button>
              </section> */}
            </section>

            {nft.json?.description && (
              <section
                className={`auction-item-page__description ${s['description']}`}
              >
                <h4>{t('auction.description')}</h4>
                <p>{nft?.json.description}</p>
              </section>
            )}
            <section className="auction-item-page__category">
              <h4>{t('auction.category')}</h4>
              <div>
                <div className="tag-list">
                  <CategoryTag
                    category={getCategoryByName(nft?.json.attributes[0]?.value)}
                  ></CategoryTag>
                  {/* {nft.json.?.category && (
                  <CategoryTag category={nft.json.?.category}></CategoryTag>
                )} */}
                </div>
                {/* <p>{nft.json?.category && nft.json?.category.description}</p> */}
              </div>
            </section>

            {nft.json?.attributes.length > 0 && (
              <section className="auction-item-page__attributes">
                <h4>{t('auction.attribute')}</h4>
                <div className="tag-list">
                  {nft?.json.attributes?.map((attr, key) => {
                    if (attr.trait_type !== 'category') {
                      return (
                        <Tag
                          key={key}
                          title={attr.trait_type}
                          subtitle={attr.value}
                        />
                      );
                    }
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
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

export async function getStaticPaths({ locale }) {
  return {
    paths: [
      // String variant:
      '/nft/first-post',
      // Object variant:
      { params: { nftId: 'second-post' } },
    ],
    fallback: true,
  };
}
