
import React, { Component } from 'react'

import Banner from '../components/Banner.jsx'
import Content from '../components/Content.jsx'
import GroupsTable from '../components/GroupsTable.jsx'

class Groups extends Component {
  render () {
    return (
      <div>
      <Banner title="Groups"/>
      <Content>
        <GroupsTable />
      </Content>
      </div>
    )
  }
}

export default Groups
