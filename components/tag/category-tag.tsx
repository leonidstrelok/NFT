import { Box } from '@mui/material';
import { Category } from '../../utils/categories';
import { useTranslation } from 'next-i18next';

interface CategoryTagProps {
  category: any;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        backgroundColor: '',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '8px',
        padding: '4px 20px',
        gap: '8px',
         
        fontSize: '16px',
        lineHeight: '42px',
      }}
    >
      <img
        style={{ width: '24px', height: '24px' }}
        src={category?.iconBlue}
        alt=""
      />

      {t(`categories.${category?.name}`)}
    </Box>
  );
};
