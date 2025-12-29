/**
 * Topic Introduction Content
 *
 * Each intro follows this structure:
 * 1. What is this topic? (Definition)
 * 2. When/why do we use it?
 * 3. Key concepts
 * 4. Mini code example
 */

export const topicIntros: Record<string, string> = {
  // ==================== WEEK 1 ====================

  "command-line-output": `## What is Command Line Output?

**Command line output** is how your Java program communicates with the user by displaying text in the terminal/console. It's the most fundamental way to show results, messages, and data.

## Why is This Important?

- **Debugging**: Print values to understand what your code is doing
- **User feedback**: Show results, prompts, and status messages
- **Every program needs output**: Even complex apps use console output for logging

## Key Concepts

- \`System.out.println()\` – Prints text and moves to a new line
- \`System.out.print()\` – Prints text without a new line
- **Escape sequences**: Special characters like \`\\n\` (newline), \`\\t\` (tab), \`\\"\` (quote)

## Mini Example

\`\`\`java
System.out.println("Hello, World!");      // Prints with newline
System.out.print("Same ");                // No newline
System.out.print("line");                 // Continues on same line
System.out.println("\\nNew line here");    // \\n creates a line break
\`\`\`

**Output:**
\`\`\`
Hello, World!
Same line
New line here
\`\`\``,

  "variables-compilation": `## What are Variables?

**Variables** are named containers that store data in your program. Think of them as labeled boxes where you can put values and retrieve them later.

## Why Do We Need Variables?

- **Store data**: Keep track of user input, calculations, and state
- **Reuse values**: Use the same value in multiple places
- **Make code readable**: Give meaningful names to values

## Key Concepts

- **Declaration**: Tell Java what type and name: \`int age;\`
- **Assignment**: Give it a value: \`age = 25;\`
- **Data types**: \`int\` (whole numbers), \`double\` (decimals), \`String\` (text), \`boolean\` (true/false)

## Mini Example

\`\`\`java
int age = 21;                    // Integer variable
double price = 19.99;            // Decimal variable
String name = "Alice";           // Text variable
boolean isStudent = true;        // Boolean variable

System.out.println(name + " is " + age + " years old");
// Output: Alice is 21 years old
\`\`\`

## Compilation

Java is a **compiled language**. You must compile (\`javac\`) before running (\`java\`):
\`\`\`
javac MyProgram.java   → Creates MyProgram.class
java MyProgram         → Runs the program
\`\`\``,

  "git-basics": `## What is Git?

**Git** is a version control system that tracks changes to your code over time. It's like having unlimited "undo" for your entire project, plus the ability to collaborate with others.

## Why Use Git?

- **History**: See what changed, when, and why
- **Safety**: Never lose work—you can always go back
- **Collaboration**: Multiple people can work on the same project
- **Required everywhere**: Every software job uses version control

## Key Concepts

- **Repository (repo)**: A folder tracked by Git
- **Commit**: A snapshot of your code at a point in time
- **Staging area**: Where you prepare files before committing
- **Branch**: An independent line of development

## Essential Commands

\`\`\`bash
git init              # Start tracking a folder
git status            # See what's changed
git add file.java     # Stage a file for commit
git commit -m "msg"   # Save a snapshot with a message
git log               # View commit history
git diff              # See what changed
\`\`\`

## Mini Workflow

\`\`\`bash
# Make changes to code...
git add MyClass.java
git commit -m "Add new feature"
# Your changes are now safely saved!
\`\`\``,

  "error-types-debugging": `## What are Errors?

**Errors** are problems that prevent your code from working correctly. Understanding error types helps you fix them faster.

## Three Types of Errors

1. **Syntax Errors** (Compile-time)
   - Caught by the compiler before running
   - Example: Missing semicolon, misspelled keyword
   - \`error: ';' expected\`

2. **Runtime Errors**
   - Program crashes while running
   - Example: Dividing by zero, null pointer
   - \`Exception in thread "main"...\`

3. **Logic Errors**
   - Program runs but gives wrong results
   - Hardest to find—no error message!
   - Example: Using \`+\` instead of \`-\`

## Debugging Strategies

- **Read the error message**: It tells you the line number!
- **Print debugging**: Add \`System.out.println()\` to trace values
- **Check recent changes**: What did you just modify?
- **Rubber duck debugging**: Explain your code out loud

## Mini Example

\`\`\`java
// Syntax error: missing semicolon
int x = 5    // ← javac will catch this

// Runtime error: division by zero
int result = 10 / 0;  // ← Crashes when running

// Logic error: wrong operator
int sum = a - b;  // ← Should be a + b, no error shown!
\`\`\``,

  // ==================== WEEK 2 ====================

  "string-methods": `## What are String Methods?

**String methods** are built-in functions that let you manipulate text in Java. Strings are sequences of characters, and Java provides powerful tools to work with them.

## Why Learn String Methods?

- **Data processing**: Parse user input, file content, web data
- **Formatting**: Clean up and transform text for display
- **Validation**: Check if input meets requirements
- **Searching**: Find patterns and extract information

## Key Methods

| Method | What it Does | Example |
|--------|--------------|---------|
| \`length()\` | Count characters | \`"hello".length()\` → \`5\` |
| \`charAt(i)\` | Get character at position | \`"hello".charAt(1)\` → \`'e'\` |
| \`substring()\` | Extract part of string | \`"hello".substring(1,3)\` → \`"el"\` |
| \`toUpperCase()\` | Convert to uppercase | \`"hello".toUpperCase()\` → \`"HELLO"\` |
| \`indexOf()\` | Find position of substring | \`"hello".indexOf("l")\` → \`2\` |
| \`equals()\` | Compare strings | \`"hi".equals("Hi")\` → \`false\` |

## Mini Example

\`\`\`java
String text = "Hello, World!";
System.out.println(text.length());        // 13
System.out.println(text.toLowerCase());   // hello, world!
System.out.println(text.substring(0, 5)); // Hello
System.out.println(text.contains("World")); // true
System.out.println(text.replace("World", "Java")); // Hello, Java!
\`\`\`

**Important:** Strings are immutable—methods return NEW strings!`,

  "conditionals": `## What are Conditionals?

**Conditionals** allow your program to make decisions and execute different code based on conditions. They're the "if this, then that" of programming.

## Why Use Conditionals?

- **Decision making**: Take different actions based on input
- **Validation**: Check if data meets requirements
- **Game logic**: Respond to user choices
- **Any interactive program** needs conditionals

## Key Concepts

- \`if\` – Run code only when condition is true
- \`else\` – Run code when condition is false
- \`else if\` – Check additional conditions
- **Comparison operators**: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`
- **Logical operators**: \`&&\` (and), \`||\` (or), \`!\` (not)

## Mini Example

\`\`\`java
int score = 85;

if (score >= 90) {
    System.out.println("A grade");
} else if (score >= 80) {
    System.out.println("B grade");
} else if (score >= 70) {
    System.out.println("C grade");
} else {
    System.out.println("Need improvement");
}
// Output: B grade
\`\`\`

## Common Mistakes

- Using \`=\` (assignment) instead of \`==\` (comparison)
- Forgetting that \`String\` uses \`.equals()\` not \`==\`
\`\`\`java
String s = "hello";
if (s.equals("hello")) { ... }  // ✓ Correct
if (s == "hello") { ... }       // ✗ Unreliable!
\`\`\``,

  "loops": `## What are Loops?

**Loops** let you repeat code multiple times without writing it over and over. They're essential for processing collections, waiting for conditions, and automation.

## Why Use Loops?

- **Repetition**: Do something 100 times without 100 lines of code
- **Processing data**: Go through every item in a list
- **User input**: Keep asking until valid input is received
- **Searching**: Look through data until you find what you need

## Three Types of Loops

### For Loop (when you know how many times)
\`\`\`java
for (int i = 0; i < 5; i++) {
    System.out.println(i);  // Prints 0, 1, 2, 3, 4
}
\`\`\`

### While Loop (when you don't know how many times)
\`\`\`java
int count = 0;
while (count < 5) {
    System.out.println(count);
    count++;
}
\`\`\`

### Do-While Loop (run at least once)
\`\`\`java
int x = 10;
do {
    System.out.println(x);  // Runs once even though x > 5
} while (x < 5);
\`\`\`

## Loop Control

- \`break\` – Exit the loop immediately
- \`continue\` – Skip to the next iteration

## Common Pattern: Sum Numbers
\`\`\`java
int sum = 0;
for (int i = 1; i <= 10; i++) {
    sum += i;
}
System.out.println(sum);  // 55
\`\`\``,

  // ==================== WEEK 3 ====================

  "function-basics": `## What are Functions (Methods)?

**Functions** (called "methods" in Java) are reusable blocks of code that perform a specific task. They help you organize code and avoid repetition.

## Why Use Functions?

- **Reusability**: Write once, use many times
- **Organization**: Break complex problems into smaller pieces
- **Readability**: Give meaningful names to operations
- **Testing**: Test each piece independently
- **DRY Principle**: "Don't Repeat Yourself"

## Anatomy of a Method

\`\`\`java
public static void greet(String name) {
//     ↑       ↑    ↑          ↑
// access  static return    parameter
// modifier       type
    System.out.println("Hello, " + name + "!");
}
\`\`\`

## Key Concepts

- **Method signature**: Name + parameters
- **Parameters**: Input values the method receives
- **Return type**: What the method gives back (\`void\` = nothing)
- **Calling a method**: Using its name with parentheses

## Mini Example

\`\`\`java
// Define a method
public static void sayHello() {
    System.out.println("Hello!");
}

// Call it multiple times
sayHello();  // Hello!
sayHello();  // Hello!
sayHello();  // Hello!
\`\`\`

**Without functions:** You'd write the same println 3 times!`,

  "return-values": `## What are Return Values?

**Return values** are how functions send results back to the code that called them. Instead of just printing, a function can compute and return a value for further use.

## Why Use Return Values?

- **Flexibility**: Use the result however you need
- **Composition**: Combine results of multiple functions
- **Testing**: Easy to verify correct output
- **Real-world**: Most functions return something

## Void vs Returning

\`\`\`java
// void: just does something
public static void printSquare(int n) {
    System.out.println(n * n);  // Prints but returns nothing
}

// int: computes and returns a value
public static int getSquare(int n) {
    return n * n;  // Returns the result
}

// Usage difference:
printSquare(5);              // Just prints 25
int result = getSquare(5);   // Stores 25 for later use
\`\`\`

## Key Rules

- Method can only return ONE value
- Return type must match what you return
- \`return\` statement immediately exits the method

## Mini Example: Chaining Results

\`\`\`java
public static int add(int a, int b) {
    return a + b;
}

public static int multiply(int a, int b) {
    return a * b;
}

// Compose functions together:
int result = multiply(add(2, 3), add(4, 1));
// add(2,3) = 5, add(4,1) = 5
// multiply(5, 5) = 25
\`\`\``,

  "method-overloading": `## What is Method Overloading?

**Method overloading** allows you to have multiple methods with the same name but different parameters. Java picks the right one based on the arguments you pass.

## Why Use Overloading?

- **Convenience**: Same operation, different input types
- **Cleaner API**: One name for related operations
- **Flexibility**: Handle various use cases

## How It Works

Java distinguishes overloaded methods by:
1. **Number of parameters**
2. **Type of parameters**
3. **Order of parameter types**

**NOT by return type alone!**

## Mini Example

\`\`\`java
// Same name, different parameters
public static int add(int a, int b) {
    return a + b;
}

public static double add(double a, double b) {
    return a + b;
}

public static int add(int a, int b, int c) {
    return a + b + c;
}

// Java picks the right one:
add(2, 3);         // Uses int version → 5
add(2.5, 3.5);     // Uses double version → 6.0
add(1, 2, 3);      // Uses three-int version → 6
\`\`\`

## Real-World Example: println

\`\`\`java
System.out.println(42);       // int version
System.out.println(3.14);     // double version
System.out.println("Hello");  // String version
System.out.println(true);     // boolean version
// All same name, different parameter types!
\`\`\``,

  "input-validation": `## What is Input Validation?

**Input validation** is checking that data meets requirements before using it. It prevents errors, crashes, and security issues.

## Why Validate Input?

- **Prevent crashes**: Avoid null pointers, invalid indices
- **User experience**: Give helpful error messages
- **Security**: Block malicious input (SQL injection, etc.)
- **Data integrity**: Ensure calculations use valid values

## Common Validations

| Check | Example |
|-------|---------|
| Not null | \`if (input != null)\` |
| Not empty | \`if (!str.isEmpty())\` |
| In range | \`if (age >= 0 && age <= 120)\` |
| Correct format | \`if (email.contains("@"))\` |
| Valid type | Try-catch around parsing |

## Mini Example: Age Validation

\`\`\`java
public static boolean isValidAge(int age) {
    if (age < 0) {
        System.out.println("Age cannot be negative");
        return false;
    }
    if (age > 150) {
        System.out.println("Age seems unrealistic");
        return false;
    }
    return true;
}

// Usage:
int userAge = getUserInput();
if (isValidAge(userAge)) {
    processAge(userAge);  // Safe to use
}
\`\`\`

## Guard Clauses Pattern

Handle bad input first, then proceed with the "happy path":
\`\`\`java
public static double divide(int a, int b) {
    if (b == 0) {
        System.out.println("Cannot divide by zero!");
        return 0;  // or throw exception
    }
    return (double) a / b;  // Safe: b is not zero
}
\`\`\``,

  // ==================== WEEK 4 ====================

  "array-basics": `## What are Arrays?

**Arrays** are containers that hold multiple values of the same type. Instead of creating 100 separate variables, you create one array with 100 slots.

## Why Use Arrays?

- **Store collections**: Test scores, temperatures, names
- **Process in bulk**: Apply operations to all elements
- **Ordered data**: Access items by position (index)
- **Efficient**: Fixed size means fast access

## Key Concepts

- **Index**: Position in array (starts at 0!)
- **Length**: Number of elements (\`arr.length\`)
- **Fixed size**: Cannot grow or shrink after creation
- **Same type**: All elements must be the same type

## Creating Arrays

\`\`\`java
// Method 1: Declare size, fill later
int[] scores = new int[5];  // 5 slots, all start as 0
scores[0] = 95;
scores[1] = 87;

// Method 2: Initialize with values
int[] grades = {90, 85, 92, 78, 88};

// Method 3: Declare then create
int[] numbers;
numbers = new int[10];
\`\`\`

## Accessing Elements

\`\`\`java
int[] arr = {10, 20, 30, 40, 50};
//           ↑   ↑   ↑   ↑   ↑
//           0   1   2   3   4  ← indices

System.out.println(arr[0]);  // 10 (first element)
System.out.println(arr[4]);  // 50 (last element)
System.out.println(arr.length);  // 5

arr[2] = 35;  // Change element at index 2
\`\`\`

**Warning:** \`arr[5]\` would cause ArrayIndexOutOfBoundsException!`,

  "array-operations": `## Common Array Operations

Once you have an array, you'll need to process its elements. These patterns appear everywhere in programming.

## Essential Patterns

### 1. Loop Through All Elements
\`\`\`java
int[] arr = {5, 10, 15, 20};
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
// Enhanced for-loop (when you don't need index):
for (int num : arr) {
    System.out.println(num);
}
\`\`\`

### 2. Find Sum/Average
\`\`\`java
int sum = 0;
for (int num : arr) {
    sum += num;
}
double avg = (double) sum / arr.length;
\`\`\`

### 3. Find Max/Min
\`\`\`java
int max = arr[0];  // Start with first element
for (int i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
        max = arr[i];
    }
}
\`\`\`

### 4. Search for Element
\`\`\`java
public static int findIndex(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;  // Found it!
        }
    }
    return -1;  // Not found
}
\`\`\`

### 5. Reverse Array
\`\`\`java
for (int i = 0; i < arr.length / 2; i++) {
    int temp = arr[i];
    arr[i] = arr[arr.length - 1 - i];
    arr[arr.length - 1 - i] = temp;
}
\`\`\``,

  "command-line-args": `## What are Command Line Arguments?

**Command line arguments** are values you pass to your program when you run it. They let users customize program behavior without changing code.

## Why Use Command Line Args?

- **Flexibility**: Same program, different inputs
- **Automation**: Scripts can pass different values
- **Configuration**: No hardcoded values
- **Standard practice**: Most real tools use them

## How It Works

\`\`\`bash
java MyProgram hello world 42
#               ↑     ↑    ↑
#            args[0] [1]  [2]
\`\`\`

In your code:
\`\`\`java
public static void main(String[] args) {
    // args is an array of Strings!
    System.out.println(args[0]);  // "hello"
    System.out.println(args[1]);  // "world"
    System.out.println(args[2]);  // "42" (still a String!)
}
\`\`\`

## Converting Types

Args are always Strings. Convert when needed:
\`\`\`java
int number = Integer.parseInt(args[0]);    // String → int
double decimal = Double.parseDouble(args[0]); // String → double
\`\`\`

## Mini Example: Calculator

\`\`\`java
public static void main(String[] args) {
    if (args.length < 2) {
        System.out.println("Usage: java Add <num1> <num2>");
        return;
    }
    int a = Integer.parseInt(args[0]);
    int b = Integer.parseInt(args[1]);
    System.out.println("Sum: " + (a + b));
}
\`\`\`

\`\`\`bash
java Add 10 20
# Output: Sum: 30
\`\`\``,

  "pass-by-value": `## What is Pass by Value?

**Pass by value** means Java copies the value when passing to a method. Changes to the copy don't affect the original.

## Why Does This Matter?

Understanding pass by value prevents bugs where you expect changes to persist but they don't—or vice versa.

## Primitives: Value is Copied

\`\`\`java
public static void changeValue(int x) {
    x = 999;  // Changes the copy only
}

int num = 5;
changeValue(num);
System.out.println(num);  // Still 5! Original unchanged.
\`\`\`

## Objects/Arrays: Reference is Copied

With objects, the **reference** (memory address) is copied. Both references point to the same object!

\`\`\`java
public static void modifyArray(int[] arr) {
    arr[0] = 999;  // Modifies the SAME array
}

int[] nums = {1, 2, 3};
modifyArray(nums);
System.out.println(nums[0]);  // 999! Array was modified.
\`\`\`

## The Key Insight

\`\`\`
Primitives (int, double, etc.):
  ┌─────┐    copy    ┌─────┐
  │  5  │  ───────>  │  5  │  ← method gets copy
  └─────┘            └─────┘
  original           parameter

Arrays/Objects:
  ┌─────────┐
  │ address │──┐
  └─────────┘  │     ┌─────────────┐
               ├────>│ {1, 2, 3}   │ ← actual array in memory
  ┌─────────┐  │     └─────────────┘
  │ address │──┘
  └─────────┘
  copy of reference
\`\`\`

Both references point to the same array!`,

  // ==================== WEEK 5 ====================

  "2d-arrays": `## What are 2D Arrays?

**2D arrays** are arrays of arrays—like a grid or table with rows and columns. They're perfect for representing matrices, game boards, images, and tabular data.

## Why Use 2D Arrays?

- **Grids**: Tic-tac-toe, chess, maps
- **Tables**: Spreadsheet-like data
- **Images**: Pixel grids (each pixel is a cell)
- **Matrices**: Mathematical operations

## Creating 2D Arrays

\`\`\`java
// Method 1: Specify dimensions
int[][] grid = new int[3][4];  // 3 rows, 4 columns

// Method 2: Initialize with values
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
\`\`\`

## Accessing Elements

\`\`\`java
// matrix[row][column]
int value = matrix[1][2];  // Row 1, Col 2 → 6
matrix[0][0] = 10;         // Change top-left corner
\`\`\`

## Looping Through 2D Arrays

\`\`\`java
// Nested loops: outer = rows, inner = columns
for (int row = 0; row < matrix.length; row++) {
    for (int col = 0; col < matrix[row].length; col++) {
        System.out.print(matrix[row][col] + " ");
    }
    System.out.println();  // New line after each row
}
\`\`\`

## Visual Representation

\`\`\`
       Col 0  Col 1  Col 2
      ┌──────┬──────┬──────┐
Row 0 │  1   │  2   │  3   │
      ├──────┼──────┼──────┤
Row 1 │  4   │  5   │  6   │
      ├──────┼──────┼──────┤
Row 2 │  7   │  8   │  9   │
      └──────┴──────┴──────┘
\`\`\``,

  "standard-io": `## What is Standard I/O?

**Standard I/O** (Input/Output) is how your program reads input from the user and writes output to the screen. \`Scanner\` reads input; \`System.out\` writes output.

## Why Master I/O?

- **Interactive programs**: Get user input
- **Data processing**: Read files and data
- **Formatting**: Display results nicely
- **Every real program** needs I/O

## Reading Input with Scanner

\`\`\`java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);

// Read different types
String name = scanner.nextLine();     // Entire line
int age = scanner.nextInt();          // Integer
double price = scanner.nextDouble();  // Decimal
String word = scanner.next();         // Single word

scanner.close();  // Always close when done!
\`\`\`

## Common Pattern: Prompt and Read

\`\`\`java
System.out.print("Enter your name: ");  // No newline
String name = scanner.nextLine();
System.out.println("Hello, " + name + "!");
\`\`\`

## Formatted Output with printf

\`\`\`java
double pi = 3.14159265;
System.out.printf("Pi is %.2f%n", pi);  // Pi is 3.14

int num = 42;
System.out.printf("Number: %5d%n", num);  // Number:    42 (padded)

String name = "Alice";
System.out.printf("Hello, %s!%n", name);  // Hello, Alice!
\`\`\`

## Format Specifiers

| Specifier | Type | Example |
|-----------|------|---------|
| \`%d\` | Integer | \`printf("%d", 42)\` → \`42\` |
| \`%f\` | Decimal | \`printf("%.2f", 3.14159)\` → \`3.14\` |
| \`%s\` | String | \`printf("%s", "Hi")\` → \`Hi\` |
| \`%n\` | Newline | Platform-independent line break |`,

  "matrix-operations": `## What are Matrix Operations?

**Matrix operations** are algorithms that work on 2D arrays as mathematical matrices. They're fundamental to computer graphics, machine learning, and data analysis.

## Why Learn Matrix Operations?

- **Linear algebra**: Foundation of advanced computing
- **Graphics**: Transformations, rotations
- **Machine learning**: Neural networks use matrices
- **PageRank**: Google's original algorithm!

## Common Operations

### Row Sum
\`\`\`java
for (int row = 0; row < matrix.length; row++) {
    int sum = 0;
    for (int col = 0; col < matrix[row].length; col++) {
        sum += matrix[row][col];
    }
    System.out.println("Row " + row + " sum: " + sum);
}
\`\`\`

### Column Sum
\`\`\`java
for (int col = 0; col < matrix[0].length; col++) {
    int sum = 0;
    for (int row = 0; row < matrix.length; row++) {
        sum += matrix[row][col];
    }
    System.out.println("Col " + col + " sum: " + sum);
}
\`\`\`

### Transpose (Swap Rows ↔ Columns)
\`\`\`java
int[][] transposed = new int[cols][rows];
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        transposed[j][i] = matrix[i][j];
    }
}
\`\`\`

## PageRank Concept

PageRank computes importance by how many other pages link to you:
\`\`\`java
// Simplified: Add up all incoming link values
double rank = 0;
for (int i = 0; i < numPages; i++) {
    if (linksTo[i][pageId] == 1) {  // Page i links to us
        rank += pageRank[i] / outLinks[i];
    }
}
\`\`\``,

  "final-keyword": `## What is the Final Keyword?

The **final** keyword makes values unchangeable (constants) or prevents overriding. It's about declaring "this will never change."

## Why Use Final?

- **Constants**: Values that shouldn't change (π, MAX_SIZE)
- **Safety**: Prevent accidental modification
- **Performance**: Compiler can optimize
- **Intent**: Makes code intent clear

## Three Uses of Final

### 1. Final Variables (Constants)
\`\`\`java
final double PI = 3.14159;
final int MAX_USERS = 100;

PI = 3.0;  // ERROR! Cannot reassign final variable
\`\`\`

### 2. Final Parameters
\`\`\`java
public void process(final int value) {
    value = 10;  // ERROR! Cannot reassign
    // Useful to show value won't be modified
}
\`\`\`

### 3. Final with Arrays/Objects
\`\`\`java
final int[] arr = {1, 2, 3};
arr[0] = 99;     // OK! Contents can change
arr = new int[5]; // ERROR! Can't reassign the reference
\`\`\`

## Naming Convention

Constants use UPPER_SNAKE_CASE:
\`\`\`java
final int MAX_RETRIES = 3;
final String DEFAULT_NAME = "Guest";
final double TAX_RATE = 0.08;
\`\`\`

## Common Use: Class Constants

\`\`\`java
public class Game {
    public static final int BOARD_SIZE = 8;
    public static final String VERSION = "1.0.0";

    // Used throughout the class:
    // if (x < BOARD_SIZE) { ... }
}
\`\`\``,

  // ==================== WEEK 6 ====================
  // Already has introMarkdown in seed-full.ts

  // ==================== WEEK 7 ====================
  // Already has introMarkdown in seed-full.ts
}
