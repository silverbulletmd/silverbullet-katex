import { editor, system } from "@silverbulletmd/silverbullet/syscalls";
import katex, { StrictFunction, Token } from "katex";
import * as v from "valibot";

const katexFeatures = ["unknownSymbol", "unicodeTextInMathMode", "mathVsTextUnits", "commentAtEnd", "htmlExtension", "newLineInDisplayMode"] as const;

const settingsSchema = v.strictObject({
  displayMode: v.optional(v.boolean("Expected boolean for displayMode option"), false),
  allowedFeatures: v.optional(
    v.union([
      v.array(v.picklist(katexFeatures, "Expected valid KaTeX feature under allowedFeatures")),
      v.literal("all")
    ], "Expected array of features or string 'all' to allow all features"),
    () => []
  ),
  macros: v.optional(v.array(v.strictObject({
    macro: v.string("Expected string for macro key of macro definiton"),
    expansion: v.string("Expected string for expansion key of macro definiton")
  })), [])
}, "Unknown entry in settings expected nothing");

type KatexFeatures = typeof katexFeatures[number];
type Settings = v.InferOutput<typeof settingsSchema>;

// Global error message store
const messagesShown = new Set<number>();

function hashString(input: string): number {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash;
  }

  return hash;
}

export async function widget(
  bodyText: string,
): Promise<{ html: string; script: string }> {
  const config = await system.getConfig("katex", {});
  const result = v.safeParse(settingsSchema, config);

  let settings: Settings;
  if (!result.success) {
    settings = v.parse(settingsSchema, {});

    for (const issue of result.issues) {
      const hash = hashString(`${issue.message} ${issue.received}`);
      if (messagesShown.has(hash)) continue;

      messagesShown.add(hash);
      await editor.flashNotification(
        `There is an error in you KaTeX config: ${issue.message}, but received '${issue.received}'`,
        "error",
      );
    }
  } else settings = result.output;

  const formula = katex.renderToString(bodyText, {
    trust: true,
    throwOnError: false,
    displayMode: settings.displayMode,
    macros: settings.macros.reduce((acc, x) => {
      return { ...acc, [x.macro]: x.expansion };
    }, {} as Record<string, string>),
    strict: (code: KatexFeatures, msg: string, _: Token): ReturnType<StrictFunction> => {
      if (settings.allowedFeatures === "all" || settings.allowedFeatures.includes(code)) return "ignore";

      const hash = hashString(`${bodyText} ${msg}`);
      if (messagesShown.has(hash)) return "error";

      messagesShown.add(hash);
      editor.flashNotification(
        `KaTeX warning: ${msg}`,
        "error",
      );

      return "error";
    }
  });

  /**
   * Set document height to a 100% and then unset it again, because shortly
   * after the html is added to the iframe, the height is automatically updated
   * by silverbullets js. We want to avoid that, because during that time
   * the stylesheet isn't yet loaded and the formula div still hidden thus the
   * body has a height of 0px. That means that during load the height would
   * shortly shrink and then settle again when we manually update the height.
   * We want to avoid that, by tricking the automatic updateHeight into thinking
   * the body has the same size as the inital iframe */
  return {
    html: `
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css" crossorigin="anonymous" onload="document.getElementById('formula').hidden = false; document.documentElement.style.height = null; updateHeight();">
      <div id="formula" hidden>${formula}</div>
    `,
    script: "document.documentElement.style.height = '100%'",
  };
}
