import { Period } from 'src/enums/period';
import * as moment from 'moment';
import Axios, { CancelTokenSource } from 'axios';
import { CONST } from 'src/const';

export interface ChartDataPoint {
  date: string;
  value: number;
}

interface ChartSeries {
  [key: string]: ChartDataPoint[];
}

export interface ChartData {
  attributes: string[];
  series: ChartSeries;
}

const SERVER_DATE_FORMAT = 'YYYY-MM-DD';
const VIEW_DATE_FORMAT = 'DD.MM.YYYY';

export class ChartPageModel {
  private chartDataCancelToken: CancelTokenSource;

  async getChartData(period: Period): Promise<ChartData> {
    const series = <ChartSeries> {};
    const startDate = this.getStartDateByPeriod(period);

    if (this.chartDataCancelToken) {
      this.chartDataCancelToken.cancel();
    }
    this.chartDataCancelToken = Axios.CancelToken.source();
    const response = await Axios.get(`https://www.quandl.com/api/v3/datasets/WIKI/FB/data.json`, {
      params: {
        api_key: CONST.apiKey,
        start_date: startDate ? startDate.format(SERVER_DATE_FORMAT) : null,
      },
      cancelToken: this.chartDataCancelToken.token,
    });

    const dataSet = response.data.dataset_data;
    const attributes = dataSet.column_names.slice(1);
    const data = dataSet.data.reverse();

    data.forEach((attrData: (string|number)[]) => {
      const date = moment(attrData[0] as string, SERVER_DATE_FORMAT).format(VIEW_DATE_FORMAT);
      const values = attrData.slice(1);
      values.forEach((value: number, attrIndex: number) => {
        const attrName = attributes[attrIndex];
        series[attrName] = series[attrName] || [];
        const serie = series[attrName];
        serie.push({
          date,
          value
        });
      });
    });

    return <ChartData> {
      attributes,
      series
    };
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