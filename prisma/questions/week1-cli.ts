// Week 1: CLI, Compilation, Git Basics, Error Types - 40 questions

export const week1Questions = [
  // ===== Topic 1: Command Line Basics (15 questions) =====
  {
    title: "Print Hello World",
    slug: "print-hello-world",
    type: "CODE",
    prompt: "Write a Java program that prints \"Hello, World!\" to the console.",
    constraints: "Your output must match exactly, including punctuation.",
    difficulty: 1,
    estimatedMinutes: 3,
    points: 10,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print "Hello, World!" to the console

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello, World!", isHidden: false },
    ],
    hints: [
      "Use System.out.println() to print text",
      "The text should be enclosed in double quotes",
      "Don't forget the semicolon at the end",
      "The output should include the comma and exclamation mark"
    ],
    tags: ["print", "hello-world", "basics"],
  },
  {
    title: "Print Your Name",
    slug: "print-your-name",
    type: "CODE",
    prompt: "Write a program that prints \"My name is Java\" on one line.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 2,
    points: 10,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print your name

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("My name is Java");
    }
}`,
    tests: [
      { input: "", expectedOutput: "My name is Java", isHidden: false },
    ],
    hints: [
      "Use System.out.println()",
      "Put the text in double quotes",
      "Check spelling and spacing carefully"
    ],
    tags: ["print", "basics"],
  },
  {
    title: "Multiple Print Statements",
    slug: "multiple-print-statements",
    type: "CODE",
    prompt: "Write a program that prints three lines:\n- Line 1: \"First\"\n- Line 2: \"Second\"\n- Line 3: \"Third\"",
    constraints: "Each word should be on its own line.",
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print three lines

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("First");
        System.out.println("Second");
        System.out.println("Third");
    }
}`,
    tests: [
      { input: "", expectedOutput: "First\nSecond\nThird", isHidden: false },
    ],
    hints: [
      "Use three separate println statements",
      "println automatically adds a newline after printing",
      "Each statement needs its own semicolon"
    ],
    tags: ["print", "multiple-lines", "basics"],
  },
  {
    title: "Print vs Println",
    slug: "print-vs-println",
    type: "CODE",
    prompt: "Use System.out.print() (without ln) twice to print \"HelloWorld\" on a single line (no space between).",
    constraints: "Do not use println for this exercise.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Use print() not println()

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.print("Hello");
        System.out.print("World");
    }
}`,
    tests: [
      { input: "", expectedOutput: "HelloWorld", isHidden: false },
    ],
    hints: [
      "System.out.print() does not add a newline",
      "The text will continue on the same line",
      "You need two print statements"
    ],
    tags: ["print", "output"],
  },
  {
    title: "Print Numbers",
    slug: "print-numbers",
    type: "CODE",
    prompt: "Print the numbers 1, 2, 3 on separate lines.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 2,
    points: 10,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print 1, 2, 3 on separate lines

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println(1);
        System.out.println(2);
        System.out.println(3);
    }
}`,
    tests: [
      { input: "", expectedOutput: "1\n2\n3", isHidden: false },
    ],
    hints: [
      "Numbers don't need quotes",
      "Use println for each number",
      "Just the digit, no text"
    ],
    tags: ["print", "numbers"],
  },
  {
    title: "Print a Rectangle",
    slug: "print-rectangle",
    type: "CODE",
    prompt: "Print a 3x5 rectangle made of asterisks (*).",
    constraints: "3 rows, 5 columns of asterisks.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print a 3x5 rectangle of asterisks

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("*****");
        System.out.println("*****");
        System.out.println("*****");
    }
}`,
    tests: [
      { input: "", expectedOutput: "*****\n*****\n*****", isHidden: false },
    ],
    hints: [
      "Print 5 asterisks on each line",
      "You need 3 println statements",
      "Each line should have exactly 5 * characters"
    ],
    tags: ["print", "patterns"],
  },
  {
    title: "Print Triangle",
    slug: "print-triangle",
    type: "CODE",
    prompt: "Print a right triangle pattern:\n*\n**\n***",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print a triangle pattern

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("*");
        System.out.println("**");
        System.out.println("***");
    }
}`,
    tests: [
      { input: "", expectedOutput: "*\n**\n***", isHidden: false },
    ],
    hints: [
      "First line: 1 asterisk",
      "Second line: 2 asterisks",
      "Third line: 3 asterisks"
    ],
    tags: ["print", "patterns"],
  },
  {
    title: "Print Special Characters",
    slug: "print-special-chars",
    type: "CODE",
    prompt: "Print the following exactly: It's a \"test\"",
    constraints: "Include the apostrophe and double quotes.",
    difficulty: 2,
    estimatedMinutes: 5,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print: It's a "test"

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("It's a \\"test\\"");
    }
}`,
    tests: [
      { input: "", expectedOutput: "It's a \"test\"", isHidden: false },
    ],
    hints: [
      "Double quotes inside a string need to be escaped",
      "Use backslash before double quotes: \\\"",
      "Single quotes (apostrophe) don't need escaping inside double-quoted strings"
    ],
    tags: ["print", "escape-sequences"],
  },
  {
    title: "Print Backslash",
    slug: "print-backslash",
    type: "CODE",
    prompt: "Print a file path: C:\\Users\\Documents",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print: C:\\Users\\Documents

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("C:\\\\Users\\\\Documents");
    }
}`,
    tests: [
      { input: "", expectedOutput: "C:\\Users\\Documents", isHidden: false },
    ],
    hints: [
      "Backslash is an escape character",
      "To print one backslash, use two: \\\\",
      "Each backslash in the output needs \\\\ in the code"
    ],
    tags: ["print", "escape-sequences"],
  },
  {
    title: "Print Tab Character",
    slug: "print-tab",
    type: "CODE",
    prompt: "Print \"Name\\tAge\" using a tab character between the words.",
    constraints: "Use \\t for the tab.",
    difficulty: 2,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print Name and Age separated by a tab

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Name\\tAge");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Name\tAge", isHidden: false },
    ],
    hints: [
      "The tab escape sequence is \\t",
      "Put it between the two words",
      "It creates horizontal spacing"
    ],
    tags: ["print", "escape-sequences"],
  },
  {
    title: "Print Newline in String",
    slug: "print-newline-in-string",
    type: "CODE",
    prompt: "Using a single println statement, print \"Hello\" and \"World\" on separate lines.",
    constraints: "Use only one println call with \\n.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Use \\n in a single println

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello\\nWorld");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello\nWorld", isHidden: false },
    ],
    hints: [
      "The newline escape sequence is \\n",
      "Put it between Hello and World in the same string",
      "Only use one println statement"
    ],
    tags: ["print", "escape-sequences"],
  },
  {
    title: "Integer Arithmetic Output",
    slug: "integer-arithmetic-output",
    type: "CODE",
    prompt: "Print the result of 15 + 27 (the number 42).",
    constraints: "Use the + operator, not the literal 42.",
    difficulty: 1,
    estimatedMinutes: 2,
    points: 10,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print the sum of 15 and 27

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println(15 + 27);
    }
}`,
    tests: [
      { input: "", expectedOutput: "42", isHidden: false },
    ],
    hints: [
      "Put the arithmetic expression inside println",
      "No quotes needed for numbers",
      "Java will calculate before printing"
    ],
    tags: ["print", "arithmetic"],
  },
  {
    title: "String Concatenation Output",
    slug: "string-concat-output",
    type: "CODE",
    prompt: "Concatenate and print: \"Java\" + \" \" + \"Programming\" to output \"Java Programming\".",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Concatenate three strings

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Java" + " " + "Programming");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Java Programming", isHidden: false },
    ],
    hints: [
      "Use + to join strings together",
      "Include a space string in the middle",
      "All parts should be in quotes"
    ],
    tags: ["print", "concatenation"],
  },
  {
    title: "Mixed Concatenation",
    slug: "mixed-concat",
    type: "CODE",
    prompt: "Print \"Score: 100\" by concatenating the string \"Score: \" with the number 100.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Concatenate string with number

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Score: " + 100);
    }
}`,
    tests: [
      { input: "", expectedOutput: "Score: 100", isHidden: false },
    ],
    hints: [
      "Strings can be concatenated with numbers",
      "The number doesn't need quotes",
      "The + operator converts number to string automatically"
    ],
    tags: ["print", "concatenation"],
  },
  {
    title: "ASCII Art Initial",
    slug: "ascii-art-initial",
    type: "CODE",
    prompt: "Print a large letter 'J' using asterisks:\n  ***\n    *\n    *\n*   *\n ***",
    constraints: "Match the pattern exactly.",
    difficulty: 3,
    estimatedMinutes: 8,
    points: 30,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print letter J

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("  ***");
        System.out.println("    *");
        System.out.println("    *");
        System.out.println("*   *");
        System.out.println(" ***");
    }
}`,
    tests: [
      { input: "", expectedOutput: "  ***\n    *\n    *\n*   *\n ***", isHidden: false },
    ],
    hints: [
      "Count spaces carefully",
      "Each line needs the right number of leading spaces",
      "Use 5 println statements",
      "Check each row's pattern separately"
    ],
    tags: ["print", "patterns", "ascii-art"],
  },

  // ===== Topic 2: Compilation & Execution (10 questions) =====
  {
    title: "Declare and Print Integer",
    slug: "declare-print-int",
    type: "CODE",
    prompt: "Declare an int variable named 'number' with value 42, then print it.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare int and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 42;
        System.out.println(number);
    }
}`,
    tests: [
      { input: "", expectedOutput: "42", isHidden: false },
    ],
    hints: [
      "Use: int variableName = value;",
      "Print the variable name, not a string",
      "Variable names don't need quotes when printing"
    ],
    tags: ["variables", "int", "basics"],
  },
  {
    title: "Declare and Print Double",
    slug: "declare-print-double",
    type: "CODE",
    prompt: "Declare a double variable named 'pi' with value 3.14159, then print it.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare double and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        double pi = 3.14159;
        System.out.println(pi);
    }
}`,
    tests: [
      { input: "", expectedOutput: "3.14159", isHidden: false },
    ],
    hints: [
      "Use double for decimal numbers",
      "Syntax: double variableName = value;",
      "Print the variable directly"
    ],
    tags: ["variables", "double", "basics"],
  },
  {
    title: "Declare and Print String Variable",
    slug: "declare-print-string",
    type: "CODE",
    prompt: "Declare a String variable named 'message' with value \"Hello Java\", then print it.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare String and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String message = "Hello Java";
        System.out.println(message);
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello Java", isHidden: false },
    ],
    hints: [
      "String has a capital S",
      "String values go in double quotes",
      "Print the variable name without quotes"
    ],
    tags: ["variables", "String", "basics"],
  },
  {
    title: "Boolean Variable",
    slug: "boolean-variable",
    type: "CODE",
    prompt: "Declare a boolean variable named 'isJavaFun' with value true, then print it.",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare boolean and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        boolean isJavaFun = true;
        System.out.println(isJavaFun);
    }
}`,
    tests: [
      { input: "", expectedOutput: "true", isHidden: false },
    ],
    hints: [
      "boolean values are true or false (lowercase)",
      "No quotes around true/false",
      "boolean has lowercase b"
    ],
    tags: ["variables", "boolean", "basics"],
  },
  {
    title: "Character Variable",
    slug: "char-variable",
    type: "CODE",
    prompt: "Declare a char variable named 'grade' with value 'A', then print it.",
    constraints: "Use single quotes for char.",
    difficulty: 1,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare char and print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        char grade = 'A';
        System.out.println(grade);
    }
}`,
    tests: [
      { input: "", expectedOutput: "A", isHidden: false },
    ],
    hints: [
      "char uses single quotes: 'A'",
      "Only one character per char variable",
      "String uses double quotes, char uses single"
    ],
    tags: ["variables", "char", "basics"],
  },
  {
    title: "Variable Reassignment",
    slug: "variable-reassignment",
    type: "CODE",
    prompt: "Declare int x = 5, then change x to 10, then print x.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare, reassign, print

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int x = 5;
        x = 10;
        System.out.println(x);
    }
}`,
    tests: [
      { input: "", expectedOutput: "10", isHidden: false },
    ],
    hints: [
      "Declare with: int x = 5;",
      "Reassign with just: x = 10; (no int)",
      "The final value is what gets printed"
    ],
    tags: ["variables", "reassignment"],
  },
  {
    title: "Arithmetic with Variables",
    slug: "arithmetic-variables",
    type: "CODE",
    prompt: "Declare int a = 10 and int b = 3. Print their sum.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Declare a and b, print sum

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;
        System.out.println(a + b);
    }
}`,
    tests: [
      { input: "", expectedOutput: "13", isHidden: false },
    ],
    hints: [
      "Declare both variables",
      "Use + to add them in println",
      "a + b evaluates before printing"
    ],
    tags: ["variables", "arithmetic"],
  },
  {
    title: "Integer Division",
    slug: "integer-division",
    type: "CODE",
    prompt: "Declare int a = 17 and int b = 5. Print a / b (integer division).",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Integer division

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 17;
        int b = 5;
        System.out.println(a / b);
    }
}`,
    tests: [
      { input: "", expectedOutput: "3", isHidden: false },
    ],
    hints: [
      "Integer division truncates (no decimal)",
      "17 / 5 = 3 (not 3.4)",
      "The result is still an int"
    ],
    tags: ["variables", "arithmetic", "division"],
  },
  {
    title: "Modulo Operator",
    slug: "modulo-operator",
    type: "CODE",
    prompt: "Declare int a = 17 and int b = 5. Print a % b (remainder).",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Modulo operation

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int a = 17;
        int b = 5;
        System.out.println(a % b);
    }
}`,
    tests: [
      { input: "", expectedOutput: "2", isHidden: false },
    ],
    hints: [
      "% gives the remainder of division",
      "17 divided by 5 is 3 remainder 2",
      "So 17 % 5 = 2"
    ],
    tags: ["variables", "arithmetic", "modulo"],
  },
  {
    title: "Compound Assignment",
    slug: "compound-assignment",
    type: "CODE",
    prompt: "Declare int x = 10. Use += to add 5 to x. Print x.",
    constraints: "Use the += operator.",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Use += operator

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int x = 10;
        x += 5;
        System.out.println(x);
    }
}`,
    tests: [
      { input: "", expectedOutput: "15", isHidden: false },
    ],
    hints: [
      "x += 5 is the same as x = x + 5",
      "It adds 5 to the current value of x",
      "Similar operators: -=, *=, /="
    ],
    tags: ["variables", "compound-operators"],
  },

  // ===== Topic 3: Git Basics (5 questions - conceptual with code output) =====
  {
    title: "Version Number",
    slug: "version-number",
    type: "CODE",
    prompt: "Print a version string in the format \"v1.0.0\".",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 2,
    points: 10,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print version

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("v1.0.0");
    }
}`,
    tests: [
      { input: "", expectedOutput: "v1.0.0", isHidden: false },
    ],
    hints: [
      "Just print the string exactly",
      "Include the 'v' prefix",
      "Use dots between numbers"
    ],
    tags: ["print", "versioning"],
  },
  {
    title: "Commit Message Format",
    slug: "commit-message-format",
    type: "CODE",
    prompt: "Print a properly formatted commit message:\n\"feat: add user login\"",
    constraints: "Follow conventional commit format.",
    difficulty: 1,
    estimatedMinutes: 2,
    points: 10,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print commit message

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("feat: add user login");
    }
}`,
    tests: [
      { input: "", expectedOutput: "feat: add user login", isHidden: false },
    ],
    hints: [
      "Common prefixes: feat, fix, docs, style, refactor",
      "Format is: type: description",
      "Lowercase, present tense"
    ],
    tags: ["print", "git", "conventions"],
  },
  {
    title: "File Status Output",
    slug: "file-status-output",
    type: "CODE",
    prompt: "Print three file statuses on separate lines:\n\"M  src/App.java\"\n\"A  src/User.java\"\n\"D  src/Old.java\"",
    constraints: "M=modified, A=added, D=deleted",
    difficulty: 2,
    estimatedMinutes: 4,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print file statuses

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("M  src/App.java");
        System.out.println("A  src/User.java");
        System.out.println("D  src/Old.java");
    }
}`,
    tests: [
      { input: "", expectedOutput: "M  src/App.java\nA  src/User.java\nD  src/Old.java", isHidden: false },
    ],
    hints: [
      "Each status is one letter followed by spaces",
      "Then the file path",
      "Use three println statements"
    ],
    tags: ["print", "git", "status"],
  },
  {
    title: "Branch Name",
    slug: "branch-name",
    type: "CODE",
    prompt: "Print a feature branch name: \"feature/user-authentication\"",
    constraints: "Use lowercase and hyphens.",
    difficulty: 1,
    estimatedMinutes: 2,
    points: 10,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print branch name

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("feature/user-authentication");
    }
}`,
    tests: [
      { input: "", expectedOutput: "feature/user-authentication", isHidden: false },
    ],
    hints: [
      "Branch names often use prefixes like feature/",
      "Use hyphens instead of spaces",
      "All lowercase"
    ],
    tags: ["print", "git", "branches"],
  },
  {
    title: "Git Log Format",
    slug: "git-log-format",
    type: "CODE",
    prompt: "Print a simplified git log entry:\n\"abc1234 - Initial commit (John Doe)\"",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // Print log entry

    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("abc1234 - Initial commit (John Doe)");
    }
}`,
    tests: [
      { input: "", expectedOutput: "abc1234 - Initial commit (John Doe)", isHidden: false },
    ],
    hints: [
      "Hash, dash, message, author in parentheses",
      "Print exactly as shown",
      "Mind the spaces"
    ],
    tags: ["print", "git", "log"],
  },

  // ===== Topic 4: Error Types (10 questions) =====
  {
    title: "Fix Missing Semicolon",
    slug: "fix-missing-semicolon",
    type: "CODE",
    prompt: "The code below has a syntax error. Fix it to print \"Fixed!\"",
    constraints: "Fix the compilation error.",
    difficulty: 1,
    estimatedMinutes: 2,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Fixed!")
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Fixed!");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Fixed!", isHidden: false },
    ],
    hints: [
      "Every statement needs to end with something",
      "Look at the end of the println line",
      "Add a semicolon"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix Missing Quote",
    slug: "fix-missing-quote",
    type: "CODE",
    prompt: "Fix the syntax error to print \"Hello\"",
    constraints: null,
    difficulty: 1,
    estimatedMinutes: 2,
    points: 15,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello);
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Hello", isHidden: false },
    ],
    hints: [
      "String literals need both opening and closing quotes",
      "Look at the string carefully",
      "Add the missing quote before the parenthesis"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix Missing Brace",
    slug: "fix-missing-brace",
    type: "CODE",
    prompt: "Fix the syntax error (missing closing brace) to print \"Complete\"",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Complete");

}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Complete");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Complete", isHidden: false },
    ],
    hints: [
      "Count your opening and closing braces",
      "Every { needs a matching }",
      "The main method is missing its closing brace"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix Missing Parenthesis",
    slug: "fix-missing-paren",
    type: "CODE",
    prompt: "Fix the syntax error to print \"Working\"",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Working";
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Working");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Working", isHidden: false },
    ],
    hints: [
      "Method calls need both ( and )",
      "Count the parentheses",
      "Add the closing parenthesis before the semicolon"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix Typo in println",
    slug: "fix-typo-println",
    type: "CODE",
    prompt: "Fix the method name typo to print \"Success\"",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        System.out.printl("Success");
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Success");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Success", isHidden: false },
    ],
    hints: [
      "Check the method name spelling",
      "It should be println (print line)",
      "The 'n' is missing"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix Case Sensitivity",
    slug: "fix-case-sensitivity",
    type: "CODE",
    prompt: "Fix the case sensitivity error to print \"Done\"",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        system.out.println("Done");
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Done");
    }
}`,
    tests: [
      { input: "", expectedOutput: "Done", isHidden: false },
    ],
    hints: [
      "Java is case-sensitive",
      "Class names start with uppercase",
      "system should be System"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix String Type",
    slug: "fix-string-type",
    type: "CODE",
    prompt: "Fix the type declaration error to print \"Type Fixed\"",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        string message = "Type Fixed";
        System.out.println(message);
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        String message = "Type Fixed";
        System.out.println(message);
    }
}`,
    tests: [
      { input: "", expectedOutput: "Type Fixed", isHidden: false },
    ],
    hints: [
      "String is a class name",
      "Class names start with uppercase",
      "Change string to String"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix Variable Declaration",
    slug: "fix-variable-declaration",
    type: "CODE",
    prompt: "Fix the variable declaration to print 100",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 3,
    points: 20,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Int number = 100;
        System.out.println(number);
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int number = 100;
        System.out.println(number);
    }
}`,
    tests: [
      { input: "", expectedOutput: "100", isHidden: false },
    ],
    hints: [
      "Primitive types are lowercase",
      "int, double, boolean are all lowercase",
      "Int should be int"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix Undeclared Variable",
    slug: "fix-undeclared-variable",
    type: "CODE",
    prompt: "The variable 'result' is used but never declared. Fix the code to print 50.",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        result = 50;
        System.out.println(result);
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        int result = 50;
        System.out.println(result);
    }
}`,
    tests: [
      { input: "", expectedOutput: "50", isHidden: false },
    ],
    hints: [
      "Variables must be declared before use",
      "Declare the type before the variable name",
      "Add 'int' before 'result'"
    ],
    tags: ["errors", "syntax", "debugging"],
  },
  {
    title: "Fix Type Mismatch",
    slug: "fix-type-mismatch",
    type: "CODE",
    prompt: "Fix the type mismatch to store and print 3.14",
    constraints: null,
    difficulty: 2,
    estimatedMinutes: 4,
    points: 25,
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int pi = 3.14;
        System.out.println(pi);
    }
}`,
    solutionCode: `public class Solution {
    public static void main(String[] args) {
        double pi = 3.14;
        System.out.println(pi);
    }
}`,
    tests: [
      { input: "", expectedOutput: "3.14", isHidden: false },
    ],
    hints: [
      "int can only hold whole numbers",
      "3.14 is a decimal number",
      "Use double for decimal values"
    ],
    tags: ["errors", "types", "debugging"],
  },
]
