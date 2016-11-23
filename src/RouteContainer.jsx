import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router'

import Layout from './Layout.jsx'
import Index from './pages/Index.jsx'
import Login from './pages/Login.jsx'
import Task from './pages/Task.jsx'
import Profile from './pages/Profile.jsx'
/*
import TaskContainer from './TaskContainer.jsx'
import Layout from './Layout.jsx'
import NotFound from './NotFound.jsx'
import Login from './Login.jsx'
import GroupsContainer from './GroupsContainer.jsx'
import GroupPage from './GroupPage.jsx'
import Invite from './Invite.jsx'
*/

class RouteContainer extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={Layout}>
          <Route path="/" component={Index} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/task/:id" component={Task} />
        </Route>
      </Router>
    )
  }
}

/*

<Route path="/" component={TaskContainer} />
          <Route path="/groups" component={GroupsContainer} />
          <Route path="/login" component={Login} />
          <Route path="/invite/:invite" component={Invite} />
          <Route path="/group/:groupId" component={GroupPage}/>
          <Route path="*" component={NotFound} />

*/
export default RouteContainer
