// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import styles from './styles'
import AnchorSummary from './AnchorSummary'
import PropagatorSummary from './PropagatorSummary'
import TextSummary from './TextSummary'
import ShapeSummary from './ShapeSummary'
import { flatMap } from 'utils'
import { deleteSelection } from 'actions/elements'
import { withCommit } from 'actions/history'
import ButtonRow from './ButtonRow'
import { RedButton } from 'components'

const SelectionSummary = ({ style, selection, deleteElements, ...unusedProps }) => {
    // hide the individual delete buttons if there is a heteogenous selection
    const hideDelete = Object.values(selection).filter(ids => ids.length > 0).length > 1

    return (
        <div style={{...styles.container, ...style}} {...unusedProps}>
            {(selection.anchors || []).length > 0
                && <AnchorSummary anchors={selection.anchors} showDelete={!hideDelete}/>}
            {(selection.propagators || []).length > 0
                && <PropagatorSummary propagators={selection.propagators} showDelete={!hideDelete}/>}
            {(selection.text || []).length > 0
                && <TextSummary text={selection.text} showDelete={!hideDelete}/>}
            {(selection.shapes || []).length > 0
                && <ShapeSummary shapes={selection.shapes} showDelete={!hideDelete}/>}
            {hideDelete &&  (
                <ButtonRow>
                    <RedButton onClick={deleteElements} style={styles.deleteButton}>
                        Delete Elements
                    </RedButton>
                </ButtonRow>
            )}
        </div>
    )
}

const mapDispatchToProps = (dispatch, {selection}) => ({
    deleteElements: () => dispatch(withCommit(deleteSelection(), "removed selected elements from diagram"))
})

export default connect(null, mapDispatchToProps)(SelectionSummary)

// local exports for convinience
export MultiRow from './MultiRow'
export SliderRow from './SliderRow'
export Row from './Row'
export Label from './Label'
export Header from './Header'
export ButtonRow from './ButtonRow'
export Container from './Container'
