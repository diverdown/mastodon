// @flow
import Prism from 'prismjs';

type Code = {|
  text: string,
  language: ?string,
|}

const createCodeElement = (doc: Document, {text, language}: Code): HTMLPreElement => {
  const pre = doc.createElement('pre');
  if(language) pre.className = `language-${language}`;
  const code = doc.createElement('code');
  const syntax = Prism.languages[language];
  const highlighted = syntax? Prism.highlight(text.trim(), syntax) : text.trim();
  code.innerHTML = highlighted;
  pre.appendChild(code);
  return pre;
}

const removeNode = (node: Node) => {
  node.parentNode.removeChild(node);
  return true
}

const handleLeaf = (doc: Document, current: Node, code: ?Code, top: ?Node): ?Code => {
  if(code) {
    if(current.textContent !== '```') {
      code.text += current.tagName === 'BR' ? "\n" : current.textContent;
      return removeNode(current) && code;
    }
    let p = current;
    while(p.parentNode !== top) p = p.parentNode;
    top.insertBefore(createCodeElement(doc, code), p);
    removeNode(current);
    return null;
  }

  if(!(current instanceof Text)) return null;
  const match = current.textContent.match(/^```([a-z]*)$/)
  if(match) {
    removeNode(current);
    return {language: match[1], text: ''};
  }
  return null;
}

const transform = (doc, current: Node, code: ?Code, top: ?Node): ?Code => {
  if(current.childNodes.length === 0) return handleLeaf(doc, current, code, top);

  // childNodes might be modified inside loop
  const arr = Array.from(current.childNodes);
  for(let i = 0, l = arr.length; i < l; i++) {
    const outside = !code;
    code = transform(doc, arr[i], code, top);
    if(outside && code) top = current;
  }
  if(code && current.tagName === 'P') {
    code.text += "\n\n";
    current.parentNode.removeChild(current);
  }
  return code;
}

const highlight = (text: string): string => {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  const incomplete = transform(doc, doc.body, null, null);
  if(incomplete) return text;
  return doc.body.innerHTML;
}

export default highlight;
