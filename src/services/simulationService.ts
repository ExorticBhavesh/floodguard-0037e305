// Bluetooth Mesh Simulation Service
// Provides realistic simulated mesh network behavior when BLE is unavailable

export interface MeshNode {
  id: string;
  name: string;
  rssi: number;
  distance: number;
  distanceCategory: "very-close" | "nearby" | "detectable";
  signalStrength: number; // 0-4 bars
  status: "active" | "weak" | "lost";
  lastSeen: number;
  ttl: number; // seconds remaining
}

export interface MeshState {
  nodes: MeshNode[];
  isScanning: boolean;
  mode: "bluetooth" | "simulation";
  sosActive: boolean;
  sosBroadcastCount: number;
}

const NAMES = [
  "Node-Alpha", "Node-Bravo", "Node-Charlie", "Node-Delta",
  "Node-Echo", "Node-Foxtrot", "Node-Golf", "Node-Hotel",
  "Node-India", "Node-Juliet", "Node-Kilo", "Node-Lima",
];

function generateNodeId(): string {
  return `FG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

function rssiToDistance(rssi: number): number {
  // Approximate distance from RSSI (simplified path-loss model)
  const txPower = -59; // typical BLE tx power at 1m
  const n = 2.5; // path loss exponent
  return Math.pow(10, (txPower - rssi) / (10 * n));
}

function rssiToCategory(rssi: number): MeshNode["distanceCategory"] {
  if (rssi > -50) return "very-close";
  if (rssi > -70) return "nearby";
  return "detectable";
}

function rssiToSignalStrength(rssi: number): number {
  if (rssi > -40) return 4;
  if (rssi > -55) return 3;
  if (rssi > -70) return 2;
  if (rssi > -85) return 1;
  return 0;
}

export function createInitialNodes(count: number = 6): MeshNode[] {
  const nodes: MeshNode[] = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = NAMES[Math.floor(Math.random() * NAMES.length)];
    } while (usedNames.has(name));
    usedNames.add(name);
    
    const rssi = -35 - Math.random() * 55; // -35 to -90
    const distance = rssiToDistance(rssi);
    
    nodes.push({
      id: generateNodeId(),
      name,
      rssi: Math.round(rssi),
      distance: Math.round(distance * 10) / 10,
      distanceCategory: rssiToCategory(rssi),
      signalStrength: rssiToSignalStrength(rssi),
      status: rssi > -80 ? "active" : "weak",
      lastSeen: Date.now(),
      ttl: 30 + Math.floor(Math.random() * 30),
    });
  }
  
  return nodes.sort((a, b) => b.rssi - a.rssi);
}

export function updateNodes(nodes: MeshNode[]): MeshNode[] {
  return nodes
    .map(node => {
      // Fluctuate RSSI slightly
      const newRssi = node.rssi + (Math.random() - 0.5) * 6;
      const clampedRssi = Math.max(-95, Math.min(-30, newRssi));
      const distance = rssiToDistance(clampedRssi);
      const ttl = node.ttl - 2;
      
      if (ttl <= 0) return null; // Node expired
      
      return {
        ...node,
        rssi: Math.round(clampedRssi),
        distance: Math.round(distance * 10) / 10,
        distanceCategory: rssiToCategory(clampedRssi),
        signalStrength: rssiToSignalStrength(clampedRssi),
        status: clampedRssi > -80 ? "active" as const : "weak" as const,
        lastSeen: Date.now(),
        ttl,
      };
    })
    .filter(Boolean) as MeshNode[];
}

export function maybeAddNewNode(existingNodes: MeshNode[]): MeshNode | null {
  if (existingNodes.length >= 10) return null;
  if (Math.random() > 0.3) return null; // 30% chance per tick
  
  const usedNames = new Set(existingNodes.map(n => n.name));
  const availableNames = NAMES.filter(n => !usedNames.has(n));
  if (availableNames.length === 0) return null;
  
  const rssi = -50 - Math.random() * 40;
  const distance = rssiToDistance(rssi);
  
  return {
    id: generateNodeId(),
    name: availableNames[Math.floor(Math.random() * availableNames.length)],
    rssi: Math.round(rssi),
    distance: Math.round(distance * 10) / 10,
    distanceCategory: rssiToCategory(rssi),
    signalStrength: rssiToSignalStrength(rssi),
    status: "active",
    lastSeen: Date.now(),
    ttl: 30 + Math.floor(Math.random() * 30),
  };
}
