/**
 * API Service Configuration
 * This file handles all backend network requests for the mobile app.
 */
import { Platform } from 'react-native';

// Determine the correct API base URL based on the platform.
// Android emulators use 10.0.2.2 to access the host machine's localhost.
const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://localhost:4000/api';

/**
 * Fetches all orders from the backend API.
 * @returns {Promise<Array>} A promise that resolves to an array of orders.
 */
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Failed to load orders');
  return res.json();
}

/**
 * Creates a new order on the backend API.
 * @param {Object} payload The order data to be created.
 * @returns {Promise<Object>} A promise that resolves to the newly created order.
 */
export async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create order');
  }
  return res.json();
}
