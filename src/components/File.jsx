import React, { Component } from 'react'

class File extends Component {
  render() {
    return (
      <div className="File">
        <a target="_blank" href={`http://brlcad.org/gci/data/${this.props.file.path}`}> {this.props.file.name} </a>
      </div>
    )
  }
}

export default File
