import fs from 'fs';
const filePath = './cookies.json';

let cookies = {
    rememberme: '',
    cgsession: ''
};

export const usedCookies: { cookie: string; session: string }[] = [];

export function setRememberme(value: string) {
    cookies.rememberme = value;
    saveCookiesToFile();
}

export function setCGSession(value: string) {
    cookies.cgsession = value;
    saveCookiesToFile();
}

export function getRememberme() {
    loadCookiesFromFile();
    return cookies.rememberme;
}

export function getCGSession() {
    loadCookiesFromFile();
    return cookies.cgsession;
}

function saveCookiesToFile() {
    fs.writeFileSync(filePath, JSON.stringify(cookies));
}

function loadCookiesFromFile() {
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        cookies = JSON.parse(fileData);
    }
}