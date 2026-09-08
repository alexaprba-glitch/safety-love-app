import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Undo2, Sparkles, Shirt, Check, Mars, Venus } from 'lucide-react';

const DEFAULT_AVATAR = {
  skin: '#f0b68a',
  face: 'oval',
  eyes: 'round',
  brows: 'soft',
  mouth: 'smile',
  hairStyle: 'long',
  hairColor: '#1a1010',
  shirtStyle: 'offshoulder',
  shirtColor: '#c9b8a0',
  pantsStyle: 'shorts',
  pantsColor: '#3b5068',
  shoeColor: '#1f2937',
  glasses: false,
  collar: false,
  bracelets: false,
  backpack: false,
  flower: false,
  gender: 'female',
};

const SKIN_TONES = ['#ffe0bd', '#f6c9a6', '#e5ad7c', '#f0b68a', '#c68642', '#8d5524'];
const FACES = [
  { id: 'round', label: 'Redondo', shape: {} },
  { id: 'oval', label: 'Ovalado', shape: { borderRadius: '50%', transform: 'scaleY(1.3)' } },
  { id: 'square', label: 'Cuadrado', shape: { borderRadius: '28%' } },
  { id: 'rectangular', label: 'Rectangular', shape: { borderRadius: '12%' } },
];
const EXPRESSIONS = [
  { id: 'happy', label: 'Felices', emoji: '😊' },
  { id: 'relaxed', label: 'Relajado', emoji: '😌' },
  { id: 'sleepy', label: 'Soñoliento', emoji: '😴' },
  { id: 'smile', label: 'Sonrisa', emoji: '🙂' },
  { id: 'neutral', label: 'Neutra', emoji: '😐' },
  { id: 'serious', label: 'Seria', emoji: '😑' },
  { id: 'surprised', label: 'Sorprendido', emoji: '😲' },
  { id: 'winky', label: 'Guiño', emoji: '😉' },
];

const BROW_STYLES = [
  { id: 'soft', label: 'Suaves', emoji: '🙂' },
  { id: 'straight', label: 'Rectas', emoji: '😐' },
  { id: 'angry', label: 'Serias', emoji: '😠' },
];
const MOUTH_STYLES = [
  { id: 'smile', label: 'Sonrisa', emoji: '😊' },
  { id: 'neutral', label: 'Neutra', emoji: '😐' },
  { id: 'open', label: 'Abierta', emoji: '😮' },
];
const HAIR_STYLES = [
  { id: 'short', label: 'Corto', emoji: '💇' },
  { id: 'long', label: 'Largo', emoji: '💁‍♀️' },
  { id: 'bun', label: 'Moño', emoji: '👧' },
  { id: 'curls', label: 'Rizos', emoji: '🦱' },
  { id: 'none', label: 'Sin pelo', emoji: '🥚' },
];
const HAIR_COLORS = ['#2b2b2b', '#5c4332', '#e5b96b', '#c75b39', '#F472B6', '#A78BFA'];
const SHIRT_STYLES = [
  { id: 'tee', label: 'Camiseta', emoji: '👕' },
  { id: 'offshoulder', label: 'Top sin hombros', emoji: '👚' },
  { id: 'hoodie', label: 'Sudadera', emoji: '🧥' },
  { id: 'jacket', label: 'Bufanda', emoji: '🧣' },
];
const SHIRT_COLORS = ['#F9A8D4', '#93C5FD', '#C4B5FD', '#6EE7B7', '#D1D5DB', '#FFFFFF'];
const PANTS_STYLES = [
  { id: 'pants', label: 'Pantalones', emoji: '👖' },
  { id: 'shorts', label: 'Shorts', emoji: '🩳' },
  { id: 'skirt', label: 'Falda', emoji: '👗' },
];
const PANTS_COLORS = ['#93C5FD', '#9CA3AF', '#374151', '#F9A8D4', '#A16207'];
const SHOE_COLORS = ['#F472B6', '#FFFFFF', '#374151', '#A16207', '#93C5FD', '#F87171'];
const ACCESSORIES = [
  { id: 'glasses', label: 'Gafas', emoji: '👓' },
  { id: 'collar', label: 'Collar', emoji: '📿' },
  { id: 'bracelets', label: 'Pulseras', emoji: '💫' },
  { id: 'backpack', label: 'Mochila', emoji: '🎒' },
  { id: 'flower', label: 'Flor', emoji: '🌸' },
];
const CATEGORIES = [
  { id: 'apariencia', label: 'Apariencia', emoji: '👤' },
  { id: 'cabello', label: 'Cabello', emoji: '💇' },
  { id: 'ropa', label: 'Ropa', emoji: '👕' },
  { id: 'accesorios', label: 'Accesorios', emoji: '✨' },
];

const GENDER_PRESETS = {
  male: { hairStyle: 'short', hairColor: HAIR_COLORS[0], shirtStyle: 'tee', shirtColor: SHIRT_COLORS[1], pantsStyle: 'pants' },
  female: { hairStyle: 'long', hairColor: '#1a1010', shirtStyle: 'offshoulder', shirtColor: '#c9b8a0', pantsStyle: 'shorts' },
};

const loadConfig = () => {
  try {
    const raw = localStorage.getItem('safetyLoveAvatar');
    if (raw) return { ...DEFAULT_AVATAR, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_AVATAR;
};

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
        <mesh position={[0, 1.48, -0.14]}>
          <boxGeometry args={[0.28, 0.38, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
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
    return () => {
      instance.dispose();
      if (controlsRef) controlsRef.current = null;
    };
  }, [camera, gl, controlsRef]);

  useFrame(() => {
    if (controls.current) controls.current.update();
  });

  return null;
}

function SoftShadow() {
  const texture = useMemo(() => {
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

function FloatAnimator({ children }) {
  const group = useRef();
  useFrame((state) => {
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.035;
  });
  return <group ref={group}>{children}</group>;
}

function AvatarCanvas({ config, controlsRef }) {
  return (
    <Canvas
      shadows="percentage"
      camera={{ position: [0, 1.35, 4.3], fov: 38 }}
      dpr={[1, 2]}
      style={{ background: 'radial-gradient(circle at top, #fffafc 0%, #f7f4f5 48%, #f0f3f7 100%)' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5.5, 3]} intensity={1.25} castShadow shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-3, 4, 2]} angle={0.42} penumbra={0.8} intensity={0.8} color="#f9d1e2" />
      <pointLight position={[0, 2.5, -3]} intensity={0.5} color="#dfe8ff" />
      <FloatAnimator>
        <Humanoid config={config} />
      </FloatAnimator>
      <SoftShadow />
      <SceneControls controlsRef={controlsRef} />
    </Canvas>
  );
}

function GroupTitle({ title }) {
  return <p className="text-[11px] uppercase tracking-wider text-gray-400 font-extrabold mb-2.5">{title}</p>;
}

function ColorChip({ color, selected, onClick }) {
  const isLight = color === '#FFFFFF' || color === '#ffe0bd';
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className="relative w-9 h-9 rounded-full shadow-sm ring-1 ring-black/5"
      style={{ background: color }}
      aria-label={`Color ${color}`}
    >
      {selected ? (
        <span className="absolute inset-0 rounded-full ring-2 ring-pink-500 ring-offset-2 ring-offset-white" />
      ) : null}
      {selected ? (
        <Check size={14} className={`absolute inset-0 m-auto ${isLight ? 'text-pink-500' : 'text-white'}`} />
      ) : null}
    </motion.button>
  );
}

function StyleCard({ label, selected, onClick, children }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-2 py-3 transition ${selected ? 'border-pink-400 bg-pink-50 shadow-sm' : 'border-transparent bg-[#FFF6F9] hover:bg-pink-50/60'}`}
    >
      {children}
      <span className={`text-[10px] font-bold ${selected ? 'text-pink-600' : 'text-gray-500'}`}>{label}</span>
      {selected ? (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center">
          <Check size={10} className="text-white" />
        </span>
      ) : null}
    </motion.button>
  );
}

function AvatarPreviewMini({ config }) {
  const emoji = config.mouth === 'open' ? '😮' : config.mouth === 'smile' || config.mouth === 'happy' ? '😊' : config.mouth === 'neutral' ? '😐' : '🙂';
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-pink-50 to-white p-0.5">
        <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xl" style={{ background: config.skin }}>
          <div className="text-2xl select-none">{emoji}</div>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Así se verá tu avatar</p>
        <p className="text-xs text-gray-400">Puedes seguir personalizando cada detalle.</p>
      </div>
    </div>
  );
}

function AparienciaOptions({ config, update }) {
  return (
    <div className="space-y-6">
      <div>
        <GroupTitle>Forma de rostro</GroupTitle>
        <div className="grid grid-cols-4 gap-3">
          {FACES.map((f) => (
            <StyleCard key={f.id} label={f.label} selected={config.face === f.id} onClick={() => update({ face: f.id })}>
              <div className="w-10 h-10 rounded-full" style={{ background: config.skin, ...f.shape }} />
            </StyleCard>
          ))}
        </div>
      </div>

      <div>
        <GroupTitle>Tono de piel</GroupTitle>
        <div className="flex items-center gap-3">
          {SKIN_TONES.map((c) => (
            <ColorChip key={c} color={c} selected={config.skin === c} onClick={() => update({ skin: c })} />
          ))}
        </div>
      </div>

      <div>
        <GroupTitle>Expresión</GroupTitle>
        <div className="grid grid-cols-4 gap-3">
          {EXPRESSIONS.map((ex) => (
            <StyleCard key={ex.id} label={ex.label} selected={config.mouth === ex.id || config.eyes === ex.id} onClick={() => update({ mouth: ex.id, eyes: ex.id })}>
              <span className="text-2xl">{ex.emoji}</span>
            </StyleCard>
          ))}
        </div>
      </div>

      <div>
        <GroupTitle>Vista previa</GroupTitle>
        <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
          <AvatarPreviewMini config={config} />
        </div>
      </div>
    </div>
  );
}

function CabelloOptions({ config, update }) {
  return (
    <div className="space-y-5">
      <div>
        <GroupTitle>Estilo de cabello</GroupTitle>
        <div className="grid grid-cols-4 gap-2">
          {HAIR_STYLES.map((h) => (
            <StyleCard key={h.id} label={h.label} selected={config.hairStyle === h.id} onClick={() => update({ hairStyle: h.id })}>
              <span className="text-xl">{h.emoji}</span>
            </StyleCard>
          ))}
        </div>
      </div>
      <div>
        <GroupTitle>Color de cabello</GroupTitle>
        <div className="flex flex-wrap gap-2.5">
          {HAIR_COLORS.map((c) => (
            <ColorChip key={c} color={c} selected={config.hairColor === c} onClick={() => update({ hairColor: c })} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RopaOptions({ config, update }) {
  return (
    <div className="space-y-5">
      <div>
        <GroupTitle>Superior</GroupTitle>
        <div className="grid grid-cols-3 gap-2">
          {SHIRT_STYLES.map((s) => (
            <StyleCard key={s.id} label={s.label} selected={config.shirtStyle === s.id} onClick={() => update({ shirtStyle: s.id })}>
              <span className="text-xl">{s.emoji}</span>
            </StyleCard>
          ))}
        </div>
      </div>
      <div>
        <GroupTitle>Color de la prenda</GroupTitle>
        <div className="flex flex-wrap gap-2.5">
          {SHIRT_COLORS.map((c) => (
            <ColorChip key={c} color={c} selected={config.shirtColor === c} onClick={() => update({ shirtColor: c })} />
          ))}
        </div>
      </div>
      <div>
        <GroupTitle>Inferior</GroupTitle>
        <div className="grid grid-cols-3 gap-2">
          {PANTS_STYLES.map((p) => (
            <StyleCard key={p.id} label={p.label} selected={config.pantsStyle === p.id} onClick={() => update({ pantsStyle: p.id })}>
              <span className="text-xl">{p.emoji}</span>
            </StyleCard>
          ))}
        </div>
      </div>
      <div>
        <GroupTitle>Color inferior</GroupTitle>
        <div className="flex flex-wrap gap-2.5">
          {PANTS_COLORS.map((c) => (
            <ColorChip key={c} color={c} selected={config.pantsColor === c} onClick={() => update({ pantsColor: c })} />
          ))}
        </div>
      </div>
      <div>
        <GroupTitle>Zapatos</GroupTitle>
        <div className="flex flex-wrap gap-2.5">
          {SHOE_COLORS.map((c) => (
            <ColorChip key={c} color={c} selected={config.shoeColor === c} onClick={() => update({ shoeColor: c })} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AccesoriosOptions({ config, update }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-extrabold mb-2.5">Accesorios</p>
      <div className="grid grid-cols-3 gap-2">
        {ACCESSORIES.map((a) => (
          <StyleCard key={a.id} label={a.label} selected={!!config[a.id]} onClick={() => update({ [a.id]: !config[a.id] })}>
            <span className="text-xl">{a.emoji}</span>
          </StyleCard>
        ))}
      </div>
    </div>
  );
}

import Avatar3D from './components/Avatar3D.jsx';
import CategorySidebar from './components/CategorySidebar.jsx';
import AppearancePanel from './components/AppearancePanel.jsx';
import BottomBar from './components/BottomBar.jsx';

export default function AvatarCreatorSection({ onSaved }) {
  const [config, setConfig] = useState(loadConfig);
  const [activeTab, setActiveTab] = useState('apariencia');
  const [toast, setToast] = useState(null);
  const controlsRef = useRef(null);
  const toastTimer = useRef(null);

  const update = (patch) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem('safetyLoveAvatar', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // selecting gender applies small presets (user can always override)
  const selectGender = (g) => {
    setConfig((prev) => {
      const preset = GENDER_PRESETS[g] || {};
      const next = { ...prev, gender: g, ...preset };
      try {
        localStorage.setItem('safetyLoveAvatar', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const save = () => {
    try {
      localStorage.setItem('safetyLoveAvatar', JSON.stringify(config));
    } catch {}
    showToast('¡Avatar guardado! 💕');
    // notify parent via callback if provided
    if (onSaved) onSaved();
    // dispatch a global event so other parts of the app can react without prop drilling
    try {
      window.dispatchEvent(new CustomEvent('safetyLoveAvatarSaved'));
    } catch (e) {}
  };

  const reset = () => {
    setConfig(DEFAULT_AVATAR);
    try {
      localStorage.setItem('safetyLoveAvatar', JSON.stringify(DEFAULT_AVATAR));
    } catch {}
    if (controlsRef.current) controlsRef.current.reset();
    showToast('Avatar restablecido');
  };

  const rotateLeft = () => controlsRef.current?.rotateLeft(0.5);
  const rotateRight = () => controlsRef.current?.rotateRight(0.5);
  const zoomIn = () => controlsRef.current?.dollyIn(1.15);
  const zoomOut = () => controlsRef.current?.dollyOut(1.15);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-br from-[#FFF0F6] via-white to-[#FCE7F2] font-sans">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 pb-2 md:p-6 lg:flex-row lg:overflow-hidden lg:pb-2">
        {/* Left: Avatar 3D panel */}
        <Avatar3D
          config={config}
          controlsRef={controlsRef}
          onRotateLeft={rotateLeft}
          onRotateRight={rotateRight}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={reset}
        />

        {/* Panel de personalización (derecha) */}
        <aside className="flex flex-col w-full lg:w-[560px] max-w-full shrink-0 overflow-hidden rounded-[20px] border border-gray-100 bg-white lg:h-auto shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 w-full">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              <Sparkles size={18} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold leading-tight text-slate-800">Personaliza tu avatar</h2>
              <p className="mt-0.5 text-xs text-gray-500">Los cambios se aplican al instante</p>
            </div>
          </div>

          {/* Content: left vertical nav + main options */}
          <div className="flex w-full">
            {/* Left nav (component) */}
            <div className="px-3 py-5 border-r border-gray-100">
              <CategorySidebar active={activeTab} onSelect={setActiveTab} />
            </div>

            {/* Main options area */}
            <div className="flex-1 px-6 py-6">
              <div className="custom-scrollbar max-h-[55vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
                    {activeTab === 'apariencia' ? (
                      <>
                        {/* Gender selector inside scroll flow */}
                        <div className="mb-4 flex items-center gap-4">
                          <div className="text-sm font-medium text-gray-700">Género</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => selectGender('male')}
                              className={`px-3 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition ${config.gender === 'male' ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-100' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                              <Mars size={14} className={`${config.gender === 'male' ? 'text-pink-500' : 'text-gray-400'}`} />
                              <span>Hombre</span>
                            </button>
                            <button
                              onClick={() => selectGender('female')}
                              className={`px-3 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition ${config.gender === 'female' ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-100' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                              <Venus size={14} className={`${config.gender === 'female' ? 'text-pink-500' : 'text-gray-400'}`} />
                              <span>Mujer</span>
                            </button>
                          </div>
                        </div>

                        <AppearancePanel avatar={config} onChange={(patch) => update(patch)} />
                      </>
                    ) : activeTab === 'cabello' ? (
                      <CabelloOptions config={config} update={update} />
                    ) : activeTab === 'ropa' ? (
                      <RopaOptions config={config} update={update} />
                    ) : activeTab === 'accesorios' ? (
                      <AccesoriosOptions config={config} update={update} />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </aside>
      </div>

      {/* Barra inferior */}
      <div className="shrink-0 px-4 pb-6 lg:px-6">
         <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-lg border border-gray-100 bg-white px-5 py-4">
           <div className="flex min-w-0 items-center gap-3">
             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50">
               <Shirt size={16} className="text-pink-600" />
             </div>
             <div className="min-w-0">
               <p className="text-sm font-semibold leading-tight text-slate-800">Tu avatar</p>
               <p className="truncate text-[11px] text-gray-500">Personaliza tu compañero</p>
             </div>
           </div>
           <div className="flex items-center gap-3 ml-auto">
             <button
               onClick={reset}
               className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
             >
               Restablecer
             </button>
             <button
               onClick={save}
               className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
             >
               Guardar avatar
             </button>
           </div>
         </div>
      </div>

      {toast ? (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-1/2 top-5 z-[9999] -translate-x-1/2 rounded-full bg-[#E88B9A] px-5 py-2.5 text-xs font-semibold text-white shadow-lg"
        >
          {toast}
        </motion.div>
      ) : null}
    </div>
  );
}

function ControlBtn({ children, onClick, title }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      title={title}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[#C44B7A] transition hover:bg-pink-50 active:bg-pink-100"
    >
      {children}
    </motion.button>
  );
}
