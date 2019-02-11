export default function getFileBinaryData(file) {

    return new Promise((resolve, reject) => {

        const fileReader = new FileReader();

        const handleSuccess = ({ target }) => {

            resolve(target.result);

            fileReader.removeEventListener('load', handleSuccess);
        };

        const handleError = (err) => {

            reject(err);

            fileReader.removeEventListener('error', handleError);
        };

        fileReader.addEventListener('load', handleSuccess);
        fileReader.addEventListener('error', handleError);
        fileReader.readAsArrayBuffer(file);
    });
}