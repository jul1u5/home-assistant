!function(e){var t={};function o(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";o.r(t);const n=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),i=n.prototype.html,r=n.prototype.css;function s(){return document.querySelector("hc-main")?document.querySelector("hc-main").hass:document.querySelector("home-assistant")?document.querySelector("home-assistant").hass:void 0}function a(e,t,o=null){if((e=new Event(e,{bubbles:!0,cancelable:!1,composed:!0})).detail=t||{},o)o.dispatchEvent(e);else{var n=function(){var e=document.querySelector("hc-main");return e=e?(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("hc-lovelace"))&&e.shadowRoot)&&e.querySelector("hui-view"):(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=document.querySelector("home-assistant"))&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))&&e.shadowRoot)&&e.querySelector("hui-root"))&&e.shadowRoot)&&e.querySelector("ha-app-layout #view"))&&e.firstElementChild}();n&&n.dispatchEvent(e)}}const c=["input_number","input_select","input_text","scene","weblink"];let l=window.cardHelpers;const u=new Promise(async(e,t)=>{l&&e(),window.loadCardHelpers&&(l=await window.loadCardHelpers(),window.cardHelpers=l,e())});function d(e,t){const o=document.createElement("hui-error-card");return o.setConfig({type:"error",error:e,origConfig:t}),o}function p(e,t){if(!t||"object"!=typeof t||!t.type)return d(`No ${e} type configured`,t);let o=t.type;if(o=o.startsWith("custom:")?o.substr("custom:".length):`hui-${o}-${e}`,customElements.get(o))return function(e,t){let o=document.createElement(e);try{o.setConfig(JSON.parse(JSON.stringify(t)))}catch(e){o=d(e,t)}return u.then(()=>{a("ll-rebuild",{},o)}),o}(o,t);const n=d(`Custom element doesn't exist: ${o}.`,t);n.style.display="None";const i=setTimeout(()=>{n.style.display=""},2e3);return customElements.whenDefined(o).then(()=>{clearTimeout(i),a("ll-rebuild",{},n)}),n}function h(e){if(l)return l.createRowElement(e);const t=new Set(["call-service","cast","conditional","divider","section","select","weblink"]);if(!e)return d("Invalid configuration given.",e);if("string"==typeof e&&(e={entity:e}),"object"!=typeof e||!e.entity&&!e.type)return d("Invalid configuration given.",e);const o=e.type||"default";return t.has(o)||o.startsWith("custom:")?p("row",e):p("entity-row",{type:{alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"}[e.entity.split(".",1)[0]]||"text",...e})}customElements.define("fold-entity-row",class extends n{static get properties(){return{open:Boolean,rows:{}}}setConfig(e){this._config=Object.assign({},{open:!1,padding:20,group_config:{}},e),this.open=this.open||this._config.open;let t=this._config.head;this._config.entity&&(t=this._config.entity),"string"==typeof t&&(t={entity:t});let o=this._config.items;this._config.entities&&(o=this._config.entities),t.entity&&t.entity.startsWith("group.")&&!o&&(o=s().states[t.entity].attributes.entity_id);const n=e=>("string"==typeof e&&(e={entity:e}),Object.assign({},this._config.group_config,e));this.head=h(t),this.head.hass=s(),this.head.addEventListener("click",e=>{this.hasMoreInfo(t)||t.tap_action||this.toggle(e)}),this.head.setAttribute("head","head"),this.applyStyle(this.head,t),this.rows=o.map(e=>{const t=h(n(e));return t.hass=s(),this.hasMoreInfo(e)&&t.classList.add("state-card-dialog"),this.applyStyle(t,n(e)),t})}async applyStyle(e,t){if(!t.style)return;await customElements.whenDefined("card-mod"),e.updateComplete&&await e.updateComplete;const o=document.createElement("card-mod");o.template={template:t.style,variables:{config:t},entity_ids:t.entity_ids},e.shadowRoot.appendChild(o)}toggle(e){e&&e.stopPropagation(),this.open=!this.open}hasMoreInfo(e){const t=e.entity||("string"==typeof e?e:null);return!(!t||c.includes(t.split(".",1)[0]))}firstUpdated(){const e=this.head;e.updateComplete.then(()=>{"HUI-SECTION-ROW"===e.tagName&&e.updateComplete.then(()=>{e.shadowRoot.querySelector(".divider").style.marginRight="-56px"})})}set hass(e){this.rows.forEach(t=>t.hass=e),this.head.hass=e}render(){return i`
    <div id="head" ?open=${this.open}>
      ${this.head}
      <ha-icon
        @click=${this.toggle}
        icon=${this.open?"mdi:chevron-up":"mdi:chevron-down"}
      ></ha-icon>
    </div>

    <div id="items"
      ?open=${this.open}
      style=
        ${this._config.padding?`padding-left: ${this._config.padding}px;`:""}
    >
      ${this.rows}
    </div>
    `}static get styles(){return r`
      #head {
        --toggle-icon-width: 40px;
        display: flex;
        cursor: pointer;
        align-items: center;
      }
      #head :not(ha-icon) {
        flex-grow: 1;
        max-width: calc(100% - var(--toggle-icon-width));
      }
      #head ha-icon {
        width: var(--toggle-icon-width);
        cursor: pointer
      }

      #items {
        padding: 0;
        margin: 0;
        overflow: hidden;
        max-height: 0;
      }
      #items[open] {
        overflow: visible;
        max-height: none;
      }
      .state-card-dialog {
        cursor: pointer;
      }
    `}})}]);