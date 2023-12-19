import type {FC} from 'react';
import type React from 'react';
import {useEffect, useState} from 'react';

import folderImage from './Assets/Small-Folder.svg';

type FileListProps = {
    accessToken: string;
    onConfirmSelection: (selectedFiles: string[]) => void;
};

type File = {
    id: string;
    name: string;
    folder?: {
        childCount: number;
    };
    '@microsoft.graph.downloadUrl'?: string;
    file?: {
        mimeType: string;
    };
};

export const CloudFilePicker: FC<FileListProps> = props => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string>('me/drive/special/photos');

    const fetchFiles = (folder: string) => {
        fetch(`https://graph.microsoft.com/v1.0/${folder}/children`, {
            headers: {
                Authorization: `Bearer ${props.accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setFiles(data.value.filter(file => !file.file?.mimeType.startsWith('video/'))))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchFiles(currentFolder);
    }, [props.accessToken, currentFolder]);

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

    const handleFolderClick = (folderId: string) => {
        setCurrentFolder(`me/drive/items/${folderId}`);
    };

    return (
        <div style={{width: '100%'}}>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {files?.map(file => (
                    <div key={file.id} style={{margin: '10px', cursor: 'pointer'}}>
                        {file.folder ? (
                            <img
                                style={{width: '100px', height: '100px'}}
                                src={folderImage}
                                alt="folder"
                                onClick={() => handleFolderClick(file.id)}
                            />
                        ) : (
                            <>
                                <img
                                    src={file['@microsoft.graph.downloadUrl']}
                                    alt={file.name}
                                    style={{width: '100px', height: '100px'}}
                                />
                                <br />
                                <input type="checkbox" id={file.id} onChange={handleCheckboxChange} />
                                {/* <label htmlFor={file.id}>{file.name}</label> */}
                            </>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={handleConfirmSelection}>Confirm Selection</button>
        </div>
    );
};
