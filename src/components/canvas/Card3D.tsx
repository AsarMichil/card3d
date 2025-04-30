import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { useTexture, Html, PresentationControls, Center, OrbitControls } from '@react-three/drei'
import { useCardContext } from '../../contexts/CardContext'
import * as THREE from 'three'

// Card proportions in meters (0.063 x 0.088)
const CARD_WIDTH = 0.063
const CARD_HEIGHT = 0.088
const CARD_DEPTH = 0.0005 // Thinner card

function CardMesh({ flipped, onFlip }) {
  // Progressive texture loading (low-res to high-res)
  const textures = useTexture({
    frontMap: '/assets/card frame Bitter Reprisal V8 (with card art).png',
    backMap: '/assets/cardback JYNX.png',
    normalMap: '/assets/papermaps/Watercolor Paper 001 NORM.jpg',
    roughnessMap: '/assets/papermaps/Watercolor Paper Roughness.jpg',
    aoMap: '/assets/papermaps/Watercolor Paper 001 OCC.jpg',
  })

  const { frontMap, backMap, normalMap, roughnessMap, aoMap } = textures
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [isPastHalfway, setIsPastHalfway] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [targetRotation, setTargetRotation] = useState(flipped ? Math.PI : 0)

  // Set up proper texture mapping
  useEffect(() => {
    if (frontMap && backMap) {
      // Fix texture settings
      ;[frontMap, backMap, normalMap, roughnessMap, aoMap].forEach((texture) => {
        if (texture) {
          // Prevent texture flipping
          texture.flipY = false

          // Correct repetition settings
          texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping

          // Set correct encoding
          texture.colorSpace = THREE.SRGBColorSpace
        }
      })
    }
  }, [frontMap, backMap, normalMap, roughnessMap, aoMap])

  // Update target rotation when flipped state changes
  useEffect(() => {
    setTargetRotation(flipped ? Math.PI : 0)
  }, [flipped])

  // Handle double-click to flip card
  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (!isFlipping) {
      onFlip()
    }
  }

  // Track rotation and handle past halfway
  useFrame(() => {
    if (!groupRef.current) return

    // Get current Y rotation (normalized to 0-2π range)
    const rotation = groupRef.current.rotation.y % (Math.PI * 2)
    const normalizedRotation = rotation < 0 ? rotation + Math.PI * 2 : rotation
    setCurrentRotation(normalizedRotation)

    // Determine if the card should be flipped based on current rotation
    const shouldBeFlipped = normalizedRotation > Math.PI / 2 && normalizedRotation < (3 * Math.PI) / 2

    // If we've crossed the halfway threshold and we're not already flipping
    if (shouldBeFlipped !== flipped && !isFlipping) {
      setIsFlipping(true)
      onFlip()

      // Reset flipping state after animation completes
      setTimeout(() => {
        setIsFlipping(false)
      }, 500)
    }
  })

  // Create a rounded rectangle shape for the card
  const roundedRectShape = new THREE.Shape()
  const radius = 0.002

  roundedRectShape.moveTo(-CARD_WIDTH / 2 + radius, -CARD_HEIGHT / 2)
  roundedRectShape.lineTo(CARD_WIDTH / 2 - radius, -CARD_HEIGHT / 2)
  roundedRectShape.quadraticCurveTo(CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH / 2, -CARD_HEIGHT / 2 + radius)
  roundedRectShape.lineTo(CARD_WIDTH / 2, CARD_HEIGHT / 2 - radius)
  roundedRectShape.quadraticCurveTo(CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_WIDTH / 2 - radius, CARD_HEIGHT / 2)
  roundedRectShape.lineTo(-CARD_WIDTH / 2 + radius, CARD_HEIGHT / 2)
  roundedRectShape.quadraticCurveTo(-CARD_WIDTH / 2, CARD_HEIGHT / 2, -CARD_WIDTH / 2, CARD_HEIGHT / 2 - radius)
  roundedRectShape.lineTo(-CARD_WIDTH / 2, -CARD_HEIGHT / 2 + radius)
  roundedRectShape.quadraticCurveTo(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, -CARD_WIDTH / 2 + radius, -CARD_HEIGHT / 2)

  const extrudeSettings = {
    steps: 1,
    depth: CARD_DEPTH,
    bevelEnabled: false,
  }

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      {/* Front of card */}
      <mesh position={[0, 0, CARD_DEPTH / 2 + 0.00027]}>
        <planeGeometry args={[CARD_WIDTH - 0.0005, CARD_HEIGHT - 0.0005]} />
        <meshPhysicalMaterial
          map={frontMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          aoMap={aoMap}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back of card */}
      <mesh position={[0, 0, -CARD_DEPTH / 2 - 0.00005]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_WIDTH - 0.0005, CARD_HEIGHT - 0.0005]} />
        <meshPhysicalMaterial
          map={backMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          aoMap={aoMap}
          side={THREE.FrontSide}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          metalness={0.1}
          reflectivity={0.5}
        />
      </mesh>

      {/* Card body with extrusion - rendered after front/back to fix z-order */}
      <mesh renderOrder={-1}>
        <extrudeGeometry args={[roundedRectShape, extrudeSettings]} />
        <meshStandardMaterial
          color='#f8f8f8'
          roughnessMap={roughnessMap}
          normalMap={normalMap}
          aoMap={aoMap}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={1}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export function Card3D() {
  const { flipped, setFlipped } = useCardContext()

  // Create specific snap positions for front and back
  const snapConfig = {
    front: [0, 0, 0] as [number, number, number],
    back: [0, Math.PI, 0] as [number, number, number],
  }

  return (
    <div className='flex h-screen w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950'>
      <div>
        <Canvas camera={{ position: [0, 0, 0.25], fov: 32 }} dpr={[1, 2]}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[0.2, 0.6, 1]} intensity={1.5} />
          <directionalLight position={[-0.7, -0.3, 0.7]} intensity={0.9} />
          <directionalLight position={[0, 0.7, -1]} intensity={0.8} />
          <Suspense fallback={<Html center>Loading Card...</Html>}>
            <OrbitControls
              enableZoom={true}
              enableDamping={true}
              enablePan={false}
              enableRotate={false}
              dampingFactor={0.25}
            />
            <PresentationControls
              enabled={true}
              global
              cursor={true}
              snap={true}
              speed={1.5}
              zoom={1}
              rotation={flipped ? snapConfig.back : snapConfig.front}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Center>
                <CardMesh flipped={flipped} onFlip={() => setFlipped(!flipped)} />
              </Center>
            </PresentationControls>
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

export default Card3D
