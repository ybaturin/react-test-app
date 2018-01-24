import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import * as Button from 'react-bootstrap/lib/Button';
import * as React from 'react';
import { Period } from 'src/enums/period';

interface PeriodButtonsState {
  period: Period;
}

interface PeriodButtonsProps {
  onPeriodSelect?: (period: Period) => void;
  startPeriod: Period;
}

export class PeriodButtons extends React.Component<PeriodButtonsProps, PeriodButtonsState> {
  // tslint:disable-next-line: no-any
  constructor(props: any) {
    super(props);
    this.state = { period: this.props.startPeriod };
  }

  onPeriodClick(period: Period) {
    if (period === this.state.period) {
      return;
    }

    this.setState({ period: period });
    if (this.props.onPeriodSelect) {
      this.props.onPeriodSelect(period);
    }
  }

  render() {
    const periods = [Period.Week, Period.Month, Period.Quarter, Period.Year, Period.Max];
    return (
      <ButtonGroup>
        {periods.map((period, i) => {
          return (
            <Button key={i} active={this.state.period === period} onClick={() => this.onPeriodClick(period)}>
              {period}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  }
}