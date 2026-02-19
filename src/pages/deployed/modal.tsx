import { AppBar, Button, Dialog, Divider, IconButton, List, ListItemButton, ListItemText, Slide, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import MapPicker from './pathPicker';
import { TransitionProps } from '@mui/material/transitions';
import app from '../../http_settings';
import MapDeployment from './map';


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function DeployedModal(props: any) {

    const [address, setAddress] = useState<any>();
    const [personel, setPersonel] = useState<any>([]);
    const [coordinates, setCoordinates] = useState<any>();
    const [deploymentName, setDeploymentName] = useState<any>();


    const handleMapPicker = (data: any) => {
        setPersonel(data.personel_ids)
        setCoordinates(data.marker)
        setAddress(data.address)
        setDeploymentName(data.deployment_name)
    }

    const addDeployedUnit = () => {
        if(address !== undefined || deploymentName !== undefined){
            app.post("/api/deployed_units/", {
                persons: personel,
                destination: address,
                coordinates: JSON.stringify(coordinates),
                deployment_name: deploymentName
            }).then((res: any) => {
                console.log(res)
            })
            props.close()
        }
    }

    return (
        <>
            <Dialog
                fullScreen
                open={props.open}
                onClose={props.close}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={props.close}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Map
                        </Typography>
                        <Button autoFocus color="inherit"
                            onClick={addDeployedUnit}
                        >
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                {/* <MapPicker handleMapPicker={handleMapPicker}/> */}
                <MapDeployment handleMapPicker={handleMapPicker}/>
            </Dialog>
        </>
    )
}

export default DeployedModal