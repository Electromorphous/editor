import React from 'react';
import { findParentNode } from '@curvenote/prosemirror-utils';
import type { Node } from 'prosemirror-model';
import { nodeNames } from '@curvenote/schema';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '../Menu/Icon';
import { deleteNode, liftContentOutOfNode, updateNodeAttrs } from '../../store/actions';
import { getEditorState } from '../../store/state/selectors';
import type { Dispatch, State } from '../../store';
import type { ActionProps } from './utils';
import { getNodeFromSelection } from '../../store/ui/utils';

function CalloutActions(props: ActionProps) {
  const { stateId, viewId } = props;
  const dispatch = useDispatch<Dispatch>();

  const selection = useSelector((state: State) => getEditorState(state, stateId)?.state?.selection);
  const parent =
    selection && findParentNode((n: Node) => n.type.name === nodeNames.callout)(selection);
  const node = parent?.node ?? getNodeFromSelection(selection);
  const pos = parent?.pos ?? selection?.from;
  if (!node || pos == null) return null;

  const onKind = (value: string) => () =>
    dispatch(updateNodeAttrs(stateId, viewId, { node, pos }, { kind: value }, false));
  const onDelete = () => dispatch(deleteNode(stateId, viewId, { node, pos }));
  const onLift = () => dispatch(liftContentOutOfNode(stateId, viewId, { node, pos }));

  const { kind } = node.attrs;
  return (
    <div className="items-center justify-center w-fit text-xl flex-nowrap">
      <MenuIcon kind="info" active={kind === 'info'} onClick={onKind('info')} />
      <MenuIcon kind="success" active={kind === 'success'} onClick={onKind('success')} />
      <MenuIcon kind="active" active={kind === 'active'} onClick={onKind('active')} />
      <MenuIcon kind="warning" active={kind === 'warning'} onClick={onKind('warning')} />
      <MenuIcon kind="danger" active={kind === 'danger'} onClick={onKind('danger')} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="lift" onClick={onLift} />
      <MenuIcon kind="divider" />
      <MenuIcon kind="remove" onClick={onDelete} dangerous />
    </div>
  );
}

export default CalloutActions;
