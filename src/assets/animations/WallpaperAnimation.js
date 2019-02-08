
import React, { Component } from 'react';
import { Animated } from 'react-native';

export default class WallpaperAnimation extends Component {
    constructor() {
        super();
        this.state = {
            scaleValue: new Animated.Value(1)
        }
    }
    componentDidMount() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(
                    this.state.scaleValue,
                    {
                        toValue: 1.5,
                        duration: 4500
                    }
                ),
                Animated.timing(
                    this.state.scaleValue,
                    {
                        toValue: 1,
                        duration: 4500
                    }
                )
            ])
        ).start()
    }

    render() {
        return (
            <Animated.View style={{ ...this.props.style, transform: [{ scale: this.state.scaleValue }] }}>
                {this.props.children}
            </Animated.View>
        )
    }
}
