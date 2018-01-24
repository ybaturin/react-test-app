import * as React from 'react';
import { PeriodButtons } from 'src/components/shared/period-buttons/period-buttons';
import { Period } from 'src/enums/period';
import './chart-page.css';
import { CONST } from 'src/const';
import Axios from 'axios';
import * as moment from 'moment';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { LabelList } from 'some-js-lib'

const DATE_FORMAT = 'YYYY-MM-DD';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface ChartData {
  [key: string]: ChartDataPoint[];
}

interface ChartPageState {
  period: Period;
  selectedAttribute: string;
  allAttributes: string[];
  points: ChartDataPoint[];
}

interface ChartPageProps {
  width: number;
  height: number;
}

export class ChartPage extends React.Component<ChartPageProps, ChartPageState> {
  private chartData: ChartData = {};

  constructor(props: ChartPageProps) {
    super(props);
    this.state = {
      period: Period.Month,
      allAttributes: [],
      selectedAttribute: '',
      points: [],
    };

    this.loadChartData(this.state.period);
  }

  render() {
    return (
      <div className="chart-page">
        <PeriodButtons onPeriodSelect={(period) => this.loadChartData(period)} startPeriod={this.state.period}/>
        <div className="chart-page__chart">
          <LineChart
            width={this.props.width}
            height={this.props.height}
            data={this.chartData[this.state.selectedAttribute]}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}
          >
            <XAxis dataKey="date" interval="preserveEnd"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Line
              dot={{ stroke: 'gray', fill: 'gray', strokeWidth: 2 }}
              name={this.state.selectedAttribute}
              connectNulls={true}
              type="monotone"
              dataKey="value"
              stroke="gray"
              strokeWidth={2}
              label={true}
            >
              <LabelList dataKey="value" position="top"/>
            </Line>
          </LineChart>
        </div>
      </div>
    );
  }

  private async loadChartData(period: Period) {
    this.chartData = {};

    const startDate = this.getStartDateByPeriod(period);
    const response = await Axios.get(`https://www.quandl.com/api/v3/datasets/WIKI/FB/data.json`, {
      params: {
        apiKey: CONST.apiKey,
        start_date: startDate ? startDate.format(DATE_FORMAT) : null,
      }
    });

    const dataSet = response.data.dataset_data;
    const attributes = dataSet.column_names.slice(1);
    const data = dataSet.data.reverse();

    data.forEach((attrData: (string|number)[]) => {
      const date = attrData[0] as string;
      const values = attrData.slice(1);
      values.forEach((value: number, attrIndex: number) => {
        const attrName = attributes[attrIndex];
        this.chartData[attrName] = this.chartData[attrName] || [];
        const serie = this.chartData[attrName];
        serie.push({
          date,
          value
        });
      });
    });

    this.setState({
      selectedAttribute: this.state.selectedAttribute || attributes[0],
      allAttributes: attributes,
    });
  }

  private getStartDateByPeriod(period: Period): moment.Moment | null {
    switch (period) {
      case Period.Week:
       return moment().add(-1, 'weeks');

      case Period.Month:
       return moment().add(-1, 'months');

      case Period.Quarter:
        return moment().add(-1, 'quarters');

      case Period.Year:
        return moment().add(-1, 'years');

      default:
        return null;
    }
  }
}