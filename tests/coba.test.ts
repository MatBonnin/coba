import { calculateGroupValue, getGroups, getSolution } from '../src/utils/jeu'
import { describe, expect, test } from 'vitest'

const potiere = 'potière'
const paysan = 'paysan'
const voleur = 'voleur'
const scribe = 'scribe'
const chaman = 'chaman'
const reine = 'reine'


describe('Test des dés', () => {

  //test pottiere
  test('test des potières ', () => {
    const mainGroup = [ potiere]
    const opposingGroup = []
    expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(1)
  })
  
  test('test des paysan ', () => {
    const mainGroup = [ paysan]
    const opposingGroup = []
    expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(2)
  })
  test('test des voleurs ', () => {
    //main group 1 voleur  un scribe et 2 paysan
    const mainGroup = [ voleur]
    //opposion 2 paysan 1 scribe
    const opposingGroup = []
    
    expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(-1)
  })

  describe('test des scribes ', () => {
    test('test des scribes impair ', () => {
      //main group 1 scribe  un scribe et 2 paysan
      const mainGroup = [scribe]
      //opposion 2 paysan 1 scribe
      const opposingGroup = []

      
      expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(1)
    })

    test('test des scribes pair ', () => {
    
      const mainGroup = [scribe, scribe]

      const opposingGroup = []

      
      expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(2+2)
    })
  })

  test('test des chamans ', () => {
    //main group 1 scribe  un scribe et 2 paysan
    const mainGroup = [chaman]
    //opposion 2 paysan 1 scribe
    const opposingGroup = [paysan,paysan,scribe]

    
    expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(3)
  })
  test('test des reines ', () => {

    const mainGroup = [reine,paysan,potiere,potiere]
    const opposingGroup = [paysan,paysan,scribe]

    expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(3+2+0+0)
  })

})

describe('calculér la valeur du groupe avec valeurs d entrainement', () => {
  //test potiere poritere paysant
  test('test 1 ', () => {
    const mainGroup = [potiere, potiere, paysan]
    const opposingGroup = []
    expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(1 + 1 + 2)
  })
  //test  2 potiere 1 paysant 1 scribe

  test('test 2 ', () => {
    const mainGroup = [potiere,potiere, paysan, scribe]
    const opposingGroup = []
    expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(1 + 1 + 2 + 2)
  })
  // test 1 chaman et 1 paysant avec en face 5 dé
  test (' test 3 ', () => {
    const mainGroup = [chaman]
    const opposingGroup = [paysan,paysan,scribe,potiere,potiere]
    expect(calculateGroupValue(mainGroup, opposingGroup)).toBe(5)
  })
  

})

describe('test des cas impossibles', () => {

  test('7 reines n’a pas de solution', () => {
    const allQueens = Array(7).fill('reine')
    expect(getSolution(allQueens)).toBeNull()
  })

  test('inputs invalides lèvent une erreur', () => {
    expect(() => getSolution(['foo','bar'])).toThrow()
  })
  
  
} )


describe('Test des solutions', () => {
  // Helper commun à tous les tests
  function expectGroupsAnyOrder(actualA, actualB, expected1, expected2) {
    const sortedA    = [...actualA].sort()
    const sortedB    = [...actualB].sort()
    const sortedExp1 = [...expected1].sort()
    const sortedExp2 = [...expected2].sort()

    const matchDirect  =
      JSON.stringify(sortedA) === JSON.stringify(sortedExp1) &&
      JSON.stringify(sortedB) === JSON.stringify(sortedExp2)

    const matchSwapped =
      JSON.stringify(sortedA) === JSON.stringify(sortedExp2) &&
      JSON.stringify(sortedB) === JSON.stringify(sortedExp1)

      console.log('matchDirect', sortedA)
      console.log('matchSwapped', sortedB)
      console.log('expected1', sortedExp1)
      console.log('expected2', sortedExp2)
      console.log('actualA', matchDirect)
      console.log('actualB', matchSwapped)
    expect(matchDirect || matchSwapped).toBe(true)
  }

  // Solution du défi 01
  test('solution 1', () => {
    const allDices = [
      potiere, potiere, potiere, potiere,
      potiere, potiere,
      paysan
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [potiere, potiere, paysan]
    const expected2 = [
      potiere, potiere, potiere, potiere
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 02
  test('solution 2', () => {
    const allDices = [
      paysan, paysan, paysan, paysan,
      potiere, potiere,
      scribe
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      paysan, paysan, paysan
    ]
    const expected2 = [
      potiere, potiere, paysan, scribe
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 03
  test('solution 3', () => {
    const allDices = [
      paysan, paysan, paysan, paysan,
      scribe, scribe,
      voleur
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      paysan, paysan, scribe, voleur
    ]
    const expected2 = [
      paysan, paysan, scribe
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 04
  test('solution 4', () => {
    const allDices = [
      potiere, potiere, potiere, potiere,
      paysan, paysan,
      chaman
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      potiere, potiere, chaman
    ]
    const expected2 = [
      potiere, potiere, paysan, paysan
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 05
  test('solution 5', () => {
    const allDices = [
      paysan, paysan, paysan,
      potiere, potiere,
      reine,
      voleur
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      paysan, paysan, reine, 
    ]
    const expected2 = [
      paysan, voleur,potiere,potiere
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 06
  test('solution 6', () => {
    const allDices = [
      potiere, potiere, potiere, potiere,
      paysan,
      voleur,
      chaman
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      potiere, potiere, paysan
    ]
    const expected2 = [
      voleur, chaman,potiere, potiere
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 07
  test('solution 7', () => {
    const allDices = [
      potiere,
      scribe, scribe, scribe,
      paysan, paysan,
      reine
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      potiere, scribe, scribe
    ]
    const expected2 = [
      paysan, paysan, scribe, reine
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 08
  test('solution 8', () => {
    const allDices = [
      potiere, potiere, potiere,
      chaman,
      paysan, voleur, reine
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      potiere, potiere, chaman, 
    ]
    const expected2 = [
      paysan, voleur, reine,potiere
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 09
  test('solution 9', () => {
    const allDices = [
      scribe, scribe, scribe,
      chaman,
      paysan, paysan,
      reine
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      scribe, chaman
    ]
    const expected2 = [
      paysan, paysan, scribe, scribe, reine
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 10
  test('solution 10', () => {
    const allDices = [
      potiere,
      scribe, scribe,
      reine,
      voleur, voleur,
      chaman
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      potiere, scribe, reine
    ]
    const expected2 = [
      voleur, voleur, chaman,scribe
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })

  // Solution du défi 11
  test('solution 11', () => {
    const allDices = [
      chaman, chaman,
      reine,
      paysan,
      voleur, voleur, voleur
    ]
    const [groupA, groupB] = getSolution(allDices)!
    const expected1 = [
      chaman
    ]
    const expected2 = [
      voleur, voleur, voleur, chaman, reine,paysan
    ]
    expectGroupsAnyOrder(groupA, groupB, expected1, expected2)
  })
})


