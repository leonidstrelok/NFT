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
import SelectBoxCommon from './select-box-common/select-box-common';
import TextFieldCommon from './select-box-common/text-field-common';

interface ITypeElement {
  name: string;
}
interface ITextField {
  name: string;
  placeholder: string;
}

interface IData {
  handleChangeModeProduction?: (event: SelectChangeEvent) => void;
  handleChangeRegion?: (name: string) => void;
  handleChangeBrand?: (name: string) => void;
  handleChangeVolume?: (name: string) => void;
  handleChangeGrapeVarieties?: (name: string) => void;
  handleChangeManufacturer?: (name: string) => void;
  handleChangeFortress?: (name: string) => void;
  handleChangeNumberOfUnits?: (name: string) => void;
  handleChangeCropYear?: (name: string) => void;
  handleChangeTypeWine?: (event: SelectChangeEvent) => void;
  handleChangeCapacity?: (event: SelectChangeEvent) => void;
  handleChangeRawMaterial?: (event: SelectChangeEvent) => void;
  handleChangeColor?: (event: SelectChangeEvent) => void;
  handleChangeAlcohol?: (event: SelectChangeEvent) => void;
  modeProduction: string;
  typeWine: string;
  capacity: string;
  rawMaterial: string;
  alcohol: string;
  color: string;
  volume: string;
  region: string;
  brand: string;
  grapeVarieties: string;
  manufacturer: string;
  fortress: string;
  cropYear: string;
  numberOfUnits: string;
}

const Wine: React.FC<IData> = (props) => {
  const { t } = useTranslation('common');

  const dataModeProduction: ITypeElement[] = [
    { name: 'Natural' },
    { name: 'Special' },
    { name: 'Carbonated' },
    { name: 'Flavored' },
  ];
  const dataTypeWine: ITypeElement[] = [
    { name: 'Wine' },
    { name: 'Port wine' },
    { name: 'Fortified' },
    { name: 'Vermouth' },
    { name: 'Cahors' },
    { name: 'Wine drink' },
    { name: 'Dessert' },
    { name: 'Kosher' },
    { name: 'Fruit' },
    { name: 'Sherry' },
  ];
  const dataTypeCapacity: ITypeElement[] = [
    { name: 'In a bottle' },
    { name: 'In the package' },
    { name: 'In a jug' },
    { name: 'In the bank' },
  ];
  const dataTypeRawMaterial: ITypeElement[] = [
    { name: 'Apricot' },
    { name: 'Quince' },
    { name: 'Grape' },
    { name: 'Cherry' },
    { name: 'Pomegranate' },
    { name: 'Blackberry' },
    { name: 'Strawberry' },
    { name: 'Raspberry' },
    { name: 'Tangerine' },
    { name: 'Peach' },
    { name: 'Pulm' },
    { name: 'Fruit' },
    { name: 'Black currant' },
    { name: 'Apple' },
    { name: 'Berry' },
  ];
  const dataTypeColor: ITypeElement[] = [
    { name: 'Red' },
    { name: 'White' },
    { name: 'Pink' },
    { name: 'Orange' },
  ];
  const dataTypeAlcohol: ITypeElement[] = [
    { name: 'Dry' },
    { name: 'Dry special' },
    { name: 'Semi-dry' },
    { name: 'Semi-sweet' },
    { name: 'Strong' },
    { name: 'Semi-desert' },
    { name: 'Desert' },
    { name: 'Liqueur' },
  ];

  const selectBoxLeftArr = [
    {
      component: (
        <SelectBoxCommon
          handleChangeModeProduction={props.handleChangeModeProduction}
          nameDefaultItem="pleaseSelectModeProduction"
          nameSelectBox="modeProduction"
          value={props.modeProduction}
          data={dataModeProduction}
        ></SelectBoxCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeRegion}
          value={props.region}
          data={{ name: 'region', placeholder: 'enterRegion' }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <SelectBoxCommon
          handleChangeModeProduction={props.handleChangeTypeWine}
          nameDefaultItem="pleaseSelectTypeWine"
          nameSelectBox="typeWine"
          value={props.typeWine}
          data={dataTypeWine}
        ></SelectBoxCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeBrand}
          value={props.brand}
          data={{ name: 'brand', placeholder: 'enterBrand' }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeVolume}
          value={props.volume}
          data={{ name: 'volume', placeholder: 'enterVolume' }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <SelectBoxCommon
          handleChangeModeProduction={props.handleChangeCapacity}
          nameDefaultItem="pleaseSelectCapacity"
          nameSelectBox="capacity"
          value={props.capacity}
          data={dataTypeCapacity}
        ></SelectBoxCommon>
      ),
    },
    {
      component: (
        <SelectBoxCommon
          handleChangeModeProduction={props.handleChangeRawMaterial}
          nameDefaultItem="pleaseSelectRawMaterial"
          nameSelectBox="rawMaterial"
          value={props.rawMaterial}
          data={dataTypeRawMaterial}
        ></SelectBoxCommon>
      ),
    },
  ];
  const selectBoxRightArr = [
    {
      component: (
        <SelectBoxCommon
          handleChangeModeProduction={props.handleChangeColor}
          nameDefaultItem="pleaseSelectColor"
          nameSelectBox="color"
          value={props.color}
          data={dataTypeColor}
        ></SelectBoxCommon>
      ),
    },
    {
      component: (
        <SelectBoxCommon
          handleChangeModeProduction={props.handleChangeAlcohol}
          nameDefaultItem="pleaseSelectAlcohol"
          nameSelectBox="alcohol"
          value={props.alcohol}
          data={dataTypeAlcohol}
        ></SelectBoxCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeGrapeVarieties}
          value={props.grapeVarieties}
          data={{
            name: 'grapeVarieties',
            placeholder: 'enterGrapeVarieties',
          }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeManufacturer}
          value={props.manufacturer}
          data={{
            name: 'manufacturer',
            placeholder: 'enterManufacturer',
          }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeFortress}
          value={props.fortress}
          data={{
            name: 'fortress',
            placeholder: 'enterFortress',
          }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeNumberOfUnits}
          value={props.numberOfUnits}
          data={{
            name: 'numberOfUnitsInALot',
            placeholder: 'enterNumberOfUnits',
          }}
        ></TextFieldCommon>
      ),
    },
    {
      component: (
        <TextFieldCommon
          onValueChanged={props.handleChangeCropYear}
          value={props.cropYear}
          data={{
            name: 'cropYear',
            placeholder: 'enterCropYear',
          }}
        ></TextFieldCommon>
      ),
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '20px',
      }}
    >
      <div style={{ flexDirection: 'column' }}>
        {selectBoxLeftArr.map((p, key) => {
          return <div key={key}>{p.component}</div>;
        })}
      </div>
      <div style={{ flexDirection: 'column' }}>
        {selectBoxRightArr.map((p, key) => {
          return <div key={key}>{p.component}</div>;
        })}
      </div>
    </div>
  );
};

export default Wine;
