import { useMetaplex } from '../../../hooks/useMetaplex';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  ? process.env.NEXT_PUBLIC_SERVER_ADDRESS + 'users'
  : 'https://goldor-back/api/users';

export default async function AddAddress(address: PublicKey) {
  try {
    const result = await axios.post(ADDRESS, {
      address,
    });
  } catch (error) {
    // console.log(error);
  }
}
