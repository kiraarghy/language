import { createProgramOutput, variableStack } from "./utils";
import { print, add, sub, mul, iffy, div, concat } from "./standardLib";
import { Expression, ProgramOutput, Variables } from "./types";

/** Main entry point, will evaluate program expressions */
export const runProgram = (x: Expression[]): any => {
    const programOutput = createProgramOutput([]);
    const currentVariables = variableStack({});
    x.map((y, i, z) => {
        evalExpression(y as any, programOutput, currentVariables);
    });
    return programOutput.lines.join("\n");
};

/** Evaluates expressions passed to it */
const evalExpression = (
    x: Expression[],
    c?: ProgramOutput,
    v?: Variables
): any => {
    const expression = String(x[0]);
    const args = x.slice(1);
    switch (expression) {
        case "#if": {
            return iffy(args, c);
        }
        case "#def": {
            if (!!v && String(args[0]).match(/^\#[A-Za-z]+/g)) {
                v.addToStack(String(args[0]), evaluateArg(args[1], c, v));
                return;
            }
            break;
        }
        case "#fn": {
            const currentVariables = variableStack({});
            if (args[0]) {
                currentVariables.addToStack("#x", args[0]);
            }
            return args.slice(1);
        }
        case "#add": {
            return add(evaluateArgs(args, c, v));
        }
        case "#mul": {
            return mul(evaluateArgs(args, c, v));
        }
        case "#sub": {
            return sub(evaluateArgs(args, c, v));
        }
        case "#div": {
            return div(evaluateArgs(args, c, v));
        }
        case "#str": {
            return concat(evaluateArgs(args, c, v));
        }
        case "#print": {
            !!c && print(evaluateArgs(args, c, v), c);
            return null;
        }
        case "#throw": {
            throw new Error(concat(evaluateArgs(args, c, v)));
        }
        default: {
            if (!!v) {
                const variable = v.stack[String(expression)];
                if (!variable) {
                    throw new Error(
                        `Undefined variable '${String(expression).slice(1)}'`
                    );
                }
                return variable.map((x: Expression) => evaluateArg(x, c, v));
            } else {
                throw new Error(`No case for expression: '${expression}'`);
            }
        }
    }
};

/** Takes arguments passed to `evalExpression` and evaluates those if Expressions, otherwise will return the arg values. */
const evaluateArgs = (x: Expression[], c?: ProgramOutput, v?: Variables) =>
    x.map(y => evaluateArg(y, c, v));

const evaluateArg = (
    x: Expression,
    c?: ProgramOutput,
    v?: Variables,
    cv?: Variables
): any => {
    if (Array.isArray(x)) {
        return evalExpression(x as any, c, v);
    }
    if (!!v && String(x) !== "#print" && String(x).match(/^\#[A-Za-z]+/g)) {
        const variable = v.stack[String(x)];
        if (!variable) {
            throw new Error(`Undefined variable '${String(x).slice(1)}'`);
        }
        return variable;
    } else {
        return x;
    }
};

export { evalExpression, evaluateArg, evaluateArgs };
