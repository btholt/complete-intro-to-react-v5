---
order: 3
path: "/eslint-prettier"
title: "npm, ESLint & Prettier"
---

## npm

npm does not stand for Node Package Manager. It is, however, the package manager for Node. (They don't say what it stands for.) It also has all the packages in the front end scene. npm makes a command line tool, called `npm` as well. `npm` allows you to bring in code from the npm registry which is a bunch of open source modules that people have written so you can use them in your project. Whenever you run `npm install react` (don't do this yet), it will install the latest version of React from the registry.

In order to start an npm project, run `npm init` at the root of your project. If you don't have Node.js installed, please go install that too. When you run `npm init` it'll ask you a bunch of questions. If you don't know the answer or don't care, just hit enter. You can always modify package.json later. This will allow us to get started installing and saving packages.

## Code Quality

It's important to keep quality high when writing code. Or at least that's how I sell ESLint and Prettier to my co-workers. In reality I'm super lazy and want the machine to do as much work as possible so I focus more on architecture and problem-solving and less on syntax and style. While there are many tools that can help you keep code quality high, these two I consider core to my workflow.

## Prettier

[Prettier][prettier] is an amazing tool from the brain of [James Long][jlongster]. James, like many of us, was sick of having to constantly worried about the style of his code: where to stick indents, how many, when to break lines, etc etc. Coming from languages like Go, Reason, or Elm where all that is just taken care of by the tooling for the language, this quickly wears. James did something about it and made a tool to take care of it: Prettier.

Prettier is a really fancy pretty printer. It takes the code you write, breaks it down in to an abstract syntax tree (AST) which is just a representation of your code. It then takes that AST, throws away all of your code style you made and prints it back out using a predefined style. While this sounds a little scary, it's actually really cool. Since you no longer have control of the style of your code, you no longer have to think at all about it. Your code is always consistent, as is the code from the rest of your team. No more bikeshedding!! As I like to put it: if your brain is a processor, you get to free up the thread of your brain that worries about code styles and readability: it just happens for you. Don't like semicolons? Don't write them! It puts them in for you. I _love_ Prettier.

Need to tool around a bit with it before you trust it? [Go here][prettier-playground]. You can see how it works.

Let's go integrate this into our project. It's _pretty_ easy (lol.)

Either install Prettier globally `npm install --global prettier` or replace when I run `prettier` with (from the root of your project) `npx prettier`. From there, run `prettier script.js`. This will output the formatted version of your file. If you want to actually write the file, run `prettier --write script.js`. Go check script.js and see it has been reformatted a bit. I will say for non-JSX React, prettier makes your code less readable. Luckily Prettier supports JSX! We'll get to that shortly.

Prettier has a few configurations but it's mostly meant to be a tool everyone uses and doesn't argue/bikeshed about the various code style rules. [Here they are][prettier-options]. I just use it as is since I'm lazy. Prettier also can understand [flow][flow] and [TypeScript][ts].

Prettier is great to use with [Visual Studio Code][vscode]. Just download [this extension][vscode-prettier]. Pro tip: set it to only run Prettier when it detects a Prettier config file. Makes it so you never have to turn it off. In order to do that, set `prettier.requireConfig` to `true` and `editor.formatOnSave` to true.

So that our tool can know this is a Prettier project, we're going to create a file called `.prettierrc` and put `{}` in it. This lets everyone know this is a Prettier project that uses the default configuration. You can put other configs here if you hold strong formatting opinions.

## npm/Yarn scripts

So it can be painful to try to remember the various CLI commands to run on your project. You can put CLI commands into it and then run the name of the tag and it'll run that script. Let's go see how that works. Put the following into your package.json.

First run `npm install -D prettier`. `-D` means it's for development only.

```json
"scripts": {
	"format": "prettier --write \"src/**/*.{js,jsx}\"",
},
```

Now you can run `yarn format` or `npm run format` and it will run that command. This means we don't have to remember that mess of a command and just have to remember format. Nice, right? We'll be leaning on this a lot during this course.

## Alternatives

There really aren't any for Prettier. The alternative is just not to use a formatter. ESLint's `--fix` flag would be the closest thing.

## ESLint

On top of Prettier which takes of all the formatting, you may want to enforce some code styles which pertain more to usage: for example you may want to force people never use `with` which is valid JS but ill advised to use. [ESLint][eslint] comes into play here. It will lint for this problems.

First of all, run `npm install -D eslint eslint-config-prettier` to install eslint in your project development dependencies. Then you may configure its functionalities.

There are dozens of present configs for ESLint and you're welcome to use any one of them. The Airbnb config is very popular, as is the standard config (which both I taught in previous versions of this class). I'm going to use a looser one for this class: `eslint:recommended`. Let's create an `.eslintrc.json` file to start linting our project.

Create this file called `.eslintrc.json`.

```json
{
  "extends": ["eslint:recommended", "prettier", "prettier/react"],
  "plugins": [],
  "parserOptions": {
    "ecmaVersion": 2016,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  }
}
```

This is a combination of the recommended configs of ESLint and Prettier. This will lint for both normal JS stuff as well as JSX stuff. Run `npx eslint script.js` now and you should see we have a few errors. Run it again with the `--fix` flag and see it will fix some of it for us! Go fix the rest of your errors and come back. Let's go add this to our npm scripts.

```json
"lint": "eslint \"**/*.{js,jsx}\" --quiet",
```

Worth adding three things here:

- With npm scripts, you can pass additional parameters to the command if you want. Just add a `--` and then put whatever else you want to tack on after that. For example, if I wanted to get the debug output from ESLint, I could run `npm run lint -- --debug` which would translate to `eslint **/*.js --debug`.
- We can use our fix trick this way: `npm run lint -- --fix`.
- We're going to both JS and JSX.
- ESLint will have a bunch of errors right now. Ignore them; we'll fix them in a sec.

ESLint is a cinch to get working with [Visual Studio Code][vscode]. Just down [the extension][vscode-eslint].

## Alternatives

- [jshint][jshint]

## .gitignore

If you haven't already, create a .gitignore at the root of your project to ignore the stuff we don't want to commit. Go ahead and put this in there:

```
node_modules
.cache/
dist/
.env
.DS_Store
coverage/
.vscode/
```

&nbsp;

## 🌳 [93942425115653f5edda76aa498ce64a53681ea4](https://github.com/btholt/complete-intro-to-react-v5/commit/93942425115653f5edda76aa498ce64a53681ea4)

&nbsp;

[jlongster]: https://twitter.com/jlongster
[prettier]: https://github.com/prettier/prettier
[prettier-playground]: https://prettier.github.io/prettier/
[prettier-options]: https://github.com/prettier/prettier#api
[flow]: https://flow.org/
[prettier-ide]: https://github.com/prettier/prettier#editor-integration
[airbnb]: https://github.com/airbnb/javascript
[sl]: http://sublimelinter.readthedocs.io/en/latest/
[slce]: https://github.com/roadhump/SublimeLinter-eslint
[ts]: https://www.typescriptlang.org/
[vscode]: https://code.visualstudio.com/?WT.mc_id=reactintro-github-brholt
[vscode-eslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint&WT.mc_id=reactintro-github-brholt
[vscode-prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode&WT.mc_id=reactintro-github-brholt
[eslint]: https://eslint.org
[jshint]: http://jshint.com/
