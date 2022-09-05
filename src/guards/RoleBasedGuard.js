import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import jwtDecode from 'jwt-decode';
import useAuth from '../hooks/useAuth';
// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node,
};

const useCurrentRole = () => {
  // Logic here to get current user role
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  const decode = jwtDecode(accessToken);
  return decode !== null ? decode.role : null;
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const currentRole = useCurrentRole();
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page. Click{' '}
          <Link
            title="Login"
            onClick={async () => {
              await logout();
              navigate('/auth/login');
            }}
            style={{ cursor: 'pointer' }}
          >
            here
          </Link>{' '}
          to login again
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
