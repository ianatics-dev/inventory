import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

type RankModalProps = {
  open: boolean;
  onClose: () => void;
  onAddRank: (rank: Rank) => void;
};

type Rank = {
  rank_code: any;
  description: any;
};

const RankModal: React.FC<RankModalProps> = ({ open, onClose, onAddRank }) => {
  const [rankCode, setRankCode] = useState<any>();
  const [description, setDescription] = useState<any>();

  const handleAddRank = () => {
    onAddRank({
      rank_code: rankCode,
      description: description
    })
    setRankCode("")
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
        <TextField label="Rank Code" fullWidth margin="normal" value={rankCode} onChange={(e) => setRankCode(e.target.value)}/>
        <TextField label="Description" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Box display="flex" justifyContent="flex-end" marginTop={2}>
          <Button variant="contained" onClick={handleAddRank}>
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

export default RankModal;
