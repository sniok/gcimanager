import React, { Component } from 'react'

import { Paper } from 'material-ui'

const styles = {
    container: {
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        marginTop: -30,
    },
    paper: {
        margin: "0 5px 30px 5px",
        padding: 15,
    }
}

class Index extends Component { 
    render() {
        return (
            <div style={styles.container}>
                <Paper zDepth={1} style={styles.paper}>
                    {this.props.children}
                </Paper>
            </div>
        )
    }
}

export default Index