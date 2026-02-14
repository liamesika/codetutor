/**
 * Java Cheat Sheet — Complete Quick Reference
 * Organized by category with Hebrew + English descriptions
 */

export interface CodeExample {
  descriptionHe: string
  descriptionEn: string
  code: string
  noteHe?: string
  noteEn?: string
}

export interface CheatSheetCategory {
  slug: string
  icon: string
  titleHe: string
  titleEn: string
  descriptionHe: string
  descriptionEn: string
  examples: CodeExample[]
}

export const cheatSheetCategories: CheatSheetCategory[] = [
  // ──────────────────────────────────────────────────────────
  // 1. Variables
  // ──────────────────────────────────────────────────────────
  {
    slug: "variables",
    icon: "Variable",
    titleHe: "משתנים",
    titleEn: "Variables",
    descriptionHe: "הגדרת משתנים, טיפוסים פרימיטיביים ו-String",
    descriptionEn: "Variable declaration, primitive types and String",
    examples: [
      {
        descriptionHe: "הגדרת משתנה שלם (int)",
        descriptionEn: "Declare an integer variable",
        code: `int age = 25;`,
      },
      {
        descriptionHe: "הגדרת משתנה עשרוני (double)",
        descriptionEn: "Declare a double variable",
        code: `double price = 9.99;`,
      },
      {
        descriptionHe: "הגדרת משתנה לוגי (boolean)",
        descriptionEn: "Declare a boolean variable",
        code: `boolean isStudent = true;`,
      },
      {
        descriptionHe: "הגדרת תו בודד (char)",
        descriptionEn: "Declare a char variable",
        code: `char grade = 'A';`,
      },
      {
        descriptionHe: "הגדרת מחרוזת (String)",
        descriptionEn: "Declare a String variable",
        code: `String name = "Hello";`,
        noteHe: "String הוא טיפוס הפניה (אובייקט), לא פרימיטיבי",
        noteEn: "String is a reference type (object), not primitive",
      },
      {
        descriptionHe: "הצהרה בלי אתחול — חייבים לתת ערך לפני שימוש",
        descriptionEn: "Declaration without initialization — must assign before use",
        code: `int x;\nx = 10;`,
      },
      {
        descriptionHe: "הצהרת כמה משתנים מאותו טיפוס",
        descriptionEn: "Declare multiple variables of the same type",
        code: `int a = 1, b = 2, c = 3;`,
      },
      {
        descriptionHe: "קבוע — ערך שלא ניתן לשנות",
        descriptionEn: "Constant — value that cannot be changed",
        code: `final int MAX = 100;`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 2. Input
  // ──────────────────────────────────────────────────────────
  {
    slug: "input",
    icon: "ScanLine",
    titleHe: "קליטה",
    titleEn: "Input",
    descriptionHe: "ארגומנטים משורת הפקודה ו-Scanner",
    descriptionEn: "Command-line arguments and Scanner",
    examples: [
      {
        descriptionHe: "קליטת ארגומנט משורת הפקודה (String)",
        descriptionEn: "Read command-line argument (String)",
        code: `String arg = args[0];`,
        noteHe: "args תמיד מסוג String — צריך לפרסר לטיפוס אחר",
        noteEn: "args are always String — must parse to other types",
      },
      {
        descriptionHe: "המרת ארגומנט למספר שלם",
        descriptionEn: "Parse argument to integer",
        code: `int n = Integer.parseInt(args[0]);`,
      },
      {
        descriptionHe: "המרת ארגומנט למספר עשרוני",
        descriptionEn: "Parse argument to double",
        code: `double d = Double.parseDouble(args[0]);`,
      },
      {
        descriptionHe: "המרת ארגומנט לבוליאני",
        descriptionEn: "Parse argument to boolean",
        code: `boolean b = Boolean.parseBoolean(args[0]);`,
      },
      {
        descriptionHe: "יצירת Scanner לקריאה מהמשתמש",
        descriptionEn: "Create Scanner for user input",
        code: `import java.util.Scanner;\nScanner sc = new Scanner(System.in);`,
      },
      {
        descriptionHe: "קריאת מספר שלם מהמשתמש",
        descriptionEn: "Read an integer from user",
        code: `int n = sc.nextInt();`,
      },
      {
        descriptionHe: "קריאת מספר עשרוני מהמשתמש",
        descriptionEn: "Read a double from user",
        code: `double d = sc.nextDouble();`,
      },
      {
        descriptionHe: "קריאת מילה בודדת (עד רווח)",
        descriptionEn: "Read a single word (until space)",
        code: `String word = sc.next();`,
      },
      {
        descriptionHe: "קריאת שורה שלמה",
        descriptionEn: "Read an entire line",
        code: `String line = sc.nextLine();`,
      },
      {
        descriptionHe: "ניקוי newline אחרי nextInt — חובה לפני nextLine",
        descriptionEn: "Consume leftover newline after nextInt — required before nextLine",
        code: `int n = sc.nextInt();\nsc.nextLine();  // consume leftover newline\nString line = sc.nextLine();`,
        noteHe: "בלי השורה הזו, nextLine יחזיר מחרוזת ריקה",
        noteEn: "Without this, nextLine returns an empty string",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 3. Output
  // ──────────────────────────────────────────────────────────
  {
    slug: "output",
    icon: "Terminal",
    titleHe: "הדפסה",
    titleEn: "Output",
    descriptionHe: "פקודות הדפסה למסך",
    descriptionEn: "Print commands to screen",
    examples: [
      {
        descriptionHe: "הדפסה עם ירידת שורה",
        descriptionEn: "Print with newline",
        code: `System.out.println("Hello World");`,
      },
      {
        descriptionHe: "הדפסה בלי ירידת שורה",
        descriptionEn: "Print without newline",
        code: `System.out.print("Hello ");`,
      },
      {
        descriptionHe: "הדפסה עם פורמט — מספר שלם",
        descriptionEn: "Formatted print — integer",
        code: `System.out.printf("Age: %d%n", 25);`,
      },
      {
        descriptionHe: "הדפסה עם פורמט — מספר עשרוני (2 ספרות)",
        descriptionEn: "Formatted print — double (2 decimal places)",
        code: `System.out.printf("Price: %.2f%n", 9.99);`,
      },
      {
        descriptionHe: "הדפסה עם פורמט — מחרוזת",
        descriptionEn: "Formatted print — string",
        code: `System.out.printf("Name: %s%n", "Java");`,
      },
      {
        descriptionHe: "שרשור מחרוזות בהדפסה",
        descriptionEn: "String concatenation in print",
        code: `int x = 5;\nSystem.out.println("x = " + x);  // "x = 5"`,
        noteHe: "כשאחד הצדדים String, כל הביטוי הופך ל-String",
        noteEn: "When one side is String, the whole expression becomes String",
      },
      {
        descriptionHe: "הדפסת שורה ריקה",
        descriptionEn: "Print empty line",
        code: `System.out.println();`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 4. Casting
  // ──────────────────────────────────────────────────────────
  {
    slug: "casting",
    icon: "ArrowLeftRight",
    titleHe: "המרת טיפוסים",
    titleEn: "Casting",
    descriptionHe: "המרות מרומזות ומפורשות בין טיפוסים",
    descriptionEn: "Implicit and explicit type conversions",
    examples: [
      {
        descriptionHe: "המרה מרומזת — int ל-double (אוטומטי)",
        descriptionEn: "Implicit cast — int to double (automatic)",
        code: `double d = 5;  // d = 5.0`,
      },
      {
        descriptionHe: "המרה מרומזת — חישוב עם double נותן double",
        descriptionEn: "Implicit — operation with double gives double",
        code: `System.out.println(5.0 / 2);  // 2.5`,
      },
      {
        descriptionHe: "המרה מרומזת — שרשור עם String",
        descriptionEn: "Implicit — concatenation with String",
        code: `String s = "abc" + 123;  // "abc123"`,
      },
      {
        descriptionHe: "המרה מפורשת — double ל-int (חיתוך!)",
        descriptionEn: "Explicit cast — double to int (truncates!)",
        code: `int n = (int) 2.71828;  // 2 (not rounded!)`,
        noteHe: "חיתוך — לא עיגול! החלק העשרוני נזרק",
        noteEn: "Truncation — not rounding! Decimal part is dropped",
      },
      {
        descriptionHe: "סדר ה-cast משנה את התוצאה!",
        descriptionEn: "Cast order changes the result!",
        code: `System.out.println((int)(11 * 0.3));   // 3\nSystem.out.println((11 * (int) 0.3));  // 0`,
      },
      {
        descriptionHe: "המרה מ-String ל-int",
        descriptionEn: "Convert String to int",
        code: `int n = Integer.parseInt("123");`,
      },
      {
        descriptionHe: "המרה מ-String ל-double",
        descriptionEn: "Convert String to double",
        code: `double d = Double.parseDouble("3.14");`,
      },
      {
        descriptionHe: "המרה מ-int/double ל-String",
        descriptionEn: "Convert int/double to String",
        code: `String s = String.valueOf(42);\nString s2 = "" + 42;  // alternative`,
      },
      {
        descriptionHe: "המרה בין char ל-int (ערך ASCII)",
        descriptionEn: "Convert between char and int (ASCII value)",
        code: `int ascii = (int) 'A';    // 65\nchar ch = (char) 65;      // 'A'`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 5. Operators
  // ──────────────────────────────────────────────────────────
  {
    slug: "operators",
    icon: "Calculator",
    titleHe: "אופרטורים",
    titleEn: "Operators",
    descriptionHe: "אופרטורים אריתמטיים, השוואה, לוגיים והשמה",
    descriptionEn: "Arithmetic, comparison, logical, and assignment operators",
    examples: [
      {
        descriptionHe: "חיבור, חיסור, כפל",
        descriptionEn: "Addition, subtraction, multiplication",
        code: `int sum = 5 + 3;     // 8\nint diff = 5 - 3;    // 2\nint prod = 5 * 3;    // 15`,
      },
      {
        descriptionHe: "חילוק שלמים — מחזיר חלק שלם בלבד!",
        descriptionEn: "Integer division — returns whole part only!",
        code: `int div = 7 / 2;     // 3 (not 3.5!)`,
        noteHe: "כדי לקבל תוצאה עשרונית, לפחות אופרנד אחד צריך להיות double",
        noteEn: "For decimal result, at least one operand must be double",
      },
      {
        descriptionHe: "שארית חלוקה (מודולו)",
        descriptionEn: "Remainder (modulo)",
        code: `int mod = 7 % 2;     // 1\nint mod2 = 10 % 5;   // 0`,
      },
      {
        descriptionHe: "אופרטורי השוואה — מחזירים boolean",
        descriptionEn: "Comparison operators — return boolean",
        code: `boolean a = (5 == 5);   // true\nboolean b = (5 != 3);   // true\nboolean c = (5 < 10);   // true\nboolean d = (5 >= 5);   // true\nboolean e = (5 > 10);   // false\nboolean f = (5 <= 3);   // false`,
      },
      {
        descriptionHe: "AND לוגי — שניהם חייבים להיות true",
        descriptionEn: "Logical AND — both must be true",
        code: `boolean r = (x > 0) && (x < 100);`,
      },
      {
        descriptionHe: "OR לוגי — לפחות אחד true",
        descriptionEn: "Logical OR — at least one true",
        code: `boolean r = (x == 0) || (x == 1);`,
      },
      {
        descriptionHe: "NOT לוגי — הופך true ל-false ולהיפך",
        descriptionEn: "Logical NOT — flips true to false and vice versa",
        code: `boolean r = !(x > 5);`,
      },
      {
        descriptionHe: "אופרטורי השמה מקוצרים",
        descriptionEn: "Compound assignment operators",
        code: `x += 5;   // x = x + 5\nx -= 3;   // x = x - 3\nx *= 2;   // x = x * 2\nx /= 4;   // x = x / 4\nx %= 3;   // x = x % 3`,
      },
      {
        descriptionHe: "הגדלה והקטנה ב-1",
        descriptionEn: "Increment and decrement by 1",
        code: `x++;  // x = x + 1\nx--;  // x = x - 1`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 6. Conditionals
  // ──────────────────────────────────────────────────────────
  {
    slug: "conditionals",
    icon: "GitBranch",
    titleHe: "תנאים",
    titleEn: "Conditionals",
    descriptionHe: "משפטי if, else, else if, switch ואופרטור שלישוני",
    descriptionEn: "if, else, else if, switch and ternary operator",
    examples: [
      {
        descriptionHe: "משפט if — מבצע קוד רק אם התנאי true",
        descriptionEn: "if statement — executes code only if condition is true",
        code: `if (age >= 18) {\n    System.out.println("Adult");\n}`,
      },
      {
        descriptionHe: "משפט if-else — שני מסלולים",
        descriptionEn: "if-else — two paths",
        code: `if (grade >= 60) {\n    System.out.println("Pass");\n} else {\n    System.out.println("Fail");\n}`,
      },
      {
        descriptionHe: "שרשרת if / else if / else — כמה תנאים",
        descriptionEn: "if / else if / else chain — multiple conditions",
        code: `if (score >= 90) {\n    System.out.println("A");\n} else if (score >= 80) {\n    System.out.println("B");\n} else if (score >= 70) {\n    System.out.println("C");\n} else {\n    System.out.println("F");\n}`,
        noteHe: "רק הענף הראשון שמתקיים יבוצע — הסדר חשוב!",
        noteEn: "Only the first matching branch executes — order matters!",
      },
      {
        descriptionHe: "אופרטור שלישוני (ternary) — if-else בשורה אחת",
        descriptionEn: "Ternary operator — one-line if-else",
        code: `int max = (a > b) ? a : b;`,
      },
      {
        descriptionHe: "תנאים מקוננים (nested if)",
        descriptionEn: "Nested if statements",
        code: `if (x > 0) {\n    if (x % 2 == 0) {\n        System.out.println("positive even");\n    }\n}`,
      },
      {
        descriptionHe: "switch — בחירה לפי ערך",
        descriptionEn: "switch — choose by value",
        code: `switch (day) {\n    case 1:\n        System.out.println("Sunday");\n        break;\n    case 2:\n        System.out.println("Monday");\n        break;\n    default:\n        System.out.println("Other");\n        break;\n}`,
        noteHe: "אל תשכחו break! בלעדיו הקוד ימשיך ל-case הבא",
        noteEn: "Don't forget break! Without it, code falls through to next case",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 7. Loops
  // ──────────────────────────────────────────────────────────
  {
    slug: "loops",
    icon: "Repeat",
    titleHe: "לולאות",
    titleEn: "Loops",
    descriptionHe: "for, while, do-while, break, continue",
    descriptionEn: "for, while, do-while, break, continue",
    examples: [
      {
        descriptionHe: "לולאת for — כשיודעים מראש כמה פעמים",
        descriptionEn: "for loop — when number of iterations is known",
        code: `for (int i = 0; i < 10; i++) {\n    System.out.println(i);\n}`,
      },
      {
        descriptionHe: "לולאת for — ספירה לאחור",
        descriptionEn: "for loop — counting down",
        code: `for (int i = 10; i >= 0; i--) {\n    System.out.println(i);\n}`,
      },
      {
        descriptionHe: "לולאת while — כל עוד התנאי true",
        descriptionEn: "while loop — as long as condition is true",
        code: `int i = 0;\nwhile (i < 10) {\n    System.out.println(i);\n    i++;\n}`,
      },
      {
        descriptionHe: "לולאת do-while — מבצעת לפחות פעם אחת",
        descriptionEn: "do-while loop — executes at least once",
        code: `int i = 0;\ndo {\n    System.out.println(i);\n    i++;\n} while (i < 10);`,
      },
      {
        descriptionHe: "break — יציאה מיידית מהלולאה",
        descriptionEn: "break — immediately exit the loop",
        code: `for (int i = 0; i < 100; i++) {\n    if (i == 5) {\n        break;\n    }\n    System.out.println(i);\n}\n// prints: 0 1 2 3 4`,
      },
      {
        descriptionHe: "continue — דילוג לאיטרציה הבאה",
        descriptionEn: "continue — skip to next iteration",
        code: `for (int i = 0; i < 5; i++) {\n    if (i == 2) {\n        continue;\n    }\n    System.out.println(i);\n}\n// prints: 0 1 3 4`,
      },
      {
        descriptionHe: "לולאות מקוננות (nested loops)",
        descriptionEn: "Nested loops",
        code: `for (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        System.out.print(i + "," + j + " ");\n    }\n    System.out.println();\n}`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 8. Arrays
  // ──────────────────────────────────────────────────────────
  {
    slug: "arrays",
    icon: "LayoutList",
    titleHe: "מערכים",
    titleEn: "Arrays",
    descriptionHe: "הגדרה, גישה, מעבר ומערכים דו-ממדיים",
    descriptionEn: "Declaration, access, traversal and 2D arrays",
    examples: [
      {
        descriptionHe: "הגדרת מערך בגודל קבוע",
        descriptionEn: "Declare array with fixed size",
        code: `int[] arr = new int[5];`,
        noteHe: "ערכי ברירת מחדל: 0 ל-int, false ל-boolean, null ל-objects",
        noteEn: "Default values: 0 for int, false for boolean, null for objects",
      },
      {
        descriptionHe: "הגדרת מערך עם ערכים",
        descriptionEn: "Declare array with values",
        code: `int[] arr = {10, 20, 30, 40, 50};`,
      },
      {
        descriptionHe: "גישה לאיבר לפי אינדקס (מתחיל מ-0!)",
        descriptionEn: "Access element by index (starts at 0!)",
        code: `int first = arr[0];    // first element\nint last = arr[arr.length - 1];  // last element`,
      },
      {
        descriptionHe: "שינוי ערך של איבר",
        descriptionEn: "Change element value",
        code: `arr[2] = 99;`,
      },
      {
        descriptionHe: "אורך המערך",
        descriptionEn: "Array length",
        code: `int len = arr.length;`,
        noteHe: "length הוא שדה (בלי סוגריים), לא מתודה",
        noteEn: "length is a field (no parentheses), not a method",
      },
      {
        descriptionHe: "מעבר על מערך עם for",
        descriptionEn: "Iterate array with for loop",
        code: `for (int i = 0; i < arr.length; i++) {\n    System.out.println(arr[i]);\n}`,
      },
      {
        descriptionHe: "מעבר על מערך עם for-each",
        descriptionEn: "Iterate array with for-each",
        code: `for (int val : arr) {\n    System.out.println(val);\n}`,
      },
      {
        descriptionHe: "מערך דו-ממדי — הגדרה",
        descriptionEn: "2D array — declaration",
        code: `int[][] matrix = new int[3][4];  // 3 rows, 4 columns\nint[][] m2 = {{1,2}, {3,4}, {5,6}};`,
      },
      {
        descriptionHe: "מערך דו-ממדי — גישה ומעבר",
        descriptionEn: "2D array — access and traversal",
        code: `int val = matrix[1][2];  // row 1, col 2\n\nfor (int i = 0; i < matrix.length; i++) {\n    for (int j = 0; j < matrix[i].length; j++) {\n        System.out.print(matrix[i][j] + " ");\n    }\n    System.out.println();\n}`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 9. Strings
  // ──────────────────────────────────────────────────────────
  {
    slug: "strings",
    icon: "Type",
    titleHe: "מחרוזות",
    titleEn: "Strings",
    descriptionHe: "מתודות נפוצות לעבודה עם מחרוזות",
    descriptionEn: "Common String methods",
    examples: [
      {
        descriptionHe: "אורך מחרוזת",
        descriptionEn: "String length",
        code: `int len = "Hello".length();  // 5`,
      },
      {
        descriptionHe: "גישה לתו לפי אינדקס",
        descriptionEn: "Access character by index",
        code: `char c = "Hello".charAt(0);  // 'H'`,
      },
      {
        descriptionHe: "תת-מחרוזת (substring)",
        descriptionEn: "Substring extraction",
        code: `String sub = "Hello".substring(1, 4);  // "ell"\nString from = "Hello".substring(2);    // "llo"`,
        noteHe: "האינדקס הראשון כולל, השני לא כולל",
        noteEn: "First index inclusive, second exclusive",
      },
      {
        descriptionHe: "השוואת מחרוזות — תמיד עם equals!",
        descriptionEn: "String comparison — always use equals!",
        code: `boolean same = s1.equals(s2);\nboolean sameIgnoreCase = s1.equalsIgnoreCase(s2);`,
        noteHe: "אל תשתמשו ב-== להשוואת מחרוזות! == משווה הפניות, לא תוכן",
        noteEn: "Never use == for Strings! == compares references, not content",
      },
      {
        descriptionHe: "השוואה לקסיקוגרפית",
        descriptionEn: "Lexicographic comparison",
        code: `int cmp = s1.compareTo(s2);\n// < 0: s1 before s2\n// 0:   equal\n// > 0: s1 after s2`,
      },
      {
        descriptionHe: "חיפוש תת-מחרוזת",
        descriptionEn: "Find substring position",
        code: `int idx = "Hello World".indexOf("World");  // 6\nint not = "Hello".indexOf("xyz");          // -1`,
      },
      {
        descriptionHe: "בדיקה אם מכילה תת-מחרוזת",
        descriptionEn: "Check if contains substring",
        code: `boolean has = "Hello".contains("ell");  // true`,
      },
      {
        descriptionHe: "אותיות גדולות / קטנות",
        descriptionEn: "Upper / lower case",
        code: `String up = "hello".toUpperCase();   // "HELLO"\nString lo = "HELLO".toLowerCase();   // "hello"`,
      },
      {
        descriptionHe: "החלפת תווים",
        descriptionEn: "Replace characters",
        code: `String r = "aabbcc".replace('a', 'x');  // "xxbbcc"`,
      },
      {
        descriptionHe: "הסרת רווחים מהקצוות",
        descriptionEn: "Trim whitespace from edges",
        code: `String t = "  hello  ".trim();  // "hello"`,
      },
      {
        descriptionHe: "שרשור מחרוזות",
        descriptionEn: "String concatenation",
        code: `String full = "Hello" + " " + "World";  // "Hello World"\nString s = "Value: " + 42;             // "Value: 42"`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 10. Methods
  // ──────────────────────────────────────────────────────────
  {
    slug: "methods",
    icon: "Braces",
    titleHe: "פונקציות / מתודות",
    titleEn: "Methods / Functions",
    descriptionHe: "הגדרת פונקציות, פרמטרים, ערכי החזרה ו-overloading",
    descriptionEn: "Method declaration, parameters, return values and overloading",
    examples: [
      {
        descriptionHe: "פונקציה שמחזירה ערך",
        descriptionEn: "Method that returns a value",
        code: `public static int add(int a, int b) {\n    return a + b;\n}`,
      },
      {
        descriptionHe: "פונקציה בלי ערך החזרה (void)",
        descriptionEn: "Method without return value (void)",
        code: `public static void greet(String name) {\n    System.out.println("Hello " + name);\n}`,
      },
      {
        descriptionHe: "קריאה לפונקציה",
        descriptionEn: "Calling a method",
        code: `int result = add(3, 5);  // 8\ngreet("Java");           // prints: Hello Java`,
      },
      {
        descriptionHe: "פונקציה שמקבלת מערך",
        descriptionEn: "Method that receives an array",
        code: `public static int sum(int[] arr) {\n    int total = 0;\n    for (int val : arr) {\n        total += val;\n    }\n    return total;\n}`,
      },
      {
        descriptionHe: "פונקציה שמחזירה מערך",
        descriptionEn: "Method that returns an array",
        code: `public static int[] createArray(int size) {\n    int[] arr = new int[size];\n    for (int i = 0; i < size; i++) {\n        arr[i] = i * 2;\n    }\n    return arr;\n}`,
      },
      {
        descriptionHe: "העמסת פונקציות (overloading) — אותו שם, פרמטרים שונים",
        descriptionEn: "Method overloading — same name, different parameters",
        code: `public static int max(int a, int b) {\n    return (a > b) ? a : b;\n}\npublic static int max(int a, int b, int c) {\n    return max(max(a, b), c);\n}`,
      },
      {
        descriptionHe: "פונקציה עם boolean — בדיקה",
        descriptionEn: "Boolean method — check",
        code: `public static boolean isEven(int n) {\n    return (n % 2 == 0);\n}`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 11. Recursion
  // ──────────────────────────────────────────────────────────
  {
    slug: "recursion",
    icon: "Layers",
    titleHe: "רקורסיה",
    titleEn: "Recursion",
    descriptionHe: "פונקציות שקוראות לעצמן — תנאי עצירה וקריאה רקורסיבית",
    descriptionEn: "Functions that call themselves — base case and recursive call",
    examples: [
      {
        descriptionHe: "מבנה בסיסי של רקורסיה",
        descriptionEn: "Basic recursion structure",
        code: `public static returnType func(params) {\n    if (base case) {\n        return base value;\n    }\n    return func(smaller problem);\n}`,
        noteHe: "כל רקורסיה חייבת תנאי עצירה (base case)! בלעדיו — StackOverflow",
        noteEn: "Every recursion needs a base case! Without it — StackOverflow",
      },
      {
        descriptionHe: "עצרת (factorial) — n!",
        descriptionEn: "Factorial — n!",
        code: `public static int factorial(int n) {\n    if (n <= 1) {\n        return 1;\n    }\n    return n * factorial(n - 1);\n}`,
      },
      {
        descriptionHe: "חזקה — x בחזקת n",
        descriptionEn: "Power — x to the power of n",
        code: `public static int power(int x, int n) {\n    if (n == 0) {\n        return 1;\n    }\n    return x * power(x, n - 1);\n}`,
      },
      {
        descriptionHe: "פיבונאצ'י",
        descriptionEn: "Fibonacci",
        code: `public static int fib(int n) {\n    if (n <= 1) {\n        return n;\n    }\n    return fib(n - 1) + fib(n - 2);\n}`,
      },
      {
        descriptionHe: "סכום ספרות של מספר",
        descriptionEn: "Sum of digits",
        code: `public static int sumDigits(int n) {\n    if (n < 10) {\n        return n;\n    }\n    return (n % 10) + sumDigits(n / 10);\n}`,
      },
      {
        descriptionHe: "חיפוש בינארי רקורסיבי",
        descriptionEn: "Recursive binary search",
        code: `public static int binarySearch(int[] arr, int target, int low, int high) {\n    if (low > high) {\n        return -1;\n    }\n    int mid = (low + high) / 2;\n    if (arr[mid] == target) {\n        return mid;\n    } else if (arr[mid] < target) {\n        return binarySearch(arr, target, mid + 1, high);\n    } else {\n        return binarySearch(arr, target, low, mid - 1);\n    }\n}`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 12. Math Library
  // ──────────────────────────────────────────────────────────
  {
    slug: "math",
    icon: "Sigma",
    titleHe: "ספריית Math",
    titleEn: "Math Library",
    descriptionHe: "פונקציות מתמטיות מובנות",
    descriptionEn: "Built-in mathematical functions",
    examples: [
      {
        descriptionHe: "ערך מוחלט",
        descriptionEn: "Absolute value",
        code: `int a = Math.abs(-5);      // 5\ndouble b = Math.abs(-3.7); // 3.7`,
      },
      {
        descriptionHe: "מקסימום ומינימום",
        descriptionEn: "Maximum and minimum",
        code: `int mx = Math.max(10, 20);   // 20\nint mn = Math.min(10, 20);   // 10`,
      },
      {
        descriptionHe: "חזקה",
        descriptionEn: "Power",
        code: `double p = Math.pow(2, 10);  // 1024.0`,
      },
      {
        descriptionHe: "שורש ריבועי",
        descriptionEn: "Square root",
        code: `double s = Math.sqrt(25.0);  // 5.0`,
      },
      {
        descriptionHe: "מספר אקראי בטווח [0, 1)",
        descriptionEn: "Random number in range [0, 1)",
        code: `double r = Math.random();`,
      },
      {
        descriptionHe: "מספר שלם אקראי בטווח [0, N)",
        descriptionEn: "Random integer in range [0, N)",
        code: `int n = (int) (Math.random() * N);`,
      },
      {
        descriptionHe: "עיגול לשלם הקרוב",
        descriptionEn: "Round to nearest integer",
        code: `long r = Math.round(3.7);   // 4\nlong r2 = Math.round(3.2);  // 3`,
      },
      {
        descriptionHe: "עיגול למעלה / למטה",
        descriptionEn: "Ceiling / floor",
        code: `double up = Math.ceil(3.1);    // 4.0\ndouble dn = Math.floor(3.9);   // 3.0`,
      },
      {
        descriptionHe: "קבועים מתמטיים",
        descriptionEn: "Mathematical constants",
        code: `double pi = Math.PI;   // 3.141592653589793\ndouble e = Math.E;     // 2.718281828459045`,
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 13. Common Patterns
  // ──────────────────────────────────────────────────────────
  {
    slug: "common-patterns",
    icon: "Puzzle",
    titleHe: "דפוסים נפוצים",
    titleEn: "Common Patterns",
    descriptionHe: "קטעי קוד שחוזרים שוב ושוב במבחנים",
    descriptionEn: "Code patterns that appear frequently in exams",
    examples: [
      {
        descriptionHe: "החלפת ערכים בין שני משתנים (swap)",
        descriptionEn: "Swap two variables",
        code: `int temp = a;\na = b;\nb = temp;`,
      },
      {
        descriptionHe: "מציאת מקסימום במערך",
        descriptionEn: "Find maximum in array",
        code: `int max = arr[0];\nfor (int i = 1; i < arr.length; i++) {\n    if (arr[i] > max) {\n        max = arr[i];\n    }\n}`,
      },
      {
        descriptionHe: "מציאת מינימום במערך",
        descriptionEn: "Find minimum in array",
        code: `int min = arr[0];\nfor (int i = 1; i < arr.length; i++) {\n    if (arr[i] < min) {\n        min = arr[i];\n    }\n}`,
      },
      {
        descriptionHe: "סכום איברי מערך",
        descriptionEn: "Sum of array elements",
        code: `int sum = 0;\nfor (int val : arr) {\n    sum += val;\n}`,
      },
      {
        descriptionHe: "ספירת הופעות של ערך",
        descriptionEn: "Count occurrences of a value",
        code: `int count = 0;\nfor (int val : arr) {\n    if (val == target) {\n        count++;\n    }\n}`,
      },
      {
        descriptionHe: "בדיקה אם מספר ראשוני",
        descriptionEn: "Check if a number is prime",
        code: `public static boolean isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}`,
      },
      {
        descriptionHe: "היפוך מחרוזת",
        descriptionEn: "Reverse a string",
        code: `String reversed = "";\nfor (int i = s.length() - 1; i >= 0; i--) {\n    reversed += s.charAt(i);\n}`,
      },
      {
        descriptionHe: "בדיקת פלינדרום",
        descriptionEn: "Check if palindrome",
        code: `public static boolean isPalindrome(String s) {\n    int left = 0, right = s.length() - 1;\n    while (left < right) {\n        if (s.charAt(left) != s.charAt(right)) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    return true;\n}`,
      },
      {
        descriptionHe: "חיפוש לינארי — מציאת אינדקס של ערך",
        descriptionEn: "Linear search — find index of value",
        code: `public static int linearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) {\n            return i;\n        }\n    }\n    return -1;\n}`,
      },
    ],
  },
]
