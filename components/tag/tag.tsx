import React, { useCallback } from 'react';
import { Box, IconButton } from '@mui/material';

interface TagProps {
  id?: string;
  title: string;
  subtitle?: string;
  onDelete?: (id: string) => void | undefined;
}

export const Tag: React.FC<TagProps> = ({ id, title, subtitle, onDelete }) => {
  const onDeleteCb = useCallback(() => {
    onDelete && id && onDelete(id);
  }, [onDelete, id]);
  return (
    <Box
      sx={{
        padding: '8px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: '6px',
         
        fontSize: '14px',
        lineHeight: '26px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        width: 'max-content',
      }}
    >
      <Box>{title}</Box>
      {subtitle && (
        <Box
          sx={{
             
            fontSize: '14px',
            lineHeight: '26px',
            color: 'rgba(255, 255, 255, 0.7);',
          }}
        >
          {subtitle}
        </Box>
      )}
      {onDelete != undefined && (
        <IconButton onClick={onDeleteCb} size="small">
          <img src="/assets/svg/cross-small.svg" alt="X" />
        </IconButton>
      )}
    </Box>
  );
};
