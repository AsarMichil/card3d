'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'
import { Line, useCursor, MeshDistortMaterial } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: { [key: string]: THREE.Object3D }
  materials: { [key: string]: THREE.Material }
}

interface BlobProps {
  route?: string
  position?: [number, number, number]
  scale?: number | [number, number, number]
  [key: string]: any
}

export const Blob = ({ route = '/', ...props }: BlobProps) => {
  const router = useRouter()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0.5} color={hovered ? 'hotpink' : '#1fb2f5'} />
    </mesh>
  )
}

interface LogoProps {
  route?: string
  position?: [number, number, number]
  scale?: number | [number, number, number]
  rotation?: [number, number, number]
  [key: string]: any
}

export const Logo = ({ route = '/blob', ...props }: LogoProps) => {
  const mesh = useRef<THREE.Group>(null)
  const router = useRouter()

  const [hovered, hover] = useState(false)
  const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])

  useCursor(hovered)
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime()) * (Math.PI / 8)
      mesh.current.rotation.x = Math.cos(state.clock.getElapsedTime()) * (Math.PI / 8)
      mesh.current.rotation.z -= delta / 4
    }
  })

  return (
    <group ref={mesh} {...props}>
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, 1]} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, -1]} />
      <mesh onClick={() => router.push(route)} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshPhysicalMaterial roughness={0.5} color={hovered ? 'hotpink' : '#1fb2f5'} />
      </mesh>
    </group>
  )
}

interface PrimitiveProps {
  position?: [number, number, number]
  scale?: number | [number, number, number]
  rotation?: [number, number, number]
  [key: string]: any
}

export function Duck(props: PrimitiveProps) {
  const { scene } = useGLTF('/duck.glb') as unknown as GLTFResult

  useFrame((state, delta) => (scene.rotation.y += delta))

  return <primitive object={scene} {...props} />
}

export function Dog(props: PrimitiveProps) {
  const { scene } = useGLTF('/dog.glb') as unknown as GLTFResult

  return <primitive object={scene} {...props} />
} 