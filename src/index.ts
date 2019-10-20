type Primitive = number | string | boolean | null;
interface List extends Array<Expression> {}
type Expression = Primitive | List;

type CallStack = { stack: string[]; addToStack: (x: string) => void };

export const runProgram = (x: Expression[]): any => {
    const currentCallStack = callStack([]);

    const array = x.map((y, i, z) => {
        if (i === z.length - 1) {
            return evalExpression(y as any, currentCallStack);
        } else {
            return evalExpression(y as any[], currentCallStack).concat("\n");
        }
    });
    return evalExpression(["#str", ...array]);
};

export const evalExpression = (x: Expression[], c?: CallStack): any => {
    const expression = x[0];
    const args = x.slice(1);
    !!c && console.log(c.stack);
    if (!!c) {
        c.addToStack(String(expression));
    }
    if (expression === "#if") {
        return iffy(args);
    }
    const evaluatedArgs = args.map(arg => evaluateArg(arg, (c = undefined)));
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
            return print(evaluatedArgs, (c = undefined));
        }
        default: {
            throw new Error("No case for this expression");
        }
    }
};

const evaluateArg = (x: Expression, c?: CallStack): any => {
    if (Array.isArray(x)) {
        return evalExpression(x as any, c);
    } else {
        return x;
    }
};

const print = (x: Expression[], c?: CallStack): string => {
    console.log(c);
    let string = String(x[0]);
    for (let step = 1; step < x.length; step++) {
        string = string.concat(String(x[step]));
    }
    return string;
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

const iffy = (x: Expression[]): any => {
    return evaluateArg(evaluateArg(x[0]) ? x[1] : x[2]);
};

const callStack = (initialStack: string[]) => {
    return {
        stack: initialStack,
        addToStack: function(x: string) {
            this.stack.push(x);
        }
    };
};
