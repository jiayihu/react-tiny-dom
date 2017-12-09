import React from 'react';
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import { debugMethods } from '../utils/debug-methods';

function isUppercase(letter) {
  return /[A-Z]/.test(letter);
}

function isEventName(propName) {
  return propName.startsWith('on') && window.hasOwnProperty(propName.toLowerCase());
}

const hostConfig = {
  // appendChild for direct children
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

      if (propName === 'children') {
        // Set the textContent only for literal string or number children, whereas
        // nodes will be appended in `appendChild`
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = propValue;
        }
      } else if (propName === 'className') {
        domElement.setAttribute('class', propValue);
      } else if (isEventName(propName)) {
        const eventName = propName.toLowerCase().replace('on', '');
        domElement.addEventListener(eventName, propValue);
      } else {
        domElement.setAttribute(propName, propValue);
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
    const uniqueProps = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
    const changedProps = Array.from(uniqueProps).filter(propName => {
      // Children changes is handled by the other methods like `commitTextUpdate`
      const isChildren = propName === 'children';
      const isChanged = oldProps[propName] !== newProps[propName];

      return !isChildren && isChanged;
    });

    return changedProps;
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

    // appendChild to root container
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
      updatePayload.forEach(propName => {
        if (newProps[propName] !== null && newProps[propName] !== undefined) {
          domElement.setAttribute(propName, newProps[propName]);
        } else {
          if (isEventName(propName)) {
            const eventName = propName.toLowerCase().replace('on', '');
            domElement.removeEventListener(eventName, oldProps[propName]);
          } else {
            domElement.removeAttribute(propName);
          }
        }
      });
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

const TinyDOMRenderer = Reconciler(
  debugMethods(hostConfig, ['now', 'getChildHostContext', 'shouldSetTextContent'])
);

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
