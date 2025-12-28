// Week 6: Recursion Fundamentals - Numbers & Strings (6 questions)
// Difficulty levels 1-6: Building the foundation of recursive thinking

export const week6RecursionFundamentals = [
  // ===== Level 1: Factorial - The Classic Introduction =====
  {
    title: "Factorial (Basic Recursion)",
    slug: "factorial-basic",
    type: "CODE",
    prompt: `Write a recursive method that calculates the factorial of a non-negative integer n.

**Definition:** n! = n × (n-1) × (n-2) × ... × 1, and 0! = 1

**Examples:**
- factorial(0) → 1
- factorial(1) → 1
- factorial(5) → 120 (5 × 4 × 3 × 2 × 1)

**Requirements:**
- Must use recursion (no loops allowed)
- Return -1 for negative inputs`,
    constraints: "Do NOT use loops. Your solution MUST be recursive. Handle negative inputs by returning -1.",
    difficulty: 1,
    estimatedMinutes: 8,
    points: 100,
    starterCode: `public class Solution {
    public static long factorial(int n) {
        // Your recursive implementation here
        // Base case: What's the simplest case?
        // Recursive case: How does factorial(n) relate to factorial(n-1)?

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
      "Every recursive function needs a BASE CASE - when does recursion stop?",
      "For factorial, the base case is when n is 0 or 1 (both return 1)",
      "The recursive step: factorial(n) = n * factorial(n-1)",
      "Don't forget to handle negative inputs BEFORE the base case"
    ],
    tags: ["recursion", "numbers", "base-case", "recursion-step", "difficulty-1"],
  },

  // ===== Level 2: Power Function =====
  {
    title: "Power (Base to Exponent)",
    slug: "power-recursive",
    type: "CODE",
    prompt: `Write a recursive method that calculates base raised to the power of exponent (base^exp).

**Examples:**
- power(2, 0) → 1 (anything to the power of 0 is 1)
- power(2, 3) → 8 (2 × 2 × 2)
- power(5, 2) → 25
- power(3, 4) → 81

**Requirements:**
- Must use recursion (no loops, no Math.pow)
- Exponent is guaranteed to be non-negative`,
    constraints: "Do NOT use loops or Math.pow(). Your solution MUST be recursive.",
    difficulty: 2,
    estimatedMinutes: 10,
    points: 120,
    starterCode: `public class Solution {
    public static long power(int base, int exp) {
        // Your recursive implementation here
        // Think: What's base^0? What's base^n in terms of base^(n-1)?

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
      "Base case: What is any number raised to the power of 0?",
      "Think about it: 2^3 = 2 * 2^2 = 2 * 2 * 2^1 = 2 * 2 * 2 * 2^0",
      "The recursive formula: power(base, exp) = base * power(base, exp - 1)",
      "Make sure exp == 0 returns 1, not 0!"
    ],
    tags: ["recursion", "numbers", "base-case", "recursion-step", "difficulty-2"],
  },

  // ===== Level 3: Fibonacci =====
  {
    title: "Fibonacci Number",
    slug: "fibonacci-recursive",
    type: "CODE",
    prompt: `Write a recursive method that returns the nth Fibonacci number.

**Fibonacci Sequence:** 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
- F(0) = 0
- F(1) = 1
- F(n) = F(n-1) + F(n-2) for n > 1

**Examples:**
- fibonacci(0) → 0
- fibonacci(1) → 1
- fibonacci(6) → 8
- fibonacci(10) → 55

**Requirements:**
- Must use recursion
- Return -1 for negative inputs`,
    constraints: "Do NOT use loops. Your solution MUST be recursive. Return -1 for negative n.",
    difficulty: 3,
    estimatedMinutes: 12,
    points: 150,
    starterCode: `public class Solution {
    public static int fibonacci(int n) {
        // Your recursive implementation here
        // This function has TWO base cases!
        // F(0) = 0, F(1) = 1
        // F(n) = F(n-1) + F(n-2)

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
      "Fibonacci has TWO base cases: F(0)=0 and F(1)=1",
      "The recursive formula adds two previous values: F(n) = F(n-1) + F(n-2)",
      "Common mistake: forgetting to handle n=0 separately from n=1",
      "Handle negative input FIRST, before checking base cases"
    ],
    tags: ["recursion", "numbers", "base-case", "recursion-step", "fibonacci", "difficulty-3"],
  },

  // ===== Level 4: String Equality (Recursion) =====
  {
    title: "String Equals (Recursive)",
    slug: "string-equals-recursive",
    type: "CODE",
    prompt: `Write a recursive method that checks if two strings are equal WITHOUT using .equals(), .compareTo(), or loops.

**Approach:** Compare character by character recursively.

**Examples:**
- stringEquals("hello", "hello") → true
- stringEquals("hello", "world") → false
- stringEquals("", "") → true (empty strings are equal)
- stringEquals("ab", "abc") → false (different lengths)

**Requirements:**
- Must use recursion (no loops)
- Cannot use .equals() or .compareTo()
- Can use .length(), .charAt(), .substring()`,
    constraints: "Do NOT use loops, .equals(), or .compareTo(). You may use .length(), .charAt(), and .substring().",
    difficulty: 4,
    estimatedMinutes: 15,
    points: 180,
    starterCode: `public class Solution {
    public static boolean stringEquals(String s1, String s2) {
        // Your recursive implementation here
        // Think: When are two strings definitely NOT equal?
        // When are they definitely equal (base case)?
        // How do you reduce the problem?

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
      "First, check if lengths are different - if so, return false immediately",
      "Base case: if both strings are empty, they're equal",
      "Compare first character of each string using charAt(0)",
      "If first chars match, recurse on substring(1) of both strings"
    ],
    tags: ["recursion", "strings", "base-case", "recursion-step", "difficulty-4"],
  },

  // ===== Level 5: Reverse String =====
  {
    title: "Reverse String (Recursive)",
    slug: "reverse-string-recursive",
    type: "CODE",
    prompt: `Write a recursive method that reverses a string WITHOUT using loops or StringBuilder.reverse().

**Examples:**
- reverseString("hello") → "olleh"
- reverseString("a") → "a"
- reverseString("") → ""
- reverseString("ab") → "ba"

**Requirements:**
- Must use recursion (no loops)
- Cannot use StringBuilder.reverse()`,
    constraints: "Do NOT use loops or StringBuilder.reverse(). Your solution MUST be recursive.",
    difficulty: 5,
    estimatedMinutes: 12,
    points: 200,
    starterCode: `public class Solution {
    public static String reverseString(String s) {
        // Your recursive implementation here
        // Think: What's the reverse of an empty string or single char?
        // How can you build the reverse using recursion?

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
      "Base case: empty string or single character returns as-is",
      "Key insight: reverse(\"hello\") = reverse(\"ello\") + \"h\"",
      "Use substring(1) to get all characters after the first",
      "Use charAt(0) to get the first character"
    ],
    tags: ["recursion", "strings", "base-case", "recursion-step", "difficulty-5"],
  },

  // ===== Level 6: Count Character Occurrences =====
  {
    title: "Count Character (Recursive)",
    slug: "count-char-recursive",
    type: "CODE",
    prompt: `Write a recursive method that counts how many times a character appears in a string.

**Examples:**
- countChar("hello", 'l') → 2
- countChar("hello", 'z') → 0
- countChar("", 'a') → 0
- countChar("aaa", 'a') → 3

**Requirements:**
- Must use recursion (no loops)`,
    constraints: "Do NOT use loops. Your solution MUST be recursive.",
    difficulty: 6,
    estimatedMinutes: 10,
    points: 220,
    starterCode: `public class Solution {
    public static int countChar(String s, char c) {
        // Your recursive implementation here
        // Check if first char matches, add 1 if so
        // Then recurse on the rest of the string

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
      "Base case: empty string → return 0",
      "Check if s.charAt(0) equals c, if so add 1",
      "Recurse on s.substring(1) and add the results",
      "Use ternary operator: (condition) ? 1 : 0"
    ],
    tags: ["recursion", "strings", "base-case", "recursion-step", "counting", "difficulty-6"],
  },
]
