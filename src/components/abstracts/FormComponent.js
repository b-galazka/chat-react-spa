import { Component } from 'react';

export default class FormComponent extends Component {

    constructor() {

        super();

        if (this.constructor === FormComponent) {

            throw new Error('Cannot create instance of abstract FormComponent class');
        }
    }

    updateInputValue(inputName) {

        return ({ target }) => {

            const value = (target.type === 'checkbox') ? target.checked : target.value;

            this.setState({
                [inputName]: value
            });
        };
    }
}