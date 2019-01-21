import { MOBILE_SIDEBAR_TOGGLED, GALLERY_OPENED, GALLERY_CLOSED } from '@src/actions/types/ui';
import { CLEAR_STORE } from '@src/actions/types/entireStore';

const initialState = {
    isMobileSidebarOpened: false,
    galleryImage: null
};

export default function authReducer(state = initialState, action) {

    const { payload } = action;

    switch (action.type) {

        case MOBILE_SIDEBAR_TOGGLED: {

            const { isMobileSidebarOpened } = state;

            return {
                ...state,
                isMobileSidebarOpened: !isMobileSidebarOpened
            };
        }

        case GALLERY_OPENED: {

            return {
                ...state,
                galleryImage: payload
            };
        }

        case GALLERY_CLOSED: {

            return {
                ...state,
                galleryImage: null
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