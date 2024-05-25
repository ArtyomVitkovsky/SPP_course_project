
const base64ToBlob = (base64) => {
    if (!base64) return null;

    const binaryString = atob(base64.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return new Blob([uint8Array]);
};

const getDoc = (blob) => {
    if (!blob) return "";

    const url = URL.createObjectURL(blob);
    return url;
}

export const getDocument = (content) => {
    return getDoc(base64ToBlob(content));
}