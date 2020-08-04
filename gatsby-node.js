const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;

    if (node.internal.type === 'ProjectsJson') {
        createNodeField({
            node,
            name: 'slug',
            value: node.href,
        });
    }
};

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const result = await graphql(`
        {
            allProjectsJson {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `);

    result.data.allProjectsJson.edges.forEach(({ node }) => {
        createPage({
            path: node.fields.slug,
            component: path.resolve('./src/templates/projectPage.js'),
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.fields.slug,
            },
        });
    });
};
