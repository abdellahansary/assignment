// 1 number to string
console.log(Number("123") + 7);
// 2 checkFalsy
function Check(value) {
  if (!value) {
    console.log("invalid");
  } else console.log(value + " " + "valid");
}
Check(0);
// 3 Print odd
function PrintOdd(i) {
  for (let i = 1; i < 10; i++) {
    if (i % 2 === 0) {
      continue;
    }
    console.log(i);
  }
}
PrintOdd();
// 4 return even
let ArrayOfNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let ArrayOfEvens = ArrayOfNumbers.filter(isEven);
function isEven(num) {
  return num % 2 === 0;
}
console.log(ArrayOfEvens);
// 8. Write a function that checks if a number is divisible by 3 and 5.
let num = 15;
if (num % 3 === 0 && num % 5 === 0) {
  console.log("divisible by both");
} else console.log("case not true");
// 9. Write a function using arrow syntax to return the square of a number
let square = (num2) => num2 * num2;
console.log(square(5));
// 10.Write a function that destructure an object to extract values and returns a formatted string.
const person = { name: "John", age: 25 };
function destruct(person) {
  console.log(`${person.name} is ` + `${person.age} years old`);
}
destruct(person);
// 11.Write a function that accepts multiple parameters (two or more) and returns their sum.
function sum(par1, par2) {
  console.log(par1 + par2);
}
sum(1, 5);
// 12. Write a function that returns a promise which resolves after 3 seconds with a 'Success' message.
function delay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(console.log("Success"));
    }, 3000);
  });
}
delay();
// 13. Write a function to find the largest number in an array.
let numbers = [1, 3, 7, 2, 4];
function greatest(numbers) {
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  console.log(max);
  return max;
}
greatest(numbers);
// 14. Write a function that takes an object and returns an array containing only its keys.
const user = {
  name: "John",
  age: 25,
};
const keys = Object.keys(user);
console.log(keys);
// 15. Write a function that splits a string into an array of words based on spaces.
function splitWords(str) {
  return str.split(" ");
}
console.log(splitWords("The quick brown fox"));
