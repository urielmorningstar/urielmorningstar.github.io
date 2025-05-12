
const __h = document.querySelector ("head");

function _L (href, crossorigin = false, rel = "preconnect") {
  let _elm = document.createElement ("link");
  _elm.setAttribute ("href", href);
  _elm.setAttribute ("rel", rel);
  if (crossorigin) _elm.setAttribute ("crossorigin", "");
  __h.appendChild (_elm);
  return _elm;
}

_L ("https://fonts.googleapis.com");
_L ("https://fonts.gstatic.com", true);
_L ("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap", false, "stylesheet");
_L ("https://urielmorningstar.github.io/SOPAW/searchstyle.css", false, "stylesheet");

let _metaElm = document.createElement ("meta");
_metaElm.setAttribute ("charset", "UTF-8");
__h.appendChild (_metaElm);

if (document.currentScript.hasAttribute ("title")) {
  let title_txt = document.currentScript.getAttribute ("title");
  let _title = document.createElement ("h1");
  _title.innerHTML = title_txt;
  let __b = document.querySelector ("body");

  __b.appendChild (_title);
}

let _scriptElm = document.createElement ("script");
_scriptElm.setAttribute ("src", "https://urielmorningstar.github.io/SOPAW/sopawcore.js");
_scriptElm.setAttribute ("charset", "UTF-8");
_scriptElm.setAttribute ("databases", document.currentScript.getAttribute ("databases"));
__h.appendChild (_scriptElm);
