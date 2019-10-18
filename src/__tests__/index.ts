import { evalExpression, runProgram } from "../index";

describe("evalExpression", () => {
    describe("provides add function", () => {
        test("when adding 3 to 4 equals 7", () =>
            expect(evalExpression(["#add", 3, 4])).toBe(7));
        test("when adding 30 to 4 equals 34", () =>
            expect(evalExpression(["#add", 30, 4])).toBe(34));
        test("calling #add with #add does the right thing", () => {
            expect(evalExpression(["#add", ["#add", 1, 1], 1])).toBe(3);
            expect(evalExpression(["#add", 1, ["#add", 1, 1]])).toBe(3);
            expect(
                evalExpression(["#add", ["#add", 1, 1], ["#add", 1, 1]])
            ).toBe(4);
        });
    });
    describe("provides string function", () => {
        test("concats two string args", () =>
            expect(evalExpression(["#str", "hello ", "world"])).toBe(
                "hello world"
            ));
        test("concats three number args", () =>
            expect(evalExpression(["#str", 1, 2, 3])).toBe("123"));
        test("concats four or more mixed args ", () => {
            expect(evalExpression(["#str", 1, "two", 3, "four"])).toBe(
                "1two3four"
            );
        });
    });

    test("idk1", () => {
        expect(
            evalExpression([
                "#str",
                ["#str", ["#add", 1, 2, 3]],
                ["#add", 4, 5, 6]
            ])
        ).toBe("615");
    });

    test("idk2", () => {
        expect(
            evalExpression([
                "#mul",
                ["#div", 12, 3],
                ["#sub", 12, 3],
                ["#add", 12, 3]
            ])
        ).toBe(540);
    });

    test("idk3", () => {
        expect(() => evalExpression(["#throw", "oh no!"])).toThrowError(
            new Error("oh no!")
        );
        expect(() =>
            evalExpression(["#throw", ["#str", "very", "bad"]])
        ).toThrowError(new Error("verybad"));
    });

    test("if", () => {
        expect(evalExpression(["#if", true, "a", "b"])).toBe("a");
        expect(evalExpression(["#if", false, "a", "b"])).toBe("b");
        expect(evalExpression(["#if", true, "a", ["#throw", "oh no"]])).toBe(
            "a"
        );
        expect(evalExpression(["#if", ["#add", 1, 0], "a", "b"])).toBe("a");
        expect(evalExpression(["#if", ["#add", 1, -1], "a", "b"])).toBe("b");
    });
});

describe("runProgramme", () => {
    it("prints expected output", () => {
        const output = runProgram([
            ["#print", "hello, world!"],
            ["#str", "only print calls get added to the output"],
            ["#print", "1 + 1 = ", ["#add", 1, 1]],
            [
                "#if",
                true,
                ["#print", "they can be conditional too"],
                ["#throw", "drama"]
            ],
            ["#print", ["#print", "the #print fn itself returns null"]]
        ]);

        expect(output.split("\n")).toEqual([
            "hello, world!",
            "1 + 1 = 2",
            "they can be conditional too",
            "the #print fn itself returns null",
            "null"
        ]);
    });
});
