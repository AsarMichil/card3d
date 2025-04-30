import React, { useState } from 'react'

interface CharacterSelectProps {
  onSelect: (character: string) => void
  selected?: boolean
  character?: string
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect, selected, character }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className='flex flex-col items-center justify-center w-full bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950 h-screen'>
      <div className='flex flex-row gap-6'>
        <button
          type='button'
          tabIndex={0}
          onClick={() => onSelect('Bitter_Reprisalv2.jpg')}
          onMouseEnter={() => setHoveredCard('Bitter_Reprisalv2.jpg')}
          onMouseLeave={() => setHoveredCard(null)}
          onFocus={() => setHoveredCard('Bitter_Reprisalv2.jpg')}
          onBlur={() => setHoveredCard(null)}
          aria-label='Select Bitter Reprisal Character'
          className={`relative w-[260px] h-[360px] rounded-2xl overflow-hidden shadow-xl border-none outline-none cursor-pointer transition-transform duration-200 mb-8
            ${selected && character === 'Bitter_Reprisalv2.jpg' ? 'ring-4 ring-red-700 scale-105 shadow-red-700/40' : ''}
            ${hoveredCard === 'Bitter_Reprisalv2.jpg' && (!selected || character !== 'Bitter_Reprisalv2.jpg') ? 'ring-2 ring-red-400 scale-102 shadow-red-400/30' : ''}`}
        >
          <img
            src='/assets/Bitter_Reprisalv2.jpg'
            alt='Bitter Reprisal Character'
            className='w-full h-full object-cover block'
          />
          <div
            className={`absolute inset-0 flex items-end justify-center transition-opacity duration-200 pointer-events-none
              ${hoveredCard === 'Bitter_Reprisalv2.jpg' || (selected && character === 'Bitter_Reprisalv2.jpg') ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className='w-full bg-gradient-to-t from-red-700/80 to-transparent pb-6 text-center'>
              <span className='text-white text-lg font-serif font-bold drop-shadow-lg'>
                {selected && character === 'Bitter_Reprisalv2.jpg' ? 'Selected!' : 'Click to Select'}
              </span>
            </div>
          </div>
        </button>

        <button
          type='button'
          tabIndex={0}
          onClick={() => onSelect('Clairvoyant_Dreams.jpg')}
          onMouseEnter={() => setHoveredCard('Clairvoyant_Dreams.jpg')}
          onMouseLeave={() => setHoveredCard(null)}
          onFocus={() => setHoveredCard('Clairvoyant_Dreams.jpg')}
          onBlur={() => setHoveredCard(null)}
          aria-label='Select Clairvoyant Dreams Character'
          className={`relative w-[260px] h-[360px] rounded-2xl overflow-hidden shadow-xl border-none outline-none cursor-pointer transition-transform duration-200 mb-8
            ${selected && character === 'Clairvoyant_Dreams.jpg' ? 'ring-4 ring-red-700 scale-105 shadow-red-700/40' : ''}
            ${hoveredCard === 'Clairvoyant_Dreams.jpg' && (!selected || character !== 'Clairvoyant_Dreams.jpg') ? 'ring-2 ring-red-400 scale-102 shadow-red-400/30' : ''}`}
        >
          <img
            src='/assets/Clairvoyant_Dreams.jpg'
            alt='Clairvoyant Dreams Character'
            className='w-full h-full object-cover block'
          />
          <div
            className={`absolute inset-0 flex items-end justify-center transition-opacity duration-200 pointer-events-none
              ${hoveredCard === 'Clairvoyant_Dreams.jpg' || (selected && character === 'Clairvoyant_Dreams.jpg') ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className='w-full bg-gradient-to-t from-red-700/80 to-transparent pb-6 text-center'>
              <span className='text-white text-lg font-serif font-bold drop-shadow-lg'>
                {selected && character === 'Clairvoyant_Dreams.jpg' ? 'Selected!' : 'Click to Select'}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default CharacterSelect
