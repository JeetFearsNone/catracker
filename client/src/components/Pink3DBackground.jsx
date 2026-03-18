import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const ParticleField = (props) => {
  const ref = useRef();
  
  // Create an array of random positions in a sphere to simulate stars
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 10 }), []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 30;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#f8bbd9" size={0.04} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
};

const Pink3DBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0508]">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#0a0508']} />
        <ambientLight intensity={0.4} />
        
        {/* Deep rose lighting */}
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#e9698a" />
        <pointLight position={[-5, -5, -2]} intensity={1} color="#c2185b" />
        <pointLight position={[0, -2, 2]} intensity={2} color="#f48fb1" />

        {/* Removed 3D Floating Objects, keeping only the stars/particles */}
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default Pink3DBackground;
