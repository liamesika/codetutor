// Week 3: Functions and Methods - 45 questions

export const week3Functions = [
  // ===== Topic 8: Function Basics (15 questions) =====
  {
    title: "Call a Method",
    slug: "call-a-method",
    type: "CODE",
    prompt: "The sayHello method is defined. Call it from main to print \"Hello\".",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void sayHello() {
        System.out.println("Hello");
    }

    public static void main(String[] args) {
        // Call sayHello here

    }
}`,
    solutionCode: `public class Solution {
    public static void sayHello() {
        System.out.println("Hello");
    }

    public static void main(String[] args) {
        sayHello();
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello", isHidden: false },
    ],
    hints: [
      "Call a method by its name followed by ()",
      "Just write: sayHello();",
      "The method is already defined above"
    ],
    tags: ["methods", "function-call", "basics"],
  },
  {
    title: "Method with Parameter",
    slug: "method-with-parameter",
    type: "CODE",
    prompt: "Complete the greet method to print \"Hello, \" followed by the name parameter.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void greet(String name) {
        // Print "Hello, " + name

    }

    public static void main(String[] args) {
        greet("Java");
    }
}`,
    solutionCode: `public class Solution {
    public static void greet(String name) {
        System.out.println("Hello, " + name);
    }

    public static void main(String[] args) {
        greet("Java");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello, Java", isHidden: false },
    ],
    hints: [
      "Concatenate the string \"Hello, \" with name",
      "Use + to join strings",
      "Print the result"
    ],
    tags: ["methods", "parameters"],
  },
  {
    title: "Multiple Parameters",
    slug: "multiple-parameters",
    type: "CODE",
    prompt: "Complete the add method to print the sum of two integers a and b.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void add(int a, int b) {
        // Print a + b

    }

    public static void main(String[] args) {
        add(5, 3);
    }
}`,
    solutionCode: `public class Solution {
    public static void add(int a, int b) {
        System.out.println(a + b);
    }

    public static void main(String[] args) {
        add(5, 3);
    }
}`,
    tests: [
      { input: "", expectedOutput: "8", isHidden: false },
    ],
    hints: [
      "Add the two parameters together",
      "Print the result",
      "5 + 3 = 8"
    ],
    tags: ["methods", "parameters", "arithmetic"],
  },
  {
    title: "Write a Void Method",
    slug: "write-void-method",
    type: "CODE",
    prompt: "Write a method called printSquare that takes an int n and prints its square (n*n).",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write printSquare method here


    public static void main(String[] args) {
        printSquare(4);
    }
}`,
    solutionCode: `public class Solution {
    public static void printSquare(int n) {
        System.out.println(n * n);
    }

    public static void main(String[] args) {
        printSquare(4);
    }
}`,
    tests: [
      { input: "", expectedOutput: "16", isHidden: false },
    ],
    hints: [
      "public static void printSquare(int n)",
      "Multiply n by itself",
      "Print the result"
    ],
    tags: ["methods", "void", "writing-methods"],
  },
  {
    title: "Method Calling Method",
    slug: "method-calling-method",
    type: "CODE",
    prompt: "Complete printDouble to call printNumber twice.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void printNumber(int n) {
        System.out.println(n);
    }

    public static void printDouble(int n) {
        // Call printNumber twice

    }

    public static void main(String[] args) {
        printDouble(5);
    }
}`,
    solutionCode: `public class Solution {
    public static void printNumber(int n) {
        System.out.println(n);
    }

    public static void printDouble(int n) {
        printNumber(n);
        printNumber(n);
    }

    public static void main(String[] args) {
        printDouble(5);
    }
}`,
    tests: [
      { input: "", expectedOutput: "5\n5", isHidden: false },
    ],
    hints: [
      "Call printNumber(n) twice",
      "Each call prints the number once",
      "Methods can call other methods"
    ],
    tags: ["methods", "composition"],
  },
  {
    title: "Print Multiple Times",
    slug: "print-multiple-times",
    type: "CODE",
    prompt: "Complete printNTimes to print the message n times.",
    constraints: "Use a loop.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void printNTimes(String message, int n) {
        // Print message n times

    }

    public static void main(String[] args) {
        printNTimes("Hi", 3);
    }
}`,
    solutionCode: `public class Solution {
    public static void printNTimes(String message, int n) {
        for (int i = 0; i < n; i++) {
            System.out.println(message);
        }
    }

    public static void main(String[] args) {
        printNTimes("Hi", 3);
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hi\nHi\nHi", isHidden: false },
    ],
    hints: [
      "Use a for loop from 0 to n",
      "Print message inside the loop",
      "Loop runs n times"
    ],
    tags: ["methods", "loops", "parameters"],
  },

  // ===== Topic 9: Return Values (15 questions) =====
  {
    title: "Return an Integer",
    slug: "return-integer",
    type: "CODE",
    prompt: "Complete the getDouble method to return twice the input value.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static int getDouble(int n) {
        // Return n * 2

    }

    public static void main(String[] args) {
        System.out.println(getDouble(7));
    }
}`,
    solutionCode: `public class Solution {
    public static int getDouble(int n) {
        return n * 2;
    }

    public static void main(String[] args) {
        System.out.println(getDouble(7));
    }
}`,
    tests: [
      { input: "", expectedOutput: "14", isHidden: false },
    ],
    hints: [
      "Use the return keyword",
      "return n * 2;",
      "The method has int return type"
    ],
    tags: ["methods", "return", "int"],
  },
  {
    title: "Return Sum",
    slug: "return-sum",
    type: "CODE",
    prompt: "Write a method sum that takes two ints and returns their sum.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write sum method here


    public static void main(String[] args) {
        System.out.println(sum(10, 20));
    }
}`,
    solutionCode: `public class Solution {
    public static int sum(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(sum(10, 20));
    }
}`,
    tests: [
      { input: "", expectedOutput: "30", isHidden: false },
    ],
    hints: [
      "Return type is int",
      "public static int sum(int a, int b)",
      "return a + b;"
    ],
    tags: ["methods", "return", "sum"],
  },
  {
    title: "Return Boolean",
    slug: "return-boolean",
    type: "CODE",
    prompt: "Write a method isPositive that returns true if the number is positive.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write isPositive method here


    public static void main(String[] args) {
        System.out.println(isPositive(5));
        System.out.println(isPositive(-3));
    }
}`,
    solutionCode: `public class Solution {
    public static boolean isPositive(int n) {
        return n > 0;
    }

    public static void main(String[] args) {
        System.out.println(isPositive(5));
        System.out.println(isPositive(-3));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true\nfalse", isHidden: false },
    ],
    hints: [
      "Return type is boolean",
      "n > 0 is already a boolean expression",
      "Just return the comparison result"
    ],
    tags: ["methods", "return", "boolean"],
  },
  {
    title: "Return String",
    slug: "return-string",
    type: "CODE",
    prompt: "Write a method getGreeting that returns \"Hello, \" + the name parameter.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write getGreeting method here


    public static void main(String[] args) {
        System.out.println(getGreeting("World"));
    }
}`,
    solutionCode: `public class Solution {
    public static String getGreeting(String name) {
        return "Hello, " + name;
    }

    public static void main(String[] args) {
        System.out.println(getGreeting("World"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello, World", isHidden: false },
    ],
    hints: [
      "Return type is String",
      "Concatenate and return",
      "public static String getGreeting(String name)"
    ],
    tags: ["methods", "return", "String"],
  },
  {
    title: "Return Max",
    slug: "return-max",
    type: "CODE",
    prompt: "Write a method max that returns the larger of two integers.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write max method here


    public static void main(String[] args) {
        System.out.println(max(15, 8));
    }
}`,
    solutionCode: `public class Solution {
    public static int max(int a, int b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }

    public static void main(String[] args) {
        System.out.println(max(15, 8));
    }
}`,
    tests: [
      { input: "", expectedOutput: "15", isHidden: false },
    ],
    hints: [
      "Compare a and b",
      "Return the larger one",
      "Can also use: return a > b ? a : b;"
    ],
    tags: ["methods", "return", "comparison"],
  },
  {
    title: "Return Min",
    slug: "return-min",
    type: "CODE",
    prompt: "Write a method min that returns the smaller of two integers.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write min method here


    public static void main(String[] args) {
        System.out.println(min(15, 8));
    }
}`,
    solutionCode: `public class Solution {
    public static int min(int a, int b) {
        return a < b ? a : b;
    }

    public static void main(String[] args) {
        System.out.println(min(15, 8));
    }
}`,
    tests: [
      { input: "", expectedOutput: "8", isHidden: false },
    ],
    hints: [
      "Compare a and b",
      "Return the smaller one",
      "Ternary: a < b ? a : b"
    ],
    tags: ["methods", "return", "comparison"],
  },
  {
    title: "Return Absolute Value",
    slug: "return-absolute",
    type: "CODE",
    prompt: "Write a method abs that returns the absolute value of an integer.",
    constraints: "Don't use Math.abs().",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write abs method here


    public static void main(String[] args) {
        System.out.println(abs(-7));
        System.out.println(abs(3));
    }
}`,
    solutionCode: `public class Solution {
    public static int abs(int n) {
        return n < 0 ? -n : n;
    }

    public static void main(String[] args) {
        System.out.println(abs(-7));
        System.out.println(abs(3));
    }
}`,
    tests: [
      { input: "", expectedOutput: "7\n3", isHidden: false },
    ],
    hints: [
      "If negative, return -n",
      "If positive, return n",
      "Use ternary or if-else"
    ],
    tags: ["methods", "return", "math"],
  },
  {
    title: "Return Is Even",
    slug: "return-is-even",
    type: "CODE",
    prompt: "Write a method isEven that returns true if the number is even.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    // Write isEven method here


    public static void main(String[] args) {
        System.out.println(isEven(4));
        System.out.println(isEven(7));
    }
}`,
    solutionCode: `public class Solution {
    public static boolean isEven(int n) {
        return n % 2 == 0;
    }

    public static void main(String[] args) {
        System.out.println(isEven(4));
        System.out.println(isEven(7));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true\nfalse", isHidden: false },
    ],
    hints: [
      "Even numbers have remainder 0 when divided by 2",
      "n % 2 == 0 is already boolean",
      "Just return the expression"
    ],
    tags: ["methods", "return", "boolean", "even-odd"],
  },
  {
    title: "Return Factorial",
    slug: "return-factorial",
    type: "CODE",
    prompt: "Write a method factorial that returns n! for a given positive integer n.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 7,
    points: 35,
    starterCode: `public class Solution {
    // Write factorial method here


    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
    solutionCode: `public class Solution {
    public static int factorial(int n) {
        int result = 1;
        for (int i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
    tests: [
      { input: "", expectedOutput: "120", isHidden: false },
    ],
    hints: [
      "5! = 5 * 4 * 3 * 2 * 1 = 120",
      "Use a loop to multiply",
      "Start result at 1"
    ],
    tags: ["methods", "return", "factorial", "loops"],
  },
  {
    title: "Return Power",
    slug: "return-power",
    type: "CODE",
    prompt: "Write a method power that returns base^exponent.",
    constraints: "Don't use Math.pow().",
    difficulty: 3,
    estimatedMinutes: 7,
    points: 35,
    starterCode: `public class Solution {
    // Write power method here


    public static void main(String[] args) {
        System.out.println(power(2, 10));
    }
}`,
    solutionCode: `public class Solution {
    public static int power(int base, int exponent) {
        int result = 1;
        for (int i = 0; i < exponent; i++) {
            result *= base;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(power(2, 10));
    }
}`,
    tests: [
      { input: "", expectedOutput: "1024", isHidden: false },
    ],
    hints: [
      "Multiply base by itself exponent times",
      "2^10 = 1024",
      "Use a loop"
    ],
    tags: ["methods", "return", "power", "loops"],
  },
  {
    title: "Return String Length",
    slug: "return-string-length",
    type: "CODE",
    prompt: "Write a method getLength that returns the length of a string.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    // Write getLength method here


    public static void main(String[] args) {
        System.out.println(getLength("Hello"));
    }
}`,
    solutionCode: `public class Solution {
    public static int getLength(String s) {
        return s.length();
    }

    public static void main(String[] args) {
        System.out.println(getLength("Hello"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "5", isHidden: false },
    ],
    hints: [
      "Return type is int",
      "Use s.length()",
      "Simply return the result"
    ],
    tags: ["methods", "return", "String"],
  },
  {
    title: "Return Is Palindrome Number",
    slug: "return-palindrome-number",
    type: "CODE",
    prompt: "Write a method isPalindrome that returns true if a number reads the same forwards and backwards (e.g., 121).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 10,
    points: 45,
    starterCode: `public class Solution {
    // Write isPalindrome method here


    public static void main(String[] args) {
        System.out.println(isPalindrome(121));
        System.out.println(isPalindrome(123));
    }
}`,
    solutionCode: `public class Solution {
    public static boolean isPalindrome(int n) {
        int original = n;
        int reversed = 0;
        while (n > 0) {
            reversed = reversed * 10 + n % 10;
            n /= 10;
        }
        return original == reversed;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome(121));
        System.out.println(isPalindrome(123));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true\nfalse", isHidden: false },
    ],
    hints: [
      "Reverse the number",
      "Compare original with reversed",
      "121 reversed is 121"
    ],
    tags: ["methods", "return", "palindrome"],
  },
  {
    title: "Return Count Digits",
    slug: "return-count-digits",
    type: "CODE",
    prompt: "Write a method countDigits that returns the number of digits in a positive integer.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    // Write countDigits method here


    public static void main(String[] args) {
        System.out.println(countDigits(12345));
    }
}`,
    solutionCode: `public class Solution {
    public static int countDigits(int n) {
        int count = 0;
        while (n > 0) {
            count++;
            n /= 10;
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countDigits(12345));
    }
}`,
    tests: [
      { input: "", expectedOutput: "5", isHidden: false },
    ],
    hints: [
      "Divide by 10 until n becomes 0",
      "Count each division",
      "12345 has 5 digits"
    ],
    tags: ["methods", "return", "digits"],
  },
  {
    title: "Using Return Value",
    slug: "using-return-value",
    type: "CODE",
    prompt: "Call the square method twice and print the sum of square(3) and square(4).",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static int square(int n) {
        return n * n;
    }

    public static void main(String[] args) {
        // Print square(3) + square(4)

    }
}`,
    solutionCode: `public class Solution {
    public static int square(int n) {
        return n * n;
    }

    public static void main(String[] args) {
        System.out.println(square(3) + square(4));
    }
}`,
    tests: [
      { input: "", expectedOutput: "25", isHidden: false },
    ],
    hints: [
      "Call square(3) and square(4)",
      "Add them together",
      "9 + 16 = 25"
    ],
    tags: ["methods", "return", "expressions"],
  },
  {
    title: "Store Return Value",
    slug: "store-return-value",
    type: "CODE",
    prompt: "Store the return value of sum(10, 20) in a variable result, then print result.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static int sum(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        // Store sum in result and print

    }
}`,
    solutionCode: `public class Solution {
    public static int sum(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = sum(10, 20);
        System.out.println(result);
    }
}`,
    tests: [
      { input: "", expectedOutput: "30", isHidden: false },
    ],
    hints: [
      "int result = sum(10, 20);",
      "Then print result",
      "The return value is stored in the variable"
    ],
    tags: ["methods", "return", "variables"],
  },

  // ===== Topic 10: Method Overloading (8 questions) =====
  {
    title: "Overload Add Method",
    slug: "overload-add",
    type: "CODE",
    prompt: "Add an overloaded version of add that takes 3 integers.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static int add(int a, int b) {
        return a + b;
    }

    // Add overloaded add for 3 integers


    public static void main(String[] args) {
        System.out.println(add(1, 2));
        System.out.println(add(1, 2, 3));
    }
}`,
    solutionCode: `public class Solution {
    public static int add(int a, int b) {
        return a + b;
    }

    public static int add(int a, int b, int c) {
        return a + b + c;
    }

    public static void main(String[] args) {
        System.out.println(add(1, 2));
        System.out.println(add(1, 2, 3));
    }
}`,
    tests: [
      { input: "", expectedOutput: "3\n6", isHidden: false },
    ],
    hints: [
      "Same method name, different parameters",
      "add(int a, int b, int c)",
      "Return a + b + c"
    ],
    tags: ["methods", "overloading"],
  },
  {
    title: "Overload with Different Types",
    slug: "overload-types",
    type: "CODE",
    prompt: "Add an overloaded print method that takes a double instead of int.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    public static void print(int n) {
        System.out.println("Integer: " + n);
    }

    // Add overloaded print for double


    public static void main(String[] args) {
        print(5);
        print(3.14);
    }
}`,
    solutionCode: `public class Solution {
    public static void print(int n) {
        System.out.println("Integer: " + n);
    }

    public static void print(double n) {
        System.out.println("Double: " + n);
    }

    public static void main(String[] args) {
        print(5);
        print(3.14);
    }
}`,
    tests: [
      { input: "", expectedOutput: "Integer: 5\nDouble: 3.14", isHidden: false },
    ],
    hints: [
      "Same name, different parameter type",
      "print(double n)",
      "Print \"Double: \" + n"
    ],
    tags: ["methods", "overloading", "types"],
  },
  {
    title: "Overload Multiply",
    slug: "overload-multiply",
    type: "CODE",
    prompt: "Create overloaded multiply methods for 2 ints and 2 doubles.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    // Write multiply methods here


    public static void main(String[] args) {
        System.out.println(multiply(3, 4));
        System.out.println(multiply(2.5, 4.0));
    }
}`,
    solutionCode: `public class Solution {
    public static int multiply(int a, int b) {
        return a * b;
    }

    public static double multiply(double a, double b) {
        return a * b;
    }

    public static void main(String[] args) {
        System.out.println(multiply(3, 4));
        System.out.println(multiply(2.5, 4.0));
    }
}`,
    tests: [
      { input: "", expectedOutput: "12\n10.0", isHidden: false },
    ],
    hints: [
      "Two methods with same name",
      "One takes ints, one takes doubles",
      "Return types match parameter types"
    ],
    tags: ["methods", "overloading"],
  },

  // ===== Topic 11: Validation (7 questions) =====
  {
    title: "Validate Positive",
    slug: "validate-positive",
    type: "CODE",
    prompt: "Write a method isValidAge that returns true only if age is between 0 and 120.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write isValidAge method here


    public static void main(String[] args) {
        System.out.println(isValidAge(25));
        System.out.println(isValidAge(-5));
        System.out.println(isValidAge(150));
    }
}`,
    solutionCode: `public class Solution {
    public static boolean isValidAge(int age) {
        return age >= 0 && age <= 120;
    }

    public static void main(String[] args) {
        System.out.println(isValidAge(25));
        System.out.println(isValidAge(-5));
        System.out.println(isValidAge(150));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true\nfalse\nfalse", isHidden: false },
    ],
    hints: [
      "Check both lower and upper bounds",
      "Use && to combine conditions",
      "0 <= age <= 120"
    ],
    tags: ["methods", "validation", "range"],
  },
  {
    title: "Validate Non-Empty String",
    slug: "validate-non-empty",
    type: "CODE",
    prompt: "Write a method isNonEmpty that returns true if the string is not null and not empty.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write isNonEmpty method here


    public static void main(String[] args) {
        System.out.println(isNonEmpty("Hello"));
        System.out.println(isNonEmpty(""));
        System.out.println(isNonEmpty(null));
    }
}`,
    solutionCode: `public class Solution {
    public static boolean isNonEmpty(String s) {
        return s != null && !s.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println(isNonEmpty("Hello"));
        System.out.println(isNonEmpty(""));
        System.out.println(isNonEmpty(null));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true\nfalse\nfalse", isHidden: false },
    ],
    hints: [
      "Check for null first",
      "Then check isEmpty()",
      "Order matters to avoid NullPointerException"
    ],
    tags: ["methods", "validation", "String"],
  },
  {
    title: "Validate Email Basic",
    slug: "validate-email-basic",
    type: "CODE",
    prompt: "Write a method isValidEmail that returns true if the string contains @ and has at least one character before and after @.",
    constraints: "Basic check only.",
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    // Write isValidEmail method here


    public static void main(String[] args) {
        System.out.println(isValidEmail("test@example.com"));
        System.out.println(isValidEmail("@example.com"));
        System.out.println(isValidEmail("test@"));
        System.out.println(isValidEmail("invalid"));
    }
}`,
    solutionCode: `public class Solution {
    public static boolean isValidEmail(String email) {
        if (email == null) return false;
        int atIndex = email.indexOf('@');
        return atIndex > 0 && atIndex < email.length() - 1;
    }

    public static void main(String[] args) {
        System.out.println(isValidEmail("test@example.com"));
        System.out.println(isValidEmail("@example.com"));
        System.out.println(isValidEmail("test@"));
        System.out.println(isValidEmail("invalid"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "true\nfalse\nfalse\nfalse", isHidden: false },
    ],
    hints: [
      "Find the position of @",
      "Check @ is not at start (index > 0)",
      "Check @ is not at end (index < length - 1)"
    ],
    tags: ["methods", "validation", "email"],
  },
  {
    title: "Validate Score Range",
    slug: "validate-score-range",
    type: "CODE",
    prompt: "Write a getGrade method that returns 'A'-'F' based on score, or 'X' if score is invalid (not 0-100).",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 8,
    points: 40,
    starterCode: `public class Solution {
    // Write getGrade method here


    public static void main(String[] args) {
        System.out.println(getGrade(95));
        System.out.println(getGrade(75));
        System.out.println(getGrade(55));
        System.out.println(getGrade(-10));
    }
}`,
    solutionCode: `public class Solution {
    public static char getGrade(int score) {
        if (score < 0 || score > 100) return 'X';
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    public static void main(String[] args) {
        System.out.println(getGrade(95));
        System.out.println(getGrade(75));
        System.out.println(getGrade(55));
        System.out.println(getGrade(-10));
    }
}`,
    tests: [
      { input: "", expectedOutput: "A\nC\nF\nX", isHidden: false },
    ],
    hints: [
      "First validate the range 0-100",
      "Return 'X' for invalid scores",
      "Then check grade thresholds"
    ],
    tags: ["methods", "validation", "grades"],
  },
  {
    title: "Validate Password Length",
    slug: "validate-password-length",
    type: "CODE",
    prompt: "Write isValidPassword that returns true if password is at least 8 characters long.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    // Write isValidPassword method here


    public static void main(String[] args) {
        System.out.println(isValidPassword("short"));
        System.out.println(isValidPassword("longenough"));
    }
}`,
    solutionCode: `public class Solution {
    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 8;
    }

    public static void main(String[] args) {
        System.out.println(isValidPassword("short"));
        System.out.println(isValidPassword("longenough"));
    }
}`,
    tests: [
      { input: "", expectedOutput: "false\ntrue", isHidden: false },
    ],
    hints: [
      "Check for null first",
      "Then check length >= 8",
      "\"short\" is only 5 characters"
    ],
    tags: ["methods", "validation", "password"],
  },
  {
    title: "Safe Division",
    slug: "safe-division",
    type: "CODE",
    prompt: "Write safeDivide that returns a/b, or 0 if b is 0 (to avoid division by zero).",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 5,
    points: 25,
    starterCode: `public class Solution {
    // Write safeDivide method here


    public static void main(String[] args) {
        System.out.println(safeDivide(10, 2));
        System.out.println(safeDivide(10, 0));
    }
}`,
    solutionCode: `public class Solution {
    public static int safeDivide(int a, int b) {
        if (b == 0) return 0;
        return a / b;
    }

    public static void main(String[] args) {
        System.out.println(safeDivide(10, 2));
        System.out.println(safeDivide(10, 0));
    }
}`,
    tests: [
      { input: "", expectedOutput: "5\n0", isHidden: false },
    ],
    hints: [
      "Check if b is 0 first",
      "Return 0 to avoid crash",
      "Otherwise return a / b"
    ],
    tags: ["methods", "validation", "division"],
  },
  {
    title: "Clamp Value",
    slug: "clamp-value",
    type: "CODE",
    prompt: "Write clamp that returns value if it's between min and max, otherwise returns the nearest boundary.",
    constraints: null,
    difficulty: 3,
    estimatedMinutes: 6,
    points: 30,
    starterCode: `public class Solution {
    // Write clamp method here


    public static void main(String[] args) {
        System.out.println(clamp(5, 0, 10));   // 5 is in range
        System.out.println(clamp(-5, 0, 10));  // too low, return 0
        System.out.println(clamp(15, 0, 10));  // too high, return 10
    }
}`,
    solutionCode: `public class Solution {
    public static int clamp(int value, int min, int max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    public static void main(String[] args) {
        System.out.println(clamp(5, 0, 10));
        System.out.println(clamp(-5, 0, 10));
        System.out.println(clamp(15, 0, 10));
    }
}`,
    tests: [
      { input: "", expectedOutput: "5\n0\n10", isHidden: false },
    ],
    hints: [
      "If value < min, return min",
      "If value > max, return max",
      "Otherwise return value as-is"
    ],
    tags: ["methods", "validation", "clamp"],
  },
]
