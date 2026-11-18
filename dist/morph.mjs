// Updates a live element to match new markup, touching only what changed. Images, running
// transitions and scroll positions survive a re-render, so nothing flickers on every click.
const template = document.createElement('template');
const sameKind = (a, b) => a.nodeType === b.nodeType && a.nodeName === b.nodeName && (a.nodeType !== 1 || a.id === b.id);

function syncAttributes(from, to) {
  for (const { name } of [...from.attributes]) if (!to.hasAttribute(name)) from.removeAttribute(name);
  for (const { name, value } of [...to.attributes]) if (from.getAttribute(name) !== value) from.setAttribute(name, value);
  if (from instanceof HTMLInputElement && to.hasAttribute('value') && from.value !== to.getAttribute('value')) from.value = to.getAttribute('value');
  // Screens bind their handlers after rendering, so a reused element must not keep an old one.
  from.onclick = null; from.onchange = null; from.oninput = null;
}
function syncChildren(from, to) {
  let current = from.firstChild, next = to.firstChild;
  while (next) {
    const after = next.nextSibling;
    if (!current) from.appendChild(next);
    else {
      const following = current.nextSibling;
      if (!sameKind(current, next)) from.replaceChild(next, current);
      else if (current.nodeType === 1) { syncAttributes(current, next); syncChildren(current, next); }
      else if (current.nodeValue !== next.nodeValue) current.nodeValue = next.nodeValue;
      current = following;
    }
    next = after;
  }
  while (current) { const following = current.nextSibling; from.removeChild(current); current = following; }
}
export function morph(element, html) {
  template.innerHTML = html;
  for (const image of template.content.querySelectorAll('img')) image.decoding = 'sync';
  syncChildren(element, template.content);
}
