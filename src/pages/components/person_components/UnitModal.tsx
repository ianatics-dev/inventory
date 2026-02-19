import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

type UnitModalProps = {
  open: boolean;
  onClose: () => void;
  onAddUnit: (unit: Unit) => void;

};

type Unit = {
  unit_code: any;
  description: any;
};

const UnitModal: React.FC<UnitModalProps> = ({ open, onClose, onAddUnit }) => {
  const [unitCode, setUnitCode] = useState<any>();
  const [description, setDescription] = useState<any>();

  const handleAdd = () => {
    onAddUnit({
      unit_code: unitCode,
      description: description
    })
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
        {/* Add Unit Modal Content */}
        <TextField label="Unit Code" fullWidth margin="normal" value={unitCode} onChange={(e) => setUnitCode(e.target.value)}/>
        <TextField label="Description" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button variant="contained" onClick={handleAdd}>
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

export default UnitModal;
