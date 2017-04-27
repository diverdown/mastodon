// @flow
import Prism from 'prismjs';
import apacheconf   from "prismjs/components/prism-apacheconf"
import bash         from "prismjs/components/prism-bash"
import brainfuck    from "prismjs/components/prism-brainfuck"
import c            from "prismjs/components/prism-c"
import coffeescript from "prismjs/components/prism-coffeescript"
import cpp          from "prismjs/components/prism-cpp"
import csharp       from "prismjs/components/prism-csharp"
import d            from "prismjs/components/prism-d"
import diff         from "prismjs/components/prism-diff"
import docker       from "prismjs/components/prism-docker"
import elixir       from "prismjs/components/prism-elixir"
import erlang       from "prismjs/components/prism-erlang"
import go           from "prismjs/components/prism-go"
import graphql      from "prismjs/components/prism-graphql"
import haml         from "prismjs/components/prism-haml"
import handlebars   from "prismjs/components/prism-handlebars"
import haskell      from "prismjs/components/prism-haskell"
import java         from "prismjs/components/prism-java"
import json         from "prismjs/components/prism-json"
import jsx          from "prismjs/components/prism-jsx"
import julia        from "prismjs/components/prism-julia"
import kotlin       from "prismjs/components/prism-kotlin"
import lua          from "prismjs/components/prism-lua"
import markdown     from "prismjs/components/prism-markdown"
import nginx        from "prismjs/components/prism-nginx"
import objectivec   from "prismjs/components/prism-objectivec"
import ocaml        from "prismjs/components/prism-ocaml"
import perl         from "prismjs/components/prism-perl"
import php          from "prismjs/components/prism-php"
import processing   from "prismjs/components/prism-processing"
import python       from "prismjs/components/prism-python"
import r            from "prismjs/components/prism-r"
import ruby         from "prismjs/components/prism-ruby"
import rust         from "prismjs/components/prism-rust"
import sass         from "prismjs/components/prism-sass"
import scala        from "prismjs/components/prism-scala"
import scheme       from "prismjs/components/prism-scheme"
import scss         from "prismjs/components/prism-scss"
import smalltalk    from "prismjs/components/prism-smalltalk"
import sql          from "prismjs/components/prism-sql"
import swift        from "prismjs/components/prism-swift"
import typescript   from "prismjs/components/prism-typescript"
import yaml         from "prismjs/components/prism-yaml"

Prism.languages.extend({bash, brainfuck, c, cpp, csharp, d, diff, docker, elixir, erlang, go, graphql, haml, handlebars, haskell, java, json, jsx, julia, kotlin, lua, markdown, nginx, objectivec, ocaml, perl, php, processing, python, r, ruby, rust, sass, scala, scheme, scss, smalltalk, sql, swift, typescript, yaml});

Prism.languages.rb = Prism.languages.ruby;

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
