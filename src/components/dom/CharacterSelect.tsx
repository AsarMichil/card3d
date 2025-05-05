import React, { useState } from 'react'
import Image from 'next/image'

interface CharacterSelectProps {
  onSelect: (character: string) => void
  selected?: boolean
  character?: string
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect, selected, character }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950'>
      <div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-3 p-4'>
        <button
          type='button'
          tabIndex={0}
          onClick={() => onSelect('Bitter_Reprisalv2.jpg')}
          onMouseEnter={() => setHoveredCard('Bitter_Reprisalv2.jpg')}
          onMouseLeave={() => setHoveredCard(null)}
          onFocus={() => setHoveredCard('Bitter_Reprisalv2.jpg')}
          onBlur={() => setHoveredCard(null)}
          aria-label='Select Bitter Reprisal Character'
          className={`relative h-[360px] w-[260px] cursor-pointer overflow-hidden rounded-2xl border-none shadow-xl outline-none transition-transform duration-200
            ${selected && character === 'Bitter_Reprisalv2.jpg' ? 'shadow-red-700/40 ring-4 ring-red-700' : ''}
            ${hoveredCard === 'Bitter_Reprisalv2.jpg' && (!selected || character !== 'Bitter_Reprisalv2.jpg') ? 'shadow-red-400/30 ring-2 ring-red-400' : ''}`}
        >
          <Image
            src='/assets/Bitter_Reprisalv2.jpg'
            alt='Bitter Reprisal Character'
            className='block size-full object-cover'
            width={4000}
            height={3000}
          />
          <div
            className={`pointer-events-none absolute inset-0 flex items-end justify-center transition-opacity duration-200
              ${hoveredCard === 'Bitter_Reprisalv2.jpg' || (selected && character === 'Bitter_Reprisalv2.jpg') ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className='w-full bg-gradient-to-t from-red-700/80 to-transparent pb-6 text-center'>
              <span className='font-serif text-lg font-bold text-white drop-shadow-lg'>
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
          className={`relative h-[360px] w-[260px] cursor-pointer overflow-hidden rounded-2xl border-none shadow-xl outline-none transition-transform duration-200
            ${selected && character === 'Clairvoyant_Dreams.jpg' ? ' shadow-red-700/40 ring-4 ring-red-700' : ''}
            ${hoveredCard === 'Clairvoyant_Dreams.jpg' && (!selected || character !== 'Clairvoyant_Dreams.jpg') ? 'shadow-red-400/30 ring-2 ring-red-400' : ''}`}
        >
          <Image
            src='/assets/Clairvoyant_Dreams.jpg'
            alt='Clairvoyant Dreams Character'
            className='block size-full object-cover'
            width={4000}
            height={3000}
          />
          <div
            className={`pointer-events-none absolute inset-0 flex items-end justify-center transition-opacity duration-200
              ${hoveredCard === 'Clairvoyant_Dreams.jpg' || (selected && character === 'Clairvoyant_Dreams.jpg') ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className='w-full bg-gradient-to-t from-red-700/80 to-transparent pb-6 text-center'>
              <span className='font-serif text-lg font-bold text-white drop-shadow-lg'>
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
