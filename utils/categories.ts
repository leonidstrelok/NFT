export interface Category {
  name: string;
  icon?: string;
  iconFlat?: string;
  iconBlue?: string;
  description?: string;
}

export const categories: Category[] = [
  {
    name: 'media',
    icon: '/assets/svg/Media.svg',
    iconFlat: '/assets/svg/media-flat.svg',
    iconBlue: '/assets/svg/media-blue.svg',
  },
  {
    name: 'jewelry',
    icon: '/assets/svg/Jewelry.svg',
    iconFlat: '/assets/svg/jewelry-flat.svg',
    iconBlue: '/assets/svg/jewelry-blue.svg',
  },
  {
    name: 'wine',
    icon: '/assets/svg/Wine.svg',
    iconFlat: '/assets/svg/wine-flat.svg',
    iconBlue: '/assets/svg/wine-blue.svg',
  },
  {
    name: 'realEstate',
    icon: '/assets/svg/real-estate.svg',
    iconFlat: '/assets/svg/real-estate-flat.svg',
    iconBlue: '/assets/svg/real-estate-blue.svg',
  },
  {
    name: 'cars',
    icon: '/assets/svg/Vehicles.svg',
    iconFlat: '/assets/svg/vehicles-flat.svg',
    iconBlue: '/assets/svg/vehicles-blue.svg',
  },
  {
    name: 'antiques',
    icon: '/assets/svg/Antiques.svg',
    iconFlat: '/assets/svg/antiques-flat.svg',
    iconBlue: '/assets/svg/antiques-blue.svg',
  },
  {
    name: 'others',
    icon: '/assets/svg/Others.svg',
    iconFlat: '/assets/svg/others-flat.svg',
    iconBlue: '/assets/svg/others-blue.svg',
  },
];

export const getCategoryByName = (categoryName: string) => {
  return categories.find((category) => category.name === categoryName);
};
