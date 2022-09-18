import { paramCase } from 'change-case';
import { debounce } from 'lodash';
import { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks

import useSettings from '../../hooks/useSettings';
import useTable, { emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableSelectedActions } from '../../components/table';
// sections
import {
  LostVehicleRequestTableToolbar,
  LostVehicleRequestTableRow,
} from '../../sections/@dashboard/lost-vehicles/list';
// ----------------------------------------------------------------------
import {
  getLostVehicleRequest,
  setPage,
  setLimit,
  setKeyword,
  setOrderDesc,
  setOrderProperty,
} from '../../redux/slices/lostVehicleRequest';

const TABLE_HEAD = [
  { id: 'plateNumber', label: 'Plate Number', align: 'left' },
  { id: 'vehicleType', label: 'Vehicle Type', align: 'left' },
  { id: 'location', label: 'Location', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'lastUpdatedAt', label: 'Last Updated At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function LostVehicleRequestList() {
  const {
    dense,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onChangeDense,
  } = useTable();

  const { themeStretch } = useSettings();

  const { lostVehicleRequests, page, limit, keyword, orderProperty, desc, totalItems } = useSelector(
    (state) => state.lostVehicleRequest
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const onSort = (id) => {
    const isAsc = orderProperty === id && desc === false;
    if (id !== '') {
      dispatch(setOrderDesc(isAsc));
      dispatch(setOrderProperty(id));
    }
  };

  const debounceSearch = useCallback(
    debounce((query) => {
      dispatch(
        getLostVehicleRequest({
          page,
          limit,
          keyword: query,
          orderProperty,
          desc,
        })
      );
    }, 1000),
    []
  );

  const handleSearch = (query) => {
    dispatch(setKeyword(query));
    debounceSearch(query);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.lostVehicles.edit(paramCase(id)));
  };

  const onChangeRowsPerPage = (event) => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };

  const denseHeight = dense ? 52 : 72;

  const onPageChange = (event, newPage) => {
    dispatch(setPage(newPage + 1));
  };

  useEffect(() => {
    dispatch(
      getLostVehicleRequest({
        page,
        limit,
        keyword,
        orderProperty,
        desc,
      })
    );
  }, [dispatch, limit, page, orderProperty, desc]);

  useEffect(() => {
    if (lostVehicleRequests) {
      setTableData(lostVehicleRequests);
    }
  }, [lostVehicleRequests]);

  return (
    <Page title="Lost Vehicles: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Lost Vehicles List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Lost Vehicles', href: PATH_DASHBOARD.lostVehicles.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.lostVehicles.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Create New Lost Vehicle Request
            </Button>
          }
        />

        <Card>
          <Divider />

          <LostVehicleRequestTableToolbar filterName={keyword} onFilterName={handleSearch} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                        <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>
                    </Tooltip>
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={desc ? 'desc' : 'asc'}
                  orderBy={orderProperty}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {tableData.map((row) => (
                    <LostVehicleRequestTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.name)}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page - 1, limit, tableData.length)} />

                  {/* <TableNoData isNotFound={isNotFound} /> */}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalItems}
              rowsPerPage={limit}
              page={page - 1}
              onPageChange={onPageChange}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
