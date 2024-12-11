import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { Listing } from '@metaplex-foundation/js';
import { useEffect } from 'react';
import Image from 'next/image';
import { color } from '@mui/system';
import Link from 'next/link';
import { Router, useRouter } from 'next/router';

interface IDialog {
  isOpenDialog: boolean;
  lot: Listing;
}

export const DialogHistory: React.FC<IDialog> = (props) => {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('xs');
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    router.push(
      `/auction/${1}?receiptAddress=${props.lot.receiptAddress.toBase58()}`,
    );
  };

  useEffect(() => {
    setOpen(props.isOpenDialog);
  }, [props.isOpenDialog]);


  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <Image
          src={props.lot.asset.json.image}
          alt=""
          objectFit="cover"
          width={264}
          height={164}
          layout="responsive"
        ></Image>
        <DialogContent>
          <DialogContentText
            sx={{ fontWeight: '500', fontSize: '16px', color: 'white' }}
          >
            {props.lot.asset.name}
          </DialogContentText>
          <DialogContentText
            sx={{
              fontWeight: '500',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.744416px',
            }}
          >
            {props.lot.asset.json.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'flex-start',
          }}
        >
          {/* <Link
            href={`/auction/${props.lot.auctionHouse.address.toBase58()}?receiptAddress=${props.lot.receiptAddress.toBase58()}`}
            style={{
              textDecoration: 'underline !important',
              color: 'white',
            }}
          >
            View a lot
          </Link> */}
          <Button
            onClick={handleClose}
            sx={{
              textDecoration: 'underline',
              color: 'white',
            }}
          >
            View a Lot
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogHistory;
