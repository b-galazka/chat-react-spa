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

            const { value } = target;

            this.setState({
                [inputName]: value
            });
        };
    }

    updateCheckboxValue(inputName) {

        return ({ target }) => {

            this.setState({
                [inputName]: target.checked
            });
        };
    }
}