import validateFormDataParameter from '@libs/validateFormDataParameter';
import type PrepareRequestPayload from './types';

type PersistedFile = {
    uri?: string;
    source?: string;
    name?: string;
    type?: string;
};

function isPersistedFile(value: unknown): value is PersistedFile {
    return (
        !!value &&
        typeof value === 'object' &&
        !(value instanceof Blob) &&
        (('uri' in value && typeof value.uri === 'string') || ('source' in value && typeof value.source === 'string'))
    );
}

/**
 * Prepares the request payload (body) for a given command and data.
 */
const prepareRequestPayload: PrepareRequestPayload = async (command, data) => {
    const formData = new FormData();

    for (const key of Object.keys(data)) {
        const value = data[key];

        if (value === undefined) {
            continue;
        }

        if ((key === 'file' || key === 'receipt') && isPersistedFile(value)) {
            const filePath = value.uri ?? value.source;
            if (!filePath) {
                continue;
            }

            const response = await fetch(filePath);
            const blob = await response.blob();
            const file = new File([blob], value.name ?? 'upload', {
                type: value.type || blob.type || 'application/octet-stream',
            });

            validateFormDataParameter(command, key, file);
            formData.append(key, file);
            continue;
        }

        validateFormDataParameter(command, key, value);
        formData.append(key, value as string | Blob);
    }

    return formData;
};

export default prepareRequestPayload;
