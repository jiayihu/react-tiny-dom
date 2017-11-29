import React from 'react';
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import { debugMethods } from '../utils/debug-methods';

const hostConfig = {
  // appendChild for direct children of the root
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child);
  },

  // Create the DOMElement, but attributes are set in `finalizeInitialChildren`
  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    return document.createElement(type);
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    return document.createTextNode(text);
  },

  // Actually set the attributes and text content to the domElement and check if
  // it needs focus, which will be eventually set in `commitMount`
  finalizeInitialChildren(domElement, type, props) {
    // Set the prop to the domElement
    Object.keys(props).forEach(propName => {
      const propValue = props[propName];

      switch (propName) {
        case 'children':
          // Set the textContent only for literal string or number children, whereas
          // nodes will be appended in `appendChild`
          if (typeof propValue === 'string' || typeof propValue === 'number') {
            domElement.textContent = propValue;
          }
          break;
        case 'className':
          domElement.setAttribute('class', propValue);
          break;
        default:
          domElement.setAttribute(propName, propValue);
          break;
      }
    });

    // Check if needs focus
    switch (type) {
      case 'button':
      case 'input':
      case 'select':
      case 'textarea':
        return !!props.autoFocus;
    }

    return false;
  },

  // Useful only for testing
  getPublicInstance(inst) {
    return inst;
  },

  // Commit hooks, useful mainly for react-dom syntethic events
  prepareForCommit() {},
  resetAfterCommit() {},

  // Calculate the updatePayload
  prepareUpdate(domElement, type, oldProps, newProps) {
    // Return a diff between the new and the old props, children excluded
    return [];
  },

  getRootHostContext(rootInstance) {
    return emptyObject;
  },
  getChildHostContext(parentHostContext, type) {
    return emptyObject;
  },

  shouldSetTextContent(type, props) {
    return (
      type === 'textarea' ||
      typeof props.children === 'string' ||
      typeof props.children === 'number'
    );
  },

  now: () => {
    // noop
  },

  useSyncScheduling: true,

  mutation: {
    appendChild(parentInstance, child) {
      parentInstance.appendChild(child);
    },

    appendChildToContainer(parentInstance, child) {
      parentInstance.appendChild(child);
    },

    removeChild(parentInstance, child) {
      parentInstance.removeChild(child);
    },

    removeChildFromContainer(parentInstance, child) {
      parentInstance.removeChild(child);
    },

    insertBefore(parentInstance, child, beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    },

    insertInContainerBefore(parentInstance, child, beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    },

    commitUpdate(domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
      console.log('-------------------');
      console.log(updatePayload);
    },

    commitMount(domElement, type, newProps, internalInstanceHandle) {
      domElement.focus();
    },

    commitTextUpdate(textInstance, oldText, newText) {
      textInstance.nodeValue = newText;
    },

    resetTextContent(domElement) {
      domElement.textContent = '';
    },
  },
};

const TinyDOMRenderer = Reconciler(debugMethods(hostConfig, ['now']));

export const ReactTinyDOM = {
  render(element, domContainer, callback) {
    let root = domContainer._reactRootContainer;

    if (!root) {
      // Remove all children of the domContainer
      let rootSibling;
      while ((rootSibling = domContainer.lastChild)) {
        domContainer.removeChild(rootSibling);
      }

      const newRoot = TinyDOMRenderer.createContainer(domContainer);
      root = domContainer._reactRootContainer = newRoot;
    }

    return TinyDOMRenderer.updateContainer(element, root, null, callback);
  },
};
