# Welcome to the Complete Intro to React v5 and Intermediate React v2!

[See the course website here][v5].

Before starting the course, please have [VSCode][vscode] or another code editor installed. Brian is using a font called [Dankmono][dankmono] (not necessary to install -- just for those curious), but [FiraCode][firacode] is another great option. This course was written for and recorded by [Frontend Masters][fem]. The code here is licensed under the Apache 2.0 license and the [course notes][v5] are licensed under the Creative Commons Attribution-NonCommercial 4.0 International license.


<!-- as the [Complete Intro to React v5][course] and [Intermediate React][course-intermediate] courses.  -->

## Debugging

Parcel is an ever evolving project that's just getting better. If you run into problems with it not respecting changes (particularly to your `.babelrc` or `.env` files) then delete the `dist/` and the `.cache/` directories. You can do this in bash by running from the root directoy of your project `rm -rf dist/ .cache/` or just by deleting those directories in your editor. This will force Parcel to start over and not cache anything.

See [this issue](https://github.com/btholt/complete-intro-to-react-v4/issues/3#issuecomment-425124265) for more specific instructions.

If you run into anything else, open an issue and we'll try to clarify or help.

[v5]: https://bit.ly/react-v5
[vscode]: https://code.visualstudio.com/
[dankmono]: https://dank.sh/
[firacode]: https://github.com/tonsky/FiraCode
[fem]: https://frontendmasters.com/
<!-- [course]: https://frontendmasters.com/courses/complete-react-v5/ -->
<!-- [course-intermediate]: https://frontendmasters.com/courses/intermediate-react-v2/ -->