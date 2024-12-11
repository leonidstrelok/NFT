import { Mint, PublicKey, Token } from '@metaplex-foundation/js';
import { INftInfo, INftMetaInfo } from '../interfaces/i-nft';

export class Nft {
  address: PublicKey;
  mintAddress: Mint;
  creator: string;
  image: string;
  name: string;
  description: string;
  symbol: string;
  token: Token

  constructor(data: INftInfo) {
    this.address = data.address;
    this.mintAddress = data.mintAddress;
    this.creator = data.creator;
  }

  addMetaInfo(data: INftMetaInfo) {
    this.image = data.image;
    this.name = data.name;
    this.description = data.description;
    this.symbol = data.symbol;
  }
}
