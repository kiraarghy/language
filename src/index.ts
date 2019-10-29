type Primitive = number | string | boolean | null;
interface List extends Array<Expression> {}
type Expression = Primitive | List;

type ProgramOutput = { lines: string[]; addToOutput: (x: string) => void };
type Variables = {
    stack: { [key: string]: any };
    addToStack: (key: string, val: any) => void;
};

export const runProgram = (x: Expression[]): any => {
    const programOutput = createProgramOutput([]);
    const currentVariables = variableStack({});
    x.map((y, i, z) => {
        evalExpression(y as any, programOutput, currentVariables);
    });

    const print = programOutput.lines.join("\n");
    return print;
};

export const evalExpression = (
    x: Expression[],
    c?: ProgramOutput,
    v?: Variables
): any => {
    const expression = x[0];
    const args = x.slice(1);
    if (expression === "#if") {
        return iffy(args, c);
    }
    if (expression === "#fn") {
        return args.slice(1);
    }
    if (
        expression === "#def" &&
        !!v &&
        String(args[0]).match(/^\#[A-Za-z]+/g)
    ) {
        v.addToStack(args[0] as string, evaluateArg(args[1], c, v));
        return;
    }
    const evaluatedArgs = args.map(arg => evaluateArg(arg, c, v));

    switch (expression) {
        case "#add": {
            return add(evaluatedArgs);
        }
        case "#mul": {
            return mul(evaluatedArgs);
        }
        case "#sub": {
            return sub(evaluatedArgs);
        }
        case "#div": {
            return div(evaluatedArgs);
        }
        case "#str": {
            return concat(evaluatedArgs);
        }
        case "#throw": {
            throw new Error(concat(evaluatedArgs));
        }
        case "#print": {
            !!c && print(evaluatedArgs, c);
            return null;
        }
        default: {
            if (!!v) {
                const variable = v.stack[String(expression)];
                if (!variable) {
                    throw new Error(
                        `Undefined variable '${String(x).slice(1)}'`
                    );
                }
                return variable.map((x: Expression) => evaluateArg(x, c, v));
            } else {
                throw new Error(`No case for expression: '${expression}'`);
            }
        }
    }
};

const evaluateArg = (x: Expression, c?: ProgramOutput, v?: Variables): any => {
    if (Array.isArray(x)) {
        return evalExpression(x as any, c, v);
    }
    if (!!v && x !== "#print" && String(x).match(/^\#[A-Za-z]+/g)) {
        const variable = v.stack[String(x)];
        if (!variable) {
            throw new Error(`Undefined variable '${String(x).slice(1)}'`);
        }
        return variable;
    } else {
        return x;
    }
};

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

const createProgramOutput = (initialOuput: string[]) => {
    return {
        lines: initialOuput,
        addToOutput: function(x: string) {
            this.lines.push(x);
        }
    };
};

const variableStack = (initialStack: { [key: string]: any }) => {
    return {
        stack: initialStack,
        addToStack: function(key: string, val: unknown) {
            this.stack[key] = val;
        }
    };
};
