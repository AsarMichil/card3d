import React, { useState } from 'react'

interface CharacterSelectProps {
  onSelect: (character: string) => void
  selected?: boolean
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect, selected }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div className='flex flex-col items-center justify-center w-full bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950 h-screen'>
      <button
        type='button'
        tabIndex={0}
        onClick={() => onSelect('Bitter_Reprisalv2.jpg')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label='Select Bitter Reprisal Character'
        className={`relative w-[260px] h-[360px] rounded-2xl overflow-hidden shadow-xl border-none outline-none cursor-pointer transition-transform duration-200 mb-8
          ${selected ? 'ring-4 ring-red-700 scale-105 shadow-red-700/40' : ''}
          ${hovered && !selected ? 'ring-2 ring-red-400 scale-102 shadow-red-400/30' : ''}`}
      >
        <img
          src='/assets/Bitter_Reprisalv2.jpg'
          alt='Bitter Reprisal Character'
          className='w-full h-full object-cover block'
        />
        <div
          className={`absolute inset-0 flex items-end justify-center transition-opacity duration-200 pointer-events-none
            ${hovered || selected ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='w-full bg-gradient-to-t from-red-700/80 to-transparent pb-6 text-center'>
            <span className='text-white text-lg font-serif font-bold drop-shadow-lg'>
              {selected ? 'Selected!' : 'Click to Select'}
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}

export default CharacterSelect
