import type {FC} from 'react';
import type React from 'react';
import {useEffect, useState} from 'react';

type FileListProps = {
    accessToken: string;
    onConfirmSelection: (selectedFiles: string[]) => void;
};

type File = {
    id: string;
    name: string;
    webUrl: string;
};

export const CloudFilePicker: FC<FileListProps> = props => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    useEffect(() => {
        fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
            headers: {
                Authorization: `Bearer ${props.accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setFiles(data.value))
            .catch(error => console.error(error));
    }, [props.accessToken]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(prevSelectedFiles =>
            event.target.checked
                ? [...prevSelectedFiles, event.target.id]
                : prevSelectedFiles.filter(id => id !== event.target.id)
        );
    };

    const handleConfirmSelection = () => {
        props.onConfirmSelection(selectedFiles);
    };

    return (
        <div>
            {files?.map(file => (
                <div key={file.id}>
                    <input type="checkbox" id={file.id} onChange={handleCheckboxChange} />
                    <label htmlFor={file.id}>{file.name}</label>
                </div>
            ))}
            <button onClick={handleConfirmSelection}>Confirm Selection</button>
        </div>
    );
};
