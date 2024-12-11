import { TextField } from '@mui/material';
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  FormEvent,
  ChangeEvent,
} from 'react';
import { useTranslation } from 'next-i18next';

interface ITextField {
  name: string;
  placeholder: string;
}

interface IData {
  data: ITextField;
  onValueChanged?: (value: string) => void;
  value: string;
}

const TextFieldCommon: React.FC<IData> = (props) => {
  const { t } = useTranslation('common');

  return (
    <div
      className="content-page__form-block"
      style={{
        marginTop: '20px',
      }}
    >
      <p
        className="content-page__form_required"
        style={{
          paddingLeft: '10px',
        }}
      >
        {t(`create.${props.data.name}`)}
      </p>
      <div className="form-input" style={{ marginTop: '10px', width: '90%' }}>
        <TextField
          placeholder={t(`create.${props.data.placeholder}`)}
          name="name"
          required
          sx={{
            '.MuiOutlinedInput-input': {
              paddingLeft: '20px',
              paddingTop: '4px',
              paddingBottom: '4px',
              fontSize: '16px',
              lineHeight: '42px',
              height: '42px',
            },
          }}
          onChange={(e) => {
            props.onValueChanged(e.target.value);
          }}
        ></TextField>
      </div>
    </div>
  );
};

export default TextFieldCommon;
