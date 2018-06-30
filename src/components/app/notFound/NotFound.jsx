import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import renderText from 'utils/renderText';

import strings from './strings';
import baseStrings from '../strings';
import './notFound.scss';

export default class NotFound extends Component {

    render() {

        return (
            <div className="page page--not-found">
                <div className="page__wrapper--not-found">
                    <h1 className="page__title--not-found">{strings.notFoundTitle}</h1>
                    <p className="page__desc--not-found">{strings.notFoundMsg}</p>

                    <Link to="/" className="button button--homepage">
                        {strings.homepageButtonText}
                    </Link>
                </div>
            </div>
        );
    }

    componentDidMount() {

        this.updatePageTitle();
    }

    updatePageTitle() {

        const { pageTitle } = strings;

        document.title = renderText(baseStrings.pageTitle, { pageTitle });
    }
}