/**
 * Java Curriculum Data Model
 * Single source of truth for course structure
 * This file is imported by the seed script
 */

export interface TestCase {
  input: string
  expectedOutput: string
  isHidden?: boolean
  description?: string
  timeLimit?: number
  memoryLimit?: number
}

export interface QuestionData {
  slug: string
  type: "FULL_PROGRAM" | "FUNCTION" | "FIX_BUG" | "PREDICT_OUTPUT"
  title: string
  prompt: string
  constraints?: string
  starterCode: string
  solutionCode: string
  tests: TestCase[]
  hints: string[]
  explanation?: string
  tags: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  estimatedMinutes: number
  points: number
  xpReward?: number
  timeLimit?: number
  memoryLimit?: number
}

export interface LessonData {
  slug: string
  title: string
  content: string
}

export interface TopicData {
  slug: string
  title: string
  description: string
  lessons?: LessonData[]
  questions: QuestionData[]
}

export interface WeekData {
  weekNumber: number
  title: string
  description: string
  topics: TopicData[]
}

export interface CourseData {
  slug: string
  name: string
  description: string
  language: string
  weeks: WeekData[]
}

// Java Fundamentals Course
export const javaCurriculum: CourseData = {
  slug: "java-weeks-1-5",
  name: "Java Fundamentals (Weeks 1-5)",
  description: "Master Java basics: command line, variables, control flow, functions, and arrays. Perfect for CS students starting their programming journey.",
  language: "java",
  weeks: [
    // Week 1 is seeded from existing week1-cli.ts
    // Week 2 - Strings & Control Flow
    {
      weekNumber: 2,
      title: "Strings & Control Flow",
      description: "String manipulation, conditionals, and loop structures",
      topics: [
        {
          slug: "string-methods",
          title: "String Methods",
          description: "Master Java String class methods and operations",
          questions: [
            {
              slug: "string-length",
              type: "FULL_PROGRAM",
              title: "String Length",
              prompt: "Given a string \"Hello World\", print its length.",
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
                { input: "", expectedOutput: "11", isHidden: false }
              ],
              hints: [
                "Use the length() method on strings",
                "Spaces count as characters",
                "The method returns an integer"
              ],
              tags: ["strings", "length", "methods"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "string-uppercase",
              type: "FULL_PROGRAM",
              title: "String Uppercase",
              prompt: "Convert \"hello java\" to uppercase and print it.",
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
                { input: "", expectedOutput: "HELLO JAVA", isHidden: false }
              ],
              hints: [
                "Use toUpperCase() method",
                "It returns a new string",
                "Print the result directly"
              ],
              tags: ["strings", "uppercase", "methods"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "string-substring",
              type: "FULL_PROGRAM",
              title: "Extract Substring",
              prompt: "Given \"Hello World\", extract and print \"World\" using substring.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        // Extract "World" and print it

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Hello World";
        System.out.println(text.substring(6));
    }
}`,
              tests: [
                { input: "", expectedOutput: "World", isHidden: false }
              ],
              hints: [
                "Use substring() method",
                "Count from 0: H=0, e=1, l=2, l=3, o=4, space=5, W=6",
                "substring(6) gets everything from index 6 onwards"
              ],
              tags: ["strings", "substring", "methods"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            },
            {
              slug: "string-charat",
              type: "FULL_PROGRAM",
              title: "Character At Index",
              prompt: "Print the character at index 4 in \"Programming\".",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Programming";
        // Print the character at index 4

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        String text = "Programming";
        System.out.println(text.charAt(4));
    }
}`,
              tests: [
                { input: "", expectedOutput: "r", isHidden: false }
              ],
              hints: [
                "Use charAt() method",
                "Index starts at 0",
                "P=0, r=1, o=2, g=3, r=4"
              ],
              tags: ["strings", "charAt", "methods"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "string-concat",
              type: "FULL_PROGRAM",
              title: "String Concatenation",
              prompt: "Concatenate \"Hello\" and \"World\" with a space between them using the + operator.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        String a = "Hello";
        String b = "World";
        // Concatenate with a space and print

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        String a = "Hello";
        String b = "World";
        System.out.println(a + " " + b);
    }
}`,
              tests: [
                { input: "", expectedOutput: "Hello World", isHidden: false }
              ],
              hints: [
                "Use + to join strings",
                "Don't forget the space between them",
                "\" \" is a string with just a space"
              ],
              tags: ["strings", "concatenation", "operators"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            }
          ]
        },
        {
          slug: "conditionals",
          title: "Conditionals",
          description: "If statements, comparisons, and logical operators",
          questions: [
            {
              slug: "simple-if",
              type: "FULL_PROGRAM",
              title: "Simple If Statement",
              prompt: "Check if a number is positive. If num > 0, print \"Positive\".",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int num = 5;
        // Check if positive and print

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int num = 5;
        if (num > 0) {
            System.out.println("Positive");
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "Positive", isHidden: false }
              ],
              hints: [
                "Use if (condition) { ... }",
                "The condition is num > 0",
                "Put println inside the if block"
              ],
              tags: ["conditionals", "if", "comparison"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "if-else",
              type: "FULL_PROGRAM",
              title: "If-Else Statement",
              prompt: "Check if num is even or odd. Print \"Even\" or \"Odd\" accordingly.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int num = 7;
        // Check if even or odd

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int num = 7;
        if (num % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "Odd", isHidden: false }
              ],
              hints: [
                "Use num % 2 to get remainder",
                "If remainder is 0, it's even",
                "Use else for the other case"
              ],
              tags: ["conditionals", "if-else", "modulo"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            },
            {
              slug: "if-else-if",
              type: "FULL_PROGRAM",
              title: "Grade Classification",
              prompt: "Given a score of 85, print the grade:\n- 90+ : \"A\"\n- 80-89: \"B\"\n- 70-79: \"C\"\n- Below 70: \"F\"",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int score = 85;
        // Print the grade

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int score = 85;
        if (score >= 90) {
            System.out.println("A");
        } else if (score >= 80) {
            System.out.println("B");
        } else if (score >= 70) {
            System.out.println("C");
        } else {
            System.out.println("F");
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "B", isHidden: false }
              ],
              hints: [
                "Use if, else if, else chain",
                "Check from highest to lowest",
                "85 is >= 80, so it's a B"
              ],
              tags: ["conditionals", "if-else-if", "grades"],
              difficulty: 2,
              estimatedMinutes: 8,
              points: 30
            },
            {
              slug: "logical-and",
              type: "FULL_PROGRAM",
              title: "Logical AND",
              prompt: "Check if num is between 10 and 20 (inclusive). Print \"In range\" if true.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int num = 15;
        // Check if num is between 10 and 20

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int num = 15;
        if (num >= 10 && num <= 20) {
            System.out.println("In range");
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "In range", isHidden: false }
              ],
              hints: [
                "Use && for logical AND",
                "Both conditions must be true",
                "num >= 10 AND num <= 20"
              ],
              tags: ["conditionals", "logical-and", "range"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "logical-or",
              type: "FULL_PROGRAM",
              title: "Logical OR",
              prompt: "Check if char is a vowel (a, e, i, o, u). Print \"Vowel\" if true.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        char c = 'e';
        // Check if c is a vowel

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        char c = 'e';
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            System.out.println("Vowel");
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "Vowel", isHidden: false }
              ],
              hints: [
                "Use || for logical OR",
                "Any one condition being true is enough",
                "Compare char with == 'a' etc."
              ],
              tags: ["conditionals", "logical-or", "vowel"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            }
          ]
        },
        {
          slug: "loops",
          title: "Loops",
          description: "For loops, while loops, and loop control",
          questions: [
            {
              slug: "for-loop-basic",
              type: "FULL_PROGRAM",
              title: "Basic For Loop",
              prompt: "Print numbers 1 through 5, each on a new line.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print 1 to 5 using a for loop

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
                { input: "", expectedOutput: "1\n2\n3\n4\n5", isHidden: false }
              ],
              hints: [
                "for (init; condition; update) { ... }",
                "Start i at 1, go while i <= 5",
                "Use println to put each on new line"
              ],
              tags: ["loops", "for", "counting"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            },
            {
              slug: "for-loop-sum",
              type: "FULL_PROGRAM",
              title: "Sum with For Loop",
              prompt: "Calculate and print the sum of numbers from 1 to 10.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int sum = 0;
        // Add 1 to 10 to sum

        System.out.println(sum);
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
                { input: "", expectedOutput: "55", isHidden: false }
              ],
              hints: [
                "sum += i adds i to sum",
                "Loop from 1 to 10",
                "1+2+3+4+5+6+7+8+9+10 = 55"
              ],
              tags: ["loops", "for", "sum", "accumulator"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "while-loop-basic",
              type: "FULL_PROGRAM",
              title: "Basic While Loop",
              prompt: "Print numbers 1 through 5 using a while loop.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int i = 1;
        // Use while loop to print 1 to 5

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int i = 1;
        while (i <= 5) {
            System.out.println(i);
            i++;
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "1\n2\n3\n4\n5", isHidden: false }
              ],
              hints: [
                "while (condition) { ... }",
                "Don't forget to increment i!",
                "Infinite loop if you forget i++"
              ],
              tags: ["loops", "while", "counting"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            },
            {
              slug: "nested-loops",
              type: "FULL_PROGRAM",
              title: "Multiplication Table",
              prompt: "Print a 3x3 multiplication table in the format:\n1 2 3\n2 4 6\n3 6 9",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        // Use nested loops to print 3x3 multiplication table

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                System.out.print(i * j);
                if (j < 3) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "1 2 3\n2 4 6\n3 6 9", isHidden: false }
              ],
              hints: [
                "Outer loop for rows (i)",
                "Inner loop for columns (j)",
                "Use print() for same line, println() for new line"
              ],
              tags: ["loops", "nested", "multiplication"],
              difficulty: 3,
              estimatedMinutes: 10,
              points: 40
            },
            {
              slug: "loop-break",
              type: "FULL_PROGRAM",
              title: "Break Statement",
              prompt: "Print numbers 1 to 10, but stop (break) when you reach 5.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print 1 to 10, break at 5

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            if (i == 5) break;
            System.out.println(i);
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "1\n2\n3\n4", isHidden: false }
              ],
              hints: [
                "break exits the loop immediately",
                "Check condition before printing",
                "Output should be 1,2,3,4 (stop before 5)"
              ],
              tags: ["loops", "break", "control"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            }
          ]
        }
      ]
    },
    // Week 3 - Functions & Methods
    {
      weekNumber: 3,
      title: "Functions & Methods",
      description: "Modular programming with functions",
      topics: [
        {
          slug: "function-basics",
          title: "Function Basics",
          description: "Define and call methods, understand parameters",
          questions: [
            {
              slug: "void-method",
              type: "FULL_PROGRAM",
              title: "Void Method",
              prompt: "Create a method called greet() that prints \"Hello!\". Call it from main.",
              starterCode: `public class Solution {
    // Define greet() method here

    public static void main(String[] args) {
        // Call greet()
    }
}`,
              solutionCode: `public class Solution {
    public static void greet() {
        System.out.println("Hello!");
    }

    public static void main(String[] args) {
        greet();
    }
}`,
              tests: [
                { input: "", expectedOutput: "Hello!", isHidden: false }
              ],
              hints: [
                "void means no return value",
                "Methods must be static to call from static main",
                "Call with greet()"
              ],
              tags: ["functions", "void", "methods"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            },
            {
              slug: "method-with-parameter",
              type: "FULL_PROGRAM",
              title: "Method with Parameter",
              prompt: "Create greetName(String name) that prints \"Hello, [name]!\". Call with \"Alice\".",
              starterCode: `public class Solution {
    // Define greetName method

    public static void main(String[] args) {
        // Call greetName("Alice")
    }
}`,
              solutionCode: `public class Solution {
    public static void greetName(String name) {
        System.out.println("Hello, " + name + "!");
    }

    public static void main(String[] args) {
        greetName("Alice");
    }
}`,
              tests: [
                { input: "", expectedOutput: "Hello, Alice!", isHidden: false }
              ],
              hints: [
                "Parameter goes in parentheses: (String name)",
                "Use name variable inside method",
                "Concatenate with + operator"
              ],
              tags: ["functions", "parameters", "methods"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            },
            {
              slug: "multiple-parameters",
              type: "FULL_PROGRAM",
              title: "Multiple Parameters",
              prompt: "Create add(int a, int b) that prints the sum. Call with 3 and 7.",
              starterCode: `public class Solution {
    // Define add method

    public static void main(String[] args) {
        // Call add(3, 7)
    }
}`,
              solutionCode: `public class Solution {
    public static void add(int a, int b) {
        System.out.println(a + b);
    }

    public static void main(String[] args) {
        add(3, 7);
    }
}`,
              tests: [
                { input: "", expectedOutput: "10", isHidden: false }
              ],
              hints: [
                "Separate parameters with comma",
                "Both a and b are int",
                "Just print a + b"
              ],
              tags: ["functions", "parameters", "addition"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            }
          ]
        },
        {
          slug: "return-values",
          title: "Return Values",
          description: "Return types, return statements, using return values",
          questions: [
            {
              slug: "return-int",
              type: "FULL_PROGRAM",
              title: "Return an Integer",
              prompt: "Create square(int n) that returns n*n. Print square(4).",
              starterCode: `public class Solution {
    // Define square method that returns int

    public static void main(String[] args) {
        System.out.println(square(4));
    }
}`,
              solutionCode: `public class Solution {
    public static int square(int n) {
        return n * n;
    }

    public static void main(String[] args) {
        System.out.println(square(4));
    }
}`,
              tests: [
                { input: "", expectedOutput: "16", isHidden: false }
              ],
              hints: [
                "Return type is int, not void",
                "Use return statement",
                "4 * 4 = 16"
              ],
              tags: ["functions", "return", "int"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "return-boolean",
              type: "FULL_PROGRAM",
              title: "Return Boolean",
              prompt: "Create isEven(int n) that returns true if n is even. Print isEven(6).",
              starterCode: `public class Solution {
    // Define isEven method

    public static void main(String[] args) {
        System.out.println(isEven(6));
    }
}`,
              solutionCode: `public class Solution {
    public static boolean isEven(int n) {
        return n % 2 == 0;
    }

    public static void main(String[] args) {
        System.out.println(isEven(6));
    }
}`,
              tests: [
                { input: "", expectedOutput: "true", isHidden: false }
              ],
              hints: [
                "Return type is boolean",
                "n % 2 == 0 is already a boolean",
                "6 is even, so true"
              ],
              tags: ["functions", "return", "boolean"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "max-of-two",
              type: "FUNCTION",
              title: "Maximum of Two",
              prompt: "Complete the max method that returns the larger of two integers.",
              starterCode: `public class Solution {
    public static int max(int a, int b) {
        // Return the larger value

    }

    public static void main(String[] args) {
        System.out.println(max(5, 8));
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
        System.out.println(max(5, 8));
    }
}`,
              tests: [
                { input: "", expectedOutput: "8", isHidden: false }
              ],
              hints: [
                "Compare a and b",
                "Return whichever is larger",
                "Use if-else"
              ],
              tags: ["functions", "return", "max", "comparison"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "factorial",
              type: "FUNCTION",
              title: "Factorial",
              prompt: "Complete the factorial method. factorial(5) should return 120 (5*4*3*2*1).",
              starterCode: `public class Solution {
    public static int factorial(int n) {
        // Calculate and return n!

    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
              solutionCode: `public class Solution {
    public static int factorial(int n) {
        int result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
              tests: [
                { input: "", expectedOutput: "120", isHidden: false }
              ],
              hints: [
                "Start result at 1",
                "Multiply by each number 1 to n",
                "5! = 1*2*3*4*5 = 120"
              ],
              tags: ["functions", "factorial", "loops"],
              difficulty: 3,
              estimatedMinutes: 10,
              points: 40
            }
          ]
        }
      ]
    },
    // Week 4 - Arrays
    {
      weekNumber: 4,
      title: "Arrays",
      description: "One-dimensional arrays and array operations",
      topics: [
        {
          slug: "array-basics",
          title: "Array Basics",
          description: "Create, access, and modify arrays",
          questions: [
            {
              slug: "array-declaration",
              type: "FULL_PROGRAM",
              title: "Array Declaration",
              prompt: "Create an array of 5 integers {1, 2, 3, 4, 5} and print the third element.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        // Create array and print 3rd element

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        System.out.println(arr[2]);
    }
}`,
              tests: [
                { input: "", expectedOutput: "3", isHidden: false }
              ],
              hints: [
                "Use int[] arr = {1, 2, 3, 4, 5}",
                "Array index starts at 0",
                "Third element is at index 2"
              ],
              tags: ["arrays", "declaration", "indexing"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "array-length",
              type: "FULL_PROGRAM",
              title: "Array Length",
              prompt: "Create an array {10, 20, 30, 40} and print its length.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        // Create array and print length

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40};
        System.out.println(arr.length);
    }
}`,
              tests: [
                { input: "", expectedOutput: "4", isHidden: false }
              ],
              hints: [
                "Use .length (no parentheses)",
                "Not .length() like String",
                "Array has 4 elements"
              ],
              tags: ["arrays", "length", "property"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "array-sum",
              type: "FULL_PROGRAM",
              title: "Array Sum",
              prompt: "Calculate and print the sum of array {5, 10, 15, 20, 25}.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 10, 15, 20, 25};
        // Calculate and print sum

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {5, 10, 15, 20, 25};
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        System.out.println(sum);
    }
}`,
              tests: [
                { input: "", expectedOutput: "75", isHidden: false }
              ],
              hints: [
                "Loop from 0 to arr.length - 1",
                "Use arr.length in condition",
                "5+10+15+20+25 = 75"
              ],
              tags: ["arrays", "sum", "loops"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "array-max",
              type: "FULL_PROGRAM",
              title: "Find Maximum",
              prompt: "Find and print the maximum value in {3, 7, 2, 9, 1}.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {3, 7, 2, 9, 1};
        // Find and print max

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {3, 7, 2, 9, 1};
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        System.out.println(max);
    }
}`,
              tests: [
                { input: "", expectedOutput: "9", isHidden: false }
              ],
              hints: [
                "Start max with first element",
                "Compare each element with max",
                "Update max if larger found"
              ],
              tags: ["arrays", "max", "search"],
              difficulty: 2,
              estimatedMinutes: 8,
              points: 30
            },
            {
              slug: "array-reverse-print",
              type: "FULL_PROGRAM",
              title: "Reverse Print",
              prompt: "Print array {1, 2, 3, 4, 5} in reverse order (5, 4, 3, 2, 1) each on new line.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        // Print in reverse

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        for (int i = arr.length - 1; i >= 0; i--) {
            System.out.println(arr[i]);
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "5\n4\n3\n2\n1", isHidden: false }
              ],
              hints: [
                "Start from last index (length - 1)",
                "Go backwards with i--",
                "Stop when i < 0"
              ],
              tags: ["arrays", "reverse", "loops"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            }
          ]
        }
      ]
    },
    // Week 5 - 2D Arrays & I/O
    {
      weekNumber: 5,
      title: "2D Arrays & I/O",
      description: "Multi-dimensional arrays and input/output operations",
      topics: [
        {
          slug: "2d-arrays",
          title: "2D Arrays",
          description: "Create and manipulate two-dimensional arrays",
          questions: [
            {
              slug: "2d-declaration",
              type: "FULL_PROGRAM",
              title: "2D Array Declaration",
              prompt: "Create a 2x3 array:\n{{1, 2, 3}, {4, 5, 6}}\nPrint element at row 1, column 2.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        // Create 2D array and print element

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        System.out.println(arr[1][2]);
    }
}`,
              tests: [
                { input: "", expectedOutput: "6", isHidden: false }
              ],
              hints: [
                "int[][] for 2D array",
                "First index is row, second is column",
                "Row 1, Col 2 = 6"
              ],
              tags: ["2d-arrays", "declaration", "indexing"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "2d-row-sum",
              type: "FULL_PROGRAM",
              title: "Row Sum",
              prompt: "For array {{1, 2, 3}, {4, 5, 6}}, print the sum of row 0.",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        // Sum and print row 0

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2, 3}, {4, 5, 6}};
        int sum = 0;
        for (int j = 0; j < arr[0].length; j++) {
            sum += arr[0][j];
        }
        System.out.println(sum);
    }
}`,
              tests: [
                { input: "", expectedOutput: "6", isHidden: false }
              ],
              hints: [
                "arr[0] is row 0",
                "Loop through columns",
                "1 + 2 + 3 = 6"
              ],
              tags: ["2d-arrays", "row", "sum"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "2d-print-all",
              type: "FULL_PROGRAM",
              title: "Print 2D Array",
              prompt: "Print all elements of {{1, 2}, {3, 4}, {5, 6}} row by row:\n1 2\n3 4\n5 6",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2}, {3, 4}, {5, 6}};
        // Print the 2D array

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] arr = {{1, 2}, {3, 4}, {5, 6}};
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr[i].length; j++) {
                System.out.print(arr[i][j]);
                if (j < arr[i].length - 1) System.out.print(" ");
            }
            System.out.println();
        }
    }
}`,
              tests: [
                { input: "", expectedOutput: "1 2\n3 4\n5 6", isHidden: false }
              ],
              hints: [
                "Outer loop for rows",
                "Inner loop for columns",
                "println() after each row"
              ],
              tags: ["2d-arrays", "print", "nested-loops"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 35
            },
            {
              slug: "2d-diagonal-sum",
              type: "FULL_PROGRAM",
              title: "Diagonal Sum",
              prompt: "For a 3x3 matrix, calculate the sum of main diagonal:\n{{1,2,3},{4,5,6},{7,8,9}}\nDiagonal: 1 + 5 + 9 = 15",
              starterCode: `public class Solution {
    public static void main(String[] args) {
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        // Calculate and print diagonal sum

    }
}`,
              solutionCode: `public class Solution {
    public static void main(String[] args) {
        int[][] matrix = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        int sum = 0;
        for (int i = 0; i < matrix.length; i++) {
            sum += matrix[i][i];
        }
        System.out.println(sum);
    }
}`,
              tests: [
                { input: "", expectedOutput: "15", isHidden: false }
              ],
              hints: [
                "Diagonal: row index equals column index",
                "matrix[0][0], matrix[1][1], matrix[2][2]",
                "Single loop is enough"
              ],
              tags: ["2d-arrays", "diagonal", "matrix"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 35
            }
          ]
        },
        {
          slug: "standard-io",
          title: "Standard I/O",
          description: "Read input with Scanner, format output",
          questions: [
            {
              slug: "scanner-int",
              type: "FULL_PROGRAM",
              title: "Read Integer",
              prompt: "Read an integer from input and print it doubled.",
              constraints: "Input is a single integer",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read integer and print doubled

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(n * 2);
    }
}`,
              tests: [
                { input: "5", expectedOutput: "10", isHidden: false },
                { input: "7", expectedOutput: "14", isHidden: true }
              ],
              hints: [
                "Use sc.nextInt() to read integer",
                "Multiply by 2",
                "Print the result"
              ],
              tags: ["io", "scanner", "input"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            },
            {
              slug: "scanner-string",
              type: "FULL_PROGRAM",
              title: "Read String",
              prompt: "Read a name from input and print \"Hello, [name]!\"",
              constraints: "Input is a single word (no spaces)",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read name and greet

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        System.out.println("Hello, " + name + "!");
    }
}`,
              tests: [
                { input: "Alice", expectedOutput: "Hello, Alice!", isHidden: false },
                { input: "Bob", expectedOutput: "Hello, Bob!", isHidden: true }
              ],
              hints: [
                "Use sc.next() for single word",
                "Concatenate with +",
                "Don't forget the exclamation mark"
              ],
              tags: ["io", "scanner", "string"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            },
            {
              slug: "multiple-inputs",
              type: "FULL_PROGRAM",
              title: "Multiple Inputs",
              prompt: "Read two integers and print their sum.",
              constraints: "Input: two integers on same line separated by space",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read two integers and print sum

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
              tests: [
                { input: "3 5", expectedOutput: "8", isHidden: false },
                { input: "10 20", expectedOutput: "30", isHidden: true }
              ],
              hints: [
                "Call nextInt() twice",
                "Scanner automatically handles whitespace",
                "Add and print"
              ],
              tags: ["io", "scanner", "multiple"],
              difficulty: 1,
              estimatedMinutes: 5,
              points: 20
            }
          ]
        }
      ]
    }
  ]
}
