// Week 7: Recursion Mastery - Arrays, Optimization & Advanced Patterns (9 questions)
// Difficulty levels 7-15: Advanced recursive techniques

export const week7RecursionMastery = [
  // ===== Level 7: Max Value in Array =====
  {
    title: "Find Maximum (Recursive)",
    slug: "max-value-recursive",
    type: "CODE",
    prompt: `Write a recursive method that finds the maximum value in an integer array WITHOUT using loops.

**Examples:**
- maxValue([1, 5, 3, 9, 2]) → 9
- maxValue([7]) → 7
- maxValue([-5, -2, -10]) → -2

**Requirements:**
- Must use recursion (no loops)
- Array will always have at least 1 element`,
    constraints: "Do NOT use loops or Arrays.stream(). Your solution MUST be recursive.",
    difficulty: 7,
    estimatedMinutes: 15,
    points: 250,
    starterCode: `public class Solution {
    public static int maxValue(int[] arr) {
        // Call helper with starting index
        return maxValueHelper(arr, 0);
    }

    private static int maxValueHelper(int[] arr, int index) {
        // Your recursive implementation here
        // Base case: what if we're at the last element?
        // Recursive case: compare current with max of the rest

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
      "Use a helper method with an index parameter to track position",
      "Base case: when index is at the last element, return that element",
      "Recursive case: compare arr[index] with the max of the rest",
      "Use Math.max() to compare two values"
    ],
    tags: ["recursion", "arrays", "base-case", "recursion-step", "difficulty-7"],
  },

  // ===== Level 8: Sum of Array =====
  {
    title: "Array Sum (Recursive)",
    slug: "array-sum-recursive",
    type: "CODE",
    prompt: `Write a recursive method that calculates the sum of all elements in an integer array.

**Examples:**
- sumArray([1, 2, 3, 4, 5]) → 15
- sumArray([10]) → 10
- sumArray([-1, 1]) → 0
- sumArray([]) → 0

**Requirements:**
- Must use recursion (no loops)
- Empty array should return 0`,
    constraints: "Do NOT use loops or streams. Your solution MUST be recursive.",
    difficulty: 8,
    estimatedMinutes: 12,
    points: 270,
    starterCode: `public class Solution {
    public static int sumArray(int[] arr) {
        return sumHelper(arr, 0);
    }

    private static int sumHelper(int[] arr, int index) {
        // Your recursive implementation here

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
      "Base case: when index >= arr.length, return 0",
      "Recursive case: arr[index] + sumHelper(arr, index + 1)",
      "Empty array is handled by the base case (index 0 >= length 0)"
    ],
    tags: ["recursion", "arrays", "base-case", "recursion-step", "difficulty-8"],
  },

  // ===== Level 9: Filter by Length =====
  {
    title: "Filter Strings by Length (Recursive)",
    slug: "filter-by-length-recursive",
    type: "CODE",
    prompt: `Write a recursive method that filters an array of strings, keeping only those with length >= minLen.

**Examples:**
- filterByLength(["hi", "hello", "a", "world"], 3) → ["hello", "world"]
- filterByLength(["abc", "de", "f"], 2) → ["abc", "de"]
- filterByLength([], 5) → []

**Requirements:**
- Must use recursion (no loops)
- Return a new array with matching strings
- Preserve original order`,
    constraints: "Do NOT use loops, streams, or ArrayList. Build result recursively.",
    difficulty: 9,
    estimatedMinutes: 18,
    points: 300,
    starterCode: `import java.util.Arrays;

public class Solution {
    public static String[] filterByLength(String[] arr, int minLen) {
        // Count matching elements first, then build result
        int count = countMatching(arr, minLen, 0);
        String[] result = new String[count];
        fillResult(arr, minLen, 0, result, 0);
        return result;
    }

    private static int countMatching(String[] arr, int minLen, int index) {
        // Count strings with length >= minLen recursively
        return 0; // Replace this
    }

    private static void fillResult(String[] arr, int minLen, int srcIdx, String[] result, int destIdx) {
        // Fill result array with matching strings recursively
        // Replace this
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
      "Two-pass approach: first count matching elements, then fill result",
      "countMatching: if index >= length return 0, else check current and recurse",
      "fillResult: track both source index and destination index",
      "Only increment destIdx when you add an element to result"
    ],
    tags: ["recursion", "arrays", "strings", "filtering", "difficulty-9"],
  },

  // ===== Level 10: Fibonacci with Memoization =====
  {
    title: "Fibonacci with Memoization",
    slug: "fibonacci-memoization",
    type: "CODE",
    prompt: `Improve the basic Fibonacci recursion using memoization to avoid recalculating the same values.

**Problem:** Basic recursive Fibonacci is very slow for large n because it recalculates the same values many times.

**Solution:** Use an array to store already-computed values (memoization).

**Examples:**
- fibonacci(10) → 55
- fibonacci(40) → 102334155 (this would be very slow without memoization!)
- fibonacci(0) → 0

**Requirements:**
- Use memoization with an array
- Return -1 for negative inputs`,
    constraints: "Your solution MUST use memoization. Basic recursion without memoization will timeout for large inputs.",
    difficulty: 10,
    estimatedMinutes: 15,
    points: 350,
    starterCode: `public class Solution {
    public static long fibonacci(int n) {
        if (n < 0) return -1;
        // Create memo array initialized to -1 (meaning "not computed yet")
        long[] memo = new long[n + 1];
        for (int i = 0; i <= n; i++) {
            memo[i] = -1;
        }
        return fibHelper(n, memo);
    }

    private static long fibHelper(int n, long[] memo) {
        // Your memoized implementation here
        // 1. Check if already computed (memo[n] != -1)
        // 2. Base cases
        // 3. Compute, store in memo, and return

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
      "Before computing, check if memo[n] already has a value (!= -1)",
      "If memo[n] != -1, return memo[n] immediately (already computed)",
      "Store the result in memo[n] before returning it",
      "This changes O(2^n) to O(n) time complexity!"
    ],
    tags: ["recursion", "memoization", "optimization", "fibonacci", "dynamic-programming", "difficulty-10"],
  },

  // ===== Level 11: Binary Search (Recursive) =====
  {
    title: "Binary Search (Recursive)",
    slug: "binary-search-recursive",
    type: "CODE",
    prompt: `Implement binary search recursively to find a target value in a sorted array.

**Binary Search:** Divide and conquer by checking the middle element.
- If target == middle, found it!
- If target < middle, search left half
- If target > middle, search right half

**Examples:**
- binarySearch([1, 3, 5, 7, 9], 5) → 2 (index of 5)
- binarySearch([1, 3, 5, 7, 9], 1) → 0
- binarySearch([1, 3, 5, 7, 9], 6) → -1 (not found)

**Requirements:**
- Must use recursion
- Return index if found, -1 if not found
- Array is guaranteed to be sorted`,
    constraints: "Do NOT use loops or Arrays.binarySearch(). Your solution MUST be recursive.",
    difficulty: 11,
    estimatedMinutes: 15,
    points: 380,
    starterCode: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        return binarySearchHelper(arr, target, 0, arr.length - 1);
    }

    private static int binarySearchHelper(int[] arr, int target, int left, int right) {
        // Your recursive implementation here
        // Base case: left > right means not found
        // Find middle, compare, and recurse on appropriate half

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
      "Calculate mid as: left + (right - left) / 2 (avoids integer overflow)",
      "Base case: left > right means target is not in the array",
      "If target < arr[mid], recurse on left half (left to mid-1)",
      "If target > arr[mid], recurse on right half (mid+1 to right)"
    ],
    tags: ["recursion", "binary-search", "arrays", "divide-conquer", "difficulty-11"],
  },

  // ===== Level 12: Fill Array Recursively =====
  {
    title: "Fill Array Pattern (Recursive)",
    slug: "fill-array-recursive",
    type: "CODE",
    prompt: `Write a recursive method that creates an array of size n filled with a pattern: [1, 2, 3, ..., n].

**Examples:**
- fillArray(5) → [1, 2, 3, 4, 5]
- fillArray(1) → [1]
- fillArray(0) → []

**Requirements:**
- Must use recursion to fill the array
- No loops allowed`,
    constraints: "Do NOT use loops. Build and fill the array recursively.",
    difficulty: 12,
    estimatedMinutes: 12,
    points: 400,
    starterCode: `import java.util.Arrays;

public class Solution {
    public static int[] fillArray(int n) {
        if (n <= 0) return new int[0];
        int[] result = new int[n];
        fillHelper(result, 0);
        return result;
    }

    private static void fillHelper(int[] arr, int index) {
        // Your recursive implementation here
        // Fill arr[index] with index + 1, then recurse

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
      "Base case: when index >= arr.length, stop recursing",
      "At each step: arr[index] = index + 1 (to get 1-based values)",
      "Then call fillHelper(arr, index + 1)"
    ],
    tags: ["recursion", "arrays", "pattern", "difficulty-12"],
  },

  // ===== Level 13: Palindrome Check (Recursive) =====
  {
    title: "Palindrome Check (Recursive)",
    slug: "palindrome-recursive",
    type: "CODE",
    prompt: `Write a recursive method that checks if a string is a palindrome (reads the same forwards and backwards).

**Rules:**
- Case-insensitive comparison ("Racecar" is a palindrome)
- Only consider alphanumeric characters (ignore spaces, punctuation)

**Examples:**
- isPalindrome("racecar") → true
- isPalindrome("A man a plan a canal Panama") → true
- isPalindrome("hello") → false
- isPalindrome("") → true (empty is palindrome)

**Requirements:**
- Must use recursion (no loops for the palindrome check)`,
    constraints: "The palindrome checking logic MUST be recursive. You may use a loop to preprocess the string.",
    difficulty: 13,
    estimatedMinutes: 20,
    points: 450,
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
        // Your recursive implementation here
        // Compare characters at left and right indices
        // Move inward recursively

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
      "Preprocess the string first: remove non-alphanumeric, convert to lowercase",
      "Use two pointers: left starting at 0, right at length-1",
      "Base case: left >= right means we've checked all pairs",
      "If s.charAt(left) != s.charAt(right), return false immediately"
    ],
    tags: ["recursion", "strings", "palindrome", "two-pointers", "difficulty-13"],
  },

  // ===== Level 14: Count Increasing Runs =====
  {
    title: "Count Increasing Runs",
    slug: "count-increasing-runs",
    type: "CODE",
    prompt: `Write a recursive method that counts the number of "increasing runs" in an array.

**Definition:** An increasing run is a maximal contiguous subsequence where each element is strictly greater than the previous.

**Examples:**
- countIncreasingRuns([1, 2, 3, 1, 2]) → 2
  - Run 1: [1, 2, 3]
  - Run 2: [1, 2]
- countIncreasingRuns([5, 4, 3, 2, 1]) → 5 (each element is its own run)
- countIncreasingRuns([1, 2, 3, 4, 5]) → 1 (one continuous run)
- countIncreasingRuns([]) → 0
- countIncreasingRuns([7]) → 1

**Requirements:**
- Must use recursion`,
    constraints: "Do NOT use loops for the main counting logic. Your solution MUST be recursive.",
    difficulty: 14,
    estimatedMinutes: 20,
    points: 480,
    starterCode: `public class Solution {
    public static int countIncreasingRuns(int[] arr) {
        if (arr.length == 0) return 0;
        // Start counting from index 1, first element starts a run
        return 1 + countRunsHelper(arr, 1, false);
    }

    private static int countRunsHelper(int[] arr, int index, boolean wasIncreasing) {
        // Your recursive implementation here
        // Track whether the previous transition was increasing
        // Count a new run when we see a "break" (not increasing)

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
      { input: "", expectedOutput: "2", isHidden: true, testCode: "System.out.println(countIncreasingRuns(new int[]{1, 1, 1}));" },
    ],
    hints: [
      "A new run starts when arr[index] <= arr[index-1]",
      "Track the current run count as a parameter",
      "Base case: when index >= arr.length, return the count",
      "If not increasing, increment runCount and continue"
    ],
    tags: ["recursion", "arrays", "counting", "sequences", "difficulty-14"],
  },

  // ===== Level 15: Climb Stairs with Memoization =====
  {
    title: "Climb Stairs (Memoization)",
    slug: "climb-stairs-memoization",
    type: "CODE",
    prompt: `You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps.
In how many distinct ways can you climb to the top?

**Examples:**
- climbStairs(1) → 1 (just take 1 step)
- climbStairs(2) → 2 (1+1 or 2)
- climbStairs(3) → 3 (1+1+1, 1+2, 2+1)
- climbStairs(4) → 5
- climbStairs(10) → 89

**Requirements:**
- Use recursion with memoization
- Without memoization, large inputs will timeout!
- Return 0 for n <= 0`,
    constraints: "Your solution MUST use memoization. Test cases include large n values.",
    difficulty: 15,
    estimatedMinutes: 18,
    points: 500,
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
        // Your memoized recursive implementation here
        // From step n, you could have come from n-1 (took 1 step) or n-2 (took 2 steps)
        // So: ways(n) = ways(n-1) + ways(n-2)

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
      "Base cases: ways(1) = 1, ways(2) = 2",
      "Check memo[n] first - if not -1, return it immediately",
      "Store result in memo[n] before returning"
    ],
    tags: ["recursion", "memoization", "dynamic-programming", "climbing-stairs", "difficulty-15"],
  },
]
