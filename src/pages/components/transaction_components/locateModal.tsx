import React from 'react'
import { Box, DialogContent, DialogContentText, Modal, Paper, Tab } from '@mui/material';
import { LocatePerson } from './locatePerson';
import Dialog from '@mui/material/Dialog';
import { TabContext, TabList, TabPanel } from '@mui/lab';

function LocateModal(props: any) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogContent>
                {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText> */}
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 600,
                        width: 540
                    }}
                >
                    <LocatePerson location={props.location} />
                </Paper>
            </DialogContent>
        </Dialog>
    )
}

export default LocateModal;