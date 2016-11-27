import React, { Component } from 'react'

class GroupView extends Component {
  render () {
    return(
      <div>
        <h2>{this.props.group.name}</h2>
        <h3>Description</h3>
        <p>{this.props.group.description}</p>
        <h3>Tasks</h3>
        empty
        <h3>Comments</h3>
        empty
      </div>
    )

  }
}

export default GroupView;
