import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

// Loads
export const getLoads = (params) =>
  api.get('/loads', { params }).then(r => r.data);

export const getLoad = (id) =>
  api.get(`/loads/${id}`).then(r => r.data);

export const createLoad = (data) =>
  api.post('/loads', data).then(r => r.data);

export const updateLoad = (id, data) =>
  api.patch(`/loads/${id}`, data).then(r => r.data);

// Trucks
export const getTrucks = (params) =>
  api.get('/trucks', { params }).then(r => r.data);

export const createTruck = (data) =>
  api.post('/trucks', data).then(r => r.data);

export const updateTruck = (id, data) =>
  api.patch(`/trucks/${id}`, data).then(r => r.data);

// Matching
export const getMatchedLoads = (truckId) =>
  api.get(`/matching/${truckId}`).then(r => r.data);

// Shipments
export const getShipments = (params) =>
  api.get('/shipments', { params }).then(r => r.data);

export const createShipment = (data) =>
  api.post('/shipments', data).then(r => r.data);

export const updateShipmentStatus = (id, status) =>
  api.patch(`/shipments/${id}/status`, { status }).then(r => r.data);

export const assignDriver = (id, driverId) =>
  api.patch(`/shipments/${id}/assign-driver`, { driverId }).then(r => r.data);

// Tracking
export const getTracking = (shipmentId) =>
  api.get(`/tracking/${shipmentId}`).then(r => r.data);

// Admin
export const getAdminStats = () =>
  api.get('/admin/stats').then(r => r.data);

export const getAdminTrucks = () =>
  api.get('/admin/trucks').then(r => r.data);

export const getAdminBusinesses = () =>
  api.get('/admin/businesses').then(r => r.data);

export const getAdminDrivers = () =>
  api.get('/admin/drivers').then(r => r.data);

export const verifyTruck = (id) =>
  api.patch(`/admin/verify/truck/${id}`).then(r => r.data);

export const verifyBusiness = (id) =>
  api.patch(`/admin/verify/business/${id}`).then(r => r.data);

// Drivers
export const getDrivers = () =>
  api.get('/drivers').then(r => r.data);

export default api;
