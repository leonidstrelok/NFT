import { useMetaplex } from '../../../hooks/useMetaplex';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { convertSnakeToCamel } from '../commo';

const ADDRESS = process.env.NEXT_PUBLIC_SERVER_ADDRESS
  ? process.env.NEXT_PUBLIC_SERVER_ADDRESS + 'auctionHouse/'
  : 'https://goldor-back/api/auctionHouse/';

const GetAuctionHouseAddress = async () => {
  try {
    const { data } = await axios.get(ADDRESS);
    const result: any = convertSnakeToCamel(data);
    
    return result;
  } catch (error) {
    console.log(error);
  }
};

export default GetAuctionHouseAddress;
