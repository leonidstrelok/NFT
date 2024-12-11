import React, { useState, useEffect, useMemo } from 'react';
import { useMetaplex } from '../../hooks/useMetaplex';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { formatAmount, sol } from '@metaplex-foundation/js';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { TextField, InputAdornment } from '@mui/material';
import GetAuctionHouseAddress from '../api/back/get-auction-house-address';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function AccountFees() {
  const [amount, setAmount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isAdmin, setIsAdmin] = useState(false);
  const { metaplex } = useMetaplex();
  const { publicKey } = useWallet();
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  useEffect(() => {
    const asyncCall = async () => {
      const auctionHouseAddress = await GetAuctionHouseAddress();
      const auction = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(auctionHouseAddress.auctionHouseAddress),
      });

      if (
        metaplex.identity().publicKey.toBase58() ==
        auction.creatorAddress.toBase58()
      ) {
        setIsAdmin(true);
      }

      const auctionBalance = await metaplex
        .rpc()
        .getBalance(auction.treasuryAccountAddress);
      setBalance(formatAmount(auctionBalance));
    };

    base58 && asyncCall();
  }, [base58]);

  const handleSubmit = async () => {
    if (balance >= amount) {
      const auctionHouseAddress = await GetAuctionHouseAddress();
      const auction = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(auctionHouseAddress.auctionHouseAddress),
      });
      const result = await metaplex.auctionHouse().withdrawFromTreasuryAccount({
        amount: sol(amount),
        auctionHouse: auction,
      });
    }
  };

  return (
    <>
      <Head>
        <title>GOLDOR | Account fees</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header current={2} />

      {isAdmin ? (
        <div className="content-page">
          <div className="content-page__withdrawal">
            <img src="/assets/svg/logo-withdrawal.svg" alt="" />
            <h4>Withdrawal</h4>
            <div className="content-page__withdrawal-block content-page__withdrawal-block-border">
              <div className="content-page__form-block__description">
                Availiable amount:
              </div>
              <div className="content-page__withdrawal-amount">
                <h1 className="content-page__withdrawal-gradient content-page__withdrawal-amount-value">
                  {balance}
                </h1>
              </div>
            </div>
            <div className="content-page__withdrawal-block">
              <div className="content-page__form-block__description content-page__withdrawal-label">
                Withdrawal amount
              </div>
              <TextField
                placeholder="Enter amount"
                type="number"
                inputProps={{
                  step: 0.01,
                  min: 0,
                }}
                sx={{
                  width: '100%',
                  '.MuiOutlinedInput-input': {
                    paddingLeft: '20px',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    fontSize: '16px',
                    lineHeight: '42px',
                    height: '42px',
                  },
                }}
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
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
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!amount}
              className="rounded-lg bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base px-6 sm:px-10 py-2 shadow-md m-auto"
            >
              Withdraw money
            </button>
          </div>
        </div>
      ) : null}

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
