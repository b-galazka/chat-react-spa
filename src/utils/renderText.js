export default function renderText(template, variables = {}) {

    const variablePlaceholder = /{\w+}/g;

    return template.replace(variablePlaceholder, (match) => {

        const variable = match.slice(1, -1);

        if (variables.hasOwnProperty(variable)) {

            return String(variables[variable]);
        }

        return match;
    });
}