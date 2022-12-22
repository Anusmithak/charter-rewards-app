import { Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useState } from "react";

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 16
  },
  [`&.${tableCellClasses.body}`]: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: theme.typography.fontWeightBold,
    padding: "3rem"
  },
}));

const columns = [
  { id: 'userid', label: 'ID', minWidth: 100, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 170 },
  {
    id: 'last3rdMonthAmount', label: 'Amount', minWidth: 100,
    format: (value) => `$${value.toFixed(2)}`,
  },
  { id: 'last3rdMonthRewards', label: 'Points', minWidth: 100 },
  {
    id: 'last2ndMonthAmount', label: 'Amount', minWidth: 100,
    format: (value) => `$${value.toFixed(2)}`,
  },
  { id: 'last2ndMonthRewards', label: 'Points', minWidth: 100 },
  {
    id: 'lastMonthAmount', label: 'Amount', minWidth: 100,
    format: (value) => `$${value.toFixed(2)}`,
  },
  { id: 'lastMonthRewards', label: 'Points', minWidth: 100 },
  {
    id: 'totalAmount', label: 'Amount', minWidth: 100,
    format: (value) => `$${value.toFixed(2)}`,
  },
  {
    id: 'totalRewards',
    label: 'Points',
    minWidth: 120
  },
];


export default function RewardsList(props) {
  const { rows, isLoading = false } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  let currentMonth = new Date().getMonth();
  // Condition added when this code is tested in Jan, Feb, March
  if (currentMonth < 3) {
    currentMonth += 12;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead stickyHeader>
            <TableRow stickyHeader>
              <StyledTableCell align="center" colSpan={2}>
                Customer Details
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={2}>
                {monthList[currentMonth - 3]}
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={2}>
                {monthList[currentMonth - 2]}
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={2}>
                {monthList[currentMonth - 1]}
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={2}>
                Total
              </StyledTableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ?
              (
                <StyledTableCell colSpan={10}>Loading...</StyledTableCell>
              )
              : rows.length > 0 ? (rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })) : (
                <StyledTableCell colSpan={10}>No Data</StyledTableCell>
              )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
