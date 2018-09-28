<h1 align="center">gatsby-course-starter</h1> <br>
<p align="center">
    <img alt="project logo" src="https://brholtimages.blob.core.windows.net/images/woman-teacher.png" width="150">
</p>

<p align="center">
  A Gatsby starter to get you started creating educational materials using Markdown
</p>

## Get Started

1. `npm install --global gatsby-cli` - make sure you're on Gatsby v2+
   - See [docs here](https://next.gatsbyjs.org/docs/) if you need help
1. `gatsby new course-website https://github.com/btholt/gatsby-course-starter`
1. `cd course-website`
1. `npm run dev`
1. Open http://localhost:8000 in your browser

## Lessons

The crux of this site is are the lessons. Provided are two examples. Each lesson needs a [frontmattter](https://github.com/gatsbyjs/gatsby/blob/master/docs/docs/adding-markdown-pages.md#note-on-creating-markdown-files) `path`, `order`, and `title`. Generally you should make the `path` and the file name match for ease of finding it.

- `path` - needs a leading slash. This will be slug of the lesson
- `title` - will be the title displayed on the Table of Contents and on the page itself
- `order` - the order of which the item should appear in the table of contents. The first item should be of order `0`. The second should be `1`, etc. Must be numbered sequentially, i.e. don't skip numbers.

## Config

Inside of `gatsby-config.js` be sure to fill out the `siteMetadata` fields, including `title`, `subtitle`, `description`, and `keywords`.

## Azure Pipelines

Azure has a free-for-open-source continuous integration platform called [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/?WT.mc_id=gatsby-github-brholt). This project is already set up for it with the `azure-pipelines.yml`. Just add the project to Pipelines and it'll immediately correctly build the project. From there you'll have a build artifact that you can use to deploy to [Azure Static Sites](https://azure.microsoft.com/en-us/blog/azure-storage-static-web-hosting-public-preview/?WT.mc_id=gatsby-github-brholt) or [GitHub Pages](https://pages.github.com/).

## GitHub Pages

If you do want to deploy to GitHub pages, make sure you add the name of the repo to the `pathPrefix` property in `gatsby-config.js` so that it will correctly make all the links.

## Example Sites

- [Complete Intro to Web Dev v2](https://btholt.github.io/intro-to-web-dev-v2/)
- [Complete Intro to React v4](https://btholt.github.io/complete-intro-to-react-v4/)
- [Four Semesters of Computer Science in Five Hours Part II](https://btholt.github.io/four-semesters-of-cs-part-two/)

## License

The **code** is this repo is licensed under the Apache 2.0 license.

I include the CC-BY-NC-4.0 license for the content; this is what I recommend you license your **content** under: anyone can use and share the content but they cannot sell it; only you can.
