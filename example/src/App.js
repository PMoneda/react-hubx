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
