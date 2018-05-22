const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const UIComponentTemplate = path.resolve('./src/templates/ui-component.js')
    resolve(
      graphql(
        `
          {
            allUiComponent {
              edges {
                node {
                  name,
                  path,
                  childConfigYaml {
                    label,
                    status
                  },
                  childUiComponentExample {
                    path
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
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const components = result.data.allUiComponent.edges;

        _.each(components, (comp, index) => {
          createPage({
            path: `/components/${comp.node.path}`,
            component: UIComponentTemplate,
            context: {
              name: comp.node.name,
              framedPath: `/components/${comp.node.path}/framed`,
            }
          })
          createPage({
            path: `/components/${comp.node.path}/framed`,
            component: comp.node.childUiComponentExample.path,
            context: {
              name: comp.node.name,
            }
          })
        })
      })
    )
  })
}

// exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
//   const { createNodeField } = boundActionCreators
//
//   if (node.internal.type === `MarkdownRemark`) {
//     const value = createFilePath({ node, getNode })
//     createNodeField({
//       name: `slug`,
//       node,
//       value,
//     })
//   }
// }
