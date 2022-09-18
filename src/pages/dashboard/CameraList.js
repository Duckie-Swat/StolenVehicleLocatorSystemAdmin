import { paramCase } from 'change-case';
import { debounce } from 'lodash';
import { useEffect, useState, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Box,
  Tab,
  Tabs,
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
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { CameraTableToolbar, CameraTableRow } from '../../sections/@dashboard/camera/list';
// ----------------------------------------------------------------------
import { getCameras, setPage, setLimit, setKeyword, setOrderDesc, setOrderProperty } from '../../redux/slices/camera';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'lastUpdatedAt', label: 'Last Updated At', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function CameraList() {
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

  const { cameras, page, limit, keyword, orderProperty, desc, totalItems } = useSelector((state) => state.camera);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterRole, setFilterRole] = useState('all');

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
        getCameras({
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

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
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
    navigate(PATH_DASHBOARD.camera.edit(paramCase(id)));
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
      getCameras({
        page,
        limit,
        keyword,
        orderProperty,
        desc,
      })
    );
  }, [dispatch, limit, page, orderProperty, desc]);

  useEffect(() => {
    if (cameras) {
      setTableData(cameras);
    }
  }, [cameras]);

  return (
    <Page title="Camera: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Camera List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Camera', href: PATH_DASHBOARD.camera.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.camera.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New Camera
            </Button>
          }
        />

        <Card>
          <Divider />

          <CameraTableToolbar
            filterName={keyword}
            filterRole={filterRole}
            onFilterName={handleSearch}
            onFilterRole={handleFilterRole}
          />

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
                    <CameraTableRow
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
