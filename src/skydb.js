import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import crypto from "crypto-js";

const client = new SkynetClient("https://siasky.net");
const dataKey = `dataKey`;

const encryptPayload = async (string, seed) => {
    return crypto.AES.encrypt(string, seed).toString();
}

const decryptPayload = async (string, seed) => {
    const bytes  = crypto.AES.decrypt(string, seed);
    return bytes.toString(crypto.enc.Utf8);
}

export const fetchPasswords = async (seed) => {
    const publicKey = genKeyPairFromSeed(seed).publicKey;
    let data = '';

    try {
        if (!data) {
            const response = await client.db.getJSON(publicKey, dataKey);
            data = response.data;
        }

        return JSON.parse(await decryptPayload(data, seed));
    } catch (error) {
        return [];
    }
};

export const updatePasswords = async (items, seed) => {
    const privateKey = genKeyPairFromSeed(seed).privateKey;

    try {
        const encryptedPayload = await encryptPayload(JSON.stringify(items), seed);
        return await client.db.setJSON(privateKey, dataKey, encryptedPayload);
    } catch (error) {
        console.error('Failed to publish...', error);
        throw Error("Failed to publish updated payload")
    }
};