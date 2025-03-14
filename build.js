const fs = require('fs');
const path = require('path');

// Caminho correto para o arquivo manifest-template.json
const manifestTemplatePath = path.join(__dirname, 'src', 'manifest-template.json');

// Lê o template do manifest
fs.readFile(manifestTemplatePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo manifest-template.json:', err);
    return;
  }

  // Parseia o JSON do template
  const manifestTemplate = JSON.parse(data);

  // Gera o manifest para o Chrome (Manifest V3)
  const chromeManifest = { ...manifestTemplate };
  chromeManifest.manifest_version = 3;

  // Ajuste para o Chrome - Usar service_worker no lugar de background.scripts
  chromeManifest.background = {
    service_worker: 'scripts/background.js'
  };

  // Caminho para salvar o manifest do Chrome
  const chromeManifestPath = path.join(__dirname, 'chrome', 'manifest.json');

  // Salva o manifest para o Chrome
  fs.writeFile(chromeManifestPath, JSON.stringify(chromeManifest, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Erro ao salvar manifest do Chrome:', err);
      return;
    }
    console.log('Manifest do Chrome gerado com sucesso!');
  });

  // Gera o manifest para o Firefox (Manifest V2)
  const firefoxManifest = { ...manifestTemplate };
  firefoxManifest.manifest_version = 2;

  // Remove a chave 'action' para compatibilidade com o Firefox
  delete firefoxManifest.action;

  // Caminho para salvar o manifest do Firefox
  const firefoxManifestPath = path.join(__dirname, 'firefox', 'manifest.json');

  // Salva o manifest para o Firefox
  fs.writeFile(firefoxManifestPath, JSON.stringify(firefoxManifest, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Erro ao salvar manifest do Firefox:', err);
      return;
    }
    console.log('Manifest do Firefox gerado com sucesso!');
  });
});
