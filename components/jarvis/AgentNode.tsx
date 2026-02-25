"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const statusColors: Record<string, string> = {
  active: "#00ff88",
  idle: "#00d4ff",
  building: "#ffaa00",
  error: "#ff4444",
  deployed: "#00ff88",
  backlog: "#666666",
  planning: "#4488ff",
  testing: "#aa66ff",
  live: "#00ff88",
  completed: "#00ff88",
};

interface AgentNodeProps {
  name: string;
  status: string;
  position: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  priority?: string;
  onClick?: () => void;
}

export default function AgentNode({
  name,
  status,
  position,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  priority,
  onClick,
}: AgentNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.BufferGeometry>(null);

  const color = statusColors[status] ?? statusColors.idle;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      const angle = t * orbitSpeed + orbitOffset;
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + orbitOffset) * 0.15;
    }
    if (nodeRef.current) {
      const pulse = 1.0 + Math.sin(t * 2 + orbitOffset) * 0.1;
      nodeRef.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.5;
    }
    // Update connection line
    if (lineRef.current && groupRef.current) {
      const positions = new Float32Array([
        0, 0, 0,
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z,
      ]);
      lineRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    }
  });

  const prioritySize = priority === "high" || priority === "P1" ? 0.12 : 0.09;

  return (
    <>
      {/* Connection line to core */}
      <line>
        <bufferGeometry ref={lineRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, position[0], position[1], position[2]]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.15} />
      </line>

      <group ref={groupRef} position={position}>
        {/* Node sphere */}
        <mesh ref={nodeRef} onClick={onClick}>
          <sphereGeometry args={[prioritySize, 24, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>

        {/* Status ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[prioritySize + 0.06, 0.004, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>

        {/* Glow */}
        <mesh>
          <sphereGeometry args={[prioritySize + 0.08, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} />
        </mesh>

        {/* Point light */}
        <pointLight color={color} intensity={0.3} distance={2} />

        {/* Label */}
        <Html position={[0, prioritySize + 0.2, 0]} center distanceFactor={6}>
          <div
            onClick={onClick}
            className="cursor-pointer select-none whitespace-nowrap"
            style={{
              color: color,
              fontSize: "10px",
              fontFamily: "'Inter', monospace",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              textShadow: `0 0 10px ${color}`,
              opacity: 0.9,
            }}
          >
            {name}
          </div>
        </Html>
      </group>
    </>
  );
}
