// Auth
export const LOGIN_ENDPOINT = '/api/v1/auth/login';
export const CHANGE_PASSWORD_ENDPOINT = '/api/v1/auth/my-account/password';
export const MY_PROFILE_ENDPOINT = '/api/v1/auth/my-account';
export const LOGOUT_ENDPOINT = '/api/v1/auth/my-account/logout';
// USER
export const USER_ENDPOINT = '/api/v1/users';
export const LIST_PAGINATED_USERS_ENDPOINT = '/api/v1/users/find';
export const SOFT_DELETE_USER_ENDPOINT = '/api/v1/users/%s/soft';
export const HARD_DELETE_USER_ENDPOINT = '/api/v1/users/%s/hard';
export const RESOTRE_USER_ENDPOINT = '/api/v1/users/%s/restore';

// Camera
export const LIST_PAGINATED_CAMERAS_ENDPOINT = '/api/v1/cameras/find';
export const CAMERA_ENDPOINT = '/api/v1/cameras';

// Notification
export const LIST_PAGINATED_MY_NOTIFICATIONS_ENDPOINT = '/api/v1/users/my-account/notifications/find';

// LostVehicleRequest
export const LIST_PAGINATED_LOST_VEHICLE_REQUESTS_ENDPOINT = '/api/v1/lost-vehicle-requests/find';
export const LOST_VEHICLE_REQUESTS_ENDPOINT = '/api/v1/lost-vehicle-requests';
