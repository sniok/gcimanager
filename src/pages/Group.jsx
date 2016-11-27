import React, { Component } from 'react'

import Banner from '../components/Banner.jsx'
import Content from '../components/Content.jsx'
import GroupView from '../components/GroupView.jsx'

import { CircularProgress } from 'material-ui'

import firebase from '../db/firebase.js'

class Group extends Component {

  constructor(props){
    super(props)

    this.state = {
      group: undefined,
      loading: true,
    }
  }

  componentWillMount() {
    firebase.database().ref(`/groups/${this.props.params.id}`).once('value').then(snap => {
      this.setState({
          group: snap.val(),
          loading: false
      })
    })
  }

  render () {
    return(
      <div>
        <Banner title="Group" />
        <Content>
          { this.state.loading ?
            <div style={{width:50,margin:"20px auto"}}>
                <CircularProgress
                    size={50}
                    thickness={4}
                />
            </div>
          :
            <GroupView group={this.state.group} />}
        </Content>
      </div>
    )
  }
}

export default Group;
