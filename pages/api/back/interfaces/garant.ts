export default interface Garant {
  id: number;
  lotAddress?: string;
  sum: string;
  create_at?: string;
  seller: string;
  buyer?: string;
  category: string;
  sellerCompleted?: boolean;
  buyerCompleted?: boolean;
  nftAddress: string;
  garantAddress: string;
}
