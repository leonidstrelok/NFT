import React, { useEffect, useMemo, useState } from 'react';
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

const GenerateMetaplexProvider = (): any => {
  // const { connection } = useConnection();
  // const [wallet, setWallet] = useState(Keypair.generate());

  // useEffect(() => {
  //   if (wallet) {
  //     console.log(wallet.publicKey.toBase58());
  //   }
  // });

  // const metaplex: Metaplex = useMemo(
  //   () =>
  //     Metaplex.make(connection)
  //       .use(keypairIdentity(wallet))
  //       .use(
  //         // bundlrStorage(),
  //         bundlrStorage({
  //           address: BUNDLR_STORAGE,
  //           // providerUrl: PROVIDER_URL,
  //           timeout: 60000,
  //         }),
  //       ),
  //   [connection],
  // );

  return {};
};

// export default GenerateMetaplexProvider;
