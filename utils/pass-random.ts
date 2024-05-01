import * as crypto from 'crypto';

export function generateRandomPassword(): string {
    const length = 10;
    const randomString = crypto.randomBytes(Math.ceil((length - 2) / 2)).toString('hex');
    const specialCharacters = '!@#$%^&*()_-+=';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const randomSpecialCharacter = specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    const randomUppercaseLetter = uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];

    const insertAt = (str: string, sub: string, pos: number) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

    let password = insertAt(randomString, randomSpecialCharacter, Math.floor(Math.random() * randomString.length));
    password = insertAt(password, randomUppercaseLetter, Math.floor(Math.random() * password.length));

    return password.slice(0, length);
}