const { v4: uuidv4 } = require('uuid');

// ── City Coordinates (lat, lng) ──────────────────────────────────
const cityCoords = {
  'Chennai':    { lat: 13.0827, lng: 80.2707 },
  'Bangalore':  { lat: 12.9716, lng: 77.5946 },
  'Salem':      { lat: 11.6643, lng: 78.1460 },
  'Erode':      { lat: 11.3410, lng: 77.7172 },
  'Coimbatore': { lat: 11.0168, lng: 76.9558 },
  'Madurai':    { lat: 9.9252,  lng: 78.1198 },
  'Trichy':     { lat: 10.7905, lng: 78.7047 },
  'Vellore':    { lat: 12.9165, lng: 79.1325 },
  'Hosur':      { lat: 12.7409, lng: 77.8253 },
  'Krishnagiri':{ lat: 12.5186, lng: 78.2137 },
  'Dharmapuri': { lat: 12.1211, lng: 78.1582 },
  'Tirunelveli':{ lat: 8.7139,  lng: 77.7567 },
};

// ── Route graph (adjacency — bidirectional) ──────────────────────
const routeGraph = {
  'Chennai':     ['Vellore', 'Krishnagiri', 'Trichy', 'Salem'],
  'Vellore':     ['Chennai', 'Krishnagiri', 'Hosur', 'Bangalore'],
  'Krishnagiri': ['Vellore', 'Hosur', 'Salem', 'Dharmapuri', 'Chennai'],
  'Hosur':       ['Bangalore', 'Krishnagiri', 'Vellore'],
  'Bangalore':   ['Hosur', 'Vellore', 'Salem', 'Krishnagiri'],
  'Salem':       ['Chennai', 'Erode', 'Trichy', 'Krishnagiri', 'Bangalore', 'Dharmapuri'],
  'Erode':       ['Salem', 'Coimbatore', 'Trichy'],
  'Coimbatore':  ['Erode', 'Madurai', 'Trichy'],
  'Trichy':      ['Chennai', 'Salem', 'Erode', 'Madurai', 'Coimbatore'],
  'Madurai':     ['Trichy', 'Coimbatore', 'Tirunelveli'],
  'Dharmapuri':  ['Salem', 'Krishnagiri'],
  'Tirunelveli': ['Madurai'],
};

// ── Users ────────────────────────────────────────────────────────
const users = [
  { id: 'u1', email: 'business@test.com',  password: 'password', role: 'business',  name: 'Rajesh Kumar',    company: 'TN Exports Pvt Ltd' },
  { id: 'u2', email: 'transport@test.com', password: 'password', role: 'transport', name: 'Suresh Logistics', company: 'Suresh Fleet Services' },
  { id: 'u3', email: 'driver@test.com',    password: 'password', role: 'driver',    name: 'Anand M',         phone: '+91 98765 43210' },
  { id: 'u4', email: 'admin@test.com',     password: 'password', role: 'admin',     name: 'Platform Admin' },
  { id: 'u5', email: 'biz2@test.com',      password: 'password', role: 'business',  name: 'Meena Traders',   company: 'Meena Exports' },
  { id: 'u6', email: 'driver2@test.com',   password: 'password', role: 'driver',    name: 'Karthik R',       phone: '+91 87654 32109' },
];

// ── Drivers ──────────────────────────────────────────────────────
const drivers = [
  { id: 'd1', userId: 'u3', name: 'Anand M',    phone: '+91 98765 43210', licenseNo: 'TN-DL-2024-00123', status: 'available', assignedTruckId: null },
  { id: 'd2', userId: 'u6', name: 'Karthik R',  phone: '+91 87654 32109', licenseNo: 'TN-DL-2024-00456', status: 'available', assignedTruckId: null },
];

// ── Trucks ────────────────────────────────────────────────────────
const trucks = [
  { id: 't1', ownerId: 'u2', truckNumber: 'TN-01-AB-1234', truckType: 'Container',   capacity: 10, currentCity: 'Bangalore', destinationCity: 'Chennai',   status: 'available', verified: true },
  { id: 't2', ownerId: 'u2', truckNumber: 'TN-02-CD-5678', truckType: 'Open Body',   capacity: 8,  currentCity: 'Salem',     destinationCity: 'Madurai',   status: 'available', verified: true },
  { id: 't3', ownerId: 'u2', truckNumber: 'TN-03-EF-9012', truckType: 'Flatbed',     capacity: 15, currentCity: 'Coimbatore',destinationCity: 'Chennai',   status: 'in-transit', verified: true },
  { id: 't4', ownerId: 'u2', truckNumber: 'KA-04-GH-3456', truckType: 'Refrigerated',capacity: 5,  currentCity: 'Erode',     destinationCity: 'Bangalore', status: 'available', verified: false },
  { id: 't5', ownerId: 'u2', truckNumber: 'TN-05-IJ-7890', truckType: 'Container',   capacity: 12, currentCity: 'Trichy',    destinationCity: 'Coimbatore',status: 'available', verified: true },
];

// ── Loads ─────────────────────────────────────────────────────────
const loads = [
  // Jan 2026 - business u1
  { id: 'l0a', businessId: 'u1', pickupCity: 'Chennai', dropCity: 'Bangalore', cargoType: 'Electronics', weight: 4, price: 22000, pickupTime: '2026-01-15T08:00:00', status: 'delivered', matchedTruckId: 't1', assignedDriverId: 'd1', createdAt: '2026-01-10T10:00:00' },
  { id: 'l0b', businessId: 'u1', pickupCity: 'Salem', dropCity: 'Chennai', cargoType: 'Textiles', weight: 6, price: 15000, pickupTime: '2026-01-20T09:00:00', status: 'delivered', matchedTruckId: 't2', assignedDriverId: 'd2', createdAt: '2026-01-18T11:00:00' },
  // Feb 2026 - business u1
  { id: 'l0c', businessId: 'u1', pickupCity: 'Bangalore', dropCity: 'Coimbatore', cargoType: 'Auto Parts', weight: 5, price: 28000, pickupTime: '2026-02-05T10:00:00', status: 'delivered', matchedTruckId: 't3', assignedDriverId: 'd1', createdAt: '2026-02-01T09:00:00' },
  { id: 'l0d', businessId: 'u1', pickupCity: 'Erode', dropCity: 'Bangalore', cargoType: 'Chemicals', weight: 3, price: 12000, pickupTime: '2026-02-12T07:00:00', status: 'delivered', matchedTruckId: 't4', assignedDriverId: null, createdAt: '2026-02-10T14:00:00' },
  { id: 'l0e', businessId: 'u1', pickupCity: 'Madurai', dropCity: 'Chennai', cargoType: 'Food Products', weight: 4, price: 16000, pickupTime: '2026-02-25T08:00:00', status: 'delivered', matchedTruckId: 't5', assignedDriverId: 'd2', createdAt: '2026-02-22T10:00:00' },
  // Mar 2026 - business u1
  { id: 'l1', businessId: 'u1', pickupCity: 'Bangalore', dropCity: 'Chennai',    cargoType: 'Electronics',    weight: 5,  price: 18000, pickupTime: '2026-03-16T08:00:00', status: 'posted',    matchedTruckId: null, assignedDriverId: null, createdAt: '2026-03-14T10:00:00' },
  { id: 'l2', businessId: 'u1', pickupCity: 'Bangalore', dropCity: 'Vellore',    cargoType: 'Textiles',       weight: 3,  price: 8000,  pickupTime: '2026-03-16T10:00:00', status: 'posted',    matchedTruckId: null, assignedDriverId: null, createdAt: '2026-03-14T11:00:00' },
  { id: 'l3', businessId: 'u5', pickupCity: 'Hosur',     dropCity: 'Chennai',    cargoType: 'Auto Parts',     weight: 7,  price: 15000, pickupTime: '2026-03-16T14:00:00', status: 'posted',    matchedTruckId: null, assignedDriverId: null, createdAt: '2026-03-14T12:00:00' },
  { id: 'l4', businessId: 'u1', pickupCity: 'Salem',     dropCity: 'Madurai',    cargoType: 'Food Products',  weight: 4,  price: 12000, pickupTime: '2026-03-17T06:00:00', status: 'posted',    matchedTruckId: null, assignedDriverId: null, createdAt: '2026-03-14T13:00:00' },
  { id: 'l5', businessId: 'u5', pickupCity: 'Coimbatore',dropCity: 'Chennai',    cargoType: 'Machinery',      weight: 10, price: 25000, pickupTime: '2026-03-17T09:00:00', status: 'matched',   matchedTruckId: 't3', assignedDriverId: null, createdAt: '2026-03-13T10:00:00' },
  { id: 'l6', businessId: 'u1', pickupCity: 'Erode',     dropCity: 'Bangalore',  cargoType: 'Chemicals',      weight: 6,  price: 14000, pickupTime: '2026-03-17T11:00:00', status: 'posted',    matchedTruckId: null, assignedDriverId: null, createdAt: '2026-03-14T14:00:00' },
  { id: 'l7', businessId: 'u5', pickupCity: 'Trichy',    dropCity: 'Coimbatore', cargoType: 'Cotton Bales',   weight: 8,  price: 11000, pickupTime: '2026-03-18T07:00:00', status: 'posted',    matchedTruckId: null, assignedDriverId: null, createdAt: '2026-03-14T15:00:00' },
  { id: 'l8', businessId: 'u1', pickupCity: 'Bangalore', dropCity: 'Salem',      cargoType: 'Furniture',      weight: 4,  price: 9500,  pickupTime: '2026-03-18T10:00:00', status: 'posted',    matchedTruckId: null, assignedDriverId: null, createdAt: '2026-03-14T16:00:00' },
];

// ── Shipments ────────────────────────────────────────────────────
const shipments = [
  {
    id: 's1',
    loadId: 'l5',
    truckId: 't3',
    driverId: 'd1',
    status: 'in-transit',
    pickupCity: 'Coimbatore',
    dropCity: 'Chennai',
    progress: 0.35,
    startedAt: '2026-03-15T09:00:00',
    updatedAt: '2026-03-15T14:00:00',
    statusHistory: [
      { status: 'matched',   at: '2026-03-14T10:00:00' },
      { status: 'picked-up', at: '2026-03-15T09:00:00' },
      { status: 'in-transit', at: '2026-03-15T09:30:00' },
    ]
  },
];

// ── Businesses ───────────────────────────────────────────────────
const businesses = [
  { id: 'b1', userId: 'u1', name: 'TN Exports Pvt Ltd',  gst: '33AABCT1234F1Z5', city: 'Chennai',   verified: true },
  { id: 'b2', userId: 'u5', name: 'Meena Exports',       gst: '33AABCM5678G2Z3', city: 'Coimbatore', verified: true },
];

module.exports = {
  cityCoords,
  routeGraph,
  users,
  drivers,
  trucks,
  loads,
  shipments,
  businesses,
};
