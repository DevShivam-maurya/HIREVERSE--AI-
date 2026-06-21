// utils/questionBank.js
module.exports = {
  dsa: [
    { id: 'dsa1', q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], answer: 1 },
    { id: 'dsa2', q: 'Which data structure uses LIFO order?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], answer: 1 },
    { id: 'dsa3', q: 'Best case time complexity of QuickSort?', options: ['O(n^2)', 'O(n log n)', 'O(n)', 'O(log n)'], answer: 1 },
    { id: 'dsa4', q: 'Which traversal of a BST gives sorted order?', options: ['Preorder', 'Postorder', 'Inorder', 'Level order'], answer: 2 },
    { id: 'dsa5', q: 'A Hash Map provides average lookup time of?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], answer: 2 }
  ],
  oop: [
    { id: 'oop1', q: 'Which OOP concept allows a child class to use parent class methods?', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'], answer: 1 },
    { id: 'oop2', q: 'Method overloading is an example of?', options: ['Runtime polymorphism', 'Compile-time polymorphism', 'Encapsulation', 'Inheritance'], answer: 1 },
    { id: 'oop3', q: 'Hiding internal implementation details is called?', options: ['Abstraction', 'Encapsulation', 'Inheritance', 'Coupling'], answer: 1 },
    { id: 'oop4', q: 'Which keyword prevents a class from being inherited in Java?', options: ['static', 'private', 'final', 'const'], answer: 2 }
  ],
  dbms: [
    { id: 'dbms1', q: 'Which normal form removes transitive dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], answer: 2 },
    { id: 'dbms2', q: 'Which SQL clause is used to filter groups?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], answer: 1 },
    { id: 'dbms3', q: 'A primary key can contain NULL values?', options: ['True', 'False'], answer: 1 },
    { id: 'dbms4', q: 'Which index type speeds up exact match lookups best?', options: ['B-Tree', 'Hash Index', 'Bitmap', 'Full text'], answer: 1 }
  ],
  os: [
    { id: 'os1', q: 'Which scheduling algorithm can cause starvation?', options: ['Round Robin', 'FCFS', 'Priority Scheduling', 'SJF (preemptive avoided)'], answer: 2 },
    { id: 'os2', q: 'A deadlock requires which of these conditions?', options: ['Mutual Exclusion', 'Preemption allowed', 'No hold and wait', 'Sequential access only'], answer: 0 },
    { id: 'os3', q: 'Which memory management technique avoids external fragmentation?', options: ['Segmentation', 'Paging', 'Fixed partitioning', 'Contiguous allocation'], answer: 1 }
  ],
  cn: [
    { id: 'cn1', q: 'Which layer of OSI model handles routing?', options: ['Data Link', 'Network', 'Transport', 'Session'], answer: 1 },
    { id: 'cn2', q: 'TCP is a ______ protocol.', options: ['Connectionless', 'Connection-oriented', 'Unreliable', 'Stateless'], answer: 1 },
    { id: 'cn3', q: 'Which protocol resolves domain names to IP addresses?', options: ['DHCP', 'DNS', 'ARP', 'FTP'], answer: 1 }
  ],
  aptitude: [
    { id: 'apt1', q: 'If a train travels 60 km in 1.5 hours, its speed is?', options: ['30 km/h', '40 km/h', '45 km/h', '50 km/h'], answer: 1 },
    { id: 'apt2', q: 'What is 15% of 200?', options: ['20', '25', '30', '35'], answer: 2 },
    { id: 'apt3', q: 'Find the next number: 2, 6, 12, 20, ?', options: ['28', '30', '32', '26'], answer: 1 }
  ],
  coding: [
    {
      id: 'code1',
      title: 'Two Sum',
      description: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to target. Function signature: function twoSum(nums, target) -> returns [i, j].',
      starterCode: 'function twoSum(nums, target) {\n  // your code here\n}',
      testCases: [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] },
        { input: [[3, 3], 6], expected: [0, 1] }
      ]
    },
    {
      id: 'code2',
      title: 'Reverse String',
      description: 'Write a function reverseString(str) that returns the reversed string.',
      starterCode: 'function reverseString(str) {\n  // your code here\n}',
      testCases: [
        { input: ['hello'], expected: 'olleh' },
        { input: ['HireVerse'], expected: 'esreVeriH' },
        { input: ['a'], expected: 'a' }
      ]
    },
    {
      id: 'code3',
      title: 'FizzBuzz Count',
      description: 'Write isPrime(n) that returns true if n is a prime number, false otherwise.',
      starterCode: 'function isPrime(n) {\n  // your code here\n}',
      testCases: [
        { input: [7], expected: true },
        { input: [10], expected: false },
        { input: [2], expected: true }
      ]
    }
  ]
};
