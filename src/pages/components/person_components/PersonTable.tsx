import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderEditCellParams, GridActionsCellItem } from '@mui/x-data-grid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pagination, Select, MenuItem, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import app from '../../../http_settings';
import './PersonTable.css'; // Import custom CSS

type Person = {
  id: number;
  full_name: string;
  rank: any;
  unit: any;
  sub_unit: any;
  station: any;
  email: string;
};

type PersonTableProps = {
  rows: Person[];
  count: number;
  pagination: (value: number) => void;
};

const PersonTable: React.FC<PersonTableProps> = ({ rows, count, pagination }) => {
  const [updatedRows, setUpdatedRows] = useState<Person[]>(rows);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [rankOptions, setRankOption] = useState<any>([]);
  const [unitOptions, setUnitOption] = useState<any>([]);
  const [subUnitOptions, setSubUnitOption] = useState<any>([]);
  const [stationOptions, SetStationOption] = useState<any>([]);

  useEffect(() => {
    setUpdatedRows(rows);
  }, [rows]);

  useEffect(() => {
    const getRankOptions = async () => {
      await app.get('/api/rank_choices/').then((res) => {
        setRankOption(res.data);
      });
    };
    const getUnitOptions = async () => {
      await app.get('/api/unit_choices/').then((res) => {
        setUnitOption(res.data);
      });
    };
    const getSubUnitOptions = async () => {
      await app.get('/api/subunit_choices/').then((res) => {
        setSubUnitOption(res.data);
      });
    };
    const getStationOptions = async () => {
      await app.get('/api/station_choices/').then((res) => {
        SetStationOption(res.data);
      });
    };

    getRankOptions();
    getUnitOptions();
    getSubUnitOptions();
    getStationOptions();
  }, []);

  const handleDeleteRow = async (id: any) => {
    try {
      await app.delete(`/api/person/${id}/`).then((res) => {
        console.log(res)
      });
      setUpdatedRows((prevRows) => prevRows.filter((row) => row.id !== id));
      toast.success('Row deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete row: ${error.message}`);
    }
  };

  const columns: GridColDef[] = [
    { field: 'full_name', headerName: 'Full Name', width: 200, editable: true },
    {
      field: 'rank',
      headerName: 'Rank',
      width: 150,
      editable: true,
      valueGetter: (params: any) => params.rank_code,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Box className="custom-select">
          <Select
            value={params.value ? params.value : ''}
            onChange={(e) => params.api.setEditCellValue({ id: params.id, field: 'rank', value: e.target.value })}
            className="row-select"
          >
            {rankOptions.map((rank: any) => (
              <MenuItem key={rank.id} value={rank.id}>
                {rank.rank_code}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ),
    },
    {
      field: 'unit',
      headerName: 'Unit',
      width: 200,
      editable: true,
      valueGetter: (params: any) => params.description,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Box className="custom-select">
          <Select
            value={params.value ? params.value : ''}
            onChange={(e) => params.api.setEditCellValue({ id: params.id, field: 'unit', value: e.target.value })}
            className="row-select"
          >
            {unitOptions.map((unit: any) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.description}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ),
    },
    {
      field: 'sub_unit',
      headerName: 'Sub Unit',
      width: 200,
      editable: true,
      valueGetter: (params: any) => params.sub_unit_description,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Box className="custom-select">
          <Select
            value={params.value ? params.value : ''}
            onChange={(e) => params.api.setEditCellValue({ id: params.id, field: 'sub_unit', value: e.target.value })}
            className="row-select"
          >
            {subUnitOptions.map((subUnit: any) => (
              <MenuItem key={subUnit.id} value={subUnit.id}>
                {subUnit.sub_unit_description}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ),
    },
    {
      field: 'station',
      headerName: 'Station',
      width: 250,
      editable: true,
      valueGetter: (params: any) => params.description,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Box className="custom-select">
          <Select
            value={params.value ? params.value : ''}
            onChange={(e) => params.api.setEditCellValue({ id: params.id, field: 'station', value: e.target.value })}
            className="row-select"
          >
            {stationOptions.map((station: any) => (
              <MenuItem key={station.id} value={station.id}>
                {station.description}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
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

  const processRowUpdate = (newRow: Person, oldRow: Person) => {
    const updatedRow: Person = {
      ...oldRow,
      full_name: newRow.full_name,
      email: newRow.email,
      rank: rankOptions.find((rank: any) => rank.id === newRow.rank) || oldRow.rank,
      unit: unitOptions.find((unit: any) => unit.id === newRow.unit) || oldRow.unit,
      sub_unit: subUnitOptions.find((subUnit: any) => subUnit.id === newRow.sub_unit) || oldRow.sub_unit,
      station: stationOptions.find((station: any) => station.id === newRow.station) || oldRow.station,
    };

    setUpdatedRows((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );

    app.patch(`/api/person/${updatedRow.id}/`, updatedRow).then((res: any) => {
      console.log(res);
    });

    toast.success(`Updated row: ${newRow.full_name}`);
    return updatedRow;
  };

  const handleProcessRowUpdateError = (error: Error) => {
    toast.error(error.message);
  };

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={updatedRows}
          columns={columns}
          pageSizeOptions={[5]}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          hideFooter
          initialState={{
            sorting: {
              sortModel: [{ field: 'full_name', sort: 'asc' }],
            },
          }}
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

export default PersonTable;
