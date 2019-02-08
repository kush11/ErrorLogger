import React from 'react';
import { View, StyleSheet } from 'react-native';

const wizardTab = (props) => {
    let currentStep = 0;
    let { children } = props;

    setCurrentStep = (step) => {
        currentStep = step;
    };

    goToNext = () => {
        this.setCurrentStep(++currentStep);
    };

    goToPrevious = () => {
        this.setCurrentStep(--currentStep)
    }

    return (
        <View style={styles.container}>
            {children[props.currentStepSelected]}
        </View>
    );
}

export default wizardTab;

const styles = StyleSheet.create({
    container: {
        margin: 5
    }
});
