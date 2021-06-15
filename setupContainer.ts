import styles from "./styles/styles";
import config from "./config";

const syntaxButton = (name: string): HTMLButtonElement => {
  const button = document.createElement("button");
  button.innerText = name;
  button.classList.add("flavour-button");
  button.setAttribute("data-value", name.toLowerCase());
  button.id = `${config.watermark}-${name.toLowerCase()}-button`;
  if (name.toLowerCase() === config.initialFlavour) {
    button.classList.add("selected");
  }

  return button;
};

const addCSS = (s: string) =>
  (document.head.appendChild(document.createElement("style")).innerHTML = s);

export default (containerId: string, containerClass?: string) => {
  const { watermark } = config;
  // sets up the CSS
  addCSS(styles);
  const container = document.getElementById(containerId);
  if (container) {
    container.classList.add(`${watermark}-container`);
    // sets up the buttons
    const buttons = document.createElement("div");
    buttons.classList.add(`${watermark}-buttons`);
    const buttonsLeft = document.createElement("div");
    buttonsLeft.append(
      syntaxButton("CameLigo"),
      syntaxButton("PascaLigo"),
      syntaxButton("ReasonLigo"),
      syntaxButton("JsLigo"),
      syntaxButton("Michelson")
    );
    const buttonsRight = document.createElement("div");
    const runButton = document.createElement("button");
    runButton.innerText = "Run";
    runButton.id = `${watermark}-run-button`;
    runButton.classList.add(`${watermark}-ligo`);
    const openInIdeButton = document.createElement("button");
    openInIdeButton.innerText = "Open in IDE";
    openInIdeButton.id = `${watermark}-open-in-ide-button`;
    openInIdeButton.classList.add(`${watermark}-ligo`);
    buttonsRight.append(runButton, openInIdeButton);
    buttons.append(buttonsLeft, buttonsRight);
    container.appendChild(buttons);
    // sets up the container
    const editorWrapper = document.createElement("div");
    editorWrapper.id = `${watermark}-editor-wrapper`;
    const editorRenderer = document.createElement("div");
    editorRenderer.id = `${watermark}-editor-renderer`;
    const lineNumbers = document.createElement("div");
    lineNumbers.id = `${watermark}-line-numbers`;
    const codeRendering = document.createElement("code");
    codeRendering.id = `${watermark}-editor`;
    const codePre = document.createElement("pre");
    codePre.appendChild(codeRendering);
    editorRenderer.append(lineNumbers, codePre);
    editorWrapper.appendChild(editorRenderer);
    const textarea = document.createElement("textarea");
    textarea.id = `${watermark}-editor-input`;
    textarea.spellcheck = false;
    editorWrapper.appendChild(textarea);
    container.appendChild(editorWrapper);
    const errorsDiv = document.createElement("div");
    errorsDiv.id = `${watermark}-compile-error`;
    container.appendChild(errorsDiv);
  } else {
    console.error("No container with this ID");
  }
};
