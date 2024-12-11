import React from 'react';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { Button } from '@mui/material';
import AddAuctionHouseAddress from '../api/back/add-auction-house-address';
import { useMetaplex } from '../../hooks/useMetaplex';
import router from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const buttonRootStyle = {
  padding: '4px 32px',

  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '16px',
  lineHeight: '42px',

  letterSpacing: '0.744416px',

  color: '#FFFFFF',
  borderRadius: '8px',

  textTransform: 'none !important',
};

export default function Admin() {
  const { t } = useTranslation('common');
  const { metaplex } = useMetaplex();
  const handleSubmit = async () => {
    const { auctionHouse } = await metaplex.auctionHouse().create({
      sellerFeeBasisPoints: 1000,
      requiresSignOff: false,
      canChangeSalePrice: true,
      feeWithdrawalDestination: metaplex.identity().publicKey,
      treasuryWithdrawalDestinationOwner: metaplex.identity().publicKey,
    });

    await AddAuctionHouseAddress(auctionHouse.address.toBase58());
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>GOLDOR | Admin</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header current={2} />
      <div className="content-page">
        <div className="content-page__register">
          <div className="content-page__register-container">
            <form className="content-page__register-form">
              <div className="content-page__form-block">
                <div className="form-input">
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                      ...buttonRootStyle,
                      background:
                        'linear-gradient(141.56deg, #365FFA -4.76%, #A736E0 120.26%) !important',
                    }}
                  >
                    {t('nfts.initAuction')}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
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
