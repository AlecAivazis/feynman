// local imports
import relativePosition from '../relativePosition'
import { sidebarWidth } from 'interface/Sidebar/styles'

describe('Utils', function() {
    describe("Relative Position Util", function() {
        it("Can correct coordinates", function() {
            // for now, the only difference between absolute and diagram coordinates
            // is the sidebar width
            expect(relativePosition({x: 50, y: 100})).to.deep.equal({
                x: 50 - sidebarWidth,
                y: 100,
            })
        })
    })
})