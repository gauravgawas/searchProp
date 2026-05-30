var smallestRepunitDivByK = function (p) {
  let res = 0;
  let arr = [];
  for (let i = 0; i < p.length; i++) {
    if (i == 0) {
      res = res + p[i];
      arr.push(p[i]);
      continue;
    }
    let sorted = arr.sort();
    let diff = p[i] - sorted[0];
    if (diff > 0) {
      res = res + diff;
    }

    arr.push(p[i]);
  }
  return res;
};

console.log(smallestRepunitDivByK([4, 9, 2, 2]));
