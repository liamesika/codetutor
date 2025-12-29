// Week 6: Recursion Fundamentals - Numbers & Strings (6 questions)
// Difficulty levels 1-6: Building the foundation of recursive thinking
// Updated with comprehensive prompt standard for self-teaching

export const week6RecursionFundamentals = [
  // ===== Level 1: Factorial - The Classic Introduction =====
  {
    title: "Factorial (Basic Recursion)",
    slug: "factorial-basic",
    type: "CODE",
    prompt: `## Concept
**Recursion** is when a function calls itself to solve smaller pieces of the same problem. Every recursive function needs:
1. **Base case** – the simplest case where we return a value without recursing
2. **Recursive step** – where the function calls itself with a "smaller" input

**Factorial** is written as \`n!\` and means: multiply n by all positive integers below it.
- Formula: \`factorial(n) = n × factorial(n-1)\`
- Example: \`5! = 5 × 4 × 3 × 2 × 1 = 120\`

---

## Task
Write a recursive method \`factorial(int n)\` that returns n! (n factorial).

---

## Rules / Constraints
- You **MUST use recursion** (no loops allowed)
- Return \`-1\` for negative inputs
- \`0! = 1\` and \`1! = 1\` (these are your base cases)

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`factorial(0)\` | \`1\` | 0! = 1 by definition |
| \`factorial(1)\` | \`1\` | 1! = 1 |
| \`factorial(5)\` | \`120\` | 5 × 4 × 3 × 2 × 1 = 120 |
| \`factorial(-1)\` | \`-1\` | Negative input → return -1 |

---

## Edge Cases
- \`n = 0\` → return 1 (base case)
- \`n = 1\` → return 1 (base case)
- \`n < 0\` → return -1 (invalid input)
- Large values: \`factorial(10) = 3628800\``,
    constraints: "Do NOT use loops. Your solution MUST be recursive. Handle negative inputs by returning -1.",
    difficulty: 1,
    estimatedMinutes: 8,
    points: 100,
    xpReward: 100,
    starterCode: `public class Solution {
    public static long factorial(int n) {
        // Step 1: Handle invalid input (negative numbers)

        // Step 2: Base case - what values of n give an immediate answer?

        // Step 3: Recursive step - how does factorial(n) relate to factorial(n-1)?

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));  // Expected: 1
        System.out.println(factorial(5));  // Expected: 120
        System.out.println(factorial(-1)); // Expected: -1
    }
}`,
    solutionCode: `public class Solution {
    public static long factorial(int n) {
        // Handle invalid input
        if (n < 0) {
            return -1;
        }
        // Base case: 0! = 1 and 1! = 1
        if (n <= 1) {
            return 1;
        }
        // Recursive case: n! = n * (n-1)!
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));
        System.out.println(factorial(5));
        System.out.println(factorial(-1));
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n120\n-1", isHidden: false },
      { input: "", expectedOutput: "1", isHidden: true, testCode: "System.out.println(factorial(1));" },
      { input: "", expectedOutput: "6", isHidden: true, testCode: "System.out.println(factorial(3));" },
      { input: "", expectedOutput: "3628800", isHidden: true, testCode: "System.out.println(factorial(10));" },
      { input: "", expectedOutput: "-1", isHidden: true, testCode: "System.out.println(factorial(-5));" },
    ],
    hints: [
      "Start by handling the invalid case: if n < 0, return -1 immediately.",
      "The BASE CASE is when recursion stops. For factorial: when n is 0 or 1, return 1.",
      "The RECURSIVE STEP: factorial(n) = n * factorial(n-1). The function calls itself with n-1.",
      "Trace through factorial(3): 3 * factorial(2) = 3 * 2 * factorial(1) = 3 * 2 * 1 = 6"
    ],
    tags: ["recursion", "numbers", "base-case", "recursion-step", "difficulty-1"],
  },

  // ===== Level 2: Power Function =====
  {
    title: "Power (Base to Exponent)",
    slug: "power-recursive",
    type: "CODE",
    prompt: `## Concept
The **power function** calculates \`base^exp\` (base raised to the exponent).
- \`2^3 = 2 × 2 × 2 = 8\`
- \`5^0 = 1\` (anything to the power of 0 is 1)

Recursively: \`power(base, exp) = base × power(base, exp-1)\`

---

## Task
Write a recursive method \`power(int base, int exp)\` that returns base raised to the power of exp.

---

## Rules / Constraints
- You **MUST use recursion** (no loops, no \`Math.pow()\`)
- Exponent is guaranteed to be **non-negative** (≥ 0)
- Return type is \`long\` to handle large results

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`power(2, 0)\` | \`1\` | Any number^0 = 1 |
| \`power(2, 3)\` | \`8\` | 2 × 2 × 2 = 8 |
| \`power(5, 2)\` | \`25\` | 5 × 5 = 25 |
| \`power(3, 4)\` | \`81\` | 3 × 3 × 3 × 3 = 81 |

---

## Edge Cases
- \`exp = 0\` → always return 1 (base case)
- \`base = 0\` → 0^n = 0 (for n > 0)
- \`base = 1\` → 1^n = 1 (for any n)`,
    constraints: "Do NOT use loops or Math.pow(). Your solution MUST be recursive.",
    difficulty: 2,
    estimatedMinutes: 10,
    points: 120,
    xpReward: 120,
    starterCode: `public class Solution {
    public static long power(int base, int exp) {
        // Base case: What is any number raised to the power of 0?

        // Recursive step: How does base^exp relate to base^(exp-1)?

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(power(2, 0));  // Expected: 1
        System.out.println(power(2, 3));  // Expected: 8
        System.out.println(power(5, 2));  // Expected: 25
    }
}`,
    solutionCode: `public class Solution {
    public static long power(int base, int exp) {
        // Base case: anything to the power of 0 is 1
        if (exp == 0) {
            return 1;
        }
        // Recursive case: base^exp = base * base^(exp-1)
        return base * power(base, exp - 1);
    }

    public static void main(String[] args) {
        System.out.println(power(2, 0));
        System.out.println(power(2, 3));
        System.out.println(power(5, 2));
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n8\n25", isHidden: false },
      { input: "", expectedOutput: "1", isHidden: true, testCode: "System.out.println(power(100, 0));" },
      { input: "", expectedOutput: "81", isHidden: true, testCode: "System.out.println(power(3, 4));" },
      { input: "", expectedOutput: "1", isHidden: true, testCode: "System.out.println(power(1, 100));" },
      { input: "", expectedOutput: "0", isHidden: true, testCode: "System.out.println(power(0, 5));" },
    ],
    hints: [
      "The BASE CASE: When exp == 0, return 1 (any number^0 = 1).",
      "Think step by step: 2^3 = 2 * 2^2 = 2 * 2 * 2^1 = 2 * 2 * 2 * 2^0 = 2 * 2 * 2 * 1",
      "The recursive formula: power(base, exp) = base * power(base, exp - 1)",
      "Common mistake: returning 0 for the base case instead of 1!"
    ],
    tags: ["recursion", "numbers", "base-case", "recursion-step", "difficulty-2"],
  },

  // ===== Level 3: Fibonacci =====
  {
    title: "Fibonacci Number",
    slug: "fibonacci-recursive",
    type: "CODE",
    prompt: `## Concept
The **Fibonacci sequence** is: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...

Each number is the sum of the two numbers before it:
- \`F(0) = 0\` (base case 1)
- \`F(1) = 1\` (base case 2)
- \`F(n) = F(n-1) + F(n-2)\` for n > 1

This is special because it has **TWO base cases** and makes **TWO recursive calls**.

---

## Task
Write a recursive method \`fibonacci(int n)\` that returns the nth Fibonacci number.

---

## Rules / Constraints
- You **MUST use recursion** (no loops)
- Return \`-1\` for negative inputs
- F(0) = 0, F(1) = 1

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`fibonacci(0)\` | \`0\` | F(0) = 0 (base case) |
| \`fibonacci(1)\` | \`1\` | F(1) = 1 (base case) |
| \`fibonacci(6)\` | \`8\` | 0,1,1,2,3,5,**8** |
| \`fibonacci(10)\` | \`55\` | The 10th Fibonacci number |
| \`fibonacci(-1)\` | \`-1\` | Negative → invalid |

---

## Edge Cases
- \`n = 0\` → return 0 (first base case)
- \`n = 1\` → return 1 (second base case)
- \`n < 0\` → return -1 (invalid)
- \`n = 2\` → F(1) + F(0) = 1 + 0 = 1`,
    constraints: "Do NOT use loops. Your solution MUST be recursive. Return -1 for negative n.",
    difficulty: 3,
    estimatedMinutes: 12,
    points: 150,
    xpReward: 150,
    starterCode: `public class Solution {
    public static int fibonacci(int n) {
        // Step 1: Handle invalid input (negative n)

        // Step 2: Base case 1 - F(0) = ?

        // Step 3: Base case 2 - F(1) = ?

        // Step 4: Recursive step - F(n) = F(n-1) + F(n-2)

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(0));   // Expected: 0
        System.out.println(fibonacci(1));   // Expected: 1
        System.out.println(fibonacci(6));   // Expected: 8
        System.out.println(fibonacci(-1));  // Expected: -1
    }
}`,
    solutionCode: `public class Solution {
    public static int fibonacci(int n) {
        // Handle invalid input
        if (n < 0) {
            return -1;
        }
        // Base cases
        if (n == 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }
        // Recursive case: F(n) = F(n-1) + F(n-2)
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(0));
        System.out.println(fibonacci(1));
        System.out.println(fibonacci(6));
        System.out.println(fibonacci(-1));
    }
}`,
    tests: [
      { input: "", expectedOutput: "0\n1\n8\n-1", isHidden: false },
      { input: "", expectedOutput: "1", isHidden: true, testCode: "System.out.println(fibonacci(2));" },
      { input: "", expectedOutput: "55", isHidden: true, testCode: "System.out.println(fibonacci(10));" },
      { input: "", expectedOutput: "13", isHidden: true, testCode: "System.out.println(fibonacci(7));" },
      { input: "", expectedOutput: "-1", isHidden: true, testCode: "System.out.println(fibonacci(-10));" },
    ],
    hints: [
      "Fibonacci has TWO base cases: F(0) returns 0, and F(1) returns 1. Handle both!",
      "The recursive formula ADDS two calls: fibonacci(n-1) + fibonacci(n-2)",
      "Trace F(4): F(3) + F(2) = (F(2)+F(1)) + (F(1)+F(0)) = ((1+0)+1) + (1+0) = 2+1 = 3",
      "Handle negative input FIRST, before checking base cases."
    ],
    tags: ["recursion", "numbers", "base-case", "recursion-step", "fibonacci", "difficulty-3"],
  },

  // ===== Level 4: String Equality (Recursion) =====
  {
    title: "String Equals (Recursive)",
    slug: "string-equals-recursive",
    type: "CODE",
    prompt: `## Concept
We can check if two strings are equal **recursively** by comparing them character-by-character:
1. If lengths differ → not equal
2. If both empty → equal (base case)
3. Compare first character, then recurse on the rest

---

## Task
Write a recursive method \`stringEquals(String s1, String s2)\` that returns \`true\` if the strings are equal, \`false\` otherwise.

---

## Rules / Constraints
- You **MUST use recursion** (no loops)
- **Cannot use** \`.equals()\` or \`.compareTo()\`
- **Can use**: \`.length()\`, \`.charAt()\`, \`.substring()\`

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`stringEquals("hello", "hello")\` | \`true\` | Same characters |
| \`stringEquals("hello", "world")\` | \`false\` | Different characters |
| \`stringEquals("", "")\` | \`true\` | Two empty strings are equal |
| \`stringEquals("ab", "abc")\` | \`false\` | Different lengths |

---

## Edge Cases
- Both strings empty → true
- Different lengths → false (check this first!)
- Single character strings → compare that character
- Case matters: "Hello" ≠ "hello"`,
    constraints: "Do NOT use loops, .equals(), or .compareTo(). You may use .length(), .charAt(), and .substring().",
    difficulty: 4,
    estimatedMinutes: 15,
    points: 180,
    xpReward: 180,
    starterCode: `public class Solution {
    public static boolean stringEquals(String s1, String s2) {
        // Step 1: Quick check - if lengths differ, strings can't be equal

        // Step 2: Base case - what if both strings are empty?

        // Step 3: Compare first character of each string

        // Step 4: Recurse on the rest (substring(1))

        return false; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(stringEquals("hello", "hello")); // true
        System.out.println(stringEquals("hello", "world")); // false
        System.out.println(stringEquals("", ""));           // true
        System.out.println(stringEquals("ab", "abc"));      // false
    }
}`,
    solutionCode: `public class Solution {
    public static boolean stringEquals(String s1, String s2) {
        // Quick check: different lengths means not equal
        if (s1.length() != s2.length()) {
            return false;
        }
        // Base case: both strings are empty (and same length)
        if (s1.length() == 0) {
            return true;
        }
        // Check first characters, then recurse on the rest
        if (s1.charAt(0) != s2.charAt(0)) {
            return false;
        }
        // Recurse on remaining substrings
        return stringEquals(s1.substring(1), s2.substring(1));
    }

    public static void main(String[] args) {
        System.out.println(stringEquals("hello", "hello"));
        System.out.println(stringEquals("hello", "world"));
        System.out.println(stringEquals("", ""));
        System.out.println(stringEquals("ab", "abc"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true\nfalse\ntrue\nfalse", isHidden: false },
      { input: "", expectedOutput: "true", isHidden: true, testCode: "System.out.println(stringEquals(\"a\", \"a\"));" },
      { input: "", expectedOutput: "false", isHidden: true, testCode: "System.out.println(stringEquals(\"a\", \"b\"));" },
      { input: "", expectedOutput: "true", isHidden: true, testCode: "System.out.println(stringEquals(\"recursion\", \"recursion\"));" },
      { input: "", expectedOutput: "false", isHidden: true, testCode: "System.out.println(stringEquals(\"abc\", \"abd\"));" },
    ],
    hints: [
      "First optimization: if s1.length() != s2.length(), return false immediately.",
      "Base case: if both strings have length 0, they are equal (return true).",
      "Compare the first character: s1.charAt(0) vs s2.charAt(0). If different, return false.",
      "If first chars match, recurse on substring(1) of both strings."
    ],
    tags: ["recursion", "strings", "base-case", "recursion-step", "difficulty-4"],
  },

  // ===== Level 5: Reverse String =====
  {
    title: "Reverse String (Recursive)",
    slug: "reverse-string-recursive",
    type: "CODE",
    prompt: `## Concept
To reverse a string recursively:
1. Take the first character and put it at the END
2. Reverse the rest of the string
3. Base case: empty or single-character string → return as-is

Example: \`reverse("hello")\` = \`reverse("ello") + "h"\` = \`"olle" + "h"\` = \`"olleh"\`

---

## Task
Write a recursive method \`reverseString(String s)\` that returns the reversed string.

---

## Rules / Constraints
- You **MUST use recursion** (no loops)
- **Cannot use** \`StringBuilder.reverse()\`
- **Can use**: \`.length()\`, \`.charAt()\`, \`.substring()\`, string concatenation

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`reverseString("hello")\` | \`"olleh"\` | Characters reversed |
| \`reverseString("a")\` | \`"a"\` | Single char stays same |
| \`reverseString("")\` | \`""\` | Empty stays empty |
| \`reverseString("ab")\` | \`"ba"\` | Two chars swapped |

---

## Edge Cases
- Empty string → return ""
- Single character → return that character
- Palindrome like "racecar" → stays the same`,
    constraints: "Do NOT use loops or StringBuilder.reverse(). Your solution MUST be recursive.",
    difficulty: 5,
    estimatedMinutes: 12,
    points: 200,
    xpReward: 200,
    starterCode: `public class Solution {
    public static String reverseString(String s) {
        // Base case: empty string or single character

        // Recursive step: reverse the rest, then add first char at the end
        // reverse("hello") = reverse("ello") + "h"

        return ""; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello")); // olleh
        System.out.println(reverseString("a"));     // a
        System.out.println(reverseString(""));      // (empty)
        System.out.println(reverseString("ab"));    // ba
    }
}`,
    solutionCode: `public class Solution {
    public static String reverseString(String s) {
        // Base case: empty or single character
        if (s.length() <= 1) {
            return s;
        }
        // Recursive case: reverse the rest, then add first char at the end
        // "hello" → reverse("ello") + "h" → "olle" + "h" → "olleh"
        return reverseString(s.substring(1)) + s.charAt(0);
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
        System.out.println(reverseString("a"));
        System.out.println(reverseString(""));
        System.out.println(reverseString("ab"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "olleh\na\n\nba", isHidden: false },
      { input: "", expectedOutput: "dcba", isHidden: true, testCode: "System.out.println(reverseString(\"abcd\"));" },
      { input: "", expectedOutput: "noisrucer", isHidden: true, testCode: "System.out.println(reverseString(\"recursion\"));" },
      { input: "", expectedOutput: "a b c", isHidden: true, testCode: "System.out.println(reverseString(\"c b a\"));" },
    ],
    hints: [
      "Base case: if length is 0 or 1, return the string as-is (nothing to reverse).",
      "Key insight: reverse(\"hello\") = reverse(\"ello\") + \"h\"",
      "Use s.substring(1) to get everything after the first character.",
      "Use s.charAt(0) to get the first character, then add it to the END of the reversed rest."
    ],
    tags: ["recursion", "strings", "base-case", "recursion-step", "difficulty-5"],
  },

  // ===== Level 6: Count Character Occurrences =====
  {
    title: "Count Character (Recursive)",
    slug: "count-char-recursive",
    type: "CODE",
    prompt: `## Concept
To count how many times a character appears in a string recursively:
1. Check if the first character matches
2. Add 1 if it matches, 0 if not
3. Add the count from the rest of the string

Formula: \`count = (first char matches? 1 : 0) + countChar(rest, c)\`

---

## Task
Write a recursive method \`countChar(String s, char c)\` that returns how many times character \`c\` appears in string \`s\`.

---

## Rules / Constraints
- You **MUST use recursion** (no loops)
- Count is case-sensitive: 'a' ≠ 'A'

---

## Examples

| Input | Output | Explanation |
|-------|--------|-------------|
| \`countChar("hello", 'l')\` | \`2\` | Two 'l's in "hello" |
| \`countChar("hello", 'z')\` | \`0\` | No 'z' in "hello" |
| \`countChar("", 'a')\` | \`0\` | Empty string has no chars |
| \`countChar("aaa", 'a')\` | \`3\` | Three 'a's |

---

## Edge Cases
- Empty string → return 0
- Character not in string → return 0
- All characters match → return string length
- Single character string → 0 or 1`,
    constraints: "Do NOT use loops. Your solution MUST be recursive.",
    difficulty: 6,
    estimatedMinutes: 10,
    points: 220,
    xpReward: 220,
    starterCode: `public class Solution {
    public static int countChar(String s, char c) {
        // Base case: empty string has no characters

        // Check if first character matches c
        // If yes, count = 1 + countChar(rest, c)
        // If no, count = 0 + countChar(rest, c)

        return 0; // Replace this
    }

    public static void main(String[] args) {
        System.out.println(countChar("hello", 'l')); // 2
        System.out.println(countChar("hello", 'z')); // 0
        System.out.println(countChar("", 'a'));      // 0
        System.out.println(countChar("aaa", 'a'));   // 3
    }
}`,
    solutionCode: `public class Solution {
    public static int countChar(String s, char c) {
        // Base case: empty string has no characters
        if (s.length() == 0) {
            return 0;
        }
        // Check if first character matches
        int count = (s.charAt(0) == c) ? 1 : 0;
        // Add count from the rest of the string
        return count + countChar(s.substring(1), c);
    }

    public static void main(String[] args) {
        System.out.println(countChar("hello", 'l'));
        System.out.println(countChar("hello", 'z'));
        System.out.println(countChar("", 'a'));
        System.out.println(countChar("aaa", 'a'));
    }
}`,
    tests: [
      { input: "", expectedOutput: "2\n0\n0\n3", isHidden: false },
      { input: "", expectedOutput: "1", isHidden: true, testCode: "System.out.println(countChar(\"hello\", 'h'));" },
      { input: "", expectedOutput: "5", isHidden: true, testCode: "System.out.println(countChar(\"aaaaa\", 'a'));" },
      { input: "", expectedOutput: "0", isHidden: true, testCode: "System.out.println(countChar(\"hello\", 'x'));" },
      { input: "", expectedOutput: "3", isHidden: true, testCode: "System.out.println(countChar(\"abcabc\", 'c') + countChar(\"abc\", 'a'));" },
    ],
    hints: [
      "Base case: if the string is empty (length == 0), return 0.",
      "Check: does s.charAt(0) equal c? Use the ternary operator: (condition) ? 1 : 0",
      "Recursive step: add your count (0 or 1) to countChar(s.substring(1), c)",
      "Trace: countChar(\"hello\", 'l') = 0 + 0 + 1 + 1 + 0 = 2"
    ],
    tags: ["recursion", "strings", "base-case", "recursion-step", "counting", "difficulty-6"],
  },
]
