import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import app from '../../../http_settings';

type PersonModalProps = {
    open: boolean;
    onClose: () => void;
    onAddPerson: (person: Person) => void;
    units: any;
    ranks: any;
    subunit: any;
    stationData: any;
};

type Person = {
    accountNumber: any
    full_name: any;
    rank: any;
    unit: any;
    email: any;
    sub_unit: any;
    station: any
};

const PersonModal: React.FC<PersonModalProps> = ({ open, onClose, onAddPerson, units, ranks, subunit, stationData }) => {
    // const [units, setUnits] = React.useState<any>([]);
    // const [ranks, setRanks] = React.useState<any>([]);
    const [stations, setStations] = React.useState<any>([]);
    const [subUnits, setSubUnits] = React.useState<any>([]);
    const [rank, setRank] = React.useState<string>();
    const [unit, setUnit] = React.useState<string>();
    const [station, setStation] = React.useState<any>([]);
    const [subUnit, setSubUnit] = React.useState<any>([]);
    const [fullName, setFullName] = React.useState<string>();
    const [accountNumber, setAccountNumber] = React.useState<string>();
    const [email, setEmail] = React.useState<string>();
    const [role, setRole] = React.useState<string>();



    // useEffect(() => {
    //   const access_token = localStorage.getItem("access_token");
    //   app.get("/api/station_choices/", {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`
    //     }
    //   }).then((res: any) => {
    //     setStations(res.data)
    //   })
    // }, [])

    // useEffect(() => {
    //   const access_token = localStorage.getItem("access_token");
    //   app.get("/api/subunit_choices/", {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`
    //     }
    //   }).then((res: any) => {
    //     setSubUnits(res.data)
    //   })
    // }, [])

    const handleAddPerson = () => {
        onAddPerson({
            accountNumber: accountNumber,
            full_name: fullName,
            rank: rank,
            sub_unit: subUnit,
            unit: unit,
            email: email,
            station: station
        })
        setUnit("")
        setRank("")
        setAccountNumber("")
        setSubUnit("")
        setEmail("")
        setFullName("")
        setStation("")
        onClose();
    };

    // console.log(stationData)

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
                <TextField
                    label="Account Number"
                    fullWidth
                    // margin="normal"
                    name="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                <TextField
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <FormControl fullWidth sx={{ marginBottom: "10px" }}>
                    <InputLabel id="demo-simple-select-label">Rank</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={rank}
                        label="Rank"
                        onChange={(e) => setRank(e.target.value)}
                    >
                        {ranks.map((items: any) => (
                            <MenuItem value={items.rank_code} key={items.id}>{items.description}</MenuItem>
                        )
                        )}
                    </Select>
                </FormControl>
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
                <FormControl fullWidth sx={{ marginBottom: "10px" }}>
                    <InputLabel id="demo-simple-select-label">Sub Unit</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={subUnit}
                        label="Station"
                        onChange={(e) => setSubUnit(e.target.value)}
                    >
                        {subunit.map((items: any) => (
                            <MenuItem value={items.sub_unit_code} key={items.id}>{items.unit.description} - {items.sub_unit_description}</MenuItem>
                        )
                        )}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mt: "10px" }}>
                    <InputLabel id="demo-simple-select-label">Station</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={station}
                        label="Station"
                        onChange={(e) => setStation(e.target.value)}
                    >
                        {stationData.map((items: any) => (
                            <MenuItem value={items.station_code} key={items.id}>{items.station_name} {items.description === null ? " " : `- ${items.description}`}</MenuItem>
                        )
                        )}
                    </Select>
                </FormControl>
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {/* <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value={"user"}>User</MenuItem>
            <MenuItem value={"admin"}>Admin</MenuItem>
          </Select>
        </FormControl> */}
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                    <Button variant="contained" onClick={handleAddPerson}>
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

export default PersonModal;
