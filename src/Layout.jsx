import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { indigo700 } from 'material-ui/styles/colors'
import { AppBar } from 'material-ui'

import AppDrawer from './components/AppDrawer.jsx'


import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// Setup theme
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: indigo700,
  },
  appBar: {
    height: 50,
  },
})

// Layout
class Layout extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <AppDrawer ref={c => this._drawer = c}/>
          <AppBar
            onLeftIconButtonTouchTap={() => this._drawer.open() }
            title="GCI Task Manager"
          />
          <div>
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
export default Layout
