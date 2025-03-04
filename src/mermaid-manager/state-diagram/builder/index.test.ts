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
                    'First': {
                        alias: 'First',
                        entities: {}
                    },
                    'Second': {
                        alias: 'Second',
                        entities: {
                            'second': 'sec',
                        }
                    },
                    'Third': {
                        alias: 'Third',
                        entities: {
                            'third': 'third',
                        }
                    },
                }
            })
            
            testBuilder.buildComposite('First').beginWith('[*]').to('Second')
            testBuilder.buildComposite('Second').beginWith('[*]').to('second').to('Third')
            testBuilder.buildComposite('Third').beginWith('[*]').to('third').to('[*]')
            
            testBuilder.beginWith('[*]').to('First')
            const diagram = testBuilder.compile()
            expect(diagram).toEqual('')
        })
    })
})