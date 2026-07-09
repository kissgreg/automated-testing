import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Initialize dotenv to load environment variables from the .env file into process.env
dotenv.config();

export interface Credentials {
    username: string;
    password: string;
}

export class ConfigManager {

    /**
     * Retrieves the URL for Sauce Demo
     */
    public static getSauceDemoUrl(): string {
        return this.getEnv('SAUCE_DEMO_URL');
    }

    /**
     * Retrieves the URL for Online HTML Editor
     */
    public static getHtmlEditorUrl(): string {
        return this.getEnv('HTML_EDITOR_URL');
    }

    /**
     * Retrieves the URL for Guru99 Demo Site
     */
    public static getGuru99Url(): string {
        return this.getEnv('GURU99_URL');
    }

    /**
     * Retrieves the URL for JSONPlaceholder
     */
    public static getApiUrl(): string {
        return this.getEnv('API_URL');
    }

    /**
     * Enforce required environment variables
     */
    private static getEnv(key: string): string {
        const value = process.env[key];
        if (!value || value.trim() === '') {
            throw new Error(`Configuration error: The environment variable "${key}" is missing or empty.`);
        }
        return value;
    }

    /**
     * Parses and returns credentials from the external JSON file
     * @returns Credentials object
     */
    public static getCredentials(): Credentials {
        const credentialPath = path.resolve(__dirname, '../../test/resources/credential.json');
        
        try {
            const rawData = fs.readFileSync(credentialPath, 'utf-8');
            return JSON.parse(rawData) as Credentials;
        } catch (error) {
            throw new Error(`Critical: Failed to read or parse credentials at '${credentialPath}'. Error: ${error}`);
        }
    }
}