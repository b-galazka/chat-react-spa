import React from 'react';
import PropTypes from 'prop-types';

function LoadingAnimation({width, height, color, thickness}) {

    return (
        <svg
            width={width}
            height={height}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            className="uil-ring"
        >
            <rect
                x="0"
                y="0"
                width="100"
                height="100"
                fill="none"
                className="bk"
            >
            </rect>

            <defs>
                <filter
                    id="uil-ring-shadow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                >
                    <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0"></feOffset>
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="0"></feGaussianBlur>
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
                </filter>
            </defs>
            <path
                d={`M10 50A40 40 0 0 0 90 50A40 4${thickness} 0 0 1 10 50`}
                fill={color}
                filter="url(#uil-ring-shadow)"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    repeatCount="indefinite"
                    dur="1s"
                >
                </animateTransform>
            </path>
        </svg>
    );
}

LoadingAnimation.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    color: PropTypes.string,
    thickness: PropTypes.number
};

LoadingAnimation.defaultProps = {
    width: '120px',
    height: '120px',
    color: '#346bf7',
    thickness: 2
};

export default LoadingAnimation;