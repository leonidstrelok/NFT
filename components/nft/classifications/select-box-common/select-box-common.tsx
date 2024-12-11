import {
  useState,
  useRef,
  useEffect,
  useMemo,
  FormEvent,
  ChangeEvent,
} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'next-i18next';

interface ITypeElement {
  name: string;
}

interface IData {
  data: ITypeElement[];
  nameSelectBox: string;
  nameDefaultItem: string;
  handleChangeModeProduction?: (event: SelectChangeEvent) => void;
  value: string;
}

const SelectBoxCommon: React.FC<IData> = (props) => {
  const { t } = useTranslation('common');
  return (
    <FormControl>
      <div style={{ marginTop: '20px' }}>
        <p style={{ marginBottom: '10px', marginLeft: '10px' }}>
          {t(`create.${props.nameSelectBox}`)}
        </p>
        <Select
          value={props.value ?? 'default'}
          onChange={props.handleChangeModeProduction}
          placeholder={'create.selectCollection'}
          sx={{
            width: '90%',
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
            {t(`create.${props.nameDefaultItem}`)}
          </MenuItem>

          {props.data.map((p, key) => {
            return (
              <MenuItem key={key} value={p.name}>
                {p.name}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    </FormControl>
  );
};

export default SelectBoxCommon;
