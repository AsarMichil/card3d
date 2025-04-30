import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Environment, OrbitControls, Html } from '@react-three/drei'
import { useCardContext } from '../../contexts/CardContext'
import * as THREE from 'three'

// Card proportions in meters (0.063 x 0.088)
const CARD_WIDTH = 0.063
const CARD_HEIGHT = 0.088
const CARD_DEPTH = 0.001

function CardMesh({ flipped, onFlip }) {
  // Progressive texture loading (low-res to high-res)
  const textures = useTexture({
    frontMap: '/assets/card frame Bitter Reprisal V8 (with card art).png',
    backMap: '/assets/cardback JYNX.png',
    paperMap: '/assets/Paper Texture 340M.jpg',
  })

  const { frontMap, backMap, paperMap } = textures
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0])
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [lastPointer, setLastPointer] = useState<[number, number] | null>(null)
  const [momentum, setMomentum] = useState<[number, number]>([0, 0])
  const [zoom, setZoom] = useState(1)

  // Apply correct texture settings
  useEffect(() => {
    ;[frontMap, backMap, paperMap].forEach((texture) => {
      if (texture) {
        texture.flipY = false
      }
    })
  }, [frontMap, backMap, paperMap])

  // Idle breathing animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    setScale(1 + 0.012 * Math.sin(t * 1.2))

    // Smooth momentum for rotation
    if (!isDragging && (Math.abs(momentum[0]) > 0.0001 || Math.abs(momentum[1]) > 0.0001)) {
      setRotation(([x, y, z]) => [x + momentum[1], y + momentum[0], z])
      setMomentum(([mx, my]) => [mx * 0.95, my * 0.95])
    }
  })

  // Drag/rotate logic
  const onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    setLastPointer([e.clientX, e.clientY])
  }

  const onPointerUp = (e: React.PointerEvent) => {
    e.stopPropagation()
    setIsDragging(false)
    setLastPointer(null)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !lastPointer) return
    e.stopPropagation()

    const [lx, ly] = lastPointer
    const dx = (e.clientX - lx) * 0.01
    const dy = (e.clientY - ly) * 0.01

    // Apply rotation without restrictions
    setRotation(([x, y, z]) => [x + dy, y + dx, z])
    setMomentum([dx, dy])
    setLastPointer([e.clientX, e.clientY])
  }

  // Pinch-to-zoom (basic)
  const onWheel = (e: React.WheelEvent) => {
    setZoom((z) => Math.max(0.7, Math.min(1.5, z - e.deltaY * 0.001)))
  }

  return (
    <group
      ref={meshRef}
      scale={[scale * zoom, scale * zoom, scale * zoom]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onWheel={onWheel}
    >
      {/* Front of card */}
      <mesh position={[0, 0, CARD_DEPTH / 2]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshPhysicalMaterial
          map={frontMap}
          roughnessMap={paperMap}
          normalMap={paperMap}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          reflectivity={0.25}
          metalness={0.05}
          roughness={0.55}
          iridescence={0.1}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back of card */}
      <mesh position={[0, 0, -CARD_DEPTH / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshPhysicalMaterial
          map={backMap}
          roughnessMap={paperMap}
          normalMap={paperMap}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          reflectivity={0.25}
          metalness={0.05}
          roughness={0.55}
          iridescence={0.1}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Card edges */}
      <mesh>
        <boxGeometry args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} />
        <meshPhysicalMaterial
          color='#f8f8f8'
          roughnessMap={paperMap}
          normalMap={paperMap}
          roughness={0.8}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

export function Card3D() {
  const { flipped, setFlipped } = useCardContext()

  return (
    <div className='flex h-screen w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950'>
      <div className='aspect-[63/88] h-[490px] w-[350px] overflow-visible rounded-2xl shadow-2xl md:h-[588px] md:w-[420px] lg:h-[705px] lg:w-[504px]'>
        <Canvas camera={{ position: [0, 0, 0.25], fov: 32 }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0.2, 0.6, 1]} intensity={1.2} />
          <directionalLight position={[-0.7, -0.3, 0.7]} intensity={0.7} />
          <directionalLight position={[0, 0.7, -1]} intensity={0.5} />
          <Suspense fallback={<Html center>Loading Card...</Html>}>
            <CardMesh flipped={flipped} onFlip={() => setFlipped(!flipped)} />
          </Suspense>
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </div>
  )
}

export default Card3D
