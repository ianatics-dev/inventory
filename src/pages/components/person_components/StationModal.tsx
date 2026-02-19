import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';


const StationModal = ({ open, onClose, subUnits, onAddStation }: any) => {
    const [subUnit, setSubUnit] = useState<any>();
    const [stationCode, setStationCode] = useState<any>();
    const [stationName, setStationName] = useState<any>();
    const [description, setDescription] = useState<any>();


    const handleAddSubUnit = () => {
        onAddStation({
            sub_unit: subUnit,
            station_code: stationCode,
            station_name: stationName,
            description: description 
        })
        setSubUnit("")
        setStationCode("")
        setStationName("")
        setDescription("")
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    minWidth: 400,
                }}
            >
                {/* Add Rank Modal Content */}
                <FormControl fullWidth sx={{ marginBottom: "10px" }}>
                    <InputLabel id="demo-simple-select-label">Sub Unit</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={subUnit}
                        label="Unit"
                        onChange={(e) => setSubUnit(e.target.value)}
                    >
                        {subUnits.map((items: any) => (
                            <MenuItem value={items.sub_unit_code} key={items.id}>{items.sub_unit_code} - {items.sub_unit_description}</MenuItem>
                        )
                        )}
                    </Select>
                </FormControl>
                <TextField label="Station Code" fullWidth margin="normal" value={stationCode} onChange={(e) => setStationCode(e.target.value)} />
                <TextField label="Station Name" fullWidth margin="normal" value={stationName} onChange={(e) => setStationName(e.target.value)} />
                <TextField label="Description" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                    <Button variant="contained" onClick={handleAddSubUnit}>
                        Add
                    </Button>
                    <Button variant="outlined" onClick={onClose} sx={{ ml: 1 }}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );

}

export default StationModal;