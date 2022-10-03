import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

function StackedProgressBar(props) {
    if (!props.data) {
        return (
            <ProgressBar max={100}>
                <ProgressBar variant="success" now={0} key={1}/>
                <ProgressBar variant="warning" now={100} key={2}/>
                <ProgressBar variant="danger" now={0} key={3}/>
                <ProgressBar variant="info" now={0} key={4}/>
            </ProgressBar>
        );
    }

    const {approved, pending, flag, invalid, total} = props.data;
    const approved_count = approved ? approved : 0;
    const pending_count = pending ? pending : 0;
    const flag_count = flag ? flag : 0;
    const invalid_count = invalid ? invalid : 0;

    return (
        <ProgressBar max={total}>
            <ProgressBar variant="success" now={approved_count} label={approved_count} key={1}/>
            <ProgressBar variant="warning" now={pending_count} label={pending_count} key={2}/>
            <ProgressBar variant="danger" now={flag_count} label={flag_count} key={3}/>
            <ProgressBar variant="info" now={invalid_count} label={invalid_count} key={4}/>
        </ProgressBar>
    );
}

export default StackedProgressBar;
