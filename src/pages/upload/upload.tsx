import React, { useState, useRef } from 'react';
import { DialogContent, Dialog, DialogContentText } from '@mui/material';
import './upload.css';


function UploadFiles(props: any) {

    const [files, setFiles] = useState<any>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const selectFiles = () => {
        fileInputRef.current?.click();
    }

    const onFileSelect = (event: any) => {
        const items = event.target.files;
        if (items.length === 0) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.split('/')[0] !== 'image') continue;
            if (!files.some((e: any) => e.name === items[i].name)) {
                setFiles((prevFiles: any) => [
                    ...prevFiles,
                    {
                        name: items[i].name,
                        url: URL.createObjectURL(items[i])
                    },
                ]);
            }
        }
    }

    const deleteFiles = (index: any) => {
        setFiles((prevFiles: any) => 
            prevFiles.filter((_: any, i: any) => i !== index)
        )
    }

    const onDragOver = (event: any) => {
        event.preventDefault();
        setIsDragging(true)
        event.dataTransfer.dropEffect = 'copy'
    }

    const onDragLeave = (event: any) => {
        event.preventDefault();
        setIsDragging(false)
    }

    const uploadFiles = () => {
        console.log("Images", files)
    }

    const onDrop = (event: any) => {
        event.preventDefault();
        setIsDragging(false)
        const items = event.dataTransfer.files;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.split('/')[0] !== 'image') continue;
            if (!files.some((e: any) => e.name === items[i].name)) {
                setFiles((prevFiles: any) => [
                    ...prevFiles,
                    {
                        name: items[i].name,
                        url: URL.createObjectURL(items[i])
                    },
                ]);
            }
        }
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogContent>
                <div className='card'>
                    <div className='top'>
                        <p>Drag & Drop Files uploading</p>
                    </div>
                    <div className='drag-area' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                        {isDragging ? (
                            <span className='select'>
                                Drop Files Here
                            </span>
                        ) : (
                            <>
                                Drag & Drop files here or {" "}
                                <span className='select' role="button" onClick={selectFiles}>
                                    Browse
                                </span>
                            </>
                        )
                        }
                        <input type="file" name="file" className='file' multiple ref={fileInputRef} onChange={onFileSelect} />
                    </div>
                    <div className='container'>
                        {
                            files.map((files: any, index: any) => (

                                <div className='image' key={index}>
                                    <span className='delete' onClick={() => deleteFiles(index)}>&times;</span>
                                    <img src={files.url} alt={files.name} />
                                </div>


                            ))

                        }
                    </div>

                    <button type='button' onClick={uploadFiles}>
                        Upload
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default UploadFiles;