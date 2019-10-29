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

## 21/OCT/2019

So turns out I was wrong, giving each evalExpression its own callStack was bad as I needed to do a hypercomplicated process of returning each individual contexts to the parent `runProgram` call. This is kinda gnarly and overcomplicates a lot of stuff that should have been simple.

So question what does a `print` function do? It prints... So how about we have a parent context that all it cares about is what is being written to it by the child functions?

so parent context: ["beep", "boop"]

children: _write beep to context_ , _write boop to context_

This IS WAY SIMPLER my peeps!

So yeah there we have it, I also included a check to make sure our print context wasn't undefined!

I wonder if it does the same behaviour as when you:

```javascript
console.log(console.log("hi"), "there");
```

❌ it does not sadly, I will need to fix this!

## 22/Oct/2019

Talked to my colleague Andy about why I couldn't use `array.includes()` apparently needed to add correct `lib` config to `tsconfig.json` 🙌.

This has helped me a bit!

## 23/Oct/2019

So today was implementing a variables system into the language.

This was fairly simple, just by creating a `#def` expression I matched the first arg with the `/^#[A-Za-z]+/g` regex (that I wrote by hand 🤯, yeah I don't know what has come over me either), then set that as a key for the value which is the evaluated second arg.

Then when accessing the variable in the `evaluateArg` arg function we pull the value of the variables object.

Also tidied up the output functionality to make it work nicer!

Looked into the above `#print` problem as mentioned at end of 21/Oct/2019 I think it's working as 'expected' now since the fixes I pushed today 🤷‍♀️.

Added better error reporting for undefined variables and undefined expressions!

## 29th October 2019

Not had a huge amount of time to work on this due to other commitments and general work changes.

So where are we at?

We have function definitions working! If a user uses the `#def` expression and passes it a `#fn` expression that `#fn` will maintain a reference to the arguments passed to it. The `#fn` is then evaluated when it is called 🥳.
