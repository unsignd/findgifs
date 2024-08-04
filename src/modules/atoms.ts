import { atom } from 'recoil';
import { gifType } from '../types';

const gifListState = atom<gifType[]>({
  key: 'gifListState',
  default: [],
});

const gifSizeState = atom<number>({
  key: 'gifSizeState',
  default: undefined,
});

const loadCountState = atom<number>({
  key: 'loadCountState',
  default: 0,
});

const modalActiveState = atom<boolean>({
  key: 'modalActiveState',
  default: false,
});

const modalIsPromptedState = atom<boolean>({
  key: 'modalIsPromptedState',
  default: false,
});

const loadedContentState = atom<number>({
  key: 'loadedContentState',
  default: 0,
});

const searchQueryState = atom<string | null>({
  key: 'searchQuery',
  default: null,
});

export {
  gifListState,
  gifSizeState,
  loadCountState,
  modalActiveState,
  modalIsPromptedState,
  loadedContentState,
  searchQueryState,
};
