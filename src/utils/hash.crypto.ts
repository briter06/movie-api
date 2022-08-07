import crypto from "crypto";

export const createHash = (data: string) => {
    const result = crypto.createHash('sha1').update(data).digest('hex');
    return result;
}