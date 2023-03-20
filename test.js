/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

var addTwoNumbers = function (l1, l2) {
    const l = Math.max(l1.length, l2.length);
    let arr = Array(l);
    let tmp, num = 0;
    for (let i = 0; i < l; i++) {
        tmp = (l1[i] || 0) + (l2[i] || 0) + num;
        if (tmp >= 10) {
            arr[i] = tmp % 10;
            num = 1;
        } else {
            arr[i] = tmp;
            num = 0;
        }
    }
    if (num) {
        arr.push(num)
    }
    return arr
};

var isValid = function (s) {
    const left = ['(', '{', '['];
    const right = [')', '}', ']'];
    let stack = [], index;
    for (const i of s) {
        index = left.findIndex(item => item === i);
        if (index > -1) {
            stack.push(index);
        } else {
            if (right[stack.pop()] !== i) return false;
        }
    }
    return stack.length ? false : true
};

// console.log(isValid('{[]}'))

const arr = ['cssloader', 'lessloader']
console.log(arr.join('!'))

'-!cssloader!lessloader!gloabl.css'