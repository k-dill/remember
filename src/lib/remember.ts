export class Remember<T = unknown> {
  private actions: T[] = [];

  /**
   * The current action being remembered. Cannot be set.
   */
  get current(): T | undefined {
    return this.actions[this._cursor];
  }

  private _cursor = -1;

  /**
   * The manged cursor used to track the current action being remembered.
   * When no actions are remembered, cursor will be -1.
   * Otherwise cursor must be zero or greater, and less than length.
   */
  get cursor(): number {
    return this._cursor;
  }

  set cursor(position: number) {
    if (this.length === 0) {
      throw new Error('Cursor cannot be set when length is zero.');
    } else if (position < 0 || position >= this.actions.length) {
      throw new Error(
        'Cursor may only be set to zero or greater, and less than length.'
      );
    } else {
      this._cursor = position;
    }
  }

  /**
   * Gets the length of the remembered actions. This is a number one higher than the highest index.
   */
  get length(): number {
    return this.actions.length;
  }

  /**
   * Clears all remembered actions.
   */
  clear() {
    this.actions = [];
    this._cursor = -1;
  }

  /**
   * Forgets remembered actions, removing and returning them.
   * @param start The starting position of remembered actions to forget.
   */
  forget(start: number): T[] {
    const forgotten = this.actions.splice(start);
    if (start === 0) {
      this._cursor = -1;
    } else {
      this.cursor = start - 1;
    }
    return forgotten;
  }

  /**
   * Shifts the cursor and gets the actions at the designated position.
   * @param position The position of the action.
   */
  get(position?: number): T {
    this.cursor = position ?? this._cursor;
    return this.actions[this._cursor];
  }

  /**
   * Returns the action at the designated position, else undefined.
   * @param position The position of the action.
   */
  peek(position: number): T | undefined {
    return this.actions[position];
  }

  /**
   * Returns the proceeding action, else undefined.
   */
  peekRedo(): T | undefined {
    return this.actions[this.cursor + 1];
  }

  /**
   * Returns the preceding action, else undefined
   */
  peekUndo(): T | undefined {
    return this.actions[this.cursor - 1];
  }

  /**
   * Shifts the cursor, removes the last action remembered and returns it.
   * If no actions are remembered, undefined is returned and remembered actions will not be modified.
   */
  pop(): T | undefined {
    const p = this.actions.pop();
    this._cursor = this.actions.length - 1;
    return p;
  }

  /**
   * Shifts the cursor, appends new actions to be remembered, and returns the new length of the remembered actions.
   * @param actions New actions to remember.
   */
  push(...actions: T[]): number {
    this.actions.push(...actions);
    this.cursor = this.actions.length - 1;
    return this.actions.length;
  }

  /**
   * Shifts the cursor to the proceeding action, and return it.
   */
  redo(): T {
    this.cursor = this._cursor + 1;
    return this.actions[this.cursor];
  }

  /**
   * Shifts the cursor and sets the action at the designated position.
   * @param action Action to be set
   * @param position Optional position to set action at. Defaults to cursor.
   */
  set(action: T, position?: number) {
    this.cursor = position ?? this._cursor;
    this.actions[this._cursor] = action;
  }

  /**
   * Shifts the cursor to the preceding action, and return it.
   */
  undo(): T {
    this.cursor = this._cursor - 1;
    return this.actions[this.cursor];
  }
}
