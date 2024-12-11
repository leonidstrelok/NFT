import React, { useCallback } from 'react';
import { Box, IconButton, styled } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { Listing } from '@metaplex-foundation/js';
import DialogHistory from './dialog/dialog-history';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#424EC3',
    color: theme.palette.common.white,
     
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.744416px',
  },
  [`&.${tableCellClasses.body}`]: {
    background: 'rgba(255, 255, 255, 0.03)',
     
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 14,
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.action.hover,
  // },
  // // hide last border
  // '&:last-child td, &:last-child th': {
  //   border: 0,
  // },
}));

interface HistoryItems {
  id?: string;
  fromTransaction: string;
  toTransaction: string;
  price: string;
  sellDate: string;
  coming: string;
  totalPrice: string;
  expenditure: string;
  lot: Listing;
}

interface HistoryProps {
  items: HistoryItems[];
  isSeller: boolean;
}

export const History: React.FC<HistoryProps> = (props) => {
  const { items, isSeller } = props;
  const { t } = useTranslation('common');
  const isExistItems = items.length !== 0;
  const [open, setOpen] = React.useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openDialog = () => {
    open ? setOpen(false) : setOpen(true);
  };

  return (
    <>
      {isExistItems ? (
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 800,
            }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>{t('history.id')}</StyledTableCell>
                <StyledTableCell>{t('history.amount')}</StyledTableCell>
                <StyledTableCell>{t('history.balance')}</StyledTableCell>
                <StyledTableCell>{t('history.lot')}</StyledTableCell>
                <StyledTableCell align="right">
                  {t('history.address')}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {t('history.dateAndTime')}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {!isSeller ? row.fromTransaction : row.toTransaction}
                  </StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    sx={isSeller ? { color: 'green' } : { color: 'red' }}
                  >
                    {isSeller ? row.coming : row.expenditure}
                  </StyledTableCell>
                  <StyledTableCell>{row.totalPrice}</StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    sx={{
                      '&:hover': {
                        color: '#7F87DB',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={openDialog}
                  >
                    {open ? (
                      <DialogHistory
                        isOpenDialog={open}
                        lot={row.lot}
                      ></DialogHistory>
                    ) : (
                      <></>
                    )}
                    {row.lot.asset.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {isSeller ? row.fromTransaction : row.toTransaction}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" align="right">
                    {row.sellDate}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <>
          <h1>{t('history.notHaveTransaction')}</h1>
        </>
      )}
    </>
  );
};
