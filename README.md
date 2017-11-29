# react-tiny-dom (WIP)

`react-tiny-dom` is a minimal implementation of [react-dom](https://reactjs.org/docs/react-dom.html) as custom renderer using React 16 official Renderer API.

The purpose of this project is to show the meaning of each method of the `ReconcilerConfig` passed to [react-reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler), by using a practical yet familiar environment: the browser DOM.

## What's supported

- Custom components
- Text nodes
- HTML Attributes
- `setState` with updates on Text Nodes

## What's not supported yet

- Web Components
- `style` attribute
- Update of HTML Attributes

## Installation

```
npm install
npm start # Runs the example using react-tiny-dom
```
