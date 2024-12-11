import { Mint, PublicKey } from "@metaplex-foundation/js";

export interface INft {
  tokenId: string;
  category: string;
  name: string;
  creator: string;
  price: string;
  image: string;
}

export interface INftInfo {
  address: PublicKey;
  mintAddress: Mint;
  creator: string;
}

export interface INftMetaInfo {
  description: string;
  image: string;
  name: string;
  symbol: string;
}
