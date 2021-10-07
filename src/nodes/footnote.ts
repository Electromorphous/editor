import { FormatSerialize, MyNodeSpec } from './types';

const footnote: MyNodeSpec<any> = {
  attrs: {},
  group: 'inline',
  content: 'inline*',
  inline: true,
  draggable: true,
  // This makes the view treat the node as a leaf, even though it
  // technically has content
  atom: true,
  toDOM: () => ['footnote', 0],
  parseDOM: [{ tag: 'footnote' }],
};

export const toMarkdown: FormatSerialize = (state, node) => {
  state.write('footnote markdown translation not supported');
  state.ensureNewLine();
};

export const toTex: FormatSerialize = (state, node) => {
  state.write('footnote tex translation is not supported');
  state.ensureNewLine();
};

export default footnote;
