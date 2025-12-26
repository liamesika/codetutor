// Week 2: Strings and Control Flow - 50 questions

export const week2Questions = [
  // ===== Topic 5: String Methods (15 questions) =====
  {
    title: "String Length",
    slug: "string-length",
    type: "CODE",
    prompt: "Given a string \"Hello World\", print its length.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        // Print the length

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        System.out.println(text.length());
    }
}`,
    tests: [
      { input: "", expectedOutput: "11", isHidden: false },
    ],
    hints: [
      "Use the length() method on strings",
      "Spaces count as characters",
      "The method returns an integer"
    ],
    tags: ["strings", "length", "methods"],
  },
  {
    title: "String Uppercase",
    slug: "string-uppercase",
    type: "CODE",
    prompt: "Convert \"hello java\" to uppercase and print it.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "hello java";
        // Convert to uppercase and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "hello java";
        System.out.println(text.toUpperCase());
    }
}`,
    tests: [
      { input: "", expectedOutput: "HELLO JAVA", isHidden: false },
    ],
    hints: [
      "Use toUpperCase() method",
      "It returns a new string",
      "Print the result directly"
    ],
    tags: ["strings", "uppercase", "methods"],
  },
  {
    title: "String Lowercase",
    slug: "string-lowercase",
    type: "CODE",
    prompt: "Convert \"HELLO WORLD\" to lowercase and print it.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "HELLO WORLD";
        // Convert to lowercase and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "HELLO WORLD";
        System.out.println(text.toLowerCase());
    }
}`,
    tests: [
      { input: "", expectedOutput: "hello world", isHidden: false },
    ],
    hints: [
      "Use toLowerCase() method",
      "Similar to toUpperCase()",
      "Returns a new string"
    ],
    tags: ["strings", "lowercase", "methods"],
  },
  {
    title: "Character at Index",
    slug: "char-at-index",
    type: "CODE",
    prompt: "Print the character at index 4 of \"Hello\".",
    constraints: "Remember: indexing starts at 0.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello";
        // Print character at index 4

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello";
        System.out.println(text.charAt(4));
    }
}`,
    tests: [
      { input: "", expectedOutput: "o", isHidden: false },
    ],
    hints: [
      "Use charAt(index) method",
      "Index 0 is 'H', index 1 is 'e', etc.",
      "Index 4 is the 5th character"
    ],
    tags: ["strings", "charAt", "indexing"],
  },
  {
    title: "Substring Extraction",
    slug: "substring-extraction",
    type: "CODE",
    prompt: "Extract and print \"World\" from \"Hello World\" using substring.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        // Extract "World" using substring

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        System.out.println(text.substring(6));
    }
}`,
    tests: [
      { input: "", expectedOutput: "World", isHidden: false },
    ],
    hints: [
      "substring(start) extracts from start to end",
      "Count the index where 'W' begins",
      "'W' is at index 6"
    ],
    tags: ["strings", "substring", "methods"],
  },
  {
    title: "Substring Range",
    slug: "substring-range",
    type: "CODE",
    prompt: "Extract and print \"llo\" from \"Hello World\".",
    constraints: "Use substring with two parameters.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        // Extract "llo" using substring

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        System.out.println(text.substring(2, 5));
    }
}`,
    tests: [
      { input: "", expectedOutput: "llo", isHidden: false },
    ],
    hints: [
      "substring(start, end) - end is exclusive",
      "'l' starts at index 2",
      "End at index 5 (not included)"
    ],
    tags: ["strings", "substring", "methods"],
  },
  {
    title: "String Contains",
    slug: "string-contains",
    type: "CODE",
    prompt: "Check if \"Hello World\" contains \"World\" and print the boolean result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        // Check if it contains "World"

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        System.out.println(text.contains("World"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use contains() method",
      "It returns a boolean",
      "The search is case-sensitive"
    ],
    tags: ["strings", "contains", "methods"],
  },
  {
    title: "String Starts With",
    slug: "string-starts-with",
    type: "CODE",
    prompt: "Check if \"Hello World\" starts with \"Hello\" and print the result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        // Check if starts with "Hello"

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        System.out.println(text.startsWith("Hello"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use startsWith() method",
      "Returns boolean true or false",
      "Case-sensitive check"
    ],
    tags: ["strings", "startsWith", "methods"],
  },
  {
    title: "String Ends With",
    slug: "string-ends-with",
    type: "CODE",
    prompt: "Check if \"filename.java\" ends with \".java\" and print the result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String filename = "filename.java";
        // Check if ends with ".java"

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String filename = "filename.java";
        System.out.println(filename.endsWith(".java"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use endsWith() method",
      "Include the dot in the search",
      "Returns a boolean"
    ],
    tags: ["strings", "endsWith", "methods"],
  },
  {
    title: "String Index Of",
    slug: "string-index-of",
    type: "CODE",
    prompt: "Find the index of 'o' in \"Hello World\" and print it.",
    constraints: "Returns the first occurrence.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        // Find index of 'o'

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        System.out.println(text.indexOf('o'));
    }
}`,
    tests: [
      { input: "", expectedOutput: "4", isHidden: false },
    ],
    hints: [
      "Use indexOf() method",
      "Returns index of first occurrence",
      "Use single quotes for char or double for String"
    ],
    tags: ["strings", "indexOf", "methods"],
  },
  {
    title: "String Replace",
    slug: "string-replace",
    type: "CODE",
    prompt: "Replace all 'o' with '0' in \"Hello World\" and print it.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        // Replace 'o' with '0'

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        System.out.println(text.replace('o', '0'));
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hell0 W0rld", isHidden: false },
    ],
    hints: [
      "Use replace(old, new) method",
      "Use char (single quotes) for single characters",
      "Replaces all occurrences"
    ],
    tags: ["strings", "replace", "methods"],
  },
  {
    title: "String Trim",
    slug: "string-trim",
    type: "CODE",
    prompt: "Remove leading and trailing spaces from \"  Hello  \" and print it.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "  Hello  ";
        // Trim and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "  Hello  ";
        System.out.println(text.trim());
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello", isHidden: false },
    ],
    hints: [
      "Use trim() method",
      "Removes leading and trailing whitespace",
      "Does not affect spaces in the middle"
    ],
    tags: ["strings", "trim", "methods"],
  },
  {
    title: "String Equality",
    slug: "string-equality",
    type: "CODE",
    prompt: "Compare \"hello\" and \"Hello\" using equals() and print the result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String a = "hello";
        String b = "Hello";
        // Compare using equals()

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String a = "hello";
        String b = "Hello";
        System.out.println(a.equals(b));
    }
}`,
    tests: [
      { input: "", expectedOutput: "false", isHidden: false },
    ],
    hints: [
      "Use equals() method for string comparison",
      "equals() is case-sensitive",
      "Don't use == for string content comparison"
    ],
    tags: ["strings", "equals", "comparison"],
  },
  {
    title: "String Equality Ignore Case",
    slug: "string-equals-ignore-case",
    type: "CODE",
    prompt: "Compare \"hello\" and \"HELLO\" ignoring case and print the result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String a = "hello";
        String b = "HELLO";
        // Compare ignoring case

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String a = "hello";
        String b = "HELLO";
        System.out.println(a.equalsIgnoreCase(b));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use equalsIgnoreCase() method",
      "This ignores case differences",
      "Returns true if content matches regardless of case"
    ],
    tags: ["strings", "equalsIgnoreCase", "comparison"],
  },
  {
    title: "String isEmpty",
    slug: "string-is-empty",
    type: "CODE",
    prompt: "Check if an empty string \"\" is empty and print the result.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 2,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "";
        // Check if empty

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "";
        System.out.println(text.isEmpty());
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use isEmpty() method",
      "Returns true if length is 0",
      "An empty string has no characters"
    ],
    tags: ["strings", "isEmpty", "methods"],
  },

  // ===== Topic 6: Conditionals (15 questions) =====
  {
    title: "Simple If Statement",
    slug: "simple-if",
    type: "CODE",
    prompt: "If the number is greater than 10, print \"Big\". The number is 15.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = 15;
        // Check if greater than 10

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 15;
        if (number > 10) {
            System.out.println("Big");
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "Big", isHidden: false },
    ],
    hints: [
      "Use if (condition) { ... }",
      "The > operator checks greater than",
      "15 is greater than 10"
    ],
    tags: ["conditionals", "if", "basics"],
  },
  {
    title: "If-Else Statement",
    slug: "if-else",
    type: "CODE",
    prompt: "If the number is positive, print \"Positive\", otherwise print \"Non-positive\". The number is -5.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = -5;
        // Check if positive or not

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = -5;
        if (number > 0) {
            System.out.println("Positive");
        } else {
            System.out.println("Non-positive");
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "Non-positive", isHidden: false },
    ],
    hints: [
      "Use if-else structure",
      "Positive means greater than 0",
      "-5 is not greater than 0"
    ],
    tags: ["conditionals", "if-else"],
  },
  {
    title: "If-Else-If Chain",
    slug: "if-else-if",
    type: "CODE",
    prompt: "Given score = 75, print the grade: A (90+), B (80+), C (70+), D (60+), F (below 60).",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int score = 75;
        // Determine and print grade

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int score = 75;
        if (score >= 90) {
            System.out.println("A");
        } else if (score >= 80) {
            System.out.println("B");
        } else if (score >= 70) {
            System.out.println("C");
        } else if (score >= 60) {
            System.out.println("D");
        } else {
            System.out.println("F");
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "C", isHidden: false },
    ],
    hints: [
      "Use if-else-if-else chain",
      "Check from highest to lowest",
      "75 is >= 70 but < 80"
    ],
    tags: ["conditionals", "if-else-if", "grades"],
  },
  {
    title: "Comparison Operators",
    slug: "comparison-operators",
    type: "CODE",
    prompt: "Check if 5 equals 5 and print the boolean result.",
    constraints: "Use == for comparison.",
    difficulty: 1,
    estimatedMinutes: 2,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int a = 5;
        int b = 5;
        // Compare and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 5;
        int b = 5;
        System.out.println(a == b);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use == for equality comparison",
      "= is assignment, == is comparison",
      "Returns a boolean"
    ],
    tags: ["conditionals", "comparison", "operators"],
  },
  {
    title: "Not Equal",
    slug: "not-equal",
    type: "CODE",
    prompt: "Check if 5 is not equal to 3 and print the result.",
    constraints: "Use != operator.",
    difficulty: 1,
    estimatedMinutes: 2,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int a = 5;
        int b = 3;
        // Check not equal

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 5;
        int b = 3;
        System.out.println(a != b);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use != for not equal",
      "5 is definitely not equal to 3",
      "Returns true when values differ"
    ],
    tags: ["conditionals", "comparison", "operators"],
  },
  {
    title: "Logical AND",
    slug: "logical-and",
    type: "CODE",
    prompt: "Check if both conditions are true: age >= 18 AND hasLicense == true. Print the result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int age = 20;
        boolean hasLicense = true;
        // Check both conditions with AND

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int age = 20;
        boolean hasLicense = true;
        System.out.println(age >= 18 && hasLicense);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use && for logical AND",
      "Both conditions must be true",
      "hasLicense is already a boolean, no need for == true"
    ],
    tags: ["conditionals", "logical-operators", "and"],
  },
  {
    title: "Logical OR",
    slug: "logical-or",
    type: "CODE",
    prompt: "Check if either condition is true: isWeekend OR isHoliday. Print the result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        boolean isWeekend = false;
        boolean isHoliday = true;
        // Check with OR

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        boolean isWeekend = false;
        boolean isHoliday = true;
        System.out.println(isWeekend || isHoliday);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use || for logical OR",
      "Only one needs to be true",
      "isHoliday is true, so result is true"
    ],
    tags: ["conditionals", "logical-operators", "or"],
  },
  {
    title: "Logical NOT",
    slug: "logical-not",
    type: "CODE",
    prompt: "Negate the boolean value false and print the result.",
    constraints: "Use ! operator.",
    difficulty: 1,
    estimatedMinutes: 2,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        boolean value = false;
        // Negate and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        boolean value = false;
        System.out.println(!value);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "Use ! for negation",
      "!false becomes true",
      "!true becomes false"
    ],
    tags: ["conditionals", "logical-operators", "not"],
  },
  {
    title: "Even or Odd",
    slug: "even-or-odd",
    type: "CODE",
    prompt: "Check if the number 17 is even or odd. Print \"Even\" or \"Odd\".",
    constraints: "Use the modulo operator.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = 17;
        // Check even or odd

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 17;
        if (number % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "Odd", isHidden: false },
    ],
    hints: [
      "Even numbers have remainder 0 when divided by 2",
      "Use number % 2 to get remainder",
      "17 % 2 = 1 (odd)"
    ],
    tags: ["conditionals", "modulo", "even-odd"],
  },
  {
    title: "Absolute Value",
    slug: "absolute-value",
    type: "CODE",
    prompt: "Print the absolute value of -15 (without using Math.abs).",
    constraints: "Use an if statement to handle negative.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = -15;
        // Print absolute value

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = -15;
        if (number < 0) {
            System.out.println(-number);
        } else {
            System.out.println(number);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "15", isHidden: false },
    ],
    hints: [
      "If negative, negate it to make positive",
      "-(-15) = 15",
      "If positive, keep as is"
    ],
    tags: ["conditionals", "math", "absolute"],
  },
  {
    title: "Max of Two",
    slug: "max-of-two",
    type: "CODE",
    prompt: "Print the larger of two numbers: a = 7, b = 12.",
    constraints: "Use an if statement.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int a = 7;
        int b = 12;
        // Print the larger

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 7;
        int b = 12;
        if (a > b) {
            System.out.println(a);
        } else {
            System.out.println(b);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "12", isHidden: false },
    ],
    hints: [
      "Compare a and b",
      "If a > b, print a, otherwise print b",
      "12 is larger than 7"
    ],
    tags: ["conditionals", "comparison", "max"],
  },
  {
    title: "Min of Two",
    slug: "min-of-two",
    type: "CODE",
    prompt: "Print the smaller of two numbers: a = 25, b = 18.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int a = 25;
        int b = 18;
        // Print the smaller

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 25;
        int b = 18;
        if (a < b) {
            System.out.println(a);
        } else {
            System.out.println(b);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "18", isHidden: false },
    ],
    hints: [
      "Compare a and b with <",
      "If a < b, print a, otherwise print b",
      "18 is smaller than 25"
    ],
    tags: ["conditionals", "comparison", "min"],
  },
  {
    title: "Ternary Operator",
    slug: "ternary-operator",
    type: "CODE",
    prompt: "Use the ternary operator to print \"Adult\" if age >= 18, else \"Minor\". Age is 21.",
    constraints: "Use ? : operator.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int age = 21;
        // Use ternary operator

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int age = 21;
        System.out.println(age >= 18 ? "Adult" : "Minor");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Adult", isHidden: false },
    ],
    hints: [
      "Ternary: condition ? valueIfTrue : valueIfFalse",
      "21 >= 18 is true",
      "So it prints \"Adult\""
    ],
    tags: ["conditionals", "ternary", "operators"],
  },
  {
    title: "Nested If",
    slug: "nested-if",
    type: "CODE",
    prompt: "Given x = 10, y = 20. If x > 5, then check if y > 15. If both true, print \"Both conditions met\".",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 5,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        // Nested if

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int x = 10;
        int y = 20;
        if (x > 5) {
            if (y > 15) {
                System.out.println("Both conditions met");
            }
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "Both conditions met", isHidden: false },
    ],
    hints: [
      "Put one if inside another",
      "10 > 5 is true, so we check the inner if",
      "20 > 15 is also true"
    ],
    tags: ["conditionals", "nested-if"],
  },
  {
    title: "Range Check",
    slug: "range-check",
    type: "CODE",
    prompt: "Check if the number 50 is between 1 and 100 (inclusive). Print \"In range\" or \"Out of range\".",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = 50;
        // Check if in range 1-100

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 50;
        if (number >= 1 && number <= 100) {
            System.out.println("In range");
        } else {
            System.out.println("Out of range");
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "In range", isHidden: false },
    ],
    hints: [
      "Use && to combine two conditions",
      "Check >= 1 AND <= 100",
      "50 is between 1 and 100"
    ],
    tags: ["conditionals", "range", "logical-operators"],
  },

  // ===== Topic 7: Loops (20 questions) =====
  {
    title: "Simple For Loop",
    slug: "simple-for-loop",
    type: "CODE",
    prompt: "Print numbers 1 to 5, each on a new line.",
    constraints: "Use a for loop.",
    difficulty: 1,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print 1 to 5 using for loop

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3\n4\n5", isHidden: false },
    ],
    hints: [
      "for (init; condition; update)",
      "Start at 1, go while <= 5",
      "i++ increments by 1"
    ],
    tags: ["loops", "for-loop", "basics"],
  },
  {
    title: "Countdown",
    slug: "countdown",
    type: "CODE",
    prompt: "Print numbers from 5 down to 1, each on a new line.",
    constraints: "Use a for loop counting down.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Countdown from 5 to 1

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 5; i >= 1; i--) {
            System.out.println(i);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "5\n4\n3\n2\n1", isHidden: false },
    ],
    hints: [
      "Start at 5, go while >= 1",
      "Use i-- to decrement",
      "Condition checks when to stop"
    ],
    tags: ["loops", "for-loop", "countdown"],
  },
  {
    title: "While Loop Basics",
    slug: "while-loop-basics",
    type: "CODE",
    prompt: "Use a while loop to print numbers 1 to 3.",
    constraints: "Use while loop, not for.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Use while loop

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int i = 1;
        while (i <= 3) {
            System.out.println(i);
            i++;
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3", isHidden: false },
    ],
    hints: [
      "Initialize counter before loop",
      "while (condition) { ... }",
      "Don't forget to increment inside loop"
    ],
    tags: ["loops", "while-loop", "basics"],
  },
  {
    title: "Sum 1 to 10",
    slug: "sum-1-to-10",
    type: "CODE",
    prompt: "Calculate and print the sum of numbers from 1 to 10.",
    constraints: "Use a loop.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Sum 1 to 10

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "", expectedOutput: "55", isHidden: false },
    ],
    hints: [
      "Start with sum = 0",
      "Add each number to sum",
      "1+2+3+4+5+6+7+8+9+10 = 55"
    ],
    tags: ["loops", "sum", "accumulator"],
  },
  {
    title: "Print Even Numbers",
    slug: "print-even-numbers",
    type: "CODE",
    prompt: "Print all even numbers from 2 to 10.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print even numbers 2-10

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 2; i <= 10; i += 2) {
            System.out.println(i);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "2\n4\n6\n8\n10", isHidden: false },
    ],
    hints: [
      "Start at 2, increment by 2",
      "Or use if with modulo",
      "i += 2 adds 2 each iteration"
    ],
    tags: ["loops", "even-numbers"],
  },
  {
    title: "Multiplication Table",
    slug: "multiplication-table",
    type: "CODE",
    prompt: "Print the multiplication table for 5 (5x1 through 5x5), showing just the products.",
    constraints: "Print one product per line.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // 5 times table

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(5 * i);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "5\n10\n15\n20\n25", isHidden: false },
    ],
    hints: [
      "Loop from 1 to 5",
      "Multiply 5 by the loop counter",
      "Print the product"
    ],
    tags: ["loops", "multiplication"],
  },
  {
    title: "Factorial",
    slug: "factorial",
    type: "CODE",
    prompt: "Calculate and print the factorial of 5 (5! = 120).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Calculate 5!

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int factorial = 1;
        for (int i = 1; i <= 5; i++) {
            factorial *= i;
        }
        System.out.println(factorial);
    }
}`,
    tests: [
      { input: "", expectedOutput: "120", isHidden: false },
    ],
    hints: [
      "5! = 5 * 4 * 3 * 2 * 1",
      "Start with factorial = 1",
      "Multiply by each number in loop"
    ],
    tags: ["loops", "factorial", "math"],
  },
  {
    title: "Count Digits",
    slug: "count-digits",
    type: "CODE",
    prompt: "Count the number of digits in the number 12345 and print it.",
    constraints: "Use a loop.",
    difficulty: 3,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = 12345;
        // Count digits

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 12345;
        int count = 0;
        while (number > 0) {
            count++;
            number /= 10;
        }
        System.out.println(count);
    }
}`,
    tests: [
      { input: "", expectedOutput: "5", isHidden: false },
    ],
    hints: [
      "Divide by 10 to remove last digit",
      "Count how many times you can divide",
      "12345 has 5 digits"
    ],
    tags: ["loops", "digits", "while"],
  },
  {
    title: "Sum of Digits",
    slug: "sum-of-digits",
    type: "CODE",
    prompt: "Calculate and print the sum of digits in 12345 (1+2+3+4+5 = 15).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = 12345;
        // Sum the digits

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 12345;
        int sum = 0;
        while (number > 0) {
            sum += number % 10;
            number /= 10;
        }
        System.out.println(sum);
    }
}`,
    tests: [
      { input: "", expectedOutput: "15", isHidden: false },
    ],
    hints: [
      "number % 10 gives last digit",
      "number / 10 removes last digit",
      "Add each digit to sum"
    ],
    tags: ["loops", "digits", "sum"],
  },
  {
    title: "Power Calculation",
    slug: "power-calculation",
    type: "CODE",
    prompt: "Calculate 2^8 (2 to the power of 8) using a loop and print the result.",
    constraints: "Don't use Math.pow().",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Calculate 2^8

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int result = 1;
        for (int i = 0; i < 8; i++) {
            result *= 2;
        }
        System.out.println(result);
    }
}`,
    tests: [
      { input: "", expectedOutput: "256", isHidden: false },
    ],
    hints: [
      "Multiply by 2, 8 times",
      "Start with result = 1",
      "2^8 = 256"
    ],
    tags: ["loops", "power", "math"],
  },
  {
    title: "Reverse Number",
    slug: "reverse-number",
    type: "CODE",
    prompt: "Reverse the number 12345 and print it as 54321.",
    constraints: "Use arithmetic operations in a loop.",
    difficulty: 3,
    estimatedMinutes: 8,
    points: 35,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = 12345;
        // Reverse the number

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 12345;
        int reversed = 0;
        while (number > 0) {
            reversed = reversed * 10 + number % 10;
            number /= 10;
        }
        System.out.println(reversed);
    }
}`,
    tests: [
      { input: "", expectedOutput: "54321", isHidden: false },
    ],
    hints: [
      "Get last digit with % 10",
      "Build reversed by *10 + digit",
      "Remove digit with / 10"
    ],
    tags: ["loops", "reverse", "math"],
  },
  {
    title: "Print Stars",
    slug: "print-stars",
    type: "CODE",
    prompt: "Print 5 asterisks on a single line: *****",
    constraints: "Use a loop.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print ***** using loop

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.print("*");
        }
        System.out.println();
    }
}`,
    tests: [
      { input: "", expectedOutput: "*****", isHidden: false },
    ],
    hints: [
      "Use print() not println() in loop",
      "Loop 5 times",
      "Add println() at end for newline"
    ],
    tags: ["loops", "patterns"],
  },
  {
    title: "Right Triangle Pattern",
    slug: "right-triangle-pattern",
    type: "CODE",
    prompt: "Print this pattern:\n*\n**\n***\n****",
    constraints: "Use nested loops.",
    difficulty: 3,
    estimatedMinutes: 7,
    points: 35,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print right triangle

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 1; i <= 4; i++) {
            for (int j = 0; j < i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "*\n**\n***\n****", isHidden: false },
    ],
    hints: [
      "Outer loop for rows (1 to 4)",
      "Inner loop prints i stars",
      "println() after inner loop for newline"
    ],
    tags: ["loops", "nested-loops", "patterns"],
  },
  {
    title: "Number Square",
    slug: "number-square",
    type: "CODE",
    prompt: "Print this 3x3 number square:\n123\n123\n123",
    constraints: "Use nested loops.",
    difficulty: 3,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print number square

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.print(j);
            }
            System.out.println();
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "123\n123\n123", isHidden: false },
    ],
    hints: [
      "Outer loop for 3 rows",
      "Inner loop prints 1, 2, 3",
      "Reset to 1 for each row"
    ],
    tags: ["loops", "nested-loops", "patterns"],
  },
  {
    title: "Find First Multiple of 7",
    slug: "find-first-multiple-7",
    type: "CODE",
    prompt: "Find and print the first number greater than 50 that is divisible by 7.",
    constraints: "Use a loop.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Find first multiple of 7 > 50

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int num = 51;
        while (num % 7 != 0) {
            num++;
        }
        System.out.println(num);
    }
}`,
    tests: [
      { input: "", expectedOutput: "56", isHidden: false },
    ],
    hints: [
      "Start at 51",
      "Check if divisible by 7 using %",
      "56 is the first multiple of 7 > 50"
    ],
    tags: ["loops", "divisibility"],
  },
  {
    title: "GCD Calculation",
    slug: "gcd-calculation",
    type: "CODE",
    prompt: "Calculate and print the GCD (Greatest Common Divisor) of 48 and 18.",
    constraints: "Use Euclidean algorithm.",
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int a = 48;
        int b = 18;
        // Calculate GCD

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 48;
        int b = 18;
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        System.out.println(a);
    }
}`,
    tests: [
      { input: "", expectedOutput: "6", isHidden: false },
    ],
    hints: [
      "Euclidean: GCD(a,b) = GCD(b, a%b)",
      "Continue until b becomes 0",
      "GCD(48, 18) = 6"
    ],
    tags: ["loops", "gcd", "algorithm"],
  },
  {
    title: "Prime Check",
    slug: "prime-check",
    type: "CODE",
    prompt: "Check if 17 is a prime number. Print \"Prime\" or \"Not Prime\".",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int number = 17;
        // Check if prime

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 17;
        boolean isPrime = true;
        if (number < 2) {
            isPrime = false;
        } else {
            for (int i = 2; i * i <= number; i++) {
                if (number % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        System.out.println(isPrime ? "Prime" : "Not Prime");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Prime", isHidden: false },
    ],
    hints: [
      "Check divisibility from 2 to sqrt(n)",
      "If any divides evenly, not prime",
      "17 is only divisible by 1 and 17"
    ],
    tags: ["loops", "prime", "algorithm"],
  },
  {
    title: "Fibonacci Sequence",
    slug: "fibonacci-sequence",
    type: "CODE",
    prompt: "Print the first 7 Fibonacci numbers: 0 1 1 2 3 5 8 (space-separated on one line).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print first 7 Fibonacci numbers

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 0, b = 1;
        for (int i = 0; i < 7; i++) {
            System.out.print(a);
            if (i < 6) System.out.print(" ");
            int temp = a + b;
            a = b;
            b = temp;
        }
        System.out.println();
    }
}`,
    tests: [
      { input: "", expectedOutput: "0 1 1 2 3 5 8", isHidden: false },
    ],
    hints: [
      "Start with 0, 1",
      "Each number is sum of previous two",
      "Print with spaces between"
    ],
    tags: ["loops", "fibonacci", "algorithm"],
  },
  {
    title: "Do-While Loop",
    slug: "do-while-loop",
    type: "CODE",
    prompt: "Use a do-while loop to print numbers 1 to 3.",
    constraints: "Must use do-while.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Use do-while loop

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int i = 1;
        do {
            System.out.println(i);
            i++;
        } while (i <= 3);
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3", isHidden: false },
    ],
    hints: [
      "do { ... } while (condition);",
      "Executes at least once",
      "Condition checked after body"
    ],
    tags: ["loops", "do-while"],
  },
  {
    title: "Break Statement",
    slug: "break-statement",
    type: "CODE",
    prompt: "Print numbers 1 to 10, but stop (break) when you reach 5.",
    constraints: "Use break.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print 1-4, break at 5

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            if (i == 5) {
                break;
            }
            System.out.println(i);
        }
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3\n4", isHidden: false },
    ],
    hints: [
      "break exits the loop immediately",
      "Check if i == 5 before printing",
      "5 should not be printed"
    ],
    tags: ["loops", "break", "control"],
  },
]
