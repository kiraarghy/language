type Primitive = number | string | boolean | null;
interface List extends Array<Expression> {}
type Expression = Primitive | List;
type ProgramOutput = { lines: string[]; addToOutput: (x: string) => void };
type Variables = {
    stack: { [key: string]: any };
    addToStack: (key: string, val: Expression) => void;
};

export { Expression, List, Primitive, ProgramOutput, Variables };
