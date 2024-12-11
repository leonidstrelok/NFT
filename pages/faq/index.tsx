import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';
import AppContainer from '../../components/common/container';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import VerticalTabs from '../../components/faq/tabs';

const FAQ: React.FC = () => {
  return (
    <>
      <Head>
        <title>GOLDOR | FAQ</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header current={7} />
      <AppContainer>
        <div className="content-page">
          {/* <div className="content-page__header"></div> */}
          <div className="content-page__content">
            <VerticalTabs></VerticalTabs>
          </div>
        </div>
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

export default FAQ;
