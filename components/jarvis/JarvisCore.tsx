"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Animated glowing JARVIS orb with pulsing rings
export default function JarvisCore({ speaking = false }: { speaking?: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const coreMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSpeaking: { value: 0 },
          uColor: { value: new THREE.Color("#00d4ff") },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float uTime;
          uniform float uSpeaking;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            float displacement = sin(position.x * 8.0 + uTime * 2.0) * sin(position.y * 8.0 + uTime * 1.5) * sin(position.z * 8.0 + uTime * 1.8);
            displacement *= 0.02 + uSpeaking * 0.04;
            vec3 newPosition = position + normal * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float uTime;
          uniform float uSpeaking;
          uniform vec3 uColor;
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + uSpeaking * 3.0);
            vec3 color = uColor * (0.6 + fresnel * 1.5) * pulse;
            float alpha = 0.3 + fresnel * 0.7;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    coreMaterial.uniforms.uTime.value = t;
    coreMaterial.uniforms.uSpeaking.value = speaking ? 1.0 : 0.0;

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.5;
      ring1Ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.35;
      ring2Ref.current.rotation.y = Math.cos(t * 0.25) * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.25;
      ring3Ref.current.rotation.x = Math.sin(t * 0.2) * 0.3;
    }
    if (glowRef.current) {
      const scale = 1.8 + Math.sin(t * 1.5) * 0.15 + (speaking ? 0.3 : 0);
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Core glow background */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.04} />
      </mesh>

      {/* Main core sphere */}
      <mesh ref={coreRef} material={coreMaterial}>
        <sphereGeometry args={[0.6, 64, 64]} />
      </mesh>

      {/* Inner bright core */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>

      {/* Ring 1 - outer */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.2, 0.008, 16, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>

      {/* Ring 2 - middle */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.95, 0.006, 16, 80]} />
        <meshBasicMaterial color="#00a8cc" transparent opacity={0.4} />
      </mesh>

      {/* Ring 3 - inner */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[0.75, 0.005, 16, 60]} />
        <meshBasicMaterial color="#0088aa" transparent opacity={0.3} />
      </mesh>

      {/* Point light from core */}
      <pointLight color="#00d4ff" intensity={2} distance={8} />
    </group>
  );
}
