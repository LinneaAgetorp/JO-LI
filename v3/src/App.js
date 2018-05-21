import React, { Component } from 'react';
import Login from './components/login'


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">

          <h1 className="App-title">DropboxInterface joli</h1>

        </header>
        <Login>
        </Login>
      </div>
    );
  }
}

export default App;
