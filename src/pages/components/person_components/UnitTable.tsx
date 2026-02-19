import React, { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pagination } from '@mui/material';
import app from '../../../http_settings';
import DeleteIcon from '@mui/icons-material/Delete';

type Unit = {
  id: number;
  unit_code: string;
  description: string;
};

type UnitTableProps = {
  rows: Unit[];
  count: number;
  pagination: (value: number) => void;
};

const UnitTable: React.FC<UnitTableProps> = ({ rows, count, pagination }) => {
  const [updatedRows, setUpdatedRows] = useState<Unit[]>(rows);

  useEffect(() => {
    setUpdatedRows(rows);
  }, [rows]);

  const handleDeleteRow = async (id: any) => {
    try {
      await app.delete(`/api/unit/${id}/`).then((res) => {
        console.log(res)
      });
      setUpdatedRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success('Row deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete row: ${error.message}`);
    }
  };

  const processRowUpdate = (newRow: Unit, oldRow: Unit) => {
    const updatedRow = { ...oldRow, ...newRow };

    setUpdatedRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );

    app.patch(`/api/unit/${updatedRow.id}/`, updatedRow).then((res: any) => {
      console.log(res)
    })

    toast.success(`Updated row with ID: ${newRow.id}`);
    return updatedRow;
  };

  const handleProcessRowUpdateError = (error: Error) => {
    toast.error(`Update failed: ${error.message}`);
  };

  const columns: GridColDef[] = [
    { field: 'unit_code', headerName: 'Unit Code', width: 150, editable: true },
    { field: 'description', headerName: 'Description', width: 300, editable: true },
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

export default UnitTable;
