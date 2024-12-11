import {
  useState,
  useRef,
  useEffect,
  useMemo,
  FormEvent,
  ChangeEvent,
  memo,
} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'next-i18next';

const colors = [
  { name: 'Colorless', type: 'D-F' },
  { name: 'Almost Colorless', type: 'G-I' },
  { name: 'A subtle shade', type: 'J-K' },
  { name: 'A little yellowish', type: 'L-R' },
  { name: 'With a yellowish tinge', type: 'S-Z' },
];
const carats = [
  { name: '.25 ct - (4.1 mm)' },
  { name: '.33 ct - (4.4 mm)' },
  { name: '.50 ct - (5.2 mm)' },
  { name: '.75 ct - (5.9 mm)' },
  { name: '1.0 ct - (6.5 mm)' },
  { name: '1.25 ct - (7.0 mm)' },
  { name: '1.5 ct - (7.4 mm)' },
  { name: '1.75 ct - (7.8 mm)' },
  { name: '2.0 ct - (8.2 mm)' },
  { name: '2.25 ct - (8.6 mm)' },
  { name: '2.5 ct - (8.8 mm)' },
  { name: '2.75 ct - (9.1 mm)' },
  { name: '3.0 ct - (9.4 mm)' },
];
const clarities = [
  { name: 'Internally flawless', type: 'IF' },
  { name: 'Very, vary slight inclusions', type: 'VVS1, VVS2' },
  { name: 'Very slight inclusions', type: 'VS1, VS2' },
  { name: 'Slight inclusions', type: 'SI1, SI2' },
  { name: 'Visible inclusions', type: 'I1, I2, I3' },
];
const cuts = [
  { name: 'Round', image: '/assets/png/Round.png' },
  { name: 'Marquise', image: '/assets/png/Marquise.png' },
  { name: 'Pear', image: '/assets/png/Pear.png' },
  { name: 'Princess', image: '/assets/png/Princess.png' },
  { name: 'Heart', image: '/assets/png/Heart.png' },
  { name: 'Oval', image: '/assets/png/Oval.png' },
  { name: 'Emerald', image: '/assets/png/Emerald.png' },
  { name: 'Baguette', image: '/assets/png/Baguette.png' },
  { name: 'Trillion', image: '/assets/png/Trillion.png' },
];

interface IDataObj {
  handleChangeColor?: (event: SelectChangeEvent) => void;
  handleChangeCarat?: (event: SelectChangeEvent) => void;
  handleChangeClarity?: (event: SelectChangeEvent) => void;
  handleChangeCut?: (event: SelectChangeEvent) => void;
  color: string;
  carat: string;
  clarity: string;
  cut: string;
}

const Diamond: React.FC<IDataObj> = (props) => {
  const { t } = useTranslation('common');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <FormControl>
          <div>
            <p style={{ marginBottom: '10px', marginLeft: '10px' }}>
              {t('create.color')}
            </p>
            <Select
              value={props.color ?? 'default'}
              onChange={props.handleChangeColor}
              placeholder={'create.selectCollection'}
              sx={{
                '.MuiOutlinedInput-input': {
                  paddingLeft: '20px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontSize: '16px',
                  lineHeight: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '300px',
                  gap: '1rem',
                  '>img': {
                    height: '24px',
                  },
                },
              }}
            >
              <MenuItem value={'default'}>
                {t('create.pleaseSelectColor')}
              </MenuItem>

              {colors.map((p, key) => {
                return (
                  <MenuItem key={key} value={p.name}>
                    {p.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </FormControl>
        <FormControl>
          <div style={{ marginTop: '20px' }}>
            <p style={{ marginBottom: '10px', marginLeft: '10px' }}>
              {t('create.carat')}
            </p>
            <Select
              value={props.carat ?? 'default'}
              onChange={props.handleChangeCarat}
              placeholder={'create.selectCollection'}
              sx={{
                '.MuiOutlinedInput-input': {
                  paddingLeft: '20px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontSize: '16px',
                  lineHeight: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  width: '300px',

                  '>img': {
                    height: '24px',
                  },
                },
              }}
            >
              <MenuItem value={'default'}>
                {t('create.pleaseSelectCarat')}
              </MenuItem>

              {carats.map((p, key) => {
                return (
                  <MenuItem key={key} value={p.name}>
                    {p.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </FormControl>
      </div>
      <div style={{ flexDirection: 'column' }}>
        <FormControl>
          <div>
            <p style={{ marginBottom: '10px', marginLeft: '10px' }}>
              {t('create.clarity')}
            </p>
            <Select
              value={props.clarity ?? 'default'}
              onChange={props.handleChangeClarity}
              sx={{
                '.MuiOutlinedInput-input': {
                  paddingLeft: '20px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontSize: '16px',
                  lineHeight: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '300px',
                  gap: '1rem',
                  '>img': {
                    height: '24px',
                  },
                },
              }}
            >
              <MenuItem value={'default'}>
                {t('create.pleaseSelectClarity')}
              </MenuItem>

              {clarities.map((p, key) => {
                return (
                  <MenuItem key={key} value={p.name}>
                    {p.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </FormControl>
        <FormControl sx={{ width: '100px' }}>
          <div style={{ marginTop: '20px' }}>
            <p style={{ marginBottom: '10px', marginLeft: '10px' }}>
              {t('create.cut')}
            </p>
            <Select
              value={props.cut ?? 'default'}
              onChange={props.handleChangeCut}
              placeholder={'create.selectCollection'}
              sx={{
                '.MuiOutlinedInput-input': {
                  paddingLeft: '20px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  fontSize: '16px',
                  lineHeight: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  width: '300px',
                  gap: '1rem',
                  '>img': {
                    height: '24px',
                  },
                },
              }}
            >
              <MenuItem value={'default'}>
                {t('create.pleaseSelectCut')}
              </MenuItem>

              {cuts.map((p, key) => {
                return (
                  <MenuItem key={key} value={p.name}>
                    <img src={p.image} alt="" /> {p.name}
                  </MenuItem>
                );
              })}
            </Select>
          </div>
        </FormControl>
      </div>
    </div>
  );
};

export default Diamond;
