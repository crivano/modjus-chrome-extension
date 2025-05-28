// ====================
// Escuta mensagens do app externo
// ====================
window.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_EDITORS') {

      const { id, html } = event.data.payload;
  
      // CKEditor 4
      if (window.CKEDITOR && CKEDITOR.instances[id]) {
        console.log('[Modjus] Atualizando CKEditor 4:', id);
        CKEDITOR.instances[id].setData(html);
        return;
      }
  
      console.log('[Modjus] Atualizando CKEditor 5:', id);
      const editor = window.inicializadorDll?.editores?.[0];
        if (editor) {
            console.log(`✍️ Atualizando instância CKEditor 5 "${id}"`);
            editor.setData(payload.html);
        } else {
            console.warn(`⚠️ Nenhuma instância CKEditor 5 encontrada com ID: "${id}"`);
       }
      }
});