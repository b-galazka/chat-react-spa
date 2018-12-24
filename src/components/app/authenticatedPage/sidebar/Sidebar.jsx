import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import propTypes from 'prop-types';

import FormComponent from 'components/abstracts/FormComponent';

import { logout } from 'actions/auth';

import strings from './strings';

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

        const { onlineUsersSectionTitle, offlineUsersSectionTitle } = strings;

        const onlineUsers = this.getUsers(true);
        const offlineUsers = this.getUsers(false);

        return (
            <section className="sidebar">
                <button className="button button--logout" onClick={this.props.logout}>
                    {strings.logoutButtonText}
                </button>

                {this.renderSidebarHeader()}

                <section className="users">
                    {this.renderUsers(onlineUsers, onlineUsersSectionTitle)}
                    {this.renderUsers(offlineUsers, offlineUsersSectionTitle)}
                </section>
            </section>
        );
    }

    renderSidebarHeader() {

        return (
            <header className="sidebar__header">
                <h1 className="sidebar__title">{strings.sidebarTitle}</h1>

                <input
                    type="text"
                    className="sidebar__search-field"
                    value={this.state.searchFieldValue}
                    onChange={this.updateInputValue('searchFieldValue')}
                    placeholder={strings.searchFieldPlaceholder}
                />
            </header>
        );
    }

    renderUsers(users, sectionTitle) {

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

                        <p className="users__empty-list">{strings.emptyUsersListMsg}</p> :

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

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);