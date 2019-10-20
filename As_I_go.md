# As I go.

## 18/OCT/2019

So I've created the basic `evalExpression` which allows the calling of expressions using the `[expression, ...args]` pattern.

E.g. #str will concat the various arguments into a final string.

However with the `#print` command we should be able to call the `runProgram` command. This allows the printing of the output of commands. However like when you call `console.log(console.log('I'm in danger'))` the output is:

```
I'm in danger
undefined
undefined
```

we want to have the `#print` command to output:

```
I'm in danger
null
null
```

This doesn't really work with `pure` functions, I can do the `null` printing thing but the final output would be something like:

```
I'm in danger
null
I'm in danger
null
```

as we'd be calling the `#print` command twice.

Soo we gotta introduce some memory into the application!

## UPDATE 18/OCT/2019

I think I need to write a class to do this, I am scared of classes.

## 20/OCT/2019

I did not have to use a class because I'm very clever!

```typescript
const callStack = (initialStack: string[]) => {
    return {
        stack: initialStack,
        addToStack: function(x: string) {
            this.stack.push(x);
        }
    };
};
```

My initial approach was to add this callStack to the `runProgram` function. However this means that every command evaluated by the function has a context of every other command called. I do not think this is optimal.

```typescript
const array = x.map((y, i, z) => {
    if (i === z.length - 1) {
        return evalExpression(y as any, currentCallStack);
    } else {
        return evalExpression(y as any[], currentCallStack).concat("\n");
    }
});
```

So maybe I need to try giving each evalExpression its own callStack?
