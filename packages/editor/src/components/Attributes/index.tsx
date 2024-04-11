import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import isEqual from 'lodash.isequal';
// import {
//   TextField,
//   makeStyles,
//   Theme,
//   createStyles,
//   Popover,
//   Paper,
//   Typography,
// } from '@material-ui/core';
// import { Popover } from 'shadcn/components/ui/popover';
import { schemas } from '@curvenote/schema';
import type { State, Dispatch } from '../../store/types';
import { closeAttributeEditor, updateNodeAttrs } from '../../store/actions';
import {
  getEditorUI,
  getAttributeEditorLocation,
  showAttributeEditor,
  getNodeAttrs,
  getEditorState,
  getAttributeEditorPos,
} from '../../store/selectors';
import { isEditable } from '../../prosemirror/plugins/editable';

const HEIGHT = 300;

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       backgroundColor: '#fff',
//       padding: theme.spacing(1),
//       width: 300,
//       maxHeight: HEIGHT,
//       overflowY: 'scroll',
//       overscrollBehavior: 'none',
//       '& > *': {
//         margin: theme.spacing(1),
//         width: 'calc(100% - 15px)',
//       },
//     },
//   }),
// );

export const NODES_WITH_ATTRS = new Set(Object.keys(schemas.reactiveNodes));

function Attributes() {
  // const classes = useStyles();
  const dispatch = useDispatch<Dispatch>();

  const stateKey = useSelector((state: State) => getEditorUI(state).stateId);
  const pos = useSelector((state: State) => getAttributeEditorPos(state));
  const show = useSelector((state: State) => showAttributeEditor(state));
  const { node, editing } = useSelector((state: State) => {
    const editorState = getEditorState(state, stateKey).state;
    const blank = { node: null, editing: isEditable(editorState) };
    if (!editorState || !show) return blank;
    const potentialNode = editorState.doc.resolve(pos).nodeAfter;
    if (potentialNode == null || !NODES_WITH_ATTRS.has(potentialNode.type.name)) return blank;
    return { node: potentialNode, editing: blank.editing };
  }, isEqual);
  const location = useSelector((state: State) => getAttributeEditorLocation(state), isEqual);

  const attrs = useSelector((state: State) =>
    node ? getNodeAttrs(state, stateKey, pos) ?? {} : {},
  );
  const keys = Object.keys(attrs);

  const onChange = useCallback(
    (key: string, value: string) => {
      if (node == null) return;
      dispatch(updateNodeAttrs(stateKey, null, { node, pos }, { [key]: value }));
    },
    [dispatch, stateKey, node, pos],
  );
  const onClose = useCallback(() => dispatch(closeAttributeEditor()), []);

  if (!editing || !location || node == null || keys.length === 0) return null;

  const title = `${node.type.name[0].toUpperCase()}${node.type.name.slice(1)} Settings`;

  return (
    // <Popover
    //   open={show}
    //   anchorReference="anchorPosition"
    //   anchorPosition={location}
    //   onClose={onClose}
    // >
    <div
      style={{
        backgroundColor: '#fff',
        padding: 4,
        width: 300,
        maxHeight: HEIGHT,
        overflowY: 'scroll',
        overscrollBehavior: 'none',
        border: '1px solid red',
      }}
    >
      Attributes popover
      <h2>{title}</h2>
      {keys.map((key) => {
        const value = attrs[key];
        return (
          <div>
            <label htmlFor="key">{key}</label>
            <textarea
              key={key}
              id={key}
              value={value}
              onChange={(event: any) => onChange(key, event.target.value)}
              onBlur={(event: any) => onChange(key, event.target.value)}
            />
          </div>
        );
      })}
    </div>
    // </Popover>
  );
}

export default Attributes;
