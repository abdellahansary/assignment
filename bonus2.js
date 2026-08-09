/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var findKthPositive = function (arr, k) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = (start + end) >> 1;
    let missingCount = arr[mid] - (mid + 1);

    if (missingCount < k) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return start + k;
};
