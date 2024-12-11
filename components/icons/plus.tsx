import React from 'react';

export const PlusIcon: React.FC<{ className: string }> = ({ className }) => {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="white" fillOpacity="0.06"/>
        <path d="M9.4 13.4999C9.4 13.8301 9.66864 14.1 10.0001 14.1C10.3315 14.1 10.6001 13.8301 10.6001 13.4999V6.50006C10.6001 6.1699 10.3315 5.9 10.0001 5.9C9.66864 5.9 9.4 6.1699 9.4 6.50006V13.4999Z" fill="#B6B7BD" stroke="#B6B7BD" strokeWidth="0.2"/>
        <path d="M6.50006 10.6001H13.4999C13.8314 10.6001 14.1 10.3302 14.1 10.0001C14.1 9.66977 13.8302 9.4 13.4999 9.4H6.50006C6.16864 9.4 5.9 9.6699 5.9 10.0001C5.9 10.3302 6.16864 10.6001 6.50006 10.6001Z" fill="#B6B7BD" stroke="#B6B7BD" strokeWidth="0.2"/>
    </svg>;
};
