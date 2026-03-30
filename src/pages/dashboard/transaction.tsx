import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../components/Title';
import axios from 'axios';
import moment from 'moment';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Pagination, Select, TextField, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// import LocateModal from '../components/transaction_components/locateModal';
import ExploreIcon from '@mui/icons-material/Explore';
import app from '../../http_settings';

export default function TransactionTable() {
  const [data, setData] = useState<any>([]);
  const [count, setCount] = useState<any>();
  const [page, setPage] = useState<number>();
  const [pageCount, setPageCount] = useState<number>();
  const [searchInput, setSearchInput] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [additionalFilterOption, setAdditionalFilterOption] = useState('');
  const [openLocate, setOpenLocate] = useState<boolean>(false);
  const [token, setToken] = useState<any>('');

  const fetchData = async (page: number) => {
    app.get(`/api/transaction/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      setData(res.data.results)
      setPage(1)
    })
  }

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    setToken(access_token)
    const getData = async () => {
      app.get(`/api/transaction/`, {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }).then((res) => {
        setCount(Math.ceil(res.data.count / res.data.results.length))
        setData(res.data.results)
        setPage(1)
      })
    }
    getData();
  }, [])

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleFilterOptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterOption(event.target.value as string);
  };

  const handleAdditionalFilterOptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAdditionalFilterOption(event.target.value as string);
  };

  const searchBar = () => {
    // Perform filtering based on searchInput, filterOption, and additionalFilterOption
    // You can modify this according to your filtering logic
    return data.filter((row: any) => {
      return (
        row.person.full_name.toLowerCase().includes(searchInput.toLowerCase()) &&
        (!filterOption || row.person.rank?.rank_code === filterOption) &&
        (!additionalFilterOption || row.person.additionalProperty === additionalFilterOption)
      );
    });
  }

  const handleOnCloseLocate = () => {
    setOpenLocate(false)
  }

  const handleNextPage = (event: React.ChangeEvent<unknown>, value: number) => {
    // setPage(value);
    fetchData(value);
  };

  const filteredData = searchBar();

  const shortenText = (text: any, maxLength: any) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  let sampleText = "Carlos P. Garcia Highway, Purok 38, Ma-a, Langub, Davao City, Davao Region, 8000, Philippines";

  return (
    <React.Fragment>
      <Title>Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date & Time</TableCell>
            <TableCell>Rank / Name</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Station</TableCell>
            <TableCell>Last Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row: any) => {
            return (
              <TableRow key={row.id}>
                <TableCell>{moment(row.datetime).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
                <TableCell>{row.person.rank?.rank_code} / {row.person.full_name}</TableCell>
                <TableCell>{row.person.unit?.unit_code}</TableCell>
                <TableCell>{row.person.station?.station_name}</TableCell>
                <TableCell>
                  <Tooltip title={sampleText}>
                    <span>{shortenText(sampleText, 70)}</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Pagination count={count} color="secondary" sx={{ marginTop: "10px" }} onChange={handleNextPage} />
      {/* <LocateModal open={openLocate} onClose={handleOnCloseLocate} /> */}
      {/* <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link> */}
    </React.Fragment>
  );
}
