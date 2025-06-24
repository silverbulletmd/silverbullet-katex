
# SilverBullet KaTeX plug

This plug lets you render LaTeX using code blocks in your SilverBullet markdown files. To achieve this it uses [KaTeX](https://katex.org/), a small subset of LaTeX written in JavaScript.

## Installation

The plug is installed like any other plug using SpaceLua. Just add the following into a your config in the `CONFIG` file.
```lua
config.set {
  plugs = {
    "github:silverbulletmd/silverbullet-katex/katex.plug.js"
  }
}
```

*That's all!*

## Use

Put a latex block in your markdown:

    ```latex
    c = \pm\sqrt{a^2 + b^2}
    ```

And move your cursor outside of the block to live preview it!

**Note:** KaTeX itself is only partially bundled with this plug, the JS is included, but CSS and fonts are fetched from the JSDelivr CDN. This means _this plug will not work without an Internet connection_. The reason for this limitation is that it is not yet possible to distribute font files via plugs, and KaTeX depends on specific web fonts.

## Settings
The plug offers multiple settings to control the behaviour of KaTeX. Just put the following in your `CONFIG` and customize:
```lua
config.set {
  katex = {
    -- To change the default rendering mode to displaystyle, alternatively use `\displaystyle` in the block
    displayMode = true,
    -- To enable some special features KaTeX offers to e.g. allow DOM manipulation
    allowedFeatures = "all",
    -- Alternatively specifiy a list of features. For reference: https://katex.org/docs/options
    allowedFeatures = { "mathVsTextUnits", "commentAtEnd" },
    -- Macros can be globally specified likes this. Make sure to escape the backslash
    macros = {
      { macro = "\\coolR", expansion = "\\mathbb{R}" }
    }
  }
}
```

## Build
Assuming you have Deno and SilverBullet installed, simply build using:

```shell
deno task build
```

Then, copy the locally build `katex.plug.js` to the `_plug/` folder in your space.
