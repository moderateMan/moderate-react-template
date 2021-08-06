# rehype-components

Experimental [**rehype**][rehype] plugin to render components, which are
actually custom elements in HTML that get replaced by the output of a component
rendering function.

A component's rendering function receives the custom element's attributes and
children, and it produces a new HTML tree as its output.

## Installation

The module is experimental and isn't published on NPM yet, but can be installed
directly from the GitHub repository.

```sh
npm install marekweb/rehype-components
```

```js
const rehypeComponents = require("rehype-components");
```

## Example

Attach the plugin:

```js
unified()
  // ...
  .use(rehypeComponents, {
    components: {
      "documentation-page": DocumentationPage,
      "info-box": InfoBox,
      "copyright-notice": CopyrightNotice,
    },
  });
// ...
```

Input HTML, with custom elements `documentation-page`, `info-box`, and
`copyright-notice`:

```html
<documentation-page title="Welcome">
  <info-box title="Reminder">Don't forget to run npm install</info-box>
  <p>Lorem ipsum...</p>
  <copyright-notice year="2020"></copyright-notice>
</documentation-page>
```

Here's the implementation of the above components, using [hastscript][] to
create a new HAST tree.

Components receive properties (elements attributes) and children, and they can
wrap or modify the children tree.

```js
const h = require("hastscript");

const DocumentationPage = (properties, children) =>
  h("article.documentation", [h("h1", properties.title), ...children]);

const CopyrightNotice = (properties, children) =>
  h("footer.notice", `© ${properties.year}`);

const InfoBox = (properties, children) =>
  h(
    ".infobox",
    h(".infobox-title", properties.title || "Info"),
    h(".infobox-body", children)
  );
```

Output:

```html
<article class="documentation">
  <h1>Welcome</h1>
  <div class="infobox">
    <div class="infobox-title">Reminder</div>
    <div class="infobox-body">Don't forget to run npm install</div>
  </div>
  <p>Lorem ipsum...</p>
  <footer class="notice">© 2020</footer>
</article>
```

[rehype]: https://github.com/rehypejs/rehype
[hastscript]: https://github.com/syntax-tree/hastscript
