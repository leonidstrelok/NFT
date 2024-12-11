import { useMetaplex } from '../../../hooks/useMetaplex';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { convertSnakeToCamel, getDataWithObjectArray } from '../commo';

const ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  ? process.env.NEXT_PUBLIC_SERVER_ADDRESS + 'users'
  : 'https://goldor-back/api/users';

export default async function GetAllAddress() {
  try {
    const { data } = await axios.get(ADDRESS);
    const result = getDataWithObjectArray(convertSnakeToCamel(data));

    return result;
  } catch (error) {
    console.log(error);
  }
}
