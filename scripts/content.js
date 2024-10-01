console.log('Content script loaded');
// console.log('CKEDITOR', CKEDITOR);

function unescapeHtml(string) {
    var htmlUnescapes = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };

    function basePropertyOf(object) {
        return function(key) {
            return object == null ? undefined : object[key];
        };
    }
    const reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g
    const reUnescapedHtml = /[&<>"']/g
    return string.replace(reEscapedHtml, basePropertyOf(htmlUnescapes))
}

function modjusStart(model, data) {
    const form = document.querySelector("form");
    const hundredpercent = "border:0;margin:0;padding:0;height:100%;width:100%;overflow:hidden";
    const iframe = document.createElement("iframe");
    iframe.src = model;
    iframe.frameborder = "0";
    iframe.style = "border:0;margin:0;padding:0;height:100%;width:100%;overflow:hidden";
    // iframe.style.display = "none";
    document.documentElement.style = hundredpercent;
    // _original_form_style_display = form.style.display;
    // form.style.display = "none";
    // form.style.display = _original_form_style_display;
    const body = document.querySelector("body");
    body.style = hundredpercent;
    form.insertAdjacentElement("beforebegin", iframe);
}

function modjusStop(html) {
    const iframe = document.querySelector("iframe");
    iframe.style.display = "none";
    const form = document.querySelector("form");
    // form.style.display = _original_form_style_display;
    for (const textarea of textareas) {
        const text = textarea.value;
        if (text && text.includes("modjus-url=\"")) {
            textarea.innerText = html
            window.postMessage({ type: 'UPDATE_EDITORS', payload: { id: textarea.name, html: html } }, '*')
                // window.CKEDITOR.instances[textarea.id].setData(html);
            break
        }
    }
}

window.addEventListener('message', (event) => {
    if (event.data.type === 'SAVE_DATA') {
        console.log('Dados recebidos no parent frame:', event.data.payload);
        modjusStop(event.data.payload);
    }
});

const textareas = document.querySelectorAll("textarea");

for (const textarea of textareas) {
    const text = textarea.value;
    if (text && text.includes("modjus-url=\"")) {
        const url = text.match(/modjus-url="([^"]+)"/)[1];
        const jsonenc = text.match(/modjus-data="([^"]+)"/)[1];
        const json = unescapeHtml(jsonenc);
        const data = json ? JSON.parse(json) : undefined
        console.log('url', url);
        console.log('data', data);
        modjusStart(`${url}?data=${encodeURIComponent(json)}&url=${encodeURIComponent(url)}`, data);
    }
}


function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
injectScript(chrome.runtime.getURL('/js/listen.js'), 'body');