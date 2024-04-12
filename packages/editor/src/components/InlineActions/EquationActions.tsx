import React from 'react';
import type { Node } from 'prosemirror-model';
import { nodeNames } from '@curvenote/schema';
import { findParentNode } from '@curvenote/prosemirror-utils';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { updateNodeAttrs } from '../../store/actions';
import { getEditorState } from '../../store/selectors';
import type { Dispatch, State } from '../../store';
import type { ActionProps } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';

function EquationActions(props: ActionProps) {
  const { stateId, viewId } = props;
  const dispatch = useDispatch<Dispatch>();
  const state = useSelector((s: State) => getEditorState(s, stateId)?.state);
  const parent =
    state?.selection &&
    findParentNode((n: Node) => n.type.name === nodeNames.heading)(state?.selection);
  const node = parent?.node ?? getNodeFromSelection(state?.selection);
  const pos = parent?.pos ?? state?.selection?.from;

  if (!node || pos == null) return null;
  // If the node changes, set open label to false
  const { numbered } = node.attrs;

  const onNumbered = () =>
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { numbered: !numbered }, false));

  // Reposition the popper

  return (
    <div className="flex items-center justify-center w-fit text-xl flex-nowrap">
      <MenuIcon kind="numbered" active={numbered} onClick={onNumbered} />
    </div>
  );
}

export default EquationActions;
