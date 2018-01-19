import * as React from 'react';
import './App.css';
import { PeriodButtons } from 'components/PeriodButtons/PeriodButtons';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <PeriodButtons/>
      </div>
    );
  }
}

export default App;
