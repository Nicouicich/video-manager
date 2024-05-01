export class UsernameAlreadyExistsException extends Error {
    constructor (value: string) { super(`Username ${value} already exists`); }
}

export class EmailAlreadyExistsException extends Error {
    constructor (value: string) { super(`Email ${value} already exists`); }
}