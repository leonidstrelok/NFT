import React, { useCallback } from 'react';
import { Category } from '../../utils/categories';
import { CategoryBadge } from '../category-badge';


interface CollectionPreviewProps {
    id?: string;
    name: string;
    logo: string;
    banner?: string;
    category?: Category;
    count: number;
    onClick?: (id: string) => void;
}

export const CollectionPreview: React.FC<CollectionPreviewProps> = ({
    id,
    name,
    logo,
    banner,
    category,
    count,
    onClick,
}) => {
    const onClickCb = useCallback(() => {
        onClick && id && onClick(id);
    }, [onClick, id]);
    return <div className="collection-preview" onClick={onClickCb}>
        {!!banner &&
            <div
                className="collection-preview__banner"
                style={{ backgroundImage: `url(${banner})` }}
            ></div>
        }
        {!!logo && <div
            className={`collection-preview__logo ${!!banner && 'collection-preview__logo_small'}`}
            style={{ backgroundImage: `url(${logo})` }}
        ></div>}
        <div className="collection-preview__title">
            {name}
        </div>
        <div className="collection-preview__count">
            {count} items
        </div>
        <div className="collection-preview__category-wrap">
            {!!category && <CategoryBadge category={category} />}
        </div>
    </div>;
};
