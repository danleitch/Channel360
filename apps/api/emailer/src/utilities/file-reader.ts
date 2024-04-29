import { promises as fs } from "fs";

export const readHTMLFile = async(path: string): Promise<string> => {
    try {
        return await fs.readFile(path, 'utf8');
    } catch (err) {
        console.error("Error reading email template:", err);
        throw new Error("Failed to read email template");
    }
}