const find = require('find');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mime = require('mime');

exports.sourceNodes = ({ boundActionCreators, getNode, reporter }, pluginOptions) => {
  const { createNode } = boundActionCreators;

  // return createFileNode(pluginOptions.path, pluginOptions).then(createNode)
  return new Promise((resolve, reject) => {
    find.file(/\.config\.yml/, pluginOptions.path, (files) => {
      files.forEach(file => {
        const directory = path.dirname(file);
        const name = path.parse(file).name.replace('.config', '');
        const compPath = path.relative(pluginOptions.path, directory);

        const readmePath = path.join(directory, 'README.md');
        const readmeExists = fs.existsSync(readmePath);
        const configContent = fs.readFileSync(file, 'utf8');
        const configStats = JSON.parse(JSON.stringify(fs.statSync(file)));
        const children = [
          `${compPath}-source`,
          `${compPath}-example`,
        ];
        if (readmeExists) {
          children.push(`${compPath}-readme`)
        }
        createNode({
          id: `${compPath}`,
          parent: null,
          path: compPath,
          name,
          children,
          internal: {
            type: 'UIComponent',
            contentDigest: crypto
              .createHash(`md5`)
              .update(JSON.stringify({ configStats, file }))
              .digest(`hex`),
            mediaType: mime.lookup(path.parse(file).ext),
            content: configContent
          },
          dir: 'Config',
          ...configStats
        });

        const sourcePath = `${path.join(directory, name)}.jsx`;
        const sourceContent = fs.readFileSync(sourcePath, 'utf8');
        const sourceStats = JSON.parse(JSON.stringify(fs.statSync(sourcePath)));
        createNode({
          id: `${compPath}-source`,
          parent: compPath,
          path: sourcePath,
          children: [],
          internal: {
            type: 'UIComponentSource',
            mediaType: 'application/javascript',
            contentDigest: crypto
              .createHash(`md5`)
              .update(JSON.stringify({ sourceStats, sourcePath }))
              .digest(`hex`),
            content: sourceContent          
          },
          ...sourceStats
        });

        const examplePath = `${path.join(directory, name)}.example.jsx`;
        const exampleContent = fs.readFileSync(examplePath, 'utf8');
        const exampleStats = JSON.parse(JSON.stringify(fs.statSync(examplePath)));
        createNode({
          id: `${compPath}-example`,
          parent: compPath,
          path: examplePath,
          children: [],
          internal: {
            type: 'UIComponentExample',
            contentDigest: crypto
              .createHash(`md5`)
              .update(JSON.stringify({ exampleStats, examplePath }))
              .digest(`hex`),
            mediaType: 'application/javascript',
            content: exampleContent
          },
          ...exampleStats
        });
        if (readmeExists) {
          const readmeContent = fs.readFileSync(readmePath, 'utf8');
          const readmeStats = JSON.parse(JSON.stringify(fs.statSync(readmePath)));
          createNode({
            id: `${compPath}-readme`,
            parent: compPath,
            path: readmePath,
            children: [],
            internal: {
              type: 'UIComponentReadme',
              contentDigest: crypto
                .createHash(`md5`)
                .update(JSON.stringify({ readmeStats, readmePath }))
                .digest(`hex`),
              mediaType: 'text/markdown',
              content: readmeContent
            },
            ...readmeStats
          });
        }
      });
      resolve();
    });
  });
};
