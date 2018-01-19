import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import * as Button from 'react-bootstrap/lib/Button';
import * as React from 'react';

export class PeriodButtons extends React.Component {
  render() {
    return (
      <ButtonGroup>
        <Button>Week</Button>
        <Button>Month</Button>
        <Button>Quarter</Button>
        <Button>Year</Button>
        <Button>Max</Button>
      </ButtonGroup>
    )
  }
}