import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';

import '../sass/site/style.scss';

class UIComponentTemplate extends React.Component {
  render() {
    const readme = this.props.data.uiComponent.childUiComponentReadme;
    return (
      <div>
        <iframe src={this.props.pathContext.framedPath}></iframe>
        <Tabs defaultIndex={0}>
          <TabList>
            <Tab>Example</Tab>
            <Tab>Info</Tab>
            {!!readme && <Tab>Notes</Tab>}
            <Tab>Props</Tab>
          </TabList>

          <TabPanel>
            <SyntaxHighlighter
              language='jsx'
              style={docco}>
              {this.props.data.uiComponent.childUiComponentExample.internal.content}
            </SyntaxHighlighter>
          </TabPanel>
          <TabPanel>
          </TabPanel>
          {!!readme && <TabPanel>
            <div dangerouslySetInnerHTML={{ __html: readme.childMarkdownRemark.html }}></div>
          </TabPanel>}
          <TabPanel>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default UIComponentTemplate

export const pageQuery = graphql`
  query UIComponentByName($name: String!) {
    uiComponent(name: { eq: $name }) {
      name,
      path,
      childConfigYaml {
        label,
        status
      },
      childUiComponentExample {
        internal {
          content
        }
      },
      childUiComponentReadme {
        childMarkdownRemark {
          html
        }
      },
      childUiComponentSource {
        childComponentMetadata {
          props {
            name,
            type {
              name,
              value
            },
            required,
            docblock
          }
        }
      }
    }
  }
`
