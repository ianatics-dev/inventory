import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';



const SubUnitModal = ({ open, onClose, units, onAddSubUnit }: any) => {
    const [unit, setUnit] = useState<any>();
    const [subUnitCode, setSubUnitCode] = useState<any>();
    const [subUnitDescription, setSubUnitDescription] = useState<any>();
    const [abbreviation, setAbbreviation] = useState<any>();

    

    const handleAddSubUnit = () => {
        onAddSubUnit({
            units: unit,
            sub_unit_code: subUnitCode,
            sub_unit_description: subUnitDescription,
            abbreviation: abbreviation 
        })
        setUnit("")
        setSubUnitCode("")
        setSubUnitDescription("")
        setAbbreviation("")
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
                    <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={unit}
                        label="Unit"
                        onChange={(e) => setUnit(e.target.value)}
                    >
                        {units.map((items: any) => (
                            <MenuItem value={items.unit_code} key={items.id}>{items.description}</MenuItem>
                        )
                        )}
                    </Select>
                </FormControl>
                <TextField label="Sub Unit Code" fullWidth margin="normal" value={subUnitCode} onChange={(e) => setSubUnitCode(e.target.value)} />
                <TextField label="Sub Unit Description" fullWidth margin="normal" value={subUnitDescription} onChange={(e) => setSubUnitDescription(e.target.value)} />
                <TextField label="Abbreviation" fullWidth margin="normal" value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} />
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
};

export default SubUnitModal;