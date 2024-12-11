import React, { useCallback, useEffect, useState } from 'react';
import { categories } from '../../../utils/categories';

export interface INftCardProps {
  id?: string;
  categoryName: string;
  name: string;
  symbol: string;
  royality: number;
  creator: string;
  price?: string;
  image: string;
  currency?: string;
  onClick?: (id: string) => void | undefined;
  isPreview?: boolean;
}

const NftCard: React.FC<INftCardProps> = (props) => {
  let {
    id,
    categoryName,
    name,
    symbol,
    royality,
    creator,
    price,
    image,
    currency = 'SOL',
    onClick,
    isPreview = false,
  } = props;

  const [category, setCategory] = useState(null);

  const onItemClick = () => {
    onClick(id);
  };

  useEffect(() => {
    try {
      // Searching category with given category name. If category was not found then searching for "Others" category
      if (categoryName === 'Real estate') {
        categoryName = 'realEstate';
      }
      
      const categoryFilteredByGivenName =
        categories.filter((cat) => {

          if (categoryName !== '') {
            return cat.name === categoryName?.toLowerCase();
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

  return (
    <div className="kaplii-card nft-card" onClick={onItemClick}>
      {isPreview ? (
        <div className="kaplii-card__preview">
          <div className="kaplii-card__preview-content">
            <img src="/assets/svg/img.svg" alt="img" />
            <div>
              <h4>NFT Preview</h4>
              <p>Fill in all the fields to view the preview of nft</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="nft-card__content kaplii-card__content"
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
          <div className="nft-card__category-badge">
            <img src={category?.iconFlat} alt={category?.name} />
          </div>
          <div className="nft-card__image">
            {image && (
              <img
                src={image}
                alt={name}
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
          <div className="nft-card__header">
            <p
              className="nft-card__author-name"
              style={{ textOverflow: 'ellipsis' }}
            >
              {creator}
            </p>
            {/* <p
              className="nft-card__nft-name"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </p> */}
            <div
              style={{
                display: 'flex',
                gap: '30px',
              }}
            >
              <span
                className="nft-card__nft-name"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </span>
              <span
                className="nft-card__nft-name"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textTransform: 'uppercase',
                }}
              >
                {symbol}
              </span>
            </div>
            <span
              className="nft-card__nft-name"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textTransform: 'uppercase',
              }}
            >
              {royality ? <>{royality / 1000} %</> : <></>}
            </span>
          </div>

          {/* <div className="nft-card__actions">
            {price && (
              <div className="nft-card__price">
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {price} {currency}
                </div>
              </div>
            )}
          </div> */}
        </div>
      )}
    </div>
  );
};

export default NftCard;
