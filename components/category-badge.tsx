import React from 'react';

interface CategoryBadgeProps {
  category: any;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <div className="category-badge">
      {!!category?.icon && (
        <div
          className="category-badge__icon"
          style={{ backgroundImage: `url(${category.icon})` }}
        ></div>
      )}
      <div className="category-badge__title">{category?.name}</div>
    </div>
  );
};
