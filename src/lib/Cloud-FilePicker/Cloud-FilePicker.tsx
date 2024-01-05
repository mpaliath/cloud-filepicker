import type {FC} from 'react';
import type React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {Breadcrumb, BreadcrumbItem, BreadcrumbButton, BreadcrumbDivider} from '@fluentui/react-components';
import {bundleIcon, Folder24Filled, Folder24Regular} from '@fluentui/react-icons';

import folderImage from './Assets/Small-Folder.svg';
import './Cloud-FilePicker.css';

const FolderIcon = bundleIcon(Folder24Filled, Folder24Regular);
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
    thumbnail?: string;
    file?: {
        mimeType: string;
    };
};

export const CloudFilePicker: FC<FileListProps> = props => {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string>('me/drive/special/photos');
    const [breadcrumbs, setBreadcrumbs] = useState<{id: string; name: string}[]>([]);

    const fetchFiles = useCallback(
        (folder: string) => {
            fetch(`https://graph.microsoft.com/v1.0/${folder}/children`, {
                headers: {
                    Authorization: `Bearer ${props.accessToken}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    const files: File[] = data.value;

                    // Create an array to store the promises for fetching thumbnails
                    const fetchThumbnailPromises: Promise<void>[] = [];

                    files.forEach(file => {
                        if (file.file?.mimeType === 'image/heic') {
                            const thumbnailPromise = fetch(
                                `https://graph.microsoft.com/v1.0/me/drive/items/${file.id}/thumbnails`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${props.accessToken}`,
                                    },
                                }
                            )
                                .then(response => response.json())
                                .then(thumbnails => {
                                    thumbnails.value.forEach((thumbnail: {large: {url: string | undefined}}) => {
                                        file['@microsoft.graph.downloadUrl'] = thumbnail.large.url;
                                        console.log(thumbnail.large.url);
                                        // Now you have the URL of the large thumbnail for each file
                                    });
                                })
                                .catch(error => console.error('Error:', error));

                            fetchThumbnailPromises.push(thumbnailPromise);
                        }
                    });

                    // Use Promise.all to wait for all thumbnail fetch promises to resolve
                    Promise.all(fetchThumbnailPromises)
                        .then(() => {
                            // All thumbnail fetches are complete
                            const filteredFiles = files.filter(file => !file.file?.mimeType.startsWith('video/'));
                            setFiles(filteredFiles);
                        })
                        .catch(error => console.error('Error fetching thumbnails:', error));
                })
                .catch(error => console.error(error));
        },
        [props.accessToken]
    );

    useEffect(() => {
        fetchFiles(currentFolder);
    }, [fetchFiles, currentFolder]);

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
        <div className="cloud-file-picker">
            <Breadcrumb size="large">
                {breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={breadcrumb.id}>
                        <BreadcrumbButton icon={<FolderIcon />} onClick={() => handleBreadcrumbClick(index)}>
                            {breadcrumb.name}
                        </BreadcrumbButton>
                        {index !== breadcrumbs.length - 1 && <BreadcrumbDivider />}
                    </BreadcrumbItem>
                ))}
            </Breadcrumb>

            <div className="body">
                {files?.map((file, i) => (
                    <div key={`folderContent${i}`} className="item">
                        {file.folder ? (
                            <div>
                                <img
                                    style={{width: '100px', height: '100px'}}
                                    id={file.id}
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
            <div className="footer">
                <button onClick={handleConfirmSelection}>Confirm Selection</button>
            </div>
        </div>
    );
};
