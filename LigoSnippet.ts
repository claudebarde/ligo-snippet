import setupContainer from "./setupContainer";
import config from "./config";
import Prism from "./Prism/prism";
import YAML from "./YAML/yaml.js";
import {
  cameligoCode,
  pascaligoCode,
  reasonligoCode
} from "./ligoDefaultCodes";

// TYPES
type LigoFlavour =
  | "cameligo"
  | "reasonligo"
  | "pascaligo"
  | "jsligo"
  | "michelson";
interface SnippetData {
  language: LigoFlavour;
  code: string;
  name: string;
  theme: string;
  height: string;
}
interface EditorParams {
  editor: {
    title: string;
    language: LigoFlavour;
    code: string;
    dirty: boolean;
  };
  compile?: {
    entrypoint: string;
  };
  dryRun?: {
    entrypoint: string;
    parameters: string;
    storage: string;
  };
  deploy?: {
    entrypoint: string;
    storage: string;
  };
  evaluateValue?: {
    entrypoint: string;
  };
  evaluateFunction?: {
    entrypoint: string;
    parameters: string;
  };
}

export default class LigoSnippet {
  containerId: string;
  numberOfLines: number;
  currentCode: string;
  editorInputElement: HTMLTextAreaElement;
  editorRendererElement: HTMLElement;
  lineNumbersColumn: HTMLElement;
  currentFlavour: LigoFlavour;
  editorParams: EditorParams;
  michelson: string;
  compileError: string;
  CONFIG_REGEX = /\(\*_\*([^]*?)\*_\*\)\s*/;

  constructor(
    _containerId: string,
    initialCode?: string,
    containerClass?: string
  ) {
    // sets up the ligo snippet container
    this.containerId = _containerId;
    this.numberOfLines = 0;
    this.currentFlavour = "cameligo";
    this.currentCode = initialCode ? initialCode : "";
    this.editorParams = this.parseEditorConfigs({
      language: this.currentFlavour,
      code: this.currentCode.trim(),
      name: this.currentFlavour + " contract",
      theme: "light",
      height: ""
    });
    // adds ligo syntax support
    Prism.languages = this.addLigoFlavours(Prism.languages);
    setupContainer(this.containerId, containerClass);
    this.editorInputElement = document.getElementById(
      `${config.watermark}-editor-input`
    ) as HTMLTextAreaElement;
    this.editorRendererElement = document.getElementById(
      `${config.watermark}-editor`
    );
    this.lineNumbersColumn = document.getElementById(
      `${config.watermark}-line-numbers`
    );
    // attaches events listener
    // textarea events
    this.editorInputElement.addEventListener("input", this.typeCode);
    this.editorInputElement.addEventListener("scroll", this.syncScrolling);
    // buttons events
    [...document.getElementsByClassName("flavour-button")].forEach(button => {
      button.addEventListener("click", this.changeCurrentFlavour);
    });
    document
      .getElementById(`${config.watermark}-open-in-ide-button`)
      .addEventListener("click", this.openInIde);
    document
      .getElementById(`${config.watermark}-run-button`)
      .addEventListener("click", this.compileCode);
  }

  /*
   * Changes current Ligo flavour
   */
  changeCurrentFlavour = (event: Event) => {
    const flavour = (event.target as HTMLButtonElement).getAttribute(
      "data-value"
    ) as LigoFlavour;
    this.currentFlavour = flavour;
    [...document.getElementsByClassName("flavour-button")].forEach(button => {
      button.classList.remove("selected");
    });
    document
      .getElementById(`${config.watermark}-${flavour.toLowerCase()}-button`)
      .classList.add("selected");
  };

  /*
   * Processes input by user
   */
  typeCode = (event: Event) => {
    const code = (event.target as HTMLTextAreaElement).value;
    this.generateLineNumbers(code);
    // renders code
    // uses <br> because Prism doesn't keep last empty line
    this.editorRendererElement.innerHTML = this.highlight(code) + "<br />";
    this.editorParams.editor.code = code;
    this.currentCode = code;
  };

  /*
   * Generates line numbers
   */
  generateLineNumbers = (code: string) => {
    this.numberOfLines = code.split(/\r\n|\r|\n/).length + 4;
    this.lineNumbersColumn.innerHTML = "";
    for (let i = 1; i <= this.numberOfLines; i++) {
      const newLine = document.createElement("div");
      newLine.id = `${config.watermark}-line-number-${i}`;
      newLine.innerText = i.toString();
      this.lineNumbersColumn.appendChild(newLine);
    }
  };

  private getLanguageHighlight = language => {
    switch (language) {
      case "cameligo":
        return Prism.languages.cameligo;
      case "reasonligo":
        return Prism.languages.reasonligo;
      case "pascaligo":
        return Prism.languages.pascaligo;
      case "michelson":
        return Prism.languages.michelson;
      default:
        return Prism.languages.clike;
    }
  };

  /*
   * Highlight code with Prism
   */
  private highlight = (code: string) => {
    return Prism.highlight(
      code,
      this.getLanguageHighlight(this.currentFlavour),
      this.currentFlavour
    );
  };

  private syncScrolling = (event: Event) => {
    const scrollPos = (event.target as HTMLTextAreaElement).scrollTop;
    this.editorRendererElement.scrollTop = scrollPos;
    this.lineNumbersColumn.scrollTop = scrollPos;
  };

  /*
   * Opens input code in the Ligo web IDE
   */
  openInIde = async () => {
    this.editorParams = this.parseEditorConfigs({
      language: this.currentFlavour,
      code: this.currentCode.trim(),
      name: this.currentFlavour + " contract",
      theme: "light",
      height: ""
    });
    try {
      let webIdeUrl = "https://ide.ligolang.org";
      const response = await fetch(`${webIdeUrl}/api/share`, {
        method: "post",
        body: JSON.stringify(this.editorParams),
        headers: [
          ["Access-Control-Allow-Origin", "*"],
          ["Content-Type", "application/json"],
          ["Accept", "application/json"]
        ]
      });
      const { hash } = await response.json();
      window.open(`${webIdeUrl}/p/${hash}`, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Compiles the input code
   */
  compileCode = async () => {
    try {
      const entrypoint = "main",
        syntax = this.editorParams.editor.language,
        code = this.editorParams.editor.code;
      const response = await fetch(
        "https://ide-staging.ligolang.org/api/compile-contract",
        {
          method: "post",
          body: JSON.stringify({
            syntax,
            code,
            entrypoint
          }),
          headers: [
            ["Access-Control-Allow-Origin", "*"],
            ["Content-Type", "application/json"],
            ["Accept", "application/json"]
          ]
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        if (data.hasOwnProperty("result")) {
          this.michelson = data.result;
        } else {
          throw "No result property";
        }
      } else if (response.status === 400) {
        const data = await response.json();
        if (data.hasOwnProperty("error")) {
          this.compileError = data.error;
        } else {
          throw "No error property";
        }
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
    }
  };

  private addLigoFlavours = prismLanguages => ({
    ...prismLanguages,
    pascaligo: {
      comment: [
        /\(\*[\s\S]+?\*\)/,
        // /\{[\s\S]+?\}/,
        /\/\/.*/
      ],
      string: {
        pattern: /(?:'(?:''|[^'\r\n])*'|#[&$%]?[a-f\d]+)+|\^[a-z]/i,
        greedy: true
      },
      keyword: [
        {
          // Turbo Pascal
          pattern: /(^|[^&])\b(?:absolute|array|asm|begin|case|const|constructor|destructor|do|downto|else|end|file|for|function|goto|if|implementation|inherited|inline|interface|label|nil|object|of|operator|packed|procedure|program|record|reintroduce|repeat|self|set|string|then|to|type|unit|until|uses|var|while|with)\b/i,
          lookbehind: true
        },
        {
          // Free Pascal
          pattern: /(^|[^&])\b(?:dispose|exit|false|new|true)\b/i,
          lookbehind: true
        },
        {
          // Object Pascal
          pattern: /(^|[^&])\b(?:class|dispinterface|except|exports|finalization|finally|initialization|inline|library|on|out|packed|property|raise|resourcestring|threadvar|try)\b/i,
          lookbehind: true
        },
        {
          // Modifiers
          pattern: /(^|[^&])\b(?:absolute|abstract|alias|assembler|bitpacked|break|cdecl|continue|cppdecl|cvar|default|deprecated|dynamic|enumerator|experimental|export|external|far|far16|forward|generic|helper|implements|index|interrupt|iochecks|local|message|name|near|nodefault|noreturn|nostackframe|oldfpccall|otherwise|overload|override|pascal|platform|private|protected|public|published|read|register|reintroduce|result|safecall|saveregisters|softfloat|specialize|static|stdcall|stored|strict|unaligned|unimplemented|varargs|virtual|write)\b/i,
          lookbehind: true
        }
      ],
      number: [
        // Hexadecimal, octal and binary
        /(?:[&%]\d+|\$[a-f\d]+)/i,
        // Decimal
        /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?/i
      ],
      operator: [
        /\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=]/i,
        {
          pattern: /(^|[^&])\b(?:and|as|div|exclude|in|include|is|mod|not|or|shl|shr|xor)\b/,
          lookbehind: true
        }
      ],
      punctuation: /\(\.|\.\)|[()\[\]:;,.]/
    },
    reasonligo: {
      ...prismLanguages.reason,
      comment: [/(^|[^\\])\/\*[\s\S]*?\*\//, /\(\*[\s\S]*?\*\)/, /\/\/.*/]
    },
    cameligo: {
      ...prismLanguages.ocaml,
      comment: [/(^|[^\\])\/\*[\s\S]*?\*\//, /\(\*[\s\S]*?\*\)/, /\/\/.*/]
    }
  });

  private parseEditorConfigs = (data: SnippetData): EditorParams => {
    const match = data.code.match(this.CONFIG_REGEX);

    if (!match || !match[1]) {
      return {
        editor: {
          title: data.name,
          language: data.language,
          code: data.code,
          dirty: false
        },
        compile: {
          entrypoint: "main"
        }
      };
    }

    try {
      const config = YAML.load(match[1].trim());

      return {
        editor: {
          title: config.name,
          language: config.language,
          code: data.code.replace(this.CONFIG_REGEX, ""),
          dirty: false
        },
        compile: {
          entrypoint: config.compile.entrypoint
        },
        dryRun: {
          entrypoint: config.dryRun.entrypoint,
          parameters: config.dryRun.parameters,
          storage: config.dryRun.storage
        },
        deploy: {
          entrypoint: config.deploy.entrypoint,
          storage: config.deploy.storage
        },
        evaluateValue: {
          entrypoint: config.evaluateValue.entrypoint
        },
        evaluateFunction: {
          entrypoint: config.evaluateFunction.entrypoint,
          parameters: config.evaluateFunction.parameters
        }
      };
    } catch (err) {
      throw new Error(`Unable to parse configuration: ${err}`);
    }
  };
}
