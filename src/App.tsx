import './App.css'

// src/App.tsx
import { Dice, getSolution } from './utils/jeu'

import { PlayGame } from './components/playGame'
import { useState } from 'react'

const diceOptions: Dice[] = ['potière', 'paysan', 'voleur', 'scribe', 'chaman', 'reine']
export const gameSets: Dice[][] = [
  // Partie 1
  ['potière','potière','paysan','paysan','paysan','scribe','voleur'],
  // // Partie 2
  // ['potière','potière','potière','potière','paysan','paysan','chaman'],
  // // Partie 3
  // ['paysan','paysan','paysan','paysan','potière','potière','scribe'],
  // // Partie 4
  // ['potière','voleur','voleur','scribe','paysan','paysan','chaman'],
  // // Partie 5
  // ['potière','potière','reine','paysan','voleur','paysan','potière'],
  // // Partie 6
  // ['potière','potière','paysan','paysan','scribe','scribe','chaman'],
  // // Partie 7
  // ['paysan','paysan','paysan','paysan','chaman','chaman','potière'],
  // // Partie 8
  // ['potière','voleur','voleur','voleur','paysan','paysan','potière'],
  // // Partie 9
  // ['reine','reine','potière','paysan','paysan','scribe','voleur'],
  // // Partie 10
  // ['potière','chaman','chaman','paysan','voleur','scribe','potière']
]
export default function App() {
  const [allDices, setAllDices] = useState<any[]>(Array(7).fill('potière'))
  const [solution, setSolution] = useState<[any[], any[]] | 'error' | null>(null)

  const onCompute = () => {
    const sol = getSolution(allDices)
    if (sol === null) setSolution('error')
    else setSolution(sol as [any[], any[]])
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Les Pierres de Coba</h1>
      </header>

      <section className="dice-section">
        {allDices.map((die: any, idx: any) => (
          <div key={idx} className="dice-select-wrapper">
            <select
              value={die}
              onChange={e => {
                const next: any[] = [...allDices]
                next[idx] = e.target.value
                setAllDices(next)
              }}
              className="dice-select"
            >
              {diceOptions.map((opt: any) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </section>

      <button onClick={onCompute} className="compute-button">
        Calculer la solution
      </button>

      <section className="solution-section">
        {solution === 'error' && (
          <p className="error-text">Aucune solution trouvée.</p>
        )}

        {solution && solution !== 'error' && (
          <div className="groups-container">
            <div className="group">
              <h2>Groupe A</h2>
              <ul>
                {solution[0].map((d: any, i: any) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="group">
              <h2>Groupe B</h2>
              <ul>
                {solution[1].map((d: any, i: any) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
      {gameSets.map((diceSet: Dice[], idx: number) => (
          <div key={idx} className="w-100 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Partie {idx + 1}</h2>
            <PlayGame dice={diceSet} />
          </div>
        ))}
    </div>
)
}
