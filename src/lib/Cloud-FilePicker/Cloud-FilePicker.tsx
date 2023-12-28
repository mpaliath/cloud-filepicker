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
    const [breadcrumbs, setBreadcrumbs] = useState<{id: string; name: string}[]>([]);

    const fetchFiles = (folder: string) => {
        fetch(`https://graph.microsoft.com/v1.0/${folder}/children`, {
            headers: {
                Authorization: `Bearer ${props.accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                const files: File[] = data.value;
                setFiles(files.filter(file => !file.file?.mimeType.startsWith('video/')));
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchFiles(currentFolder);
    }, [props.accessToken, currentFolder]);

    useEffect(() => {
        // Set the initial breadcrumb to represent the root folder
        setBreadcrumbs([{id: 'me/drive/special/photos', name: 'Root'}]);
    }, []); // empty dependency array for initial mount

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, file: File) => {
        setSelectedFiles(prevSelectedFiles =>
            event.target.checked
                ? [...prevSelectedFiles, file['@microsoft.graph.downloadUrl']!]
                : prevSelectedFiles.filter(url => url !== file['@microsoft.graph.downloadUrl'])
        );
    };

    const handleConfirmSelection = () => {
        props.onConfirmSelection(selectedFiles);
    };

    const handleFolderClick = (folderId: string, folderName: string) => {
        setCurrentFolder(`me/drive/items/${folderId}`);
        if (currentFolder === 'me/drive/special/photos') {
            // Navigating from the root, replace the breadcrumb with the root folder
            setBreadcrumbs([{id: 'me/drive/special/photos', name: 'Root'}]);
            setBreadcrumbs(prevBreadcrumbs => [...prevBreadcrumbs, {id: folderId, name: folderName}]);
        } else {
            // Navigating into a subfolder, append to the existing breadcrumb
            setBreadcrumbs(prevBreadcrumbs => [...prevBreadcrumbs, {id: folderId, name: folderName}]);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
        const lastBreadcrumb = newBreadcrumbs[newBreadcrumbs.length - 1];

        if (lastBreadcrumb.name == 'Root') {
            setCurrentFolder(`me/drive/special/photos`);
            setBreadcrumbs([{id: 'me/drive/special/photos', name: 'Root'}]);
        } else {
            setCurrentFolder(`me/drive/items/${lastBreadcrumb.id}`);
            setBreadcrumbs(newBreadcrumbs);
        }
    };

    return (
        <div style={{maxWidth: '100%', overflowX: 'hidden'}}>
            <div style={{marginBottom: '10px'}}>
                {breadcrumbs.map((breadcrumb, index) => (
                    <span key={breadcrumb.id}>
                        {index !== 0 && ' > '}
                        <button onClick={() => handleBreadcrumbClick(index)}>{breadcrumb.name}</button>
                    </span>
                ))}
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap', overflowY: 'auto', maxHeight: '400px'}}>
                {files?.map(file => (
                    <div
                        key="folderContent"
                        style={{margin: '10px', cursor: 'pointer', textAlign: 'center', maxWidth: '140px'}}>
                        {file.folder ? (
                            <div>
                                <img
                                    style={{width: '100px', height: '100px'}}
                                    src={folderImage}
                                    alt={file.name}
                                    onClick={() => handleFolderClick(file.id, file.name)}
                                />
                                <br />
                                <label
                                    style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}
                                    htmlFor={file.id}>
                                    {file.name}
                                </label>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={file['@microsoft.graph.downloadUrl']}
                                    alt={file.name}
                                    style={{width: '100px', height: '100px'}}
                                />
                                {/* <br />
                            <label style={{ display:'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} htmlFor={file.id}>{file.name}</label> */}
                                <br />
                                <input
                                    type="checkbox"
                                    id={file.id}
                                    onChange={event => handleCheckboxChange(event, file)}
                                />
                            </>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={handleConfirmSelection}>Confirm Selection</button>
        </div>
    );
};
