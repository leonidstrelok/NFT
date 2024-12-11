import React from 'react';
import { Nft } from '../../../infrastructure/class/nft';
import NftCard from '../card';

export interface INftListProps {
  items: any[];
  onItemClick?: (nft: Nft) => void;
}

const NftList: React.FC<INftListProps> = (props) => {
  const { items, onItemClick } = props;

  const creatorName = (name) =>
    name.slice(0, 7) + '...' + name.slice(-4) + ' (You)';

  const onClick = (address) => {
    const res = items.find((el) => el.address.toBase58() === address);
    onItemClick(res);
  };

  return (
    <div className="content-nft-purchased__nft-list">
      {items.map((item, index) => (
        <NftCard
          key={item.address.toBase58()}
          id={item.address.toBase58()}
          categoryName={
            item.attributes[0]?.value !== ''
              ? item.attributes[0]?.value
              : 'other'
          }
          symbol={item.symbol}
          royality={item.royality}
          name={item.name}
          creator={creatorName(item.creator)}
          price={'0'}
          image={item.image}
          currency="SOL"
          onClick={onClick}
        />
      ))}
    </div>
  );
};

export default NftList;
