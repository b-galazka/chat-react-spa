import { MOBILE_SIDEBAR_TOGGLED, GALLERY_OPENED, GALLERY_CLOSED } from './types/ui';

export function toggleMobileSidebar() {

    return {
        type: MOBILE_SIDEBAR_TOGGLED
    };
}

export function openGallery(image) {

    return {
        type: GALLERY_OPENED,
        payload: image
    };
}

export function closeGallery() {

    return {
        type: GALLERY_CLOSED
    };
}