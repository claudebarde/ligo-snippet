import config from "../config";

const { watermark } = config;

export default `
:root {
    --hover-grey: #f2f2f2;
    --ligo-blue: #3f90ff;
    --editor-padding: 20px;
    --editor-border-radius: 25px;
    --editor-bg-color: #f7fcff;
    --line-numbers-width: 40px;
}

.${watermark}-container {
    position: relative;
    width: 100%;
}

.${watermark}-buttons {
    display: flex;
    justify-content: space-between;
    padding: 20px;
}
.${watermark}-buttons button {
    appearance: none;
    cursor: pointer;
    border: none;
    background-color: white;
    outline: none;
    padding: 16px;
    font-size: 1rem;
    border-bottom: 3px solid transparent;
    border-radius: 0.4rem;
    transition: 0.3s;
    position: relative;
}
.${watermark}-buttons button:hover {
    background-color: var(--hover-grey);
}
.${watermark}-buttons button.selected {
    color: var(--ligo-blue);
    border-bottom: 3px solid var(--ligo-blue);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.${watermark}-buttons button.${watermark}-ligo {
    background-color: var(--ligo-blue);
    color: white;
    border-bottom: none;
    margin: 0px 5px;
}
.${watermark}-buttons button.${watermark}-ligo:hover {
    background-color: var(--ligo-blue);
}

#${watermark}-editor-wrapper {
    position: relative;
    width: calc(100% - var(--editor-padding) * 2);
    display: flex;
    flex-direction: column;
    height: calc(350px + var(--editor-padding) * 2);
}

#${watermark}-editor-renderer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin: 0;
    height: 100%;
    position: relative;
}

#${watermark}-line-numbers {
    z-index: 10;
    width: var(--line-numbers-width);
    height: calc(350px + var(--editor-padding));
    padding-top: var(--editor-padding);
    line-height: 20px;
    letter-spacing: normal;
    font-size: 10px;
    overflow: hidden;
    text-align: center;
    background: var(--editor-bg-color);
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    border-top-left-radius: var(--editor-border-radius);
    border-bottom-left-radius: var(--editor-border-radius);
  }
#${watermark}-line-numbers ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
}

#${watermark}-editor,
#${watermark}-editor-input {
    position: absolute;
    top: 0px;
    left: 0px;
    line-height: 20px;
    margin: 0;
    margin-left: 30px;
    padding: var(--editor-padding);
    border-top-right-radius: var(--editor-border-radius);
    border-bottom-right-radius: var(--editor-border-radius);
    height: 350px;
    width: calc(100% - var(--line-numbers-width));
    tab-size: 4;
    letter-spacing: normal;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    overflow: auto;
}
#${watermark}-editor {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    font-family: "Source Code Pro", monospace;
    color: black;
    background: var(--editor-bg-color);
    z-index: 10;
}
#${watermark}-editor-input {
    border: none;
    background-color: transparent;
    outline: none;
    color: transparent;
    caret-color: black;
    z-index: 100;
    resize: none;
}

#${watermark}-compile-error {
    padding: 20px;
    color: #f87171;
    background-color: #fef2f2;
    width: calc(100% - var(--line-numbers-width) * 2);
    overflow: auto;
    margin: 0px 30px;
}
`;
