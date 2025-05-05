'use client'

import React, { Suspense, useState } from 'react'
import { Loader, CharacterSelect } from '../src/components/dom'
import { CardProvider, useCardContext } from '../src/contexts/CardContext'
import Card3D from '../src/components/canvas/Card3D'

function MainFlow() {
  const { selectedCharacter, setSelectedCharacter } = useCardContext()
  const [loading, setLoading] = useState<boolean>(false)

  if (loading) {
    return <Loader loading={loading} onFinish={() => setLoading(false)} />
  }

  if (!selectedCharacter) {
    return (
      <CharacterSelect onSelect={setSelectedCharacter} selected={!!selectedCharacter} character={selectedCharacter} />
    )
  }

  // Show the 3D Card view after character selection
  return <Card3D />
}

export default function Page() {
  return (
    <CardProvider>
      <Suspense
        fallback={
          <Loader
            loading={true}
            onFinish={() => {
            }}
          />
        }
      >
        <MainFlow />
      </Suspense>
    </CardProvider>
  )
}
