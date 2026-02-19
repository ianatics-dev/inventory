import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pagination, Select, MenuItem, Box } from '@mui/material';
import app from '../../../http_settings';
import DeleteIcon from '@mui/icons-material/Delete';

type SubUnit = {
    id: number;
    unit: any;
    sub_unit_code: string;
    sub_unit_description: string;
    abbreviation: string;
};

type SubUnitTableProps = {
    rows: SubUnit[];
    count: number;
    pagination: (value: number) => void;
};

const SubUnitTable: React.FC<SubUnitTableProps> = ({ rows, count, pagination }) => {
    const [updatedRows, setUpdatedRows] = useState<SubUnit[]>(rows);
    const [unitOptions, setUnitOptions] = useState<any[]>([]); // Store unit options here

    useEffect(() => {
        setUpdatedRows(rows);
    }, [rows]);

    const handleDeleteRow = async (id: any) => {
        try {
          await app.delete(`/api/sub_unit/${id}/`).then((res) => {
            console.log(res)
          });
          setUpdatedRows((prevRows) => prevRows.filter((row) => row.id !== id));
          toast.success('Row deleted successfully!');
        } catch (error: any) {
          toast.error(`Failed to delete row: ${error.message}`);
        }
      };

    // Fetch unit options from API
    useEffect(() => {
        const getUnitOptions = async () => {
            try {
                const response = await app.get('/api/unit_choices/');
                setUnitOptions(response.data);
            } catch (error) {
                console.error('Error fetching unit options:', error);
            }
        };

        getUnitOptions();
    }, []);

    const processRowUpdate = (newRow: SubUnit, oldRow: SubUnit) => {
        const updatedRow = {
            ...oldRow,
            ...newRow,
            unit: unitOptions.find((unit: any) => unit.id === newRow.unit) || oldRow.unit, // Update the unit field with selected unit
        };

        setUpdatedRows((prevRows) =>
            prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );

        console.log(updatedRow)

        // Send patch request to the server to update
        app.patch(`/api/sub_unit/${updatedRow.id}/`, updatedRow).then((res) => {
            console.log('Row updated:', res);
        });

        toast.success(`Updated row with ID: ${newRow.id}`);
        return updatedRow;
    };

    const handleProcessRowUpdateError = (error: Error) => {
        toast.error(`Update failed: ${error.message}`);
    };

    const columns: GridColDef[] = [
        {
            field: 'unit',
            headerName: 'Unit Description',
            width: 200,
            editable: true,
            valueGetter: (params: any) => params.description || '',
            renderEditCell: (params: GridRenderEditCellParams) => (
                <Box className="custom-select">
                    <Select
                        value={params.value ? params.value.id : ''}
                        onChange={(e) => params.api.setEditCellValue({ id: params.id, field: 'unit', value: e.target.value })}
                        className="row-select"
                        defaultValue={1}
                    >
                        {unitOptions.map((unit) => (
                            <MenuItem key={unit.id} value={unit.id}>
                                {unit.description}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            ),
        },
        { field: 'sub_unit_code', headerName: 'Sub Unit Code', width: 150, editable: true },
        { field: 'sub_unit_description', headerName: 'Description', width: 300, editable: true },
        { field: 'abbreviation', headerName: 'Abbreviation', width: 150, editable: true },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                onClick={() => handleDeleteRow(params.id)}
                />,
            ],
        },
    ];

    return (
        <>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={updatedRows}
                    columns={columns}
                    paginationMode="server"
                    processRowUpdate={processRowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    pageSizeOptions={[5]}
                    hideFooter
                />
            </div>
            <ToastContainer />
            <Pagination
                count={count}
                color="secondary"
                sx={{ marginTop: '10px' }}
                onChange={(event, value) => pagination(value)}
            />
        </>
    );
};

export default SubUnitTable;
