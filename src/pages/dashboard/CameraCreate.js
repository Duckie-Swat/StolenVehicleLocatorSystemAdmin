import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import CameraNewEditForm from '../../sections/@dashboard/camera/CameraNewEditForm';

// ----------------------------------------------------------------------

export default function CameraCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const currentCamera = _userList.find((camera) => paramCase(camera.name) === name);

  return (
    <Page title="camera: Create a new camera">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new camera' : 'Edit camera'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'camera', href: PATH_DASHBOARD.camera.list },
            { name: !isEdit ? 'New camera' : capitalCase(name) },
          ]}
        />

        <CameraNewEditForm isEdit={isEdit} currentCamera={currentCamera} />
      </Container>
    </Page>
  );
}
