declare module 'some-js-lib' {
  export interface LabelListProps {
    dataKey: string;
    position: string;
  }
  export class LabelList extends React.Component<LabelListProps> {}
}