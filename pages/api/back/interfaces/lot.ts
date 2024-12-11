export default interface ILot {
  id?: string;
  sellerAddress: string;
  buyerAddress: string;
  lotAddress: string;
  createAt?: string;
  sellDate?: string;
  auctionHouseId: string;
  sellerBalance: string;
  buyerBalance: string;
  expenditure: string;
}
