import React from "react";
import Link from "gatsby-link";
import Helmet from "react-helmet";
import { graphql, StaticQuery } from "gatsby";

import "bootstrap/dist/css/bootstrap.css";
import "prismjs/themes/prism-solarizedlight.css";
import "code-mirror-themes/themes/monokai.css";
import "./index.css";

const TemplateWrapper = props => (
  <StaticQuery
    render={data => (
      <div>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            {
              name: "description",
              content: data.site.siteMetadata.description
            },
            {
              name: "keywords",
              content: data.site.siteMetadata.keywords.join(", ")
            }
          ]}
        />
        <div className="navbar navbar-light gradient">
          <Link to="/" className="navbar-brand">
            {data.site.siteMetadata.title}
          </Link>
        </div>
        <div className="main">{props.children}</div>
      </div>
    )}
    query={graphql`
      {
        site {
          siteMetadata {
            title
            subtitle
            description
            keywords
          }
        }
      }
    `}
  />
);

export default TemplateWrapper;
