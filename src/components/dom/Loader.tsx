import React, { useEffect, useState } from 'react'

interface LoaderProps {
  loading: boolean
  onFinish?: () => void
}

const progressStages = ['Summoning your card...', 'Applying enchantments...', 'Ready for battle!']

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 transition-opacity duration-700 ${done ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className='relative mb-8 flex items-center justify-center'>
        <div className='w-24 h-24 rounded-full border-8 border-red-700 border-t-white border-b-white animate-spin shadow-lg' />
        <div className='absolute left-1/2 top-1/2 w-9 h-12 bg-gradient-to-br from-white to-red-700 rounded-md shadow-md border-2 border-white -translate-x-1/2 -translate-y-1/2 -rotate-6' />
      </div>
      <div className='text-white text-lg font-serif tracking-wide mt-4 min-h-[2.2em] text-center drop-shadow-lg'>
        {progressStages[stage]}
      </div>
    </div>
  )
}

export default Loader
