/**
 * Converts a data URL to a File object.
 * @param data_url A data URL string
 * @param filename A string representing the file name to use (default: "img.jpg")
 * @returns A File object representing the binary data
 */
export const dataURLToFile = (data_url: string, filename: string = "img.jpg"): File => {
    if (!data_url.includes(",")) {
        throw new Error("Invalid data URL");
    }

    const arr = data_url.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1]; // Extract MIME type from the data URL
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = n; i >= 0; i--) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    // Create and return a File object
    return new File([u8arr], filename, { type: mime });
};
