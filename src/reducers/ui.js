import { MOBILE_SIDEBAR_TOGGLED } from '@src/actions/types/ui';
import { CLEAR_STORE } from '@src/actions/types/entireStore';

const initialState = {
    isMobileSidebarOpened: false
};

export default function authReducer(state = initialState, action) {

    switch (action.type) {

        case MOBILE_SIDEBAR_TOGGLED: {

            const { isMobileSidebarOpened } = state;

            return {
                ...state,
                isMobileSidebarOpened: !isMobileSidebarOpened
            };
        }

        case CLEAR_STORE: {

            return {
                ...initialState
            };
        }

        default: {

            return state;
        }
    }
}