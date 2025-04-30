// https://github.com/studio-freight/lenis
// TODO refactor for app-directory
// See https://github.com/pmndrs/react-three-next/pull/123

// 1 - wrap <Component {...pageProps} /> with <Scroll /> in _app.tsx
// 2 - add <ScrollTicker /> wherever in the canvas
// 3 - enjoy
import { addEffect, useFrame } from '@react-three/fiber'
// @ts-ignore - Missing type declarations for @studio-freight/lenis
import Lenis from '@studio-freight/lenis'
import { useEffect, ReactNode } from 'react'
import { useRef } from 'react'
import * as THREE from 'three'

interface ScrollState {
  top: number
  progress: number
}

const state: ScrollState = {
  top: 0,
  progress: 0,
}

const { damp } = THREE.MathUtils

interface ScrollProps {
  children: ReactNode
}

export default function Scroll({ children }: ScrollProps) {
  const content = useRef<HTMLDivElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapper.current || !content.current) return

    const lenis = new Lenis({
      wrapper: wrapper.current,
      content: content.current,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenis.on('scroll', ({ scroll, progress }: { scroll: number; progress: number }) => {
      state.top = scroll
      state.progress = progress
    })
    const effectSub = addEffect((time: number) => lenis.raf(time))
    return () => {
      effectSub()
      lenis.destroy()
    }
  }, [])

  return (
    <div
      ref={wrapper}
      style={{
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        top: 0,
      }}>
      <div
        ref={content}
        style={{
          position: 'relative',
          minHeight: '200vh',
        }}>
        {children}
      </div>
    </div>
  )
}

interface ScrollTickerProps {
  smooth?: number
}

export const ScrollTicker = ({ smooth = 9999999 }: ScrollTickerProps) => {
  useFrame(({ viewport, camera }, delta) => {
    camera.position.y = damp(camera.position.y, -state.progress * viewport.height, smooth, delta)
  })

  return null
} 