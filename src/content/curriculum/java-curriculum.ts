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
  introMarkdown?: string
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
    },
    // Week 6 - Recursion Fundamentals
    {
      weekNumber: 6,
      title: "Recursion — Fundamentals",
      description: "Master recursive thinking with numbers and strings",
      topics: [
        {
          slug: "recursion-fundamentals",
          title: "Recursion — Numbers & Strings",
          description: "Learn base cases, recursion steps, and apply to numbers and strings",
          questions: [
            {
              slug: "factorial-basic",
              type: "FULL_PROGRAM",
              title: "Factorial (Basic Recursion)",
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
                { input: "", expectedOutput: "1\n120\n-1", isHidden: false }
              ],
              hints: [
                "Every recursive function needs a BASE CASE - when does recursion stop?",
                "For factorial, the base case is when n is 0 or 1 (both return 1)",
                "The recursive step: factorial(n) = n * factorial(n-1)",
                "Don't forget to handle negative inputs BEFORE the base case"
              ],
              tags: ["recursion", "numbers", "base-case"],
              difficulty: 1,
              estimatedMinutes: 8,
              points: 100
            },
            {
              slug: "power-recursive",
              type: "FULL_PROGRAM",
              title: "Power (Base to Exponent)",
              prompt: `Write a recursive method that calculates base raised to the power of exponent (base^exp).

**Examples:**
- power(2, 0) → 1 (anything to the power of 0 is 1)
- power(2, 3) → 8 (2 × 2 × 2)
- power(5, 2) → 25

**Requirements:**
- Must use recursion (no loops, no Math.pow)
- Exponent is guaranteed to be non-negative`,
              constraints: "Do NOT use loops or Math.pow(). Your solution MUST be recursive.",
              starterCode: `public class Solution {
    public static long power(int base, int exp) {
        // Your recursive implementation here

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
                { input: "", expectedOutput: "1\n8\n25", isHidden: false }
              ],
              hints: [
                "Base case: What is any number raised to the power of 0?",
                "The recursive formula: power(base, exp) = base * power(base, exp - 1)"
              ],
              tags: ["recursion", "numbers", "power"],
              difficulty: 2,
              estimatedMinutes: 10,
              points: 120
            },
            {
              slug: "fibonacci-recursive",
              type: "FULL_PROGRAM",
              title: "Fibonacci Number",
              prompt: `Write a recursive method that returns the nth Fibonacci number.

**Fibonacci Sequence:** 0, 1, 1, 2, 3, 5, 8, 13, 21, ...
- F(0) = 0
- F(1) = 1  
- F(n) = F(n-1) + F(n-2) for n > 1

**Examples:**
- fibonacci(0) → 0
- fibonacci(1) → 1
- fibonacci(6) → 8

**Requirements:**
- Must use recursion
- Return -1 for negative inputs`,
              constraints: "Do NOT use loops. Your solution MUST be recursive.",
              starterCode: `public class Solution {
    public static int fibonacci(int n) {
        // Your recursive implementation here

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
        if (n < 0) {
            return -1;
        }
        if (n == 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }
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
                { input: "", expectedOutput: "0\n1\n8\n-1", isHidden: false }
              ],
              hints: [
                "Fibonacci has TWO base cases: F(0)=0 and F(1)=1",
                "The recursive formula adds two previous values: F(n) = F(n-1) + F(n-2)"
              ],
              tags: ["recursion", "numbers", "fibonacci"],
              difficulty: 3,
              estimatedMinutes: 12,
              points: 150
            },
            {
              slug: "string-equals-recursive",
              type: "FULL_PROGRAM",
              title: "String Equals (Recursive)",
              prompt: `Write a recursive method that checks if two strings are equal WITHOUT using .equals() or loops.

**Examples:**
- stringEquals("hello", "hello") → true
- stringEquals("hello", "world") → false
- stringEquals("", "") → true

**Requirements:**
- Must use recursion (no loops)
- Cannot use .equals() or .compareTo()
- Can use .length(), .charAt(), .substring()`,
              constraints: "Do NOT use loops, .equals(), or .compareTo().",
              starterCode: `public class Solution {
    public static boolean stringEquals(String s1, String s2) {
        // Your recursive implementation here

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
        if (s1.length() != s2.length()) {
            return false;
        }
        if (s1.length() == 0) {
            return true;
        }
        if (s1.charAt(0) != s2.charAt(0)) {
            return false;
        }
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
                { input: "", expectedOutput: "true\nfalse\ntrue\nfalse", isHidden: false }
              ],
              hints: [
                "First, check if lengths are different - if so, return false",
                "Base case: if both strings are empty, they're equal",
                "Compare first character, then recurse on substring(1)"
              ],
              tags: ["recursion", "strings"],
              difficulty: 4,
              estimatedMinutes: 15,
              points: 180
            },
            {
              slug: "reverse-string-recursive",
              type: "FULL_PROGRAM",
              title: "Reverse String (Recursive)",
              prompt: `Write a recursive method that reverses a string.

**Examples:**
- reverseString("hello") → "olleh"
- reverseString("a") → "a"
- reverseString("") → ""

**Requirements:**
- Must use recursion (no loops)
- Cannot use StringBuilder.reverse()`,
              constraints: "Do NOT use loops or StringBuilder.reverse().",
              starterCode: `public class Solution {
    public static String reverseString(String s) {
        // Your recursive implementation here

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
        if (s.length() <= 1) {
            return s;
        }
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
                { input: "", expectedOutput: "olleh\na\n\nba", isHidden: false }
              ],
              hints: [
                "Base case: empty string or single char returns as-is",
                "Key insight: reverse('hello') = reverse('ello') + 'h'"
              ],
              tags: ["recursion", "strings"],
              difficulty: 5,
              estimatedMinutes: 12,
              points: 200
            },
            {
              slug: "count-char-recursive",
              type: "FULL_PROGRAM",
              title: "Count Character (Recursive)",
              prompt: `Write a recursive method that counts how many times a character appears in a string.

**Examples:**
- countChar("hello", 'l') → 2
- countChar("hello", 'z') → 0
- countChar("", 'a') → 0
- countChar("aaa", 'a') → 3

**Requirements:**
- Must use recursion (no loops)`,
              constraints: "Do NOT use loops.",
              starterCode: `public class Solution {
    public static int countChar(String s, char c) {
        // Your recursive implementation here

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
        if (s.length() == 0) {
            return 0;
        }
        int count = (s.charAt(0) == c) ? 1 : 0;
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
                { input: "", expectedOutput: "2\n0\n0\n3", isHidden: false }
              ],
              hints: [
                "Base case: empty string → return 0",
                "Check if s.charAt(0) equals c, if so add 1",
                "Recurse on s.substring(1) and add the results"
              ],
              tags: ["recursion", "strings", "counting"],
              difficulty: 5,
              estimatedMinutes: 10,
              points: 220
            }
          ]
        }
      ]
    },
    // Week 7 - Recursion Mastery
    {
      weekNumber: 7,
      title: "Recursion — Mastery",
      description: "Advanced recursion with arrays, optimization, and complex patterns",
      topics: [
        {
          slug: "recursion-mastery",
          title: "Recursion — Arrays & Advanced Patterns",
          description: "Apply recursion to arrays, use memoization, and solve complex recursive problems",
          questions: [
            {
              slug: "max-value-recursive",
              type: "FULL_PROGRAM",
              title: "Find Maximum (Recursive)",
              prompt: `Write a recursive method that finds the maximum value in an integer array.

**Examples:**
- maxValue([1, 5, 3, 9, 2]) → 9
- maxValue([7]) → 7
- maxValue([-5, -2, -10]) → -2

**Requirements:**
- Must use recursion (no loops)`,
              constraints: "Do NOT use loops or Arrays.stream().",
              starterCode: `public class Solution {
    public static int maxValue(int[] arr) {
        return maxValueHelper(arr, 0);
    }

    private static int maxValueHelper(int[] arr, int index) {
        // Your recursive implementation here

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
        if (index == arr.length - 1) {
            return arr[index];
        }
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
                { input: "", expectedOutput: "9\n7\n-2", isHidden: false }
              ],
              hints: [
                "Use a helper method with an index parameter",
                "Base case: when index is at the last element, return that element",
                "Use Math.max() to compare current with max of the rest"
              ],
              tags: ["recursion", "arrays"],
              difficulty: 4,
              estimatedMinutes: 15,
              points: 250
            },
            {
              slug: "array-sum-recursive",
              type: "FULL_PROGRAM",
              title: "Array Sum (Recursive)",
              prompt: `Write a recursive method that calculates the sum of all elements in an array.

**Examples:**
- sumArray([1, 2, 3, 4, 5]) → 15
- sumArray([10]) → 10
- sumArray([]) → 0

**Requirements:**
- Must use recursion (no loops)`,
              constraints: "Do NOT use loops or streams.",
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
        if (index >= arr.length) {
            return 0;
        }
        return arr[index] + sumHelper(arr, index + 1);
    }

    public static void main(String[] args) {
        System.out.println(sumArray(new int[]{1, 2, 3, 4, 5}));
        System.out.println(sumArray(new int[]{10}));
        System.out.println(sumArray(new int[]{}));
    }
}`,
              tests: [
                { input: "", expectedOutput: "15\n10\n0", isHidden: false }
              ],
              hints: [
                "Base case: when index >= arr.length, return 0",
                "Recursive case: arr[index] + sumHelper(arr, index + 1)"
              ],
              tags: ["recursion", "arrays"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 270
            },
            {
              slug: "fibonacci-memoization",
              type: "FULL_PROGRAM",
              title: "Fibonacci with Memoization",
              prompt: `Improve the basic Fibonacci recursion using memoization.

**Problem:** Basic recursive Fibonacci is very slow for large n.
**Solution:** Use an array to store already-computed values.

**Examples:**
- fibonacci(10) → 55
- fibonacci(40) → 102334155 (fast with memoization!)
- fibonacci(0) → 0

**Requirements:**
- Use memoization with an array
- Return -1 for negative inputs`,
              constraints: "Your solution MUST use memoization.",
              starterCode: `public class Solution {
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
        // Your memoized implementation here

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
        if (memo[n] != -1) {
            return memo[n];
        }
        if (n <= 1) {
            memo[n] = n;
            return n;
        }
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
                { input: "", expectedOutput: "55\n102334155\n0\n-1", isHidden: false }
              ],
              hints: [
                "Check if memo[n] already has a value (!= -1)",
                "Store the result in memo[n] before returning",
                "This changes O(2^n) to O(n) time complexity!"
              ],
              tags: ["recursion", "memoization", "optimization"],
              difficulty: 5,
              estimatedMinutes: 15,
              points: 350
            },
            {
              slug: "binary-search-recursive",
              type: "FULL_PROGRAM",
              title: "Binary Search (Recursive)",
              prompt: `Implement binary search recursively to find a target value in a sorted array.

**Examples:**
- binarySearch([1, 3, 5, 7, 9], 5) → 2 (index of 5)
- binarySearch([1, 3, 5, 7, 9], 1) → 0
- binarySearch([1, 3, 5, 7, 9], 6) → -1 (not found)

**Requirements:**
- Must use recursion
- Return index if found, -1 if not found`,
              constraints: "Do NOT use loops or Arrays.binarySearch().",
              starterCode: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        return binarySearchHelper(arr, target, 0, arr.length - 1);
    }

    private static int binarySearchHelper(int[] arr, int target, int left, int right) {
        // Your recursive implementation here

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
        if (left > right) {
            return -1;
        }
        int mid = left + (right - left) / 2;
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
                { input: "", expectedOutput: "2\n0\n-1", isHidden: false }
              ],
              hints: [
                "Base case: left > right means target is not in the array",
                "Calculate mid as: left + (right - left) / 2",
                "If target < arr[mid], search left half; otherwise search right half"
              ],
              tags: ["recursion", "binary-search", "arrays"],
              difficulty: 5,
              estimatedMinutes: 15,
              points: 380
            },
            {
              slug: "palindrome-recursive",
              type: "FULL_PROGRAM",
              title: "Palindrome Check (Recursive)",
              prompt: `Write a recursive method that checks if a string is a palindrome.

**Rules:**
- Case-insensitive comparison
- Only consider alphanumeric characters

**Examples:**
- isPalindrome("racecar") → true
- isPalindrome("A man a plan a canal Panama") → true
- isPalindrome("hello") → false

**Requirements:**
- Must use recursion for the palindrome check`,
              constraints: "The palindrome checking logic MUST be recursive.",
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
        if (left >= right) {
            return true;
        }
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
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
                { input: "", expectedOutput: "true\ntrue\nfalse\ntrue", isHidden: false }
              ],
              hints: [
                "Preprocess the string first: remove non-alphanumeric, convert to lowercase",
                "Use two pointers: left at 0, right at length-1",
                "Base case: left >= right means we've checked all pairs"
              ],
              tags: ["recursion", "strings", "palindrome"],
              difficulty: 5,
              estimatedMinutes: 20,
              points: 450
            },
            {
              slug: "climb-stairs-memoization",
              type: "FULL_PROGRAM",
              title: "Climb Stairs (Memoization)",
              prompt: `You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps.
In how many distinct ways can you climb to the top?

**Examples:**
- climbStairs(1) → 1 (just take 1 step)
- climbStairs(2) → 2 (1+1 or 2)
- climbStairs(3) → 3 (1+1+1, 1+2, 2+1)
- climbStairs(10) → 89

**Requirements:**
- Use recursion with memoization
- Return 0 for n <= 0`,
              constraints: "Your solution MUST use memoization.",
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
        if (memo[n] != -1) {
            return memo[n];
        }
        if (n == 1) {
            memo[n] = 1;
            return 1;
        }
        if (n == 2) {
            memo[n] = 2;
            return 2;
        }
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
                { input: "", expectedOutput: "1\n2\n3\n89\n0", isHidden: false }
              ],
              hints: [
                "This is essentially Fibonacci! ways(n) = ways(n-1) + ways(n-2)",
                "Base cases: ways(1) = 1, ways(2) = 2",
                "Check memo[n] first - if not -1, return it immediately"
              ],
              tags: ["recursion", "memoization", "dynamic-programming"],
              difficulty: 5,
              estimatedMinutes: 18,
              points: 500
            }
          ]
        }
      ]
    },
    // Week 8 - Recursion Training Ladder (15 Questions, Difficulty 1-15)
    {
      weekNumber: 8,
      title: "Recursion — Complete Training",
      description: "Master recursion step-by-step with 15 progressive challenges. Learn base cases, recursive thinking, arrays, and memoization.",
      topics: [
        {
          slug: "recursion-ladder",
          title: "Recursion Training Ladder",
          description: "15 progressive challenges from beginner to expert. Start at difficulty 1 and climb to 15!",
          questions: [
            // Difficulty 1 — Factorial (Recursive)
            {
              slug: "factorial-recursive",
              type: "FUNCTION",
              title: "Factorial (Recursive)",
              prompt: `Implement a recursive method \`factorial(n)\` that calculates n! (n factorial).

**Definition:**
- n! = n × (n-1) × (n-2) × ... × 1
- 0! = 1 (by definition)
- 1! = 1

**Examples:**
- factorial(0) → 1
- factorial(1) → 1
- factorial(5) → 120 (5 × 4 × 3 × 2 × 1)

**Requirements:**
- You MUST use recursion (no loops allowed)
- Handle n = 0 as a base case`,
              constraints: "Do NOT use loops. Your solution MUST be recursive.",
              starterCode: `public class Solution {
    public static long factorial(int n) {
        // Base case: What is the simplest case where we know the answer?
        // Recursive case: How does factorial(n) relate to factorial(n-1)?

        return 0; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));  // Expected: 1
        System.out.println(factorial(1));  // Expected: 1
        System.out.println(factorial(5));  // Expected: 120
        System.out.println(factorial(10)); // Expected: 3628800
    }
}`,
              solutionCode: `public class Solution {
    public static long factorial(int n) {
        // Base case: 0! = 1 and 1! = 1
        if (n <= 1) {
            return 1;
        }
        // Recursive case: n! = n × (n-1)!
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(0));
        System.out.println(factorial(1));
        System.out.println(factorial(5));
        System.out.println(factorial(10));
    }
}`,
              tests: [
                { input: "", expectedOutput: "1\n1\n120\n3628800", isHidden: false, description: "Basic factorial tests" },
                { input: "", expectedOutput: "1\n1\n120\n3628800", isHidden: true, description: "Verify recursion is used" }
              ],
              hints: [
                "Every recursive function needs a BASE CASE - when does recursion stop?",
                "For factorial, the base case is when n is 0 or 1 (both return 1)",
                "The recursive step: factorial(n) = n × factorial(n-1)",
                "Think: 5! = 5 × 4! = 5 × 4 × 3! = ..."
              ],
              explanation: "The base case (n ≤ 1) stops the recursion. Each call reduces n by 1 until we reach the base case, then multiplies back up.",
              tags: ["recursion", "factorial", "base-case", "beginner"],
              difficulty: 1,
              estimatedMinutes: 8,
              points: 100
            },
            // Difficulty 2 — Power (Recursive)
            {
              slug: "power-recursive-basic",
              type: "FUNCTION",
              title: "Power (Recursive)",
              prompt: `Implement a recursive method \`pow(base, exp)\` that calculates base raised to the power of exp.

**Examples:**
- pow(2, 0) → 1 (anything^0 = 1)
- pow(2, 3) → 8 (2 × 2 × 2)
- pow(5, 2) → 25
- pow(3, 4) → 81

**Requirements:**
- You MUST use recursion (no loops, no Math.pow)
- exp is guaranteed to be non-negative (≥ 0)

**Edge Cases:**
- pow(0, 0) should return 1 (mathematical convention)
- pow(0, 5) should return 0`,
              constraints: "Do NOT use loops or Math.pow(). Your solution MUST be recursive.",
              starterCode: `public class Solution {
    public static long pow(int base, int exp) {
        // Base case: What is any number raised to the power of 0?
        // Recursive case: How does pow(base, exp) relate to pow(base, exp-1)?

        return 0; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(pow(2, 0));  // Expected: 1
        System.out.println(pow(2, 3));  // Expected: 8
        System.out.println(pow(5, 2));  // Expected: 25
        System.out.println(pow(0, 5));  // Expected: 0
    }
}`,
              solutionCode: `public class Solution {
    public static long pow(int base, int exp) {
        // Base case: anything to the power of 0 is 1
        if (exp == 0) {
            return 1;
        }
        // Recursive case: base^exp = base × base^(exp-1)
        return base * pow(base, exp - 1);
    }

    public static void main(String[] args) {
        System.out.println(pow(2, 0));
        System.out.println(pow(2, 3));
        System.out.println(pow(5, 2));
        System.out.println(pow(0, 5));
    }
}`,
              tests: [
                { input: "", expectedOutput: "1\n8\n25\n0", isHidden: false, description: "Basic power tests" },
                { input: "", expectedOutput: "1\n8\n25\n0", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "Base case: What is any number raised to the power of 0?",
                "The recursive formula: pow(base, exp) = base × pow(base, exp - 1)",
                "Example: 2^3 = 2 × 2^2 = 2 × 2 × 2^1 = 2 × 2 × 2 × 2^0 = 2 × 2 × 2 × 1 = 8"
              ],
              explanation: "The exp decreases by 1 each recursive call. When exp reaches 0, we return 1 (base case), then multiply back up.",
              tags: ["recursion", "power", "exponent", "beginner"],
              difficulty: 1,
              estimatedMinutes: 8,
              points: 110
            },
            // Difficulty 3 — Fibonacci (Recursive)
            {
              slug: "fibonacci-basic",
              type: "FUNCTION",
              title: "Fibonacci (Recursive)",
              prompt: `Implement a recursive method \`fib(n)\` that returns the nth Fibonacci number.

**Fibonacci Sequence:** 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

**Definition:**
- F(0) = 0
- F(1) = 1
- F(n) = F(n-1) + F(n-2) for n > 1

**Examples:**
- fib(0) → 0
- fib(1) → 1
- fib(7) → 13

**Requirements:**
- You MUST use recursion (no loops)
- Handle n < 0 by returning -1`,
              constraints: "Do NOT use loops. Your solution MUST be recursive.",
              starterCode: `public class Solution {
    public static int fib(int n) {
        // Handle invalid input
        // Base cases: F(0) = 0, F(1) = 1
        // Recursive case: F(n) = F(n-1) + F(n-2)

        return 0; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(fib(0));   // Expected: 0
        System.out.println(fib(1));   // Expected: 1
        System.out.println(fib(7));   // Expected: 13
        System.out.println(fib(-1));  // Expected: -1
    }
}`,
              solutionCode: `public class Solution {
    public static int fib(int n) {
        if (n < 0) {
            return -1;
        }
        if (n == 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fib(0));
        System.out.println(fib(1));
        System.out.println(fib(7));
        System.out.println(fib(-1));
    }
}`,
              tests: [
                { input: "", expectedOutput: "0\n1\n13\n-1", isHidden: false, description: "Basic Fibonacci tests" },
                { input: "", expectedOutput: "0\n1\n13\n-1", isHidden: true, description: "Edge case handling" }
              ],
              hints: [
                "Fibonacci has TWO base cases: F(0) = 0 and F(1) = 1",
                "The recursive formula adds two previous values: F(n) = F(n-1) + F(n-2)",
                "Don't forget to handle negative input first!"
              ],
              explanation: "This is a classic example of 'tree recursion' where each call branches into two calls. Note: This naive approach is slow for large n - we'll optimize with memoization later!",
              tags: ["recursion", "fibonacci", "tree-recursion"],
              difficulty: 2,
              estimatedMinutes: 10,
              points: 130
            },
            // Difficulty 4 — Sum 1..n (Recursive)
            {
              slug: "sum-to-n",
              type: "FUNCTION",
              title: "Sum 1 to n (Recursive)",
              prompt: `Implement a recursive method \`sumTo(n)\` that returns the sum 1 + 2 + 3 + ... + n.

**Examples:**
- sumTo(1) → 1
- sumTo(5) → 15 (1+2+3+4+5)
- sumTo(10) → 55

**Requirements:**
- You MUST use recursion (no loops)
- Handle n ≤ 0 by returning 0`,
              constraints: "Do NOT use loops or the formula n*(n+1)/2. Your solution MUST be recursive.",
              starterCode: `public class Solution {
    public static int sumTo(int n) {
        // Base case: when should recursion stop?
        // Recursive case: sumTo(n) = n + sumTo(n-1)

        return 0; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(sumTo(1));   // Expected: 1
        System.out.println(sumTo(5));   // Expected: 15
        System.out.println(sumTo(10));  // Expected: 55
        System.out.println(sumTo(0));   // Expected: 0
    }
}`,
              solutionCode: `public class Solution {
    public static int sumTo(int n) {
        if (n <= 0) {
            return 0;
        }
        return n + sumTo(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(sumTo(1));
        System.out.println(sumTo(5));
        System.out.println(sumTo(10));
        System.out.println(sumTo(0));
    }
}`,
              tests: [
                { input: "", expectedOutput: "1\n15\n55\n0", isHidden: false, description: "Basic sum tests" },
                { input: "", expectedOutput: "1\n15\n55\n0", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "Think: sumTo(5) = 5 + sumTo(4) = 5 + 4 + sumTo(3) = ...",
                "Base case: when n ≤ 0, return 0",
                "What decreases each call? n decreases by 1"
              ],
              explanation: "Each recursive call adds n to the sum of all numbers from 1 to n-1. The recursion stops when n reaches 0.",
              tags: ["recursion", "sum", "arithmetic"],
              difficulty: 2,
              estimatedMinutes: 8,
              points: 140
            },
            // Difficulty 5 — Count Digits (Recursive)
            {
              slug: "count-digits",
              type: "FUNCTION",
              title: "Count Digits (Recursive)",
              prompt: `Implement a recursive method \`countDigits(n)\` that returns the number of digits in n.

**Examples:**
- countDigits(0) → 1 (0 has 1 digit)
- countDigits(7) → 1
- countDigits(12345) → 5
- countDigits(-42) → 2 (treat negative as positive)

**Requirements:**
- You MUST use recursion (no loops, no String conversion)
- Treat negative numbers as their absolute value`,
              constraints: "Do NOT use loops, String.valueOf(), or Integer.toString(). Use pure arithmetic recursion.",
              starterCode: `public class Solution {
    public static int countDigits(int n) {
        // Handle negative: treat as positive
        // Base case: single digit numbers (n < 10)
        // Recursive case: remove last digit and count

        return 0; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(countDigits(0));      // Expected: 1
        System.out.println(countDigits(7));      // Expected: 1
        System.out.println(countDigits(12345));  // Expected: 5
        System.out.println(countDigits(-42));    // Expected: 2
    }
}`,
              solutionCode: `public class Solution {
    public static int countDigits(int n) {
        // Handle negative numbers
        if (n < 0) {
            n = -n;
        }
        // Base case: single digit
        if (n < 10) {
            return 1;
        }
        // Recursive case: remove last digit and count the rest
        return 1 + countDigits(n / 10);
    }

    public static void main(String[] args) {
        System.out.println(countDigits(0));
        System.out.println(countDigits(7));
        System.out.println(countDigits(12345));
        System.out.println(countDigits(-42));
    }
}`,
              tests: [
                { input: "", expectedOutput: "1\n1\n5\n2", isHidden: false, description: "Basic digit counting" },
                { input: "", expectedOutput: "1\n1\n5\n2", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "n / 10 removes the last digit (integer division)",
                "Example: 12345 / 10 = 1234, so countDigits(12345) = 1 + countDigits(1234)",
                "Base case: when n < 10, it's a single digit, return 1",
                "Handle negatives first by converting to positive"
              ],
              explanation: "Each recursive call removes one digit (via n/10) and counts it. When only one digit remains (n < 10), we return 1.",
              tags: ["recursion", "digits", "arithmetic"],
              difficulty: 2,
              estimatedMinutes: 10,
              points: 150
            },
            // Difficulty 6 — String Equals (Recursive)
            {
              slug: "string-equals-rec",
              type: "FUNCTION",
              title: "String Equals (Recursive)",
              prompt: `Implement a recursive method \`stringEquals(a, b)\` that compares two strings character by character.

**Rules:**
- You CANNOT use .equals() or .compareTo()
- You CAN use .length(), .charAt(), .substring()

**Examples:**
- stringEquals("abc", "abc") → true
- stringEquals("abc", "abd") → false
- stringEquals("", "") → true
- stringEquals("ab", "abc") → false (different lengths)

**Requirements:**
- You MUST use recursion (no loops)`,
              constraints: "Do NOT use .equals(), .compareTo(), or loops.",
              starterCode: `public class Solution {
    public static boolean stringEquals(String a, String b) {
        // First check: different lengths?
        // Base case: both strings empty
        // Compare first characters, then recurse on rest

        return false; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(stringEquals("abc", "abc"));  // Expected: true
        System.out.println(stringEquals("abc", "abd"));  // Expected: false
        System.out.println(stringEquals("", ""));        // Expected: true
        System.out.println(stringEquals("ab", "abc"));   // Expected: false
    }
}`,
              solutionCode: `public class Solution {
    public static boolean stringEquals(String a, String b) {
        // Quick check: different lengths means not equal
        if (a.length() != b.length()) {
            return false;
        }
        // Base case: both empty strings
        if (a.length() == 0) {
            return true;
        }
        // Compare first character
        if (a.charAt(0) != b.charAt(0)) {
            return false;
        }
        // Recurse on the rest
        return stringEquals(a.substring(1), b.substring(1));
    }

    public static void main(String[] args) {
        System.out.println(stringEquals("abc", "abc"));
        System.out.println(stringEquals("abc", "abd"));
        System.out.println(stringEquals("", ""));
        System.out.println(stringEquals("ab", "abc"));
    }
}`,
              tests: [
                { input: "", expectedOutput: "true\nfalse\ntrue\nfalse", isHidden: false, description: "Basic string comparison" },
                { input: "", expectedOutput: "true\nfalse\ntrue\nfalse", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "First optimization: if lengths differ, strings can't be equal",
                "Base case: if both strings are empty, they're equal",
                "Compare charAt(0) of both strings",
                "If first chars match, recursively compare substring(1) of both"
              ],
              explanation: "We compare strings character by character. Each recursive call checks one character and moves to the next using substring(1).",
              tags: ["recursion", "strings", "comparison"],
              difficulty: 3,
              estimatedMinutes: 12,
              points: 170
            },
            // Difficulty 7 — Reverse String (Recursive)
            {
              slug: "reverse-string-rec",
              type: "FUNCTION",
              title: "Reverse String (Recursive)",
              prompt: `Implement a recursive method \`reverseString(s)\` that reverses a string.

**Examples:**
- reverseString("hello") → "olleh"
- reverseString("a") → "a"
- reverseString("") → ""
- reverseString("ab") → "ba"

**Requirements:**
- You MUST use recursion (no loops)
- You CANNOT use StringBuilder.reverse()`,
              constraints: "Do NOT use loops or StringBuilder.reverse().",
              starterCode: `public class Solution {
    public static String reverseString(String s) {
        // Base case: empty or single character
        // Key insight: reverse("hello") = reverse("ello") + "h"

        return ""; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));  // Expected: olleh
        System.out.println(reverseString("a"));      // Expected: a
        System.out.println(reverseString(""));       // Expected: (empty)
        System.out.println(reverseString("ab"));     // Expected: ba
    }
}`,
              solutionCode: `public class Solution {
    public static String reverseString(String s) {
        // Base case: empty or single character string
        if (s.length() <= 1) {
            return s;
        }
        // Recursive case: reverse the rest, then append first char
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
                { input: "", expectedOutput: "olleh\na\n\nba", isHidden: false, description: "Basic reverse tests" },
                { input: "", expectedOutput: "olleh\na\n\nba", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "Base case: empty string or single char returns as-is",
                "Key insight: reverse('hello') = reverse('ello') + 'h'",
                "Take the first character, put it at the END of the reversed rest"
              ],
              explanation: "We take the first character and move it to the end, recursively reversing the rest. 'hello' → reverse('ello') + 'h' → 'olle' + 'h' → 'olleh'",
              tags: ["recursion", "strings", "reverse"],
              difficulty: 3,
              estimatedMinutes: 10,
              points: 180
            },
            // Difficulty 8 — Count Character (Recursive)
            {
              slug: "count-char-rec",
              type: "FUNCTION",
              title: "Count Character (Recursive)",
              prompt: `Implement a recursive method \`countChar(s, c)\` that counts how many times character c appears in string s.

**Examples:**
- countChar("banana", 'a') → 3
- countChar("banana", 'n') → 2
- countChar("hello", 'z') → 0
- countChar("", 'a') → 0

**Requirements:**
- You MUST use recursion (no loops)`,
              constraints: "Do NOT use loops or String.chars().",
              starterCode: `public class Solution {
    public static int countChar(String s, char c) {
        // Base case: empty string
        // Check first char, add 1 if match, then recurse on rest

        return 0; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(countChar("banana", 'a'));  // Expected: 3
        System.out.println(countChar("banana", 'n'));  // Expected: 2
        System.out.println(countChar("hello", 'z'));   // Expected: 0
        System.out.println(countChar("", 'a'));        // Expected: 0
    }
}`,
              solutionCode: `public class Solution {
    public static int countChar(String s, char c) {
        // Base case: empty string has 0 occurrences
        if (s.length() == 0) {
            return 0;
        }
        // Check first character
        int count = (s.charAt(0) == c) ? 1 : 0;
        // Add count from rest of string
        return count + countChar(s.substring(1), c);
    }

    public static void main(String[] args) {
        System.out.println(countChar("banana", 'a'));
        System.out.println(countChar("banana", 'n'));
        System.out.println(countChar("hello", 'z'));
        System.out.println(countChar("", 'a'));
    }
}`,
              tests: [
                { input: "", expectedOutput: "3\n2\n0\n0", isHidden: false, description: "Basic character counting" },
                { input: "", expectedOutput: "3\n2\n0\n0", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "Base case: empty string → return 0",
                "Check if s.charAt(0) equals c, if so count it as 1",
                "Add the count from the rest: countChar(s.substring(1), c)"
              ],
              explanation: "We check one character at a time. If it matches, we add 1 to the count of matches in the rest of the string.",
              tags: ["recursion", "strings", "counting"],
              difficulty: 3,
              estimatedMinutes: 10,
              points: 190
            },
            // Difficulty 9 — Palindrome Check (Recursive)
            {
              slug: "palindrome-check",
              type: "FUNCTION",
              title: "Palindrome Check (Recursive)",
              prompt: `Implement a recursive method \`isPalindrome(s)\` that checks if a string is a palindrome.

**A palindrome reads the same forwards and backwards.**

**Examples:**
- isPalindrome("racecar") → true
- isPalindrome("abba") → true
- isPalindrome("abc") → false
- isPalindrome("") → true
- isPalindrome("a") → true

**Requirements:**
- You MUST use recursion (no loops)
- Case-sensitive comparison (no ignoring case)
- Do NOT ignore spaces or special characters`,
              constraints: "Do NOT use loops or StringBuilder.reverse(). Comparison is case-sensitive.",
              starterCode: `public class Solution {
    public static boolean isPalindrome(String s) {
        // Base case: empty or single char
        // Compare first and last characters
        // Recurse on the middle part

        return false; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));  // Expected: true
        System.out.println(isPalindrome("abba"));     // Expected: true
        System.out.println(isPalindrome("abc"));      // Expected: false
        System.out.println(isPalindrome(""));         // Expected: true
        System.out.println(isPalindrome("a"));        // Expected: true
    }
}`,
              solutionCode: `public class Solution {
    public static boolean isPalindrome(String s) {
        // Base case: empty or single character
        if (s.length() <= 1) {
            return true;
        }
        // Compare first and last characters
        if (s.charAt(0) != s.charAt(s.length() - 1)) {
            return false;
        }
        // Recurse on the middle part (excluding first and last)
        return isPalindrome(s.substring(1, s.length() - 1));
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("abba"));
        System.out.println(isPalindrome("abc"));
        System.out.println(isPalindrome(""));
        System.out.println(isPalindrome("a"));
    }
}`,
              tests: [
                { input: "", expectedOutput: "true\ntrue\nfalse\ntrue\ntrue", isHidden: false, description: "Basic palindrome tests" },
                { input: "", expectedOutput: "true\ntrue\nfalse\ntrue\ntrue", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "Base case: strings of length 0 or 1 are palindromes",
                "Compare first character s.charAt(0) with last s.charAt(s.length()-1)",
                "If they match, check if the MIDDLE part is a palindrome",
                "Use s.substring(1, s.length() - 1) to get the middle"
              ],
              explanation: "We compare outer characters moving inward. If all pairs match, it's a palindrome. The recursion shrinks the string from both ends.",
              tags: ["recursion", "strings", "palindrome"],
              difficulty: 3,
              estimatedMinutes: 12,
              points: 200
            },
            // Difficulty 10 — Find Maximum in Array (Recursive)
            {
              slug: "max-array-recursive",
              type: "FUNCTION",
              title: "Find Maximum in Array (Recursive)",
              prompt: `Implement a recursive method \`maxRecursive(arr)\` that finds the maximum value in an integer array.

**Examples:**
- maxRecursive([1, 5, 2]) → 5
- maxRecursive([7]) → 7
- maxRecursive([-5, -2, -10]) → -2
- maxRecursive([3, 3, 3]) → 3

**Requirements:**
- You MUST use recursion (no loops, no Arrays.stream)
- For empty array, return Integer.MIN_VALUE`,
              constraints: "Do NOT use loops or Arrays.stream(). Use a helper method with an index parameter.",
              starterCode: `public class Solution {
    public static int maxRecursive(int[] arr) {
        if (arr.length == 0) {
            return Integer.MIN_VALUE;
        }
        return maxHelper(arr, 0);
    }

    private static int maxHelper(int[] arr, int index) {
        // Base case: at the last element
        // Compare current element with max of the rest

        return 0; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(maxRecursive(new int[]{1, 5, 2}));       // Expected: 5
        System.out.println(maxRecursive(new int[]{7}));             // Expected: 7
        System.out.println(maxRecursive(new int[]{-5, -2, -10}));   // Expected: -2
        System.out.println(maxRecursive(new int[]{}));              // Expected: -2147483648
    }
}`,
              solutionCode: `public class Solution {
    public static int maxRecursive(int[] arr) {
        if (arr.length == 0) {
            return Integer.MIN_VALUE;
        }
        return maxHelper(arr, 0);
    }

    private static int maxHelper(int[] arr, int index) {
        // Base case: at the last element
        if (index == arr.length - 1) {
            return arr[index];
        }
        // Get max of the rest
        int maxOfRest = maxHelper(arr, index + 1);
        // Return the larger of current element and max of rest
        return Math.max(arr[index], maxOfRest);
    }

    public static void main(String[] args) {
        System.out.println(maxRecursive(new int[]{1, 5, 2}));
        System.out.println(maxRecursive(new int[]{7}));
        System.out.println(maxRecursive(new int[]{-5, -2, -10}));
        System.out.println(maxRecursive(new int[]{}));
    }
}`,
              tests: [
                { input: "", expectedOutput: "5\n7\n-2\n-2147483648", isHidden: false, description: "Basic max finding" },
                { input: "", expectedOutput: "5\n7\n-2\n-2147483648", isHidden: true, description: "Edge cases with negatives" }
              ],
              hints: [
                "Use a helper method that takes an index parameter",
                "Base case: when index is at the last element, return that element",
                "Compare arr[index] with the max of the rest (recursive call with index + 1)",
                "Use Math.max() for the comparison"
              ],
              explanation: "The helper function walks through the array recursively. At each step, it compares the current element with the maximum of all remaining elements.",
              tags: ["recursion", "arrays", "maximum"],
              difficulty: 4,
              estimatedMinutes: 15,
              points: 220
            },
            // Difficulty 11 — Sum Array (Recursive)
            {
              slug: "sum-array-recursive",
              type: "FUNCTION",
              title: "Sum Array (Recursive)",
              prompt: `Implement a recursive method \`sumArray(arr)\` that calculates the sum of all elements in an array.

**Examples:**
- sumArray([1, 2, 3, 4, 5]) → 15
- sumArray([10]) → 10
- sumArray([]) → 0
- sumArray([-1, -2, 3]) → 0

**Requirements:**
- You MUST use recursion (no loops, no streams)`,
              constraints: "Do NOT use loops or Arrays.stream().",
              starterCode: `public class Solution {
    public static int sumArray(int[] arr) {
        return sumHelper(arr, 0);
    }

    private static int sumHelper(int[] arr, int index) {
        // Base case: past the last element
        // Add current element to sum of rest

        return 0; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        System.out.println(sumArray(new int[]{1, 2, 3, 4, 5}));   // Expected: 15
        System.out.println(sumArray(new int[]{10}));              // Expected: 10
        System.out.println(sumArray(new int[]{}));                // Expected: 0
        System.out.println(sumArray(new int[]{-1, -2, 3}));       // Expected: 0
    }
}`,
              solutionCode: `public class Solution {
    public static int sumArray(int[] arr) {
        return sumHelper(arr, 0);
    }

    private static int sumHelper(int[] arr, int index) {
        // Base case: past the last element
        if (index >= arr.length) {
            return 0;
        }
        // Add current element to sum of rest
        return arr[index] + sumHelper(arr, index + 1);
    }

    public static void main(String[] args) {
        System.out.println(sumArray(new int[]{1, 2, 3, 4, 5}));
        System.out.println(sumArray(new int[]{10}));
        System.out.println(sumArray(new int[]{}));
        System.out.println(sumArray(new int[]{-1, -2, 3}));
    }
}`,
              tests: [
                { input: "", expectedOutput: "15\n10\n0\n0", isHidden: false, description: "Basic sum tests" },
                { input: "", expectedOutput: "15\n10\n0\n0", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "Base case: when index >= arr.length, return 0",
                "Recursive case: arr[index] + sumHelper(arr, index + 1)",
                "Each call adds one element and recurses to the rest"
              ],
              explanation: "Starting from index 0, we add each element to the sum of all remaining elements. The recursion unwinds to calculate the total.",
              tags: ["recursion", "arrays", "sum"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 230
            },
            // Difficulty 12 — Merge Two Sorted Arrays (Recursive)
            {
              slug: "merge-sorted-recursive",
              type: "FUNCTION",
              title: "Merge Two Sorted Arrays (Recursive)",
              prompt: `Implement a recursive method \`mergeSorted(a, b)\` that merges two sorted integer arrays into one sorted array.

**Examples:**
- mergeSorted([1, 3, 5], [2, 4]) → [1, 2, 3, 4, 5]
- mergeSorted([1, 2], [3, 4]) → [1, 2, 3, 4]
- mergeSorted([], [1, 2]) → [1, 2]
- mergeSorted([1], []) → [1]

**Requirements:**
- You MUST use recursion for the merge logic
- Both input arrays are guaranteed to be sorted in ascending order`,
              constraints: "The core merge logic MUST be recursive.",
              starterCode: `public class Solution {
    public static int[] mergeSorted(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        mergeHelper(a, 0, b, 0, result, 0);
        return result;
    }

    private static void mergeHelper(int[] a, int ai, int[] b, int bi, int[] result, int ri) {
        // Base case: both arrays exhausted
        // If one array exhausted, copy from other
        // Otherwise, compare and take smaller

        // TODO: Implement recursive merge logic
    }

    public static void main(String[] args) {
        printArray(mergeSorted(new int[]{1, 3, 5}, new int[]{2, 4}));    // [1,2,3,4,5]
        printArray(mergeSorted(new int[]{1, 2}, new int[]{3, 4}));       // [1,2,3,4]
        printArray(mergeSorted(new int[]{}, new int[]{1, 2}));           // [1,2]
        printArray(mergeSorted(new int[]{1}, new int[]{}));              // [1]
    }

    private static void printArray(int[] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append(arr[i]);
            if (i < arr.length - 1) sb.append(",");
        }
        sb.append("]");
        System.out.println(sb.toString());
    }
}`,
              solutionCode: `public class Solution {
    public static int[] mergeSorted(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        mergeHelper(a, 0, b, 0, result, 0);
        return result;
    }

    private static void mergeHelper(int[] a, int ai, int[] b, int bi, int[] result, int ri) {
        // Base case: both arrays exhausted
        if (ai >= a.length && bi >= b.length) {
            return;
        }
        // If a exhausted, take from b
        if (ai >= a.length) {
            result[ri] = b[bi];
            mergeHelper(a, ai, b, bi + 1, result, ri + 1);
            return;
        }
        // If b exhausted, take from a
        if (bi >= b.length) {
            result[ri] = a[ai];
            mergeHelper(a, ai + 1, b, bi, result, ri + 1);
            return;
        }
        // Compare and take smaller
        if (a[ai] <= b[bi]) {
            result[ri] = a[ai];
            mergeHelper(a, ai + 1, b, bi, result, ri + 1);
        } else {
            result[ri] = b[bi];
            mergeHelper(a, ai, b, bi + 1, result, ri + 1);
        }
    }

    public static void main(String[] args) {
        printArray(mergeSorted(new int[]{1, 3, 5}, new int[]{2, 4}));
        printArray(mergeSorted(new int[]{1, 2}, new int[]{3, 4}));
        printArray(mergeSorted(new int[]{}, new int[]{1, 2}));
        printArray(mergeSorted(new int[]{1}, new int[]{}));
    }

    private static void printArray(int[] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append(arr[i]);
            if (i < arr.length - 1) sb.append(",");
        }
        sb.append("]");
        System.out.println(sb.toString());
    }
}`,
              tests: [
                { input: "", expectedOutput: "[1,2,3,4,5]\n[1,2,3,4]\n[1,2]\n[1]", isHidden: false, description: "Basic merge tests" },
                { input: "", expectedOutput: "[1,2,3,4,5]\n[1,2,3,4]\n[1,2]\n[1]", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "Use index parameters to track position in each array",
                "Base case: both indices past their array length",
                "If one array is exhausted, copy remaining from the other",
                "Otherwise, compare current elements and take the smaller one"
              ],
              explanation: "This is the merge step of merge sort. We recursively compare elements from both arrays and build the result in sorted order.",
              tags: ["recursion", "arrays", "merge", "sorting"],
              difficulty: 4,
              estimatedMinutes: 20,
              points: 280
            },
            // Difficulty 13 — Binary Search (Recursive)
            {
              slug: "binary-search-recursive",
              type: "FUNCTION",
              title: "Binary Search (Recursive)",
              prompt: `Implement a recursive binary search that finds the index of a target value in a sorted array.

**Examples:**
- binarySearch([1, 3, 5, 7, 9], 5) → 2 (5 is at index 2)
- binarySearch([1, 3, 5, 7, 9], 1) → 0
- binarySearch([1, 3, 5, 7, 9], 9) → 4
- binarySearch([1, 3, 5, 7, 9], 6) → -1 (not found)
- binarySearch([], 5) → -1

**Requirements:**
- You MUST use recursion
- Return the index if found, -1 if not found
- Array is guaranteed to be sorted in ascending order`,
              constraints: "Do NOT use loops or Arrays.binarySearch().",
              starterCode: `public class Solution {
    public static int binarySearch(int[] arr, int target) {
        return binarySearchHelper(arr, target, 0, arr.length - 1);
    }

    private static int binarySearchHelper(int[] arr, int target, int left, int right) {
        // Base case: left > right means not found
        // Calculate mid
        // If found at mid, return mid
        // If target < mid, search left half
        // If target > mid, search right half

        return -1; // TODO: Replace with your recursive implementation
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9};
        System.out.println(binarySearch(arr, 5));  // Expected: 2
        System.out.println(binarySearch(arr, 1));  // Expected: 0
        System.out.println(binarySearch(arr, 9));  // Expected: 4
        System.out.println(binarySearch(arr, 6));  // Expected: -1
        System.out.println(binarySearch(new int[]{}, 5));  // Expected: -1
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
        // Calculate middle index (avoid integer overflow)
        int mid = left + (right - left) / 2;
        // Found it!
        if (arr[mid] == target) {
            return mid;
        }
        // Target is smaller, search left half
        if (target < arr[mid]) {
            return binarySearchHelper(arr, target, left, mid - 1);
        }
        // Target is larger, search right half
        return binarySearchHelper(arr, target, mid + 1, right);
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9};
        System.out.println(binarySearch(arr, 5));
        System.out.println(binarySearch(arr, 1));
        System.out.println(binarySearch(arr, 9));
        System.out.println(binarySearch(arr, 6));
        System.out.println(binarySearch(new int[]{}, 5));
    }
}`,
              tests: [
                { input: "", expectedOutput: "2\n0\n4\n-1\n-1", isHidden: false, description: "Basic binary search" },
                { input: "", expectedOutput: "2\n0\n4\n-1\n-1", isHidden: true, description: "Edge cases" }
              ],
              hints: [
                "Base case: left > right means the target is not in the array",
                "Calculate mid: left + (right - left) / 2 (avoids overflow)",
                "If arr[mid] == target, you found it!",
                "If target < arr[mid], search left half (right = mid - 1)",
                "If target > arr[mid], search right half (left = mid + 1)"
              ],
              explanation: "Binary search halves the search space each recursive call, giving O(log n) time complexity. Much faster than linear search for large arrays!",
              tags: ["recursion", "binary-search", "arrays", "divide-and-conquer"],
              difficulty: 4,
              estimatedMinutes: 18,
              points: 300
            },
            // Difficulty 14 — Fibonacci with Memoization
            {
              slug: "fib-memoization",
              type: "FUNCTION",
              title: "Fibonacci with Memoization",
              prompt: `The basic recursive Fibonacci is very slow for large n because it recalculates the same values many times.

**Your task:** Implement Fibonacci with MEMOIZATION - storing computed values to avoid recalculation.

**Why it matters:**
- fib(40) without memoization: ~1 billion calls, takes seconds
- fib(40) with memoization: only 40 calls, instant!

**Examples:**
- fibMemo(10) → 55
- fibMemo(40) → 102334155 (fast with memoization!)
- fibMemo(50) → 12586269025
- fibMemo(0) → 0
- fibMemo(-1) → -1

**Requirements:**
- Use an array or HashMap to store computed values
- Must be fast enough to handle fibMemo(50)`,
              constraints: "Your solution MUST use memoization. Hidden tests will timeout without it.",
              starterCode: `public class Solution {
    public static long fibMemo(int n) {
        if (n < 0) return -1;
        if (n == 0) return 0;
        // Create memo array initialized to -1
        long[] memo = new long[n + 1];
        for (int i = 0; i <= n; i++) {
            memo[i] = -1;
        }
        return fibHelper(n, memo);
    }

    private static long fibHelper(int n, long[] memo) {
        // Check if already computed
        // Base cases
        // Compute, store, and return

        return 0; // TODO: Replace with your memoized implementation
    }

    public static void main(String[] args) {
        System.out.println(fibMemo(10));   // Expected: 55
        System.out.println(fibMemo(40));   // Expected: 102334155
        System.out.println(fibMemo(0));    // Expected: 0
        System.out.println(fibMemo(-1));   // Expected: -1
    }
}`,
              solutionCode: `public class Solution {
    public static long fibMemo(int n) {
        if (n < 0) return -1;
        if (n == 0) return 0;
        long[] memo = new long[n + 1];
        for (int i = 0; i <= n; i++) {
            memo[i] = -1;
        }
        return fibHelper(n, memo);
    }

    private static long fibHelper(int n, long[] memo) {
        // Already computed? Return cached value
        if (memo[n] != -1) {
            return memo[n];
        }
        // Base case
        if (n <= 1) {
            memo[n] = n;
            return n;
        }
        // Compute, store in memo, then return
        memo[n] = fibHelper(n - 1, memo) + fibHelper(n - 2, memo);
        return memo[n];
    }

    public static void main(String[] args) {
        System.out.println(fibMemo(10));
        System.out.println(fibMemo(40));
        System.out.println(fibMemo(0));
        System.out.println(fibMemo(-1));
    }
}`,
              tests: [
                { input: "", expectedOutput: "55\n102334155\n0\n-1", isHidden: false, description: "Basic memoization tests" },
                { input: "", expectedOutput: "55\n102334155\n0\n-1", isHidden: true, description: "Performance test - must complete fast" }
              ],
              hints: [
                "First, check if memo[n] already has a value (not -1)",
                "If cached, return memo[n] immediately - no more recursion!",
                "Store the result in memo[n] BEFORE returning",
                "This changes O(2^n) to O(n) time complexity"
              ],
              explanation: "Memoization trades space for time. By storing computed values, we avoid redundant calculations. fib(40) goes from billions of calls to just 40!",
              tags: ["recursion", "memoization", "optimization", "dynamic-programming"],
              difficulty: 5,
              estimatedMinutes: 15,
              points: 350
            },
            // Difficulty 15 — Climb Stairs (Memoization)
            {
              slug: "climb-stairs-memo",
              type: "FUNCTION",
              title: "Climb Stairs (Memoization)",
              prompt: `You are climbing a staircase with n steps. Each time you can climb either 1 step or 2 steps.

**Question:** In how many distinct ways can you climb to the top?

**Examples:**
- climbStairs(1) → 1 (just 1 step)
- climbStairs(2) → 2 (1+1 or 2)
- climbStairs(3) → 3 (1+1+1, 1+2, 2+1)
- climbStairs(5) → 8
- climbStairs(10) → 89
- climbStairs(0) → 0
- climbStairs(45) → 1836311903 (needs memoization to be fast!)

**Requirements:**
- Use recursion with memoization
- Return 0 for n ≤ 0`,
              constraints: "Your solution MUST use memoization. Hidden tests with large n will timeout without it.",
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
        // Already computed?
        // Base cases: ways(1) = 1, ways(2) = 2
        // Recursive case: ways(n) = ways(n-1) + ways(n-2)

        return 0; // TODO: Replace with your memoized implementation
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(1));   // Expected: 1
        System.out.println(climbStairs(2));   // Expected: 2
        System.out.println(climbStairs(3));   // Expected: 3
        System.out.println(climbStairs(5));   // Expected: 8
        System.out.println(climbStairs(10));  // Expected: 89
        System.out.println(climbStairs(0));   // Expected: 0
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
        // Already computed?
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
        // Recursive case: can take 1 step or 2 steps
        memo[n] = climbHelper(n - 1, memo) + climbHelper(n - 2, memo);
        return memo[n];
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(1));
        System.out.println(climbStairs(2));
        System.out.println(climbStairs(3));
        System.out.println(climbStairs(5));
        System.out.println(climbStairs(10));
        System.out.println(climbStairs(0));
    }
}`,
              tests: [
                { input: "", expectedOutput: "1\n2\n3\n8\n89\n0", isHidden: false, description: "Basic climb stairs tests" },
                { input: "", expectedOutput: "1\n2\n3\n8\n89\n0", isHidden: true, description: "Performance test with large n" }
              ],
              hints: [
                "This is essentially Fibonacci! ways(n) = ways(n-1) + ways(n-2)",
                "Think: to reach step n, you either came from step n-1 (took 1 step) or n-2 (took 2 steps)",
                "Base cases: ways(1) = 1, ways(2) = 2",
                "Don't forget to check memo[n] first!"
              ],
              explanation: "This classic DP problem has the same structure as Fibonacci. The number of ways to reach step n is the sum of ways to reach n-1 and n-2. Memoization makes it efficient.",
              tags: ["recursion", "memoization", "dynamic-programming", "climbing-stairs"],
              difficulty: 5,
              estimatedMinutes: 18,
              points: 400
            }
          ]
        }
      ]
    }
  ]
}