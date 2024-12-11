import { useMetaplex } from '../../../hooks/useMetaplex';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  ? process.env.NEXT_PUBLIC_SERVER_ADDRESS + 'users/addAuctionHouseAddress'
  : 'https://goldor-back/api/users/addAuctionHouseAddress';

export default async function AddAuctionHouseAddress(
  auctionHouseAddress: string,
) {
  try {
    const result = await axios.post(ADDRESS, {
      auctionHouseAddress,
    });

  } catch (error) {
    // console.log(error);
  }
}
