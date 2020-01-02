import React, { Component } from 'react'

import Hubx from 'hubx'
import { withHubx } from 'hubx'


class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      users:["Suzanne Weeks","Sullivan Sanford"]
    }
    this.selectName = this.selectName.bind(this);
  }

  selectName(name){
    this.props.notify("select-user-event",name)
  }

  render(){
    return (
      <div>
        {this.state.users.map((u,i)=><button onClick={()=>this.selectName(u)} key={i}>{u}</button>)}
      </div>
    )
  }
}


class UserProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      user:""
    }
    this.receiveUser = this.receiveUser.bind(this);
    this.props.attach("select-user-event",this.receiveUser)
  }

  receiveUser(user){
    this.setState({user:user})
  }

  render(){
    return (
      <div>
        Name: {this.state.user}
      </div>
    )
  }
}

const UserX = withHubx(User);
const UserProfileX = withHubx(UserProfile);




export default class App extends Component {
  render () {
    return (
      <div>
        <div>
          <UserX/>
          <br/>
          <UserProfileX/>
        </div>
      </div>
    )
  }
}
