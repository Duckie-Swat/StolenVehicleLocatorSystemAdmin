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
import { useSnackbar } from 'notistack';
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
import { UserTableToolbar, UserTableRow } from '../../sections/@dashboard/user/list';
// ----------------------------------------------------------------------
import {
  getUsers,
  setPage,
  setLimit,
  setKeyword,
  setOrderDesc,
  setOrderProperty,
  setIsDeleted,
} from '../../redux/slices/user';
import { SOFT_DELETE_USER_ENDPOINT, RESOTRE_USER_ENDPOINT } from '../../constants/apiEndpointConstants';
import axios from '../../utils/axios';

const STATUS_OPTIONS = ['all', 'active', 'deleted'];

const ROLE_OPTIONS = ['all', 'Admin', 'Customer'];

const TABLE_HEAD = [
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'fullName', label: 'fullName', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'emailConfirmed', label: 'Verified', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
  const { enqueueSnackbar } = useSnackbar();
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

  const { users, page, limit, keyword, orderProperty, desc, totalItems, isDeleted } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

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
        getUsers({
          page,
          limit,
          keyword: query,
          orderProperty,
          desc,
          isDeleted,
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

  const handleDeleteRow = async (id) => {
    try {
      await axios.delete(SOFT_DELETE_USER_ENDPOINT.replace('%s', id));
      dispatch(
        getUsers({
          page,
          limit,
          keyword,
          orderProperty,
          desc,
        })
      );
      setSelected([]);
      enqueueSnackbar('Delete user successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Delete user failed', { variant: 'error' });
    }
  };

  const handleRestoreRow = async (id) => {
    try {
      await axios.patch(RESOTRE_USER_ENDPOINT.replace('%s', id));
      dispatch(
        getUsers({
          page,
          limit,
          keyword,
          orderProperty,
          desc,
        })
      );
      setSelected([]);
      enqueueSnackbar('Restore user successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Restore user failed', { variant: 'error' });
    }
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
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
      getUsers({
        page,
        limit,
        keyword,
        orderProperty,
        desc,
        isDeleted,
      })
    );
  }, [dispatch, limit, page, orderProperty, desc, isDeleted]);

  useEffect(() => {
    if (users) {
      setTableData(
        users.map((user) => {
          return {
            ...user,
            fullName: `${user.firstName} ${user.lastName}`,
          };
        })
      );
    }
  }, [users]);

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New User
            </Button>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={(event, value) => {
              onChangeFilterStatus(event, value);
              if (value !== 'all') {
                dispatch(setIsDeleted(!(value === 'active')));
              } else {
                dispatch(setIsDeleted(null));
              }
            }}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <UserTableToolbar
            filterName={keyword}
            filterRole={filterRole}
            onFilterName={handleSearch}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
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
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => {
                        // onChangeFilterStatus(null, 'all');
                        return handleDeleteRow(row.id);
                      }}
                      onEditRow={() => handleEditRow(row.name)}
                      onRestoreRow={() => {
                        onChangeFilterStatus(null, 'all');
                        return handleRestoreRow(row.id);
                      }}
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
              rowsPerPageOptions={[20, 30, 50]}
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
