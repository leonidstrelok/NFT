import React, { useCallback } from 'react';
import { useEffect, useState } from "react";
import { categories, Category } from '../../utils/categories';

interface AuctionPreviewProps {
  id?: string;
  name: string;
  image: string;
  categoryName?: string;
  creator: string;
  price: string;
  currency?: string;
  onClick?: (id: string) => void;
  isPreview?: boolean;
  entityType: "collection" | "nft";
  entityAmount?: number;
  dateEnd: string;
}

export const AuctionCard: React.FC<AuctionPreviewProps> = ({
  id,
  categoryName,
  name,
  creator,
  price,
  image,
  currency = "ETH",
  entityType,
  isPreview = false,
  entityAmount,
  onClick,
  dateEnd,
}) => {

  const [category, setCategory] = useState<Category>(null);

  useEffect(() => {
    try {
      // Searching category with given category name. If category was not found then searching for "Others" category
      const categoryFilteredByGivenName =
        categories.filter((cat) => cat.name === categoryName)[0] ??
        categories.filter((cat) => cat.name === "Others")[0];

      // If still no category - it's a bug
      if (!categoryFilteredByGivenName)
        throw "Error getting category"

      // Set card category
      setCategory(categoryFilteredByGivenName);
    } catch (error) {
      console.error(error);
    }
  }, [categoryName])
  const onClickCb = useCallback(() => {
    onClick && id && onClick(id);
  }, [onClick, id]);
  return (
    <div className="kaplii-card auction-card" onClick={isPreview ? undefined : onClickCb}>
      {
        isPreview ?
          <div className="kaplii-card__preview">
            <div className="kaplii-card__preview-content">
              <img src="/assets/svg/img.svg" alt="img" />
              <div>
                <h4>Item Preview</h4>
                <p>Fill out the form to see preview of your item at auction</p>
              </div>
            </div>
          </div>
          :
          <div className="auction-card__content kaplii-card__content">
            <div className="kaplii-card__category-badge">
              <img src={category?.iconFlat} alt={category?.name} width="24px" />
            </div>
            <div className="auction-card__image">
              <img src={image} alt={name} />
            </div>
            {entityType == "collection" && <div className="kaplii-card__collection-badge">
              <img src={`/assets/svg/collection-amount.svg`} alt="amount" width="16px" />
              {entityAmount}
            </div>}
            <div className="auction-card__header">
              <p className="auction-card__author-name">
                {creator}
              </p>
              <p className="auction-card__nft-name">
                {name}
              </p>
            </div>
            <div className="auction-card__actions">
              <div className="auction-card__price">
                <img src="/assets/svg/eth-currency.svg" alt="" width="24px" />
                <div>{price} {currency}</div>
              </div>
              <div className="auction-card__end-time">
                <img src="/assets/svg/Time.svg" alt="" width="24px" />
                <div><span>Ends in </span> 05h 13m 02s{dateEnd}</div>
              </div>
            </div>

          </div>
      }
    </div>
  )
}