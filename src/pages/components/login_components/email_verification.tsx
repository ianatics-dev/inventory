import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import app from '../../../http_settings';
import { useHistory } from 'react-router-dom';

interface CodeInputDialogProps {
    open: boolean;
    onClose: () => void;
}

const CodeInputDialog: React.FC<CodeInputDialogProps> = ({ open, onClose }) => {
    const history = useHistory();
    const [code, setCode] = useState('');
    const [isButtonLoading, setButtonLoading] = useState<boolean>(false)

    const handleConfirm = async () => {
        // You can handle the code submission logic here
        // console.log('Entered code:', code);

        await app.post('/api/verify_code/', {code: code}).then((res) => {
            history.push('/admin/dashboard')
        })

        setButtonLoading(true)

    };

    useEffect(() => {
        const getCode = async () => {
            await app.get('/api/request_code/')
        }
        getCode();
    }, [])

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>We will send you a code</DialogTitle>
            <DialogContent>
                <p>Please check your email for the code.</p>
                <TextField
                    label="Enter Code"
                    variant="outlined"
                    fullWidth
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ marginTop: '1rem' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '1rem' }}
                    onClick={handleConfirm}
                    disabled={isButtonLoading ? true : false}
                >
                    Confirm
                </Button>
                {isButtonLoading &&
                    <CircularProgress size={24}
                        sx={{
                            position: 'absolute',
                            top: '84%',
                            left: '44%',
                            marginTop: '-12px', // Adjust half of the size for centering
                            marginLeft: '-12px', // Adjust half of the size for centering
                        }}
                    />
                }

            </DialogContent>
        </Dialog>
    );
};

export default CodeInputDialog;
