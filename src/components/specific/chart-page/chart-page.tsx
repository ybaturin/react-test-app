import * as React from 'react';
import * as _ from 'lodash';
import { PeriodButtons } from 'src/components/shared/period-buttons/period-buttons';
import { Period } from 'src/enums/period';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis, LabelList } from 'recharts';
import { ChartData, ChartDataPoint, ChartPageModel } from 'src/components/specific/chart-page/chart-page-model';
import './chart-page.css';
import Axios from 'axios';
import { MenuButton, MenuButtonItem } from 'src/components/shared/menu-button/menu-button';

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
  private isChartDataLoading = false;
  private chartPageModel: ChartPageModel;
  private chartData: ChartData = {
    attributes: [],
    series: {},
  };

  constructor(props: ChartPageProps) {
    super(props);

    this.state = {
      period: Period.Month,
      allAttributes: [],
      selectedAttribute: '',
      points: [],
    };

    this.chartPageModel = new ChartPageModel();
    this.loadChartData(this.state.period);
  }

  render() {
    const isDotsVisible = !this.isChartDataLoading &&
      _.includes([Period.Week, Period.Month, Period.Quarter], this.state.period);
    const isLabelsVisible = !this.isChartDataLoading && this.state.period === Period.Week;

    const menuItems = this.chartData.attributes.map((attr) => {
      return { name: attr, key: attr };
    });

    return (
      <div className="chart-page">
        <div>
          <PeriodButtons
            onPeriodSelect={(period) => this.onPeriodChanged(period)}
            startPeriod={this.state.period}
          />
        </div>
        <div className="chart-page__chart-container">
          {this.isChartDataLoading ? <div className="chart-page__loader"/> : ''}
          <div className="chart-page__attr-menu">
            <MenuButton
              items={menuItems}
              selectedKey={this.state.selectedAttribute}
              onSelect={((attr) => this.onAttrSelected(attr))}
            />
          </div>
          <div className="chart-page__chart">
            <LineChart
              width={this.props.width}
              height={this.props.height}
              data={this.chartData.series[this.state.selectedAttribute]}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
              <XAxis dataKey="date" interval="preserveEnd" minTickGap={15}/>
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Legend />
              <Line
                dot={isDotsVisible ? { stroke: 'gray', fill: 'gray', strokeWidth: 2 } : false}
                name={this.state.selectedAttribute}
                connectNulls={true}
                type="monotone"
                dataKey="value"
                stroke="gray"
                strokeWidth={2}
              >
                {isLabelsVisible ? <LabelList dataKey="value" position="top" /> : ''}
              </Line>
            </LineChart>
          </div>
        </div>
      </div>
    );
  }

  private onPeriodChanged(period: Period) {
    this.loadChartData(period);
    this.setState({ period });
  }

  private async loadChartData(period: Period) {
    this.isChartDataLoading = true;
    try {
      this.chartData = await this.chartPageModel.getChartData(period);
    } catch (error) {
      if (Axios.isCancel(error)) {
        return;
      }

      return alert(`Some error occured: ${error}`);
    } finally {
      this.isChartDataLoading = false;
    }
    // на случай, если в новой выборке по какой-то причине не окажется выбранного атрибута
    const selectedAttr = _.includes(this.chartData.attributes, this.state.selectedAttribute) ?
      this.state.selectedAttribute :
      this.chartData.attributes[0];

    this.setState({
      selectedAttribute: selectedAttr,
      allAttributes: this.chartData.attributes,
    });
  }

  private onAttrSelected(attr: MenuButtonItem) {
    this.setState({
      selectedAttribute: attr.key,
    });
  }
}