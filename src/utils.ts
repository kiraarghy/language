import { Variables, ProgramOutput } from "./types";

/** Creates a program output, similar to how the console object works in JS */
const createProgramOutput = (initialOuput: string[]): ProgramOutput => {
    return {
        lines: initialOuput,
        addToOutput: function(x: string) {
            this.lines.push(x);
        }
    };
};

/** Creates a closure of variables created by the `#def` expression */
const variableStack = (initialStack: { [key: string]: any }): Variables => {
    return {
        stack: initialStack,
        addToStack: function(key: string, val: unknown) {
            this.stack[key] = val;
        }
    };
};

export { variableStack, createProgramOutput };
