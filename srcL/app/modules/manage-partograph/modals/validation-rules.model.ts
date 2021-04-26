import { BaseChartViewModel } from "@app/core/models/basegraph.model";

export class ValidationRuleParameter extends BaseChartViewModel {
  ChartName: string;
  Description: string;
  ModifiedMinValue: number;
  ModifiedMaxValue: number;
  SourceSystemID: number;
  DefaultMinValue: number;
  DefaultMaxValue: number;

}
