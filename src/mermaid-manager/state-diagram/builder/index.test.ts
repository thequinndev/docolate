import { readFileSync } from 'fs'
import {StateDiagramBuilder} from '.'

describe('StateDiagramBuilder', () => {
    describe('passing scenarios', () => {
        it('should create simple entity only diagram', () => {
            const testBuilder = StateDiagramBuilder({
                entities: {
                    'A': 'Entity A',
                    'B': 'Entity B',
                    'C': 'Entity C',
                }
            })
            
            testBuilder.beginWith('[*]').to('A').to('B').to('C').to('A', 'Back to A')
            const diagram = testBuilder.compile()
            expect(diagram).toEqual(readFileSync(__dirname + '/test.scenario1.md').toString())
        })


        it('should create simple entity and composite diagram', () => {
            const testBuilder = StateDiagramBuilder({
                entities: {
                    'A': 'Entity A',
                    'B': 'Entity B',
                },
                composites: {
                    'comp1': {
                        entities: {
                            'comp1A': 'Composite 1 Entity A',
                            'comp1B': 'Composite 1 Entity B'
                        }
                    },
                    'comp2': {
                        entities: {
                            'comp2A': 'Composite 2 Entity A',
                            'comp2B': 'Composite 2 Entity B'
                        }
                    },
                }
            })
            
            testBuilder.buildComposite('comp1').beginWith('[*]').to('comp1A').to('comp1B')
            testBuilder.buildComposite('comp2').beginWith('comp2A').to('comp2B')
            
            testBuilder.beginWith('[*]').to('A').to('B')
            const diagram = testBuilder.compile()
            expect(diagram).toEqual(readFileSync(__dirname + '/test.scenario1.md').toString())
        })
    })
})