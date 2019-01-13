import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

import styles from './checkbox.scss';

function Checkbox({ onChange, checked, children, className }) {

    return (
        <label className={classNames(className, styles.wrapper)}>
            <input
                className={styles.input}
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />

            <div className={styles.checkbox}>
                <span className={styles.checkMark}>&#10004;</span>
            </div>

            <div className={styles.label}>{children}</div>
        </label>
    );
}

Checkbox.propTypes = {
    checked: propTypes.bool.isRequired,
    children: propTypes.node,
    disabled: propTypes.bool,
    onChange: propTypes.func,
    className: propTypes.string
};

Checkbox.defaultProps = {
    disabled: false,
    children: null,
    onChange: () => {},
    className: ''
};

export default Checkbox;