// external imports
import React from 'react'
// local imports
import { Slider } from 'components'
import styles from './styles'
import MultiRow from '../MultiRow'
import Row from '../Row'
import Label from '../Label'

const SliderRow = ({label, value, onChange, initial, ...unusedProps}) => (
    <MultiRow style={{marginBottom: 25}}>
        <Row style={{marginBottom: 0}}>
            <Label>{label}:</Label>
            <div style={styles.value}
                dangerouslySetInnerHTML={{
                    __html: value || '&mdash;'
                }}
            />
        </Row>
        <Row style={styles.sliderRow}>
            <Slider
                value={value}
                min={1}
                max={10}
                step={1}
                onChange={onChange}
            />
        </Row>
    </MultiRow>
)

export default SliderRow
