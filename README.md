**All PRs and issues for the course code and website have been resolved as of November 29th, 2019. The code for each commit and branch has also been tested! 😀**

# Welcome to the Complete Intro to React v5 and Intermediate React v2!

[See the course website here][v5].

Before starting the course, please have [VSCode][vscode] or another code editor installed.

The master branch and commits within are all covered in [Introduction to React v5][course]. The other branches, excluding the [gh-pages-src][gh-pages] and gh-pages branches (these create the [course website][v5]), are all covered in [Intermediate React][course-intermediate] as modular segments that can be taken individually, or out of order.

Brian is using a font called [Dankmono][dankmono] (not necessary to install -- just for those curious), but [FiraCode][firacode] is another great option. This course was written for and recorded by [Frontend Masters][fem]. The code here is licensed under the Apache 2.0 license and the [course notes][v5] are licensed under the Creative Commons Attribution-NonCommercial 4.0 International license.

## Debugging 

### Parcel Issues:

Parcel is an ever evolving project that's just getting better. If you run into problems with it not respecting changes (particularly to your `.babelrc` or `.env` files) then delete the `dist/` and the `.cache/` directories. You can do this in bash by running from the root directoy of your project `rm -rf dist/ .cache/` or just by deleting those directories in your editor. This will force Parcel to start over and not cache anything.

See [this issue](https://github.com/btholt/complete-intro-to-react-v4/issues/3#issuecomment-425124265) for more specific instructions.

### Solution to "regeneratorRuntime is not defined"

The simplest solution is to cut the supported browsers list in your `package.json` file down to:

```js
    "browserslist": [
        "last 2 Chrome versions",
    ]
```

There is a more involved solution if you want to [support more browsers in the issue](https://github.com/btholt/complete-intro-to-react-v5/issues/58#issuecomment-559882582).

If you run into anything else, open an issue and we'll try to clarify or help!

## See a Bug or Typo?

Pull requests are extremely welcome! If you see a typo in the course website, you can access the website code through the [gh-pages-src][gh-pages] branch of this repository.

[gh-pages]: https://github.com/btholt/complete-intro-to-react-v5/tree/gh-pages-src
[v5]: https://bit.ly/react-v5
[vscode]: https://code.visualstudio.com/
[dankmono]: https://dank.sh/
[firacode]: https://github.com/tonsky/FiraCode
[fem]: https://frontendmasters.com/
[course]: https://frontendmasters.com/courses/complete-react-v5/
[course-intermediate]: https://frontendmasters.com/courses/intermediate-react-v2/
