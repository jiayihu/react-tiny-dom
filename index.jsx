import React from 'react';
import { ReactTinyDOM } from './renderer/tiny-dom';

function Card(props) {
  return (
    <div className="card" style={{ padding: '1rem', margin: '0 auto', width: '20rem' }}>
      <img
        className="card-img-top"
        src="https://s3-us-west-2.amazonaws.com/cosmicjs/9c2d95d0-27b0-11e7-b6ae-8108cf4caa96-react.svg"
        alt="React tiny DOM"
        style={{ height: '10rem' }}
      />
      <div className="card-body">
        <h4 className="card-title">{props.title}</h4>
        <p className="card-text">{props.children}</p>
        <button onClick={props.onClick} className="btn btn-outline-primary">
          {props.buttonText}
        </button>
      </div>
    </div>
  );
}

class HelloWorld extends React.Component {
  state = {
    counter: 0,
  };

  handleClick = () => {
    console.clear(); // Clear the console to show only new method calls
    this.setState({
      counter: this.state.counter + 1,
    });
  }

  render() {
    const isEven = this.state.counter % 2 === 0;
    const styles = {
      color: isEven ? '#673AB7' : '#F44336',
    };

    return (
      <div className="container text-center pt-5" style={styles}>
        <Card title="React tiny DOM" buttonText="Counter" onClick={this.handleClick}>
          <p>A minimal implementation of react-dom using react-reconciler APIs</p>
          <p>Counter: {this.state.counter}</p>
          <p>
            <button disabled={isEven} className="btn btn-light">
              I'm disabled based on the state.
            </button>
          </p>
        </Card>
      </div>
    );
  }
}

ReactTinyDOM.render(<HelloWorld />, document.querySelector('.root'));

/**
 * A more basic application to see and understand better the Renderer method calls in the console.
 */

// class HelloWorld extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       value: 0,
//     };

//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick() {
//     this.setState({
//       value: this.state.value + 1,
//     });
//   }

//   render() {
//     const styles = {
//       backgroundColor: this.state.value % 2 === 0 ? 'red' : 'green',
//     };

//     return (
//       <div className="container text-center pt-5" tabIndex={this.state.value} style={styles}>
//         <h1>react-tiny-dom</h1>
//         <p>Counter: {this.state.value}</p>
//         <p>
//           <button onClick={this.handleClick} className="btn btn-outline-primary">
//             Counter
//           </button>
//         </p>
//       </div>
//     );
//   }
// }
