import React, { Component } from 'react'
import { Drawer, MenuItem } from 'material-ui'
import { Link } from 'react-router'

import firebase from '../db/firebase'

const styles = {
  linkStyle : {
    textDecoration: "none"
  }
}

class AppDrawer extends Component {
    constructor(props) {
      super(props)

      this.state = {
        open: false,
        loggedIn: false,
      }
    }

    componentWillMount() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.setState({loggedIn:true})
        } else {
          this.setState({loggedIn:false})
        }
      });
    }

    open = () => {
      this.setState({open:true})
    }

    close = () => {
      this.setState({open:false})
    }

    logOut = () => {
      firebase.auth().signOut()
    }

    render() {
      return(
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <Link style={styles.linkStyle} to="/"><MenuItem onClick={this.close}>Search</MenuItem></Link>
          <Link style={styles.linkStyle} to="/groups"><MenuItem onClick={this.close}>Groups</MenuItem></Link>
          { this.state.loggedIn ?
            <div>
              <Link style={styles.linkStyle} to="/profile"><MenuItem onClick={this.close}>Profile</MenuItem></Link>
              <MenuItem onClick={this.logOut}>Log Out</MenuItem>
            </div> :
            <Link style={styles.linkStyle} to="/login"><MenuItem onClick={this.close}>Login</MenuItem></Link>
          }
        </Drawer>
      )
    }
}

export default AppDrawer
