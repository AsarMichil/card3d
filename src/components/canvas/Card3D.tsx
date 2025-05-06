import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { useTexture, Html, PresentationControls, Center, OrbitControls } from '@react-three/drei'
import { useCardContext } from '../../contexts/CardContext'
import * as THREE from 'three'

// Card proportions in meters (0.063 x 0.088)
const CARD_WIDTH = 0.063
const CARD_HEIGHT = 0.088
const CARD_DEPTH = 0.0005 // Thinner card

function CardMesh() {
  const { selectedCharacter } = useCardContext()

  // Determine which front texture to use based on selected character
  const frontTexturePath = selectedCharacter?.includes('Clairvoyant_Dreams')
    ? '/assets/card frame Clairvoyant Dreams V8 (with card art).png'
    : '/assets/card frame Bitter Reprisal V8 (with card art).png'

  // Progressive texture loading (low-res to high-res)
  const textures = useTexture({
    frontMap: frontTexturePath,
    backMap: '/assets/cardback JYNX.png',
    normalMap: '/assets/papermaps/Watercolor Paper 001 NORM.jpg',
    roughnessMap: '/assets/papermaps/Watercolor Paper Roughness.jpg',
    aoMap: '/assets/papermaps/Watercolor Paper 001 OCC.jpg',
  })

  const { frontMap, backMap, normalMap, roughnessMap, aoMap } = textures
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)

  // Set up proper texture mapping
  useEffect(() => {
    if (frontMap && backMap) {
      // Fix texture settings
      ;[frontMap, backMap, normalMap, roughnessMap, aoMap].forEach((texture) => {
        if (texture) {
          // Updated: Setting flipY to true ensures correct orientation
          texture.flipY = true

          // Correct repetition settings
          texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping

          // Set correct encoding
          texture.colorSpace = THREE.SRGBColorSpace
        }
      })
    }
  }, [frontMap, backMap, normalMap, roughnessMap, aoMap])

  // Track rotation and handle past halfway
  useFrame(() => {
    if (!groupRef.current) return

    // Get current Y rotation (normalized to 0-2π range)
    const rotation = groupRef.current.rotation.y % (Math.PI * 2)
    const normalizedRotation = rotation < 0 ? rotation + Math.PI * 2 : rotation
    setCurrentRotation(normalizedRotation)
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
    <group ref={groupRef} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
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
  const { setSelectedCharacter } = useCardContext()

  // Create specific snap positions for front and back
  const snapConfig = {
    front: [0, 0, 0] as [number, number, number],
    back: [0, Math.PI, 0] as [number, number, number],
  }

  return (
    <div className='flex h-screen w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-red-950 to-blue-950'>
      <div className='size-full'>
        {/* Back button overlay */}
        <div className='absolute left-4 top-4 z-10'>
          <button
            className='flex items-center rounded-md  p-2 text-gray-300 transition-colors hover:text-white'
            onClick={() => {
              setSelectedCharacter(null)
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
            </svg>
            Change Card
          </button>
        </div>
        <Canvas camera={{ position: [0, 0, 0.3], fov: 32 }} dpr={[1, 2]}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[0.2, 0.6, 1]} intensity={1.5} />
          <directionalLight position={[-0.7, -0.3, 0.7]} intensity={0.9} />
          <directionalLight position={[0, 0.7, -1]} intensity={0.8} />
          <Suspense
            fallback={
              <Html center>
                <div
                  className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 transition-opacity duration-700`}
                >
                  <div className='relative mb-8 flex items-center justify-center'>
                    <div className='size-24 animate-spin rounded-full border-8 border-red-700 border-y-white shadow-lg' />
                    <div className='absolute left-1/2 top-1/2 h-12 w-9 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-md border-2 border-white bg-gradient-to-br from-white to-red-700 shadow-md' />
                  </div>
                </div>
              </Html>
            }
          >
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
              rotation={snapConfig.front}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Center>
                <CardMesh />
              </Center>
            </PresentationControls>
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

export default Card3D
