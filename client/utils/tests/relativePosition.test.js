// local imports
import relativePosition from '../relativePosition'
import { sidebarWidth } from 'interface/Sidebar/styles'

describe('Utils', () => {
    describe('Relative Position Util', () => {
        test('Can correct coordinates', () => {
            const info = {pan: {x: 0, y: 0}}
            // for now, the only difference between absolute and diagram coordinates
            // is the sidebar width
            expect(relativePosition({x: 50, y: 100}, info)).toEqual({
                x: 50 - sidebarWidth,
                y: 100,
            })
        })

        test('incorporate diagram pan in relative calculation', () => {
            const info = {
                // the mock pan
                pan: {
                    x: 10,
                    y: 100,
                }
            }
            // for now, the only difference between absolute and diagram coordinates
            // is the sidebar width
            expect(relativePosition({x: 50, y: 100}, info)).toEqual({
                x: 50 - sidebarWidth - info.pan.x,
                y: 100 - info.pan.y,
            })
        })
    })
})
