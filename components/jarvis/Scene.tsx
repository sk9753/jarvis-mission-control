"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import JarvisCore from "./JarvisCore";
import AgentNode from "./AgentNode";
import ParticleField from "./ParticleField";
import { Task } from "@/lib/types";

function mapStatus(s: string): string {
  if (s === "deployed" || s === "completed") return "live";
  return s;
}

interface SceneProps {
  tasks: Task[];
  speaking: boolean;
  onTaskClick: (task: Task) => void;
}

export default function Scene({ tasks, speaking, onTaskClick }: SceneProps) {
  // Distribute tasks in orbital positions
  const taskNodes = tasks.map((task, i) => {
    const total = tasks.length;
    const angle = (i / total) * Math.PI * 2;
    const radius = 2.2 + (i % 3) * 0.6;
    const y = (Math.sin(i * 1.7) * 0.5);
    return {
      task,
      position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
      orbitRadius: radius,
      orbitSpeed: 0.15 + (i % 3) * 0.05,
      orbitOffset: angle,
    };
  });

  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Ambient light */}
      <ambientLight intensity={0.1} />

      {/* JARVIS Core */}
      <JarvisCore speaking={speaking} />

      {/* Agent/Task nodes */}
      {taskNodes.map((node) => (
        <AgentNode
          key={node.task.id}
          name={node.task.title.length > 20 ? node.task.title.slice(0, 20) + "…" : node.task.title}
          status={mapStatus(node.task.status)}
          position={node.position}
          orbitRadius={node.orbitRadius}
          orbitSpeed={node.orbitSpeed}
          orbitOffset={node.orbitOffset}
          priority={node.task.priority}
          onClick={() => onTaskClick(node.task)}
        />
      ))}

      {/* Particle field background */}
      <ParticleField count={400} />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />
    </Canvas>
  );
}
