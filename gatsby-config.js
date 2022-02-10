module.exports = {
  siteMetadata: {
    title: "Complete Intro to React v5",
    subtitle: "and Intermediate React v2",
    description:
      "The best way to learn React and all the new tools with it. Now with hooks!",
    keywords: [
      "react",
      "parcel",
      "hooks",
      "effects",
      "javascript",
      "redux",
      "typescript"
    ]
  },
  pathPrefix: "/complete-intro-to-react-v5",
  plugins: [
    `gatsby-plugin-sharp`,
    `gatsby-plugin-layout`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/lessons`,
        name: "markdown-pages"
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-prismjs`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: true,
              sizeByPixelDensity: false
            }
          }
        ]
      }
    }
  ]
};
