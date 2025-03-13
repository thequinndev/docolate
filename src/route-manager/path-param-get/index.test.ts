import { getParamsFromPath } from '.'

describe("getParamsFromPath", () => {

    it('Will extract params like {param}', () => {
        const result = getParamsFromPath('/my-path/{param1}/{param2}')
        expect(result).toEqual({
            param1: false,
            param2: false
        })
    })

    it('Will extract params like :param', () => {
        const result = getParamsFromPath('/my-path/:param1/:param2')
        expect(result).toEqual({
            param1: false,
            param2: false
        })
    })

})