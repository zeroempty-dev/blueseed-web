const express = require('express');
const { trucks, loads, routeGraph } = require('../mock-db');

const router = express.Router();

/**
 * Return Load Matching Algorithm
 * 
 * Given a truck's currentCity and destinationCity (its return route),
 * find loads that travel in the same direction:
 *   EXACT:   load.pickup === truck.current  AND  load.drop === truck.destination
 *   PARTIAL: load.pickup === truck.current  AND  load.drop is on the route
 *            load.pickup is on the route    AND  load.drop === truck.destination
 *            load.pickup is on the route    AND  load.drop is on the route
 */

function getRouteCities(from, to, visited = new Set()) {
  // BFS to find all cities on any path between from and to
  if (from === to) return new Set([from]);
  
  const queue = [[from, [from]]];
  visited.add(from);
  const onRoute = new Set();
  
  // Find shortest path first
  let shortestLen = Infinity;
  const allPaths = [];
  
  const bfsQueue = [[from, [from]]];
  const bfsVisited = {};
  bfsVisited[from] = true;
  
  while (bfsQueue.length > 0) {
    const [city, path] = bfsQueue.shift();
    if (path.length > 10) continue; // limit depth
    
    if (city === to) {
      allPaths.push(path);
      if (path.length < shortestLen) shortestLen = path.length;
      continue;
    }
    
    const neighbors = routeGraph[city] || [];
    for (const neighbor of neighbors) {
      if (!path.includes(neighbor)) {
        bfsQueue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  
  // Include cities from paths that are at most shortestLen + 1
  for (const path of allPaths) {
    if (path.length <= shortestLen + 1) {
      path.forEach(c => onRoute.add(c));
    }
  }
  
  return onRoute;
}

// GET /api/matching/:truckId
router.get('/:truckId', (req, res) => {
  const truck = trucks.find(t => t.id === req.params.truckId);
  if (!truck) return res.status(404).json({ error: 'Truck not found' });
  
  const { currentCity, destinationCity } = truck;
  const routeCities = getRouteCities(currentCity, destinationCity);
  
  const availableLoads = loads.filter(l => l.status === 'posted');
  
  const matched = [];
  
  for (const load of availableLoads) {
    const pickupOnRoute = routeCities.has(load.pickupCity);
    const dropOnRoute = routeCities.has(load.dropCity);
    
    if (!pickupOnRoute && !dropOnRoute) continue;
    if (load.weight > truck.capacity) continue;
    
    let matchType = 'partial';
    let score = 0;
    
    if (load.pickupCity === currentCity && load.dropCity === destinationCity) {
      matchType = 'exact';
      score = 100;
    } else if (load.pickupCity === currentCity && dropOnRoute) {
      score = 80;
    } else if (pickupOnRoute && load.dropCity === destinationCity) {
      score = 75;
    } else if (pickupOnRoute && dropOnRoute) {
      score = 50;
    }
    
    if (score > 0) {
      matched.push({ ...load, matchType, matchScore: score });
    }
  }
  
  matched.sort((a, b) => b.matchScore - a.matchScore);
  
  res.json({
    truck: { id: truck.id, truckNumber: truck.truckNumber, currentCity, destinationCity },
    matches: matched,
  });
});

module.exports = router;
