import 'tailwindcss/tailwind.css';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import '/public/assets/css/marketplace.css';
import '../styles/collections.scss';
import '../styles/nft-purchased.scss';
import '../styles/cards.scss';

import '../styles/footer.scss';
import '../styles/landing.scss';
import '../styles/globals.scss';
import '../styles/auction.scss';

import '../styles/header.scss';

import '@solana/wallet-adapter-react-ui/styles.css';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { wrapper } from '../store/store';
import MetaplexProvider from '../providers/metaplex-provider';
import { createTheme, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectThemeColor } from '../store/theme';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.js';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Cairo } from '../public/fonts/cairo/local-font';
import { Raleway } from '../public/fonts/raleway/local-font-raleway';
import { useRouter } from 'next/router';
const getDesignTokens = (mode) => ({
  palette: {
    mode,
  },
});

function MyApp({ Component, pageProps }) {
  const mode = useSelector(selectThemeColor);
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const router = useRouter();

  const [network, setNetwork] = useState(WalletAdapterNetwork.Mainnet);
  // const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint = useMemo(() => 'https://api.metaplex.solana.com/', [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter({ network })],
    [network],
  );

  useEffect(() => {
    mode === 'light'
      ? document.body.classList.add('dark')
      : document.body.classList.remove('dark');
  }, [mode]);

  return (
    <div className={router.locale === 'en' ? Cairo.variable : Raleway.variable}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider
          wallets={wallets}
          autoConnect={true}
        >
          <WalletModalProvider>
            <MetaplexProvider>
              <ThemeProvider theme={theme}>
                <Component {...pageProps} />
              </ThemeProvider>
            </MetaplexProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
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

// export default wrapper.withRedux(MyApp);
export default appWithTranslation(wrapper.withRedux(MyApp));
