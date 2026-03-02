import { useState, useEffect, useCallback, useRef } from "react";
import {
  MeshNode,
  MeshState,
  createInitialNodes,
  updateNodes,
  maybeAddNewNode,
} from "@/services/simulationService";

export function useMeshNetwork() {
  const [state, setState] = useState<MeshState>({
    nodes: [],
    isScanning: false,
    mode: "simulation",
    sosActive: false,
    sosBroadcastCount: 0,
  });
  
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startScanning = useCallback(() => {
    setState(prev => ({
      ...prev,
      isScanning: true,
      nodes: createInitialNodes(6),
    }));
    
    // Update nodes every 2 seconds
    scanIntervalRef.current = setInterval(() => {
      setState(prev => {
        let updatedNodes = updateNodes(prev.nodes);
        const newNode = maybeAddNewNode(updatedNodes);
        if (newNode) {
          updatedNodes = [...updatedNodes, newNode];
        }
        return {
          ...prev,
          nodes: updatedNodes.sort((a, b) => b.rssi - a.rssi),
        };
      });
    }, 2000);
  }, []);
  
  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setState(prev => ({ ...prev, isScanning: false }));
  }, []);
  
  const broadcastSOS = useCallback(() => {
    setState(prev => ({
      ...prev,
      sosActive: true,
      sosBroadcastCount: prev.sosBroadcastCount + prev.nodes.length,
    }));
    
    // Auto-reset SOS after 5 seconds
    setTimeout(() => {
      setState(prev => ({ ...prev, sosActive: false }));
    }, 5000);
  }, []);
  
  // Auto-start scanning on mount
  useEffect(() => {
    startScanning();
    return () => stopScanning();
  }, [startScanning, stopScanning]);
  
  const nodeStats = {
    total: state.nodes.length,
    veryClose: state.nodes.filter(n => n.distanceCategory === "very-close").length,
    nearby: state.nodes.filter(n => n.distanceCategory === "nearby").length,
    detectable: state.nodes.filter(n => n.distanceCategory === "detectable").length,
  };
  
  return {
    ...state,
    nodeStats,
    startScanning,
    stopScanning,
    broadcastSOS,
  };
}
