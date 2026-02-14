export interface CodeExample {
  title?: string
  code: string
  language?: string
}

export interface SubSection {
  id: string
  title: string
  points?: string[]
  code?: CodeExample[]
  note?: string
}

export interface SummarySection {
  id: string
  number: string
  title: string
  intro?: string
  subsections?: SubSection[]
  points?: string[]
  code?: CodeExample[]
  note?: string
}

export const summarySections: SummarySection[] = [
  // ──────────────────────────────────────────────
  // 1. כללי
  // ──────────────────────────────────────────────
  {
    id: "general",
    number: "1",
    title: "כללי",
    subsections: [
      {
        id: "coding-tips",
        title: "טיפים לכתיבת קוד",
        points: [
          "לרשום הערות ליד השורות",
          "לתת שמות משמעותיים למשתנים",
          "לעשות אינדנטציה נכונה (הזחה)",
          "להשתמש בפונקציות עזר כדי לחלק את הקוד",
          'כל תוכנית חייבת לכלול מתודת main עם החתימה: public static void main(String[] args)',
        ],
      },
      {
        id: "debugging",
        title: "דיבוג (Debugging)",
        points: [
          "תהליך של מציאת ותיקון באגים (שגיאות) בקוד",
          "שימוש ב-System.out.println להדפסת ערכי ביניים",
          "בדיקת הקוד שורה אחר שורה (dry run)",
        ],
      },
      {
        id: "compiler",
        title: "קומפיילר (Compiler)",
        points: [
          "תוכנה שמתרגמת את קוד ה-Java לשפת מכונה",
          "בודק שגיאות תחביר (syntax errors) לפני הרצה",
          "שגיאות זמן ריצה (runtime errors) מתגלות רק בזמן ההרצה",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 2. בסיס כתיבת קוד
  // ──────────────────────────────────────────────
  {
    id: "code-basics",
    number: "2",
    title: "בסיס כתיבת קוד",
    subsections: [
      {
        id: "variables",
        title: "משתנים (Variables)",
        points: [
          "משתנה הוא מקום בזיכרון שמחזיק ערך מסוג מסוים",
          "חובה להצהיר על סוג המשתנה לפני השימוש",
          'שמות משתנים מתחילים באות קטנה (camelCase): int myNumber = 5;',
        ],
      },
      {
        id: "data-types",
        title: "סוגי נתונים (Data Types)",
        points: [
          "int — מספר שלם (32 ביט): int x = 10;",
          "double — מספר עשרוני (64 ביט): double pi = 3.14;",
          "boolean — ערך אמת/שקר: boolean flag = true;",
          "char — תו בודד (16 ביט): char c = 'A';",
          "String — מחרוזת (אובייקט): String s = \"hello\";",
          "long — מספר שלם גדול (64 ביט)",
          "float — מספר עשרוני קטן (32 ביט)",
          "byte — מספר שלם קטן (8 ביט, טווח: -128 עד 127)",
          "short — מספר שלם בינוני (16 ביט)",
        ],
      },
      {
        id: "args",
        title: "args[] — ארגומנטים משורת הפקודה",
        points: [
          "args הוא מערך של Strings שמתקבל דרך שורת הפקודה",
          "args.length מחזיר את מספר הארגומנטים",
          "args[0] הוא הארגומנט הראשון",
          "כדי להמיר למספר: Integer.parseInt(args[0])",
        ],
        code: [
          {
            title: "שימוש ב-args",
            code: `public static void main(String[] args) {
    String name = args[0];
    int age = Integer.parseInt(args[1]);
    System.out.println(name + " is " + age);
}`,
          },
        ],
      },
      {
        id: "operators",
        title: "אופרטורים",
        points: [
          "חשבון: + , - , * , / , % (שארית)",
          "השוואה: == , != , < , > , <= , >=",
          "לוגיים: && (וגם), || (או), ! (שלילה)",
          "הגדלה/הקטנה: ++ , --",
          "השמה: = , += , -= , *= , /=",
          "חלוקת int ב-int נותנת int (ללא שארית): 7/2 = 3",
          "אם אחד מהם double, התוצאה double: 7.0/2 = 3.5",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 3. Casting and Parsing
  // ──────────────────────────────────────────────
  {
    id: "casting-parsing",
    number: "3",
    title: "Casting and Parsing",
    subsections: [
      {
        id: "casting",
        title: "המרת סוגים (Casting)",
        points: [
          "Widening (הרחבה) — אוטומטי: int → double",
          "Narrowing (צמצום) — ידני: double → int",
          "בצמצום יש אובדן מידע!",
        ],
        code: [
          {
            code: `// Widening - אוטומטי
int i = 5;
double d = i; // d = 5.0

// Narrowing - ידני
double d2 = 9.7;
int i2 = (int) d2; // i2 = 9 (חותך את החלק העשרוני)

// char ←→ int
char c = 'A';
int ascii = (int) c; // ascii = 65
char c2 = (char) 66; // c2 = 'B'`,
          },
        ],
      },
      {
        id: "parsing",
        title: "Parsing — המרת String למספר",
        points: [
          "Integer.parseInt(str) — ממיר String ל-int",
          "Double.parseDouble(str) — ממיר String ל-double",
          "String.valueOf(num) — ממיר מספר ל-String",
          'שרשור עם String ממיר אוטומטית: "" + 5 → "5"',
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 4. ספריות
  // ──────────────────────────────────────────────
  {
    id: "libraries",
    number: "4",
    title: "ספריות (Libraries)",
    subsections: [
      {
        id: "math-lib",
        title: "Math",
        points: [
          "Math.abs(x) — ערך מוחלט",
          "Math.max(a, b) / Math.min(a, b) — מקסימום/מינימום",
          "Math.pow(base, exp) — חזקה (מחזיר double)",
          "Math.sqrt(x) — שורש ריבועי",
          "Math.random() — מספר אקראי בין 0.0 ל-1.0",
          "Math.PI — הקבוע פאי",
          "Math.round(x) — עיגול למספר שלם קרוב",
          "Math.floor(x) / Math.ceil(x) — עיגול למטה/למעלה",
          "Math.log(x) — לוגריתם טבעי",
        ],
      },
      {
        id: "string-lib",
        title: "String",
        points: [
          "str.length() — אורך המחרוזת (מתודה — עם סוגריים!)",
          "str.charAt(i) — תו במיקום i",
          "str.substring(from, to) — תת-מחרוזת (to לא כולל)",
          "str.substring(from) — מ-from עד הסוף",
          "str.indexOf(ch) — מיקום ראשון של תו/מחרוזת (-1 אם לא נמצא)",
          "str.equals(other) — השוואת מחרוזות (לא ==!)",
          "str.compareTo(other) — השוואה לקסיקוגרפית",
          "str.toUpperCase() / str.toLowerCase() — המרה לאותיות גדולות/קטנות",
          "str.trim() — הסרת רווחים מההתחלה והסוף",
          "str.replace(old, new) — החלפת תווים",
          "str + str — שרשור מחרוזות",
          "String הוא immutable — לא ניתן לשנות תו בודד",
        ],
        note: 'שימו לב: String.length() היא מתודה (עם סוגריים), לעומת arr.length שהוא שדה (בלי סוגריים)',
      },
      {
        id: "stdin-stdout",
        title: "StdIn / StdOut",
        points: [
          "StdIn.readInt() — קריאת מספר שלם",
          "StdIn.readDouble() — קריאת מספר עשרוני",
          "StdIn.readString() — קריאת מילה אחת",
          "StdIn.readLine() — קריאת שורה שלמה",
          "StdIn.isEmpty() — בדיקה אם נגמר הקלט",
          "StdOut.println(x) — הדפסה עם ירידת שורה",
          "StdOut.print(x) — הדפסה בלי ירידת שורה",
          'StdOut.printf("format", args) — הדפסה מפורמטת',
        ],
      },
      {
        id: "stddraw",
        title: "StdDraw",
        points: [
          "StdDraw.setCanvasSize(w, h) — גודל חלון",
          "StdDraw.setXscale(min, max) / setYscale — טווח צירים",
          "StdDraw.point(x, y) — נקודה",
          "StdDraw.line(x1, y1, x2, y2) — קו",
          "StdDraw.circle(x, y, r) / filledCircle — עיגול",
          "StdDraw.square(x, y, r) / filledSquare — ריבוע",
          "StdDraw.rectangle(x, y, rw, rh) — מלבן",
          "StdDraw.setPenColor(color) — צבע",
          "StdDraw.setPenRadius(r) — עובי קו",
          "StdDraw.text(x, y, str) — טקסט",
          "StdDraw.show(ms) — הצגה עם השהייה",
        ],
      },
      {
        id: "wrapper-generic",
        title: "Wrapper Classes וג'נריקס",
        points: [
          "Wrapper Classes עוטפים פרימיטיבים באובייקטים: Integer, Double, Boolean, Character",
          "נחוצים כאשר צריך אובייקט במקום פרימיטיב (למשל ב-LinkedList)",
          "Autoboxing: המרה אוטומטית בין פרימיטיב לעטיפה",
          "Unboxing: המרה אוטומטית מעטיפה לפרימיטיב",
          "Generic Classes: מאפשרות ליצור מחלקה שעובדת עם כל סוג — <E>",
          "דוגמה: LinkedList<String>, Node<Integer>",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 5. תנאים ולולאות
  // ──────────────────────────────────────────────
  {
    id: "conditionals-loops",
    number: "5",
    title: "תנאים ולולאות",
    subsections: [
      {
        id: "if-else",
        title: "if / else if / else",
        points: [
          "בודק תנאי — אם אמת, מבצע את הבלוק",
          "else if — תנאי נוסף אם הראשון שקר",
          "else — ברירת מחדל אם אף תנאי לא התקיים",
          "ניתן לקנן תנאים בתוך תנאים",
        ],
        code: [
          {
            code: `if (x > 0) {
    System.out.println("Positive");
} else if (x < 0) {
    System.out.println("Negative");
} else {
    System.out.println("Zero");
}`,
          },
        ],
      },
      {
        id: "switch",
        title: "switch",
        points: [
          "מחליף שרשרת של if-else כאשר בודקים ערך ספציפי",
          "חייב break בסוף כל case (אחרת ימשיך ל-case הבא!)",
          "default — כמו else",
          "עובד עם int, char, String, enum",
        ],
        code: [
          {
            code: `switch (day) {
    case 1: System.out.println("Sunday"); break;
    case 2: System.out.println("Monday"); break;
    default: System.out.println("Other"); break;
}`,
          },
        ],
      },
      {
        id: "while-loop",
        title: "while / do-while",
        points: [
          "while — בודק תנאי לפני כל איטרציה",
          "do-while — מבצע לפחות פעם אחת, בודק תנאי בסוף",
          "זהירות מלולאה אינסופית! ודאו שהתנאי ישתנה",
        ],
        code: [
          {
            code: `// while
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}

// do-while
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 5);`,
          },
        ],
      },
      {
        id: "for-loop",
        title: "for / for-each",
        points: [
          "for — לולאה עם אתחול, תנאי, וצעד",
          "for-each — עובר על כל איברי מערך/אוסף",
          "for-each לא מאפשר שינוי של האיבר או גישה לאינדקס",
        ],
        code: [
          {
            code: `// for
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// for-each
int[] arr = {1, 2, 3, 4, 5};
for (int x : arr) {
    System.out.println(x);
}`,
          },
        ],
      },
      {
        id: "break-continue",
        title: "break / continue",
        points: [
          "break — יוצא מהלולאה מיידית",
          "continue — מדלג לאיטרציה הבאה",
          "שניהם עובדים רק על הלולאה הפנימית ביותר",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 6. פונקציות
  // ──────────────────────────────────────────────
  {
    id: "functions",
    number: "6",
    title: "פונקציות (Functions)",
    subsections: [
      {
        id: "func-basics",
        title: "בסיס",
        points: [
          "פונקציה היא בלוק קוד שמבצע משימה מסוימת",
          "חתימה: public static <returnType> name(<params>)",
          "void — פונקציה שלא מחזירה ערך",
          "return — מחזיר ערך ויוצא מהפונקציה",
          "פרמטרים הם עותקים של הערכים (pass by value לפרימיטיבים)",
          "מערכים ואובייקטים מועברים by reference (הפניה)",
        ],
        code: [
          {
            code: `public static int add(int a, int b) {
    return a + b;
}

public static void printHello() {
    System.out.println("Hello!");
}`,
          },
        ],
      },
      {
        id: "overloading",
        title: "Overloading — העמסה",
        points: [
          "ניתן ליצור כמה פונקציות עם אותו שם אבל פרמטרים שונים",
          "המהדר בוחר את הפונקציה המתאימה לפי הפרמטרים",
          "לא ניתן להעמיס רק לפי סוג ההחזרה",
        ],
        code: [
          {
            code: `public static int max(int a, int b) { ... }
public static double max(double a, double b) { ... }
public static int max(int a, int b, int c) { ... }`,
          },
        ],
      },
      {
        id: "scoping",
        title: "Scoping — תחום הכרה",
        points: [
          "משתנה מוכר רק בבלוק שבו הוגדר",
          'משתנה שהוגדר בתוך לולאת for מוכר רק בתוך הלולאה',
          "משתנים סטטיים (static) מוכרים בכל המחלקה",
          "פרמטרים מוכרים רק בתוך הפונקציה",
        ],
      },
      {
        id: "recursion",
        title: "רקורסיה (Recursion)",
        points: [
          "פונקציה שקוראת לעצמה",
          "חייב להיות תנאי עצירה (base case) — אחרת לולאה אינסופית!",
          "כל קריאה רקורסיבית מוסיפה frame ל-stack",
          "כל מה שניתן לעשות ברקורסיה ניתן גם בלולאה, ולהיפך",
          "יתרון לרקורסיה: לעיתים נראה יותר אלגנטי ומפשט את הקוד",
          "יתרון ללולאה: יותר יעיל, יותר מקובל בעולם התכנות",
        ],
        code: [
          {
            title: "Factorial — עצרת (רגיל ורקורסיבי)",
            code: `// רגיל
public static int factorial(int n) {
    int sum = 1;
    for (int i = 1; i <= n; i++) {
        sum *= i;
    }
    return sum;
}

// רקורסיבי
public static int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`,
          },
          {
            title: "Fibonacci — רגיל ורקורסיבי",
            code: `// רגיל
public static int fibonacci(int n) {
    if (n < 2) return 1;
    int fprev = 1, fprevprev = 1, f;
    for (int i = 2; i <= n; i++) {
        f = fprev + fprevprev;
        fprevprev = fprev;
        fprev = f;
    }
    return f;
}

// רקורסיבי
public static int fibo2(int n) {
    if (n == 0 || n == 1) return n;
    return fibo2(n-1) + fibo2(n-2);
}`,
          },
          {
            title: "ספירת תווים — charRunCount",
            code: `// רקורסיבי
public static int charRunCount(String str, char c) {
    if (str.length() == 0) return 0;
    int x;
    if (str.charAt(0) == c) {
        x = 1 + charRunCount(str.substring(1, str.length()), c);
    } else {
        x = 0 + charRunCount(str.substring(1, str.length()), c);
    }
    return x;
}`,
          },
        ],
      },
      {
        id: "fractals",
        title: "פרקטלים (Fractals)",
        points: [
          "דפוס של פעולה מסוימת (בד\"כ ציור) שחוזרת על עצמה",
          "מבוסס על רקורסיה — כל קריאה מציירת בקנה מידה קטן יותר",
          "דוגמה: עקומת בנאך (BanachCurve)",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 7. מערכים
  // ──────────────────────────────────────────────
  {
    id: "arrays",
    number: "7",
    title: "מערכים (Arrays)",
    intro: "מערכים זה משתנה מתקדם המורכב מלפחות משתנה פרימיטיבי אחד או (XOR) מלפחות משתנה מתקדם אחד. למערך אחד יכול להיות סוג אחד בלבד של משתנה.",
    subsections: [
      {
        id: "array-1d",
        title: "מערך חד מימדי",
        points: [
          "הצהרה עם נתונים: int[] arr = {1, 2, 6, 2};",
          "הצהרה ללא נתונים: int[] arr = new int[n];",
          "האיבר הראשון הוא arr[0], האחרון arr[arr.length - 1]",
          "לא ניתן לשנות גודל מערך אחרי שהוכרז!",
          "אי אפשר לבצע השוואה בין מערכים עם ==",
          "כדי לבצע פעולה על מערך צריך להכניסו ללולאה",
          "args הוא מערך של Strings — אורכו לא מוגדר מראש",
        ],
        note: "הבדל חשוב: str.length() סופר תווים (מתודה), arr.length סופר תאים (שדה, בלי סוגריים)",
      },
      {
        id: "array-2d",
        title: "מערך דו מימדי",
        points: [
          "הצהרה: int[][] arr = new int[m][n]; — m שורות, n עמודות",
          "arr.length — מספר השורות",
          "arr[i].length — אורך שורה i (מספר עמודות)",
          "ניתן לדמיין כמטריצה",
          "לעיתים רחוקות, אורך השורות יהיה שונה (Ragged Array)",
        ],
        code: [
          {
            title: "הדפסת מערך דו מימדי",
            code: `public static void print(int[][] m) {
    for (int i = 0; i < m.length; i++) {
        for (int j = 0; j < m[i].length; j++) {
            System.out.print(m[i][j] + " ");
        }
        System.out.println();
    }
}`,
          },
        ],
      },
      {
        id: "array-3d",
        title: "מערך תלת מימדי",
        points: [
          "הצהרה: int[][][] arr = new int[m][n][k];",
          "arr.length — מספר השורות (m)",
          "arr[i].length — מספר העמודות בשורה i",
          "arr[i][j].length — גודל המערך במיקום [i][j]",
        ],
      },
      {
        id: "array-functions",
        title: "פונקציות חשובות של מערכים",
        points: [
          "הדפסה: חובה להשתמש בלולאה (לא ניתן להדפיס מערך ישירות)",
          "swap: החלפת שני איברים בעזרת משתנה temp",
          "Row Interchange: החלפת שורות במערך דו מימדי",
          "equalArr: השוואת מערכים — בדיקת אורך + כל איבר",
        ],
        code: [
          {
            title: "השוואת מערכים",
            code: `public static boolean equalArr(int[] a, int[] b) {
    if (a.length != b.length) return false;
    for (int i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}`,
          },
        ],
      },
      {
        id: "rgb",
        title: "RGB",
        points: [
          "מערך תלת מימדי מסוג int, הגודל הפנימי הוא 3",
          "ערכים בטווח 0-255, כל מערך של 3 איברים נקרא פיקסל",
          "כל מספר מייצג צבע: {red, green, blue}",
          "דרך זיכרון — אדום ירוק כחול (א\"ך), באנגלית RGB מסוף להתחלה",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8. אובייקטים
  // ──────────────────────────────────────────────
  {
    id: "objects",
    number: "8",
    title: "אובייקטים (Objects)",
    intro: "אובייקט הוא כל משתנה אשר אינו פרימיטיבי. על אובייקטים לא ניתן לבצע פעולות מתמטיות, ולא ניתן להדפיסו ישירות. חייבים לבנות מתודות שיבצעו פעולות אלו.",
    subsections: [
      {
        id: "obj-name",
        title: "שם האובייקט (Class)",
        points: [
          "שם האובייקט יהיה באות גדולה — זה שם ה-class",
          "דוגמאות: Point, Fraction, Bank, Animal",
          "המשתמש — המתכנת שמשתמש באובייקט",
          "המתכן — המתכנת שיצר את האובייקט",
        ],
      },
      {
        id: "fields",
        title: "שדות (Fields)",
        points: [
          "הנתונים עבורם האובייקט מוגדר",
          "בדרך כלל private — אין גישה ישירה מבחוץ",
          "רצוי תמיד להיות עם שני שדות או יותר",
          "יכולים להיות אובייקטים בעצמם (הרכבה)",
        ],
        code: [
          {
            code: `public class Point {
    private double x;
    private double y;
}

public class BankAccount {
    private static int nextAccountId = 1;
    private int id;
    private int balance;
    private String owner;
}`,
          },
        ],
      },
      {
        id: "this-keyword",
        title: "המילה השמורה this",
        points: [
          "this מתייחסת לשדה בתוך האובייקט הנוכחי",
          "משתמשים כאשר שם הפרמטר זהה לשם השדה",
          "this.x = x; — השדה x מקבל את ערך הפרמטר x",
        ],
      },
      {
        id: "constructors",
        title: "בנאי (Constructor)",
        points: [
          "מתודה שמחברת בין השדות ויוצרת את האובייקט",
          "שם הבנאי = שם המחלקה, תמיד public",
          "ניתן (ורצוי) לבצע overloading על בנאים",
          "ניתן להשתמש בפונקציות בתוך הבנאי",
          "ניתן לקרוא לבנאי אחר עם this(params)",
        ],
        code: [
          {
            code: `public class Point {
    private double x;
    private double y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public Point(double x) {
        this(x, 0); // קורא לבנאי הראשון
    }
}`,
          },
        ],
      },
      {
        id: "tostring",
        title: "toString",
        points: [
          "מתודה שמציגה את האובייקט כ-String",
          "אם לא ממומשת — ילך לפונקציית toString של Object (לא שימושי)",
          "נהוג לדרוס (override) אותה בכל מחלקה",
        ],
        code: [
          {
            code: `public String toString() {
    return "(" + x + ", " + y + ")";
}`,
          },
        ],
      },
      {
        id: "equals-method",
        title: "equals",
        points: [
          "לא ניתן להשוות אובייקטים עם == (בודק כתובת, לא תוכן!)",
          "יש לממש equals שמשווה את השדות",
          "בודקת את שדות this מול שדות other (הפרמטר)",
          "לבדיקת שדה ספציפי ניתן להשתמש ב-get",
          'עבור String: השתמשו ב-str.equals(other), לא ==',
        ],
      },
      {
        id: "getters-setters",
        title: "get / set",
        points: [
          "get — מתודות שמאפשרות לקרוא שדות private מבחוץ",
          "set — מתודות שמאפשרות לשנות שדות private מבחוץ",
          "מספר מתודות get/set = בדרך כלל כמספר השדות",
          "get מחזיר את סוג השדה, set מחזיר void",
        ],
        code: [
          {
            code: `// get
public double getX() { return x; }
public double getY() { return y; }

// set
public void setX(double x) { this.x = x; }
public void setY(double y) { this.y = y; }`,
          },
        ],
      },
      {
        id: "basic-methods",
        title: "מתודות בסיסיות",
        points: [
          "הפונקציות יהיו פומביות — המשתמש צריך גישה אליהן",
          "המשתמש קורא במתודות בשם האובייקט: p1.add(p2)",
          "פונקציות של אובייקטים יכולות לקרוא לפונקציות אחרות באובייקטים",
        ],
        code: [
          {
            title: "דוגמה — Point",
            code: `public Point add(Point other) {
    double newx = this.x + other.x;
    double newy = this.y + other.y;
    return new Point(newx, newy);
}

public double distanceTo(Point other) {
    double dx = this.x - other.x;
    double dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
}`,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8.3 מבני נתונים
  // ──────────────────────────────────────────────
  {
    id: "data-structures",
    number: "8.3",
    title: "מבני נתונים",
    subsections: [
      {
        id: "node",
        title: "Node — תא בודד",
        points: [
          "כל תא מכיל מידע (data) ופוינטר (next) שמצביע לתא הבא",
          "השדות של Node יהיו public — כדי שמחלקות אחרות יוכלו לגשת",
          "ג'נריקס: Node<E> — תא שיכול להחזיק כל סוג",
        ],
        code: [
          {
            title: "Node רגיל וג'נרי",
            code: `// רגיל
public class Node {
    public String value;
    public Node next;
    public Node(String value, Node next) {
        this.value = value;
        this.next = next;
    }
}

// ג'נרי
public class Node<E> {
    E e;
    Node<E> next;
    public Node(E e) {
        this.e = e;
        this.next = null;
    }
}`,
          },
        ],
      },
      {
        id: "linked-list",
        title: "Linked List — רשימה מקושרת",
        points: [
          "רשימה של Node שמצביעים אחד לשני",
          "האיבר הראשון יהיה dummy — איבר בלי מידע (מכיל null)",
          "גודל הרשימה = size (לא כולל את ה-dummy)",
          "הוספת איבר: Node חדש מצביע על הבא → האיבר הקודם מצביע על החדש",
          "הורדת איבר: האיבר שלפני מצביע על האיבר שאחרי",
          "חשוב: לא לאבד מידע! קודם לחבר, אחר כך לנתק",
        ],
        code: [
          {
            code: `public class LinkedList<E> {
    private Node<E> first; // after dummy
    private Node<E> last;
    private int size;

    public LinkedList() {
        Node<E> dummy = new Node<E>(null);
        this.first = dummy;
        this.last = first;
        this.size = 0;
    }

    public E getFirst() {
        if (size > 0) return first.next.e;
        throw new NoSuchElementException();
    }
}`,
          },
        ],
      },
      {
        id: "list-iterator",
        title: "List Iterator",
        points: [
          "קלאס שעוזר לרוץ על הרשימה",
          "hasNext() — בודק אם יש עוד איברים",
          "next() — מחזיר את האיבר הנוכחי ומתקדם",
        ],
        code: [
          {
            code: `public ListIterator(Node node) {
    current = node;
}
public boolean hasNext() {
    return (current != null);
}
public Node next() {
    Node currentNode = current;
    current = current.next;
    return currentNode;
}`,
          },
        ],
      },
      {
        id: "stack",
        title: "Stack — מחסנית",
        points: [
          "ערימה של נתונים — גישה רק לאיבר העליון (LIFO)",
          "push(e) — מוסיף איבר לראש המחסנית",
          "pop() — מוריד ומחזיר את האיבר העליון",
          "isEmpty() — בודק אם המחסנית ריקה",
          "מבוסס על מערך עם מצביע top",
        ],
        code: [
          {
            code: `public class Stack {
    private static final int DEFAULT_CAPACITY = 100;
    private int[] elements;
    private int top;

    public Stack(int maxSize) {
        elements = new int[maxSize];
        top = 0;
    }
    public void push(int e) { elements[top++] = e; }
    public int pop() { return elements[--top]; }
    public boolean isEmpty() { return top == 0; }
}`,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8.4 Exceptions
  // ──────────────────────────────────────────────
  {
    id: "exceptions",
    number: "8.4",
    title: "Exceptions — חריגות",
    subsections: [
      {
        id: "exception-intro",
        title: "הקדמה",
        points: [
          "Exception היא הערה שקופצת אם לא משתמשים באובייקט כראוי",
          'הרעיון: "My Object, My rules"',
          "דוגמה: LinkedList ריקה → getFirst תזרוק NoSuchElementException",
          "דוגמה: Fraction עם מכנה 0 → ArithmeticException",
        ],
      },
      {
        id: "throw",
        title: "throw",
        points: [
          "throw גורם לפונקציה לעצור ולהקריס את התוכנה",
          "אפשרות 1: Exception קיימת — import java.util.NoSuchElementException;",
          "אפשרות 2: Exception חדשה — throw new ExceptionNameException();",
          "המילה האחרונה חייבת להיות Exception",
          "כאשר זו ArithmeticError: throw new ArithmeticException();",
          "רצוי להכניס throw בתוך תנאי כדי שהמתודה לא תקרוס תמיד",
        ],
      },
      {
        id: "try-catch",
        title: "try / catch",
        points: [
          "try — מנסה להריץ קוד שעלול לזרוק exception",
          "catch — תופס את ה-exception ומטפל בה",
          "צריך catch ככמות ה-exceptions השונים שבמתודות שנמצאו בתוך ה-try",
          "התוכנה ממשיכה לרוץ כרגיל אחרי ה-catch",
        ],
        code: [
          {
            code: `try {
    list.getFirst();
} catch (NoSuchElementException e) {
    System.out.println("Empty list!");
}`,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8.5 הורשה והרכבה
  // ──────────────────────────────────────────────
  {
    id: "inheritance",
    number: "8.5",
    title: "הורשה והרכבה",
    subsections: [
      {
        id: "composition",
        title: "הרכבה (Composition)",
        points: [
          "שימוש באובייקט כאחד השדות של אובייקט אחר",
          "שרשור אובייקטים: אובייקט בתוך אובייקט בתוך אובייקט...",
          "מבנה נתונים יכול להופיע כהרכבה (LinkedList לדוגמה)",
          "יכול להיות יותר מאובייקט אחד שמורכב בתוך אובייקט",
        ],
        code: [
          {
            code: `public class Student {
    private int sid;
    private String name;
    private LinkedList<CourseTaken> courseList;
}

public class College {
    private String name;
    private LinkedList<Course> courses;
    private LinkedList<Student> students;
}`,
          },
        ],
      },
      {
        id: "extends",
        title: "extends — הורשה",
        points: [
          "extends מעבירה את כל השדות של superClass ל-subClass",
          "קלאס אב (superClass) → קלאס בן (subClass)",
          "ב-subClass: public class Sub extends SuperClass { ... }",
          "protected — שדות שנגישים ל-subClass אבל לא לשאר",
          "שדות ב-superClass יהיו protected (לא private, לא public)",
        ],
      },
      {
        id: "super-keyword",
        title: "super",
        points: [
          "super נמצאת בשימוש בתוך subClass",
          "קוראת לפונקציה הדרוסה ב-superClass",
          "כל מתודה דרוסה (פרט לבנאי) צריך לקרוא לשם המתודה הדרוסה אחרי נק' super",
          "הבנאי צריך פשוט את המילה super עם הפרמטרים",
        ],
        code: [
          {
            code: `public class Khaleesi extends GameOfThornesChar {
    LinkedList<Dragon> dragons;

    public Khaleesi(String name, String house) {
        super(name, house); // קורא לבנאי של GameOfThornesChar
        this.dragons = new LinkedList<Dragon>();
    }

    public String toString() {
        String str = "and these are her dragons\\n";
        str += dragons.toString() + "\\n";
        return (super.toString() + "\\n" + str);
    }
}`,
          },
        ],
      },
      {
        id: "obj-class",
        title: "Object class",
        points: [
          "Object הוא ה-superclass של כל האובייקטים ב-Java",
          "כולל מתודות: clone(), equals(), hashCode(), toString(), getClass()",
          "כל אובייקט יורש מ-Object אוטומטית",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 9. Interface
  // ──────────────────────────────────────────────
  {
    id: "interface",
    number: "9",
    title: "Interface — ממשק",
    points: [
      "Interface הוא אובייקט רחב שמכיל רק חתימות של מתודות (בלי מימוש)",
      "מגדיר את ההתנהגות המינימלית לכל האובייקטים המשותפים תחת הממשק",
      "כל קלאס שנמצא בתוך ה-Interface חייב לממש את כל ההתנהגויות",
      "מצהירים על אובייקט בתור interface אחרי public",
      "כל אובייקט ששייך ל-interface משתמש במילה implements",
      "קלאס אחד יכול לקבל יותר מממשק אחד (Multiple Inheritance)",
      "API רגיל, קימפול רגיל",
    ],
    code: [
      {
        title: "דוגמה — ממשק Animal",
        code: `public interface Animal {
    public String sound();
    public Object eats();
}

public class Dog implements Animal {
    String food = "bonzo";
    public String sound() { return "woof"; }
    public String eats() { return food; }
}

public class Cow implements Animal {
    String food = "hay";
    double weight;
    public Cow(double weight) { this.weight = weight; }
    public String sound() { return "moo"; }
    public String eats() { return food; }
}

// Polymorphism
Animal[] animals = { new Cow(500), new Dog(), new Mouse() };
for (Animal a : animals) {
    System.out.println(a.getClass().getName() + " goes " + a.sound());
}
// Cow goes moo, Dog goes woof, Mouse goes squeak`,
      },
      {
        title: "Multiple Inheritance",
        code: `public interface Animal { /* Animal methods */ }
public interface Predator { /* Predator methods */ }
public interface Amphibious { /* Amphibious methods */ }

// Alligator מממש את כל שלושת הממשקים
public class Alligator implements Animal, Predator, Amphibious {
    /* חייב לממש את כל המתודות מכל הממשקים */
}`,
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 10. VIC
  // ──────────────────────────────────────────────
  {
    id: "vic",
    number: "10",
    title: "VIC — המחשב הוירטואלי",
    intro: "מכונת VIC מאפשרת לבחון את האופן שבו מחשבים פועלים ברמה האלמנטורית. למכונה 3 רכיבים: סרט קלט (Input bus), סרט פלט (Output bus), וזיכרון פנימי (Memory).",
    subsections: [
      {
        id: "vic-commands",
        title: "פקודות VIC",
        points: [
          "read (800) — D = input (קריאה מסרט הקלט)",
          "write (900) — output = D (כתיבה לסרט הפלט)",
          "load xx (3xx) — D = M[xx] (טעינה מזיכרון)",
          "store xx (4xx) — M[xx] = D (אחסון בזיכרון)",
          "add xx (1xx) — D = D + M[xx] (חיבור)",
          "sub xx (2xx) — D = D - M[xx] (חיסור)",
          "goto xx (5xx) — קפיצה לשורה xx",
          "gotoz xx (6xx) — if D=0, goto xx",
          "gotop xx (7xx) — if D>0, goto xx",
          "stop (000) — סיום התוכנית",
        ],
      },
      {
        id: "vic-assembler",
        title: "Vic Assembler",
        points: [
          "שפה גבוהה יותר — כותבים בשמות במקום מספרים",
          "מקומות 98 ו-99 בזיכרון שמורים לערכים 0 ו-1",
          "שמות המשתנים: zero ו-one",
          "ניתן לחלק את הקוד לקטעים עם שמות (labels)",
          "goto לשמות במקום למספרי שורות",
        ],
        code: [
          {
            title: "דוגמה ב-Assembler",
            code: `LOOP:
    read
    gotop PRINT
    gotoz END
    goto LOOP
PRINT:
    write
    goto LOOP
END:
    stop`,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 11. אלגוריתמי חיפוש
  // ──────────────────────────────────────────────
  {
    id: "searching",
    number: "11",
    title: "אלגוריתמי חיפוש (Searching Algorithms)",
    subsections: [
      {
        id: "sequential-search",
        title: "חיפוש סדרתי (Sequential Search)",
        points: [
          "עובר על כל איברי המערך בזה אחר זה",
          "מחזיר את האינדקס אם נמצא, -1 אם לא",
          "זמן ריצה: O(N) — במקרה הגרוע עובר על כל האיברים",
          "לא דורש מערך ממוין",
        ],
        code: [
          {
            code: `public static int indexOf(int x, int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == x) return i;
    }
    return -1;
}`,
          },
        ],
      },
      {
        id: "binary-search",
        title: "חיפוש בינארי (Binary Search)",
        points: [
          "עובד רק על מערך ממוין!",
          "בכל שלב בודק את האיבר האמצעי ומצמצם חצי מהמערך",
          "זמן ריצה: O(log₂N) — הרבה יותר מהיר מסדרתי",
          "דוגמה: במערך של מיליארד איברים, רק 30 צעדים!",
        ],
        code: [
          {
            code: `public static int indexOf(int x, int[] arr) {
    int low = 0;
    int high = arr.length - 1;
    while (low <= high) {
        int med = (low + high) / 2;
        if (x == arr[med]) return med;
        if (x < arr[med]) high = med - 1;
        else low = med + 1;
    }
    return -1;
}`,
          },
        ],
      },
      {
        id: "runtime-complexity",
        title: "חישובי זמני ריצה",
        points: [
          "O(1) — קבוע (Constant)",
          "O(log₂N) — לוגריתמי (Binary Search)",
          "O(N) — ליניארי (Sequential Search)",
          "O(N²) — ריבועי (לולאה כפולה, כמו Selection Sort)",
          "O(Nᵏ) — פולינומי",
          "O(2ᴺ), O(N!) — אקספוננציאלי (TSP)",
          "ככל שהסיבוכיות נמוכה יותר — האלגוריתם יעיל יותר",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 12. אלגוריתמי מיון
  // ──────────────────────────────────────────────
  {
    id: "sorting",
    number: "12",
    title: "אלגוריתמי מיון (Sorting Algorithms)",
    subsections: [
      {
        id: "selection-sort",
        title: "Selection Sort — מיון בחירה",
        points: [
          "בכל שלב מוצא את האיבר המינימלי ושם אותו במקום הנכון",
          "שלב 0: סורק N-1 איברים, שלב 1: N-2 איברים, וכו'",
          "סה\"כ צעדים: (N-1) + (N-2) + ... + 1 = ½N(N-1)",
          "זמן ריצה: O(N²)",
        ],
        code: [
          {
            code: `// Pseudo-code
for j = 0 .. N-1
    min = j
    for k = j+1 .. N
        if (A[k] < A[min])
            min = k
    swap A[j], A[min]`,
          },
        ],
      },
      {
        id: "insertion-sort",
        title: "Insertion Sort — מיון הכנסה",
        points: [
          "בכל שלב j, האיברים 0..j-1 ממוינים",
          "מזיז את איבר j שמאלה עד שנמצא המקום הנכון",
          "זמן ריצה: O(N²) במקרה הגרוע",
          "יעיל יותר מ-Selection Sort על מערכים כמעט ממוינים",
        ],
        code: [
          {
            code: `// Pseudo-code
for j = 1 .. N-1
    k = j - 1
    while A[k] > A[j] and k >= 0
        swap A[k+1], A[k]
        k--`,
          },
        ],
      },
      {
        id: "radix-sort",
        title: "Radix Sort — מיון ספרתי",
        points: [
          "ממיין לפי ספרת האחדות, אח\"כ עשרות, אח\"כ מאות וכו'",
          "משתמש ב-10 רשימות מקושרות (אחת לכל ספרה 0-9)",
          "זמן ריצה: O(k·N) = O(N) כאשר k הוא מספר הספרות של הערך המקסימלי",
          "דורש הרבה זיכרון נוסף (10 רשימות)",
        ],
      },
      {
        id: "merge-sort",
        title: "Merge Sort — מיון מיזוג",
        points: [
          "ממזג שני מערכים ממוינים למערך אחד ממוין",
          "משווה את האיבר הראשון בכל מערך ולוקח את הקטן",
          "זמן ריצה: O(N) למיזוג עצמו",
          "צריך לבדוק index overflow!",
        ],
        code: [
          {
            code: `// Merge algorithm (informal)
int[] A = new int[A1.length + A2.length];
i1 = 0; i2 = 0; i = 0;
while (i <= A.length - 1)
    if (A1[i1] < A2[i2])
        A[i++] = A1[i1++];
    else
        A[i++] = A2[i2++];`,
          },
        ],
      },
      {
        id: "newton-raphson",
        title: "Newton-Raphson Method",
        points: [
          "שיטה למציאת שורש של פונקציה: f(x) = 0",
          "מתחילים עם ניחוש ראשוני x₁",
          "משפרים באופן איטרטיבי: x_{n+1} = x_n - f(x_n)/f'(x_n)",
          "עוצרים כאשר f(x_{n+1}) קרוב מספיק ל-0",
          "חישוב שורש ריבועי הוא מקרה פרטי של השיטה",
        ],
        code: [
          {
            title: "חישוב שורש ריבועי",
            code: `// To compute r = sqrt(x):
// initialize r = x
// while r * r is not close enough to x:
//     r = (r + x / r) / 2`,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 13. אנקפסולציה / הרשאות גישה
  // ──────────────────────────────────────────────
  {
    id: "encapsulation",
    number: "13",
    title: "אנקפסולציה / הרשאות גישה",
    subsections: [
      {
        id: "access-modifiers",
        title: "Access Modifiers",
        points: [
          "private — גישה למחלקה עצמה בלבד. אין גישה מבחוץ",
          "public — גישה חופשית מכל מקום",
          "package-private (default) — מתקיים כשלא ציינו הרשאה. גישה מאותה חבילה בלבד",
          "protected — כמו package-private + גישה ליורשים",
          "package — הספרייה/תיקיה בה שמורה המחלקה, כל הקבצים באותה חבילה",
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 14. מילים שמורות
  // ──────────────────────────────────────────────
  {
    id: "reserved-words",
    number: "14",
    title: "המילים השמורות והיכן למצוא אותן",
    points: [
      "boolean — סוג נתונים (פרק 2)",
      "break — יציאה מלולאה (פרק 5)",
      "byte — מספר שלם קטן (פרק 2)",
      "case — בתוך switch (פרק 5)",
      "catch — תפיסת exception (פרק 8)",
      "char — תו בודד (פרק 2)",
      "class — הגדרת מחלקה (פרק 1)",
      "continue — דילוג לאיטרציה הבאה (פרק 5)",
      "default — ברירת מחדל ב-switch (פרק 5)",
      "do — לולאת do-while (פרק 5)",
      "double — מספר עשרוני (פרק 2)",
      "else — תנאי אלטרנטיבי (פרק 5)",
      "extends — הורשה (פרק 8)",
      "final — מקבע ערך מסוים (קבוע)",
      "float — מספר עשרוני קטן (פרק 2)",
      "for — לולאה (פרק 5)",
      "if — תנאי (פרק 5)",
      "implements — מימוש ממשק (פרק 9)",
      "import — ייבוא של מחלקה חיצונית",
      "int — מספר שלם (פרק 2)",
      "interface — הגדרת ממשק (פרק 9)",
      "long — מספר שלם גדול (פרק 2)",
      "new — יצירת אובייקט חדש (פרק 5, 4, 8)",
      "package — הגדרת חבילה (פרק 13)",
      "private — הרשאת גישה פרטית (פרק 13)",
      "protected — הרשאת גישה מוגנת (פרק 13)",
      "public — הרשאת גישה ציבורית (פרק 13)",
      "return — החזרת ערך מפונקציה (פרק 6)",
      "static — פונקציה שקבועה לקלאס (לא של אובייקטים)",
      "super — קריאה לפונקציה של מחלקת אב (פרק 8)",
      "switch — בחירה מרובה (פרק 5)",
      "this — הפניה לאובייקט הנוכחי (פרק 8)",
      "throw — זריקת exception (פרק 8)",
      "try — ניסיון הרצת קוד (פרק 8)",
      "void — פונקציה שלא מחזירה ערך (פרק 6)",
      "while — לולאה (פרק 5)",
    ],
  },

  // ──────────────────────────────────────────────
  // 15. דגשים למבחן
  // ──────────────────────────────────────────────
  {
    id: "exam-tips",
    number: "15",
    title: "דגשים למבחן",
    points: [
      "תרגלו כתיבת קודים עם דף ועט (בלי מחשב!)",
      "Scoping — חשוב לסמן מה כל scope",
      "פונקציות — רצוי לדעת API, אי אפשר לדעת את כל הפונקציות בעולם",
      "אם תזכרו API וכמה פונק' מרכזיות זה מספיק טוב",
      "עברו על מבחנים קודמים ותרגלו עם המתרגל",
    ],
  },

  // ──────────────────────────────────────────────
  // 16. רעיונות לשאלות
  // ──────────────────────────────────────────────
  {
    id: "practice-ideas",
    number: "16",
    title: "רעיונות לתרגול",
    points: [
      "סדרה חשבונית — בדיקה, חישוב סכום, מציאת איבר ה-n",
      "סדרה הנדסית — בדיקה, חישוב סכום, מציאת איבר ה-n",
      "נוסחת שורשים — בדיקת תוצאה כש-a=1, כש-a≠1",
      "חפיסת קלפים (Coupon Collector)",
      "אלגוריתם ערבוב, משחק מלחמה (בלי מצגת)",
      "מטריצות — הדפסה, חיבור, כפל, transpose, determinant, REF, RREF",
      "עצרת (Factorial) — רגיל ורקורסיבי",
      "סדרת פיבונאצ'י — רגיל ורקורסיבי",
      "charRunCount — רקורסיבי",
      "parseInt — רקורסיבי",
      "equals, substring, ignore case, CAPSLOCK",
      "מיון, חיפוש, הדפסת מערכים",
      "מימוש אובייקטים: LinkedList, Node, ListIterator",
    ],
  },
]
