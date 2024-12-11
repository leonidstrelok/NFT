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
import { Button } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import TextFieldCommon from './select-box-common/text-field-common';

interface IData {
  handleChangeRegion: (name: string) => void;
  handleChangeRealEstateArea: (name: string) => void;
  handleChangeArchitect: (name: string) => void;
  handleChangeNumberRooms: (name: string) => void;
  selectClassRealEstate: (nameButton: string) => void;
  handleChangeLuxPropertyType?: (event: SelectChangeEvent) => void;
  luxPropertyType: string;
  regionEstate: string;
  realEstateArea: string;
  architect: string;
  numberRooms: string;
  star: any[];
}

const RealEstate: React.FC<IData> = (props) => {
  const { t } = useTranslation('common');

  const data = [
    { name: 'penthouse' },
    { name: 'apartmentBuildings' },
    { name: 'tanhouse' },
    { name: 'apartments' },
    { name: 'lofts' },
    { name: 'luxuryRealEstate' },
    { name: 'eliteMansions' },
  ];

  const leftData = [
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeRegion}
          value={props.regionEstate}
          data={{ name: 'region', placeholder: 'enterRegion' }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeRealEstateArea}
          value={props.realEstateArea}
          data={{ name: 'realEstateArea', placeholder: 'enterRealEstateArea' }}
        ></TextFieldCommon>
      ),
    },
  ];

  const rightData = [
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeArchitect}
          value={props.architect}
          data={{ name: 'architect', placeholder: 'enterArchitect' }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeNumberRooms}
          value={props.numberRooms}
          data={{ name: 'numberRooms', placeholder: 'enterNumberRooms' }}
        ></TextFieldCommon>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <p style={{ paddingBottom: '20px', paddingLeft: '12px' }}>Class</p>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {props.star.map((p, key) => {
          return (
            <div
              key={key}
              style={{
                marginRight: '12px',
                paddingBottom: '8px',
              }}
            >
              <Button
                variant="outlined"
                className={p.isActive ? 'active' : ''}
                onClick={() => props.selectClassRealEstate(p.name)}
                sx={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '110px',
                  color: 'white',
                  textTransform: 'none',
                  '&:last-child': {
                    mr: '0',
                  },
                  '&.active': {
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '8px',
                  },
                  display: 'flex',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flexDirection: 'row' }}>
                    {p.isActive
                      ? p.countStar.activeComponent.map((k) => k.component)
                      : p.countStar.disabledComponent.map((k) => k.component)}
                  </div>

                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '42px',
                    }}
                  >
                    {p.name}
                  </span>
                </div>
              </Button>
            </div>
          );
        })}
      </div>
      <FormControl fullWidth>
        <div style={{ marginTop: '20px' }}>
          <p style={{ marginBottom: '10px', marginLeft: '10px' }}>
            {t(`create.luxPropertyType`)}
          </p>
          <Select
            value={props.luxPropertyType ?? 'default'}
            onChange={props.handleChangeLuxPropertyType}
            placeholder={'create.selectCollection'}
            sx={{
              width: '100%',
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
              },
            }}
          >
            <MenuItem value={'default'}>
              {t(`create.pleaseSelectLuxPropertyType`)}
            </MenuItem>

            {data.map((p, key) => {
              return (
                <MenuItem key={key} value={p.name}>
                  {p.name}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </FormControl>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flexDirection: 'column', width: '50%' }}>
          {leftData.map((p, key) => {
            return <div key={key}>{p.component}</div>;
          })}
        </div>
        <div style={{ flexDirection: 'column', width: '50%' }}>
          {rightData.map((p, key) => {
            return <div key={key}>{p.component}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default RealEstate;
