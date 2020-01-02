# hubx

> Pubsub library to react

[![NPM](https://img.shields.io/npm/v/hubx.svg)](https://www.npmjs.com/package/hubx) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-hubx
```

## Usage

```jsx
import React, { Component } from 'react'

import {withHubx} from 'hubx'

class App extends Component {
  
  constructor(props){
    super(props)
    
    this.onClick = this.onClick.bind(this);
    this.updateState = this.updateState.bind(this);
    this.props.attach("my-topic",this.updateState)
  }

  updateState(number){
    this.setState(s => {
      s.number = number;
      return s;
    });
  }

  onClick(){
    this.props.notify("my-topic",Math.random());
  }
  
  render () {
    return (
      <div>
        {this.state.number}
        <button>Generate</button>
      </div>
    )
  }
}


export default  withHubx(App);
```

## License

MIT © [PMoneda](https://github.com/PMoneda)