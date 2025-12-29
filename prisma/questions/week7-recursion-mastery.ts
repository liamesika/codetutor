// Week 7: Recursion Mastery - Arrays, Optimization & Advanced Patterns (9 questions)
// Difficulty levels 7-15: Advanced recursive techniques
// Updated with comprehensive prompt standard for self-teaching

export const week7RecursionMastery = [
  // ===== Level 7: Max Value in Array =====
  {
    title: "Find Maximum (Recursive)",
    slug: "max-value-recursive",
    type: "CODE",
    prompt: `## Concept
To find the maximum value in an array recursively, we use a **helper method** with an index parameter:
1. Start at index 0
2. Compare current element with the max of the rest
3. Base case: when at the last element, return it

This pattern is common for array recursion: **use a helper with an index**.

---

## Task
Write a recursive method \`maxValue(int[] arr)\` that returns the maximum value in the array.

---

## Rules / Constraints
- You **MUST use recursion** (no loops, no \`Arrays.stream()\`)
- Array will always have **at least 1 element**
- Use a helper method: \`maxValueHelper(int[] arr, int index)\`

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`maxValue([1, 5, 3, 9, 2])\` | \`9\` | 9 is the largest |
| \`maxValue([7])\` | \`7\` | Single element |
| \`maxValue([-5, -2, -10])\` | \`-2\` | -2 is largest (least negative) |

---

## Edge Cases
- Single element → return that element
- All same values → return that value
- All negative → return the least negative
- Maximum at start, middle, or end`,
    constraints: "Do NOT use loops or Arrays.stream(). Your solution MUST be recursive.",
    difficulty: 7,
    estimatedMinutes: 15,
    points: 250,
    xpReward: 250,
    starterCode: `public class Solution {
    public static int maxValue(int[] arr) {
        // Call helper with starting index 0
        return maxValueHelper(arr, 0);
    }

    private static int maxValueHelper(int[] arr, int index) {
        // Base case: when index is at the last element, return it

        // Recursive case: compare current element with max of the rest
        // Use Math.max(arr[index], maxValueHelper(arr, index + 1))

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(maxValue(new int[]{1, 5, 3, 9, 2})); // 9
        System.out.println(maxValue(new int[]{7}));             // 7
        System.out.println(maxValue(new int[]{-5, -2, -10}));   // -2
    }
}`,
    solutionCode: `public class Solution {
    public static int maxValue(int[] arr) {
        return maxValueHelper(arr, 0);
    }

    private static int maxValueHelper(int[] arr, int index) {
        // Base case: last element
        if (index == arr.length - 1) {
            return arr[index];
        }
        // Recursive case: max of current element and max of rest
        int maxOfRest = maxValueHelper(arr, index + 1);
        return Math.max(arr[index], maxOfRest);
    }

    public static void main(String[] args) {
        System.out.println(maxValue(new int[]{1, 5, 3, 9, 2}));
        System.out.println(maxValue(new int[]{7}));
        System.out.println(maxValue(new int[]{-5, -2, -10}));
    }
}`,
    tests: [
      { input: "", expectedOutput: "9\n7\n-2", isHidden: false },
      { input: "", expectedOutput: "100", isHidden: true, testCode: "System.out.println(maxValue(new int[]{1, 100, 50}));" },
      { input: "", expectedOutput: "0", isHidden: true, testCode: "System.out.println(maxValue(new int[]{0, -1, -2}));" },
      { input: "", expectedOutput: "42", isHidden: true, testCode: "System.out.println(maxValue(new int[]{42}));" },
    ],
    hints: [
      "Use a HELPER method with an index parameter to track your position in the array.",
      "Base case: when index == arr.length - 1, you're at the last element - return it.",
      "Recursive step: get max of rest with maxValueHelper(arr, index + 1), then compare with arr[index].",
      "Use Math.max(a, b) to compare two integers."
    ],
    tags: ["recursion", "arrays", "base-case", "recursion-step", "difficulty-7"],
  },

  // ===== Level 8: Sum of Array =====
  {
    title: "Array Sum (Recursive)",
    slug: "array-sum-recursive",
    type: "CODE",
    prompt: `## Concept
To sum all elements in an array recursively:
1. Add current element to sum of the rest
2. Base case: index past end of array → return 0

Formula: \`sum = arr[index] + sumHelper(arr, index + 1)\`

---

## Task
Write a recursive method \`sumArray(int[] arr)\` that returns the sum of all elements.

---

## Rules / Constraints
- You **MUST use recursion** (no loops, no streams)
- Empty array should return **0**
- Use a helper method with an index parameter

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`sumArray([1, 2, 3, 4, 5])\` | \`15\` | 1+2+3+4+5 = 15 |
| \`sumArray([10])\` | \`10\` | Single element |
| \`sumArray([-1, 1])\` | \`0\` | -1 + 1 = 0 |
| \`sumArray([])\` | \`0\` | Empty array = 0 |

---

## Edge Cases
- Empty array → return 0
- Single element → return that element
- Negative numbers → works the same
- Sum overflow for very large arrays (not tested)`,
    constraints: "Do NOT use loops or streams. Your solution MUST be recursive.",
    difficulty: 8,
    estimatedMinutes: 12,
    points: 270,
    xpReward: 270,
    starterCode: `public class Solution {
    public static int sumArray(int[] arr) {
        return sumHelper(arr, 0);
    }

    private static int sumHelper(int[] arr, int index) {
        // Base case: past the end of the array

        // Recursive case: current element + sum of rest

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(sumArray(new int[]{1, 2, 3, 4, 5})); // 15
        System.out.println(sumArray(new int[]{10}));            // 10
        System.out.println(sumArray(new int[]{}));              // 0
    }
}`,
    solutionCode: `public class Solution {
    public static int sumArray(int[] arr) {
        return sumHelper(arr, 0);
    }

    private static int sumHelper(int[] arr, int index) {
        // Base case: past the end of array
        if (index >= arr.length) {
            return 0;
        }
        // Recursive case: current element + sum of rest
        return arr[index] + sumHelper(arr, index + 1);
    }

    public static void main(String[] args) {
        System.out.println(sumArray(new int[]{1, 2, 3, 4, 5}));
        System.out.println(sumArray(new int[]{10}));
        System.out.println(sumArray(new int[]{}));
    }
}`,
    tests: [
      { input: "", expectedOutput: "15\n10\n0", isHidden: false },
      { input: "", expectedOutput: "0", isHidden: true, testCode: "System.out.println(sumArray(new int[]{-5, 5}));" },
      { input: "", expectedOutput: "55", isHidden: true, testCode: "System.out.println(sumArray(new int[]{1,2,3,4,5,6,7,8,9,10}));" },
    ],
    hints: [
      "Base case: when index >= arr.length, return 0 (nothing left to add).",
      "This handles empty arrays too! index 0 >= length 0 → return 0.",
      "Recursive step: return arr[index] + sumHelper(arr, index + 1)",
      "Trace: sum([1,2,3]) = 1 + sum([2,3]) = 1 + 2 + sum([3]) = 1 + 2 + 3 + 0 = 6"
    ],
    tags: ["recursion", "arrays", "base-case", "recursion-step", "difficulty-8"],
  },

  // ===== Level 9: Filter by Length =====
  {
    title: "Filter Strings by Length (Recursive)",
    slug: "filter-by-length-recursive",
    type: "CODE",
    prompt: `## Concept
Filtering an array recursively is a **two-pass** process:
1. **Pass 1:** Count how many elements match (to create result array of correct size)
2. **Pass 2:** Fill the result array with matching elements

This avoids using ArrayList or dynamic resizing.

---

## Task
Write a recursive method \`filterByLength(String[] arr, int minLen)\` that returns a new array containing only strings with length ≥ minLen.

---

## Rules / Constraints
- You **MUST use recursion** (no loops, no streams, no ArrayList)
- Preserve original order
- Return an empty array if no matches

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`filterByLength(["hi", "hello", "a", "world"], 3)\` | \`["hello", "world"]\` | Only length ≥ 3 |
| \`filterByLength(["abc", "de", "f"], 2)\` | \`["abc", "de"]\` | Only length ≥ 2 |
| \`filterByLength([], 5)\` | \`[]\` | Empty input → empty output |

---

## Edge Cases
- Empty input array → empty result
- No strings match → empty result
- All strings match → return copy of input
- minLen = 0 → all strings match`,
    constraints: "Do NOT use loops, streams, or ArrayList. Build result recursively.",
    difficulty: 9,
    estimatedMinutes: 18,
    points: 300,
    xpReward: 300,
    starterCode: `import java.util.Arrays;

public class Solution {
    public static String[] filterByLength(String[] arr, int minLen) {
        // Step 1: Count matching elements
        int count = countMatching(arr, minLen, 0);

        // Step 2: Create result array of exact size
        String[] result = new String[count];

        // Step 3: Fill result recursively
        fillResult(arr, minLen, 0, result, 0);

        return result;
    }

    private static int countMatching(String[] arr, int minLen, int index) {
        // Count strings with length >= minLen recursively

        return 0; // Replace this
    }

    private static void fillResult(String[] arr, int minLen, int srcIdx, String[] result, int destIdx) {
        // Fill result array with matching strings recursively

    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(filterByLength(new String[]{"hi", "hello", "a", "world"}, 3)));
        System.out.println(Arrays.toString(filterByLength(new String[]{"abc", "de", "f"}, 2)));
        System.out.println(Arrays.toString(filterByLength(new String[]{}, 5)));
    }
}`,
    solutionCode: `import java.util.Arrays;

public class Solution {
    public static String[] filterByLength(String[] arr, int minLen) {
        int count = countMatching(arr, minLen, 0);
        String[] result = new String[count];
        fillResult(arr, minLen, 0, result, 0);
        return result;
    }

    private static int countMatching(String[] arr, int minLen, int index) {
        if (index >= arr.length) {
            return 0;
        }
        int countRest = countMatching(arr, minLen, index + 1);
        if (arr[index].length() >= minLen) {
            return 1 + countRest;
        }
        return countRest;
    }

    private static void fillResult(String[] arr, int minLen, int srcIdx, String[] result, int destIdx) {
        if (srcIdx >= arr.length) {
            return;
        }
        if (arr[srcIdx].length() >= minLen) {
            result[destIdx] = arr[srcIdx];
            fillResult(arr, minLen, srcIdx + 1, result, destIdx + 1);
        } else {
            fillResult(arr, minLen, srcIdx + 1, result, destIdx);
        }
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(filterByLength(new String[]{"hi", "hello", "a", "world"}, 3)));
        System.out.println(Arrays.toString(filterByLength(new String[]{"abc", "de", "f"}, 2)));
        System.out.println(Arrays.toString(filterByLength(new String[]{}, 5)));
    }
}`,
    tests: [
      { input: "", expectedOutput: "[hello, world]\n[abc, de]\n[]", isHidden: false },
      { input: "", expectedOutput: "[abcde]", isHidden: true, testCode: "System.out.println(Arrays.toString(filterByLength(new String[]{\"a\", \"ab\", \"abc\", \"abcd\", \"abcde\"}, 5)));" },
      { input: "", expectedOutput: "[a, ab, abc]", isHidden: true, testCode: "System.out.println(Arrays.toString(filterByLength(new String[]{\"a\", \"ab\", \"abc\"}, 1)));" },
    ],
    hints: [
      "Two-pass approach: first COUNT matching elements, then FILL the result array.",
      "countMatching: base case index >= arr.length → return 0. Then check current and recurse.",
      "fillResult: track BOTH source index (srcIdx) and destination index (destIdx).",
      "Only increment destIdx when you actually add an element to the result."
    ],
    tags: ["recursion", "arrays", "strings", "filtering", "difficulty-9"],
  },

  // ===== Level 10: Fibonacci with Memoization =====
  {
    title: "Fibonacci with Memoization",
    slug: "fibonacci-memoization",
    type: "CODE",
    prompt: `## Concept
**Memoization** is an optimization technique where we store results of expensive function calls and return the cached result when the same input occurs again.

**Problem with basic Fibonacci:**
- \`fibonacci(40)\` makes over 300 million recursive calls!
- Many are duplicates: fibonacci(5) gets calculated thousands of times

**Solution:** Store computed values in an array (memo), check before computing.

**Time complexity:** O(2^n) → O(n) with memoization!

---

## Task
Write a memoized recursive method \`fibonacci(int n)\` that efficiently calculates Fibonacci numbers.

---

## Rules / Constraints
- **MUST use memoization** (store computed values)
- Return \`-1\` for negative inputs
- Use a \`long[]\` memo array initialized to -1

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`fibonacci(10)\` | \`55\` | The 10th Fibonacci number |
| \`fibonacci(40)\` | \`102334155\` | Instant with memo, timeout without! |
| \`fibonacci(0)\` | \`0\` | F(0) = 0 |
| \`fibonacci(-1)\` | \`-1\` | Invalid input |

---

## Edge Cases
- \`n = 0\` → return 0
- \`n = 1\` → return 1
- \`n < 0\` → return -1
- Large n (50+) → works with memoization`,
    constraints: "Your solution MUST use memoization. Basic recursion without memoization will timeout for large inputs.",
    difficulty: 10,
    estimatedMinutes: 15,
    points: 350,
    xpReward: 350,
    starterCode: `public class Solution {
    public static long fibonacci(int n) {
        if (n < 0) return -1;
        if (n == 0) return 0;

        // Create memo array, -1 means "not computed yet"
        long[] memo = new long[n + 1];
        for (int i = 0; i <= n; i++) {
            memo[i] = -1;
        }
        return fibHelper(n, memo);
    }

    private static long fibHelper(int n, long[] memo) {
        // Step 1: Check if already computed (memo[n] != -1)
        //         If yes, return memo[n]

        // Step 2: Base cases (n <= 1)

        // Step 3: Compute recursively, store in memo[n], return
        // memo[n] = fibHelper(n-1, memo) + fibHelper(n-2, memo)

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(10));  // 55
        System.out.println(fibonacci(40));  // 102334155
        System.out.println(fibonacci(0));   // 0
        System.out.println(fibonacci(-1));  // -1
    }
}`,
    solutionCode: `public class Solution {
    public static long fibonacci(int n) {
        if (n < 0) return -1;
        if (n == 0) return 0;
        long[] memo = new long[n + 1];
        for (int i = 0; i <= n; i++) {
            memo[i] = -1;
        }
        return fibHelper(n, memo);
    }

    private static long fibHelper(int n, long[] memo) {
        // Check if already computed
        if (memo[n] != -1) {
            return memo[n];
        }
        // Base cases
        if (n <= 1) {
            memo[n] = n;
            return n;
        }
        // Compute, store, and return
        memo[n] = fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
        return memo[n];
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(10));
        System.out.println(fibonacci(40));
        System.out.println(fibonacci(0));
        System.out.println(fibonacci(-1));
    }
}`,
    tests: [
      { input: "", expectedOutput: "55\n102334155\n0\n-1", isHidden: false },
      { input: "", expectedOutput: "1", isHidden: true, testCode: "System.out.println(fibonacci(1));" },
      { input: "", expectedOutput: "6765", isHidden: true, testCode: "System.out.println(fibonacci(20));" },
      { input: "", expectedOutput: "12586269025", isHidden: true, testCode: "System.out.println(fibonacci(50));" },
    ],
    hints: [
      "ALWAYS check memo first: if (memo[n] != -1) return memo[n]; — this is the key to memoization!",
      "Base cases: for n <= 1, store memo[n] = n and return n.",
      "Recursive case: compute, STORE in memo[n], then return memo[n].",
      "This changes time complexity from O(2^n) to O(n) — huge improvement!"
    ],
    tags: ["recursion", "memoization", "optimization", "fibonacci", "dynamic-programming", "difficulty-10"],
  },

  // ===== Level 11: Binary Search (Recursive) =====
  {
    title: "Binary Search (Recursive)",
    slug: "binary-search-recursive",
    type: "CODE",
    prompt: `## Concept
**Binary Search** is a divide-and-conquer algorithm for searching in a **sorted** array:
1. Check the middle element
2. If target == middle → found!
3. If target < middle → search left half
4. If target > middle → search right half

Each step eliminates half the remaining elements → O(log n) time.

---

## Task
Write a recursive method \`binarySearch(int[] arr, int target)\` that returns the index of target, or -1 if not found.

---

## Rules / Constraints
- You **MUST use recursion** (no loops, no \`Arrays.binarySearch()\`)
- Array is guaranteed to be **sorted in ascending order**
- If multiple occurrences, return any valid index

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`binarySearch([1,3,5,7,9], 5)\` | \`2\` | 5 is at index 2 |
| \`binarySearch([1,3,5,7,9], 1)\` | \`0\` | 1 is at index 0 |
| \`binarySearch([1,3,5,7,9], 6)\` | \`-1\` | 6 not in array |
| \`binarySearch([42], 42)\` | \`0\` | Single element match |

---

## Edge Cases
- Empty array → return -1
- Single element → check if matches
- Target at start, middle, or end
- Target not in array`,
    constraints: "Do NOT use loops or Arrays.binarySearch(). Your solution MUST be recursive.",
    difficulty: 11,
    estimatedMinutes: 15,
    points: 380,
    xpReward: 380,
    starterCode: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        return binarySearchHelper(arr, target, 0, arr.length - 1);
    }

    private static int binarySearchHelper(int[] arr, int target, int left, int right) {
        // Base case: search space exhausted (left > right)

        // Calculate middle index: left + (right - left) / 2

        // Compare and recurse:
        // If arr[mid] == target → found!
        // If target < arr[mid] → search left half
        // If target > arr[mid] → search right half

        return -1; // Replace this
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9};
        System.out.println(binarySearch(arr, 5)); // 2
        System.out.println(binarySearch(arr, 1)); // 0
        System.out.println(binarySearch(arr, 6)); // -1
    }
}`,
    solutionCode: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        return binarySearchHelper(arr, target, 0, arr.length - 1);
    }

    private static int binarySearchHelper(int[] arr, int target, int left, int right) {
        // Base case: search space exhausted
        if (left > right) {
            return -1;
        }

        int mid = left + (right - left) / 2; // Avoids overflow

        if (arr[mid] == target) {
            return mid;
        } else if (target < arr[mid]) {
            return binarySearchHelper(arr, target, left, mid - 1);
        } else {
            return binarySearchHelper(arr, target, mid + 1, right);
        }
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9};
        System.out.println(binarySearch(arr, 5));
        System.out.println(binarySearch(arr, 1));
        System.out.println(binarySearch(arr, 6));
    }
}`,
    tests: [
      { input: "", expectedOutput: "2\n0\n-1", isHidden: false },
      { input: "", expectedOutput: "4", isHidden: true, testCode: "System.out.println(binarySearch(new int[]{1,3,5,7,9}, 9));" },
      { input: "", expectedOutput: "-1", isHidden: true, testCode: "System.out.println(binarySearch(new int[]{}, 5));" },
      { input: "", expectedOutput: "0", isHidden: true, testCode: "System.out.println(binarySearch(new int[]{42}, 42));" },
    ],
    hints: [
      "Calculate mid as: left + (right - left) / 2 — this avoids integer overflow for large arrays.",
      "Base case: if left > right, the search space is empty → return -1.",
      "If target < arr[mid], recurse on LEFT half: (left, mid - 1)",
      "If target > arr[mid], recurse on RIGHT half: (mid + 1, right)"
    ],
    tags: ["recursion", "binary-search", "arrays", "divide-conquer", "difficulty-11"],
  },

  // ===== Level 12: Fill Array Recursively =====
  {
    title: "Fill Array Pattern (Recursive)",
    slug: "fill-array-recursive",
    type: "CODE",
    prompt: `## Concept
To fill an array with values 1, 2, 3, ..., n recursively:
1. Create the array of size n
2. Use a helper to fill each position
3. At index i, set arr[i] = i + 1, then recurse

---

## Task
Write a recursive method \`fillArray(int n)\` that returns an array \`[1, 2, 3, ..., n]\`.

---

## Rules / Constraints
- You **MUST use recursion** to fill the array (no loops)
- For n ≤ 0, return an empty array

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`fillArray(5)\` | \`[1, 2, 3, 4, 5]\` | Five elements |
| \`fillArray(1)\` | \`[1]\` | Single element |
| \`fillArray(0)\` | \`[]\` | Empty array |

---

## Edge Cases
- n = 0 → return empty array []
- n < 0 → return empty array []
- n = 1 → return [1]`,
    constraints: "Do NOT use loops. Build and fill the array recursively.",
    difficulty: 12,
    estimatedMinutes: 12,
    points: 400,
    xpReward: 400,
    starterCode: `import java.util.Arrays;

public class Solution {
    public static int[] fillArray(int n) {
        if (n <= 0) return new int[0];
        int[] result = new int[n];
        fillHelper(result, 0);
        return result;
    }

    private static void fillHelper(int[] arr, int index) {
        // Base case: past end of array

        // Fill current position: arr[index] = index + 1 (for 1-based values)

        // Recurse to next position

    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(fillArray(5))); // [1, 2, 3, 4, 5]
        System.out.println(Arrays.toString(fillArray(1))); // [1]
        System.out.println(Arrays.toString(fillArray(0))); // []
    }
}`,
    solutionCode: `import java.util.Arrays;

public class Solution {
    public static int[] fillArray(int n) {
        if (n <= 0) return new int[0];
        int[] result = new int[n];
        fillHelper(result, 0);
        return result;
    }

    private static void fillHelper(int[] arr, int index) {
        // Base case: past the end of array
        if (index >= arr.length) {
            return;
        }
        // Fill current position (index + 1 to get 1-based values)
        arr[index] = index + 1;
        // Recurse on next position
        fillHelper(arr, index + 1);
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(fillArray(5)));
        System.out.println(Arrays.toString(fillArray(1)));
        System.out.println(Arrays.toString(fillArray(0)));
    }
}`,
    tests: [
      { input: "", expectedOutput: "[1, 2, 3, 4, 5]\n[1]\n[]", isHidden: false },
      { input: "", expectedOutput: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]", isHidden: true, testCode: "System.out.println(Arrays.toString(fillArray(10)));" },
      { input: "", expectedOutput: "[1, 2, 3]", isHidden: true, testCode: "System.out.println(Arrays.toString(fillArray(3)));" },
    ],
    hints: [
      "Base case: when index >= arr.length, stop recursing (return without doing anything).",
      "At each step: arr[index] = index + 1 (to get values 1, 2, 3, ... not 0, 1, 2, ...)",
      "Then recurse: fillHelper(arr, index + 1)",
      "The void return type means we modify the array in place."
    ],
    tags: ["recursion", "arrays", "pattern", "difficulty-12"],
  },

  // ===== Level 13: Palindrome Check (Recursive) =====
  {
    title: "Palindrome Check (Recursive)",
    slug: "palindrome-recursive",
    type: "CODE",
    prompt: `## Concept
A **palindrome** reads the same forwards and backwards (e.g., "racecar", "A man a plan a canal Panama").

To check recursively:
1. Compare first and last characters
2. If they match, check if the middle is a palindrome
3. Base case: 0 or 1 characters → always a palindrome

**Preprocessing:** Remove non-alphanumeric characters, convert to lowercase.

---

## Task
Write a recursive method \`isPalindrome(String s)\` that returns \`true\` if the string is a palindrome.

---

## Rules / Constraints
- **Case-insensitive** comparison ("Racecar" is a palindrome)
- **Ignore** spaces and punctuation
- The palindrome checking logic **MUST be recursive**
- You may use a loop for preprocessing

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`isPalindrome("racecar")\` | \`true\` | Classic palindrome |
| \`isPalindrome("A man a plan a canal Panama")\` | \`true\` | Ignoring spaces/case |
| \`isPalindrome("hello")\` | \`false\` | Not a palindrome |
| \`isPalindrome("")\` | \`true\` | Empty is palindrome |

---

## Edge Cases
- Empty string → true
- Single character → true
- All punctuation → true (empty after cleaning)
- Case difference: "RaceCar" → true`,
    constraints: "The palindrome checking logic MUST be recursive. You may use a loop to preprocess the string.",
    difficulty: 13,
    estimatedMinutes: 20,
    points: 450,
    xpReward: 450,
    starterCode: `public class Solution {
    public static boolean isPalindrome(String s) {
        // Preprocess: remove non-alphanumeric and convert to lowercase
        String cleaned = "";
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isLetterOrDigit(c)) {
                cleaned += Character.toLowerCase(c);
            }
        }
        return isPalindromeHelper(cleaned, 0, cleaned.length() - 1);
    }

    private static boolean isPalindromeHelper(String s, int left, int right) {
        // Base case: pointers have met or crossed (checked all pairs)

        // Compare characters at left and right
        // If different → not a palindrome

        // If same → check the inner substring

        return false; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));                        // true
        System.out.println(isPalindrome("A man a plan a canal Panama"));    // true
        System.out.println(isPalindrome("hello"));                          // false
        System.out.println(isPalindrome(""));                               // true
    }
}`,
    solutionCode: `public class Solution {
    public static boolean isPalindrome(String s) {
        String cleaned = "";
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (Character.isLetterOrDigit(c)) {
                cleaned += Character.toLowerCase(c);
            }
        }
        return isPalindromeHelper(cleaned, 0, cleaned.length() - 1);
    }

    private static boolean isPalindromeHelper(String s, int left, int right) {
        // Base case: pointers have met or crossed
        if (left >= right) {
            return true;
        }
        // If characters don't match, not a palindrome
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        // Characters match, check inner substring
        return isPalindromeHelper(s, left + 1, right - 1);
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("A man a plan a canal Panama"));
        System.out.println(isPalindrome("hello"));
        System.out.println(isPalindrome(""));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true\ntrue\nfalse\ntrue", isHidden: false },
      { input: "", expectedOutput: "true", isHidden: true, testCode: "System.out.println(isPalindrome(\"a\"));" },
      { input: "", expectedOutput: "true", isHidden: true, testCode: "System.out.println(isPalindrome(\"Was it a car or a cat I saw?\"));" },
      { input: "", expectedOutput: "false", isHidden: true, testCode: "System.out.println(isPalindrome(\"not a palindrome\"));" },
    ],
    hints: [
      "Preprocess first: keep only letters/digits, convert to lowercase.",
      "Use TWO pointers: left starts at 0, right at length-1.",
      "Base case: left >= right means we've checked all character pairs → true.",
      "If s.charAt(left) != s.charAt(right), return false immediately."
    ],
    tags: ["recursion", "strings", "palindrome", "two-pointers", "difficulty-13"],
  },

  // ===== Level 14: Count Increasing Runs =====
  {
    title: "Count Increasing Runs",
    slug: "count-increasing-runs",
    type: "CODE",
    prompt: `## Concept
An **increasing run** is a maximal contiguous subsequence where each element is strictly greater than the previous.

Example: \`[1, 2, 3, 1, 2]\`
- Run 1: [1, 2, 3] (indices 0-2)
- Run 2: [1, 2] (indices 3-4)
- Total: 2 runs

Key insight: A new run starts whenever arr[i] ≤ arr[i-1].

---

## Task
Write a recursive method \`countIncreasingRuns(int[] arr)\` that counts the number of increasing runs.

---

## Rules / Constraints
- You **MUST use recursion** for the main counting logic
- Empty array → 0 runs
- Single element → 1 run

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`[1, 2, 3, 1, 2]\` | \`2\` | [1,2,3] and [1,2] |
| \`[5, 4, 3, 2, 1]\` | \`5\` | Each element is its own run |
| \`[1, 2, 3, 4, 5]\` | \`1\` | One continuous run |
| \`[]\` | \`0\` | No elements, no runs |
| \`[7]\` | \`1\` | Single element = 1 run |

---

## Edge Cases
- Empty array → 0
- Single element → 1
- All equal elements \`[1,1,1]\` → 3 runs (each starts a new run)
- Strictly increasing → 1 run
- Strictly decreasing → n runs (each element its own)`,
    constraints: "Do NOT use loops for the main counting logic. Your solution MUST be recursive.",
    difficulty: 14,
    estimatedMinutes: 20,
    points: 480,
    xpReward: 480,
    starterCode: `public class Solution {
    public static int countIncreasingRuns(int[] arr) {
        if (arr.length == 0) return 0;
        if (arr.length == 1) return 1;
        // Start counting from index 1, with initial run count of 1
        return countRunsHelper(arr, 1, 1);
    }

    private static int countRunsHelper(int[] arr, int index, int runCount) {
        // Base case: past end of array

        // Check if current element breaks the increasing sequence
        // arr[index] <= arr[index-1] means a new run starts

        // If new run starts, increment runCount
        // Recurse with next index

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(countIncreasingRuns(new int[]{1, 2, 3, 1, 2}));   // 2
        System.out.println(countIncreasingRuns(new int[]{5, 4, 3, 2, 1}));   // 5
        System.out.println(countIncreasingRuns(new int[]{1, 2, 3, 4, 5}));   // 1
        System.out.println(countIncreasingRuns(new int[]{}));                // 0
    }
}`,
    solutionCode: `public class Solution {
    public static int countIncreasingRuns(int[] arr) {
        if (arr.length == 0) return 0;
        if (arr.length == 1) return 1;
        // Start at index 1, we know there's at least one run
        return countRunsHelper(arr, 1, 1);
    }

    private static int countRunsHelper(int[] arr, int index, int runCount) {
        // Base case: past the end of array
        if (index >= arr.length) {
            return runCount;
        }

        // Check if current element breaks the increasing sequence
        boolean isIncreasing = arr[index] > arr[index - 1];

        if (!isIncreasing) {
            // New run starts here
            return countRunsHelper(arr, index + 1, runCount + 1);
        } else {
            // Continue current run
            return countRunsHelper(arr, index + 1, runCount);
        }
    }

    public static void main(String[] args) {
        System.out.println(countIncreasingRuns(new int[]{1, 2, 3, 1, 2}));
        System.out.println(countIncreasingRuns(new int[]{5, 4, 3, 2, 1}));
        System.out.println(countIncreasingRuns(new int[]{1, 2, 3, 4, 5}));
        System.out.println(countIncreasingRuns(new int[]{}));
    }
}`,
    tests: [
      { input: "", expectedOutput: "2\n5\n1\n0", isHidden: false },
      { input: "", expectedOutput: "1", isHidden: true, testCode: "System.out.println(countIncreasingRuns(new int[]{42}));" },
      { input: "", expectedOutput: "3", isHidden: true, testCode: "System.out.println(countIncreasingRuns(new int[]{1, 2, 1, 2, 1}));" },
      { input: "", expectedOutput: "3", isHidden: true, testCode: "System.out.println(countIncreasingRuns(new int[]{1, 1, 1}));" },
    ],
    hints: [
      "A new run starts when arr[index] <= arr[index-1] (NOT strictly increasing).",
      "Track the current run count as a parameter in the helper.",
      "Base case: when index >= arr.length, return the final runCount.",
      "Edge: equal elements like [1,1,1] → each equality starts a new run (3 runs total)."
    ],
    tags: ["recursion", "arrays", "counting", "sequences", "difficulty-14"],
  },

  // ===== Level 15: Climb Stairs with Memoization =====
  {
    title: "Climb Stairs (Memoization)",
    slug: "climb-stairs-memoization",
    type: "CODE",
    prompt: `## Concept
**Problem:** You're climbing a staircase with n steps. Each time you can climb **1 or 2 steps**. How many distinct ways can you reach the top?

**Insight:** This is the Fibonacci sequence in disguise!
- To reach step n, you either:
  - Came from step n-1 (took 1 step)
  - Came from step n-2 (took 2 steps)
- So: \`ways(n) = ways(n-1) + ways(n-2)\`

**Without memoization:** Exponential time O(2^n)
**With memoization:** Linear time O(n)

---

## Task
Write a memoized recursive method \`climbStairs(int n)\` that returns the number of distinct ways to climb n stairs.

---

## Rules / Constraints
- Use **recursion with memoization**
- Return \`0\` for n ≤ 0
- Large n (30+) will timeout without memoization

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`climbStairs(1)\` | \`1\` | Just 1 step |
| \`climbStairs(2)\` | \`2\` | (1+1) or (2) |
| \`climbStairs(3)\` | \`3\` | (1+1+1), (1+2), (2+1) |
| \`climbStairs(4)\` | \`5\` | Five distinct ways |
| \`climbStairs(10)\` | \`89\` | Fibonacci-like pattern |
| \`climbStairs(0)\` | \`0\` | No stairs, no ways |

---

## Edge Cases
- n ≤ 0 → return 0
- n = 1 → return 1 (base case)
- n = 2 → return 2 (base case)
- Large n (30, 50) → works with memoization`,
    constraints: "Your solution MUST use memoization. Test cases include large n values.",
    difficulty: 15,
    estimatedMinutes: 18,
    points: 500,
    xpReward: 500,
    starterCode: `public class Solution {
    public static long climbStairs(int n) {
        if (n <= 0) return 0;
        long[] memo = new long[n + 1];
        for (int i = 0; i <= n; i++) {
            memo[i] = -1;
        }
        return climbHelper(n, memo);
    }

    private static long climbHelper(int n, long[] memo) {
        // Step 1: Check memo (if memo[n] != -1, return it)

        // Step 2: Base cases
        // n == 1 → 1 way
        // n == 2 → 2 ways

        // Step 3: Recursive case with memoization
        // memo[n] = climbHelper(n-1, memo) + climbHelper(n-2, memo)

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(1));   // 1
        System.out.println(climbStairs(2));   // 2
        System.out.println(climbStairs(3));   // 3
        System.out.println(climbStairs(10));  // 89
        System.out.println(climbStairs(0));   // 0
    }
}`,
    solutionCode: `public class Solution {
    public static long climbStairs(int n) {
        if (n <= 0) return 0;
        long[] memo = new long[n + 1];
        for (int i = 0; i <= n; i++) {
            memo[i] = -1;
        }
        return climbHelper(n, memo);
    }

    private static long climbHelper(int n, long[] memo) {
        // Check memo first
        if (memo[n] != -1) {
            return memo[n];
        }

        // Base cases
        if (n == 1) {
            memo[n] = 1;
            return 1;
        }
        if (n == 2) {
            memo[n] = 2;
            return 2;
        }

        // Recursive case with memoization
        memo[n] = climbHelper(n - 1, memo) + climbHelper(n - 2, memo);
        return memo[n];
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(1));
        System.out.println(climbStairs(2));
        System.out.println(climbStairs(3));
        System.out.println(climbStairs(10));
        System.out.println(climbStairs(0));
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3\n89\n0", isHidden: false },
      { input: "", expectedOutput: "5", isHidden: true, testCode: "System.out.println(climbStairs(4));" },
      { input: "", expectedOutput: "1346269", isHidden: true, testCode: "System.out.println(climbStairs(30));" },
      { input: "", expectedOutput: "0", isHidden: true, testCode: "System.out.println(climbStairs(-5));" },
    ],
    hints: [
      "This is essentially Fibonacci! ways(n) = ways(n-1) + ways(n-2)",
      "Base cases are different though: ways(1) = 1, ways(2) = 2",
      "ALWAYS check memo first: if (memo[n] != -1) return memo[n];",
      "Store result in memo[n] before returning: memo[n] = ... ; return memo[n];"
    ],
    tags: ["recursion", "memoization", "dynamic-programming", "climbing-stairs", "difficulty-15"],
  },
]
