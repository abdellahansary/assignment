/**
 * @param {integer} init
 * @return { increment: Function, decrement: Function, reset: Function }
 */
let number;
var createCounter = function (init) {
  number = init;
  function increment() {
    return (number = number + 1);
  }
  function decrement() {
    return (number = number - 1);
  }
  function reset() {
    return (number = init);
  }
  return { increment, decrement, reset };
};
const value = createCounter(5);
/**
 *
 * value.increment(); // 6
 * value.reset(); // 5
 * value.decrement(); // 4
 */
