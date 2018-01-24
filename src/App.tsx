import * as React from 'react';
import './App.css';
import { ChartPage } from 'src/components/specific/chart-page/chart-page';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <ChartPage width={800} height={400}/>
      </div>
    );
  }
}

export default App;
