import React, { Component } from 'react';
import propTypes from 'prop-types';

import animationsStyles from '@src/scss/animations.scss';

class Fading extends Component {

    get childFadingStyles() {

        const { showChildren, fadingDuration } = this.props;
        const { isAnimationFinished } = this.state;

        if (isAnimationFinished) {

            return {};
        }

        return {
            animationName: animationsStyles[showChildren ? 'fadeIn' : 'fadeOut'],
            animationDuration: `${fadingDuration}ms`,
            animationFillMode: 'forwards'
        };
    }

    constructor({ showChildren, animateOnInit }) {

        super();

        this.state = {
            shouldRenderChildren: animateOnInit || showChildren,
            isAnimationFinished: !animateOnInit
        };

        this.handleChildFadingAnimationEnd = this.handleChildFadingAnimationEnd.bind(this);
    }

    render() {

        if (!this.state.shouldRenderChildren) {

            return null;
        }

        const child = this.props.children;

        return (
            <child.type
                {...child.props}
                style={this.childFadingStyles}
                onAnimationEnd={this.handleChildFadingAnimationEnd}
            >
            </child.type>
        );
    }

    componentDidUpdate(prevProps) {

        this.handleChildrenVisibilityChange(prevProps);
    }

    handleChildrenVisibilityChange(prevProps) {

        const { showChildren } = this.props;

        if (showChildren === prevProps.showChildren) {

            return;
        }

        const stateChange = { isAnimationFinished: false };

        if (showChildren) {

            stateChange.shouldRenderChildren = true;
        }

        this.setState(stateChange);
    }

    handleChildFadingAnimationEnd() {

        const stateChange = { isAnimationFinished: true };
        const { showChildren } = this.props;

        if (!showChildren) {

            stateChange.shouldRenderChildren = false;
        }

        this.setState(stateChange);
    }
}

Fading.propTypes = {
    children: propTypes.node.isRequired,
    showChildren: propTypes.bool,
    fadingDuration: propTypes.number,
    animateOnInit: propTypes.bool
};

Fading.defaultProps = {
    showChildren: true,
    fadingDuration: 1000,
    animateOnInit: false
};

export default Fading;