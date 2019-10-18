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
