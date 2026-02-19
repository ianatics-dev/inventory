import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Box, Button, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Title from '../components/Title';
import DeployedModal from './modal';
import app from '../../http_settings';

const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY!;
const REFRESH_INTERVAL = 3000;

type Person = {
  person_id: number;
  person: {
    full_name: string;
    rank: string;
    unit: string;
    station: string;
  };
  is_arrived: boolean;
};

type Deployment = {
  id: number;
  destination: string;
  coordinates: string;
  deployment_name: string;
  is_done: boolean;
  persons_read: Person[];
};

const Row: React.FC<{ deployment: Deployment }> = ({ deployment }) => {
    const [open, setOpen] = useState<boolean>(false);

    const shortenText = (text: any, maxLength: any) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    };

    const allPersonsArrived = () => {
        return deployment.persons_read.every(person => person.is_arrived);
    };

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="right">
                    <Tooltip title={deployment.deployment_name}>
                        <span>{shortenText(deployment.deployment_name, 40)}</span>
                    </Tooltip>
                </TableCell>
                <TableCell align="right">
                    <Tooltip title={deployment.destination}>
                        <span>{shortenText(deployment.destination, 70)}</span>
                    </Tooltip>
                </TableCell>
                <TableCell align="right">
                    <Tooltip title={deployment.is_done ? "Arrived" : "Not Yet Arrived"}>
                        {/* <span>{deployment.is_done ? "Arrived" : "Not Yet Arrived"}</span> */}
                        <span>{allPersonsArrived() ? "Arrived" : "Not Yet Arrived"}</span>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Person Deployed
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Full Name</TableCell>
                                        <TableCell>Rank</TableCell>
                                        <TableCell align="right">Unit</TableCell>
                                        <TableCell align="right">Station</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {deployment.persons_read.map((person) => (
                                        <TableRow key={person.person_id}>
                                            <TableCell component="th" scope="row">{person.person.full_name}</TableCell>
                                            <TableCell>{person.person.rank}</TableCell>
                                            <TableCell align="right">{person.person.unit}</TableCell>
                                            <TableCell align="right">{person.person.station}</TableCell>
                                            <TableCell align="right">{person.is_arrived ? "Arrived" : "Not Yet Arrived"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

function DeployedUnits() {
    const [deployments, setDeployments] = useState<Deployment[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleClose = () => {
        setModalOpen(false)
    }

    useEffect(() => {
        const getData = () => {
            app.get("/api/deployed_units/").then((res: any) => {
                setDeployments(res.data);
            });
        }
        getData();

        const interval = setInterval(getData, REFRESH_INTERVAL);
        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    return (
        <>
            <Box display="flex" justifyContent="flex-end" marginBottom={6}>
                <Typography component="h2" variant="h6" color="primary" sx={{ marginRight: "470px" }}>
                    Deployed Units
                </Typography>
                <Button variant="contained" onClick={() => setModalOpen(true)}>
                    <ControlPointIcon />
                </Button>
            </Box>
            <Table size="small" aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell align="right">Deployment Name</TableCell>
                        <TableCell align="right">Destination</TableCell>
                        <TableCell align="right">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deployments.map((deployment) => (
                        <Row key={deployment.id} deployment={deployment} />
                    ))}
                </TableBody>
            </Table>
            <DeployedModal 
                open={modalOpen}
                close={handleClose}
            />
        </>
    )
}

export default DeployedUnits;
