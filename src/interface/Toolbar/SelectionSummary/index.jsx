// external imports
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
// local imports
import styles from './styles'
import AnchorSummary from './AnchorSummary'
import PropagatorSummary from './PropagatorSummary'
import { flatMap } from 'utils'
import { deleteElements } from 'actions/elements'
import ButtonRow from './ButtonRow'
import { RedButton } from 'components'

const SelectionSummary = ({ style, selection, deleteElements, ...unusedProps }) => {
    // hide the individual delete buttons if there is a heteogenous selection
    const hideDelete = selection.anchors && selection.anchors.length > 0
                            && selection.propagators && selection.propagators.length > 0

    return (
        <div style={{...styles.container, ...style}} {...unusedProps}>
            {(selection.anchors || []).length > 0
                && <AnchorSummary anchors={selection.anchors} showDelete={!hideDelete}/>}
            {(selection.propagators || []).length > 0
                && <PropagatorSummary propagators={selection.propagators} showDelete={!hideDelete}/>}
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
    deleteElements: () => (
        dispatch(deleteElements(...[
            ...selection.propagators.map(id => ({type: 'propagators', id})),
            ...selection.anchors.map(id => ({type: 'anchors', id}))
        ]))
    )
})

export default connect(null, mapDispatchToProps)(SelectionSummary)

// local exports for convinience
export MultiRow from './MultiRow'
export SliderRow from './SliderRow'
export Row from './Row'
export Label from './Label'
export Header from './Header'
export ButtonRow from './ButtonRow'
