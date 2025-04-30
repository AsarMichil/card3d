'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { r3f } from '@/helpers/global'
import * as THREE from 'three'
import { ReactNode, RefObject } from 'react'

interface SceneProps {
  style?: React.CSSProperties
  className?: string
  eventSource?: RefObject<HTMLDivElement>
  eventPrefix?: 'offset' | 'client' | 'page' | 'layer' | 'screen'
  children?: ReactNode
  [key: string]: any
}

export default function Scene({ ...props }: SceneProps) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props}
      onCreated={(state) => (state.gl.toneMapping = THREE.AgXToneMapping)}
    >
      {/* @ts-ignore */}
      <r3f.Out />
      <Preload all />
    </Canvas>
  )
} 