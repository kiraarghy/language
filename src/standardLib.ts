import { Expression, ProgramOutput } from "./types";
import { evaluateArg } from "./index";

const print = (x: Expression[], c: ProgramOutput): void => {
    if (x[0] === undefined) {
        return;
    }
    let string = String(x[0]);
    for (let step = 1; step < x.length; step++) {
        string = string.concat(String(x[step]));
    }
    c.addToOutput(string);
};

const add = (x: Expression[]): number => {
    let number = Number(x[0]);
    for (let step = 1; step < x.length; step++) {
        number = number + Number(x[step]);
    }
    return number;
};

const sub = (x: Expression[]): number => {
    let number = Number(x[0]);
    for (let step = 1; step < x.length; step++) {
        number = number - Number(x[step]);
    }
    return number;
};

const mul = (x: Expression[]): number => {
    let number = Number(x[0]);
    for (let step = 1; step < x.length; step++) {
        number = number * Number(x[step]);
    }
    return number;
};
const div = (x: Expression[]): number => {
    let number = Number(x[0]);
    for (let step = 1; step < x.length; step++) {
        number = number / Number(x[step]);
    }
    return number;
};

const concat = (x: Expression[]): string => {
    let concatenatedString = "";

    for (let step = 0; step < x.length; step++) {
        concatenatedString = concatenatedString.concat(String(x[step]));
    }
    return concatenatedString;
};

const iffy = (x: Expression[], c?: ProgramOutput): any => {
    return evaluateArg(evaluateArg(x[0]) ? x[1] : x[2], c);
};

export { iffy, concat, div, add, mul, sub, print };
