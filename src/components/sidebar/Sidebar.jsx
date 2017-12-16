import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {logout} from '../../actions/entireStore';

import strings from './strings';

import './sidebar.scss';

function mapStateToProps(state) {

    const {users} = state.users;
    const {tokenData} = state.auth;

    return {
        users,
        username: tokenData.username
    };
}

function mapDispatchToProps(dispatch) {

    return {
        logout: bindActionCreators(logout, dispatch)
    };
}

class Sidebar extends Component {

    constructor() {

        super();

        this.state = {
            searchFieldValue: ''
        };

        this.updateSearchFieldValue = this.updateSearchFieldValue.bind(this);
    }

    render() {

        const {onlineUsersSectionTitle, offlineUsersSectionTitle} = strings;
        
        const onlineUsers = this.getUsers(true);
        const offlineUsers = this.getUsers(false);

        return (
            <section className="sidebar">
                <button
                    className="button button--logout"
                    onClick={this.props.logout}
                >
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
                    onChange={this.updateSearchFieldValue}
                    placeholder={strings.searchFieldPlaceholder}
                />
            </header>
        );
    }

    renderUsers(users, sectionTitle) {

        const usersListItems = users.map(user => (
            <li key={user._id}>{user.username}</li>
        ));

        return (
            <section className="users__wrapper">
                <h2 className="users__title">
                    {sectionTitle} ({users.length})
                </h2>

                {
                    (users.length === 0) ?

                    <p className="users__empty-list">
                        {strings.emptyUsersListMsg}
                    </p> :

                    <ul className="users__list">
                        {usersListItems}
                    </ul>
                }

            </section>
        );
    }

    updateSearchFieldValue({target}) {

        const {value} = target;

        this.setState({
            searchFieldValue: value
        });
    }

    getUsers(connected) {

        const {users, username} = this.props;
        const searchQuery = this.state.searchFieldValue.trim();

        return users.filter(user => (
            user.connected === connected &&
            user.username.includes(searchQuery) &&
            user.username !== username
        ));
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);