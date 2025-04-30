'use client'

import React, { useState } from 'react'
import { Loader, CharacterSelect } from '../src/components/dom'
import { CardProvider, useCardContext } from '../src/contexts/CardContext'
import Card3D from '../src/components/canvas/Card3D'

function MainFlow() {
  const { selectedCharacter, setSelectedCharacter } = useCardContext()
  const [loading, setLoading] = useState<boolean>(true)

  // Simulate loading for demo; replace with real asset loading logic
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2600)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader loading={loading} onFinish={() => setLoading(false)} />
  }

  if (!selectedCharacter) {
    return <CharacterSelect onSelect={setSelectedCharacter} selected={!!selectedCharacter} />
  }

  // Show the 3D Card view after character selection
  return <Card3D />
}

export default function Page() {
  return (
    <CardProvider>
      <MainFlow />
    </CardProvider>
  )
} 