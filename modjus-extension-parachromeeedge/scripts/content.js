console.log('Content script loaded');

// =================== UTILS ===================

function unescapeHtmlB(escapedHtmlB) {
    const doc = new DOMParser().parseFromString(escapedHtmlB, 'text/html');
    return doc.documentElement.textContent || doc.body.textContent;
}

function unescapeHtml(string) {
    const htmlUnescapes = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    return string.replace(/&(?:amp|lt|gt|quot|#39);/g, match => htmlUnescapes[match]);
}

function showErrorModal(message, details) {
    let modal = document.getElementById('error-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'error-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Ocorreu um erro!</h2>
                <p id="error-message"></p>
                <button id="close-btn">Fechar</button>
                <button id="details-btn">Mais detalhes</button>
                <div id="error-details" class="error-details" style="display: none;">
                    <pre id="detailed-message"></pre>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('error-message').textContent = message;
    document.getElementById('detailed-message').textContent = details;

    document.getElementById('details-btn').onclick = () => {
        document.getElementById('error-details').style.display = 'block';
    };

    document.getElementById('close-btn').onclick = () => {
        modal.style.display = 'none';
    };

    modal.style.display = 'flex';
}

// =================== CORE ===================

function modjusStart(url, data) {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}`;

    fetch(`${baseUrl}/api/data-store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);

        const iframe = document.createElement("iframe");
        iframe.src = `${url}?dataKey=${result.key}&url=${encodeURIComponent(url)}`;
        iframe.style = "border:0;margin:0;padding:0;height:100%;width:100%;overflow:hidden";
        iframe.frameborder = "0";

        document.documentElement.style = "border:0;margin:0;padding:0;height:100%;width:100%;overflow:hidden";
        document.body.style = "border:0;margin:0;padding:0;height:100%;width:100%;overflow:hidden";
 
        const form = document.querySelector("form");
        if (form) {
            console.log("📎 Inserindo iframe antes do <form>");
            form.insertAdjacentElement("beforebegin", iframe);
        } else {
            console.warn("⚠️ Nenhum <form> encontrado, adicionando no <body>");
            document.body.insertBefore(iframe, document.body.firstChild);
        }
        

        iframe.onerror = function (error) {
            showErrorModal(
                "Ocorreu um erro ao tentar carregar o conteúdo.",
                `Erro ao carregar o iframe com o src: ${iframe.src} \nDetalhes: ${error.message}`
            );
        };
    })
    .catch(error => {
        showErrorModal(
            "Ocorreu um erro ao tentar carregar os dados.",
            `Erro ao tentar acessar a URL para carregar os dados do documento : ${baseUrl}/api/data-store \nDetalhes: ${error.message}`
        );
    });
}

function modjusStop(html) {
    const iframe = document.querySelector("iframe");
    if (iframe) iframe.remove();

    console.log('🧪 HTML recebido do aplicativo:', html);

    // Trata textareas (CKEditor 4)
    const textareas = document.querySelectorAll('textarea');
    for (const textarea of textareas) {
        if (textarea.value && textarea.value.includes('modjus-url="')) {
            textarea.value = html;
            window.postMessage({
                type: 'UPDATE_EDITORS',
                payload: { id: textarea.name, html: html }
            }, '*');
            return;
        }
    }

    // Trata CKEditor 5 — substitui div com modjus-url dentro de txaEditor_xxxx
    const editors = document.querySelectorAll('div[id^="txaEditor_"]');
    for (const editorContainer of editors) {
        const oldModjus = editorContainer.querySelector('div[modjus-url]');
        if (!oldModjus) continue;

        // Cria DOM virtual a partir do novo HTML
        const temp = document.createElement('div');
        temp.innerHTML = html.trim();

        // Procura pela nova div[modjus-url] dentro do HTML retornado
        const newModjus = temp.querySelector('div[modjus-url]');
        if (!newModjus) {
            console.warn('⚠️ O HTML retornado não contém uma nova div[modjus-url]');
            return;
        }

        // Substitui a div original pela nova
        oldModjus.replaceWith(newModjus);

        console.log('✅ Conteúdo modjus substituído com sucesso.');

        window.postMessage({
            type: 'UPDATE_EDITORS',
            payload: { id: editorContainer.id, html }
        }, '*');

        return;
    }

    console.warn('modjusStop: Nenhum editor com modjus-url encontrado.');
}

// =================== EVENTOS ===================

window.addEventListener('message', (event) => {
    if (event.data.type === 'SAVE_DATA') {
        console.log('Dados recebidos no parent frame:', event.data.payload);
        modjusStop(event.data.payload);
    }
});

// =================== OBSERVADOR ===================

function iniciarModjus() {
    const elements = document.querySelectorAll('textarea, div');

    for (const el of elements) {
        const text = el.value !== undefined ? el.value : el.innerHTML;

        if (text && text.includes('modjus-url="')) {
            const urlMatch = text.match(/modjus-url="([^"]+)"/);
            const dataMatch = text.match(/modjus-data="([^"]+)"/);

            if (urlMatch && dataMatch) {
                const url = urlMatch[1];
                const jsonenc = dataMatch[1];
                const json = unescapeHtml(jsonenc);
                const data = json ? JSON.parse(json) : undefined;

                console.log('url', url);
                console.log('data', data);

                modjusStart(url, data);
            }
            break;
        }
    }
}

// =================== SCRIPT EXTRA ===================

function injectScript(file, node) {
    const th = document.getElementsByTagName(node)[0];
    const s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

injectScript(chrome.runtime.getURL('/js/listen.js'), 'body');
