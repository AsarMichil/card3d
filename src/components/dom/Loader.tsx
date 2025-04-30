import React, { useEffect, useState } from 'react'

interface LoaderProps {
  loading: boolean
  onFinish?: () => void
}

const progressStages = ['Summoning your card...', 'Applying curses...', 'Ready for battle!']

export const Loader: React.FC<LoaderProps> = ({ loading, onFinish }) => {
  const [stage, setStage] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setDone(true)
        setTimeout(() => onFinish && onFinish(), 700)
      }, 600)
    }
  }, [loading, onFinish])

  useEffect(() => {
    if (loading && stage < 2) {
      const t = setTimeout(() => setStage(stage + 1), 1200 + stage * 600)
      return () => clearTimeout(t)
    }
  }, [stage, loading])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 transition-opacity duration-700 ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      <div className='relative mb-8 flex items-center justify-center'>
        <div className='size-24 animate-spin rounded-full border-8 border-red-700 border-y-white shadow-lg' />
        <div className='absolute left-1/2 top-1/2 h-12 w-9 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-md border-2 border-white bg-gradient-to-br from-white to-red-700 shadow-md' />
      </div>
      <div className='mt-4 min-h-[2.2em] text-center font-serif text-lg tracking-wide text-white drop-shadow-lg'>
        {progressStages[stage]}
      </div>
    </div>
  )
}

export default Loader
