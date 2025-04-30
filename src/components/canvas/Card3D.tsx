import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Environment, OrbitControls, Html } from '@react-three/drei'
import { useCardContext } from '../../contexts/CardContext'
import * as THREE from 'three'

// Card proportions in meters (0.063 x 0.088)
const CARD_WIDTH = 0.063
const CARD_HEIGHT = 0.088
const CARD_DEPTH = 0.003

function CardMesh({ flipped, onFlip }) {
  // Progressive texture loading (low-res to high-res)
  const textures = useTexture([
    '/assets/card frame Bitter Reprisal V8 (with card art).png',
    '/assets/cardback JYNX.png',
    '/assets/Paper Texture 340M.jpg',
  ])
  const [front, back, paper] = textures
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [rotation, setRotation] = useState([0, 0, 0])
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [lastPointer, setLastPointer] = useState<[number, number] | null>(null)
  const [momentum, setMomentum] = useState<[number, number]>([0, 0])
  const [zoom, setZoom] = useState(1)
  const [flipAnim, setFlipAnim] = useState(0)
  const [flipping, setFlipping] = useState(false)

  // Idle breathing animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    setScale(1 + 0.012 * Math.sin(t * 1.2))
    // Momentum
    if (!isDragging && (Math.abs(momentum[0]) > 0.0001 || Math.abs(momentum[1]) > 0.0001)) {
      setRotation(([x, y, z]) => [x + momentum[1], y + momentum[0], z])
      setMomentum(([mx, my]) => [mx * 0.95, my * 0.95])
    }
    // Flip animation
    if (flipping) {
      setFlipAnim((prev) => {
        const next = prev + 0.12
        if (next >= Math.PI) {
          setFlipping(false)
          onFlip && onFlip()
          return 0
        }
        return next
      })
    }
  })

  // Drag/rotate logic
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setLastPointer([e.clientX, e.clientY])
  }
  const onPointerUp = () => {
    setIsDragging(false)
    setLastPointer(null)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !lastPointer) return
    const [lx, ly] = lastPointer
    const dx = (e.clientX - lx) * 0.01
    const dy = (e.clientY - ly) * 0.01
    setRotation(([x, y, z]) => [x + dy, y + dx, z])
    setMomentum([dx, dy])
    setLastPointer([e.clientX, e.clientY])
  }
  // Pinch-to-zoom (basic)
  const onWheel = (e: React.WheelEvent) => {
    setZoom((z) => Math.max(0.7, Math.min(1.5, z - e.deltaY * 0.001)))
  }
  // Double click to flip
  const onDoubleClick = () => {
    if (!flipping) setFlipping(true)
  }

  // Card flip logic
  const flipY = flipping ? flipAnim : flipped ? Math.PI : 0

  return (
    <group
      ref={meshRef}
      scale={[scale * zoom, scale * zoom, scale * zoom]}
      rotation={[rotation[0], rotation[1] + flipY, rotation[2]]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onDoubleClick={onDoubleClick}
      onWheel={onWheel}
      // cursor={isDragging ? 'grabbing' : hovered ? 'pointer' : 'grab'}
    >
      {/* Card front */}
      <mesh visible={!flipped || (flipping && flipAnim < Math.PI / 2)}>
        <boxGeometry args={[CARD_WIDTH, CARD_DEPTH, CARD_HEIGHT]} />
        <meshPhysicalMaterial
          map={front}
          roughnessMap={paper}
          normalMap={paper}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          reflectivity={0.25}
          metalness={0.05}
          roughness={0.55}
          iridescence={0.1}
        />
      </mesh>
      {/* Card back */}
      <mesh visible={flipped || (flipping && flipAnim >= Math.PI / 2)} rotation={[0, Math.PI, 0]}>
        <boxGeometry args={[CARD_WIDTH, CARD_DEPTH, CARD_HEIGHT]} />
        <meshPhysicalMaterial
          map={back}
          roughnessMap={paper}
          normalMap={paper}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          reflectivity={0.25}
          metalness={0.05}
          roughness={0.55}
          iridescence={0.1}
        />
      </mesh>
      {/* TODO: Edge wear, particles, etc. */}
    </group>
  )
}

export function Card3D() {
  const { flipped, setFlipped } = useCardContext()
  // Responsive canvas container
  return (
    <div className='flex h-screen w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950'>
      <div className='aspect-[63/88] h-[490px] w-[350px] overflow-visible rounded-2xl shadow-2xl md:h-[588px] md:w-[420px] lg:h-[705px] lg:w-[504px]'>
        <Canvas camera={{ position: [0, 0, 0.22], fov: 32 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0.2, 0.6, 1]} intensity={1.2} />
          <directionalLight position={[-0.7, -0.3, 0.7]} intensity={0.7} />
          <directionalLight position={[0, 0.7, -1]} intensity={0.5} />
          {/* Placeholder for environment map */}
          {/* <Environment files="/assets/your_env_map.hdr" background={false} /> */}
          <Suspense fallback={<Html center>Loading Card...</Html>}>
            <CardMesh flipped={flipped} onFlip={() => setFlipped(!flipped)} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

export default Card3D
