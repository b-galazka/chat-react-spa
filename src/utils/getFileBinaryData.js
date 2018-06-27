export default function getFileBinaryData(file) {

    return new Promise((resolve, reject) => {

        const fileReader = new FileReader();

        fileReader.addEventListener('load', ({ target }) => {

            resolve(target.result);
        });

        fileReader.addEventListener('error', (err) => reject(err));

        fileReader.readAsArrayBuffer(file);
    });
}