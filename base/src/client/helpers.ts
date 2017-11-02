export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

interface MakeElementSettings {
  id?: string;
  parent?: HTMLElement;
  textContent?: string;
}

export function $make(tagName: string, className?: string, settings?: MakeElementSettings) {
  const elt = document.createElement(tagName);
  if (className != null) elt.className = className;

  if (settings != null) {
    if (settings.parent != null) settings.parent.appendChild(elt);
    if (settings.id != null) elt.id = settings.id;
    if (settings.textContent != null) elt.textContent = settings.textContent;
  }

  return elt;
}

export function $remove(elt: HTMLElement) {
  elt.parentElement!.removeChild(elt);
}
