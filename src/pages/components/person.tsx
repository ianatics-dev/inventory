import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Title from './Title';
import { Box, Button, Tab } from '@mui/material';
import PersonModal from './person_components/PersonModal';
import UnitModal from './person_components/UnitModal';
import RankModal from './person_components/RankModal';
import PersonTable from './person_components/PersonTable';
import UnitTable from './person_components/UnitTable';
import RankTable from './person_components/RankTable';
import SubUnitTable from './person_components/SubUnitTable';
import StationTable from './person_components/StationTable';
import SubUnitModal from './person_components/SubUnitModal';
import StationModal from './person_components/StationModal';

// Add this import statement for the Unit and Rank types
import { Person, Unit, Rank } from './person_components/types'; // Update the path if needed
import axios from 'axios';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import app from '../../http_settings';

export default function PersonDashboard() {
  const [addPersonModalOpen, setAddPersonModalOpen] = useState(false);
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [subUnitModal, setSubUnitModal] = useState(false);
  const [stationModal, setStationModal] = useState(false);
  const [personData, setPersonData] = useState<any>([]);
  const [personCount, setPersonCount] = useState<any>();
  const [unitCount, setUnitCount] = useState<any>();
  const [rankCount, setRankCount] = useState<any>();
  const [unit, setUnit] = useState<any>([]);
  const [rank, setRank] = useState<any>([]);
  const [value, setValue] = React.useState('1');
  const [subUnitData, setSubUnitData] = useState<any>();
  const [subUnitCount, setSubUnitCount] = useState<any>();
  const [stationData, setStationData] = useState<any>();
  const [stationCount, setStationCount] = useState<any>();

  const [unitList, setUnitList] = React.useState<any>([]);
  const [rankList, setRankList] = React.useState<any>([]);
  const [subUnitList, setSubUnitList] = React.useState<any>([]);
  const [stationList, setStationList] = React.useState<any>([]);

  const fetchPersonData = (page: any) => {
    app.get(`/api/person/?page=${page}`).then((res: any) => {
      setPersonData(res.data.results)
    })
  }

  const fetchUnitData = (page: any) => {
    app.get(`/api/unit/?page=${page}`).then((res: any) => {
      setUnit(res.data.results)
    })
  }

  const fetchRankData = (page: any) => {
    app.get(`/api/rank/?page=${page}`).then((res: any) => {
      setRank(res.data.results)
    })
  }

  const fetchSubUnit = (page: any) => {
    app.get(`/api/sub_unit/?page=${page}`).then((res: any) => {
      setSubUnitData(res.data.results)
    })
  }

  const fetchStation = (page: any) => {
    app.get(`/api/station/?page=${page}`).then((res: any) => {
      setStationData(res.data.results)
    })
  }

  const updateUnitDropdown = () => {
    app.get("/api/unit_choices/").then((res: any) => {
      setUnitList(res.data)
    })
  }

  const updateRankDropdown = () => {
    app.get("/api/rank_choices/").then((res: any) => {
      setRankList(res.data)
    })
  }

  const handleCloseAddPersonModal = () => {
    setAddPersonModalOpen(false);
  };

  const handleCloseUnitModal = () => {
    setUnitModalOpen(false);
  };

  const handleCloseRankModal = () => {
    setRankModalOpen(false);
  };

  const handleAddPerson = (person: any) => {
    app.post('/api/person/', {
      acccount_number: person.accountNumber,
      full_name: person.full_name,
      rank: person.rank,
      sub_unit: person.sub_unit,
      unit: person.unit,
      email: person.email,
      station: person.station
    }).then((res: any) => {
      fetchPersonData(1)
    })
  };

  const handleAddUnit = (data: any) => {
    app.post('/api/unit/', {
      unit_code: data.unit_code,
      description: data.description,
    }).then((res: any) => {
      fetchUnitData(1);
      updateUnitDropdown();
    })
  };

  const handelAddSubUnit = (data: any) => {
    app.post('/api/sub_unit/', {
      unit: data.units,
      sub_unit_code: data.sub_unit_code,
      sub_unit_description: data.sub_unit_description,
      abbreviation: data.abbreviation
    }).then((res: any) => {
      fetchSubUnit(1);
    })
  }

  const handelAddStation = (data: any) => {
    app.post('/api/station/', {
      sub_unit: data.sub_unit,
      station_code: data.station_code,
      station_name: data.station_name,
      description: data.description
    }).then((res: any) => {
      fetchStation(1);
    })
  }

  const handleAddRank = (data: any) => {
    app.post('/api/rank/', {
      rank_code: data.rank_code,
      description: data.description,
    }).then((res: any) => {
      fetchRankData(1)
      updateRankDropdown();
    })
  };

  useEffect(() => {
    const getData = async () => {
      app.get(`/api/person/`).then((res: any) => {
        setPersonData(res.data.results)
        setPersonCount(Math.ceil(res.data.count / res.data.results.length))
      })
    }
    const getUnit = async () => {
      app.get(`/api/unit/`).then((res: any) => {
        setUnit(res.data.results)
        setUnitCount(Math.ceil(res.data.count / res.data.results.length))
      })
    }
    const getRank = async () => {
      app.get(`/api/rank/`).then((res: any) => {
        setRank(res.data.results)
        setRankCount(Math.ceil(res.data.count / res.data.results.length))
      })
    }
    const getSubUnit = async () => {
      app.get(`/api/sub_unit/`).then((res: any) => {
        setSubUnitData(res.data.results)
        setSubUnitCount(Math.ceil(res.data.count / res.data.results.length))
      })
    }
    const getStation = async () => {
      app.get(`/api/station/`).then((res: any) => {
        setStationData(res.data.results)
        setStationCount(Math.ceil(res.data.count / res.data.results.length))
      })
    }

    getData();
    getUnit();
    getRank();
    getSubUnit();
    getStation();
  }, [])

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    app.get("/api/unit_choices/", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then((res: any) => {
      setUnitList(res.data)
    })
  }, [])

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    app.get("/api/rank_choices/", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then((res: any) => {
      setRankList(res.data)
    })
  }, [])

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    app.get("/api/subunit_choices/", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then((res: any) => {
      setSubUnitList(res.data)
    })
  }, [])

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    app.get("/api/station_choices/", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then((res: any) => {
      setStationList(res.data)
    })
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Person" value="1" />
              <Tab label="Rank" value="2" />
              <Tab label="Unit" value="3" />
              <Tab label="Sub Unit" value="4" />
              <Tab label="Station" value="5" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <React.Fragment>
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <Button variant="contained" onClick={() => setAddPersonModalOpen(true)}>
                  Add Person
                </Button>
              </Box>
              <Title>Person</Title>
              <PersonTable rows={personData} count={personCount}
                pagination={
                  (page: any) => {
                    fetchPersonData(page)
                  }}
              />
            </React.Fragment>
          </TabPanel>
          <TabPanel value="2">
            <React.Fragment>
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <Button variant="contained" onClick={() => setRankModalOpen(true)}>
                  Add Rank
                </Button>
              </Box>
              <Title>Rank</Title>
              <RankTable rows={rank} count={rankCount}
                pagination={
                  (page: any) => {
                    fetchRankData(page)
                  }}
              />
            </React.Fragment>
            <RankModal open={rankModalOpen} onClose={handleCloseRankModal} onAddRank={handleAddRank} />
          </TabPanel>
          <TabPanel value="3">
            <React.Fragment>
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <Button variant="contained" onClick={() => setUnitModalOpen(true)}>
                  Add Unit
                </Button>
              </Box>
              <Title>Unit</Title>
              <UnitTable rows={unit} count={unitCount}
                pagination={
                  (page: any) => {
                    fetchUnitData(page)
                  }}
              />
            </React.Fragment>
            <UnitModal open={unitModalOpen} onClose={handleCloseUnitModal} onAddUnit={handleAddUnit} />
          </TabPanel>
          <TabPanel value="4">
            <React.Fragment>
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <Button variant="contained" onClick={() => setSubUnitModal(true)}>
                  Add Sub Unit
                </Button>
              </Box>
              <Title>Sub Unit</Title>
              <SubUnitTable
                rows={subUnitData} count={subUnitCount}
              pagination={
                (page: any) => {
                  fetchSubUnit(page)
                }}
              />
            </React.Fragment>
            <SubUnitModal open={subUnitModal} units={unitList} onClose={() => setSubUnitModal(false)} onAddSubUnit={handelAddSubUnit} />
          </TabPanel>
          <TabPanel value="5">
            <React.Fragment>
              <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                <Button variant="contained" onClick={() => setStationModal(true)}>
                  Add Station
                </Button>
              </Box>
              <Title>Station</Title>
              <StationTable
                rows={stationData} count={stationCount}
              pagination={
                (page: any) => {
                  fetchStation(page)
                }}
              />
            </React.Fragment>
            <StationModal open={stationModal} subUnits={subUnitList} onClose={() => setStationModal(false)} onAddStation={handelAddStation}/>
          </TabPanel>
        </TabContext>
      </Box>
      <PersonModal
        open={addPersonModalOpen}
        onClose={handleCloseAddPersonModal}
        onAddPerson={handleAddPerson}
        units={unitList}
        ranks={rankList}
        subunit={subUnitList}
        stationData={stationList}
      />
    </Grid>
  );
}
