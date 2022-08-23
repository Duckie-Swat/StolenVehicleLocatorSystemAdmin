import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import jwtDecode from 'jwt-decode';
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

  if (!accessibleRoles.includes(currentRole)) {
    localStorage.removeItem('accessToken');
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page. Click{' '}
          <Link
            title="Login"
            onClick={() => {
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
