import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import propTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import FormComponent from '@src/components/abstracts/FormComponent';
import { logout } from '@src/actions/auth';

import './sidebar.scss';

function mapStateToProps(state) {

    const { users } = state.users;
    const { username } = state.auth.user;

    return { users, username };
}

function mapDispatchToProps(dispatch) {

    return {
        logout: bindActionCreators(logout, dispatch)
    };
}

class Sidebar extends FormComponent {

    constructor() {

        super();

        this.state = { searchFieldValue: '' };
    }

    render() {

        const { t } = this.props;
        const onlineUsers = this.getUsers(true);
        const offlineUsers = this.getUsers(false);

        return (
            <section className="sidebar">
                <button className="button button--logout" onClick={this.props.logout}>
                    {t('sidebar.logoutButtonText')}
                </button>

                {this.renderSidebarHeader()}

                <section className="users">
                    {this.renderUsers(onlineUsers, t('sidebar.onlineUsersSectionTitle'))}
                    {this.renderUsers(offlineUsers, t('sidebar.offlineUsersSectionTitle'))}
                </section>
            </section>
        );
    }

    renderSidebarHeader() {

        const { t } = this.props;

        return (
            <header className="sidebar__header">
                <h1 className="sidebar__title">{t('sidebar.sidebarTitle')}</h1>

                <input
                    type="text"
                    className="sidebar__search-field"
                    value={this.state.searchFieldValue}
                    onChange={this.updateInputValue('searchFieldValue')}
                    placeholder={t('sidebar.searchFieldPlaceholder')}
                />
            </header>
        );
    }

    renderUsers(users, sectionTitle) {

        const { t } = this.props;

        const usersListItems = users.map(user => (
            <li key={user.id}>{this.renderUsername(user.username)}</li>
        ));

        return (
            <section className="users__wrapper">
                <h2 className="users__title">
                    {sectionTitle} ({users.length})
                </h2>

                {
                    (users.length === 0) ?

                        <p className="users__empty-list">{t('sidebar.emptyUsersListMsg')}</p> :

                        <ul className="users__list">{usersListItems}</ul>
                }

            </section>
        );
    }

    renderUsername(username) {

        const searchQuery = this.getSearchQuery();

        if (searchQuery === '') {

            return username;
        }

        const searchQueryRegex = new RegExp(searchQuery, 'gi');
        const splittedUsername = username.split(searchQueryRegex);
        const searchQueryMatches = username.match(searchQueryRegex);

        return splittedUsername.reduce((username, usernamePart, index) => {

            const searchQueryMatch = searchQueryMatches[index];

            username.push(usernamePart);

            if (searchQueryMatch) {

                username.push(
                    <span className='users__search-query-match' key={index}>
                        {searchQueryMatch}
                    </span>
                );
            }

            return username;

        }, []);
    }

    getUsers(connected) {

        const { users, username } = this.props;
        const searchQueryRegex = new RegExp(this.getSearchQuery(), 'gi');

        return users.filter(user => (
            user.connected === connected &&
            user.username.search(searchQueryRegex) > -1 &&
            user.username !== username
        ));
    }

    getSearchQuery() {

        return this.state.searchFieldValue.trim();
    }
}

Sidebar.propTypes = {
    // redux
    username: propTypes.string.isRequired,
    logout: propTypes.func.isRequired,

    users: propTypes.arrayOf(
        propTypes.shape({
            username: propTypes.string.isRequired,
            connected: propTypes.bool.isRequired
        })
    ).isRequired
};

Sidebar.defaultProps = {
    // redux
    userCreationError: null
};

export default compose(
    withNamespaces(),
    connect(mapStateToProps, mapDispatchToProps)
)(Sidebar);