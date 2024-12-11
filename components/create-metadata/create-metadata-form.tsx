import React, { useCallback, useRef } from 'react';
import { Button, Chip, Stack, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeCustomField,
  selectCreateMetadataCustomFields,
  selectCreateMetadataTags,
  setCustomField,
  setTags
} from '../../store/create-metadata';
import { CustomField } from './custom-field';

export const CreateMetadataForm: React.FC = () => {
  const tags = useSelector(selectCreateMetadataTags);
  const customFields = useSelector(selectCreateMetadataCustomFields);
  const dispatch = useDispatch();
  const inputTagRef = useRef(null);
  const inputKeyRef = useRef(null);
  const inputValueRef = useRef(null);
  const onTagDelete = useCallback((tag) => {
    const newTags = [...tags];
    newTags.splice(tags.indexOf(tag), 1);
    dispatch(setTags(newTags));
  }, [tags, dispatch]);

  const onTagCreate = useCallback(() => {
    const value = inputTagRef.current?.value;
    if (value) {
      dispatch(setTags([...tags, value]));
      inputTagRef.current.value = '';
    }
  }, [tags, dispatch]);

  const onFieldCreate = useCallback(() => {
    const key = inputKeyRef.current?.value;
    const value = inputValueRef.current?.value;
    if (key && value) {
      dispatch(setCustomField({
        key,
        value,
      }));
    }

  }, [dispatch]);

  const onFieldChange = useCallback(({ key, value }) => {
    if (key && value) {
      dispatch(setCustomField({
        key,
        value,
      }));
    }
  }, [dispatch]);

  const onFieldDelete = useCallback((key) => {
    if (key) {
      dispatch(removeCustomField({
        key,
      }));
    }

  }, [dispatch]);
  return <div>
    <div>
      <Stack direction="row" spacing={1}>
        {tags.map(tag => (
          <Chip className="mb-4" label={tag} color="primary" onDelete={() => onTagDelete(tag)} key={tag} />
        ))}
      </Stack>
      <input
        className="text-[#B4BAEF] text-sm p-4 mb-4 rounded-md border border-[#9FA4FF] bg-[#212760] dark:bg-white focus:outline-none focus:ring-2"
        placeholder="Tag name"
        id="tag-name"
        ref={inputTagRef}
      />
      <button
        className="rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base px-6 sm:px-10 py-2 ml-10 shadow-md m-auto"
        id="btn-add-tag" onClick={onTagCreate}>
        Add tag
      </button>

    </div>
    <div>
      {Object.keys(customFields).map((key) => (
        <CustomField
          onDelete={() => onFieldDelete(key)}
          onSave={onFieldChange}
          keyValue={key}
          value={customFields[key]}
          key={key} />
      ))}
      <input
        className="text-[#B4BAEF] text-sm p-3.5 mb-4 rounded-md border border-[#9FA4FF] bg-[#212760] dark:bg-white focus:outline-none focus:ring-2"
        placeholder="Name"
        id="field-key"
        ref={inputKeyRef}
      />
      <input
        className="text-[#B4BAEF] text-sm p-3.5 ml-10 rounded-md border border-[#9FA4FF] bg-[#212760] dark:bg-white focus:outline-none focus:ring-2"
        placeholder="Value"
        id="field-value"
        ref={inputValueRef}
      />
      <button
        className="rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base px-6 sm:px-10 py-2 shadow-md m-auto"
        id="btn-set-filed"
        onClick={onFieldCreate}>
        Add Metadata
      </button>
    </div>
  </div>;
}
