
import React, { Component } from 'react'

import Banner from '../components/Banner.jsx'
import Content from '../components/Content.jsx'
import TaskView from '../components/TaskView.jsx'

import { CircularProgress } from 'material-ui'

import firebase from '../db/firebase.js'

class Task extends Component {

  constructor(props){
    super(props)
    this.state = {
      task: undefined
    }
  }

  componentWillMount() {
    firebase.database().ref(`/tasks/${this.props.params.id}`).on('value', snap => {
        this.setState({
            task: snap.val()
        })
    })
  }

  render () {
    return (
      <div>
        <Banner title="Task"/>
        <Content>
          { this.state.task ?
            <TaskView task={this.state.task} /> :
            <div style={{width:50,margin:"20px auto"}}>
                <CircularProgress
                    size={50}
                    thickness={4}
                />
            </div>
          }

        </Content>
      </div>
    )
  }
}

export default Task
