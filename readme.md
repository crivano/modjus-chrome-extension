# modjus-chrome-extension

Este repositório contém diferentes versões da extensão **ModJus**, desenvolvida para facilitar o uso de sistemas judiciais no ambiente da Justiça Federal da 2ª Região. A extensão está sendo adaptada para múltiplos navegadores, considerando diferentes formas de distribuição (loja oficial ou instalação via GPO).

## Estrutura do Projeto

O repositório é dividido em três pastas principais, conforme o navegador de destino e a forma de distribuição:

### 📁 `modjus-extension`
Versão da extensão adaptada para **publicação na Chrome Web Store** (Loja do Google).

- Compatível com o navegador **Google Chrome**.
- Contém ajustes exigidos pela loja oficial (como políticas de privacidade e permissões refinadas).

### 📁 `modjus-extension-parachromeeedge`
Versão da extensão voltada para instalação **interna via GPO** nos navegadores **Google Chrome** e **Microsoft Edge**.

- Utilizada exclusivamente pela **Justiça Federal da 2ª Região**.
- Adaptada para funcionar corretamente no ambiente corporativo com políticas de grupo (GPO).
- Inclui configurações específicas e manifesto compatível com ambos os navegadores.

### 📁 `modjus-extension-parafirefox` *(em desenvolvimento)*
Versão da extensão em desenvolvimento para o navegador **Mozilla Firefox**.

- Está sendo ajustada para atender aos requisitos técnicos e de manifesto do Firefox.
- Destinada a ser usada internamente ou publicada, conforme definições futuras.

---

## Objetivo da Extensão

A extensão **ModJus** busca oferecer melhorias e automações nos fluxos de trabalho relacionados aos sistemas judiciais utilizados na Justiça Federal, como preenchimento automático, atalhos de navegação e integração com sistemas internos.

---

## Contribuição

Caso deseje contribuir com o projeto (correções, melhorias ou testes), siga os passos abaixo:

1. Fork este repositório.
2. Crie uma branch com sua feature ou correção.
3. Envie um Pull Request com a descrição das mudanças.

---

## Licença

Este projeto é de uso **interno** e voltado às necessidades da Justiça Federal da 2ª Região. O uso externo pode estar sujeito a restrições.

---

## Contato

Para dúvidas técnicas ou sugestões, entre em contato com a equipe responsável pelo desenvolvimento interno da JF2R.
