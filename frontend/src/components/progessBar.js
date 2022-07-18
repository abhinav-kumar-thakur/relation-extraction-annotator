import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

function StackedProgressBar(props) {
  if (!props.data) {
      return (
          <ProgressBar max={100}>
              <ProgressBar striped variant="success" now={0} key={1} />
              <ProgressBar variant="warning" now={100}  key={2} />
              <ProgressBar striped variant="danger" now={0} key={3} />
          </ProgressBar>
      );
  }

  const data = props.data;
  const approved_count = data.approved ? data.approved : 0;
  const pending_count = data.pending ? data.pending : 0;
  const flag_count = data.flag ? data.flag : 0;

  return (
      <ProgressBar max={data.total}>
        <ProgressBar striped variant="success" now={approved_count} label={approved_count} key={1} />
        <ProgressBar variant="warning" now={pending_count}  label={pending_count} key={2} />
        <ProgressBar striped variant="danger" now={flag_count} label={flag_count} key={3} />
      </ProgressBar>
  );
}

export default StackedProgressBar;