import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';

class FadeInView extends Component {
    state = {
        fadeAnim: new Animated.Value(0),
    }

    componentDidMount() {
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 1,
                duration: this.props.duration,
                delay: this.props.delay
            }
        ).start();
    }
    render() {
        let { fadeAnim } = this.state;
        return (
            <Animated.View style={{ ...this.props.style, opacity: fadeAnim }}>
                {this.props.children}
            </Animated.View>
        )
    }
}

export default FadeInView;