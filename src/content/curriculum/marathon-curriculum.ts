/**
 * CS Exam Marathon Curriculum
 * 10-day intensive exam prep: master Java from fundamentals to OOP
 * Days 1-5: Fundamentals through Methods
 * Days 6-10: Recursion, OOP Foundations, OOP Advanced, Inheritance & Polymorphism, Integration Review
 */

import type { CourseData, WeekData, TopicData, QuestionData, TestCase, LessonData } from "./java-curriculum"
export type { CourseData, WeekData, TopicData, QuestionData }

export const marathonCurriculum: CourseData = {
  slug: "cs-exam-marathon",
  name: "CS Exam Marathon",
  description: "10-day intensive exam prep: master Java from fundamentals to OOP",
  language: "java",
  weeks: [
    // ==================== Day 1: Fundamentals & I/O ====================
    {
      weekNumber: 1,
      title: "Fundamentals & I/O",
      description: "Variables, data types, operators, and basic input/output",
      topics: [
        {
          slug: "variables-and-types",
          title: "Variables & Data Types",
          description: "Declaring variables, type casting, and arithmetic operations",
          introMarkdown: `## מה זה משתנים וטיפוסי נתונים?

**משתנה (Variable)** הוא "קופסה" בזיכרון שמחזיקה ערך. לכל משתנה יש שם וטיפוס שקובע איזה סוג מידע הוא מאחסן.

## טיפוסים בסיסיים (Primitive Types)

| טיפוס | תיאור | דוגמה |
|--------|--------|-------|
| \`int\` | מספר שלם | \`int age = 25;\` |
| \`double\` | מספר עשרוני | \`double price = 19.99;\` |
| \`char\` | תו בודד | \`char grade = 'A';\` |
| \`boolean\` | ערך לוגי | \`boolean isValid = true;\` |
| \`String\` | מחרוזת (לא primitive) | \`String name = "Java";\` |

## מושגים מרכזיים

- **הצהרה (Declaration)**: קביעת טיפוס ושם — \`int x;\`
- **השמה (Assignment)**: נתינת ערך — \`x = 10;\`
- **המרת טיפוסים (Casting)**: \`(double) x\` הופך int ל-double
- **חילוק שלמים**: \`7 / 2 = 3\` (לא 3.5!) — חילוק בין שני int נותן int
- **חילוק עשרוני**: \`7.0 / 2\` או \`(double) 7 / 2\` נותן \`3.5\`

## דוגמה קצרה

\`\`\`java
int a = 7, b = 2;
System.out.println(a / b);           // 3 (חילוק שלמים)
System.out.println((double) a / b);  // 3.5 (המרה ל-double)
System.out.printf("%.2f%n", 3.5);    // 3.50 (עיגול לשתי ספרות)
\`\`\`
`,
          questions: [
            {
              slug: "declare-and-print-variables",
              type: "FULL_PROGRAM",
              title: "Declare & Print Variables",
              prompt: "Read two integers from input. Print their sum on the first line and their product on the second line.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read two integers a and b
        // Print their sum on one line
        // Print their product on the next line

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        System.out.println(a * b);
    }
}`,
              tests: [
                { input: "3 5", expectedOutput: "8\n15", isHidden: false, description: "Basic positive integers" },
                { input: "10 20", expectedOutput: "30\n200", isHidden: false, description: "Larger numbers" },
                { input: "0 7", expectedOutput: "7\n0", isHidden: true, description: "Zero case" }
              ],
              hints: [
                "Use sc.nextInt() to read each integer",
                "Use System.out.println() to print each result on its own line",
                "Remember that + adds numbers and * multiplies them"
              ],
              tags: ["variables", "int", "arithmetic", "scanner"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "type-casting-int-to-double",
              type: "FULL_PROGRAM",
              title: "Integer Division vs Double Division",
              prompt: "Read two integers from input. Print the result of integer division on the first line, then the result of double (decimal) division on the second line, formatted to exactly two decimal places.\n\nFor example, if the input is 7 and 2, output:\n3\n3.50",
              constraints: "The second integer will never be zero.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read two integers
        // Print integer division result
        // Print double division result with 2 decimal places

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a / b);
        System.out.printf("%.2f%n", (double) a / b);
    }
}`,
              tests: [
                { input: "7 2", expectedOutput: "3\n3.50", isHidden: false, description: "Basic case" },
                { input: "10 3", expectedOutput: "3\n3.33", isHidden: false, description: "Repeating decimal" },
                { input: "5 5", expectedOutput: "1\n1.00", isHidden: true, description: "Equal numbers" },
                { input: "1 4", expectedOutput: "0\n0.25", isHidden: true, description: "Result less than 1" }
              ],
              hints: [
                "Integer division in Java truncates the decimal: 7/2 = 3",
                "Cast one operand to double before dividing: (double) a / b",
                "Use System.out.printf(\"%.2f%n\", value) to format to 2 decimal places"
              ],
              tags: ["variables", "type-casting", "double", "printf"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "swap-two-variables",
              type: "FULL_PROGRAM",
              title: "Swap Two Variables",
              prompt: "Read two integers from input. Swap their values and print them, each on a separate line. The first line of output should be the second input value, and the second line should be the first input value.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        // Swap the values of a and b
        // Print a then b (after swap)

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int temp = a;
        a = b;
        b = temp;
        System.out.println(a);
        System.out.println(b);
    }
}`,
              tests: [
                { input: "3 7", expectedOutput: "7\n3", isHidden: false, description: "Basic swap" },
                { input: "10 20", expectedOutput: "20\n10", isHidden: false, description: "Larger numbers" },
                { input: "-5 8", expectedOutput: "8\n-5", isHidden: true, description: "Negative number" }
              ],
              hints: [
                "You need a temporary variable to hold one value during the swap",
                "Store a in temp, then set a = b, then set b = temp",
                "Print a and b after the swap is complete"
              ],
              tags: ["variables", "swap", "temp-variable"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "expression-evaluation",
              type: "FULL_PROGRAM",
              title: "Expression Evaluator",
              prompt: "Read three integers a, b, and c from input. Compute and print the result of the expression: a^2 + 2*b - c (where ^ means exponent, so a squared plus two times b minus c). Print the result as a single integer.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read three integers a, b, c
        // Compute a*a + 2*b - c and print the result

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(a * a + 2 * b - c);
    }
}`,
              tests: [
                { input: "3 4 2", expectedOutput: "15", isHidden: false, description: "3^2 + 2*4 - 2 = 9+8-2 = 15" },
                { input: "1 1 1", expectedOutput: "2", isHidden: false, description: "1+2-1 = 2" },
                { input: "5 0 10", expectedOutput: "15", isHidden: true, description: "25+0-10 = 15" },
                { input: "0 0 0", expectedOutput: "0", isHidden: true, description: "All zeros" }
              ],
              hints: [
                "Java does not have an exponent operator; use a * a for a squared",
                "Follow standard math order of operations: multiplication before addition/subtraction",
                "The expression in Java is: a * a + 2 * b - c"
              ],
              tags: ["arithmetic", "expressions", "operators"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            }
          ]
        },
        {
          slug: "input-output",
          title: "Input & Output",
          introMarkdown: `## מה זה Input/Output?

**קלט (Input)** — קריאת נתונים מהמשתמש. **פלט (Output)** — הדפסת תוצאות למסך.

## פלט — הדפסה

- \`System.out.println(x)\` — מדפיס ויורד שורה
- \`System.out.print(x)\` — מדפיס בלי לרדת שורה
- \`System.out.printf("%.2f", x)\` — הדפסה מפורמטת

## קלט — Scanner

\`\`\`java
Scanner sc = new Scanner(System.in);
int n = sc.nextInt();        // קורא מספר שלם
double d = sc.nextDouble();  // קורא מספר עשרוני
String word = sc.next();     // קורא מילה אחת
String line = sc.nextLine(); // קורא שורה שלמה
\`\`\`

## מלכודת נפוצה!

אחרי \`nextInt()\` או \`nextDouble()\`, אם רוצים לקרוא שורה שלמה עם \`nextLine()\`, חייבים לעשות \`sc.nextLine()\` נוסף כדי "לנקות" את ה-Enter שנשאר:

\`\`\`java
int n = sc.nextInt();
sc.nextLine();              // ניקוי ה-buffer
String line = sc.nextLine(); // עכשיו קורא שורה שלמה
\`\`\`

## פורמט הדפסה

| קוד | תיאור | דוגמה |
|-----|--------|-------|
| \`%d\` | מספר שלם | \`printf("%d", 42)\` → 42 |
| \`%f\` | עשרוני | \`printf("%.2f", 3.14159)\` → 3.14 |
| \`%s\` | מחרוזת | \`printf("%s", "hi")\` → hi |
| \`%n\` | שורה חדשה | |
`,
          description: "Scanner input and System.out output formatting",
          questions: [
            {
              slug: "read-and-greet",
              type: "FULL_PROGRAM",
              title: "Read & Greet",
              prompt: "Read a person's name (a single word) from input and print \"Hello, <name>!\" where <name> is replaced with the input.\n\nExample: if input is \"Alice\", print \"Hello, Alice!\"",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read a name and print the greeting

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
                { input: "Alice", expectedOutput: "Hello, Alice!", isHidden: false, description: "Basic name" },
                { input: "Bob", expectedOutput: "Hello, Bob!", isHidden: false, description: "Another name" },
                { input: "World", expectedOutput: "Hello, World!", isHidden: true, description: "Generic word" }
              ],
              hints: [
                "Use sc.next() to read a single word",
                "Use string concatenation with + to build the greeting",
                "Don't forget the comma after Hello and the exclamation mark at the end"
              ],
              tags: ["scanner", "input", "string-concatenation", "output"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "read-full-line",
              type: "FULL_PROGRAM",
              title: "Read Full Line",
              prompt: "Read an integer n from the first line of input, then read a full line of text from the second line. Print the text repeated n times, each on a separate line.\n\nExample:\nInput:\n2\nHello World\n\nOutput:\nHello World\nHello World",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read an integer n
        // Read a full line of text
        // Print the text n times, each on its own line

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine(); // consume the newline after the integer
        String text = sc.nextLine();
        for (int i = 0; i < n; i++) {
            System.out.println(text);
        }
    }
}`,
              tests: [
                { input: "2\nHello World", expectedOutput: "Hello World\nHello World", isHidden: false, description: "Two repetitions" },
                { input: "3\nJava", expectedOutput: "Java\nJava\nJava", isHidden: false, description: "Three repetitions" },
                { input: "1\nTest Line", expectedOutput: "Test Line", isHidden: true, description: "Single repetition" }
              ],
              hints: [
                "After sc.nextInt(), call sc.nextLine() to consume the leftover newline character",
                "Then use sc.nextLine() again to read the full line of text",
                "Use a for loop to print the text n times"
              ],
              tags: ["scanner", "nextLine", "loops", "input"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "formatted-receipt",
              type: "FULL_PROGRAM",
              title: "Formatted Receipt",
              prompt: "Read an item name (single word), quantity (integer), and unit price (double) from input, each on a separate line. Print a receipt in this exact format:\n\nItem: <name>\nQty: <quantity>\nTotal: $<total>\n\nThe total is quantity * price, formatted to exactly 2 decimal places.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read item name, quantity, and price
        // Print the formatted receipt

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int qty = sc.nextInt();
        double price = sc.nextDouble();
        double total = qty * price;
        System.out.println("Item: " + name);
        System.out.println("Qty: " + qty);
        System.out.printf("Total: $%.2f%n", total);
    }
}`,
              tests: [
                { input: "Apple\n3\n1.50", expectedOutput: "Item: Apple\nQty: 3\nTotal: $4.50", isHidden: false, description: "Basic receipt" },
                { input: "Book\n1\n29.99", expectedOutput: "Item: Book\nQty: 1\nTotal: $29.99", isHidden: false, description: "Single item" },
                { input: "Pen\n10\n0.75", expectedOutput: "Item: Pen\nQty: 10\nTotal: $7.50", isHidden: true, description: "Multiple cheap items" }
              ],
              hints: [
                "Use sc.next() for the name, sc.nextInt() for quantity, sc.nextDouble() for price",
                "Multiply quantity by price to get the total",
                "Use System.out.printf(\"Total: $%.2f%n\", total) for 2 decimal places"
              ],
              tags: ["scanner", "printf", "formatting", "output"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "multi-type-parser",
              type: "FULL_PROGRAM",
              title: "Multi-Type Input Parser",
              prompt: "Read the following from a single line of input separated by spaces: a string (word), an int, a double, and a boolean.\n\nPrint each value on its own line with a label:\nWord: <string>\nInteger: <int>\nDecimal: <double>\nBoolean: <boolean>\n\nThe double should be printed with exactly 1 decimal place.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read a string, int, double, and boolean from one line
        // Print each with its label

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String word = sc.next();
        int num = sc.nextInt();
        double dec = sc.nextDouble();
        boolean bool = sc.nextBoolean();
        System.out.println("Word: " + word);
        System.out.println("Integer: " + num);
        System.out.printf("Decimal: %.1f%n", dec);
        System.out.println("Boolean: " + bool);
    }
}`,
              tests: [
                { input: "Hello 42 3.14 true", expectedOutput: "Word: Hello\nInteger: 42\nDecimal: 3.1\nBoolean: true", isHidden: false, description: "Mixed types" },
                { input: "Java 10 2.5 false", expectedOutput: "Word: Java\nInteger: 10\nDecimal: 2.5\nBoolean: false", isHidden: false, description: "Another set" },
                { input: "Test 0 0.0 true", expectedOutput: "Word: Test\nInteger: 0\nDecimal: 0.0\nBoolean: true", isHidden: true, description: "Zero values" }
              ],
              hints: [
                "Scanner has methods for each type: next(), nextInt(), nextDouble(), nextBoolean()",
                "Read them in the exact order they appear in the input",
                "Use printf with %.1f for 1 decimal place on the double"
              ],
              tags: ["scanner", "data-types", "printf", "parsing"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        }
      ]
    },

    // ==================== Day 2: Control Flow ====================
    {
      weekNumber: 2,
      title: "Control Flow",
      description: "Conditionals, logical operators, and decision-making",
      topics: [
        {
          slug: "conditionals",
          title: "If-Else & Switch",
          introMarkdown: `## מה זה תנאים (Conditionals)?

**תנאים** מאפשרים לתוכנית לקבל החלטות — להריץ קוד מסוים רק אם תנאי כלשהו מתקיים.

## if / else if / else

\`\`\`java
if (grade >= 90) {
    System.out.println("מצוין");
} else if (grade >= 70) {
    System.out.println("טוב");
} else {
    System.out.println("צריך לשפר");
}
\`\`\`

**כללים חשובים:**
- תנאי הוא תמיד ביטוי **boolean** (true/false)
- \`else if\` ו-\`else\` הם **אופציונליים**
- הבדיקה מלמעלה למטה — ברגע שתנאי מתקיים, השאר לא נבדקים

## switch

מתאים כשבודקים ערך **ספציפי** (לא טווח):

\`\`\`java
switch (day) {
    case 1: System.out.println("Sunday"); break;
    case 2: System.out.println("Monday"); break;
    default: System.out.println("Other");
}
\`\`\`

**שימו לב**: בלי \`break\` — הקוד "נופל" ל-case הבא (fall-through)!

## אופרטור שלישוני (Ternary)

\`\`\`java
String result = (x > 0) ? "positive" : "non-positive";
\`\`\`
`,
          description: "Conditional statements, if-else chains, and switch-case",
          questions: [
            {
              slug: "positive-negative-zero",
              type: "FULL_PROGRAM",
              title: "Positive, Negative, or Zero",
              prompt: "Read an integer from input. Print \"Positive\" if it is greater than zero, \"Negative\" if it is less than zero, or \"Zero\" if it is exactly zero.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read an integer and classify it

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n > 0) {
            System.out.println("Positive");
        } else if (n < 0) {
            System.out.println("Negative");
        } else {
            System.out.println("Zero");
        }
    }
}`,
              tests: [
                { input: "5", expectedOutput: "Positive", isHidden: false, description: "Positive number" },
                { input: "-3", expectedOutput: "Negative", isHidden: false, description: "Negative number" },
                { input: "0", expectedOutput: "Zero", isHidden: true, description: "Zero" }
              ],
              hints: [
                "Use if-else if-else to check three conditions",
                "Check > 0 first, then < 0, then else covers zero",
                "Make sure to match the exact output strings including capitalization"
              ],
              tags: ["conditionals", "if-else", "comparison"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "grade-calculator",
              type: "FULL_PROGRAM",
              title: "Grade Calculator",
              prompt: "Read an integer score (0-100) from input. Print the letter grade:\n- 90-100: \"A\"\n- 80-89: \"B\"\n- 70-79: \"C\"\n- 60-69: \"D\"\n- Below 60: \"F\"",
              constraints: "Input will always be between 0 and 100 inclusive.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read a score and print the letter grade

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int score = sc.nextInt();
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
                { input: "95", expectedOutput: "A", isHidden: false, description: "A grade" },
                { input: "72", expectedOutput: "C", isHidden: false, description: "C grade" },
                { input: "60", expectedOutput: "D", isHidden: true, description: "Boundary D grade" },
                { input: "45", expectedOutput: "F", isHidden: true, description: "F grade" }
              ],
              hints: [
                "Use if-else if chain starting from the highest range",
                "Since you check >= 90 first, the next check >= 80 automatically means 80-89",
                "The else at the end catches everything below 60"
              ],
              tags: ["conditionals", "if-else-chain", "ranges"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "day-of-week-switch",
              type: "FULL_PROGRAM",
              title: "Day of Week (Switch)",
              prompt: "Read an integer (1-7) from input. Print the corresponding day name using a switch statement:\n1 = \"Sunday\", 2 = \"Monday\", 3 = \"Tuesday\", 4 = \"Wednesday\", 5 = \"Thursday\", 6 = \"Friday\", 7 = \"Saturday\".\nIf the number is not 1-7, print \"Invalid\".",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read an integer and print the day name using switch

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int day = sc.nextInt();
        switch (day) {
            case 1: System.out.println("Sunday"); break;
            case 2: System.out.println("Monday"); break;
            case 3: System.out.println("Tuesday"); break;
            case 4: System.out.println("Wednesday"); break;
            case 5: System.out.println("Thursday"); break;
            case 6: System.out.println("Friday"); break;
            case 7: System.out.println("Saturday"); break;
            default: System.out.println("Invalid"); break;
        }
    }
}`,
              tests: [
                { input: "1", expectedOutput: "Sunday", isHidden: false, description: "Sunday" },
                { input: "4", expectedOutput: "Wednesday", isHidden: false, description: "Wednesday" },
                { input: "7", expectedOutput: "Saturday", isHidden: true, description: "Saturday" },
                { input: "9", expectedOutput: "Invalid", isHidden: true, description: "Invalid input" }
              ],
              hints: [
                "Use switch(day) with case 1: through case 7:",
                "Don't forget the break; statement after each case",
                "Use default: for any number outside 1-7"
              ],
              tags: ["switch", "conditionals", "control-flow"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "triangle-type-classifier",
              type: "FULL_PROGRAM",
              title: "Triangle Classifier",
              prompt: "Read three integers representing the sides of a triangle. Determine and print the type of triangle:\n- \"Equilateral\" if all three sides are equal\n- \"Isosceles\" if exactly two sides are equal\n- \"Scalene\" if no sides are equal\n- \"Not a triangle\" if the sides cannot form a valid triangle\n\nA valid triangle requires that the sum of any two sides is greater than the third side.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read three sides and classify the triangle

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        if (a + b <= c || a + c <= b || b + c <= a) {
            System.out.println("Not a triangle");
        } else if (a == b && b == c) {
            System.out.println("Equilateral");
        } else if (a == b || b == c || a == c) {
            System.out.println("Isosceles");
        } else {
            System.out.println("Scalene");
        }
    }
}`,
              tests: [
                { input: "5 5 5", expectedOutput: "Equilateral", isHidden: false, description: "All sides equal" },
                { input: "5 5 3", expectedOutput: "Isosceles", isHidden: false, description: "Two sides equal" },
                { input: "3 4 5", expectedOutput: "Scalene", isHidden: true, description: "All different" },
                { input: "1 2 10", expectedOutput: "Not a triangle", isHidden: true, description: "Invalid triangle" }
              ],
              hints: [
                "First check the triangle inequality: each pair of sides must sum to more than the third",
                "Check equilateral (all equal) before isosceles (two equal)",
                "Use || (or) to check if any pair of sides is equal for isosceles"
              ],
              tags: ["conditionals", "nested-if", "logic", "geometry"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "leap-year-checker",
              type: "FULL_PROGRAM",
              title: "Leap Year Checker",
              prompt: "Read a year (integer) from input. Determine if it is a leap year and print \"Leap year\" or \"Not a leap year\".\n\nLeap year rules:\n- Divisible by 4 AND not divisible by 100 => leap year\n- Divisible by 400 => leap year\n- Everything else => not a leap year",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read a year and determine if it's a leap year

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int year = sc.nextInt();
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            System.out.println("Leap year");
        } else {
            System.out.println("Not a leap year");
        }
    }
}`,
              tests: [
                { input: "2024", expectedOutput: "Leap year", isHidden: false, description: "Divisible by 4, not by 100" },
                { input: "1900", expectedOutput: "Not a leap year", isHidden: false, description: "Divisible by 100 but not 400" },
                { input: "2000", expectedOutput: "Leap year", isHidden: true, description: "Divisible by 400" },
                { input: "2023", expectedOutput: "Not a leap year", isHidden: true, description: "Not divisible by 4" }
              ],
              hints: [
                "A year is a leap year if divisible by 4, except for century years",
                "Century years (divisible by 100) are only leap years if also divisible by 400",
                "Combine conditions: (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)"
              ],
              tags: ["conditionals", "modulo", "logic", "boolean-expressions"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        },
        {
          slug: "logical-operators",
          title: "Logical Operators",
          introMarkdown: `## מה זה אופרטורים לוגיים?

אופרטורים לוגיים משלבים מספר תנאים לביטוי boolean אחד.

## האופרטורים

| אופרטור | משמעות | דוגמה |
|----------|--------|-------|
| \`&&\` | וגם (AND) | \`age >= 18 && hasID\` |
| \`\\|\\|\` | או (OR) | \`isStudent \\|\\| isStaff\` |
| \`!\` | שלילה (NOT) | \`!isEmpty\` |

## סדר עדיפויות

\`!\` → \`&&\` → \`||\`

\`\`\`java
// !true || false && true
// false || false
// = false
\`\`\`

## Short-circuit evaluation

- **\`&&\`**: אם הצד השמאלי \`false\`, הצד הימני לא נבדק
- **\`||\`**: אם הצד השמאלי \`true\`, הצד הימני לא נבדק

\`\`\`java
// בטוח! אם arr == null, לא ניגש ל-length
if (arr != null && arr.length > 0) { ... }
\`\`\`

## אופרטורי השוואה

| אופרטור | משמעות |
|----------|--------|
| \`==\` | שווה |
| \`!=\` | לא שווה |
| \`>\`, \`<\` | גדול/קטן |
| \`>=\`, \`<=\` | גדול-שווה/קטן-שווה |

**חשוב**: השוואת מחרוזות — \`str.equals("abc")\` ולא \`str == "abc"\`!
`,
          description: "Boolean expressions with &&, ||, and !",
          questions: [
            {
              slug: "voting-eligibility",
              type: "FULL_PROGRAM",
              title: "Voting Eligibility",
              prompt: "Read an integer age and a string citizenship (\"yes\" or \"no\") from input, each on a separate line. A person can vote if they are 18 or older AND are a citizen. Print \"Eligible\" or \"Not eligible\".",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read age and citizenship status
        // Print eligibility

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age = sc.nextInt();
        String citizen = sc.next();
        if (age >= 18 && citizen.equals("yes")) {
            System.out.println("Eligible");
        } else {
            System.out.println("Not eligible");
        }
    }
}`,
              tests: [
                { input: "20\nyes", expectedOutput: "Eligible", isHidden: false, description: "Eligible voter" },
                { input: "16\nyes", expectedOutput: "Not eligible", isHidden: false, description: "Too young" },
                { input: "25\nno", expectedOutput: "Not eligible", isHidden: true, description: "Not a citizen" }
              ],
              hints: [
                "Use && to combine both conditions: age and citizenship",
                "Compare strings with .equals(), not ==",
                "Both conditions must be true for eligibility"
              ],
              tags: ["logical-operators", "and", "boolean", "conditionals"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "number-range-check",
              type: "FULL_PROGRAM",
              title: "Number Range Check",
              prompt: "Read an integer n from input. Check if n is within at least one of these ranges:\n- 1 to 10 (inclusive)\n- 20 to 30 (inclusive)\n- 50 to 60 (inclusive)\n\nPrint \"In range\" if n falls in any of these ranges, otherwise print \"Out of range\".",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n and check if it's in any of the three ranges

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        boolean inRange = (n >= 1 && n <= 10) || (n >= 20 && n <= 30) || (n >= 50 && n <= 60);
        if (inRange) {
            System.out.println("In range");
        } else {
            System.out.println("Out of range");
        }
    }
}`,
              tests: [
                { input: "5", expectedOutput: "In range", isHidden: false, description: "In first range" },
                { input: "25", expectedOutput: "In range", isHidden: false, description: "In second range" },
                { input: "15", expectedOutput: "Out of range", isHidden: true, description: "Between ranges" },
                { input: "55", expectedOutput: "In range", isHidden: true, description: "In third range" }
              ],
              hints: [
                "Each range check needs both a lower and upper bound connected with &&",
                "Connect the three range checks with || (or)",
                "Use parentheses to group each range check: (n >= 1 && n <= 10)"
              ],
              tags: ["logical-operators", "or", "and", "ranges"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "complex-boolean-logic",
              type: "PREDICT_OUTPUT",
              title: "Boolean Expression Prediction",
              prompt: "What does the following program print?\n\n```java\npublic class Solution {\n    public static void main(String[] args) {\n        int x = 5, y = 10, z = 3;\n        boolean a = (x > 3) && (y < 15);\n        boolean b = !(z == 3);\n        boolean c = a || b;\n        boolean d = a && !b;\n        System.out.println(a);\n        System.out.println(b);\n        System.out.println(c);\n        System.out.println(d);\n    }\n}\n```\n\nType the exact output (4 lines of true/false).",
              starterCode: `// Predict the output of the program above.
// Type your answer below (4 lines):
`,
              solutionCode: `true
false
true
true`,
              tests: [
                { input: "", expectedOutput: "true\nfalse\ntrue\ntrue", isHidden: false, description: "Full output" }
              ],
              hints: [
                "Evaluate a: (5 > 3) is true AND (10 < 15) is true, so a = true",
                "Evaluate b: (3 == 3) is true, so !(true) = false, b = false",
                "c = true || false = true; d = true && !false = true && true = true"
              ],
              tags: ["boolean", "logical-operators", "not", "predict-output"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        }
      ]
    },

    // ==================== Day 3: Loops ====================
    {
      weekNumber: 3,
      title: "Loops",
      description: "For loops, while loops, nested loops, and loop patterns",
      topics: [
        {
          slug: "basic-loops",
          title: "For & While Loops",
          introMarkdown: `## מה זה לולאות?

**לולאה (Loop)** מאפשרת להריץ קטע קוד שוב ושוב, כל עוד תנאי מסוים מתקיים.

## לולאת for

משתמשים כשיודעים **כמה פעמים** לרוץ:

\`\`\`java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}
// i מתחיל מ-0, רץ כל עוד i < n, עולה ב-1
\`\`\`

## לולאת while

משתמשים כש**לא יודעים מראש** כמה פעמים:

\`\`\`java
while (num > 0) {
    int digit = num % 10;  // הספרה האחרונה
    num /= 10;             // הסרת הספרה האחרונה
}
\`\`\`

## do-while

רצה **לפחות פעם אחת**:

\`\`\`java
do {
    input = sc.nextInt();
} while (input < 0);  // חוזר כל עוד הקלט שלילי
\`\`\`

## מושגים חשובים

- **מונה (counter)**: משתנה שסופר איטרציות — \`i++\`
- **צובר (accumulator)**: משתנה שצובר תוצאה — \`sum += x\`
- **לולאה אינסופית**: כשהתנאי תמיד true — \`while(true)\`
- **break**: יוצא מהלולאה מיד
- **continue**: מדלג לאיטרציה הבאה
`,
          description: "Basic loop structures: for, while, and do-while",
          questions: [
            {
              slug: "sum-of-n-numbers",
              type: "FULL_PROGRAM",
              title: "Sum of N Numbers",
              prompt: "Read an integer n from input. Print the sum of all integers from 1 to n (inclusive).\n\nExample: if n = 5, the sum is 1+2+3+4+5 = 15.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n and compute the sum from 1 to n

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += i;
        }
        System.out.println(sum);
    }
}`,
              tests: [
                { input: "5", expectedOutput: "15", isHidden: false, description: "Sum 1 to 5" },
                { input: "10", expectedOutput: "55", isHidden: false, description: "Sum 1 to 10" },
                { input: "1", expectedOutput: "1", isHidden: true, description: "Single number" },
                { input: "100", expectedOutput: "5050", isHidden: true, description: "Large sum" }
              ],
              hints: [
                "Initialize a sum variable to 0 before the loop",
                "Use a for loop from 1 to n (inclusive): for (int i = 1; i <= n; i++)",
                "Add each i to sum inside the loop, then print sum after the loop"
              ],
              tags: ["for-loop", "sum", "accumulator"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "factorial",
              type: "FULL_PROGRAM",
              title: "Factorial Calculator",
              prompt: "Read a non-negative integer n from input. Print n! (n factorial).\n\nRecall: 0! = 1, 1! = 1, and n! = 1 * 2 * 3 * ... * n for n >= 2.",
              constraints: "0 <= n <= 12 (result fits in an int).",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n and compute n!

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        System.out.println(fact);
    }
}`,
              tests: [
                { input: "5", expectedOutput: "120", isHidden: false, description: "5! = 120" },
                { input: "0", expectedOutput: "1", isHidden: false, description: "0! = 1" },
                { input: "1", expectedOutput: "1", isHidden: true, description: "1! = 1" },
                { input: "10", expectedOutput: "3628800", isHidden: true, description: "10!" }
              ],
              hints: [
                "Start with fact = 1 (this handles the 0! case automatically)",
                "Multiply fact by each number from 1 to n",
                "If n is 0, the loop body never runs, so fact stays 1"
              ],
              tags: ["for-loop", "factorial", "multiplication"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "count-digits",
              type: "FULL_PROGRAM",
              title: "Count Digits",
              prompt: "Read a positive integer from input. Using a while loop, count and print the number of digits in it.\n\nExample: 12345 has 5 digits.",
              constraints: "Input will be a positive integer (>= 1).",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read a positive integer and count its digits using a while loop

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int count = 0;
        while (n > 0) {
            n /= 10;
            count++;
        }
        System.out.println(count);
    }
}`,
              tests: [
                { input: "12345", expectedOutput: "5", isHidden: false, description: "Five digits" },
                { input: "7", expectedOutput: "1", isHidden: false, description: "Single digit" },
                { input: "100", expectedOutput: "3", isHidden: true, description: "Three digits with zeros" },
                { input: "999999", expectedOutput: "6", isHidden: true, description: "Six digits" }
              ],
              hints: [
                "Repeatedly divide the number by 10 until it becomes 0",
                "Each division removes one digit; count each division",
                "Use while (n > 0) and n /= 10 with a counter"
              ],
              tags: ["while-loop", "digits", "division"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "reverse-number",
              type: "FULL_PROGRAM",
              title: "Reverse a Number",
              prompt: "Read a positive integer from input. Print the number with its digits reversed.\n\nExample: input 1234 should output 4321.\nExample: input 1200 should output 21 (leading zeros are dropped).",
              constraints: "Input is a positive integer.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read a number and print it reversed

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int reversed = 0;
        while (n > 0) {
            reversed = reversed * 10 + n % 10;
            n /= 10;
        }
        System.out.println(reversed);
    }
}`,
              tests: [
                { input: "1234", expectedOutput: "4321", isHidden: false, description: "Basic reversal" },
                { input: "1200", expectedOutput: "21", isHidden: false, description: "Trailing zeros become leading" },
                { input: "5", expectedOutput: "5", isHidden: true, description: "Single digit" },
                { input: "10001", expectedOutput: "10001", isHidden: true, description: "Palindrome number" }
              ],
              hints: [
                "Extract the last digit using n % 10",
                "Build the reversed number: reversed = reversed * 10 + lastDigit",
                "Remove the last digit from n using n /= 10; repeat while n > 0"
              ],
              tags: ["while-loop", "modulo", "reverse", "digits"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        },
        {
          slug: "nested-loops",
          title: "Nested Loops & Patterns",
          introMarkdown: `## מה זה לולאות מקוננות?

**לולאה מקוננת (Nested Loop)** — לולאה בתוך לולאה. הלולאה הפנימית רצה **מההתחלה** בכל איטרציה של החיצונית.

## המבנה

\`\`\`java
for (int i = 0; i < rows; i++) {       // לולאה חיצונית — שורות
    for (int j = 0; j < cols; j++) {    // לולאה פנימית — עמודות
        System.out.print("* ");
    }
    System.out.println();               // ירידת שורה
}
\`\`\`

## דפוסים נפוצים במבחן

**משולש ימני:**
\`\`\`
*
* *
* * *
\`\`\`
הלולאה הפנימית רצה \`i+1\` פעמים.

**פירמידה:**
\`\`\`
  *
 ***
*****
\`\`\`
שתי לולאות פנימיות: אחת לרווחים, אחת לכוכביות.

## טיפ למבחן

חשבו על כל שורה בנפרד:
1. כמה **רווחים** צריך?
2. כמה **תווים** צריך?
3. מה הקשר בין מספר השורה (\`i\`) לכמויות האלה?
`,
          description: "Nested loop iterations and printing patterns",
          questions: [
            {
              slug: "right-triangle-stars",
              type: "FULL_PROGRAM",
              title: "Right Triangle of Stars",
              prompt: "Read an integer n from input. Print a right triangle of asterisks (*) with n rows. Row i (1-indexed) should have i asterisks.\n\nExample for n = 4:\n*\n**\n***\n****",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n and print a right triangle of stars

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
              tests: [
                { input: "4", expectedOutput: "*\n**\n***\n****", isHidden: false, description: "4 rows" },
                { input: "1", expectedOutput: "*", isHidden: false, description: "Single row" },
                { input: "3", expectedOutput: "*\n**\n***", isHidden: true, description: "3 rows" }
              ],
              hints: [
                "Use two nested loops: outer for rows, inner for columns",
                "The inner loop runs i times for row number i",
                "Use System.out.print(\"*\") inside the inner loop and System.out.println() after it"
              ],
              tags: ["nested-loops", "patterns", "stars"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "number-pyramid",
              type: "FULL_PROGRAM",
              title: "Number Pyramid",
              prompt: "Read an integer n from input. Print a number pyramid where row i contains the number i repeated i times, with values separated by spaces.\n\nExample for n = 4:\n1\n2 2\n3 3 3\n4 4 4 4",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n and print a number pyramid

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (j > 0) {
                    System.out.print(" ");
                }
                System.out.print(i);
            }
            System.out.println();
        }
    }
}`,
              tests: [
                { input: "4", expectedOutput: "1\n2 2\n3 3 3\n4 4 4 4", isHidden: false, description: "4-row pyramid" },
                { input: "1", expectedOutput: "1", isHidden: false, description: "Single row" },
                { input: "5", expectedOutput: "1\n2 2\n3 3 3\n4 4 4 4\n5 5 5 5 5", isHidden: true, description: "5-row pyramid" }
              ],
              hints: [
                "Outer loop controls the row number (1 to n)",
                "Inner loop prints the row number i exactly i times",
                "Print a space before each number except the first one in each row"
              ],
              tags: ["nested-loops", "patterns", "numbers"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "multiplication-table",
              type: "FULL_PROGRAM",
              title: "Multiplication Table",
              prompt: "Read an integer n from input. Print an n x n multiplication table. Each row should have values separated by tabs (\\t).\n\nExample for n = 3:\n1\t2\t3\n2\t4\t6\n3\t6\t9",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n and print an n x n multiplication table

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (j > 1) {
                    System.out.print("\t");
                }
                System.out.print(i * j);
            }
            System.out.println();
        }
    }
}`,
              tests: [
                { input: "3", expectedOutput: "1\t2\t3\n2\t4\t6\n3\t6\t9", isHidden: false, description: "3x3 table" },
                { input: "1", expectedOutput: "1", isHidden: false, description: "1x1 table" },
                { input: "4", expectedOutput: "1\t2\t3\t4\n2\t4\t6\t8\n3\t6\t9\t12\n4\t8\t12\t16", isHidden: true, description: "4x4 table" }
              ],
              hints: [
                "Use two nested loops: i for rows (1 to n), j for columns (1 to n)",
                "Each cell value is i * j",
                "Use \\t (tab character) to separate values in a row"
              ],
              tags: ["nested-loops", "multiplication-table", "formatting"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "diamond-pattern",
              type: "FULL_PROGRAM",
              title: "Diamond Pattern",
              prompt: "Read an odd integer n from input. Print a diamond pattern of asterisks (*) with the widest row having n stars. Use spaces for alignment.\n\nExample for n = 5:\n  *\n ***\n*****\n ***\n  *",
              constraints: "n will always be a positive odd integer.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n (odd) and print a diamond pattern

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int mid = n / 2;
        for (int i = 0; i < n; i++) {
            int stars;
            int spaces;
            if (i <= mid) {
                stars = 2 * i + 1;
                spaces = mid - i;
            } else {
                stars = 2 * (n - 1 - i) + 1;
                spaces = i - mid;
            }
            for (int s = 0; s < spaces; s++) {
                System.out.print(" ");
            }
            for (int s = 0; s < stars; s++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
              tests: [
                { input: "5", expectedOutput: "  *\n ***\n*****\n ***\n  *", isHidden: false, description: "5-wide diamond" },
                { input: "3", expectedOutput: " *\n***\n *", isHidden: false, description: "3-wide diamond" },
                { input: "1", expectedOutput: "*", isHidden: true, description: "Single star" },
                { input: "7", expectedOutput: "   *\n  ***\n *****\n*******\n *****\n  ***\n   *", isHidden: true, description: "7-wide diamond" }
              ],
              hints: [
                "Split the diamond into upper half (including middle) and lower half",
                "For row i, calculate the number of leading spaces and the number of stars",
                "Upper half: spaces decrease and stars increase; lower half: the reverse"
              ],
              tags: ["nested-loops", "patterns", "diamond", "spaces"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            }
          ]
        }
      ]
    },

    // ==================== Day 4: Arrays ====================
    {
      weekNumber: 4,
      title: "Arrays",
      description: "One-dimensional and two-dimensional arrays",
      topics: [
        {
          slug: "arrays-1d",
          title: "1D Arrays",
          introMarkdown: `## מה זה מערך?

**מערך (Array)** הוא מבנה נתונים שמאחסן רצף של ערכים מאותו טיפוס. הגישה לכל איבר היא דרך **אינדקס** (מתחיל מ-0).

## הצהרה ואתחול

\`\`\`java
int[] arr = new int[5];           // מערך של 5 אפסים
int[] nums = {1, 2, 3, 4, 5};    // אתחול עם ערכים
\`\`\`

## פעולות בסיסיות

\`\`\`java
arr[0] = 10;                      // השמה באינדקס 0
int x = arr[0];                   // קריאה מאינדקס 0
int len = arr.length;             // אורך המערך (בלי סוגריים!)
\`\`\`

## דפוסים נפוצים

**סריקה:**
\`\`\`java
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
\`\`\`

**מציאת מקסימום:**
\`\`\`java
int max = arr[0];
for (int i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
}
\`\`\`

## מלכודות נפוצות

- **ArrayIndexOutOfBoundsException**: גישה לאינדקס שלא קיים (למשל \`arr[5]\` במערך באורך 5)
- האינדקס האחרון הוא \`arr.length - 1\`, לא \`arr.length\`!
- \`length\` הוא **שדה**, לא מתודה — בלי \`()\`
`,
          description: "One-dimensional array operations, searching, and manipulation",
          questions: [
            {
              slug: "array-sum-average",
              type: "FULL_PROGRAM",
              title: "Array Sum & Average",
              prompt: "Read an integer n, then read n integers into an array. Print the sum on the first line and the average on the second line. The average should be formatted to exactly 2 decimal places.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n, then n integers
        // Print sum and average (2 decimal places)

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
            sum += arr[i];
        }
        System.out.println(sum);
        System.out.printf("%.2f%n", (double) sum / n);
    }
}`,
              tests: [
                { input: "4\n10 20 30 40", expectedOutput: "100\n25.00", isHidden: false, description: "Even average" },
                { input: "3\n1 2 3", expectedOutput: "6\n2.00", isHidden: false, description: "Small array" },
                { input: "5\n7 3 8 1 6", expectedOutput: "25\n5.00", isHidden: true, description: "Five elements" },
                { input: "2\n1 2", expectedOutput: "3\n1.50", isHidden: true, description: "Decimal average" }
              ],
              hints: [
                "Read n first, then create an array of size n",
                "Accumulate the sum while reading the elements",
                "Cast sum to double before dividing by n for the average"
              ],
              tags: ["arrays", "sum", "average", "1d-array"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "find-max-min",
              type: "FULL_PROGRAM",
              title: "Find Maximum & Minimum",
              prompt: "Read an integer n, then read n integers. Print the maximum value on the first line and the minimum value on the second line.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n numbers and find the max and min

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int max = arr[0];
        int min = arr[0];
        for (int i = 1; i < n; i++) {
            if (arr[i] > max) max = arr[i];
            if (arr[i] < min) min = arr[i];
        }
        System.out.println(max);
        System.out.println(min);
    }
}`,
              tests: [
                { input: "5\n3 7 1 9 4", expectedOutput: "9\n1", isHidden: false, description: "Mixed values" },
                { input: "3\n5 5 5", expectedOutput: "5\n5", isHidden: false, description: "All equal" },
                { input: "4\n-2 -8 -1 -5", expectedOutput: "-1\n-8", isHidden: true, description: "Negative numbers" },
                { input: "1\n42", expectedOutput: "42\n42", isHidden: true, description: "Single element" }
              ],
              hints: [
                "Initialize max and min to the first element of the array",
                "Loop through the remaining elements comparing each to max and min",
                "Update max when you find a larger value, min when you find a smaller value"
              ],
              tags: ["arrays", "max", "min", "1d-array"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "linear-search",
              type: "FULL_PROGRAM",
              title: "Linear Search",
              prompt: "Read an integer n, then read n integers into an array. Then read a target integer. Print the index (0-based) of the first occurrence of the target in the array. If the target is not found, print -1.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n integers, then a target
        // Print the index of the target or -1

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        int index = -1;
        for (int i = 0; i < n; i++) {
            if (arr[i] == target) {
                index = i;
                break;
            }
        }
        System.out.println(index);
    }
}`,
              tests: [
                { input: "5\n10 20 30 40 50\n30", expectedOutput: "2", isHidden: false, description: "Found in middle" },
                { input: "4\n1 2 3 4\n5", expectedOutput: "-1", isHidden: false, description: "Not found" },
                { input: "5\n5 3 5 3 5\n5", expectedOutput: "0", isHidden: true, description: "First occurrence" },
                { input: "3\n7 8 9\n9", expectedOutput: "2", isHidden: true, description: "Found at end" }
              ],
              hints: [
                "Initialize index to -1 (not found by default)",
                "Loop through the array comparing each element to the target",
                "When found, save the index and break out of the loop"
              ],
              tags: ["arrays", "linear-search", "search"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "reverse-array",
              type: "FULL_PROGRAM",
              title: "Reverse Array",
              prompt: "Read an integer n, then read n integers into an array. Reverse the array in place and print all elements separated by spaces on a single line.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n integers, reverse the array, and print

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        for (int i = 0; i < n / 2; i++) {
            int temp = arr[i];
            arr[i] = arr[n - 1 - i];
            arr[n - 1 - i] = temp;
        }
        for (int i = 0; i < n; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(arr[i]);
        }
        System.out.println();
    }
}`,
              tests: [
                { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1", isHidden: false, description: "Odd-length reverse" },
                { input: "4\n10 20 30 40", expectedOutput: "40 30 20 10", isHidden: false, description: "Even-length reverse" },
                { input: "1\n7", expectedOutput: "7", isHidden: true, description: "Single element" },
                { input: "6\n1 1 2 2 3 3", expectedOutput: "3 3 2 2 1 1", isHidden: true, description: "Duplicates" }
              ],
              hints: [
                "Swap elements from the front and back moving toward the center",
                "Loop i from 0 to n/2, swapping arr[i] with arr[n-1-i]",
                "Use a temp variable for swapping"
              ],
              tags: ["arrays", "reverse", "swap", "in-place"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "count-occurrences",
              type: "FUNCTION",
              title: "Count Occurrences",
              prompt: "Write a method `countOccurrences` that takes an array of integers and a target value, and returns the number of times the target appears in the array.\n\nThe main method reads input: first n, then n integers, then the target. It calls your method and prints the count.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static int countOccurrences(int[] arr, int target) {
        // Return the number of times target appears in arr

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        System.out.println(countOccurrences(arr, target));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static int countOccurrences(int[] arr, int target) {
        int count = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int target = sc.nextInt();
        System.out.println(countOccurrences(arr, target));
    }
}`,
              tests: [
                { input: "6\n1 2 3 2 4 2\n2", expectedOutput: "3", isHidden: false, description: "Multiple occurrences" },
                { input: "4\n5 5 5 5\n5", expectedOutput: "4", isHidden: false, description: "All same" },
                { input: "3\n1 2 3\n4", expectedOutput: "0", isHidden: true, description: "Not found" },
                { input: "5\n7 3 7 3 7\n7", expectedOutput: "3", isHidden: true, description: "Alternating" }
              ],
              hints: [
                "Initialize a counter to 0",
                "Loop through the array and increment the counter each time arr[i] equals the target",
                "Return the final count"
              ],
              tags: ["arrays", "counting", "function", "search"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        },
        {
          slug: "arrays-2d",
          title: "2D Arrays",
          introMarkdown: `## מה זה מערך דו-ממדי?

**מערך דו-ממדי** הוא מערך של מערכים — בעצם טבלה (מטריצה) עם שורות ועמודות.

## הצהרה ואתחול

\`\`\`java
int[][] matrix = new int[3][4];  // 3 שורות, 4 עמודות
int[][] m = {
    {1, 2, 3},
    {4, 5, 6}
};  // 2 שורות, 3 עמודות
\`\`\`

## גישה לאיברים

\`\`\`java
matrix[0][0] = 10;              // שורה 0, עמודה 0
int rows = matrix.length;       // מספר שורות
int cols = matrix[0].length;    // מספר עמודות
\`\`\`

## סריקת מטריצה

\`\`\`java
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}
\`\`\`

## דפוסים נפוצים במבחן

- **סכום שורה**: לולאה על \`j\` כש-\`i\` קבוע
- **סכום עמודה**: לולאה על \`i\` כש-\`j\` קבוע
- **אלכסון ראשי**: \`matrix[i][i]\` (כש-\`i == j\`)
- **אלכסון משני**: \`matrix[i][n-1-i]\`
- **טרנספוז**: החלפת שורות ועמודות — \`result[j][i] = matrix[i][j]\`
`,
          description: "Two-dimensional arrays, matrices, and row/column operations",
          questions: [
            {
              slug: "matrix-input-output",
              type: "FULL_PROGRAM",
              title: "Matrix Input & Output",
              prompt: "Read two integers rows and cols, then read a rows x cols matrix of integers. Print the matrix in the same format: each row on its own line with values separated by spaces.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read rows, cols, then the matrix
        // Print the matrix

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rows = sc.nextInt();
        int cols = sc.nextInt();
        int[][] matrix = new int[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                matrix[i][j] = sc.nextInt();
            }
        }
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (j > 0) System.out.print(" ");
                System.out.print(matrix[i][j]);
            }
            System.out.println();
        }
    }
}`,
              tests: [
                { input: "2 3\n1 2 3\n4 5 6", expectedOutput: "1 2 3\n4 5 6", isHidden: false, description: "2x3 matrix" },
                { input: "3 3\n1 0 0\n0 1 0\n0 0 1", expectedOutput: "1 0 0\n0 1 0\n0 0 1", isHidden: false, description: "Identity matrix" },
                { input: "1 4\n10 20 30 40", expectedOutput: "10 20 30 40", isHidden: true, description: "Single row" }
              ],
              hints: [
                "Create a 2D array with new int[rows][cols]",
                "Use nested loops to read values into the matrix",
                "Use nested loops again to print, adding spaces between values in each row"
              ],
              tags: ["2d-array", "matrix", "input-output"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "row-sums",
              type: "FULL_PROGRAM",
              title: "Row Sums",
              prompt: "Read two integers rows and cols, then read a rows x cols matrix of integers. For each row, print the sum of its elements. Print one sum per line.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read the matrix and print each row's sum

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rows = sc.nextInt();
        int cols = sc.nextInt();
        int[][] matrix = new int[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                matrix[i][j] = sc.nextInt();
            }
        }
        for (int i = 0; i < rows; i++) {
            int sum = 0;
            for (int j = 0; j < cols; j++) {
                sum += matrix[i][j];
            }
            System.out.println(sum);
        }
    }
}`,
              tests: [
                { input: "2 3\n1 2 3\n4 5 6", expectedOutput: "6\n15", isHidden: false, description: "2x3 matrix row sums" },
                { input: "3 2\n10 20\n30 40\n50 60", expectedOutput: "30\n70\n110", isHidden: false, description: "3x2 matrix" },
                { input: "1 5\n1 1 1 1 1", expectedOutput: "5", isHidden: true, description: "Single row" }
              ],
              hints: [
                "After reading the matrix, loop through each row",
                "For each row, use an inner loop to sum all column values",
                "Print the sum after finishing each row's inner loop"
              ],
              tags: ["2d-array", "matrix", "row-sum"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "matrix-diagonal-sum",
              type: "FULL_PROGRAM",
              title: "Matrix Diagonal Sum",
              prompt: "Read an integer n, then read an n x n square matrix. Print the sum of the elements on the main diagonal (top-left to bottom-right) on the first line, and the sum of the anti-diagonal (top-right to bottom-left) on the second line.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read an n x n matrix
        // Print the main diagonal sum and the anti-diagonal sum

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                matrix[i][j] = sc.nextInt();
            }
        }
        int mainDiag = 0;
        int antiDiag = 0;
        for (int i = 0; i < n; i++) {
            mainDiag += matrix[i][i];
            antiDiag += matrix[i][n - 1 - i];
        }
        System.out.println(mainDiag);
        System.out.println(antiDiag);
    }
}`,
              tests: [
                { input: "3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "15\n15", isHidden: false, description: "3x3 matrix" },
                { input: "2\n1 2\n3 4", expectedOutput: "5\n5", isHidden: false, description: "2x2 matrix" },
                { input: "4\n1 0 0 2\n0 3 4 0\n0 5 6 0\n7 0 0 8", expectedOutput: "18\n18", isHidden: true, description: "4x4 matrix" },
                { input: "1\n5", expectedOutput: "5\n5", isHidden: true, description: "1x1 matrix" }
              ],
              hints: [
                "Main diagonal elements are at positions [i][i]",
                "Anti-diagonal elements are at positions [i][n-1-i]",
                "A single loop from 0 to n-1 can sum both diagonals"
              ],
              tags: ["2d-array", "matrix", "diagonal"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "matrix-transpose",
              type: "FULL_PROGRAM",
              title: "Matrix Transpose",
              prompt: "Read two integers rows and cols, then read a rows x cols matrix. Print the transpose of the matrix (cols x rows), where rows become columns and columns become rows. Values in each output row should be separated by spaces.",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read a matrix and print its transpose

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int rows = sc.nextInt();
        int cols = sc.nextInt();
        int[][] matrix = new int[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                matrix[i][j] = sc.nextInt();
            }
        }
        for (int j = 0; j < cols; j++) {
            for (int i = 0; i < rows; i++) {
                if (i > 0) System.out.print(" ");
                System.out.print(matrix[i][j]);
            }
            System.out.println();
        }
    }
}`,
              tests: [
                { input: "2 3\n1 2 3\n4 5 6", expectedOutput: "1 4\n2 5\n3 6", isHidden: false, description: "2x3 transpose to 3x2" },
                { input: "3 3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "1 4 7\n2 5 8\n3 6 9", isHidden: false, description: "3x3 transpose" },
                { input: "1 3\n10 20 30", expectedOutput: "10\n20\n30", isHidden: true, description: "Row to column" },
                { input: "3 1\n1\n2\n3", expectedOutput: "1 2 3", isHidden: true, description: "Column to row" }
              ],
              hints: [
                "The transpose swaps rows and columns: element [i][j] becomes [j][i]",
                "The output has cols rows and rows columns",
                "Outer loop iterates over columns (j), inner loop iterates over rows (i), printing matrix[i][j]"
              ],
              tags: ["2d-array", "matrix", "transpose"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        }
      ]
    },

    // ==================== Day 5: Functions & Methods ====================
    {
      weekNumber: 5,
      title: "Functions & Methods",
      description: "Method declarations, parameters, return values, and scope",
      topics: [
        {
          slug: "method-basics",
          title: "Method Declarations",
          introMarkdown: `## מה זה מתודה (Method)?

**מתודה** היא בלוק קוד עם שם שמבצע משימה מוגדרת. מתודות מאפשרות **שימוש חוזר** בקוד ו**ארגון** טוב יותר.

## מבנה מתודה

\`\`\`java
public static void printHello(String name) {
//  ↑      ↑     ↑        ↑           ↑
// access static return  name    parameter
//                type
    System.out.println("Hello " + name);
}
\`\`\`

## מתודה עם ערך חזרה vs בלי

\`\`\`java
// void — לא מחזירה ערך
public static void greet(String name) {
    System.out.println("Hi " + name);
}

// int — מחזירה מספר שלם
public static int add(int a, int b) {
    return a + b;
}
\`\`\`

## קריאה למתודה

\`\`\`java
greet("Alice");           // קריאה למתודת void
int sum = add(3, 5);      // קריאה עם ערך חזרה
\`\`\`

## מושגים מרכזיים

- **פרמטרים (Parameters)**: המשתנים בהגדרת המתודה
- **ארגומנטים (Arguments)**: הערכים שמעבירים בקריאה
- **return**: מחזיר ערך ויוצא מהמתודה מיד
- **void**: המתודה לא מחזירה ערך
- **static**: שייכת למחלקה, לא לאובייקט ספציפי
`,
          description: "Void methods, parameters, and method calls",
          questions: [
            {
              slug: "print-greeting-method",
              type: "FUNCTION",
              title: "Print Greeting Method",
              prompt: "Write a void method `printGreeting` that takes a String name and an int times, and prints \"Hello, <name>!\" exactly `times` times, each on a separate line.\n\nThe main method reads the name and times from input and calls your method.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static void printGreeting(String name, int times) {
        // Print the greeting 'times' times

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int times = sc.nextInt();
        printGreeting(name, times);
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static void printGreeting(String name, int times) {
        for (int i = 0; i < times; i++) {
            System.out.println("Hello, " + name + "!");
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int times = sc.nextInt();
        printGreeting(name, times);
    }
}`,
              tests: [
                { input: "Alice 3", expectedOutput: "Hello, Alice!\nHello, Alice!\nHello, Alice!", isHidden: false, description: "Three greetings" },
                { input: "Bob 1", expectedOutput: "Hello, Bob!", isHidden: false, description: "Single greeting" },
                { input: "World 2", expectedOutput: "Hello, World!\nHello, World!", isHidden: true, description: "Two greetings" }
              ],
              hints: [
                "Use a for loop that runs 'times' iterations",
                "Inside the loop, use System.out.println() with string concatenation",
                "The method is void so it doesn't return anything; it just prints"
              ],
              tags: ["methods", "void", "parameters", "loops"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "print-separator-line",
              type: "FUNCTION",
              title: "Print Separator Line",
              prompt: "Write a void method `printSeparator` that takes a char symbol and an int length, and prints the symbol repeated `length` times on a single line followed by a newline.\n\nThe main method reads a character and a length from input. It calls your method to print the separator, then prints the word \"SECTION\", then calls your method again to print another separator.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static void printSeparator(char symbol, int length) {
        // Print the symbol repeated 'length' times, then a newline

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char symbol = sc.next().charAt(0);
        int length = sc.nextInt();
        printSeparator(symbol, length);
        System.out.println("SECTION");
        printSeparator(symbol, length);
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static void printSeparator(char symbol, int length) {
        for (int i = 0; i < length; i++) {
            System.out.print(symbol);
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char symbol = sc.next().charAt(0);
        int length = sc.nextInt();
        printSeparator(symbol, length);
        System.out.println("SECTION");
        printSeparator(symbol, length);
    }
}`,
              tests: [
                { input: "- 10", expectedOutput: "----------\nSECTION\n----------", isHidden: false, description: "Dashes separator" },
                { input: "= 5", expectedOutput: "=====\nSECTION\n=====", isHidden: false, description: "Equals separator" },
                { input: "* 3", expectedOutput: "***\nSECTION\n***", isHidden: true, description: "Stars separator" }
              ],
              hints: [
                "Use a for loop to print the symbol 'length' times using System.out.print()",
                "After the loop, call System.out.println() to end the line",
                "The method will be reused multiple times; that is the power of methods"
              ],
              tags: ["methods", "void", "char", "reusability"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "print-array-stats",
              type: "FUNCTION",
              title: "Array Stats Printer",
              prompt: "Write two void methods:\n1. `printArray(int[] arr)` - prints all elements of the array separated by spaces on one line\n2. `printStats(int[] arr)` - prints three lines:\n   - \"Min: <minimum value>\"\n   - \"Max: <maximum value>\"\n   - \"Sum: <sum of all elements>\"\n\nThe main method reads n integers and calls both methods.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static void printArray(int[] arr) {
        // Print array elements separated by spaces

    }

    public static void printStats(int[] arr) {
        // Print Min, Max, and Sum on separate lines

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        printArray(arr);
        printStats(arr);
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(arr[i]);
        }
        System.out.println();
    }

    public static void printStats(int[] arr) {
        int min = arr[0];
        int max = arr[0];
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] < min) min = arr[i];
            if (arr[i] > max) max = arr[i];
            sum += arr[i];
        }
        System.out.println("Min: " + min);
        System.out.println("Max: " + max);
        System.out.println("Sum: " + sum);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        printArray(arr);
        printStats(arr);
    }
}`,
              tests: [
                { input: "5\n3 1 4 1 5", expectedOutput: "3 1 4 1 5\nMin: 1\nMax: 5\nSum: 14", isHidden: false, description: "Mixed values" },
                { input: "3\n10 20 30", expectedOutput: "10 20 30\nMin: 10\nMax: 30\nSum: 60", isHidden: false, description: "Ascending values" },
                { input: "4\n-5 -1 -8 -3", expectedOutput: "-5 -1 -8 -3\nMin: -8\nMax: -1\nSum: -17", isHidden: true, description: "Negative values" }
              ],
              hints: [
                "For printArray, loop through and use print with spaces, then println at the end",
                "For printStats, initialize min and max to arr[0] and sum to 0",
                "Use arr.length to get the array size inside the methods"
              ],
              tags: ["methods", "void", "arrays", "multiple-methods"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "validate-and-print",
              type: "FULL_PROGRAM",
              title: "Input Validation with Methods",
              prompt: "Write a program that reads integers from input until a valid score (0-100) is entered. Use a method `boolean isValidScore(int score)` that returns true if the score is between 0 and 100 inclusive.\n\nThe first line contains the number of attempts n. The next line contains n integers. Print \"Invalid\" for each invalid score and \"Valid: <score>\" for the first valid score, then stop processing.\n\nIf no valid score is found, print \"No valid score\".",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static boolean isValidScore(int score) {
        // Return true if score is between 0 and 100 inclusive

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n attempts and validate each score

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static boolean isValidScore(int score) {
        return score >= 0 && score <= 100;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        boolean found = false;
        for (int i = 0; i < n; i++) {
            int score = sc.nextInt();
            if (isValidScore(score)) {
                System.out.println("Valid: " + score);
                found = true;
                break;
            } else {
                System.out.println("Invalid");
            }
        }
        if (!found) {
            System.out.println("No valid score");
        }
    }
}`,
              tests: [
                { input: "4\n-5 200 75 80", expectedOutput: "Invalid\nInvalid\nValid: 75", isHidden: false, description: "Valid found on third try" },
                { input: "2\n-1 101", expectedOutput: "Invalid\nInvalid\nNo valid score", isHidden: false, description: "No valid score" },
                { input: "1\n50", expectedOutput: "Valid: 50", isHidden: true, description: "First attempt valid" },
                { input: "3\n150 -10 0", expectedOutput: "Invalid\nInvalid\nValid: 0", isHidden: true, description: "Boundary value 0" }
              ],
              hints: [
                "isValidScore should check if score >= 0 && score <= 100",
                "In main, loop through the inputs calling isValidScore on each",
                "Use break to stop processing after finding the first valid score"
              ],
              tags: ["methods", "boolean-return", "validation", "loops"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        },
        {
          slug: "return-values-scope",
          title: "Return Values & Scope",
          introMarkdown: `## ערכי החזרה (Return Values)

מתודה שמחזירה ערך חייבת לציין את הטיפוס ולהשתמש ב-\`return\`:

\`\`\`java
public static boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}
\`\`\`

## Scope — תחום הכרה

**משתנה מוכר רק בבלוק שבו הוגדר:**

\`\`\`java
public static void example() {
    int x = 10;           // x מוכר בכל המתודה
    if (x > 5) {
        int y = 20;       // y מוכר רק בתוך ה-if
    }
    // System.out.println(y); ← שגיאה! y לא מוכר כאן
}
\`\`\`

## Method Overloading — העמסת מתודות

אותו שם, **פרמטרים שונים**:

\`\`\`java
public static int max(int a, int b) {
    return (a > b) ? a : b;
}

public static int max(int a, int b, int c) {
    return max(max(a, b), c);
}
\`\`\`

Java בוחרת את הגרסה המתאימה לפי **מספר וטיפוס הארגומנטים**.

## טיפ למבחן

- כל נתיב בקוד חייב להגיע ל-\`return\` (אם הטיפוס הוא לא void)
- מתודה עם \`return\` בתוך לולאה — לא שוכחים return גם אחרי הלולאה
- העברת מערך למתודה — המערך עובר **by reference** (שינויים משפיעים על המקור)
`,
          description: "Methods with return types, variable scope, and method overloading",
          questions: [
            {
              slug: "is-prime-method",
              type: "FUNCTION",
              title: "Is Prime Method",
              prompt: "Write a method `boolean isPrime(int n)` that returns true if n is a prime number and false otherwise. A prime number is greater than 1 and divisible only by 1 and itself.\n\nThe main method reads a single integer and prints \"Prime\" or \"Not prime\" using your method.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static boolean isPrime(int n) {
        // Return true if n is prime, false otherwise

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (isPrime(n)) {
            System.out.println("Prime");
        } else {
            System.out.println("Not prime");
        }
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (isPrime(n)) {
            System.out.println("Prime");
        } else {
            System.out.println("Not prime");
        }
    }
}`,
              tests: [
                { input: "7", expectedOutput: "Prime", isHidden: false, description: "7 is prime" },
                { input: "10", expectedOutput: "Not prime", isHidden: false, description: "10 is not prime" },
                { input: "1", expectedOutput: "Not prime", isHidden: true, description: "1 is not prime" },
                { input: "2", expectedOutput: "Prime", isHidden: true, description: "2 is prime" }
              ],
              hints: [
                "Numbers <= 1 are not prime",
                "Check divisibility from 2 up to the square root of n",
                "If any number divides n evenly (n % i == 0), it is not prime"
              ],
              tags: ["methods", "return", "boolean", "prime", "math"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "max-of-three-overloaded",
              type: "FUNCTION",
              title: "Overloaded Max Method",
              prompt: "Write two overloaded methods:\n1. `int maxOf(int a, int b)` - returns the larger of two integers\n2. `int maxOf(int a, int b, int c)` - returns the largest of three integers\n\nThe main method reads three integers and prints the max of the first two on line 1, and the max of all three on line 2.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static int maxOf(int a, int b) {
        // Return the larger of a and b

    }

    public static int maxOf(int a, int b, int c) {
        // Return the largest of a, b, and c

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(maxOf(a, b));
        System.out.println(maxOf(a, b, c));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static int maxOf(int a, int b) {
        if (a >= b) return a;
        return b;
    }

    public static int maxOf(int a, int b, int c) {
        return maxOf(maxOf(a, b), c);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(maxOf(a, b));
        System.out.println(maxOf(a, b, c));
    }
}`,
              tests: [
                { input: "3 7 5", expectedOutput: "7\n7", isHidden: false, description: "Max is the second value" },
                { input: "10 2 15", expectedOutput: "10\n15", isHidden: false, description: "Max is the third value" },
                { input: "5 5 5", expectedOutput: "5\n5", isHidden: true, description: "All equal" },
                { input: "-1 -5 -3", expectedOutput: "-1\n-1", isHidden: true, description: "Negative numbers" }
              ],
              hints: [
                "The two-parameter version can use a simple if-else or ternary operator",
                "The three-parameter version can call the two-parameter version: maxOf(maxOf(a,b), c)",
                "This is method overloading: same name, different parameter lists"
              ],
              tags: ["methods", "overloading", "return", "max"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "power-function",
              type: "FUNCTION",
              title: "Power Function",
              prompt: "Write a method `long power(int base, int exp)` that computes base raised to the power of exp using a loop (do not use Math.pow). The method should return the result as a long.\n\nThe main method reads base and exp from input and prints the result.",
              constraints: "exp >= 0. The result will fit in a long.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static long power(int base, int exp) {
        // Compute base^exp using a loop

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt();
        int exp = sc.nextInt();
        System.out.println(power(base, exp));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static long power(int base, int exp) {
        long result = 1;
        for (int i = 0; i < exp; i++) {
            result *= base;
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt();
        int exp = sc.nextInt();
        System.out.println(power(base, exp));
    }
}`,
              tests: [
                { input: "2 10", expectedOutput: "1024", isHidden: false, description: "2^10" },
                { input: "5 3", expectedOutput: "125", isHidden: false, description: "5^3" },
                { input: "7 0", expectedOutput: "1", isHidden: true, description: "Any number to the power 0" },
                { input: "3 7", expectedOutput: "2187", isHidden: true, description: "3^7" }
              ],
              hints: [
                "Start with result = 1 (this handles the exp=0 case)",
                "Multiply result by base in each iteration, exp times",
                "Use long for the result to avoid integer overflow for larger values"
              ],
              tags: ["methods", "return", "long", "power", "loops"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "gcd-method",
              type: "FUNCTION",
              title: "GCD with Euclidean Algorithm",
              prompt: "Write a method `int gcd(int a, int b)` that returns the greatest common divisor of two positive integers using the Euclidean algorithm.\n\nEuclidean algorithm: gcd(a, b) = gcd(b, a % b), with base case gcd(a, 0) = a.\n\nThe main method reads two integers and prints their GCD.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static int gcd(int a, int b) {
        // Implement the Euclidean algorithm

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(gcd(a, b));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(gcd(a, b));
    }
}`,
              tests: [
                { input: "12 8", expectedOutput: "4", isHidden: false, description: "GCD of 12 and 8" },
                { input: "17 5", expectedOutput: "1", isHidden: false, description: "Coprime numbers" },
                { input: "100 25", expectedOutput: "25", isHidden: true, description: "One divides the other" },
                { input: "48 36", expectedOutput: "12", isHidden: true, description: "GCD of 48 and 36" }
              ],
              hints: [
                "The Euclidean algorithm repeatedly replaces (a, b) with (b, a % b)",
                "The loop continues until b becomes 0; then a is the GCD",
                "Use a temp variable to swap values: temp = b, b = a % b, a = temp"
              ],
              tags: ["methods", "return", "gcd", "euclidean", "algorithm"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            }
          ]
        }
      ]
    },

    // ==================== Day 6: Recursion ====================
    {
      weekNumber: 6,
      title: "Recursion",
      description: "Recursive thinking, base cases, and recursive problem solving",
      topics: [
        {
          slug: "recursion-basics",
          title: "Recursion Fundamentals",
          introMarkdown: `## מה זה רקורסיה?

**רקורסיה (Recursion)** — מתודה שקוראת לעצמה. במקום לולאה, מפרקים בעיה גדולה לבעיות קטנות יותר מאותו סוג.

## שני חלקים הכרחיים

1. **תנאי עצירה (Base Case)** — מתי להפסיק
2. **צעד רקורסיבי (Recursive Step)** — קריאה עצמית עם "בעיה קטנה יותר"

## דוגמה — עצרת (Factorial)

\`\`\`java
public static int factorial(int n) {
    if (n <= 1) return 1;          // Base case
    return n * factorial(n - 1);   // Recursive step
}
// factorial(4) = 4 * factorial(3)
//              = 4 * 3 * factorial(2)
//              = 4 * 3 * 2 * factorial(1)
//              = 4 * 3 * 2 * 1 = 24
\`\`\`

## איך לחשוב רקורסיבית?

1. מה ה-**base case**? (המקרה הפשוט ביותר)
2. איך אני **מקטין** את הבעיה?
3. איך אני **משלב** את התשובה של הקריאה הרקורסיבית?

## מלכודות נפוצות

- **שכחת base case** → לולאה אינסופית → StackOverflowError
- **הבעיה לא קטנה** → אם \`n\` לא משתנה, אין התקדמות
- **StackOverflow**: כל קריאה תופסת מקום ב-Stack — אל תשתמשו ברקורסיה ל-n גדול מאוד
`,
          description: "Understanding recursion, base cases, and simple recursive functions",
          questions: [
            {
              slug: "recursive-factorial",
              type: "FUNCTION",
              title: "Recursive Factorial",
              prompt: "Write a recursive method `long factorial(int n)` that returns n! (n factorial).\n\nRecall: 0! = 1, and n! = n * (n-1)! for n >= 1.\n\nThe main method reads an integer and prints its factorial.",
              constraints: "0 <= n <= 15. The result fits in a long.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static long factorial(int n) {
        // Return n! using recursion

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static long factorial(int n) {
        if (n == 0) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}`,
              tests: [
                { input: "5", expectedOutput: "120", isHidden: false, description: "5! = 120" },
                { input: "0", expectedOutput: "1", isHidden: false, description: "0! = 1" },
                { input: "1", expectedOutput: "1", isHidden: true, description: "1! = 1" },
                { input: "10", expectedOutput: "3628800", isHidden: true, description: "10! = 3628800" }
              ],
              hints: [
                "The base case is: if n == 0, return 1",
                "The recursive case is: return n * factorial(n - 1)",
                "Each call reduces n by 1 until reaching the base case"
              ],
              tags: ["recursion", "factorial", "base-case"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "recursive-sum-to-n",
              type: "FUNCTION",
              title: "Recursive Sum to N",
              prompt: "Write a recursive method `int sumToN(int n)` that returns the sum of all integers from 1 to n.\n\nBase case: sumToN(0) = 0.\nRecursive case: sumToN(n) = n + sumToN(n - 1).\n\nThe main method reads an integer and prints the sum.",
              constraints: "n >= 0.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static int sumToN(int n) {
        // Return the sum 1 + 2 + ... + n using recursion

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(sumToN(n));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static int sumToN(int n) {
        if (n == 0) return 0;
        return n + sumToN(n - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(sumToN(n));
    }
}`,
              tests: [
                { input: "5", expectedOutput: "15", isHidden: false, description: "1+2+3+4+5 = 15" },
                { input: "10", expectedOutput: "55", isHidden: false, description: "Sum to 10" },
                { input: "0", expectedOutput: "0", isHidden: true, description: "Sum to 0" },
                { input: "1", expectedOutput: "1", isHidden: true, description: "Sum to 1" }
              ],
              hints: [
                "The base case is: if n == 0, return 0",
                "The recursive case is: return n + sumToN(n - 1)",
                "Think of it as: sum(5) = 5 + sum(4) = 5 + 4 + sum(3) = ..."
              ],
              tags: ["recursion", "sum", "base-case"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "recursive-power",
              type: "FUNCTION",
              title: "Recursive Power",
              prompt: "Write a recursive method `long power(int base, int exp)` that computes base raised to the power of exp.\n\nBase case: power(base, 0) = 1.\nRecursive case: power(base, exp) = base * power(base, exp - 1).\n\nThe main method reads base and exp, then prints the result.",
              constraints: "exp >= 0. The result fits in a long.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static long power(int base, int exp) {
        // Compute base^exp recursively

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt();
        int exp = sc.nextInt();
        System.out.println(power(base, exp));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static long power(int base, int exp) {
        if (exp == 0) return 1;
        return base * power(base, exp - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt();
        int exp = sc.nextInt();
        System.out.println(power(base, exp));
    }
}`,
              tests: [
                { input: "2 10", expectedOutput: "1024", isHidden: false, description: "2^10 = 1024" },
                { input: "5 3", expectedOutput: "125", isHidden: false, description: "5^3 = 125" },
                { input: "7 0", expectedOutput: "1", isHidden: true, description: "Anything^0 = 1" },
                { input: "3 6", expectedOutput: "729", isHidden: true, description: "3^6 = 729" }
              ],
              hints: [
                "The base case is: if exp == 0, return 1",
                "The recursive case is: return base * power(base, exp - 1)",
                "Each recursive call reduces exp by 1 until it reaches 0"
              ],
              tags: ["recursion", "power", "exponent"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "recursive-countdown",
              type: "FULL_PROGRAM",
              title: "Recursive Countdown",
              prompt: "Read an integer n from input. Using a recursive method `void countdown(int n)`, print a countdown from n to 1, each number on its own line, followed by \"Go!\" on the last line.\n\nExample for n = 3:\n3\n2\n1\nGo!",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static void countdown(int n) {
        // Print countdown from n to 1, then "Go!"

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        countdown(n);
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static void countdown(int n) {
        if (n == 0) {
            System.out.println("Go!");
            return;
        }
        System.out.println(n);
        countdown(n - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        countdown(n);
    }
}`,
              tests: [
                { input: "3", expectedOutput: "3\n2\n1\nGo!", isHidden: false, description: "Countdown from 3" },
                { input: "5", expectedOutput: "5\n4\n3\n2\n1\nGo!", isHidden: false, description: "Countdown from 5" },
                { input: "1", expectedOutput: "1\nGo!", isHidden: true, description: "Countdown from 1" }
              ],
              hints: [
                "The base case is when n reaches 0: print \"Go!\" and return",
                "The recursive case: print n, then call countdown(n - 1)",
                "Print happens before the recursive call, so numbers print in descending order"
              ],
              tags: ["recursion", "void-recursion", "countdown"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            }
          ]
        },
        {
          slug: "recursion-strings",
          title: "Recursion with Strings & Arrays",
          introMarkdown: `## רקורסיה על מחרוזות

במחרוזות, ה-base case הוא בדרך כלל מחרוזת ריקה או תו בודד, והצעד הרקורסיבי עובד על **תת-מחרוזת**.

\`\`\`java
// היפוך מחרוזת
public static String reverse(String s) {
    if (s.length() <= 1) return s;           // Base case
    return reverse(s.substring(1)) + s.charAt(0); // Recursive
}
// reverse("abc") = reverse("bc") + 'a'
//                = reverse("c") + 'b' + 'a'
//                = "c" + "b" + "a" = "cba"
\`\`\`

## רקורסיה על מערכים

במערכים, משתמשים ב-**אינדקס** כפרמטר נוסף:

\`\`\`java
// סכום מערך
public static int sum(int[] arr, int index) {
    if (index >= arr.length) return 0;       // Base case
    return arr[index] + sum(arr, index + 1); // Recursive
}
\`\`\`

## דפוסים נפוצים במבחן

| דפוס | Base Case | צעד רקורסיבי |
|------|-----------|-------------|
| פלינדרום | אורך ≤ 1 | בדוק ראשון ואחרון, קרא לאמצע |
| חיפוש | אינדקס מחוץ לטווח | בדוק תא נוכחי, קרא לבא |
| ספירה | אינדקס מחוץ לטווח | ספור נוכחי + קריאה רקורסיבית |

## מתודות שימושיות למחרוזות

- \`s.charAt(i)\` — תו באינדקס i
- \`s.substring(1)\` — מחרוזת בלי התו הראשון
- \`s.substring(0, s.length()-1)\` — בלי התו האחרון
- \`s.length()\` — אורך (עם סוגריים! בניגוד למערך)
`,
          description: "Applying recursion to string and array problems",
          questions: [
            {
              slug: "recursive-reverse-string",
              type: "FUNCTION",
              title: "Recursive Reverse String",
              prompt: "Write a recursive method `String reverseString(String s)` that returns the reverse of the given string.\n\nBase case: if the string is empty or has one character, return it as is.\nRecursive case: take the last character + reverseString(rest of the string).\n\nThe main method reads a single word and prints the reversed string.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static String reverseString(String s) {
        // Return the reverse of s using recursion

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(reverseString(s));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static String reverseString(String s) {
        if (s.length() <= 1) return s;
        return s.charAt(s.length() - 1) + reverseString(s.substring(0, s.length() - 1));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(reverseString(s));
    }
}`,
              tests: [
                { input: "hello", expectedOutput: "olleh", isHidden: false, description: "Reverse hello" },
                { input: "Java", expectedOutput: "avaJ", isHidden: false, description: "Reverse Java" },
                { input: "a", expectedOutput: "a", isHidden: true, description: "Single character" },
                { input: "abcdef", expectedOutput: "fedcba", isHidden: true, description: "Longer string" }
              ],
              hints: [
                "Base case: if the string length is 0 or 1, return it directly",
                "Use s.charAt(s.length() - 1) to get the last character",
                "Use s.substring(0, s.length() - 1) to get everything except the last character"
              ],
              tags: ["recursion", "strings", "reverse"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "recursive-palindrome-check",
              type: "FUNCTION",
              title: "Recursive Palindrome Check",
              prompt: "Write a recursive method `boolean isPalindrome(String s)` that returns true if the string is a palindrome (reads the same forwards and backwards), and false otherwise. The check should be case-sensitive.\n\nThe main method reads a single word and prints \"Palindrome\" or \"Not palindrome\".",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static boolean isPalindrome(String s) {
        // Return true if s is a palindrome using recursion

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        if (isPalindrome(s)) {
            System.out.println("Palindrome");
        } else {
            System.out.println("Not palindrome");
        }
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static boolean isPalindrome(String s) {
        if (s.length() <= 1) return true;
        if (s.charAt(0) != s.charAt(s.length() - 1)) return false;
        return isPalindrome(s.substring(1, s.length() - 1));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        if (isPalindrome(s)) {
            System.out.println("Palindrome");
        } else {
            System.out.println("Not palindrome");
        }
    }
}`,
              tests: [
                { input: "racecar", expectedOutput: "Palindrome", isHidden: false, description: "racecar is a palindrome" },
                { input: "hello", expectedOutput: "Not palindrome", isHidden: false, description: "hello is not a palindrome" },
                { input: "a", expectedOutput: "Palindrome", isHidden: true, description: "Single character" },
                { input: "abba", expectedOutput: "Palindrome", isHidden: true, description: "Even-length palindrome" }
              ],
              hints: [
                "Base case: a string of length 0 or 1 is always a palindrome",
                "Compare the first and last characters; if they differ, return false",
                "Recurse on the substring without the first and last characters: s.substring(1, s.length() - 1)"
              ],
              tags: ["recursion", "palindrome", "strings"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "recursive-array-sum",
              type: "FUNCTION",
              title: "Recursive Array Sum",
              prompt: "Write a recursive method `int arraySum(int[] arr, int index)` that returns the sum of all elements in the array starting from the given index.\n\nBase case: if index equals the array length, return 0.\nRecursive case: return arr[index] + arraySum(arr, index + 1).\n\nThe main method reads n integers into an array and prints their sum.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static int arraySum(int[] arr, int index) {
        // Return the sum of arr[index..end] recursively

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        System.out.println(arraySum(arr, 0));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static int arraySum(int[] arr, int index) {
        if (index == arr.length) return 0;
        return arr[index] + arraySum(arr, index + 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        System.out.println(arraySum(arr, 0));
    }
}`,
              tests: [
                { input: "4\n1 2 3 4", expectedOutput: "10", isHidden: false, description: "Sum of 1+2+3+4" },
                { input: "3\n10 20 30", expectedOutput: "60", isHidden: false, description: "Sum of 10+20+30" },
                { input: "1\n5", expectedOutput: "5", isHidden: true, description: "Single element" },
                { input: "5\n-1 2 -3 4 -5", expectedOutput: "-3", isHidden: true, description: "Mixed positive and negative" }
              ],
              hints: [
                "Base case: if index equals arr.length, you have gone past the last element, return 0",
                "Recursive case: return the current element plus the sum of the rest",
                "The initial call uses index 0 to start from the beginning"
              ],
              tags: ["recursion", "arrays", "sum"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "recursive-count-occurrences",
              type: "FUNCTION",
              title: "Recursive Count Occurrences",
              prompt: "Write a recursive method `int countOccurrences(String s, char c)` that returns the number of times character c appears in string s.\n\nBase case: if the string is empty, return 0.\nRecursive case: check the first character, then recurse on the rest.\n\nThe main method reads a word and a character, then prints the count.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static int countOccurrences(String s, char c) {
        // Count how many times c appears in s using recursion

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        char c = sc.next().charAt(0);
        System.out.println(countOccurrences(s, c));
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static int countOccurrences(String s, char c) {
        if (s.isEmpty()) return 0;
        int count = (s.charAt(0) == c) ? 1 : 0;
        return count + countOccurrences(s.substring(1), c);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        char c = sc.next().charAt(0);
        System.out.println(countOccurrences(s, c));
    }
}`,
              tests: [
                { input: "banana\na", expectedOutput: "3", isHidden: false, description: "3 a's in banana" },
                { input: "hello\nl", expectedOutput: "2", isHidden: false, description: "2 l's in hello" },
                { input: "abc\nz", expectedOutput: "0", isHidden: true, description: "Not found" },
                { input: "aaa\na", expectedOutput: "3", isHidden: true, description: "All same character" }
              ],
              hints: [
                "Base case: if s is empty, return 0",
                "Check if the first character equals c; if so, add 1 to the recursive result",
                "Recurse on s.substring(1) to check the rest of the string"
              ],
              tags: ["recursion", "strings", "counting"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        }
      ]
    },

    // ==================== Day 7: OOP Foundations ====================
    {
      weekNumber: 7,
      title: "OOP Foundations",
      description: "Classes, objects, constructors, and instance methods",
      topics: [
        {
          slug: "classes-objects",
          title: "Classes & Objects",
          introMarkdown: `## מה זה מחלקה ואובייקט?

**מחלקה (Class)** — תבנית (blueprint) שמגדירה שדות (נתונים) ומתודות (פעולות).
**אובייקט (Object)** — מופע (instance) של מחלקה — "הדבר האמיתי" בזיכרון.

## מבנה מחלקה

\`\`\`java
public class Student {
    // שדות (fields)
    String name;
    int grade;

    // בנאי (constructor)
    public Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    // מתודה
    public String toString() {
        return name + ": " + grade;
    }
}
\`\`\`

## יצירת אובייקטים

\`\`\`java
Student s1 = new Student("Alice", 90);
Student s2 = new Student("Bob", 85);
System.out.println(s1);  // Alice: 90 (קורא ל-toString)
\`\`\`

## מושגים מרכזיים

- **\`this\`** — מצביע לאובייקט הנוכחי. \`this.name = name;\` מבדיל בין השדה לפרמטר
- **בנאי (Constructor)** — מתודה מיוחדת שרצה בעת \`new\`. שם זהה לשם המחלקה, בלי טיפוס החזרה
- **toString()** — מתודה שמגדירה איך אובייקט מודפס
- **\`new\`** — יוצר אובייקט חדש בזיכרון
- **בנאי ברירת מחדל** — אם לא כותבים בנאי, Java נותנת בנאי ריק אוטומטית
`,
          description: "Defining classes, constructors, fields, and creating instances",
          questions: [
            {
              slug: "define-a-class",
              type: "FULL_PROGRAM",
              title: "Define a Simple Class",
              prompt: "Define a static inner class called `Dog` with two fields: `String name` and `int age`. Add a constructor that takes both parameters.\n\nIn main, read a name and age from input, create a Dog object, and print:\nName: <name>\nAge: <age>",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Dog {
        // Define fields: name (String) and age (int)
        // Define a constructor that takes name and age

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read name and age, create a Dog, print its info

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Dog {
        String name;
        int age;

        Dog(String name, int age) {
            this.name = name;
            this.age = age;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int age = sc.nextInt();
        Dog d = new Dog(name, age);
        System.out.println("Name: " + d.name);
        System.out.println("Age: " + d.age);
    }
}`,
              tests: [
                { input: "Rex\n5", expectedOutput: "Name: Rex\nAge: 5", isHidden: false, description: "Basic dog" },
                { input: "Buddy\n3", expectedOutput: "Name: Buddy\nAge: 3", isHidden: false, description: "Another dog" },
                { input: "Max\n10", expectedOutput: "Name: Max\nAge: 10", isHidden: true, description: "Older dog" }
              ],
              hints: [
                "Define fields inside the class: String name; int age;",
                "The constructor uses 'this' to distinguish fields from parameters: this.name = name;",
                "Create an instance with: Dog d = new Dog(name, age);"
              ],
              tags: ["classes", "objects", "constructor", "fields"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "constructor-with-defaults",
              type: "FULL_PROGRAM",
              title: "Constructor with Defaults",
              prompt: "Define a static inner class `Rectangle` with fields `int width` and `int height`.\n\nProvide two constructors:\n1. `Rectangle(int width, int height)` - sets both fields\n2. `Rectangle(int side)` - creates a square (sets both width and height to side)\n\nIn main, read two integers. If they are the same, create a Rectangle using the single-parameter constructor. If different, use the two-parameter constructor. Print:\nWidth: <width>\nHeight: <height>\nArea: <area>",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Rectangle {
        // Define fields and two constructors

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read two integers, create a Rectangle, print info

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Rectangle {
        int width;
        int height;

        Rectangle(int width, int height) {
            this.width = width;
            this.height = height;
        }

        Rectangle(int side) {
            this.width = side;
            this.height = side;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        Rectangle r;
        if (a == b) {
            r = new Rectangle(a);
        } else {
            r = new Rectangle(a, b);
        }
        System.out.println("Width: " + r.width);
        System.out.println("Height: " + r.height);
        System.out.println("Area: " + (r.width * r.height));
    }
}`,
              tests: [
                { input: "5 3", expectedOutput: "Width: 5\nHeight: 3\nArea: 15", isHidden: false, description: "Different sides" },
                { input: "4 4", expectedOutput: "Width: 4\nHeight: 4\nArea: 16", isHidden: false, description: "Square" },
                { input: "10 7", expectedOutput: "Width: 10\nHeight: 7\nArea: 70", isHidden: true, description: "Larger rectangle" }
              ],
              hints: [
                "Define two constructors with different parameter lists (constructor overloading)",
                "The single-parameter constructor sets both width and height to the same value",
                "Area is width * height"
              ],
              tags: ["classes", "constructors", "overloading"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "tostring-method",
              type: "FULL_PROGRAM",
              title: "toString Method",
              prompt: "Define a static inner class `Student` with fields `String name` and `int grade`.\n\nOverride the `toString()` method to return the format: \"Student{name='<name>', grade=<grade>}\".\n\nIn main, read a name and a grade from input, create a Student, and print it using System.out.println (which calls toString automatically).",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Student {
        String name;
        int grade;

        Student(String name, int grade) {
            this.name = name;
            this.grade = grade;
        }

        // Override toString to return: Student{name='<name>', grade=<grade>}

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read name and grade, create Student, print it

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Student {
        String name;
        int grade;

        Student(String name, int grade) {
            this.name = name;
            this.grade = grade;
        }

        public String toString() {
            return "Student{name='" + name + "', grade=" + grade + "}";
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int grade = sc.nextInt();
        Student s = new Student(name, grade);
        System.out.println(s);
    }
}`,
              tests: [
                { input: "Alice\n90", expectedOutput: "Student{name='Alice', grade=90}", isHidden: false, description: "Alice with 90" },
                { input: "Bob\n75", expectedOutput: "Student{name='Bob', grade=75}", isHidden: false, description: "Bob with 75" },
                { input: "Eve\n100", expectedOutput: "Student{name='Eve', grade=100}", isHidden: true, description: "Perfect score" }
              ],
              hints: [
                "Override toString() with: public String toString() { return ...; }",
                "Use string concatenation to build the formatted output",
                "System.out.println(object) automatically calls object.toString()"
              ],
              tags: ["classes", "toString", "override"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "getter-methods",
              type: "FULL_PROGRAM",
              title: "Getter Methods",
              prompt: "Define a static inner class `BankAccount` with a private field `double balance`. The constructor takes the initial balance. Add getter method `double getBalance()`.\n\nAlso add a method `void deposit(double amount)` that adds to the balance and `void withdraw(double amount)` that subtracts from the balance (only if sufficient funds).\n\nIn main, read the initial balance, then read n operations. Each operation is either \"deposit <amount>\" or \"withdraw <amount>\". After all operations, print the final balance formatted to 2 decimal places.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class BankAccount {
        private double balance;

        BankAccount(double balance) {
            this.balance = balance;
        }

        // Add getBalance, deposit, and withdraw methods

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read initial balance, then n operations, print final balance

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class BankAccount {
        private double balance;

        BankAccount(double balance) {
            this.balance = balance;
        }

        public double getBalance() {
            return balance;
        }

        public void deposit(double amount) {
            balance += amount;
        }

        public void withdraw(double amount) {
            if (amount <= balance) {
                balance -= amount;
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double initial = sc.nextDouble();
        int n = sc.nextInt();
        BankAccount account = new BankAccount(initial);
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            double amount = sc.nextDouble();
            if (op.equals("deposit")) {
                account.deposit(amount);
            } else {
                account.withdraw(amount);
            }
        }
        System.out.printf("%.2f%n", account.getBalance());
    }
}`,
              tests: [
                { input: "100.00\n3\ndeposit 50.00\nwithdraw 30.00\ndeposit 20.00", expectedOutput: "140.00", isHidden: false, description: "Mixed operations" },
                { input: "50.00\n2\nwithdraw 60.00\ndeposit 10.00", expectedOutput: "60.00", isHidden: false, description: "Insufficient funds ignored" },
                { input: "0.00\n1\ndeposit 100.00", expectedOutput: "100.00", isHidden: true, description: "Start from zero" }
              ],
              hints: [
                "getBalance() simply returns the private balance field",
                "deposit adds amount to balance; withdraw subtracts only if amount <= balance",
                "Use printf(\"%.2f%n\", value) to format to 2 decimal places"
              ],
              tags: ["classes", "getters", "methods", "encapsulation"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "create-instances-array",
              type: "FULL_PROGRAM",
              title: "Array of Objects",
              prompt: "Define a static inner class `Point` with fields `int x` and `int y` and a constructor.\n\nIn main, read an integer n, then read n pairs of integers. Create an array of Point objects. Print each point in the format \"(<x>, <y>)\", one per line. Then print the point that is farthest from the origin (0,0). Use the formula: distance = sqrt(x*x + y*y). If there is a tie, print the first one found.\n\nFinal output line: \"Farthest: (<x>, <y>)\"",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Point {
        int x;
        int y;

        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n points, print each, then print the farthest from origin

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Point {
        int x;
        int y;

        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Point[] points = new Point[n];
        for (int i = 0; i < n; i++) {
            points[i] = new Point(sc.nextInt(), sc.nextInt());
        }
        double maxDist = -1;
        int maxIdx = 0;
        for (int i = 0; i < n; i++) {
            System.out.println("(" + points[i].x + ", " + points[i].y + ")");
            double dist = Math.sqrt(points[i].x * points[i].x + points[i].y * points[i].y);
            if (dist > maxDist) {
                maxDist = dist;
                maxIdx = i;
            }
        }
        System.out.println("Farthest: (" + points[maxIdx].x + ", " + points[maxIdx].y + ")");
    }
}`,
              tests: [
                { input: "3\n1 2\n3 4\n0 1", expectedOutput: "(1, 2)\n(3, 4)\n(0, 1)\nFarthest: (3, 4)", isHidden: false, description: "Three points" },
                { input: "2\n5 0\n0 5", expectedOutput: "(5, 0)\n(0, 5)\nFarthest: (5, 0)", isHidden: false, description: "Tie goes to first" },
                { input: "1\n3 4", expectedOutput: "(3, 4)\nFarthest: (3, 4)", isHidden: true, description: "Single point" }
              ],
              hints: [
                "Create an array of Point objects: Point[] points = new Point[n];",
                "Use Math.sqrt(x*x + y*y) to compute the distance from the origin",
                "Track the index of the point with the maximum distance"
              ],
              tags: ["classes", "arrays", "objects", "distance"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        },
        {
          slug: "instance-methods",
          title: "Instance Methods",
          introMarkdown: `## מה זה מתודות מופע (Instance Methods)?

מתודות שפועלות על **אובייקט ספציפי** — ניגשות לשדות שלו דרך \`this\`.

\`\`\`java
public class Counter {
    private int count = 0;

    public void increment() {   // מתודת מופע — בלי static
        this.count++;
    }

    public int getCount() {
        return this.count;
    }
}

Counter c = new Counter();
c.increment();
c.increment();
System.out.println(c.getCount()); // 2
\`\`\`

## static vs instance

| | static | instance |
|--|--------|----------|
| **שייך ל** | מחלקה | אובייקט |
| **גישה לשדות** | רק static | כל השדות |
| **קריאה** | \`ClassName.method()\` | \`obj.method()\` |
| **\`this\`** | לא קיים | מצביע לאובייקט |

## equals — השוואת אובייקטים

\`==\` משווה **כתובות** בזיכרון, לא תוכן! צריך לכתוב \`equals\`:

\`\`\`java
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Student)) return false;
    Student other = (Student) obj;
    return this.name.equals(other.name) && this.grade == other.grade;
}
\`\`\`

## מערך של אובייקטים

\`\`\`java
Student[] students = new Student[3];
students[0] = new Student("Alice", 90);
// students[1] הוא null עד שניצור אובייקט!
\`\`\`
`,
          description: "Methods that operate on object state and modify fields",
          questions: [
            {
              slug: "methods-modify-state",
              type: "FULL_PROGRAM",
              title: "Counter Class",
              prompt: "Define a static inner class `Counter` with a private `int count` field initialized to 0.\n\nAdd methods:\n- `void increment()` - increases count by 1\n- `void decrement()` - decreases count by 1 (minimum 0)\n- `int getCount()` - returns the current count\n\nIn main, read n operations. Each is either \"inc\" or \"dec\". After all operations, print the final count.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Counter {
        private int count = 0;

        // Add increment, decrement, and getCount methods

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n, then n operations, print final count

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Counter {
        private int count = 0;

        public void increment() {
            count++;
        }

        public void decrement() {
            if (count > 0) {
                count--;
            }
        }

        public int getCount() {
            return count;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Counter c = new Counter();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            if (op.equals("inc")) {
                c.increment();
            } else {
                c.decrement();
            }
        }
        System.out.println(c.getCount());
    }
}`,
              tests: [
                { input: "5\ninc\ninc\ninc\ndec\ninc", expectedOutput: "3", isHidden: false, description: "Three increments net" },
                { input: "3\ndec\ndec\ninc", expectedOutput: "1", isHidden: false, description: "Cannot go below 0" },
                { input: "4\ninc\ninc\ndec\ndec", expectedOutput: "0", isHidden: true, description: "Back to zero" }
              ],
              hints: [
                "increment simply does count++",
                "decrement should check if count > 0 before decrementing",
                "getCount returns the private count field"
              ],
              tags: ["classes", "instance-methods", "state", "encapsulation"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "method-chaining-concept",
              type: "FULL_PROGRAM",
              title: "StringBuilder Concept",
              prompt: "Define a static inner class `TextBuilder` with a private `String text` field initialized to \"\".\n\nAdd methods:\n- `void append(String s)` - appends s to text\n- `void prepend(String s)` - adds s before text\n- `String getText()` - returns the current text\n\nIn main, read n operations. Each is either \"append <word>\" or \"prepend <word>\". After all operations, print the final text.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class TextBuilder {
        private String text = "";

        // Add append, prepend, and getText methods

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n operations, then print the final text

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class TextBuilder {
        private String text = "";

        public void append(String s) {
            text = text + s;
        }

        public void prepend(String s) {
            text = s + text;
        }

        public String getText() {
            return text;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        TextBuilder tb = new TextBuilder();
        for (int i = 0; i < n; i++) {
            String op = sc.next();
            String word = sc.next();
            if (op.equals("append")) {
                tb.append(word);
            } else {
                tb.prepend(word);
            }
        }
        System.out.println(tb.getText());
    }
}`,
              tests: [
                { input: "3\nappend Hello\nappend World\nprepend Hey", expectedOutput: "HeyHelloWorld", isHidden: false, description: "Mix of append and prepend" },
                { input: "2\nappend AB\nappend CD", expectedOutput: "ABCD", isHidden: false, description: "Only appends" },
                { input: "2\nprepend World\nprepend Hello", expectedOutput: "HelloWorld", isHidden: true, description: "Only prepends" }
              ],
              hints: [
                "append: text = text + s",
                "prepend: text = s + text",
                "getText simply returns the text field"
              ],
              tags: ["classes", "instance-methods", "strings", "state"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "equals-method",
              type: "FULL_PROGRAM",
              title: "Custom equals Method",
              prompt: "Define a static inner class `Fraction` with `int numerator` and `int denominator` fields.\n\nAdd a method `boolean equals(Fraction other)` that returns true if the two fractions are mathematically equal (i.e., they represent the same value when simplified). To compare, use cross-multiplication: a/b == c/d when a*d == b*c.\n\nIn main, read four integers (num1, den1, num2, den2) and print \"Equal\" or \"Not equal\".",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Fraction {
        int numerator;
        int denominator;

        Fraction(int numerator, int denominator) {
            this.numerator = numerator;
            this.denominator = denominator;
        }

        // Add equals method that compares fractions by cross multiplication

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read two fractions and check if they are equal

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Fraction {
        int numerator;
        int denominator;

        Fraction(int numerator, int denominator) {
            this.numerator = numerator;
            this.denominator = denominator;
        }

        public boolean equals(Fraction other) {
            return this.numerator * other.denominator == this.denominator * other.numerator;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n1 = sc.nextInt();
        int d1 = sc.nextInt();
        int n2 = sc.nextInt();
        int d2 = sc.nextInt();
        Fraction f1 = new Fraction(n1, d1);
        Fraction f2 = new Fraction(n2, d2);
        if (f1.equals(f2)) {
            System.out.println("Equal");
        } else {
            System.out.println("Not equal");
        }
    }
}`,
              tests: [
                { input: "1 2 2 4", expectedOutput: "Equal", isHidden: false, description: "1/2 == 2/4" },
                { input: "1 3 2 5", expectedOutput: "Not equal", isHidden: false, description: "1/3 != 2/5" },
                { input: "3 9 1 3", expectedOutput: "Equal", isHidden: true, description: "3/9 == 1/3" },
                { input: "5 7 5 7", expectedOutput: "Equal", isHidden: true, description: "Same fraction" }
              ],
              hints: [
                "Two fractions a/b and c/d are equal if a*d == b*c (cross multiplication)",
                "Use this.numerator and other.numerator to access the fields",
                "This avoids needing to simplify fractions or use floating point"
              ],
              tags: ["classes", "equals", "fractions", "comparison"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "multiple-objects-interaction",
              type: "FULL_PROGRAM",
              title: "Player Score Tracker",
              prompt: "Define a static inner class `Player` with fields `String name` and `int score` (initially 0).\n\nAdd methods:\n- `void addScore(int points)` - adds points to score\n- `String getName()` - returns the name\n- `int getScore()` - returns the score\n\nIn main, read two player names. Then read n events, each in the format \"<1 or 2> <points>\" where the first value indicates which player scored. After all events, print:\n<name1>: <score1>\n<name2>: <score2>\nWinner: <name of player with higher score>\n\nIf scores are tied, print \"Winner: Tie\".",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Player {
        // Define fields, constructor, and methods

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read two player names, then n events, determine winner

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Player {
        private String name;
        private int score;

        Player(String name) {
            this.name = name;
            this.score = 0;
        }

        public void addScore(int points) {
            score += points;
        }

        public String getName() {
            return name;
        }

        public int getScore() {
            return score;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Player p1 = new Player(sc.next());
        Player p2 = new Player(sc.next());
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int who = sc.nextInt();
            int points = sc.nextInt();
            if (who == 1) {
                p1.addScore(points);
            } else {
                p2.addScore(points);
            }
        }
        System.out.println(p1.getName() + ": " + p1.getScore());
        System.out.println(p2.getName() + ": " + p2.getScore());
        if (p1.getScore() > p2.getScore()) {
            System.out.println("Winner: " + p1.getName());
        } else if (p2.getScore() > p1.getScore()) {
            System.out.println("Winner: " + p2.getName());
        } else {
            System.out.println("Winner: Tie");
        }
    }
}`,
              tests: [
                { input: "Alice Bob\n4\n1 10\n2 20\n1 15\n2 5", expectedOutput: "Alice: 25\nBob: 25\nWinner: Tie", isHidden: false, description: "Tie game" },
                { input: "Tom Jerry\n3\n1 30\n2 10\n1 5", expectedOutput: "Tom: 35\nJerry: 10\nWinner: Tom", isHidden: false, description: "Player 1 wins" },
                { input: "X Y\n2\n2 50\n1 10", expectedOutput: "X: 10\nY: 50\nWinner: Y", isHidden: true, description: "Player 2 wins" }
              ],
              hints: [
                "Create two Player objects with the names read from input",
                "Use the player number (1 or 2) to determine which player to add points to",
                "Compare final scores to determine the winner or tie"
              ],
              tags: ["classes", "objects", "interaction", "methods"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        }
      ]
    },

    // ==================== Day 8: OOP Advanced ====================
    {
      weekNumber: 8,
      title: "OOP Advanced",
      description: "Encapsulation, access modifiers, and class design",
      topics: [
        {
          slug: "encapsulation",
          title: "Encapsulation & Access Modifiers",
          introMarkdown: `## מה זה אנקפסולציה (Encapsulation)?

**אנקפסולציה** — הסתרת המימוש הפנימי של מחלקה. השדות **פרטיים** (\`private\`), והגישה אליהם רק דרך **מתודות ציבוריות** (\`public\`).

## הרגלציפויות גישה (Access Modifiers)

| modifier | מחלקה | חבילה | תת-מחלקה | כולם |
|----------|-------|-------|----------|------|
| \`private\` | ✓ | ✗ | ✗ | ✗ |
| (default) | ✓ | ✓ | ✗ | ✗ |
| \`protected\` | ✓ | ✓ | ✓ | ✗ |
| \`public\` | ✓ | ✓ | ✓ | ✓ |

## דפוס Getter/Setter

\`\`\`java
public class Student {
    private String name;
    private int grade;

    // Getter — מחזיר את הערך
    public String getName() { return name; }

    // Setter — מעדכן את הערך (עם ולידציה!)
    public void setGrade(int grade) {
        if (grade < 0 || grade > 100) {
            throw new IllegalArgumentException("Invalid grade");
        }
        this.grade = grade;
    }
}
\`\`\`

## למה אנקפסולציה?

- **שליטה**: ולידציה ב-setter מונעת ערכים לא חוקיים
- **גמישות**: אפשר לשנות מימוש פנימי בלי לשבור קוד חיצוני
- **Immutable class**: בלי setters — אובייקט שלא ניתן לשינוי אחרי יצירה

\`\`\`java
public class ImmutablePoint {
    private final int x, y;    // final — לא ניתן לשנות
    public ImmutablePoint(int x, int y) { this.x = x; this.y = y; }
    public int getX() { return x; }
    public int getY() { return y; }
    // אין setters!
}
\`\`\`
`,
          description: "Private fields, getters/setters, and validation",
          questions: [
            {
              slug: "private-fields-getters-setters",
              type: "FULL_PROGRAM",
              title: "Private Fields with Getters/Setters",
              prompt: "Define a static inner class `Temperature` with a private `double celsius` field.\n\nProvide:\n- A constructor that takes celsius\n- `double getCelsius()` - returns the temperature in Celsius\n- `double getFahrenheit()` - returns the temperature converted to Fahrenheit (formula: C * 9/5 + 32)\n- `void setCelsius(double c)` - sets the celsius value\n\nIn main, read a temperature in Celsius. Print the Celsius value, then the Fahrenheit value (both to 1 decimal place). Then read a second temperature, update the object, and print both again.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Temperature {
        private double celsius;

        // Constructor, getCelsius, getFahrenheit, setCelsius

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read temp, print C and F, read second temp, update, print again

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Temperature {
        private double celsius;

        Temperature(double celsius) {
            this.celsius = celsius;
        }

        public double getCelsius() {
            return celsius;
        }

        public double getFahrenheit() {
            return celsius * 9.0 / 5.0 + 32;
        }

        public void setCelsius(double c) {
            this.celsius = c;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        double c1 = sc.nextDouble();
        Temperature t = new Temperature(c1);
        System.out.printf("%.1f C%n", t.getCelsius());
        System.out.printf("%.1f F%n", t.getFahrenheit());
        double c2 = sc.nextDouble();
        t.setCelsius(c2);
        System.out.printf("%.1f C%n", t.getCelsius());
        System.out.printf("%.1f F%n", t.getFahrenheit());
    }
}`,
              tests: [
                { input: "0\n100", expectedOutput: "0.0 C\n32.0 F\n100.0 C\n212.0 F", isHidden: false, description: "Freezing and boiling" },
                { input: "37\n20", expectedOutput: "37.0 C\n98.6 F\n20.0 C\n68.0 F", isHidden: false, description: "Body temp and room temp" },
                { input: "-40\n25", expectedOutput: "-40.0 C\n-40.0 F\n25.0 C\n77.0 F", isHidden: true, description: "Negative and positive" }
              ],
              hints: [
                "Fahrenheit = celsius * 9.0 / 5.0 + 32 (use 9.0 and 5.0 for double division)",
                "setCelsius updates the private field",
                "Use printf with %.1f for 1 decimal place"
              ],
              tags: ["encapsulation", "getters", "setters", "private"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "validation-in-setters",
              type: "FULL_PROGRAM",
              title: "Validation in Setters",
              prompt: "Define a static inner class `Age` with a private `int value` field.\n\nThe constructor and setter should validate that the age is between 0 and 150 (inclusive). If an invalid value is provided:\n- The constructor sets value to 0\n- The setter ignores the new value (keeps the old one)\n\nProvide: constructor, `int getValue()`, `void setValue(int v)`, and `boolean isValid(int v)` (a private helper).\n\nIn main, read an initial age, then read n update attempts. For each attempt, call setValue. After all updates, print the final age value.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Age {
        private int value;

        // Constructor with validation, getValue, setValue with validation

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read initial age, then n updates, print final value

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Age {
        private int value;

        Age(int v) {
            if (v >= 0 && v <= 150) {
                this.value = v;
            } else {
                this.value = 0;
            }
        }

        private boolean isValid(int v) {
            return v >= 0 && v <= 150;
        }

        public int getValue() {
            return value;
        }

        public void setValue(int v) {
            if (isValid(v)) {
                this.value = v;
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int initial = sc.nextInt();
        Age age = new Age(initial);
        int n = sc.nextInt();
        for (int i = 0; i < n; i++) {
            int v = sc.nextInt();
            age.setValue(v);
        }
        System.out.println(age.getValue());
    }
}`,
              tests: [
                { input: "25\n3\n30\n-5\n40", expectedOutput: "40", isHidden: false, description: "Invalid update ignored" },
                { input: "200\n2\n50\n160", expectedOutput: "50", isHidden: false, description: "Invalid initial defaults to 0, then updated" },
                { input: "10\n0", expectedOutput: "10", isHidden: true, description: "No updates" },
                { input: "-1\n1\n75", expectedOutput: "75", isHidden: true, description: "Invalid initial, then valid update" }
              ],
              hints: [
                "The isValid helper checks if v >= 0 && v <= 150",
                "In the constructor, if the value is invalid, set this.value = 0",
                "In setValue, only update if isValid returns true"
              ],
              tags: ["encapsulation", "validation", "setters", "private"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "immutable-class",
              type: "FULL_PROGRAM",
              title: "Immutable Class",
              prompt: "Define a static inner class `ImmutablePoint` that represents an immutable 2D point. Once created, its coordinates cannot be changed.\n\nProvide:\n- A constructor `ImmutablePoint(int x, int y)`\n- `int getX()` and `int getY()` getters\n- `ImmutablePoint translate(int dx, int dy)` - returns a NEW ImmutablePoint shifted by (dx, dy) without modifying the original\n- `String toString()` - returns \"(<x>, <y>)\"\n\nIn main, read x, y, dx, dy. Create a point, translate it, and print both the original and translated points.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class ImmutablePoint {
        // Define private final fields, constructor, getters, translate, toString

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read x, y, dx, dy. Create point, translate, print both

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class ImmutablePoint {
        private final int x;
        private final int y;

        ImmutablePoint(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }

        public ImmutablePoint translate(int dx, int dy) {
            return new ImmutablePoint(x + dx, y + dy);
        }

        public String toString() {
            return "(" + x + ", " + y + ")";
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int y = sc.nextInt();
        int dx = sc.nextInt();
        int dy = sc.nextInt();
        ImmutablePoint original = new ImmutablePoint(x, y);
        ImmutablePoint translated = original.translate(dx, dy);
        System.out.println("Original: " + original);
        System.out.println("Translated: " + translated);
    }
}`,
              tests: [
                { input: "3 4 1 2", expectedOutput: "Original: (3, 4)\nTranslated: (4, 6)", isHidden: false, description: "Basic translation" },
                { input: "0 0 5 -3", expectedOutput: "Original: (0, 0)\nTranslated: (5, -3)", isHidden: false, description: "From origin" },
                { input: "-2 7 2 -7", expectedOutput: "Original: (-2, 7)\nTranslated: (0, 0)", isHidden: true, description: "Translate to origin" }
              ],
              hints: [
                "Use 'private final' for fields to make them truly immutable",
                "translate() returns a NEW ImmutablePoint, not modifying 'this'",
                "No setters exist - that is what makes the class immutable"
              ],
              tags: ["encapsulation", "immutable", "final", "design"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "encapsulation-full-class",
              type: "FULL_PROGRAM",
              title: "Fully Encapsulated Student",
              prompt: "Define a static inner class `Student` with private fields: `String name`, `int[] grades` (up to 10 grades), and `int gradeCount`.\n\nProvide:\n- Constructor that takes only a name (grades start empty)\n- `void addGrade(int grade)` - adds a grade (only if count < 10 and grade is 0-100)\n- `double getAverage()` - returns the average of all grades (0.0 if no grades)\n- `int getHighest()` - returns the highest grade (0 if no grades)\n- `String getName()`\n\nIn main, read a student name, then n grades. Add each grade. Print:\n<name>\nAverage: <average to 1 decimal place>\nHighest: <highest>",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Student {
        // Define private fields and all required methods

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read name, then n grades. Print name, average, highest

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Student {
        private String name;
        private int[] grades;
        private int gradeCount;

        Student(String name) {
            this.name = name;
            this.grades = new int[10];
            this.gradeCount = 0;
        }

        public void addGrade(int grade) {
            if (gradeCount < 10 && grade >= 0 && grade <= 100) {
                grades[gradeCount] = grade;
                gradeCount++;
            }
        }

        public double getAverage() {
            if (gradeCount == 0) return 0.0;
            int sum = 0;
            for (int i = 0; i < gradeCount; i++) {
                sum += grades[i];
            }
            return (double) sum / gradeCount;
        }

        public int getHighest() {
            if (gradeCount == 0) return 0;
            int max = grades[0];
            for (int i = 1; i < gradeCount; i++) {
                if (grades[i] > max) max = grades[i];
            }
            return max;
        }

        public String getName() {
            return name;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.next();
        int n = sc.nextInt();
        Student s = new Student(name);
        for (int i = 0; i < n; i++) {
            s.addGrade(sc.nextInt());
        }
        System.out.println(s.getName());
        System.out.printf("Average: %.1f%n", s.getAverage());
        System.out.println("Highest: " + s.getHighest());
    }
}`,
              tests: [
                { input: "Alice\n4\n85 92 78 95", expectedOutput: "Alice\nAverage: 87.5\nHighest: 95", isHidden: false, description: "Normal grades" },
                { input: "Bob\n3\n100 100 100", expectedOutput: "Bob\nAverage: 100.0\nHighest: 100", isHidden: false, description: "All perfect" },
                { input: "Eve\n0", expectedOutput: "Eve\nAverage: 0.0\nHighest: 0", isHidden: true, description: "No grades" }
              ],
              hints: [
                "Initialize grades array to size 10 and gradeCount to 0 in the constructor",
                "addGrade should validate both the count limit and grade range before adding",
                "getAverage needs to handle the case of zero grades to avoid division by zero"
              ],
              tags: ["encapsulation", "arrays", "validation", "class-design"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            }
          ]
        },
        {
          slug: "class-design",
          title: "Class Design Patterns",
          introMarkdown: `## דפוסי עיצוב מחלקות

## Composition — הרכבה

מחלקה שמכילה אובייקטים של מחלקות אחרות כשדות:

\`\`\`java
public class Person {
    private String name;
    private Address address;  // אובייקט Address כשדה

    public Person(String name, Address address) {
        this.name = name;
        this.address = address;
    }
}
\`\`\`

## static — שדות ומתודות סטטיים

**שדה סטטי** — משותף לכל האובייקטים של המחלקה:

\`\`\`java
public class Student {
    private static int count = 0; // משותף!
    private String name;

    public Student(String name) {
        this.name = name;
        count++;                   // כל יצירה מגדילה
    }

    public static int getCount() {
        return count;
    }
}
\`\`\`

## Utility Class — מחלקת עזר

מחלקה עם **מתודות סטטיות בלבד** (כמו \`Math\`):

\`\`\`java
public class MathUtils {
    public static int max(int a, int b) { return a > b ? a : b; }
    public static boolean isPrime(int n) { ... }
}
// קריאה: MathUtils.max(3, 5)
\`\`\`

## Builder / Fluent Pattern

מתודות שמחזירות \`this\` כדי לאפשר שרשור:

\`\`\`java
student.setName("Alice").setGrade(90).setAge(21);
\`\`\`
`,
          description: "Composition, static methods, and design patterns",
          questions: [
            {
              slug: "composition-pattern",
              type: "FULL_PROGRAM",
              title: "Composition: Address in Person",
              prompt: "Define two static inner classes:\n\n`Address` with fields: `String street`, `String city`.\n`Person` with fields: `String name`, `Address address`.\n\nBoth should have appropriate constructors and toString methods.\n- Address.toString() returns \"<street>, <city>\"\n- Person.toString() returns \"<name> lives at <address>\"\n\nIn main, read a name, street, and city (each on its own line). Create a Person with an Address and print the Person.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Address {
        // street and city fields, constructor, toString

    }

    static class Person {
        // name and address fields, constructor, toString

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read name, street, city. Create Person with Address. Print.

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Address {
        String street;
        String city;

        Address(String street, String city) {
            this.street = street;
            this.city = city;
        }

        public String toString() {
            return street + ", " + city;
        }
    }

    static class Person {
        String name;
        Address address;

        Person(String name, Address address) {
            this.name = name;
            this.address = address;
        }

        public String toString() {
            return name + " lives at " + address;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        String street = sc.nextLine();
        String city = sc.nextLine();
        Address addr = new Address(street, city);
        Person p = new Person(name, addr);
        System.out.println(p);
    }
}`,
              tests: [
                { input: "Alice\nMain St\nNew York", expectedOutput: "Alice lives at Main St, New York", isHidden: false, description: "Basic person" },
                { input: "Bob\nElm Ave\nBoston", expectedOutput: "Bob lives at Elm Ave, Boston", isHidden: false, description: "Another person" },
                { input: "Eve\nOak Dr\nChicago", expectedOutput: "Eve lives at Oak Dr, Chicago", isHidden: true, description: "Third person" }
              ],
              hints: [
                "Composition means a Person HAS an Address (as a field)",
                "Person's toString can simply concatenate with the Address object (its toString is called automatically)",
                "Use sc.nextLine() for input since street names may contain spaces"
              ],
              tags: ["composition", "class-design", "toString", "relationships"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "static-methods-class",
              type: "FULL_PROGRAM",
              title: "Static Utility Methods",
              prompt: "Define a static inner class `MathUtils` with only static methods (no instance fields or constructor needed):\n\n- `static int max(int a, int b)` - returns the larger value\n- `static int min(int a, int b)` - returns the smaller value\n- `static int clamp(int value, int low, int high)` - returns value constrained to the range [low, high]\n\nIn main, read three integers: value, low, high. Print:\nMax of low and high: <result>\nMin of low and high: <result>\nClamped value: <result>",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class MathUtils {
        // Define static methods: max, min, clamp

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read value, low, high. Print max, min, and clamped results

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class MathUtils {
        static int max(int a, int b) {
            return (a >= b) ? a : b;
        }

        static int min(int a, int b) {
            return (a <= b) ? a : b;
        }

        static int clamp(int value, int low, int high) {
            return max(low, min(value, high));
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int value = sc.nextInt();
        int low = sc.nextInt();
        int high = sc.nextInt();
        System.out.println("Max of low and high: " + MathUtils.max(low, high));
        System.out.println("Min of low and high: " + MathUtils.min(low, high));
        System.out.println("Clamped value: " + MathUtils.clamp(value, low, high));
    }
}`,
              tests: [
                { input: "15 1 10", expectedOutput: "Max of low and high: 10\nMin of low and high: 1\nClamped value: 10", isHidden: false, description: "Value above range" },
                { input: "5 1 10", expectedOutput: "Max of low and high: 10\nMin of low and high: 1\nClamped value: 5", isHidden: false, description: "Value in range" },
                { input: "-3 0 100", expectedOutput: "Max of low and high: 100\nMin of low and high: 0\nClamped value: 0", isHidden: true, description: "Value below range" }
              ],
              hints: [
                "Static methods are called on the class name: MathUtils.max(a, b)",
                "clamp can be implemented using max and min: max(low, min(value, high))",
                "The ternary operator (condition ? a : b) is a concise way to implement max/min"
              ],
              tags: ["static", "utility", "class-design", "methods"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "static-counter",
              type: "FULL_PROGRAM",
              title: "Static Instance Counter",
              prompt: "Define a static inner class `Ticket` with:\n- A static field `int nextId` starting at 1\n- A static field `int totalTickets` starting at 0\n- Instance fields: `int id`, `String event`\n- A constructor that takes an event name, auto-assigns the next id, and increments both counters\n- `static int getTotalTickets()` - returns how many tickets have been created\n- `String toString()` - returns \"Ticket #<id>: <event>\"\n\nIn main, read n event names (one per line). Create a Ticket for each. Print each ticket, then print \"Total tickets: <count>\".",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Ticket {
        // Static and instance fields, constructor, getTotalTickets, toString

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n events, create tickets, print each, then total

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Ticket {
        static int nextId = 1;
        static int totalTickets = 0;
        int id;
        String event;

        Ticket(String event) {
            this.id = nextId;
            this.event = event;
            nextId++;
            totalTickets++;
        }

        static int getTotalTickets() {
            return totalTickets;
        }

        public String toString() {
            return "Ticket #" + id + ": " + event;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        sc.nextLine();
        for (int i = 0; i < n; i++) {
            String event = sc.nextLine();
            Ticket t = new Ticket(event);
            System.out.println(t);
        }
        System.out.println("Total tickets: " + Ticket.getTotalTickets());
    }
}`,
              tests: [
                { input: "3\nConcert\nMovie\nPlay", expectedOutput: "Ticket #1: Concert\nTicket #2: Movie\nTicket #3: Play\nTotal tickets: 3", isHidden: false, description: "Three tickets" },
                { input: "1\nSports", expectedOutput: "Ticket #1: Sports\nTotal tickets: 1", isHidden: false, description: "Single ticket" },
                { input: "2\nOpera\nBallet", expectedOutput: "Ticket #1: Opera\nTicket #2: Ballet\nTotal tickets: 2", isHidden: true, description: "Two tickets" }
              ],
              hints: [
                "Static fields are shared across all instances of the class",
                "In the constructor, assign id = nextId, then increment nextId",
                "totalTickets tracks how many Ticket objects have been created"
              ],
              tags: ["static", "counter", "auto-id", "class-design"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "builder-like-pattern",
              type: "FULL_PROGRAM",
              title: "Fluent Builder Pattern",
              prompt: "Define a static inner class `Pizza` with fields: `String size`, `boolean cheese`, `boolean pepperoni`, `boolean mushrooms`.\n\nDefine a static inner class `PizzaBuilder` with the same fields (defaulting to \"Medium\", true, false, false) and methods:\n- `PizzaBuilder setSize(String s)` - sets size, returns this\n- `PizzaBuilder addPepperoni()` - sets pepperoni=true, returns this\n- `PizzaBuilder addMushrooms()` - sets mushrooms=true, returns this\n- `PizzaBuilder removeCheese()` - sets cheese=false, returns this\n- `Pizza build()` - creates and returns a Pizza with the current settings\n\nPizza should have a toString that prints toppings on a line: \"<size> Pizza: [toppings]\" where toppings are listed comma-separated from {cheese, pepperoni, mushrooms} if true.\n\nIn main, read a size string, then read toppings on one line (comma-separated: e.g. \"pepperoni,mushrooms\"). Build and print the pizza.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Pizza {
        String size;
        boolean cheese;
        boolean pepperoni;
        boolean mushrooms;

        // Constructor and toString

    }

    static class PizzaBuilder {
        // Fields with defaults, setter methods returning this, build method

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read size and toppings, build pizza, print it

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Pizza {
        String size;
        boolean cheese;
        boolean pepperoni;
        boolean mushrooms;

        Pizza(String size, boolean cheese, boolean pepperoni, boolean mushrooms) {
            this.size = size;
            this.cheese = cheese;
            this.pepperoni = pepperoni;
            this.mushrooms = mushrooms;
        }

        public String toString() {
            String toppings = "";
            if (cheese) toppings += "cheese";
            if (pepperoni) {
                if (!toppings.isEmpty()) toppings += ", ";
                toppings += "pepperoni";
            }
            if (mushrooms) {
                if (!toppings.isEmpty()) toppings += ", ";
                toppings += "mushrooms";
            }
            if (toppings.isEmpty()) toppings = "none";
            return size + " Pizza: " + toppings;
        }
    }

    static class PizzaBuilder {
        String size = "Medium";
        boolean cheese = true;
        boolean pepperoni = false;
        boolean mushrooms = false;

        PizzaBuilder setSize(String s) {
            this.size = s;
            return this;
        }

        PizzaBuilder addPepperoni() {
            this.pepperoni = true;
            return this;
        }

        PizzaBuilder addMushrooms() {
            this.mushrooms = true;
            return this;
        }

        PizzaBuilder removeCheese() {
            this.cheese = false;
            return this;
        }

        Pizza build() {
            return new Pizza(size, cheese, pepperoni, mushrooms);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String size = sc.nextLine();
        String toppingsLine = sc.nextLine();
        PizzaBuilder builder = new PizzaBuilder().setSize(size);
        String[] toppings = toppingsLine.split(",");
        for (String t : toppings) {
            t = t.trim();
            if (t.equals("pepperoni")) builder.addPepperoni();
            else if (t.equals("mushrooms")) builder.addMushrooms();
            else if (t.equals("no-cheese")) builder.removeCheese();
        }
        Pizza pizza = builder.build();
        System.out.println(pizza);
    }
}`,
              tests: [
                { input: "Large\npepperoni,mushrooms", expectedOutput: "Large Pizza: cheese, pepperoni, mushrooms", isHidden: false, description: "Large with all toppings" },
                { input: "Small\nno-cheese,pepperoni", expectedOutput: "Small Pizza: pepperoni", isHidden: false, description: "No cheese with pepperoni" },
                { input: "Medium\nnone", expectedOutput: "Medium Pizza: cheese", isHidden: true, description: "Default cheese only" }
              ],
              hints: [
                "Each setter method returns 'this' to allow method chaining: builder.setSize(s).addPepperoni()",
                "The build() method creates a new Pizza with the builder's current field values",
                "In toString, build the toppings string by checking each boolean flag"
              ],
              tags: ["design-pattern", "builder", "fluent-api", "class-design"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            }
          ]
        }
      ]
    },

    // ==================== Day 9: Inheritance & Polymorphism ====================
    {
      weekNumber: 9,
      title: "Inheritance & Polymorphism",
      description: "Inheritance, method overriding, polymorphism, and interfaces",
      topics: [
        {
          slug: "inheritance",
          title: "Inheritance & Overriding",
          introMarkdown: `## מה זה ירושה (Inheritance)?

**ירושה** מאפשרת למחלקה חדשה (תת-מחלקה) לרשת שדות ומתודות ממחלקה קיימת (מחלקת-על).

\`\`\`java
public class Animal {                // מחלקת-על
    protected String name;
    public Animal(String name) { this.name = name; }
    public String speak() { return "..."; }
}

public class Dog extends Animal {    // תת-מחלקה
    public Dog(String name) {
        super(name);                 // קריאה לבנאי של Animal
    }

    @Override
    public String speak() {          // דריסה
        return "Woof!";
    }
}
\`\`\`

## מילות מפתח

- **\`extends\`** — תת-מחלקה יורשת ממחלקת-על
- **\`super\`** — פנייה למחלקת-העל (בנאי, מתודות, שדות)
- **\`@Override\`** — סימון שדורסים מתודה (אופציונלי אבל מומלץ!)
- **\`protected\`** — נגיש לתת-מחלקות (בניגוד ל-private)

## כללי super()

- \`super()\` חייב להיות **השורה הראשונה** בבנאי
- אם לא כותבים \`super()\`, Java מוסיפה \`super()\` ריק אוטומטית
- אם למחלקת-העל אין בנאי ללא פרמטרים — **חייבים** לקרוא ל-super עם ארגומנטים

## ירושה רב-שלבית

\`\`\`java
class Animal { ... }
class Dog extends Animal { ... }
class GoldenRetriever extends Dog { ... }
// GoldenRetriever יורש מ-Dog שיורש מ-Animal
\`\`\`

**ב-Java אין ירושה מרובה** — מחלקה יכולה לרשת רק ממחלקה אחת!
`,
          description: "Extending classes, calling super, and overriding methods",
          questions: [
            {
              slug: "basic-extends",
              type: "FULL_PROGRAM",
              title: "Basic Inheritance (extends)",
              prompt: "Define a static inner class `Animal` with a field `String name` and a method `String speak()` that returns \"...\".\n\nDefine a static inner class `Dog` that extends Animal. Override `speak()` to return \"Woof!\".\n\nDefine a static inner class `Cat` that extends Animal. Override `speak()` to return \"Meow!\".\n\nIn main, read a type (\"dog\" or \"cat\") and a name. Create the appropriate object and print:\n<name> says <speak result>",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Animal {
        String name;
        Animal(String name) { this.name = name; }
        String speak() { return "..."; }
    }

    // Define Dog and Cat classes extending Animal

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read type and name, create object, print result

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Animal {
        String name;
        Animal(String name) { this.name = name; }
        String speak() { return "..."; }
    }

    static class Dog extends Animal {
        Dog(String name) { super(name); }
        String speak() { return "Woof!"; }
    }

    static class Cat extends Animal {
        Cat(String name) { super(name); }
        String speak() { return "Meow!"; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        String name = sc.next();
        Animal a;
        if (type.equals("dog")) {
            a = new Dog(name);
        } else {
            a = new Cat(name);
        }
        System.out.println(a.name + " says " + a.speak());
    }
}`,
              tests: [
                { input: "dog Rex", expectedOutput: "Rex says Woof!", isHidden: false, description: "Dog speaks" },
                { input: "cat Whiskers", expectedOutput: "Whiskers says Meow!", isHidden: false, description: "Cat speaks" },
                { input: "dog Buddy", expectedOutput: "Buddy says Woof!", isHidden: true, description: "Another dog" }
              ],
              hints: [
                "Use 'extends' to create a subclass: static class Dog extends Animal",
                "Call super(name) in the subclass constructor to pass the name to Animal's constructor",
                "Override speak() by defining it with the same signature in the subclass"
              ],
              tags: ["inheritance", "extends", "override", "super"],
              difficulty: 1,
              estimatedMinutes: 3,
              points: 15
            },
            {
              slug: "super-constructor",
              type: "FULL_PROGRAM",
              title: "Using super Constructor",
              prompt: "Define a static inner class `Vehicle` with fields `String make` and `int year`, a constructor, and a method `String info()` that returns \"<year> <make>\".\n\nDefine a static inner class `Car` that extends Vehicle and adds a field `int doors`. Its constructor takes make, year, and doors (calling super for the first two). Override `info()` to return \"<year> <make> (<doors>-door)\".\n\nIn main, read make, year, and doors. Create a Car and print its info.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Vehicle {
        String make;
        int year;
        Vehicle(String make, int year) {
            this.make = make;
            this.year = year;
        }
        String info() { return year + " " + make; }
    }

    // Define Car extending Vehicle

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read make, year, doors. Create Car, print info.

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Vehicle {
        String make;
        int year;
        Vehicle(String make, int year) {
            this.make = make;
            this.year = year;
        }
        String info() { return year + " " + make; }
    }

    static class Car extends Vehicle {
        int doors;
        Car(String make, int year, int doors) {
            super(make, year);
            this.doors = doors;
        }
        String info() { return year + " " + make + " (" + doors + "-door)"; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String make = sc.next();
        int year = sc.nextInt();
        int doors = sc.nextInt();
        Car c = new Car(make, year, doors);
        System.out.println(c.info());
    }
}`,
              tests: [
                { input: "Toyota 2022 4", expectedOutput: "2022 Toyota (4-door)", isHidden: false, description: "4-door Toyota" },
                { input: "Ford 2020 2", expectedOutput: "2020 Ford (2-door)", isHidden: false, description: "2-door Ford" },
                { input: "BMW 2024 4", expectedOutput: "2024 BMW (4-door)", isHidden: true, description: "BMW" }
              ],
              hints: [
                "Car's constructor must call super(make, year) as the first statement",
                "Then set this.doors = doors for the additional field",
                "Override info() by redefining it in Car with the enhanced format"
              ],
              tags: ["inheritance", "super", "constructor", "override"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "override-tostring",
              type: "FULL_PROGRAM",
              title: "Override toString in Hierarchy",
              prompt: "Define a static inner class `Shape` with a method `String getType()` that returns \"Shape\" and a `toString()` that returns \"Type: <getType()>\".\n\nDefine `Circle` extending Shape with a `double radius` field. Override `getType()` to return \"Circle\". Add a method `double area()` returning PI * r^2. Override `toString()` to return \"Type: Circle, Radius: <r>, Area: <area>\" where area is formatted to 2 decimal places.\n\nDefine `Square` extending Shape with a `double side` field. Override `getType()` to return \"Square\". Add `double area()` returning side^2. Override `toString()` similarly: \"Type: Square, Side: <s>, Area: <area>\".\n\nIn main, read a shape type (\"circle\" or \"square\") and a dimension. Create the object and print it.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Shape {
        String getType() { return "Shape"; }
        public String toString() { return "Type: " + getType(); }
    }

    // Define Circle and Square extending Shape

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read type and dimension, create shape, print it

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Shape {
        String getType() { return "Shape"; }
        public String toString() { return "Type: " + getType(); }
    }

    static class Circle extends Shape {
        double radius;
        Circle(double radius) { this.radius = radius; }
        String getType() { return "Circle"; }
        double area() { return Math.PI * radius * radius; }
        public String toString() {
            return String.format("Type: Circle, Radius: %.1f, Area: %.2f", radius, area());
        }
    }

    static class Square extends Shape {
        double side;
        Square(double side) { this.side = side; }
        String getType() { return "Square"; }
        double area() { return side * side; }
        public String toString() {
            return String.format("Type: Square, Side: %.1f, Area: %.2f", side, area());
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double dim = sc.nextDouble();
        Shape s;
        if (type.equals("circle")) {
            s = new Circle(dim);
        } else {
            s = new Square(dim);
        }
        System.out.println(s);
    }
}`,
              tests: [
                { input: "circle 5.0", expectedOutput: "Type: Circle, Radius: 5.0, Area: 78.54", isHidden: false, description: "Circle with radius 5" },
                { input: "square 4.0", expectedOutput: "Type: Square, Side: 4.0, Area: 16.00", isHidden: false, description: "Square with side 4" },
                { input: "circle 1.0", expectedOutput: "Type: Circle, Radius: 1.0, Area: 3.14", isHidden: true, description: "Unit circle" }
              ],
              hints: [
                "Each subclass overrides getType() and toString()",
                "Use String.format for precise decimal formatting",
                "Math.PI provides the value of pi for circle area calculation"
              ],
              tags: ["inheritance", "toString", "override", "shapes"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "override-method-behavior",
              type: "FULL_PROGRAM",
              title: "Override Method Behavior",
              prompt: "Define a static inner class `Employee` with fields `String name` and `double baseSalary`. Add a method `double calculatePay()` that returns baseSalary.\n\nDefine `Manager` extending Employee with an additional `double bonus` field. Override `calculatePay()` to return baseSalary + bonus.\n\nDefine `Intern` extending Employee. Override `calculatePay()` to return baseSalary * 0.5 (interns get half pay).\n\nIn main, read a role (\"employee\", \"manager\", or \"intern\"), a name, a base salary, and if manager also a bonus. Print \"<name>: $<pay>\" with pay formatted to 2 decimal places.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Employee {
        String name;
        double baseSalary;
        Employee(String name, double baseSalary) {
            this.name = name;
            this.baseSalary = baseSalary;
        }
        double calculatePay() { return baseSalary; }
    }

    // Define Manager and Intern extending Employee

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read role, name, salary (and bonus if manager), print pay

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Employee {
        String name;
        double baseSalary;
        Employee(String name, double baseSalary) {
            this.name = name;
            this.baseSalary = baseSalary;
        }
        double calculatePay() { return baseSalary; }
    }

    static class Manager extends Employee {
        double bonus;
        Manager(String name, double baseSalary, double bonus) {
            super(name, baseSalary);
            this.bonus = bonus;
        }
        double calculatePay() { return baseSalary + bonus; }
    }

    static class Intern extends Employee {
        Intern(String name, double baseSalary) {
            super(name, baseSalary);
        }
        double calculatePay() { return baseSalary * 0.5; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String role = sc.next();
        String name = sc.next();
        double salary = sc.nextDouble();
        Employee e;
        if (role.equals("manager")) {
            double bonus = sc.nextDouble();
            e = new Manager(name, salary, bonus);
        } else if (role.equals("intern")) {
            e = new Intern(name, salary);
        } else {
            e = new Employee(name, salary);
        }
        System.out.printf("%s: $%.2f%n", e.name, e.calculatePay());
    }
}`,
              tests: [
                { input: "employee Alice 5000.00", expectedOutput: "Alice: $5000.00", isHidden: false, description: "Regular employee" },
                { input: "manager Bob 5000.00 1500.00", expectedOutput: "Bob: $6500.00", isHidden: false, description: "Manager with bonus" },
                { input: "intern Eve 4000.00", expectedOutput: "Eve: $2000.00", isHidden: true, description: "Intern half pay" }
              ],
              hints: [
                "Manager's calculatePay returns baseSalary + bonus",
                "Intern's calculatePay returns baseSalary * 0.5",
                "The correct calculatePay is called based on the actual object type (polymorphism)"
              ],
              tags: ["inheritance", "override", "polymorphism", "method-dispatch"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "multi-level-inheritance",
              type: "FULL_PROGRAM",
              title: "Multi-Level Inheritance",
              prompt: "Create a three-level hierarchy of static inner classes:\n\n1. `LivingThing` with a method `String describe()` returning \"I am alive\"\n2. `Animal` extends LivingThing, adds field `String species`, overrides `describe()` to return \"I am a <species>\"\n3. `Pet` extends Animal, adds field `String ownerName`, overrides `describe()` to return \"I am a <species> owned by <ownerName>\"\n\nIn main, read a species and an owner name. Create a Pet object. Print the result of calling describe() on it. Then create an Animal with the same species and print its describe(). Then create a LivingThing and print its describe().",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class LivingThing {
        String describe() { return "I am alive"; }
    }

    // Define Animal and Pet extending the hierarchy

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read species and owner, create all three, print describe()

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class LivingThing {
        String describe() { return "I am alive"; }
    }

    static class Animal extends LivingThing {
        String species;
        Animal(String species) { this.species = species; }
        String describe() { return "I am a " + species; }
    }

    static class Pet extends Animal {
        String ownerName;
        Pet(String species, String ownerName) {
            super(species);
            this.ownerName = ownerName;
        }
        String describe() { return "I am a " + species + " owned by " + ownerName; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String species = sc.next();
        String owner = sc.next();
        Pet pet = new Pet(species, owner);
        Animal animal = new Animal(species);
        LivingThing thing = new LivingThing();
        System.out.println(pet.describe());
        System.out.println(animal.describe());
        System.out.println(thing.describe());
    }
}`,
              tests: [
                { input: "Dog Alice", expectedOutput: "I am a Dog owned by Alice\nI am a Dog\nI am alive", isHidden: false, description: "Dog owned by Alice" },
                { input: "Cat Bob", expectedOutput: "I am a Cat owned by Bob\nI am a Cat\nI am alive", isHidden: false, description: "Cat owned by Bob" },
                { input: "Parrot Eve", expectedOutput: "I am a Parrot owned by Eve\nI am a Parrot\nI am alive", isHidden: true, description: "Parrot" }
              ],
              hints: [
                "Each level adds more specific behavior while inheriting from the parent",
                "Pet extends Animal which extends LivingThing (3 levels)",
                "Each class overrides describe() to add more detail"
              ],
              tags: ["inheritance", "multi-level", "override", "hierarchy"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            }
          ]
        },
        {
          slug: "polymorphism",
          title: "Polymorphism & Abstract Classes",
          introMarkdown: `## מה זה פולימורפיזם (Polymorphism)?

**פולימורפיזם** — "ריבוי צורות". משתנה מטיפוס מחלקת-על יכול להצביע לאובייקט של תת-מחלקה, והמתודה שתרוץ תיקבע **בזמן ריצה**.

\`\`\`java
Animal a = new Dog("Rex");   // משתנה Animal, אובייקט Dog
a.speak();                   // "Woof!" — הגרסה של Dog רצה!
\`\`\`

## Abstract Class — מחלקה מופשטת

מחלקה שלא ניתן ליצור ממנה אובייקטים, רק לרשת:

\`\`\`java
public abstract class Shape {
    abstract double area();        // מתודה מופשטת — בלי מימוש

    public void printArea() {      // מתודה רגילה — עם מימוש
        System.out.println("Area: " + area());
    }
}

public class Circle extends Shape {
    private double radius;
    public Circle(double r) { this.radius = r; }

    @Override
    double area() { return Math.PI * radius * radius; }
}
\`\`\`

## Interface — ממשק

חוזה שמחלקה **חייבת** לממש:

\`\`\`java
public interface Printable {
    void print();     // מתודה מופשטת (אוטומטית)
}

public class Report implements Printable {
    @Override
    public void print() { System.out.println("Report..."); }
}
\`\`\`

## instanceof — בדיקת טיפוס

\`\`\`java
if (animal instanceof Dog) {
    Dog d = (Dog) animal;  // Downcasting — בטוח אחרי instanceof
    d.fetch();
}
\`\`\`

## מערך פולימורפי

\`\`\`java
Shape[] shapes = { new Circle(5), new Rectangle(3, 4) };
for (Shape s : shapes) {
    System.out.println(s.area());  // כל shape מריץ את ה-area שלו
}
\`\`\`
`,
          description: "Abstract classes, polymorphic collections, and interfaces",
          questions: [
            {
              slug: "abstract-class",
              type: "FULL_PROGRAM",
              title: "Abstract Shape Class",
              prompt: "Define an abstract static inner class `Shape` with an abstract method `double area()` and a concrete method `String describe()` that returns \"Area: <area>\" formatted to 2 decimal places.\n\nDefine `Rectangle` extending Shape with `double width` and `double height`. Implement `area()` as width * height.\n\nDefine `Triangle` extending Shape with `double base` and `double height`. Implement `area()` as 0.5 * base * height.\n\nIn main, read a shape type (\"rectangle\" or \"triangle\") and the dimensions. Create the object and print its describe() output.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static abstract class Shape {
        abstract double area();
        String describe() {
            return String.format("Area: %.2f", area());
        }
    }

    // Define Rectangle and Triangle extending Shape

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read type and dimensions, create shape, print describe()

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static abstract class Shape {
        abstract double area();
        String describe() {
            return String.format("Area: %.2f", area());
        }
    }

    static class Rectangle extends Shape {
        double width;
        double height;
        Rectangle(double width, double height) {
            this.width = width;
            this.height = height;
        }
        double area() { return width * height; }
    }

    static class Triangle extends Shape {
        double base;
        double height;
        Triangle(double base, double height) {
            this.base = base;
            this.height = height;
        }
        double area() { return 0.5 * base * height; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        double d1 = sc.nextDouble();
        double d2 = sc.nextDouble();
        Shape s;
        if (type.equals("rectangle")) {
            s = new Rectangle(d1, d2);
        } else {
            s = new Triangle(d1, d2);
        }
        System.out.println(s.describe());
    }
}`,
              tests: [
                { input: "rectangle 5.0 3.0", expectedOutput: "Area: 15.00", isHidden: false, description: "Rectangle 5x3" },
                { input: "triangle 6.0 4.0", expectedOutput: "Area: 12.00", isHidden: false, description: "Triangle base 6 height 4" },
                { input: "rectangle 10.0 10.0", expectedOutput: "Area: 100.00", isHidden: true, description: "Square rectangle" }
              ],
              hints: [
                "An abstract class cannot be instantiated directly; subclasses must implement abstract methods",
                "The concrete describe() method calls the abstract area() method (template method pattern)",
                "Rectangle area = width * height; Triangle area = 0.5 * base * height"
              ],
              tags: ["abstract", "polymorphism", "shapes", "template-method"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "polymorphic-array",
              type: "FULL_PROGRAM",
              title: "Polymorphic Array",
              prompt: "Using the same Shape/Rectangle/Triangle hierarchy (define them again):\n\nIn main, read an integer n. Then read n shapes, each described by a line: \"rectangle <w> <h>\" or \"triangle <b> <h>\". Store all shapes in a `Shape[]` array.\n\nPrint each shape's area (formatted to 2 decimal places) on its own line. Then print the total area of all shapes on a final line: \"Total: <sum>\" (also 2 decimal places).",
              starterCode: `import java.util.Scanner;

public class Solution {

    static abstract class Shape {
        abstract double area();
    }

    static class Rectangle extends Shape {
        double width, height;
        Rectangle(double w, double h) { this.width = w; this.height = h; }
        double area() { return width * height; }
    }

    static class Triangle extends Shape {
        double base, height;
        Triangle(double b, double h) { this.base = b; this.height = h; }
        double area() { return 0.5 * base * height; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n shapes, print each area, then total

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static abstract class Shape {
        abstract double area();
    }

    static class Rectangle extends Shape {
        double width, height;
        Rectangle(double w, double h) { this.width = w; this.height = h; }
        double area() { return width * height; }
    }

    static class Triangle extends Shape {
        double base, height;
        Triangle(double b, double h) { this.base = b; this.height = h; }
        double area() { return 0.5 * base * height; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            double d1 = sc.nextDouble();
            double d2 = sc.nextDouble();
            if (type.equals("rectangle")) {
                shapes[i] = new Rectangle(d1, d2);
            } else {
                shapes[i] = new Triangle(d1, d2);
            }
        }
        double total = 0;
        for (int i = 0; i < n; i++) {
            System.out.printf("%.2f%n", shapes[i].area());
            total += shapes[i].area();
        }
        System.out.printf("Total: %.2f%n", total);
    }
}`,
              tests: [
                { input: "3\nrectangle 5 3\ntriangle 6 4\nrectangle 2 2", expectedOutput: "15.00\n12.00\n4.00\nTotal: 31.00", isHidden: false, description: "Mixed shapes" },
                { input: "1\ntriangle 10 5", expectedOutput: "25.00\nTotal: 25.00", isHidden: false, description: "Single triangle" },
                { input: "2\nrectangle 3 3\nrectangle 4 4", expectedOutput: "9.00\n16.00\nTotal: 25.00", isHidden: true, description: "Two rectangles" }
              ],
              hints: [
                "Declare the array as Shape[] to hold different shape types (polymorphism)",
                "Each element can be a Rectangle or Triangle since both extend Shape",
                "Calling area() on each Shape invokes the correct overridden version"
              ],
              tags: ["polymorphism", "arrays", "abstract", "dynamic-dispatch"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "interface-implementation",
              type: "FULL_PROGRAM",
              title: "Interface Implementation",
              prompt: "Define a static interface `Printable` with a method `String toPrintString()`.\n\nDefine a static inner class `Book` implementing Printable with fields `String title` and `String author`. Implement `toPrintString()` to return \"<title> by <author>\".\n\nDefine a static inner class `Invoice` implementing Printable with fields `int id` and `double amount`. Implement `toPrintString()` to return \"Invoice #<id>: $<amount>\" (amount to 2 decimal places).\n\nIn main, read a type (\"book\" or \"invoice\"). For book, read title and author. For invoice, read id and amount. Create the object and print its toPrintString().",
              starterCode: `import java.util.Scanner;

public class Solution {

    interface Printable {
        String toPrintString();
    }

    // Define Book and Invoice implementing Printable

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read type and data, create object, print toPrintString()

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    interface Printable {
        String toPrintString();
    }

    static class Book implements Printable {
        String title;
        String author;
        Book(String title, String author) {
            this.title = title;
            this.author = author;
        }
        public String toPrintString() {
            return title + " by " + author;
        }
    }

    static class Invoice implements Printable {
        int id;
        double amount;
        Invoice(int id, double amount) {
            this.id = id;
            this.amount = amount;
        }
        public String toPrintString() {
            return String.format("Invoice #%d: $%.2f", id, amount);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String type = sc.next();
        Printable p;
        if (type.equals("book")) {
            sc.nextLine();
            String title = sc.nextLine();
            String author = sc.nextLine();
            p = new Book(title, author);
        } else {
            int id = sc.nextInt();
            double amount = sc.nextDouble();
            p = new Invoice(id, amount);
        }
        System.out.println(p.toPrintString());
    }
}`,
              tests: [
                { input: "book\nJava Programming\nJohn Smith", expectedOutput: "Java Programming by John Smith", isHidden: false, description: "Book" },
                { input: "invoice\n1001 250.50", expectedOutput: "Invoice #1001: $250.50", isHidden: false, description: "Invoice" },
                { input: "book\nClean Code\nRobert Martin", expectedOutput: "Clean Code by Robert Martin", isHidden: true, description: "Another book" }
              ],
              hints: [
                "An interface defines a contract: classes that implement it must provide the method",
                "Use 'implements' keyword: static class Book implements Printable",
                "The Printable variable can hold either a Book or Invoice reference (polymorphism)"
              ],
              tags: ["interface", "implements", "polymorphism", "contract"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "type-checking-instanceof",
              type: "FULL_PROGRAM",
              title: "Type Checking with instanceof",
              prompt: "Define a static inner class hierarchy: `Animal` (base) with a `String name` field, `Dog` extends Animal with a `String breed` field, `Cat` extends Animal with a `boolean isIndoor` field.\n\nIn main, read n animals. Each line has the format:\n- \"dog <name> <breed>\"\n- \"cat <name> <indoor/outdoor>\"\n\nStore them in an `Animal[]` array. Then loop through and print info for each:\n- For Dog: \"<name> (Dog, breed: <breed>)\"\n- For Cat: \"<name> (Cat, <indoor/outdoor>)\"\n\nUse instanceof to determine the actual type.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Animal {
        String name;
        Animal(String name) { this.name = name; }
    }

    static class Dog extends Animal {
        String breed;
        Dog(String name, String breed) { super(name); this.breed = breed; }
    }

    static class Cat extends Animal {
        boolean isIndoor;
        Cat(String name, boolean isIndoor) { super(name); this.isIndoor = isIndoor; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n animals, store in array, print info using instanceof

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Animal {
        String name;
        Animal(String name) { this.name = name; }
    }

    static class Dog extends Animal {
        String breed;
        Dog(String name, String breed) { super(name); this.breed = breed; }
    }

    static class Cat extends Animal {
        boolean isIndoor;
        Cat(String name, boolean isIndoor) { super(name); this.isIndoor = isIndoor; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Animal[] animals = new Animal[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            String name = sc.next();
            if (type.equals("dog")) {
                String breed = sc.next();
                animals[i] = new Dog(name, breed);
            } else {
                String indoorStr = sc.next();
                animals[i] = new Cat(name, indoorStr.equals("indoor"));
            }
        }
        for (int i = 0; i < n; i++) {
            if (animals[i] instanceof Dog) {
                Dog d = (Dog) animals[i];
                System.out.println(d.name + " (Dog, breed: " + d.breed + ")");
            } else if (animals[i] instanceof Cat) {
                Cat c = (Cat) animals[i];
                String loc = c.isIndoor ? "indoor" : "outdoor";
                System.out.println(c.name + " (Cat, " + loc + ")");
            }
        }
    }
}`,
              tests: [
                { input: "3\ndog Rex Labrador\ncat Whiskers indoor\ndog Buddy Beagle", expectedOutput: "Rex (Dog, breed: Labrador)\nWhiskers (Cat, indoor)\nBuddy (Dog, breed: Beagle)", isHidden: false, description: "Mixed animals" },
                { input: "2\ncat Luna outdoor\ncat Milo indoor", expectedOutput: "Luna (Cat, outdoor)\nMilo (Cat, indoor)", isHidden: false, description: "Two cats" },
                { input: "1\ndog Max Poodle", expectedOutput: "Max (Dog, breed: Poodle)", isHidden: true, description: "Single dog" }
              ],
              hints: [
                "Use 'instanceof' to check the actual type: if (animals[i] instanceof Dog)",
                "After checking, cast to the specific type: Dog d = (Dog) animals[i];",
                "This lets you access subclass-specific fields like breed or isIndoor"
              ],
              tags: ["instanceof", "type-checking", "casting", "polymorphism"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            }
          ]
        }
      ]
    },

    // ==================== Day 10: Integration Review ====================
    {
      weekNumber: 10,
      title: "Integration Review",
      description: "Mixed-topic exam preparation covering all concepts",
      topics: [
        {
          slug: "mixed-fundamentals",
          title: "Mixed Review: Fundamentals",
          introMarkdown: `## חזרה מהירה — יסודות

## מערכים + מתודות

זכרו: מערך עובר למתודה **by reference** — שינויים בתוך המתודה משפיעים על המקור!

\`\`\`java
public static double average(int[] arr) {
    int sum = 0;
    for (int x : arr) sum += x;
    return (double) sum / arr.length;
}
\`\`\`

## מחרוזות — מתודות שימושיות

| מתודה | תיאור |
|--------|--------|
| \`s.length()\` | אורך |
| \`s.charAt(i)\` | תו באינדקס i |
| \`s.substring(a, b)\` | תת-מחרוזת מ-a עד b (לא כולל) |
| \`s.indexOf("x")\` | אינדקס ראשון של "x" (-1 אם אין) |
| \`s.toUpperCase()\` | להגדיל אותיות |
| \`s.equals(other)\` | השוואת תוכן (לא ==!) |
| \`s.split(" ")\` | פיצול למערך מחרוזות |

## לולאות מקוננות + מערכים

\`\`\`java
// חיפוש ערך במטריצה
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] == target) return true;
    }
}
\`\`\`

## טיפים למבחן

- קראו את השאלה **פעמיים** לפני שמתחילים
- שימו לב ל-**פורמט הפלט** — רווחים, שורות חדשות
- בדקו **מקרי קצה**: מערך ריק, n=0, n=1
- אם יש \`double\` — שימו לב לחילוק שלמים!
`,
          description: "Combined exercises covering arrays, loops, methods, and string manipulation",
          questions: [
            {
              slug: "array-stats-with-methods",
              type: "FULL_PROGRAM",
              title: "Array Statistics with Methods",
              prompt: "Write a program with these static methods:\n- `int sum(int[] arr)` - returns the sum of the array\n- `double average(int[] arr)` - returns the average\n- `int countAboveAverage(int[] arr)` - returns how many elements are strictly above the average\n\nIn main, read n integers into an array. Print:\nSum: <sum>\nAverage: <average to 2 decimal places>\nAbove average: <count>",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static int sum(int[] arr) {
        // Return the sum of all elements

    }

    public static double average(int[] arr) {
        // Return the average

    }

    public static int countAboveAverage(int[] arr) {
        // Return count of elements above the average

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n integers, call methods, print results

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static int sum(int[] arr) {
        int s = 0;
        for (int x : arr) s += x;
        return s;
    }

    public static double average(int[] arr) {
        return (double) sum(arr) / arr.length;
    }

    public static int countAboveAverage(int[] arr) {
        double avg = average(arr);
        int count = 0;
        for (int x : arr) {
            if (x > avg) count++;
        }
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        System.out.println("Sum: " + sum(arr));
        System.out.printf("Average: %.2f%n", average(arr));
        System.out.println("Above average: " + countAboveAverage(arr));
    }
}`,
              tests: [
                { input: "5\n10 20 30 40 50", expectedOutput: "Sum: 150\nAverage: 30.00\nAbove average: 2", isHidden: false, description: "Normal case" },
                { input: "4\n5 5 5 5", expectedOutput: "Sum: 20\nAverage: 5.00\nAbove average: 0", isHidden: false, description: "All equal" },
                { input: "3\n1 2 100", expectedOutput: "Sum: 103\nAverage: 34.33\nAbove average: 1", isHidden: true, description: "Skewed distribution" }
              ],
              hints: [
                "Build average() on top of sum(): (double) sum(arr) / arr.length",
                "countAboveAverage should call average() to get the threshold, then loop and count",
                "Use strictly greater than (>) when comparing to the average"
              ],
              tags: ["arrays", "methods", "loops", "statistics", "review"],
              difficulty: 2,
              estimatedMinutes: 5,
              points: 25
            },
            {
              slug: "string-manipulation-with-methods",
              type: "FULL_PROGRAM",
              title: "String Manipulation with Methods",
              prompt: "Write a program with these static methods:\n- `String capitalize(String s)` - returns the string with the first letter uppercased and the rest lowercased\n- `int countVowels(String s)` - returns the count of vowels (a, e, i, o, u, case-insensitive)\n- `String removeVowels(String s)` - returns the string with all vowels removed\n\nIn main, read a single word. Print:\nCapitalized: <result>\nVowels: <count>\nWithout vowels: <result>",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static String capitalize(String s) {
        // First letter uppercase, rest lowercase

    }

    public static int countVowels(String s) {
        // Count vowels (case-insensitive)

    }

    public static String removeVowels(String s) {
        // Remove all vowels from s

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read word, call methods, print results

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static String capitalize(String s) {
        if (s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase();
    }

    public static int countVowels(String s) {
        int count = 0;
        String vowels = "aeiouAEIOU";
        for (int i = 0; i < s.length(); i++) {
            if (vowels.indexOf(s.charAt(i)) >= 0) {
                count++;
            }
        }
        return count;
    }

    public static String removeVowels(String s) {
        String result = "";
        String vowels = "aeiouAEIOU";
        for (int i = 0; i < s.length(); i++) {
            if (vowels.indexOf(s.charAt(i)) < 0) {
                result += s.charAt(i);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String word = sc.next();
        System.out.println("Capitalized: " + capitalize(word));
        System.out.println("Vowels: " + countVowels(word));
        System.out.println("Without vowels: " + removeVowels(word));
    }
}`,
              tests: [
                { input: "hELLO", expectedOutput: "Capitalized: Hello\nVowels: 2\nWithout vowels: hLL", isHidden: false, description: "Mixed case" },
                { input: "JAVA", expectedOutput: "Capitalized: Java\nVowels: 2\nWithout vowels: JV", isHidden: false, description: "All uppercase" },
                { input: "rhythm", expectedOutput: "Capitalized: Rhythm\nVowels: 0\nWithout vowels: rhythm", isHidden: true, description: "No vowels" }
              ],
              hints: [
                "capitalize: use Character.toUpperCase() on charAt(0) and .toLowerCase() on substring(1)",
                "Check vowels with a string of all vowels and indexOf: \"aeiouAEIOU\".indexOf(ch) >= 0",
                "removeVowels builds a new string from non-vowel characters"
              ],
              tags: ["strings", "methods", "char", "loops", "review"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "nested-loops-with-conditions",
              type: "FULL_PROGRAM",
              title: "Prime Sieve with Methods",
              prompt: "Write a program with a static method `boolean isPrime(int n)` that returns true if n is prime.\n\nIn main, read two integers `low` and `high`. Print all prime numbers in the range [low, high] on one line separated by spaces. On the next line, print the count of primes found.\n\nIf no primes are found, print \"No primes\" on the first line and \"0\" on the second line.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static boolean isPrime(int n) {
        // Return true if n is prime

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read low and high, find and print primes in range

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int low = sc.nextInt();
        int high = sc.nextInt();
        String primes = "";
        int count = 0;
        for (int i = low; i <= high; i++) {
            if (isPrime(i)) {
                if (count > 0) primes += " ";
                primes += i;
                count++;
            }
        }
        if (count == 0) {
            System.out.println("No primes");
        } else {
            System.out.println(primes);
        }
        System.out.println(count);
    }
}`,
              tests: [
                { input: "1 20", expectedOutput: "2 3 5 7 11 13 17 19\n8", isHidden: false, description: "Primes 1 to 20" },
                { input: "10 15", expectedOutput: "11 13\n2", isHidden: false, description: "Small range" },
                { input: "24 28", expectedOutput: "No primes\n0", isHidden: true, description: "No primes in range" },
                { input: "2 2", expectedOutput: "2\n1", isHidden: true, description: "Single prime" }
              ],
              hints: [
                "isPrime checks divisibility from 2 to sqrt(n); numbers <= 1 are not prime",
                "Loop from low to high, calling isPrime on each number",
                "Build a space-separated string of primes and keep a running count"
              ],
              tags: ["methods", "loops", "prime", "range", "review"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "array-rotation-with-methods",
              type: "FUNCTION",
              title: "Array Rotation",
              prompt: "Write a static method `void rotateRight(int[] arr, int k)` that rotates the array to the right by k positions. For example, rotating [1,2,3,4,5] right by 2 gives [4,5,1,2,3].\n\nHint: k may be larger than the array length; use k % arr.length.\n\nThe main method reads n integers, then k. It rotates the array and prints the elements space-separated.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static void rotateRight(int[] arr, int k) {
        // Rotate the array right by k positions

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int k = sc.nextInt();
        rotateRight(arr, k);
        for (int i = 0; i < n; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(arr[i]);
        }
        System.out.println();
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static void rotateRight(int[] arr, int k) {
        int n = arr.length;
        k = k % n;
        if (k == 0) return;
        int[] temp = new int[n];
        for (int i = 0; i < n; i++) {
            temp[(i + k) % n] = arr[i];
        }
        for (int i = 0; i < n; i++) {
            arr[i] = temp[i];
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int k = sc.nextInt();
        rotateRight(arr, k);
        for (int i = 0; i < n; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(arr[i]);
        }
        System.out.println();
    }
}`,
              tests: [
                { input: "5\n1 2 3 4 5\n2", expectedOutput: "4 5 1 2 3", isHidden: false, description: "Rotate right by 2" },
                { input: "4\n10 20 30 40\n1", expectedOutput: "40 10 20 30", isHidden: false, description: "Rotate right by 1" },
                { input: "3\n1 2 3\n6", expectedOutput: "1 2 3", isHidden: true, description: "k is multiple of n" },
                { input: "5\n5 4 3 2 1\n7", expectedOutput: "4 3 2 1 5", isHidden: true, description: "k larger than n" }
              ],
              hints: [
                "First normalize k with k = k % arr.length to handle k >= n",
                "The new position of element at index i is (i + k) % n",
                "Use a temporary array to avoid overwriting values during rotation"
              ],
              tags: ["arrays", "methods", "rotation", "modulo", "review"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            }
          ]
        },
        {
          slug: "mixed-oop",
          title: "Mixed Review: OOP",
          introMarkdown: `## חזרה מהירה — OOP

## צ'קליסט לבניית מחלקה

1. **שדות** — \`private\`, טיפוסים נכונים
2. **בנאי** — מקבל פרמטרים, \`this.field = field\`
3. **Getters/Setters** — ולידציה ב-setter
4. **toString()** — הדפסה קריאה
5. **equals()** — השוואת תוכן

## ירושה — תבנית

\`\`\`java
public class Parent {
    protected int x;
    public Parent(int x) { this.x = x; }
}

public class Child extends Parent {
    private int y;
    public Child(int x, int y) {
        super(x);       // חייב להיות ראשון!
        this.y = y;
    }
    @Override
    public String toString() {
        return x + ", " + y;
    }
}
\`\`\`

## Interface vs Abstract Class

| | Abstract Class | Interface |
|--|---------------|-----------|
| **מופעים** | לא | לא |
| **בנאי** | כן | לא |
| **שדות** | כן | רק \`static final\` |
| **ירושה** | אחד בלבד | כמה interfaces |
| **מתודות** | abstract + רגילות | abstract (+ default) |

## טעויות נפוצות במבחן

- שכחו \`super()\` בבנאי → שגיאת קומפילציה
- שכחו \`@Override\` → יצרו מתודה חדשה במקום לדרוס
- השוואה עם \`==\` במקום \`equals()\`
- גישה ל-\`private\` שדה של מחלקת-על → צריך \`protected\` או getter
`,
          description: "Combined exercises covering classes, inheritance, and polymorphism",
          questions: [
            {
              slug: "full-class-hierarchy",
              type: "FULL_PROGRAM",
              title: "Full Class Hierarchy",
              prompt: "Create a class hierarchy for a library system:\n\n1. `LibraryItem` (base class): fields `String title`, `int year`. Constructor takes both. Method `String getInfo()` returns \"<title> (<year>)\".\n\n2. `Book` extends LibraryItem: adds field `String author`. Override `getInfo()` to return \"Book: <title> by <author> (<year>)\".\n\n3. `DVD` extends LibraryItem: adds field `int duration` (minutes). Override `getInfo()` to return \"DVD: <title> (<year>) - <duration>min\".\n\nIn main, read n items. Each line is: \"book <title> <author> <year>\" or \"dvd <title> <duration> <year>\" (title is a single word). Store in a `LibraryItem[]` array and print each item's getInfo().",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class LibraryItem {
        // Define base class

    }

    // Define Book and DVD extending LibraryItem

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n items, store in array, print info

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class LibraryItem {
        String title;
        int year;
        LibraryItem(String title, int year) {
            this.title = title;
            this.year = year;
        }
        String getInfo() { return title + " (" + year + ")"; }
    }

    static class Book extends LibraryItem {
        String author;
        Book(String title, String author, int year) {
            super(title, year);
            this.author = author;
        }
        String getInfo() { return "Book: " + title + " by " + author + " (" + year + ")"; }
    }

    static class DVD extends LibraryItem {
        int duration;
        DVD(String title, int duration, int year) {
            super(title, year);
            this.duration = duration;
        }
        String getInfo() { return "DVD: " + title + " (" + year + ") - " + duration + "min"; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        LibraryItem[] items = new LibraryItem[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            if (type.equals("book")) {
                String title = sc.next();
                String author = sc.next();
                int year = sc.nextInt();
                items[i] = new Book(title, author, year);
            } else {
                String title = sc.next();
                int duration = sc.nextInt();
                int year = sc.nextInt();
                items[i] = new DVD(title, duration, year);
            }
        }
        for (int i = 0; i < n; i++) {
            System.out.println(items[i].getInfo());
        }
    }
}`,
              tests: [
                { input: "3\nbook Java Smith 2020\ndvd Matrix 136 1999\nbook Python Jones 2021", expectedOutput: "Book: Java by Smith (2020)\nDVD: Matrix (1999) - 136min\nBook: Python by Jones (2021)", isHidden: false, description: "Mixed items" },
                { input: "1\ndvd Inception 148 2010", expectedOutput: "DVD: Inception (2010) - 148min", isHidden: false, description: "Single DVD" },
                { input: "2\nbook Algorithms Cormen 2009\nbook Design Gamma 1994", expectedOutput: "Book: Algorithms by Cormen (2009)\nBook: Design by Gamma (1994)", isHidden: true, description: "Two books" }
              ],
              hints: [
                "LibraryItem is the base with common fields title and year",
                "Book and DVD extend LibraryItem and add their own fields",
                "Store all items in a LibraryItem[] array and call getInfo() polymorphically"
              ],
              tags: ["inheritance", "polymorphism", "arrays", "hierarchy", "review"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "interface-inheritance-combo",
              type: "FULL_PROGRAM",
              title: "Interface + Inheritance Combo",
              prompt: "Define a static interface `Measurable` with a method `double getMeasurement()`.\n\nDefine a static abstract class `Shape` implementing Measurable with an abstract method `String getName()`.\n\nDefine `Circle` extending Shape with field `double radius`. Implement `getMeasurement()` to return the area (PI * r^2). Implement `getName()` to return \"Circle\".\n\nDefine `Line` implementing Measurable (not extending Shape) with field `double length`. Implement `getMeasurement()` to return the length.\n\nIn main, read n items. Each line is \"circle <radius>\" or \"line <length>\". Store all in a `Measurable[]` array. Print each item's measurement (2 decimal places). Then print the item with the largest measurement in format: \"Largest: <measurement>\".",
              starterCode: `import java.util.Scanner;

public class Solution {

    interface Measurable {
        double getMeasurement();
    }

    static abstract class Shape implements Measurable {
        abstract String getName();
    }

    // Define Circle (extends Shape) and Line (implements Measurable)

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n items, store in Measurable[], print measurements and largest

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    interface Measurable {
        double getMeasurement();
    }

    static abstract class Shape implements Measurable {
        abstract String getName();
    }

    static class Circle extends Shape {
        double radius;
        Circle(double radius) { this.radius = radius; }
        public double getMeasurement() { return Math.PI * radius * radius; }
        String getName() { return "Circle"; }
    }

    static class Line implements Measurable {
        double length;
        Line(double length) { this.length = length; }
        public double getMeasurement() { return length; }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Measurable[] items = new Measurable[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            double val = sc.nextDouble();
            if (type.equals("circle")) {
                items[i] = new Circle(val);
            } else {
                items[i] = new Line(val);
            }
        }
        double maxVal = -1;
        for (int i = 0; i < n; i++) {
            double m = items[i].getMeasurement();
            System.out.printf("%.2f%n", m);
            if (m > maxVal) {
                maxVal = m;
            }
        }
        System.out.printf("Largest: %.2f%n", maxVal);
    }
}`,
              tests: [
                { input: "3\ncircle 5.0\nline 100.0\ncircle 1.0", expectedOutput: "78.54\n100.00\n3.14\nLargest: 100.00", isHidden: false, description: "Mixed measurables" },
                { input: "2\nline 50.0\nline 75.0", expectedOutput: "50.00\n75.00\nLargest: 75.00", isHidden: false, description: "Two lines" },
                { input: "1\ncircle 10.0", expectedOutput: "314.16\nLargest: 314.16", isHidden: true, description: "Single circle" }
              ],
              hints: [
                "Measurable is the common interface; both Circle (via Shape) and Line implement it",
                "Store everything in a Measurable[] array since both types implement the interface",
                "Track the maximum measurement while printing each one"
              ],
              tags: ["interface", "abstract", "inheritance", "polymorphism", "review"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            },
            {
              slug: "complex-class-with-arrays",
              type: "FULL_PROGRAM",
              title: "Classroom Manager",
              prompt: "Define static inner classes:\n\n`Student` with `String name` and `int score`. Constructor takes both. Method `String toString()` returns \"<name>: <score>\".\n\n`Classroom` with a `Student[]` array (max 30) and `int size`. Methods:\n- `void addStudent(String name, int score)` - adds a student if not full\n- `double getAverage()` - average of all scores (0.0 if empty)\n- `Student getTopStudent()` - returns student with highest score (null if empty)\n- `int countPassing(int threshold)` - count of students with score >= threshold\n\nIn main, read n students (name and score per line). Then read a passing threshold. Print:\nClass average: <avg to 1 decimal>\nTop student: <name>: <score>\nPassing: <count>/<total>",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Student {
        // name, score, constructor, toString

    }

    static class Classroom {
        // Student array, size, methods

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read students, threshold, print stats

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Student {
        String name;
        int score;
        Student(String name, int score) {
            this.name = name;
            this.score = score;
        }
        public String toString() {
            return name + ": " + score;
        }
    }

    static class Classroom {
        Student[] students = new Student[30];
        int size = 0;

        void addStudent(String name, int score) {
            if (size < 30) {
                students[size] = new Student(name, score);
                size++;
            }
        }

        double getAverage() {
            if (size == 0) return 0.0;
            int sum = 0;
            for (int i = 0; i < size; i++) {
                sum += students[i].score;
            }
            return (double) sum / size;
        }

        Student getTopStudent() {
            if (size == 0) return null;
            Student top = students[0];
            for (int i = 1; i < size; i++) {
                if (students[i].score > top.score) {
                    top = students[i];
                }
            }
            return top;
        }

        int countPassing(int threshold) {
            int count = 0;
            for (int i = 0; i < size; i++) {
                if (students[i].score >= threshold) {
                    count++;
                }
            }
            return count;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Classroom room = new Classroom();
        for (int i = 0; i < n; i++) {
            String name = sc.next();
            int score = sc.nextInt();
            room.addStudent(name, score);
        }
        int threshold = sc.nextInt();
        System.out.printf("Class average: %.1f%n", room.getAverage());
        System.out.println("Top student: " + room.getTopStudent());
        System.out.println("Passing: " + room.countPassing(threshold) + "/" + n);
    }
}`,
              tests: [
                { input: "4\nAlice 90\nBob 75\nEve 85\nDan 60\n70", expectedOutput: "Class average: 77.5\nTop student: Alice: 90\nPassing: 3/4", isHidden: false, description: "Four students" },
                { input: "3\nTom 50\nJim 50\nSam 50\n50", expectedOutput: "Class average: 50.0\nTop student: Tom: 50\nPassing: 3/3", isHidden: false, description: "All equal scores" },
                { input: "2\nAlex 95\nMax 30\n60", expectedOutput: "Class average: 62.5\nTop student: Alex: 95\nPassing: 1/2", isHidden: true, description: "One passing" }
              ],
              hints: [
                "Classroom manages a fixed-size array and tracks the current size",
                "getTopStudent loops through the array to find the highest score",
                "countPassing compares each student's score to the threshold with >="
              ],
              tags: ["classes", "arrays", "composition", "methods", "review"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            },
            {
              slug: "design-challenge",
              type: "FULL_PROGRAM",
              title: "Mini Gradebook System",
              prompt: "Design a complete gradebook system with these static inner classes:\n\n`Grade` with `String subject` and `int score`.\n\n`Student` with `String name`, a `Grade[]` array (max 10), and `int gradeCount`. Methods:\n- `void addGrade(String subject, int score)` - adds a grade\n- `double getAverage()` - returns average score across all grades\n- `String getHighestSubject()` - returns the subject with the highest score\n\n`Gradebook` with a `Student[]` array (max 20) and `int studentCount`. Methods:\n- `void addStudent(String name)` - adds a student\n- `Student findStudent(String name)` - returns the student with the given name (or null)\n- `String getTopStudent()` - returns the name of the student with the highest average\n\nIn main, read commands until \"done\":\n- \"add_student <name>\" - adds a student\n- \"add_grade <student_name> <subject> <score>\" - adds a grade to a student\n- \"print\" - prints each student's name, average (1 decimal), and best subject\n\nPrint format per student: \"<name>: avg=<average>, best=<subject>\".\nAfter print, print \"Top: <name>\" for the student with the highest average.",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class Grade {
        // subject and score

    }

    static class Student {
        // name, grades array, gradeCount, methods

    }

    static class Gradebook {
        // students array, studentCount, methods

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Process commands until "done"

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class Grade {
        String subject;
        int score;
        Grade(String subject, int score) {
            this.subject = subject;
            this.score = score;
        }
    }

    static class Student {
        String name;
        Grade[] grades = new Grade[10];
        int gradeCount = 0;

        Student(String name) {
            this.name = name;
        }

        void addGrade(String subject, int score) {
            if (gradeCount < 10) {
                grades[gradeCount] = new Grade(subject, score);
                gradeCount++;
            }
        }

        double getAverage() {
            if (gradeCount == 0) return 0.0;
            int sum = 0;
            for (int i = 0; i < gradeCount; i++) {
                sum += grades[i].score;
            }
            return (double) sum / gradeCount;
        }

        String getHighestSubject() {
            if (gradeCount == 0) return "none";
            int maxIdx = 0;
            for (int i = 1; i < gradeCount; i++) {
                if (grades[i].score > grades[maxIdx].score) {
                    maxIdx = i;
                }
            }
            return grades[maxIdx].subject;
        }
    }

    static class Gradebook {
        Student[] students = new Student[20];
        int studentCount = 0;

        void addStudent(String name) {
            if (studentCount < 20) {
                students[studentCount] = new Student(name);
                studentCount++;
            }
        }

        Student findStudent(String name) {
            for (int i = 0; i < studentCount; i++) {
                if (students[i].name.equals(name)) {
                    return students[i];
                }
            }
            return null;
        }

        String getTopStudent() {
            if (studentCount == 0) return "none";
            int topIdx = 0;
            for (int i = 1; i < studentCount; i++) {
                if (students[i].getAverage() > students[topIdx].getAverage()) {
                    topIdx = i;
                }
            }
            return students[topIdx].name;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Gradebook gb = new Gradebook();
        while (sc.hasNext()) {
            String cmd = sc.next();
            if (cmd.equals("done")) break;
            if (cmd.equals("add_student")) {
                String name = sc.next();
                gb.addStudent(name);
            } else if (cmd.equals("add_grade")) {
                String name = sc.next();
                String subject = sc.next();
                int score = sc.nextInt();
                Student s = gb.findStudent(name);
                if (s != null) {
                    s.addGrade(subject, score);
                }
            } else if (cmd.equals("print")) {
                for (int i = 0; i < gb.studentCount; i++) {
                    Student s = gb.students[i];
                    System.out.printf("%s: avg=%.1f, best=%s%n", s.name, s.getAverage(), s.getHighestSubject());
                }
                System.out.println("Top: " + gb.getTopStudent());
            }
        }
    }
}`,
              tests: [
                { input: "add_student Alice\nadd_student Bob\nadd_grade Alice Math 90\nadd_grade Alice Science 80\nadd_grade Bob Math 70\nadd_grade Bob Science 95\nprint\ndone", expectedOutput: "Alice: avg=85.0, best=Math\nBob: avg=82.5, best=Science\nTop: Alice", isHidden: false, description: "Two students with grades" },
                { input: "add_student Eve\nadd_grade Eve English 100\nprint\ndone", expectedOutput: "Eve: avg=100.0, best=English\nTop: Eve", isHidden: false, description: "Single student" },
                { input: "add_student Tom\nadd_student Sam\nadd_grade Tom History 60\nadd_grade Tom Art 90\nadd_grade Sam History 80\nadd_grade Sam Art 80\nprint\ndone", expectedOutput: "Tom: avg=75.0, best=Art\nSam: avg=80.0, best=History\nTop: Sam", isHidden: true, description: "Different averages" }
              ],
              hints: [
                "This problem combines multiple classes that interact with each other",
                "Gradebook contains Students, each Student contains Grades (composition)",
                "findStudent searches the array by name; getTopStudent compares averages"
              ],
              tags: ["classes", "composition", "arrays", "design", "review"],
              difficulty: 5,
              estimatedMinutes: 15,
              points: 100
            }
          ]
        },
        {
          slug: "exam-simulation",
          title: "Exam-Style Problems",
          introMarkdown: `## סימולציית מבחן

## מבנה שאלה טיפוסית במבחן

1. **קראו** את כל השאלה לפני שמתחילים
2. **זהו** את הנושאים: מערכים? OOP? רקורסיה?
3. **תכננו** את הפתרון על דף לפני שכותבים קוד
4. **כתבו** קוד נקי ומסודר
5. **בדקו** עם הדוגמאות שניתנו

## טיפים לניהול זמן

- **אל תתקעו** על שאלה אחת — עברו הלאה וחזרו
- **שאלות קלות קודם** — אספו נקודות ודאיות
- **5 דקות אחרונות** — בדיקה כללית

## טעויות שעולות ביוקר

| טעות | תיקון |
|------|--------|
| שכחת \`;\` | בדקו כל שורה |
| \`=\` במקום \`==\` | השוואה = שני שווים |
| חילוק שלמים | הוסיפו \`(double)\` |
| Off-by-one | \`<\` vs \`<=\`, \`length\` vs \`length-1\` |
| null reference | בדקו \`!= null\` לפני גישה |

## נוסחאות שימושיות

- **עצרת**: \`n! = n * (n-1) * ... * 1\`
- **חזקה**: \`Math.pow(base, exp)\`
- **שורש**: \`Math.sqrt(n)\`
- **ערך מוחלט**: \`Math.abs(n)\`
- **מקסימום/מינימום**: \`Math.max(a, b)\`, \`Math.min(a, b)\`

בהצלחה!
`,
          description: "Typical exam problems combining multiple concepts with increasing difficulty",
          questions: [
            {
              slug: "exam-matrix-diagonal",
              type: "FULL_PROGRAM",
              title: "Matrix Diagonal Sum",
              prompt: "Read an integer n, then read an n x n matrix of integers. Calculate and print the sum of the primary diagonal (top-left to bottom-right) and the sum of the secondary diagonal (top-right to bottom-left) on separate lines.\n\nIf n is odd, the center element is counted in both diagonals, but you should still print each diagonal sum independently.\n\nExample for n = 3 with matrix:\n1 2 3\n4 5 6\n7 8 9\n\nPrimary diagonal: 1 + 5 + 9 = 15\nSecondary diagonal: 3 + 5 + 7 = 15",
              starterCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read n x n matrix, compute and print diagonal sums

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                matrix[i][j] = sc.nextInt();
            }
        }
        int primary = 0;
        int secondary = 0;
        for (int i = 0; i < n; i++) {
            primary += matrix[i][i];
            secondary += matrix[i][n - 1 - i];
        }
        System.out.println(primary);
        System.out.println(secondary);
    }
}`,
              tests: [
                { input: "3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "15\n15", isHidden: false, description: "3x3 matrix" },
                { input: "2\n1 2\n3 4", expectedOutput: "5\n5", isHidden: false, description: "2x2 matrix" },
                { input: "4\n1 0 0 2\n0 3 4 0\n0 5 6 0\n7 0 0 8", expectedOutput: "18\n18", isHidden: true, description: "4x4 matrix" },
                { input: "1\n5", expectedOutput: "5\n5", isHidden: true, description: "1x1 matrix" }
              ],
              hints: [
                "Primary diagonal: elements at [i][i] for i = 0 to n-1",
                "Secondary diagonal: elements at [i][n-1-i] for i = 0 to n-1",
                "You can compute both sums in a single loop"
              ],
              tags: ["2d-arrays", "matrix", "loops", "exam"],
              difficulty: 3,
              estimatedMinutes: 8,
              points: 40
            },
            {
              slug: "exam-sorted-merge",
              type: "FUNCTION",
              title: "Merge Two Sorted Arrays",
              prompt: "Write a static method `int[] merge(int[] a, int[] b)` that merges two sorted arrays into a single sorted array.\n\nBoth input arrays are sorted in ascending order. The result should also be sorted in ascending order.\n\nThe main method reads two sorted arrays and prints the merged result, space-separated.",
              starterCode: `import java.util.Scanner;

public class Solution {

    public static int[] merge(int[] a, int[] b) {
        // Merge two sorted arrays into one sorted array

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int m = sc.nextInt();
        int[] b = new int[m];
        for (int i = 0; i < m; i++) b[i] = sc.nextInt();
        int[] result = merge(a, b);
        for (int i = 0; i < result.length; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(result[i]);
        }
        System.out.println();
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    public static int[] merge(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) {
                result[k++] = a[i++];
            } else {
                result[k++] = b[j++];
            }
        }
        while (i < a.length) result[k++] = a[i++];
        while (j < b.length) result[k++] = b[j++];
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int m = sc.nextInt();
        int[] b = new int[m];
        for (int i = 0; i < m; i++) b[i] = sc.nextInt();
        int[] result = merge(a, b);
        for (int i = 0; i < result.length; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(result[i]);
        }
        System.out.println();
    }
}`,
              tests: [
                { input: "3\n1 3 5\n3\n2 4 6", expectedOutput: "1 2 3 4 5 6", isHidden: false, description: "Interleaved" },
                { input: "2\n1 2\n3\n3 4 5", expectedOutput: "1 2 3 4 5", isHidden: false, description: "No overlap" },
                { input: "4\n1 1 2 2\n2\n1 2", expectedOutput: "1 1 1 2 2 2", isHidden: true, description: "Duplicates" },
                { input: "1\n5\n1\n3", expectedOutput: "3 5", isHidden: true, description: "Single element each" }
              ],
              hints: [
                "Use two pointers (i for array a, j for array b) starting at 0",
                "Compare a[i] and b[j]; put the smaller one into the result and advance that pointer",
                "After one array is exhausted, copy the remaining elements from the other"
              ],
              tags: ["arrays", "merge", "two-pointers", "sorting", "exam"],
              difficulty: 4,
              estimatedMinutes: 12,
              points: 60
            },
            {
              slug: "exam-text-analyzer",
              type: "FULL_PROGRAM",
              title: "Text Analyzer OOP",
              prompt: "Create a text analysis system:\n\nDefine `WordStats` with `String word` and `int count`. Constructor takes a word and sets count to 1. Method `void increment()` increases count.\n\nDefine `TextAnalyzer` with `WordStats[]` (max 100) and `int uniqueCount`. Methods:\n- `void addWord(String word)` - if the word exists, increment its count; otherwise add it\n- `String getMostFrequent()` - returns the most frequent word\n- `int getUniqueCount()` - returns the number of unique words\n\nIn main, read a single line of text. Split it into words (by spaces). Add each word (lowercased) to the analyzer. Print:\nUnique words: <count>\nMost frequent: <word>\nOccurrences: <count of most frequent>",
              starterCode: `import java.util.Scanner;

public class Solution {

    static class WordStats {
        // word, count, constructor, increment

    }

    static class TextAnalyzer {
        // array, uniqueCount, addWord, getMostFrequent, getUniqueCount

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read line, split into words, analyze, print stats

    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static class WordStats {
        String word;
        int count;
        WordStats(String word) {
            this.word = word;
            this.count = 1;
        }
        void increment() {
            count++;
        }
    }

    static class TextAnalyzer {
        WordStats[] stats = new WordStats[100];
        int uniqueCount = 0;

        void addWord(String word) {
            for (int i = 0; i < uniqueCount; i++) {
                if (stats[i].word.equals(word)) {
                    stats[i].increment();
                    return;
                }
            }
            if (uniqueCount < 100) {
                stats[uniqueCount] = new WordStats(word);
                uniqueCount++;
            }
        }

        String getMostFrequent() {
            if (uniqueCount == 0) return "";
            int maxIdx = 0;
            for (int i = 1; i < uniqueCount; i++) {
                if (stats[i].count > stats[maxIdx].count) {
                    maxIdx = i;
                }
            }
            return stats[maxIdx].word;
        }

        int getMostFrequentCount() {
            if (uniqueCount == 0) return 0;
            int maxIdx = 0;
            for (int i = 1; i < uniqueCount; i++) {
                if (stats[i].count > stats[maxIdx].count) {
                    maxIdx = i;
                }
            }
            return stats[maxIdx].count;
        }

        int getUniqueCount() {
            return uniqueCount;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        String[] words = line.split(" ");
        TextAnalyzer analyzer = new TextAnalyzer();
        for (String w : words) {
            analyzer.addWord(w.toLowerCase());
        }
        System.out.println("Unique words: " + analyzer.getUniqueCount());
        System.out.println("Most frequent: " + analyzer.getMostFrequent());
        System.out.println("Occurrences: " + analyzer.getMostFrequentCount());
    }
}`,
              tests: [
                { input: "the cat sat on the mat the cat", expectedOutput: "Unique words: 5\nMost frequent: the\nOccurrences: 3", isHidden: false, description: "Repeated words" },
                { input: "Java is fun and Java is great", expectedOutput: "Unique words: 5\nMost frequent: java\nOccurrences: 2", isHidden: false, description: "Case insensitive" },
                { input: "hello world", expectedOutput: "Unique words: 2\nMost frequent: hello\nOccurrences: 1", isHidden: true, description: "All unique" }
              ],
              hints: [
                "addWord searches the array for an existing word; if found, increment; otherwise add new",
                "Convert all words to lowercase before adding for case-insensitive counting",
                "getMostFrequent loops through to find the WordStats with the highest count"
              ],
              tags: ["classes", "arrays", "strings", "frequency", "exam"],
              difficulty: 5,
              estimatedMinutes: 15,
              points: 100
            },
            {
              slug: "exam-polymorphic-calculator",
              type: "FULL_PROGRAM",
              title: "Polymorphic Expression Evaluator",
              prompt: "Create an expression evaluation system:\n\nDefine abstract static class `Expression` with abstract method `int evaluate()`.\n\nDefine `Literal` extending Expression with an `int value`. `evaluate()` returns the value.\n\nDefine `Add` extending Expression with two `Expression` fields (left and right). `evaluate()` returns left.evaluate() + right.evaluate().\n\nDefine `Multiply` extending Expression with two `Expression` fields. `evaluate()` returns left.evaluate() * right.evaluate().\n\nIn main, read a simple expression in prefix notation. The format is:\n- A number by itself is a literal\n- \"+ <expr1> <expr2>\" means add the two sub-expressions\n- \"* <expr1> <expr2>\" means multiply the two sub-expressions\n\nParse the expression recursively and print the result.\n\nExamples:\n- Input: \"+ 3 4\" Output: 7\n- Input: \"* + 1 2 4\" Output: 12 (because (1+2)*4 = 12)",
              starterCode: `import java.util.Scanner;

public class Solution {

    static abstract class Expression {
        abstract int evaluate();
    }

    static class Literal extends Expression {
        int value;
        Literal(int value) { this.value = value; }
        int evaluate() { return value; }
    }

    static class Add extends Expression {
        Expression left, right;
        Add(Expression left, Expression right) { this.left = left; this.right = right; }
        int evaluate() { return left.evaluate() + right.evaluate(); }
    }

    static class Multiply extends Expression {
        Expression left, right;
        Multiply(Expression left, Expression right) { this.left = left; this.right = right; }
        int evaluate() { return left.evaluate() * right.evaluate(); }
    }

    public static Expression parse(Scanner sc) {
        // Recursively parse an expression from the scanner

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Expression expr = parse(sc);
        System.out.println(expr.evaluate());
    }
}`,
              solutionCode: `import java.util.Scanner;

public class Solution {

    static abstract class Expression {
        abstract int evaluate();
    }

    static class Literal extends Expression {
        int value;
        Literal(int value) { this.value = value; }
        int evaluate() { return value; }
    }

    static class Add extends Expression {
        Expression left, right;
        Add(Expression left, Expression right) { this.left = left; this.right = right; }
        int evaluate() { return left.evaluate() + right.evaluate(); }
    }

    static class Multiply extends Expression {
        Expression left, right;
        Multiply(Expression left, Expression right) { this.left = left; this.right = right; }
        int evaluate() { return left.evaluate() * right.evaluate(); }
    }

    public static Expression parse(Scanner sc) {
        if (sc.hasNextInt()) {
            return new Literal(sc.nextInt());
        }
        String op = sc.next();
        Expression left = parse(sc);
        Expression right = parse(sc);
        if (op.equals("+")) {
            return new Add(left, right);
        } else {
            return new Multiply(left, right);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Expression expr = parse(sc);
        System.out.println(expr.evaluate());
    }
}`,
              tests: [
                { input: "+ 3 4", expectedOutput: "7", isHidden: false, description: "Simple addition" },
                { input: "* + 1 2 4", expectedOutput: "12", isHidden: false, description: "Nested: (1+2)*4" },
                { input: "* + 2 3 + 4 5", expectedOutput: "45", isHidden: true, description: "(2+3)*(4+5) = 45" },
                { input: "5", expectedOutput: "5", isHidden: true, description: "Single literal" }
              ],
              hints: [
                "Use sc.hasNextInt() to check if the next token is a number (literal) or operator",
                "If it is a number, return a new Literal with that value",
                "If it is an operator, recursively parse two sub-expressions and combine them"
              ],
              tags: ["abstract", "polymorphism", "recursion", "parsing", "exam"],
              difficulty: 5,
              estimatedMinutes: 15,
              points: 100
            }
          ]
        }
      ]
    }
  ]
}
