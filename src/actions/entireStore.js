import { CLEAR_STORE } from './types/entireStore';

export function clearStore() {

    return {
        type: CLEAR_STORE
    };
}