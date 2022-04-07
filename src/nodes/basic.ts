import OrderedMap from 'orderedmap';
import { GenericNode } from 'mystjs';
import { NodeSpec } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import {
  Blockquote,
  Break,
  FlowContent,
  List,
  ListContent,
  ListItem,
  NoAttrs,
  Paragraph,
  PhrasingContent,
  ThematicBreak,
} from '../spec';
import { MyNodeSpec, NodeGroups, Props } from './types';
import { nodeNames } from '../types';

export const doc: NodeSpec = {
  content: `(${NodeGroups.block} | ${NodeGroups.heading} | ${NodeGroups.top})+`,
};

export const docParagraph: NodeSpec = {
  content: 'paragraph',
};

export const docComment: NodeSpec = {
  content: `(${NodeGroups.block} | ${NodeGroups.heading} | ${nodeNames.equation})+`, // browsers will completely collapse the node when it's empty `+` is necessary
};

export const paragraph: MyNodeSpec<NoAttrs, Paragraph> = {
  attrs: {},
  content: `${NodeGroups.inline}*`,
  group: NodeGroups.block,
  parseDOM: [{ tag: 'p' }],
  toDOM() {
    return ['p', 0];
  },
  attrsFromMdastToken: () => ({}),
  toMyst: (props) => ({
    type: 'paragraph',
    children: (props.children || []) as PhrasingContent[],
  }),
};

export const blockquote: MyNodeSpec<NoAttrs, Blockquote> = {
  attrs: {},
  content: `${NodeGroups.block}+`,
  group: NodeGroups.block,
  defining: true,
  parseDOM: [{ tag: 'blockquote' }],
  toDOM() {
    return ['blockquote', 0];
  },
  attrsFromMdastToken: () => ({}),
  toMyst: (props) => ({
    type: 'blockquote',
    children: (props.children || []) as FlowContent[],
  }),
};

/** Horizontal rule */
export const horizontal_rule: MyNodeSpec<NoAttrs, ThematicBreak> = {
  attrs: {},
  group: NodeGroups.block,
  parseDOM: [{ tag: 'hr' }],
  toDOM() {
    return ['hr', { class: 'break' }];
  },
  attrsFromMdastToken: () => ({}),
  toMyst: (): ThematicBreak => ({ type: 'thematicBreak' }),
};

export const text: NodeSpec = {
  group: NodeGroups.inline,
};

export const hard_break: MyNodeSpec<NoAttrs, Break> = {
  attrs: {},
  inline: true,
  group: NodeGroups.inline,
  selectable: false,
  parseDOM: [{ tag: 'br' }],
  toDOM() {
    return ['br'];
  },
  attrsFromMdastToken: () => ({}),
  toMyst: (): Break => ({ type: 'break' }),
};

const listNodes = addListNodes(
  OrderedMap.from({}),
  `paragraph ${NodeGroups.block}*`,
  NodeGroups.block,
) as OrderedMap<MyNodeSpec<any, any>>;

export type OrderedListAttrs = {
  order: number;
};

export const ordered_list = listNodes.get('ordered_list') as MyNodeSpec<OrderedListAttrs, List>;
ordered_list.attrsFromMdastToken = (token: GenericNode) => ({ order: token.start || 1 });
ordered_list.toMyst = (props: Props) => ({
  type: 'list',
  ordered: true,
  // This feels like it should be `start: props.order`, but it
  // is in fact correct as is since we are grabbing these props
  // off the HTML in `convertToMdast`, not the prosemirror node
  // https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L17
  start: props.start || undefined,
  children: (props.children || []) as ListContent[],
});

export const bullet_list = listNodes.get('bullet_list') as MyNodeSpec<NoAttrs, List>;
bullet_list.attrsFromMdastToken = () => ({});
bullet_list.toMyst = (props: Props) => ({
  type: 'list',
  ordered: false,
  children: (props.children || []) as ListContent[],
});

export const list_item = listNodes.get('list_item') as MyNodeSpec<NoAttrs, ListItem>;
list_item.attrsFromMdastToken = () => ({});
list_item.toMyst = (props: Props) => {
  let { children } = props;
  if (children && children.length === 1 && children[0].type === 'paragraph') {
    children = children[0].children;
  }
  return {
    type: 'listItem',
    children: (children || []) as PhrasingContent[],
  };
};
