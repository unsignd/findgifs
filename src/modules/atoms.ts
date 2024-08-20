import { atom } from 'recoil';
import { gifType } from '../types';

const gifListState = atom<gifType[]>({
  key: 'gifListState',
  default: [],
});

const gifSizeState = atom<undefined | number>({
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

const searchQueryState = atom<string | null>({
  key: 'searchQuery',
  default: null,
});

const effectActiveState = atom<boolean>({
  key: 'effectActiveState',
  default: false,
});

export {
  gifListState,
  gifSizeState,
  loadCountState,
  modalActiveState,
  modalIsPromptedState,
  searchQueryState,
  effectActiveState,
};
