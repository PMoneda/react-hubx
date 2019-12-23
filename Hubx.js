import React, { Component } from "react";

// Reference: https://en.wikipedia.org/wiki/Publish-subscribe_pattern;
// Reference: https://en.wikipedia.org/wiki/Mediator_pattern;
export class Hubx {
  constructor() {
    this.observers = {};
    this.buffer = {};
    this.mediators = {};
    this.isReplaying = false;
  }

  /**
   *
   * @param {string} event Nome do evento que será escutado
   * @param {function} observer Função de callback que será chamada
   * @param {boolean} withLastValue Caso seja true durante o attach caso tenha alguma mensagem na fila
   *  a última já é passada para o observer
   */

  attach(event, observer, withLastValue) {
    if (!this.observers[event]) {
      this.observers[event] = [];
      this.buffer[event] = [];
    }

    if (typeof observer === "undefined") {
      return;
    }

    this.observers[event].push(observer);

    if (withLastValue === true) {
      // Caso já tenha algo na fila já dispara o callback
      if (this.buffer[event] && this.buffer[event].length > 0) {
        setTimeout(() => {
          const last = this.buffer[event].length - 1;
          observer(this.buffer[event][last]);
        }, 1);
      }
    }
  }

  detach(event, observer) {
    if (!this.observers[event]) {
      return;
    }
    let index = -1;
    for (let i = 0; i < this.observers[event].length; i++) {
      if (this.observers[event][i] === observer) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      this.observers[event].splice(index, 1);
    }
  }

  detachAll(event) {
    if (!this.observers[event]) {
      return;
    }
    this.observers[event].length = 0;
  }

  detachAllWithPrefix(prefix) {
    const events = Object.keys(this.observers).filter(s =>
      s.startsWith(prefix)
    );
    events.forEach(e => (this.observers[e].length = 0));
  }

  attachMediator(address, callback) {
    if (!this.mediators[address]) {
      this.mediators[address] = [];
    }
    this.mediators[address].push(callback);
  }

  request(address, message) {
    if (!this.mediators[address]) {
      return new Promise((res, rej) => rej("address not registered!"));
    }
    return Promise.all(this.mediators[address].map(x => x(message)));
  }

  notify(event, message) {
    if (!this.observers[event]) {
      return;
    }
    this.buffer[event].pop();
    this.buffer[event].push(message);
    this.observers[event].forEach(observer => {
      setTimeout(function() {
        if (typeof observer === "function") {
          observer(message);
        }
      }, 1);
    });
  }

  replay(event, rollback) {
    if (this.buffer[event]) {
      const last = this.buffer.length - 1;
      for (let i = last - rollback; i <= last; i++) {
        this.notify(event, this.buffer[event][i]);
      }
    }
  }
}

export function withHubx(WrappedComponent) {
  if(!window.Hubx){
      window.Hubx = new Hubx();
  }
  return class extends Component {
    constructor(props) {
      super(props);
      this.attach = this.attach.bind(this);
      this.notify = this.notify.bind(this);
      this.toDetach = {};
    }

    attach(event, subscriber, withInitialValue) {
      if (!this.toDetach[event]) {
        this.toDetach[event] = [];
      }
      this.toDetach[event].push(subscriber);
      window.Hubx.attach(event, subscriber, withInitialValue);
    }

    detach(event, subscriber) {
      window.Hubx.detach(event, subscriber);
    }

    notify(event, message) {
      window.Hubx.notify(event, message);
    }

    request(address, message) {
      return window.Hubx.request(address, message);
    }

    componentWillUnmount() {
      Object.keys(this.toDetach).map(event => {
        return this.toDetach[event].forEach(e => {
          window.Hubx.detach(event, e);
        });
      });
    }
    render() {
      return (
        <WrappedComponent
          {...this.props}
          attach={this.attach}
          notify={this.notify}         
          request={this.request}
        />
      );
    }
  };
}
