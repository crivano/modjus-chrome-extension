window.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_EDITORS') {
        const payload = event.data.payload
        console.log('Atualizando CKEDITORs', payload)
        CKEDITOR.instances[payload.id].setData(payload.html);
    }
});