import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

interface CustomFieldProps {
    onDelete: () => void;
    onSave: (field: { key: string; value: string }) => void;
    keyValue?: string;
    value?: string;
}

export const CustomField: React.FC<CustomFieldProps> = memo(function CustomField({ onDelete, onSave, keyValue: key, value }) {
    const [isEditMode, setEditMode] = useState(false);
    const inputKeyRef = useRef(null);
    const inputValueRef = useRef(null);

    useEffect(() => {
        const keyInput = inputKeyRef.current;
        const valueInput = inputValueRef.current;
        if (keyInput && valueInput) {
            keyInput.value = key;
            valueInput.value = value;
        }
    }, [key, value]);

    const goEditMode = useCallback(() => {
        setEditMode(true);
    }, [setEditMode]);

    const onCancel = useCallback(() => {
        setEditMode(false);
    }, [setEditMode]);

    const onSaveClick = useCallback(() => {
        const key = inputKeyRef.current?.value;
        const value = inputValueRef.current?.value;
        if (key && value) {
            onCancel();
            onDelete();
            onSave({
                key,
                value,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onCancel, inputKeyRef, inputValueRef]);

    return <Box m={[1, 0]} display="flex">
        <>
            <input
                className="text-[#B4BAEF] text-sm p-3.5 mb-4 rounded-md border border-[#9FA4FF] bg-[#212760] dark:bg-white focus:outline-none focus:ring-2"
                placeholder="Name"
                id="field-key"
                ref={inputKeyRef}
                disabled={!isEditMode}
                defaultValue={key}
                key="key"
            />
            <input
                className="text-[#B4BAEF] text-sm p-3.5 ml-10 mb-4 rounded-md border border-[#9FA4FF] bg-[#212760] dark:bg-white focus:outline-none focus:ring-2"
                placeholder="Value"
                id="field-value"
                ref={inputValueRef}
                disabled={!isEditMode}
                defaultValue={value}
                key="value"
            />
        </>
        {!isEditMode && <>
            <IconButton onClick={goEditMode} key="edit"><EditIcon /></IconButton>
            <IconButton onClick={onDelete} key="delete"><DeleteIcon /></IconButton>
        </>}
        {isEditMode && <>
            <IconButton onClick={onSaveClick} key="save"><SaveIcon /></IconButton>
            <IconButton onClick={onCancel} key="cancel"><CloseIcon /></IconButton>
        </>}
    </Box>
});
