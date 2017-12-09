import React from 'react';
import { ReactTinyDOM } from './renderer/tiny-dom';

class HelloWorld extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 0,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      value: this.state.value + 1,
    });
  }

  render() {
    return (
      <div className="container text-center pt-5" tabIndex={this.state.value}>
        <h1>react-tiny-dom</h1>
        <p>Counter: {this.state.value}</p>
        <p>
          <button onClick={this.handleClick} class="btn btn-outline-primary">
            Primary
          </button>
        </p>
      </div>
    );
  }
}

ReactTinyDOM.render(<HelloWorld />, document.querySelector('.root'));
