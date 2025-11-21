import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Environment } from '@react-three/drei';
import { Suspense } from 'react';

// Construction Vehicle Component
const Vehicle = ({ position, rotation, scale, color }: any) => {
  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={0.5}
    >
      <group position={position} rotation={rotation} scale={scale}>
        {/* Vehicle Body */}
        <mesh castShadow>
          <boxGeometry args={[2, 1, 3]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Cabin */}
        <mesh position={[0, 1, 0.5]} castShadow>
          <boxGeometry args={[1.5, 1, 1.5]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </mesh>
        
        {/* Boom Arm */}
        <mesh position={[0, 0.5, -1.5]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 2]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Wheels */}
        {[-0.8, 0.8].map((x, i) => (
          <group key={i}>
            <mesh position={[x, -0.5, 1]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
              <meshStandardMaterial color="#222" metalness={0.5} roughness={0.7} />
            </mesh>
            <mesh position={[x, -0.5, -1]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
              <meshStandardMaterial color="#222" metalness={0.5} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
};

// Crane Component
const Crane = ({ position, rotation, scale }: any) => {
  return (
    <Float
      speed={1}
      rotationIntensity={0.2}
      floatIntensity={0.3}
    >
      <group position={position} rotation={rotation} scale={scale}>
        {/* Base */}
        <mesh castShadow>
          <cylinderGeometry args={[1, 1, 0.5, 8]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Tower */}
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[0.6, 6, 0.6]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.6} roughness={0.4} />
        </mesh>
        
        {/* Boom */}
        <mesh position={[2.5, 5.5, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[5, 0.4, 0.4]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Hook Cable */}
        <mesh position={[4, 3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
};

// Scene Component
const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 10]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffa500" />
      
      <Environment preset="sunset" />

      {/* Vehicles */}
      <Vehicle
        position={[-4, 0, 0]}
        rotation={[0, 0.5, 0]}
        scale={0.6}
        color="#f59e0b"
      />
      
      <Vehicle
        position={[4, 0, 2]}
        rotation={[0, -0.8, 0]}
        scale={0.5}
        color="#3b82f6"
      />
      
      <Crane
        position={[0, 0, -3]}
        rotation={[0, 0, 0]}
        scale={0.4}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#0f0f0f', 10, 30]} />
    </>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};
