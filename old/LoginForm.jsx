import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Template } from 'meteor/templating'
import { Blaze } from 'meteor/blaze'

class LoginForm extends Component {
  componentDidMount () {
    this.view = Blaze.renderWithData(Template.atForm,
      { state: 'signIn' },
      ReactDOM.findDOMNode(this.refs.container))
  }
  componentWillUnmount () {
    Blaze.remove(this.view)
  }
  render () {
    return <span ref="container" />
  }
}

export default LoginForm
