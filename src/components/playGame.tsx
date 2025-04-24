import './PlayGame.css'

import { Dice, calculateGroupValue } from '../utils/jeu'
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import React, { useEffect, useState } from 'react'

interface DieItem {
  id: string
  type: Dice
}

interface PlayGameProps {
  dice: Dice[]
  onSuccess?: (groups: [Dice[], Dice[]]) => void
}

export const PlayGame: React.FC<PlayGameProps> = ({ dice, onSuccess }) => {
  const [remaining, setRemaining] = useState<DieItem[]>([])
  const [groupA, setGroupA] = useState<DieItem[]>([])
  const [groupB, setGroupB] = useState<DieItem[]>([])
  const [message, setMessage] = useState<string | null>(null)

  // À l'initialisation ou quand `dice` change
  useEffect(() => {
    const items = dice.map((d, i) => ({ id: `die-${i}`, type: d }))
    setRemaining(items)
    setGroupA([])
    setGroupB([])
    setMessage(null)
  }, [dice])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const destId = over.id as string

    // Trouver la source et la destination
    const lists = {
      remaining: { items: remaining, set: setRemaining },
      A: { items: groupA, set: setGroupA },
      B: { items: groupB, set: setGroupB },
    }

    // On détecte dans quelle liste est l'élément draggable
    let srcKey: keyof typeof lists = 'remaining'
    if (groupA.find(d => d.id === activeId)) srcKey = 'A'
    else if (groupB.find(d => d.id === activeId)) srcKey = 'B'

    // La colonne cible (remaining, A ou B)
    // on mappe le droppableId sur la même clé
    const destKey = destId as keyof typeof lists

    if (srcKey === destKey) return // pas de mouvement

    const moving = lists[srcKey].items.find(d => d.id === activeId)!
    // on retire de la source
    lists[srcKey].set(cur => cur.filter(d => d.id !== activeId))
    // on ajoute à la destination
    lists[destKey].set(cur => [...cur, moving])
  }

  function DroppableColumn({
    id,
    title,
    items,
  }: {
    id: 'remaining' | 'A' | 'B'
    title: string
    items: DieItem[]
  }) {
    const { isOver, setNodeRef } = useDroppable({ id })
    return (
      <div
        ref={setNodeRef}
        className={`pg-column${isOver ? ' pg-over' : ''}`}
      >
        <div className="pg-column-title">{title}</div>
        <div className="pg-dice-list">
          {items.map(d => (
            <DraggableDie key={d.id} id={d.id} type={d.type} />
          ))}
        </div>
      </div>
    )
  }

  function DraggableDie({
    id,
    type,
  }: {
    id: string
    type: Dice
  }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({ id })
    const style = transform
      ? {
          transform: `translate(${transform.x}px, ${transform.y}px)`,
          zIndex: 10,
        }
      : undefined

    return (
      <button
        ref={setNodeRef}
        style={style}
        className={`pg-die-button${isDragging ? ' pg-dragging' : ''}`}
        {...listeners}
        {...attributes}
      >
        {type}
      </button>
    )
  }

  const checkSolution = () => {
    if (remaining.length > 0) {
      setMessage('Assignez tous les dés dans Groupe A ou Groupe B.')
      return
    }
    const valA = calculateGroupValue(
      groupA.map(d => d.type),
      groupB.map(d => d.type)
    )
    const valB = calculateGroupValue(
      groupB.map(d => d.type),
      groupA.map(d => d.type)
    )

    if (valA === valB) {
      setMessage(`🎉 Bravo ! Équilibre trouvé : ${valA} = ${valB}`)
      onSuccess &&
        onSuccess([
          groupA.map(d => d.type),
          groupB.map(d => d.type),
        ])
    } else {
      setMessage(`⚠️ Pas équilibré (${valA} ≠ ${valB}). Réessaie !`)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="pg-container">
        <h2 className="pg-header">Jouez au défi</h2>
        <p className="pg-instructions">
          Glissez-déposez les dés entre les colonnes.
        </p>

        <div className="pg-columns">
          <DroppableColumn id="remaining" title="Restants" items={remaining} />
          <DroppableColumn id="A" title="Groupe A" items={groupA} />
          <DroppableColumn id="B" title="Groupe B" items={groupB} />
        </div>

        <button onClick={checkSolution} className="pg-validate-button">
          Valider
        </button>
        {message && <div className="pg-message">{message}</div>}
      </div>
    </DndContext>
  )
}
