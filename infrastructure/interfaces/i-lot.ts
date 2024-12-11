export interface ILot {
  id: string;
  author: string;
  category: string;
  entityId: string;
  entityType: 'nft' | 'collection';
  entityName: string;
  entityAmount?: number;
  dateStart: string;
  dateEnd: string;
  price: string;
  priceCurrency?: string;
}
