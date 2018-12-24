export default function datePropValidator(errorMessage) {

    return (props, propName) => {

        const propValue = props[propName];

        if (propValue && new Date(propValue).toString() === 'Invalid Date') {

            return new Error(errorMessage);
        }
    };
}