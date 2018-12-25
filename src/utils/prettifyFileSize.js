import i18n from '../i18n';

function roundBytes(bytes, precision = 2) {

    const multiplier = 10 ** precision;

    return Math.round(bytes * multiplier) / multiplier;
}

export default function prettifyFileSize(size) {

    const kilobyte = 1024;
    const megabyte = kilobyte ** 2;
    const gigabyte = kilobyte ** 3;

    let sizeUnit = 'B';
    let sizeInNewUnit = size;

    if (size >= gigabyte) {

        sizeInNewUnit = size / gigabyte;
        sizeUnit = 'GB';

    } else if (size >= megabyte) {

        sizeInNewUnit = size / megabyte;
        sizeUnit = 'MB';

    } else if (size >= kilobyte) {

        sizeInNewUnit = size / kilobyte;
        sizeUnit = 'KB';
    }

    sizeUnit = i18n.t(`fileSizeUnits.${sizeUnit}`);

    return `${roundBytes(sizeInNewUnit)} ${sizeUnit}`;
}