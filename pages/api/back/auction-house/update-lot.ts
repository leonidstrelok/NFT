import { useMetaplex } from '../../../../hooks/useMetaplex';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import ILot from '../interfaces/lot';

const ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  ? process.env.NEXT_PUBLIC_SERVER_ADDRESS + 'auction-houses'
  : 'https://goldor-back/api/auction-houses';

export default async function UpdateLot(lot: ILot) {
  try {
    const result = await axios.put(ADDRESS, lot, { params: { id: lot.id } });
  } catch (error) {
    console.log(error);
  }
}
