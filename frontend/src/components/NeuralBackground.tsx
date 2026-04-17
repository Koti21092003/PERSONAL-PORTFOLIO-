import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

function NeuralNodes({ count = 1000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();

  useFrame((state, delta) => {
    pointsRef.current.rotation.x -= delta / 10;
    pointsRef.current.rotation.y -= delta / 15;

    // Subtle reaction to mouse
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, x * 0.05, 0.1);
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, y * 0.05, 0.1);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4f46e5"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

const NeuralBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <NeuralNodes />
      </Canvas>
    </div>
  );
};

export default NeuralBackground;
