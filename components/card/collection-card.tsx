import React, { useCallback, useEffect } from 'react';
import { Category } from '../../utils/categories';
import { CategoryBadge } from '../category-badge';
import { useTranslation } from 'next-i18next';
import s from './styles.module.scss';

interface CollectionPreviewProps {
  id?: string;
  name: string;
  price: string;
  logo: string;
  banner?: string;
  category?: Category;
  count: number;
  onClick?: (id: string) => void | undefined;
  isPreview?: boolean;
}

export const CollectionCard: React.FC<CollectionPreviewProps> = ({
  id,
  name,
  price,
  logo,
  banner,
  category,
  count,
  onClick,
  isPreview = false,
}) => {
  const { t } = useTranslation('common');
  const onClickCb = useCallback(() => {
    onClick && id && onClick(id);
  }, [onClick, id]);

  return (
    <div
      className="kaplii-card collection-card"
      onClick={onClick ? onClickCb : undefined}
    >
      {isPreview ? (
        <div className="kaplii-card__preview">
          <div className="kaplii-card__preview-content">
            <img  src="/assets/svg/img.svg" alt="img" />
            <div>
              <h4>{t('createCollection.collectionPreview')}</h4>
              <p>{t('createCollection.uploadFileToSeePreview')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="kaplii-card__content"
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
          <div className="nft-card__category-badge">
            <img
              src={category?.iconFlat}
              alt={t(`categories.${category?.name}`)}
            />
          </div>
          {!!banner && (
            <div
              className="collection-card__banner"
              style={{ backgroundImage: `url(${banner})` }}
            ></div>
          )}
          {!!logo && (
            <div
              className={`collection-card__logo ${
                !!banner && 'collection-card__logo_small'
              }`}
              style={{ backgroundImage: `url(${logo})` }}
            ></div>
          )}
          <div className="collection-card__content">
            <div className="collection-card__header">
              <p className="collection-card__author-name">
                {t('header.myCollection')}
              </p>
              <p className="collection-card__nft-name">{name}</p>
              <p className="collection-card__nft-name">
                {price ? <>{price} SOL</> : <></>}
              </p>
            </div>
            <div className="collection-card__count">
              {count} {t('createCollection.items')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
