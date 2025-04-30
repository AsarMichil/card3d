import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CardContextType {
  selectedCharacter: string | null
  setSelectedCharacter: (character: string | null) => void
  flipped: boolean
  setFlipped: (flipped: boolean) => void
}

const CardContext = createContext<CardContextType | undefined>(undefined)

export const CardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)

  return (
    <CardContext.Provider value={{ selectedCharacter, setSelectedCharacter, flipped, setFlipped }}>
      {children}
    </CardContext.Provider>
  )
}

export const useCardContext = () => {
  const ctx = useContext(CardContext)
  if (!ctx) throw new Error('useCardContext must be used within a CardProvider')
  return ctx
}
