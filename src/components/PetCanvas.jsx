import { useState, useEffect, useRef } from 'react'

// Sprites from vscode-pets by Anthony Shaw — MIT License
// https://github.com/tonybaloney/vscode-pets
// Cat uses the Totoro sprites (gray_walk/idle_8fps.gif) — no dedicated cat GIFs exist in the repo.
//
// All sprites face RIGHT by default.
// When direction === 'left', we flip via scaleX(-1).

const PET_SIZE = 64
const SPEED = 0.7

const SPRITES = {
  cat: {
    walk: '/images/pets/cat_walk.gif',
    idle: '/images/pets/cat_idle.gif',
  },
  snail: {
    walk: '/images/pets/snail_walk.gif',
    idle: '/images/pets/snail_idle.gif',
  },
}

const INITIAL_PETS = [
  { id: 0, species: 'cat',   x: 80,  direction: 'right' },
  { id: 1, species: 'snail', x: 300, direction: 'left'  },
]

export default function PetCanvas({ containerWidth }) {
  const [pets, setPets] = useState(INITIAL_PETS)
  const rafRef   = useRef()
  const widthRef = useRef(containerWidth || 600)

  useEffect(() => {
    widthRef.current = containerWidth || 600
  }, [containerWidth])

  useEffect(() => {
    function tick() {
      setPets(prev =>
        prev.map(pet => {
          const maxX = Math.max(0, widthRef.current - PET_SIZE)
          let nx  = pet.x + (pet.direction === 'right' ? SPEED : -SPEED)
          let dir = pet.direction

          if (nx >= maxX) { nx = maxX; dir = 'left'  }
          if (nx <= 0)    { nx = 0;    dir = 'right' }

          return { ...pet, x: nx, direction: dir }
        })
      )
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none"
      style={{ height: PET_SIZE }}
    >
      {pets.map(pet => {
        const s    = SPRITES[pet.species]
        const flip = pet.direction === 'left'

        return (
          <img
            key={pet.id}
            src={s.walk}
            alt={pet.species}
            style={{
              position:       'absolute',
              bottom:         0,
              left:           pet.x,
              width:          PET_SIZE,
              height:         PET_SIZE,
              imageRendering: 'pixelated',
              objectFit:      'contain',
              objectPosition: 'bottom',
              transform:      flip ? 'scaleX(-1)' : undefined,
              pointerEvents:  'none',
            }}
          />
        )
      })}
    </div>
  )
}
