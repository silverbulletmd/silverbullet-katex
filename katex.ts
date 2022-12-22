
export function widget(
  bodyText: string,
): { html: string; script: string } {
  return {
    html: `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css" crossorigin="anonymous">
    <div id="katex"></div>
    <div id="formula" style="display: none;">${bodyText.replaceAll("<", "&lt;")}</div>`,
    script: `
    loadJsByUrl("https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js").then(() => {
      katex.render(document.getElementById("formula").innerText, document.getElementById("katex"));
      updateHeight();
    });
    document.addEventListener("click", () => {
      api({type: "blur"});
    });
    `,
  };
}
