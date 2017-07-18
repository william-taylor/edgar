
import * as childProcess from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';

import { EdgarConfig } from './types';

export const start = (path: string, script: string, callback?: Function) => {
    childProcess.exec(script, { cwd: path }, (err, stdout, stderr) => {
        if (err instanceof Error) {
            console.error(err);
            throw err;
        }

        if (callback) {
            callback();
        }
    });
};

export const decrypt = (json: any) => {
    const parse = (key: string, text: string) => {
        const decipher = crypto.createDecipher('aes-256-ctr', key);
        let dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    const key = process.argv.slice(-1)[0];
    json.username = parse(key, json.username);
    json.password = parse(key, json.password);
    json.host = parse(key, json.host);
    return json;
}

export const read = (fn: string): EdgarConfig => {
    const contents = fs.readFileSync(fn);
    return JSON.parse(contents.toString());
}