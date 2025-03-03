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
            
            const diagram = testBuilder.beginWith('[*]').to('A').to('B').to('C').to('A', 'Back to A').compile()
            expect(diagram).toEqual(readFileSync(__dirname + '/test.scenario1.md').toString())
        })
    })
})