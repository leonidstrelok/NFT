import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { categories, Category } from '../../../utils/categories';
import { useTranslation } from 'next-i18next';
import s from './styles.module.scss';

export interface IAuctionCardProps {
  id?: string;
  name: string;
  image: string;
  creator: string;
  price: string;
  dateEnd: string;
  receiptAddress: string;
  entityType: 'collection' | 'nft';
  currency?: string;
  isPreview?: boolean;
  entityAmount?: number;
  categoryName?: string;
  onClick?: (id: string, receiptAddress: string) => void;
}

const AuctionCard: React.FC<IAuctionCardProps> = (props) => {
  const { t } = useTranslation('common');
  let {
    id,
    categoryName,
    name,
    creator,
    price,
    image,
    receiptAddress,
    currency = 'SOL',
    entityType,
    isPreview = false,
    entityAmount,
    onClick,
    dateEnd,
  } = props;

  const [category, setCategory] = useState<Category>(null);

  useEffect(() => {
    try {
      if (categoryName === 'Real estate') {
        categoryName = 'realEstate';
      }
      // Searching category with given category name. If category was not found then searching for "Others" category

      const categoryFilteredByGivenName =
        categories.filter((cat) => {
          if (categoryName !== undefined) {
            return cat.name === categoryName;
          }
        })[0] ?? categories.filter((cat) => cat.name === 'others')[0];

      // If still no category - it's a bug
      if (!categoryFilteredByGivenName) throw 'Error getting category';
      // Set card category
      setCategory(categoryFilteredByGivenName);
    } catch (error) {
      console.error(error);
    }
  }, [categoryName]);

  const onClickCb = useCallback(() => {
    onClick && receiptAddress && id && onClick(id, receiptAddress);
  }, [onClick, id, receiptAddress]);

  return (
    <div
      className="kaplii-card auction-card"
      onClick={isPreview ? undefined : onClickCb}
    >
      {isPreview ? (
        <div className="kaplii-card__preview">
          <div className="kaplii-card__preview-content">
            <img src="/assets/svg/img.svg" alt="img" />
            <div>
              <h4>{t('auctionCard.itemPreview')}</h4>
              <p>{t('auctionCard.fillOutForm')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="auction-card__content kaplii-card__content">
          <div className="kaplii-card__category-badge">
            <img src={category?.iconFlat} alt={category?.name} width="24px" />
          </div>
          <div className="auction-card__image">
            <img className={s['image']} src={image} alt={name} />
          </div>
          {entityType == 'collection' && (
            <div className="kaplii-card__collection-badge">
              <img
                src={`/assets/svg/collection-amount.svg`}
                alt="amount"
                width="16px"
              />
              {entityAmount}
            </div>
          )}
          <div className="auction-card__header">
            <p className="auction-card__author-name">{creator}</p>
            <p className="auction-card__nft-name">{name}</p>
          </div>
          <div className="auction-card__actions">
            <div className="auction-card__price">
              <div>
                {price} {currency}{' '}
              </div>
            </div>
            {/* <div className="auction-card__end-time">
              <img src="/assets/svg/Time.svg" alt="" width="24px" />
              <div>
                <span>Ends in </span> 05h 13m 02s{dateEnd}
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionCard;
