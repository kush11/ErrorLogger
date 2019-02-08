import React, { Component } from 'react';
import { Animated } from 'react-native';

class SlideRightView extends Component {
    constructor() {
        super();
        this.state = {
            translateXValue: new Animated.Value(-300),
        }

    }
    componentDidMount() {
        Animated.timing(
            this.state.translateXValue,
            {
                toValue: 0,
                duration: 200
            }
        ).start();
    }

    render() {
        let { translateXValue } = this.state;
        return (
            <Animated.View style={{ ...this.props.style, flex: 1, transform: [{ translateX: translateXValue }] }}>
                {this.props.children}
            </Animated.View>
        )
    }
}

export default SlideRightView;