import anyTest, { TestInterface } from 'ava';

import { Remember } from './remember';

const test = anyTest as TestInterface<Remember>;

test.beforeEach((t) => {
  t.context = new Remember();
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test API
/////////////////////////////////////////////////////////////////////////////////////////
test('field current exists', (t) => {
  t.assert('current' in t.context);
});

test('field cursor exists', (t) => {
  t.assert('cursor' in t.context);
});

test('field length exists', (t) => {
  t.assert('length' in t.context);
});

test('fn clear() exists', (t) => {
  t.assert('clear' in t.context);
});

test('fn forget() exists', (t) => {
  t.assert('forget' in t.context);
});

test('fn get() exists', (t) => {
  t.assert('get' in t.context);
});

test('fn peek() exists', (t) => {
  t.assert('peek' in t.context);
});

test('fn peekUndo() exists', (t) => {
  t.assert('peekUndo' in t.context);
});

test('fn peekRedo() exists', (t) => {
  t.assert('peekRedo' in t.context);
});

test('fn pop() exists', (t) => {
  t.assert('pop' in t.context);
});

test('fn push() exists', (t) => {
  t.assert('push' in t.context);
});

test('fn redo() exists', (t) => {
  t.assert('redo' in t.context);
});

test('fn set() exists', (t) => {
  t.assert('set' in t.context);
});

test('fn undo() exists', (t) => {
  t.assert('undo' in t.context);
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test length
/////////////////////////////////////////////////////////////////////////////////////////
test('length should be zero when nothing is remembered', (t) => {
  t.is(t.context.length, 0);
});

test('length should return the number of actions remembered', (t) => {
  t.context.push('a', 'b', 'c');
  t.is(t.context.length, 3);
});

test('after fn clear() length should be 0', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.clear();
  t.is(t.context.length, 0);
});

test('after fn forget() length should be equal to number of actions forgotten', (t) => {
  t.context.push('a', 'b', 'c', 'd');
  t.context.forget(2);
  t.is(t.context.length, 2);
});

test('after fn pop() length should be 1 less than undo', (t) => {
  t.context.push('a', 'b', 'c');
  const expected = t.context.length - 1;
  t.context.pop();
  t.is(t.context.length, expected);
});

test('after fn push() length is equal to number of actions remembered', (t) => {
  t.context.push('a', 'b');
  t.is(t.context.length, 2);
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test cursor
/////////////////////////////////////////////////////////////////////////////////////////
test('cursor initially should be -1', (t) => {
  t.is(t.context.cursor, -1);
});

test('cursor should throw error when length is 0 and cursor is set', (t) => {
  try {
    t.context.cursor = 1;
    t.fail();
  } catch (e) {
    t.pass();
  }
});

test('cursor should throw error when length is 0 and cursor is set to anything other than -1', (t) => {
  try {
    t.context.cursor = 2;
    t.fail();
  } catch (e) {
    t.pass();
  }
});

test('cursor should throw error when setting value to length or greater', (t) => {
  try {
    t.context.push('a', 'b');
    t.context.cursor = t.context.length;
    t.fail();
  } catch (e) {
    t.pass();
  }
});

test('cursor should throw error when length is greater than zero and setting value to less than zero', (t) => {
  try {
    t.context.push('a', 'b');
    t.context.cursor = -1;
    t.fail();
  } catch (e) {
    t.pass();
  }
});

test('after fn clear() cursor should be -1', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.clear();
  t.is(t.context.cursor, -1);
});

test('after fn forget() cursor should update to 1 less than starting position passed', (t) => {
  const start = 2;
  const expected = start - 1;
  t.context.push('a', 'b', 'c', 'd');
  t.context.forget(start);
  t.is(t.context.cursor, expected);
});

test('after fn forget(), and when 0 is passed as start, cursor should update to -1', (t) => {
  const start = 0;
  t.context.push('a', 'b', 'c', 'd');
  t.context.forget(start);
  t.is(t.context.cursor, -1);
});

test('after fn get() cursor should update to the position passed', (t) => {
  t.context.push('a', 'b', 'c');
  const position = 1;
  t.context.get(position);
  t.is(t.context.cursor, position);
});

test('after fn peek() cursor should be unchanged', (t) => {
  const expected = t.context.cursor;
  t.context.peek(100);
  t.is(t.context.cursor, expected);
});

test('after fn peekRedo() cursor should be unchanged', (t) => {
  const expected = t.context.cursor;
  t.context.peekRedo();
  t.is(t.context.cursor, expected);
});

test('after fn peekUndo() cursor should be unchanged', (t) => {
  const expected = t.context.cursor;
  t.context.peekUndo();
  t.is(t.context.cursor, expected);
});

test('after fn pop() cursor should be equal to length - 1', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.pop();
  t.is(t.context.cursor, t.context.length - 1);
});

test('after fn pop() cursor should be -1 when nothing remains', (t) => {
  t.context.push('a');
  t.context.pop();
  t.is(t.context.cursor, -1);
});

test('after fn push() cursor should be equal to length - 1', (t) => {
  t.context.push('a', 'b');
  t.is(t.context.cursor, t.context.length - 1);
});

test('after fn redo() cursor should be increased by 1', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.cursor = 1;
  const expected = t.context.cursor + 1;
  t.context.redo();
  t.is(t.context.cursor, expected);
});

test('after fn set() cursor should be the same as position passed', (t) => {
  t.context.push('a', 'b', 'c');
  const expected = 1;
  t.context.set('z', expected);
  t.is(t.context.cursor, expected);
});

test('after fn set() when no position is passed cursor should be unchanged', (t) => {
  t.context.push('a', 'b', 'c');
  const expected = t.context.cursor;
  t.context.set('z');
  t.is(t.context.cursor, expected);
});

test('after fn undo() cursor should be decreased by 1', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.cursor = 1;
  const expected = t.context.cursor - 1;
  t.context.undo();
  t.is(t.context.cursor, expected);
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test current
/////////////////////////////////////////////////////////////////////////////////////////
test('current initially should be undefined', (t) => {
  t.is(t.context.current, undefined);
});

test('after fn clear() current should be undefined', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.clear();
  t.is(t.context.current, undefined);
});

test('after fn push() current should be the most recent memory', (t) => {
  t.context.push('a', 'b', 'c');
  t.is(t.context.current, 'c');
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn clear()
/////////////////////////////////////////////////////////////////////////////////////////

// Testing length above already covers this

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn forget()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn forget() should return actions from starting position to end of remembered actions', (t) => {
  t.context.push('a', 'b', 'c', 'd');
  const forgotten = t.context.forget(2);
  t.deepEqual(forgotten, ['c', 'd']);
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn get()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn get() should return value at position', (t) => {
  t.context.push('a', 'b', 'c');
  t.is(t.context.get(1), 'b');
});

test('fn get() should return value at current cursor when no position is provided ', (t) => {
  t.context.push('a', 'b', 'c');
  t.is(t.context.get(), 'c');
});

test('fn get() should throw error when passed out of bounds position', (t) => {
  try {
    t.context.push('a', 'b');
    t.context.get(100);
    t.fail();
  } catch (e) {
    t.pass();
  }
});

test('fn get() should throw error when length is zero', (t) => {
  try {
    t.context.get();
    t.fail();
  } catch (e) {
    t.pass();
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn peek()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn peek() should return memory at requested position', (t) => {
  t.context.push('a', 'b', 'c');
  const actual = t.context.peek(2);
  t.is(actual, 'c');
});

test('fn peek() should return undefined when accessing out of bound memories', (t) => {
  const actual = t.context.peek(1000);
  t.is(actual, undefined);
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn peekRedo()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn peekRedo() should return undefined when there is no action proceeding current', (t) => {
  const redo = t.context.peekRedo();
  t.is(redo, undefined);
});

test('fn peekRedo() should return the action proceeding current', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.cursor = 1;
  t.is(t.context.peekRedo(), 'c');
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn peekUndo()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn peekUndo() should return undefined when there is no action preceding current', (t) => {
  const undo = t.context.peekUndo();
  t.is(undo, undefined);
});

test('fn peekUndo() should return the action preceding current', (t) => {
  t.context.push('a', 'b'); // current will be 'b'
  const undo = t.context.peekUndo();
  t.is(undo, 'a');
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn pop()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn pop() returns undefined when no memories', (t) => {
  t.is(t.context.pop(), undefined);
});

test('fn pop() returns the last memory', (t) => {
  t.context.push(1337, 42069);
  t.is(t.context.pop(), 42069);
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn push()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn push() should return new length of memories', (t) => {
  const length = t.context.push('a', 'b');
  t.is(length, 2);
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn redo()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn redo() should return the action proceeding current', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.cursor = 1;
  t.is(t.context.redo(), 'c');
});

test('fn redo() should throw an error when there is no proceeding action remembered', (t) => {
  try {
    t.context.redo();
    t.fail();
  } catch (e) {
    t.pass();
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn set()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn set() should set value at position passed', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.set('z', 1);
  t.is(t.context.peek(1), 'z');
});

test('fn set() when no position is passed should set value at current cursor', (t) => {
  t.context.push('a', 'b', 'c');
  t.context.set('z');
  t.is(t.context.current, 'z');
});

test('fn set() should throw error when passed out of bounds position', (t) => {
  try {
    t.context.set('a', 1);
    t.fail();
  } catch (e) {
    t.pass();
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
// Test fn undo()
/////////////////////////////////////////////////////////////////////////////////////////
test('fn undo() should return the action preceding current', (t) => {
  t.context.push('a', 'b');
  t.is(t.context.undo(), 'a');
});

test('fn undo() should throw an error when there is no preceding action remembered', (t) => {
  try {
    t.context.undo();
    t.fail();
  } catch (e) {
    t.pass();
  }
});
