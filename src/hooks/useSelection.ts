import { useState } from 'react';
import memoizeOne from 'memoize-one';
import { createStateSetter } from '~/utils';

// toggleSelected(item) toggles item into/out of selection
const memoizedToggle = memoizeOne((selection, setSelection, item) => {
  if (selection.includes(item)) {
    setSelection(selection.filter((i) => i !== item));
  } else {
    setSelection([...selection, item]);
  }
});

export const useSelection = () => {
  const [selectionState, setSelectionState] = useState({
    selection: [],
  });

  const { selection } = selectionState;

  // setters
  const setSelection = createStateSetter(setSelectionState)('selection');

  // isSelected(item) => true/false
  const isSelected = (item) => selection.includes(item);

  // toggleSelected(item) toggles item into/out of selection
  const toggleSelected = (item) =>
    memoizedToggle(selection, setSelection, item);

  return {
    isSelected,
    selection,
    setSelection,
    toggleSelected,
  };
};
