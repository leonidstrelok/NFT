import React from 'react';
import { ILot } from '../../../infrastructure/interfaces/i-lot';
import AuctionCard from '../card';
import { useTranslation } from 'next-i18next';
import { useMediaQuery } from '@mui/material';

interface IAuctionListProps {
  items: any[];
  onItemClick?: (id: string, receiptAddress: string) => void;
}

const AuctionList: React.FC<IAuctionListProps> = (props) => {
  const { t } = useTranslation('common');
  const { items, onItemClick } = props;

  const haveItems = items.length > 0;
  const matchesDesktop = useMediaQuery('(min-width:905px)');
  return (
    <>
      {!matchesDesktop ? (
        <div className="content-page__mobile__card-gallery">
          {haveItems ? (
            items.map((item, index) => (
              <AuctionCard
                key={item.id}
                id={item.id}
                name={item.entityName}
                categoryName={item?.attributes[0]?.value}
                creator={item.author}
                price={item.price}
                receiptAddress={item.receiptAddress}
                entityType={item.entityType}
                entityAmount={item.entityAmount}
                dateEnd={''}
                image={item.image}
                onClick={onItemClick}
              />
            ))
          ) : (
            <span>{t('auction.pleaseWait')}</span>
          )}
        </div>
      ) : (
        <div className="content-page__card-gallery">
          {haveItems ? (
            items.map((item, index) => (
              <AuctionCard
                key={item.id}
                id={item.id}
                name={item.entityName}
                categoryName={item?.attributes[0]?.value}
                creator={item.author}
                price={item.price}
                receiptAddress={item.receiptAddress}
                entityType={item.entityType}
                entityAmount={item.entityAmount}
                dateEnd={''}
                image={item.image}
                onClick={onItemClick}
              />
            ))
          ) : (
            <span>{t('auction.pleaseWait')}</span>
          )}
        </div>
      )}
    </>
  );
};

export default AuctionList;
