import React, { useMemo } from 'react';
import {
  Metaplex,
  PublicKey,
  walletAdapterIdentity,
  bundlrStorage,
  keypairIdentity,
} from '@metaplex-foundation/js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MetaplexContext } from '../hooks/useMetaplex';
import { Keypair } from '@solana/web3.js';

const BUNDLR_STORAGE = process.env.NEXT_PUBLIC_BUNDLR_STORAGE;
const PROVIDER_URL = process.env.NEXT_PUBLIC_BUNDLR_STORAGE_PROVIDER_URL;

const MetaplexProvider = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const metaplex: Metaplex = useMemo(
    () =>
      Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(
          bundlrStorage(),
          // bundlrStorage({
          //   address: BUNDLR_STORAGE,
          //   // providerUrl: PROVIDER_URL,
          //   timeout: 60000,
          // }),
        ),
    [connection, wallet],
  );

  return (
    <MetaplexContext.Provider value={{ metaplex }}>
      {children}
    </MetaplexContext.Provider>
  );
};

export default MetaplexProvider;
