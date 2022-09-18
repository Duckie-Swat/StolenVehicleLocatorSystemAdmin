import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
import { fDateTime } from '../../../../utils/formatTime';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import lostVehicleRequestStatusConstants from '../../../../constants/lostVehicleRequestStatusConstants';

// ----------------------------------------------------------------------

LostVehicleRequestTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function LostVehicleRequestTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { plateNumber, vehicleType, location, createdAt, lastUpdatedAt, status } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {plateNumber}
        </Typography>
      </TableCell>

      <TableCell align="left">{vehicleType}</TableCell>

      <TableCell align="left">{location}</TableCell>

      <TableCell align="left">{fDateTime(createdAt)}</TableCell>

      <TableCell align="left">{fDateTime(lastUpdatedAt)}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === lostVehicleRequestStatusConstants.PROCESSING && 'warning') ||
            (status === lostVehicleRequestStatusConstants.SUCCESS && 'success') ||
            'error'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {(status === lostVehicleRequestStatusConstants.PROCESSING && 'processing') ||
            (status === lostVehicleRequestStatusConstants.SUCCESS && 'success') ||
            'abanonded'}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Abandon
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
