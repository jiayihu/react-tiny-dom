import React from 'react';
import { ReactTinyDOM } from './renderer/tiny-dom';

class HelloWorld extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 0,
    };
  }

  componentDidMount() {
    window.setTimeout(() => {
      console.clear();
      this.setState({ value: this.state.value + 1 });
    }, 1000);
  }

  render() {
    return (
      <div className="container text-center pt-5" tabIndex={this.state.value}>
        <h1>I'm a component rendered by tiny-dom</h1>
        <p>Counter: {this.state.value}</p>
      </div>
    );
  }
}

ReactTinyDOM.render(<HelloWorld />, document.querySelector('.root'));
