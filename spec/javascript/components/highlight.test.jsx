import { expect } from 'chai';
import { jsdom } from 'jsdom';
import { stub, spy } from 'sinon';
import Prism from 'prismjs';

import highlight, {
  createCodeElement,
} from '../../../app/assets/javascripts/components/highlight'

import escapeTextContentForBrowser from 'escape-html';

describe('createCodeElement', () => {
  let document;
  beforeEach(() => {
    document = jsdom('');
  })

  describe('gieven supported language', () => {
    it('returns pre element whose innerHTML is syntax highlighted', () => {
      stub(Prism, 'highlight').returns('highlighted');
      const code = {language: 'html', text: '<html><body>test</body></html>'};
      const elem = createCodeElement(document, code)
      expect(elem.tagName).to.equal('PRE');
      expect(elem.firstChild.tagName).to.equal('CODE');
      expect(elem.firstChild.innerHTML).to.equal('highlighted');
    })
  })

  describe('given unsupported language', () => {
    it('returns pre element whose innerHTML is trimmed escaped text', () => {
      const code = {language: 'aaaaaa', text: '<script></script>'};
      const elem = createCodeElement(document, code)
      expect(elem.tagName).to.equal('PRE');
      expect(elem.firstChild.tagName).to.equal('CODE');
      expect(elem.firstChild.innerHTML).to.equal('&lt;script&gt;&lt;/script&gt;');
    })
  })
})

describe('highlight', () => {
  describe('if text does not include complete code block', () => {
    it('returns given text', () => {
      const examples = [
        'text',
        '<span>text</span>',
        '<p>text<br />```<br />code</p>',
      ];
      examples.forEach((ex) => {
        expect(highlight(ex)).to.equal(ex);
      })
    })
  })

  describe('if text include code block', () => {
    const examples = [
      ["```\n\ncode\n\n```", "<pre><code>\ncode\n\n</code></pre>"],
      ["```\n\ncode\n```", "<pre><code>\ncode\n</code></pre>"],
      ["```\n\ncode\n```\ntext", "<pre><code>\ncode\n</code></pre><p>text</p>"],
      ["text\n```\n\ncode\n\n```", "<p>text</p><pre><code>\ncode\n\n</code></pre>"],
      ["text\n```\n\ncode\n```", "<p>text</p><pre><code>\ncode\n</code></pre>"],
      ["text\n```\n\ncode\n```\ntext", "<p>text</p><pre><code>\ncode\n</code></pre><p>text</p>"],
      ["text\n```\ncode\n\n```", "<p>text</p><pre><code>code\n\n</code></pre>"],
      ["text\n```\ncode\n```", "<p>text</p><pre><code>code\n</code></pre>"],
      ["text\n```\ncode\n```\ntext", "<p>text</p><pre><code>code\n</code></pre><p>text</p>"],
      ["```\ncode\n```", "<pre><code>code\n</code></pre>"],
      [`\`\`\`\n${escapeTextContentForBrowser("<script>alert('hi')</script>")}\n\`\`\``, `<pre><code>&lt;script&gt;alert('hi')&lt;/script&gt;\n</code></pre>`],
      ["text\n```\ncode1\n```\n\ntext2\n```\ncode2\n```", "<p>text</p><pre><code>code1\n</code></pre><p>text2</p><pre><code>code2\n</code></pre>"]
    ];

    const simulateServerSideFormat = (text) => {
      return text.replace(/\r\n?/g, "\n").split(/\n\n+/).map((p) =>
        `<p>${p.replace(/([^\n]\n)(?=[^\n])/g, '$1<br />')}</p>`
      ).join('').replace(/\n/g, '');
    }

    examples.forEach((ex) => {
      const input = simulateServerSideFormat(ex[0]);
      const output = ex[1];
      it(`transforms ${JSON.stringify(input)} into ${JSON.stringify(output)}`, () => {
        expect(highlight(input)).to.equal(output);
      });
    })
  })
})
