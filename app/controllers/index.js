const fs = require('fs');

const makeModule = () => {
  let allModules = {};

  // lister tous les fichiers du dossier courant (sauf index.js)
  let allFilesInFolder = fs.readdirSync(__dirname);
  // console.log(allFilesInFolder);

  for (let filename of allFilesInFolder) {
    // on zappe index
    if (filename === 'index.js') { continue }

    // sinon, on défini le nom du module en fonction du nom du fichier
    let moduleName = filename.slice(0,-3);
    // console.log(filename, moduleName);
    // require les fichiers listés dans un objet
    allModules[moduleName] = require('./'+filename);
  }

  // console.log(allModules);

  // return cet objet
  return allModules;

}


module.exports = makeModule();