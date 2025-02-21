const { SUPPORTED_LANGUAGES } = require('../config/constants');

exports.translate = (text, source, destination) => {
    if (
        Object.keys(SUPPORTED_LANGUAGES).indexOf(source) === -1 ||
        Object.keys(SUPPORTED_LANGUAGES).indexOf(destination) === -1
    ) {
        return text;
    }

    if (source == destination) {
        return text;
    }

    source = SUPPORTED_LANGUAGES[source].indic_trans_code;
    destination = SUPPORTED_LANGUAGES[destination].indic_trans_code;

    return fetch('https://admin.models.ai4bharat.org/inference/translate', {
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sourceLanguage: source,
            targetLanguage: destination,
            input: text,
            task: 'translation',
            serviceId: 'ai4bharat/indictrans--gpu-t4',
            track: false
        }),
        method: 'POST'
    })
        .then((res) => res.json())
        .then((data) => data.output[0]?.target || text)
        .catch((e) => {
            console.log(e);
            return text;
        });
};
