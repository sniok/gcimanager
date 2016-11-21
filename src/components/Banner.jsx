import React, { Component } from 'react'

const styles = {
    banner: {
        width: "100%",
        height: 200,
        lineHeight: "200px",
        backgroundColor: "#2196F3",
    },
    h1: {
        fontWeight: 300,
        color: "#FFF",
        margin: 0,
        paddingLeft: 10,
    },
    container: {
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
    }
}

class Index extends Component { 
    render() {
        return (
            <div style={styles.banner}>
                <div style={styles.container}>
                <h1 style={styles.h1}>{this.props.title}</h1>
                </div>
            </div>
        )
    }
}

export default Index