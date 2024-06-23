import { atom } from 'recoil';
import { gifType } from '../types';

const gifListState = atom<gifType[]>({
  key: 'gifListState',
  default: [],
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
  modalActiveState,
  modalIsPromptedState,
  loadedContentState,
  searchQueryState,
};
