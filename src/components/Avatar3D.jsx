import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Undo2 } from 'lucide-react';

function SceneControls({ controlsRef }) {
  const { camera, gl } = useThree();
  const controls = useRef();
  useEffect(() => {
    const instance = new OrbitControls(camera, gl.domElement);
    instance.enablePan = false;
    instance.enableDamping = true;
    instance.dampingFactor = 0.12;
    instance.minDistance = 2.6;
    instance.maxDistance = 7;
    instance.minPolarAngle = 0.15;
    instance.maxPolarAngle = Math.PI * 0.55;
    instance.target.set(0, 1, 0);
    instance.update();
    controls.current = instance;
    if (controlsRef) controlsRef.current = instance;
    return () => instance.dispose();
  }, [camera, gl, controlsRef]);
  useFrame(() => controls.current && controls.current.update());
  return null;
}

function SoftShadow() {
  const texture = React.useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(0,0,0,0.35)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.15)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <planeGeometry args={[3.6, 3.6]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

function Hair({ style, color }) {
  if (style === 'none') return null;
  return (
    <group>
      <mesh position={[0, 1.74, 0]} scale={[0.96, 0.62, 0.8]}>
        <sphereGeometry args={[0.22, 28, 22]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {style === 'short' || style === 'long' ? (
        <mesh position={[0, 1.7, 0.17]}>
          <boxGeometry args={[0.2, 0.06, 0.05]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ) : null}
      {style === 'long' ? (
        <>
          <mesh position={[0, 1.52, -0.1]}>
            <boxGeometry args={[0.32, 0.44, 0.08]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          <mesh position={[-0.14, 1.4, -0.04]} rotation={[0, 0, 0.08]}>
            <capsuleGeometry args={[0.04, 0.22, 8, 12]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          <mesh position={[0.14, 1.4, -0.04]} rotation={[0, 0, -0.08]}>
            <capsuleGeometry args={[0.04, 0.22, 8, 12]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        </>
      ) : null}
      {style === 'bun' ? (
        <mesh position={[0, 1.96, 0]}>
          <sphereGeometry args={[0.07, 22, 22]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ) : null}
      {style === 'curls'
        ? [
            [0.12, 1.9, 0],
            [-0.12, 1.9, 0],
            [0, 1.96, 0.1],
            [0.06, 1.96, 0.12],
            [-0.06, 1.96, 0.12],
          ].map((p, i) => (
            <mesh key={i} position={p}>
              <sphereGeometry args={[0.05, 14, 14]} />
              <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
          ))
        : null}
    </group>
  );
}

function Humanoid({ config }) {
  const skin = config.skin;
  const faceScale =
    config.face === 'oval' ? [0.9, 1.08, 0.9] : config.face === 'square' ? [1.08, 0.96, 1.02] : [0.96, 1, 0.96];
  const browColor = '#4b3b3d';

  return (
    <group>
      {/* Pelvis */}
      <mesh position={[0, 0.9, 0]} scale={[1.02, 0.94, 1]}>
        <sphereGeometry args={[0.15, 18, 18]} />
        <meshStandardMaterial color="#dca27e" emissive="#b46a3d" emissiveIntensity={0.08} roughness={0.88} />
      </mesh>

      {/* Piernas */}
      {config.pantsStyle === 'skirt' ? (
        <>
          {[0.12, -0.12].map((x) => (
            <mesh key={x} position={[x, 0.6, 0]}>
              <capsuleGeometry args={[0.075, 0.5, 8, 16]} />
              <meshStandardMaterial color={skin} roughness={0.9} />
            </mesh>
          ))}
        </>
      ) : config.pantsStyle === 'shorts' ? (
        <>
          {[0.12, -0.12].map((x) => (
            <group key={x}>
              <mesh position={[x, 0.72, 0]}>
                <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
                <meshStandardMaterial color={config.pantsColor} roughness={0.8} />
              </mesh>
              <mesh position={[x, 0.42, 0]}>
                <capsuleGeometry args={[0.07, 0.26, 8, 16]} />
                <meshStandardMaterial color={skin} roughness={0.9} />
              </mesh>
            </group>
          ))}
        </>
      ) : (
        <>
          {[0.12, -0.12].map((x) => (
            <mesh key={x} position={[x, 0.6, 0]}>
              <capsuleGeometry args={[0.085, 0.52, 8, 16]} />
              <meshStandardMaterial color={config.pantsColor} roughness={0.75} />
            </mesh>
          ))}
        </>
      )}

      {/* Zapatos */}
      {[0.12, -0.12].map((x) => (
        <mesh key={`s${x}`} position={[x, 0.16, 0.03]} castShadow>
          <boxGeometry args={[0.11, 0.09, 0.22]} />
          <meshStandardMaterial color={config.shoeColor} roughness={0.55} />
        </mesh>
      ))}

      {/* Cadera */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.26, 0.14, 0.18]} />
        <meshStandardMaterial color={config.pantsStyle === 'skirt' ? skin : config.pantsColor} roughness={0.8} />
      </mesh>

      {/* Falda */}
      {config.pantsStyle === 'skirt' ? (
        <mesh position={[0, 0.88, 0]} castShadow>
          <coneGeometry args={[0.27, 0.2, 24]} />
          <meshStandardMaterial color={config.pantsColor} roughness={0.7} />
        </mesh>
      ) : null}

      {/* Torso */}
      <mesh position={[0, 1.13, 0]} castShadow>
        <capsuleGeometry args={[0.17, 0.38, 8, 20]} />
        <meshStandardMaterial color={config.shirtColor} roughness={0.62} metalness={0.07} />
      </mesh>

      {/* Pecho */}
      <mesh position={[0, 1.18, 0.08]} scale={[0.95, 0.8, 0.8]}>
        <sphereGeometry args={[0.13, 18, 18]} />
        <meshStandardMaterial color={skin} emissive="#c98b62" emissiveIntensity={0.06} roughness={0.8} />
      </mesh>

      {/* Detalles de ropa */}
      {config.shirtStyle === 'offshoulder' ? (
        <>
          <mesh position={[0, 1.35, 0.14]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.38, 0.04, 0.12]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.65} />
          </mesh>
          <mesh position={[-0.18, 1.34, 0.1]} rotation={[0, 0, 0.3]}>
            <capsuleGeometry args={[0.02, 0.06, 6, 8]} />
            <meshStandardMaterial color={skin} roughness={0.85} />
          </mesh>
          <mesh position={[0.18, 1.34, 0.1]} rotation={[0, 0, -0.3]}>
            <capsuleGeometry args={[0.02, 0.06, 6, 8]} />
            <meshStandardMaterial color={skin} roughness={0.85} />
          </mesh>
        </>
      ) : config.shirtStyle === 'hoodie' ? (
        <>
          <mesh position={[0, 1.56, -0.13]} scale={[1, 1.15, 0.8]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.12, 0.165]}>
            <boxGeometry args={[0.15, 0.11, 0.03]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>
        </>
      ) : config.shirtStyle === 'jacket' ? (
        <>
          <mesh position={[0, 1.38, 0.16]} rotation={[0.15, 0, 0]}>
            <torusGeometry args={[0.12, 0.03, 12, 24]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.6} />
          </mesh>
          <mesh position={[0.08, 1.28, 0.14]} rotation={[0.3, 0, 0.15]}>
            <capsuleGeometry args={[0.025, 0.14, 8, 12]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.6} />
          </mesh>
          <mesh position={[-0.06, 1.26, 0.13]} rotation={[0.25, 0, -0.1]}>
            <capsuleGeometry args={[0.022, 0.1, 8, 12]} />
            <meshStandardMaterial color={config.shirtColor} roughness={0.6} />
          </mesh>
        </>
      ) : null}

      {/* Brazos */}
      <mesh position={[-0.25, 1.14, 0]} rotation={[0, 0, 0.28]} castShadow>
        <capsuleGeometry args={[0.055, 0.34, 8, 16]} />
        <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.25, 1.14, 0]} rotation={[0, 0, -0.28]} castShadow>
        <capsuleGeometry args={[0.055, 0.34, 8, 16]} />
        <meshStandardMaterial color={config.shirtColor} roughness={0.7} />
      </mesh>

      {/* Manos */}
      <mesh position={[-0.3, 0.93, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={skin} roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 0.93, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={skin} roughness={0.9} />
      </mesh>

      {/* Pulseras */}
      {config.bracelets ? (
        <>
          {[-0.3, 0.3].map((x) => (
            <mesh key={x} position={[x, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.075, 0.015, 10, 16]} />
              <meshStandardMaterial color="#EC4899" roughness={0.4} />
            </mesh>
          ))}
        </>
      ) : null}

      {/* Cuello */}
      <mesh position={[0, 1.44, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 16]} />
        <meshStandardMaterial color={skin} roughness={0.9} />
      </mesh>

      {/* Collar */}
      {config.collar ? (
        <mesh position={[0, 1.43, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.016, 12, 20]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.35} metalness={0.6} />
        </mesh>
      ) : null}

      {/* Mochila */}
      {config.backpack ? (
        <group>
          <mesh position={[0, 1.14, -0.15]} castShadow>
            <boxGeometry args={[0.26, 0.28, 0.12]} />
            <meshStandardMaterial color="#60A5FA" roughness={0.8} />
          </mesh>
          {[-0.14, 0.14].map((x) => (
            <mesh key={x} position={[x, 1.16, -0.1]}>
              <boxGeometry args={[0.04, 0.3, 0.02]} />
              <meshStandardMaterial color="#93C5FD" roughness={0.8} />
            </mesh>
          ))}
        </group>
      ) : null}

      {/* Cabeza + rostro */}
      <group scale={faceScale}>
        <mesh position={[0, 1.62, 0]} castShadow>
          <sphereGeometry args={[0.224, 32, 32]} />
          <meshStandardMaterial color={skin} roughness={0.86} metalness={0.04} />
        </mesh>

        {/* Orejas */}
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 1.62, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={skin} roughness={0.9} />
          </mesh>
        ))}

        {/* Ojos */}
        {config.eyes === 'happy'
          ? [-0.09, 0.09].map((x) => (
              <mesh key={x} position={[x, 1.64, 0.195]} rotation={[0, 0, Math.PI]}>
                <torusGeometry args={[0.03, 0.012, 8, 16, Math.PI]} />
                <meshStandardMaterial color="#1a1f2c" roughness={0.4} />
              </mesh>
            ))
          : config.eyes === 'sleepy'
            ? [-0.09, 0.09].map((x) => (
                <mesh key={x} position={[x, 1.645, 0.195]}>
                  <boxGeometry args={[0.08, 0.01, 0.02]} />
                  <meshStandardMaterial color="#1a1f2c" roughness={0.4} />
                </mesh>
              ))
            : [-0.09, 0.09].map((x) => (
                <mesh key={x} position={[x, 1.64, 0.195]}>
                  <sphereGeometry args={[0.028, 16, 16]} />
                  <meshStandardMaterial color="#1a1f2c" roughness={0.4} />
                </mesh>
              ))}

        {/* Cejas */}
        {config.brows === 'angry'
          ? [-0.09, 0.09].map((x) => (
              <mesh key={x} position={[x, 1.69, 0.2]} rotation={[0, 0, x > 0 ? 0.35 : -0.35]}>
                <boxGeometry args={[0.08, 0.015, 0.02]} />
                <meshStandardMaterial color={browColor} roughness={0.7} />
              </mesh>
            ))
          : [-0.09, 0.09].map((x) => (
              <mesh key={x} position={[x, 1.695, 0.2]}>
                <boxGeometry args={[config.brows === 'straight' ? 0.09 : 0.076, 0.014, 0.02]} />
                <meshStandardMaterial color={browColor} roughness={0.7} />
              </mesh>
            ))}

        {/* Boca */}
        {config.mouth === 'open' ? (
          <mesh position={[0, 1.535, 0.198]} scale={[1, 1.12, 1]}>
            <sphereGeometry args={[0.022, 16, 16]} />
            <meshStandardMaterial color="#99544d" roughness={0.55} />
          </mesh>
        ) : config.mouth === 'neutral' ? (
          <mesh position={[0, 1.53, 0.198]}>
            <boxGeometry args={[0.056, 0.012, 0.02]} />
            <meshStandardMaterial color="#a55d54" roughness={0.5} />
          </mesh>
        ) : (
          <mesh position={[0, 1.53, 0.198]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.034, 0.011, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#a55d54" roughness={0.5} />
          </mesh>
        )}

        {/* Gafas */}
        {config.glasses ? (
          <group>
            {[-0.09, 0.09].map((x) => (
              <mesh key={x} position={[x, 1.655, 0.202]}>
                <torusGeometry args={[0.045, 0.01, 8, 20]} />
                <meshStandardMaterial color="#2b2b2b" roughness={0.3} />
              </mesh>
            ))}
            <mesh position={[0, 1.655, 0.202]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.011, 0.011, 0.05, 8]} />
              <meshStandardMaterial color="#2b2b2b" roughness={0.3} />
            </mesh>
          </group>
        ) : null}

        {/* Flor */}
        {config.flower ? (
          <group position={[0.16, 1.92, 0.15]}>
            <mesh position={[0, 0, 0]} scale={[1, 1, 0.5]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color="#F9A8D4" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.024, 12, 12]} />
              <meshStandardMaterial color="#FDE68A" roughness={0.5} />
            </mesh>
          </group>
        ) : null}

        {/* Cabello */}
        <Hair style={config.hairStyle} color={config.hairColor} />
      </group>
    </group>
  );
}

export default function Avatar3D({ config, controlsRef, onRotateLeft, onRotateRight, onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="relative min-h-[46vh] flex-1 overflow-hidden rounded-[18px] border border-gray-100 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.9),transparent_55%)]" />
      <Canvas camera={{ position: [0, 1.35, 4.3], fov: 38 }} dpr={[1, 2]} frameloop="always">
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5.5, 3]} intensity={1.25} castShadow />
        <spotLight position={[-3, 4, 2]} angle={0.42} penumbra={0.8} intensity={0.8} color="#f9d1e2" />
        <pointLight position={[0, 2.5, -3]} intensity={0.5} color="#dfe8ff" />
        <React.Suspense fallback={null}>
          <Humanoid config={config} />
        </React.Suspense>
        <SoftShadow />
        <SceneControls controlsRef={controlsRef} />
      </Canvas>

      {/* Controls bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-gray-100 bg-white px-2 py-2 shadow">
        <button onClick={onRotateLeft} title="Rotar izquierda" className="p-2 rounded-full hover:bg-gray-50 transition"><RotateCcw size={16} /></button>
        <button onClick={onRotateRight} title="Rotar derecha" className="p-2 rounded-full hover:bg-gray-50 transition"><RotateCw size={16} /></button>
        <div className="mx-1 h-5 w-px bg-gray-100" />
        <button onClick={onZoomIn} title="Zoom +" className="p-2 rounded-full hover:bg-gray-50 transition"><ZoomIn size={16} /></button>
        <button onClick={onZoomOut} title="Zoom -" className="p-2 rounded-full hover:bg-gray-50 transition"><ZoomOut size={16} /></button>
        <div className="mx-1 h-5 w-px bg-gray-100" />
        <button onClick={onReset} title="Reset" className="p-2 rounded-full hover:bg-gray-50 transition"><Undo2 size={16} /></button>
      </div>
    </div>
  );
}