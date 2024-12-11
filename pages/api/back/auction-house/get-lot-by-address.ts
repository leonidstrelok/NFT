import { useMetaplex } from '../../../../hooks/useMetaplex';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import ILot from '../interfaces/lot';
import { convertSnakeToCamel } from '../../commo';

const ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  ? process.env.NEXT_PUBLIC_SERVER_ADDRESS +
    'auction-houses/getAllLotsByAddress'
  : 'https://goldor-back/api/auction-houses/getAllLotsByAddress';

export default async function GetLotsByAddress(
  address: string,
  isSeller: number,
): Promise<ILot[]> {
  try {
    const { data } = await axios.get(ADDRESS, {
      params: { address: address, isSeller },
    });
    const result: any = convertSnakeToCamel(data);

    return result;
  } catch (error) {
    console.log(error);
  }
}
