export type TChar = {
  char: string;
  state?: "loading" | "load" | undefined;
};

export type TNumber = {
  num: number;
  state?: "loading" | "load" | undefined;
};

export type TStack = {
  elem: string;
  state?: boolean;
};

export type TQueue = {
  elem?: string;
  state?: boolean | null;
};

export interface DisableButtonState {
  addButton: boolean;
  deleteButton: boolean;
  clearButton: boolean;
}

export interface LoadersState {
  addButton: boolean;
  deleteButton: boolean;
  clearButton: boolean;
}


export type TListElement = {
  value: string;
  loading: boolean;
  load: boolean;
  upperCircle: boolean;
  bottomCircle: boolean;
};

export interface LoadersStateList {
  addHead: boolean;
  removeHead: boolean;
  addTail: boolean;
  removeTail: boolean;
  addIndex: boolean;
  removeIndex: boolean;
}

export interface DisableButtonStateList {
  addButton: boolean;
  indexButton: boolean;
  deleteButton: boolean;
}
