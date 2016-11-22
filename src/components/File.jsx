import React, { Component } from 'react'

const styles = {
  file: {
    padding: "2px 0",
  }
}

class File extends Component {

  prettyFileName(name) {
    return name.split('-0800-')[1]
  }

  render() {
    return (
      <div style={styles.file} >
        <a target="_blank" href={`http://brlcad.org/gci/data/${this.props.file.path}`}>
          {this.prettyFileName(this.props.file.name)}
        </a>
      </div>
    )
  }
}

export default File
