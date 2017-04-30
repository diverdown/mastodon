// @flow
import Prism from 'prismjs';
import escapeTextContentForBrowser from 'escape-html';

type Code = {|
  text: string,
  language: ?string,
|}

export const createCodeElement = (doc: Document, {text, language}: Code): HTMLPreElement => {
  const pre = doc.createElement('pre');
  if(language) pre.className = `language-${language}`;
  const code = doc.createElement('code');
  const syntax = Prism.languages[language];
  const highlighted = syntax ? Prism.highlight(text, syntax) : escapeTextContentForBrowser(text);
  code.innerHTML = highlighted;
  pre.appendChild(code);
  return pre;
}

const removeNode = (node: Node) => {
  node.parentNode.removeChild(node);
  return true
}

const trimBR = (node: Node) => {
  while(node.firstChild && node.firstChild.tagName === 'BR') removeNode(node.firstChild);
  while(node.lastChild && node.lastChild.tagName === 'BR') removeNode(node.lastChild);
}

const previousSiblingsParagraph = (doc: Document, node: Node) => {
  const p = doc.createElement('p');
  while(node.parentNode.firstChild !== node) p.appendChild(node.parentNode.firstChild);
  trimBR(p);
  return p;
}

const accumulateOrTerminateCode = (doc: Document, current: Node, code: Code, top: ?Node): ?Code => {
  if(current.textContent !== '```') {
    code.text += current.tagName === 'BR' && code.text !== '' ? "\n" : current.textContent;
    return removeNode(current) && code;
  }
  let p = current;
  while(p.parentNode !== top) p = p.parentNode;
  if(top.tagName === 'P') {
    // p can not include block element
    // <p>text1<pre></pre>text2</p> => <p>text1</p><pre></pre><p>text</p>
    const prev = previousSiblingsParagraph(doc, current)
    if(prev.childNodes.length !== 0) top.parentNode.insertBefore(prev, top)
    top.parentNode.insertBefore(createCodeElement(doc, code), top)
    removeNode(current);
  } else {
    top.insertBefore(createCodeElement(doc, code), p);
    removeNode(current);
  }
  return null;
}

const findStartDelimiter = (current: Node): ?Code => {
  const match = current.textContent.match(/^```([a-z]*)$/)
  if(match) {
    removeNode(current);
    return {language: match[1], text: ''};
  }
  return null;
}

const handleLeaf = (doc: Document, current: Node, code: ?Code, top: ?Node): ?Code => {
  if(code) return accumulateOrTerminateCode(doc, current, code, top);
  if(!(current instanceof window.Text)) return null;
  return findStartDelimiter(current)
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

  if(current.tagName === 'P') {
    if(code) code.text += code.text === '' ? "\n" : "\n\n";
    trimBR(current)
    if(current.childNodes.length === 0) removeNode(current);
  }
  return code;
}

const parse = (text: string): ?Document => {
  try {
    const doc = new window.DOMParser().parseFromString(text, 'text/html');
    if(doc.getElementsByTagName("parsererror").length) return null;
    return doc;
  } catch (e) {
    return null;
  }
}

const highlight = (text: string): string => {
  const doc = parse(text);
  if(!doc) return escapeTextContentForBrowser(text);
  const incomplete = transform(doc, doc.body, null, null);
  if(incomplete) return text;
  return doc.body.innerHTML;
}

export default highlight;
