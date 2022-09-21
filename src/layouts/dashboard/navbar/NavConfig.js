// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  dashboard: getIcon('ic_dashboard'),
  lostVehicles: getIcon('ic_my_lost_vehicles'),
  camera: getIcon('ic_camera'),
  user: getIcon('ic_user'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [{ title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard }],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'list', path: PATH_DASHBOARD.user.list },
          // { title: 'create', path: PATH_DASHBOARD.user.new },
          // { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      // LOST VEHICLES
      {
        title: 'lost vehicles',
        path: PATH_DASHBOARD.lostVehicles.root,
        icon: ICONS.lostVehicles,
        children: [
          { title: 'list', path: PATH_DASHBOARD.lostVehicles.list },
          { title: 'create', path: PATH_DASHBOARD.lostVehicles.new },
        ],
      },

      // CAMERAS
      {
        title: 'cameras',
        path: PATH_DASHBOARD.camera.root,
        icon: ICONS.camera,
        children: [
          { title: 'list', path: PATH_DASHBOARD.camera.list },
          { title: 'create', path: PATH_DASHBOARD.camera.new },
        ],
      },

      // DETECTED RESULTS
      {
        title: 'detected results',
        path: PATH_DASHBOARD.detectedResults.root,
        icon: ICONS.camera,
        children: [{ title: 'list', path: PATH_DASHBOARD.detectedResults.list }],
      },
    ],
  },
];

export default navConfig;
