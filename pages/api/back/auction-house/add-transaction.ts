import { useMetaplex } from '../../../../hooks/useMetaplex';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import ILot from '../interfaces/lot';
import ITransactionLot from '../interfaces/transaction-lot';

const ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  ? process.env.NEXT_PUBLIC_SERVER_ADDRESS + 'auction-houses/addTransaction'
  : 'https://goldor-back/api/auction-houses/addTransaction';

export default async function AddTransactionLot(
  transactionLot: ITransactionLot,
) {
  try {
    const result = await axios.post(ADDRESS, transactionLot);
  } catch (error) {
    console.log(error);
  }
}
