/**
 * CS Exam Marathon - Theory Summaries
 * Comprehensive Hebrew study summaries for all 21 topics across 10 Days
 * Each summary: מבוא → מושגי יסוד → תחביר → דפוסים נפוצים → דוגמאות → טעויות שכיחות → טיפים למבחן
 */

export interface PdfResource {
  title: string
  url: string
  type: "lecture" | "recitation"
}

export interface TheorySummary {
  topicSlug: string
  dayNumber: number
  title: string
  markdown: string
  pdfResources: PdfResource[]
  estimatedReadingMinutes: number
}

export interface DaySummaryGroup {
  dayNumber: number
  dayTitle: string
  topics: TheorySummary[]
  pdfResources: PdfResource[]
}

// ─── PDF Resources per Day ───────────────────────────────────────────────────

const day1Pdfs: PdfResource[] = [
  { title: "הרצאה 1-1", url: "/data/lecture+tirgul/lecture 1-1.pdf", type: "lecture" },
  { title: "הרצאה 1-2", url: "/data/lecture+tirgul/lecture 1-2.pdf", type: "lecture" },
  { title: "תרגול 1", url: "/data/lecture+tirgul/Recitation 1.pdf", type: "recitation" },
]

const day2Pdfs: PdfResource[] = [
  { title: "הרצאה 2-1", url: "/data/lecture+tirgul/lecture 2-1.pdf", type: "lecture" },
  { title: "הרצאה 2-2", url: "/data/lecture+tirgul/lecture 2-2.pdf", type: "lecture" },
  { title: "תרגול 2", url: "/data/lecture+tirgul/Recitation 02.pdf", type: "recitation" },
  { title: "תרגול 3", url: "/data/lecture+tirgul/Recitation 03.pdf", type: "recitation" },
]

const day3Pdfs: PdfResource[] = [
  { title: "הרצאה 3-1", url: "/data/lecture+tirgul/lecture 3-1.pdf", type: "lecture" },
  { title: "הרצאה 3-2", url: "/data/lecture+tirgul/lecture 3-2.pdf", type: "lecture" },
  { title: "תרגול 4", url: "/data/lecture+tirgul/Recitation 04.pdf", type: "recitation" },
]

const day4Pdfs: PdfResource[] = [
  { title: "הרצאה 4-1", url: "/data/lecture+tirgul/lecture 4-1.pdf", type: "lecture" },
  { title: "הרצאה 4-2", url: "/data/lecture+tirgul/lecture 4-2.pdf", type: "lecture" },
  { title: "תרגול 5", url: "/data/lecture+tirgul/Recitation 05.pptx.pdf", type: "recitation" },
]

const day5Pdfs: PdfResource[] = [
  { title: "הרצאה 5-1", url: "/data/lecture+tirgul/lecture 5-1.pdf", type: "lecture" },
  { title: "הרצאה 5-2", url: "/data/lecture+tirgul/lecture 5-2.pdf", type: "lecture" },
  { title: "תרגול 6", url: "/data/lecture+tirgul/Recitation 06.pptx.pdf", type: "recitation" },
]

const day6Pdfs: PdfResource[] = [
  { title: "הרצאה 6-1", url: "/data/lecture+tirgul/lecture 6-1.pdf", type: "lecture" },
  { title: "הרצאה 6-2", url: "/data/lecture+tirgul/lecture 6-2.pdf", type: "lecture" },
  { title: "תרגול 7", url: "/data/lecture+tirgul/Recitation 07.pdf", type: "recitation" },
]

const day7Pdfs: PdfResource[] = [
  { title: "הרצאה 7-1", url: "/data/lecture+tirgul/lecture 7-1.pdf", type: "lecture" },
  { title: "הרצאה 8-1", url: "/data/lecture+tirgul/lecture 8-1.pdf", type: "lecture" },
  { title: "הרצאה 8-2", url: "/data/lecture+tirgul/lecture 8-2.pdf", type: "lecture" },
  { title: "תרגול 8", url: "/data/lecture+tirgul/Recitation08_2025-26.pdf", type: "recitation" },
]

const day8Pdfs: PdfResource[] = [
  { title: "הרצאה 9-1", url: "/data/lecture+tirgul/lecture 9-1.pdf", type: "lecture" },
  { title: "הרצאה 9-2", url: "/data/lecture+tirgul/lecture 9-2.pdf", type: "lecture" },
  { title: "תרגול 9", url: "/data/lecture+tirgul/Recitation 09 - 2025.pdf", type: "recitation" },
]

const day9Pdfs: PdfResource[] = [
  { title: "הרצאה 10-1", url: "/data/lecture+tirgul/lecture 10-1.pdf", type: "lecture" },
  { title: "הרצאה 10-2", url: "/data/lecture+tirgul/lecture 10-2.pdf", type: "lecture" },
  { title: "תרגול 10", url: "/data/lecture+tirgul/Recitation 10 - 2025.pdf", type: "recitation" },
]

const day10Pdfs: PdfResource[] = [
  { title: "הרצאה 11-1", url: "/data/lecture+tirgul/lecture 11-1.pdf", type: "lecture" },
  { title: "הרצאה 11-2", url: "/data/lecture+tirgul/lecture 11-2.pdf", type: "lecture" },
  { title: "הרצאה 12-1", url: "/data/lecture+tirgul/lecture 12-1.pdf", type: "lecture" },
  { title: "הרצאה 12-2", url: "/data/lecture+tirgul/lecture 12-2.pdf", type: "lecture" },
  { title: "הרצאה 13-2", url: "/data/lecture+tirgul/lecture 13-2.pdf", type: "lecture" },
  { title: "תרגול 11", url: "/data/lecture+tirgul/Recitation 11 - 2025.pdf", type: "recitation" },
  { title: "תרגול 12", url: "/data/lecture+tirgul/Recitation 12 [Autosaved].pdf", type: "recitation" },
  { title: "תרגול 13", url: "/data/lecture+tirgul/Recitation 13.pdf", type: "recitation" },
]

// ─── Topic Summaries ─────────────────────────────────────────────────────────

export const theorySummaries: TheorySummary[] = [
  // ==================== Day 1: Fundamentals & I/O ====================
  {
    topicSlug: "variables-and-types",
    dayNumber: 1,
    title: "יסודות Java, משתנים וטיפוסים",
    estimatedReadingMinutes: 12,
    pdfResources: day1Pdfs,
    markdown: `## מהי תוכנית Java?

תוכנית Java מורכבת מ-**מחלקה (class)** אחת או יותר. כל מחלקה מכילה **מתודות (methods/functions)**, וכל מתודה מכילה סדרה של **פקודות (statements)**.

בשלב הזה, נכתוב תוכניות עם מחלקה אחת ומתודה אחת — \`main\`:

\`\`\`java
public class ClassName {
    public static void main(String[] args) {
        // הפקודות שלנו כאן
    }
}
\`\`\`

- שם הקובץ **חייב** להתאים לשם המחלקה: \`ClassName.java\`
- המתודה \`main\` היא **נקודת הכניסה** — בלעדיה לא ניתן להריץ את המחלקה

## קומפילציה והרצה

Java עובדת בשני שלבים:

**שלב 1 — קומפילציה** (הידור): ממירה קוד מקור לקובץ bytecode
\`\`\`
javac MyCode.java
\`\`\`
- מקבלת קובץ \`.java\` (קוד מקור שכתבנו)
- יוצרת קובץ \`.class\` (bytecode — קוד שהמחשב יודע להריץ)

**שלב 2 — הרצה**: מריצה את ה-bytecode
\`\`\`
java MyCode
\`\`\`
- שימו לב: כותבים רק את **שם המחלקה**, בלי \`.class\`

## שורת הפקודה (Command Line)

מהתרגול — כך מקמפלים ומריצים תוכנית Java בטרמינל:

\`\`\`
javac MyCode.java
java MyCode
\`\`\`

אם התוכנית מצפה לקבל ארגומנטים, מעבירים אותם **אחרי שם המחלקה**, מופרדים ברווח:
\`\`\`
java Mult 9 3
\`\`\`

**כללים**:
- הארגומנטים באים אחרי שם המחלקה
- רווח יחיד בין כל ארגומנט
- למחלקה חייבת להיות מתודת \`main\` כדי שאפשר יהיה להריץ אותה

## Git & GitHub

**Git** — תוכנה לניהול גרסאות של קוד. עוזרת למפתחים לעקוב אחרי שינויים בפרויקט.

**GitHub** — אתר שמאחסן פרויקטים שמנוהלים ב-Git, ומאפשר שיתוף עם אחרים.

מושגי יסוד:
- **Repository (ריפו)** — פרויקט או תיקייה ש-Git עוקב אחריה
- **Commit** — שמירת מצב נוכחי (גרסה שמורה)

### פקודות Git בסיסיות

| פקודה | מה עושה |
|--------|---------|
| \`git init\` | יוצרת repository חדש בתיקייה קיימת |
| \`git clone <url>\` | מעתיקה repository מ-GitHub למחשב המקומי |
| \`git add <file>\` | מוסיפה קובץ לאזור ההכנה (staging) לפני commit |
| \`git commit -m "message"\` | שומרת את השינויים עם הודעה מתארת |
| \`git push\` | שולחת את ה-commits ל-repository מרוחק (GitHub) |

### .gitignore
קובץ מיוחד שאומר ל-Git אילו קבצים **להתעלם מהם**:
- קבצים רגישים (כמו הגדרות מערכת)
- קבצים שנוצרים אוטומטית (כמו \`.class\`)
- קבצים של מערכת ההפעלה או כלים

## שגיאות (Errors)

שלושה סוגים עיקריים של שגיאות:

### 1. שגיאות קומפילציה (Compiler Errors)
מתרחשות בזמן הקומפילציה (\`javac\`). הקוד לא עומד בכללי התחביר של Java.

דוגמאות:
- **שגיאת תחביר (Syntax)** — שכחתם \`;\` או \`}\`
- **אי-התאמת טיפוסים (Type Mismatch)** — למשל: \`int num = "1";\` (בלי casting)
- **משתנה לא מאותחל** — שימוש במשתנה שלא קיבל ערך התחלתי: \`int n; int m = n;\`

### 2. שגיאות ריצה (Runtime Errors)
הקוד עובר קומפילציה בהצלחה, אבל קורס בזמן ההרצה.

דוגמאות:
- **חוסר ארגומנטים** — הרצה בלי לתת מספיק ארגומנטים → \`ArrayIndexOutOfBoundsException\`
- **שגיאה אריתמטית** — חילוק ב-0: \`1 / 0\` → \`ArithmeticException\`
- **חריגה מגבולות** — גישה לאינדקס שלא קיים
- **NumberFormatException** — ניסיון לפרסר מחרוזת שאינה מספר: \`Integer.parseInt("Hello World")\`
- **StackOverflow** — שגיאה לוגית שגורמת לרקורסיה אינסופית

**טיפ לדיבאג**: הודעת השגיאה מכילה "שרשרת" של שורות. בדרך כלל **קרוב לתחתית** תמצאו את השורה מהקוד שלכם — התחילו משם.

### 3. שגיאות לוגיות (Logical Errors)
הקוד מתקמפל ורץ בלי לקרוס, אבל **התוצאה שגויה**.

סימנים:
- התוכנית לא עוצרת (לולאה אינסופית — ctrl+c / command+c לעצירה)
- התוכנית עוצרת אבל הפלט לא נכון

**איך מוצאים?** בודקים את הקוד עם **מקרי בדיקה רבים**, כולל **מקרי קצה (edge cases)**. לכל שלב, בודקים שהפלט בפועל מתאים לפלט הצפוי.

**טיפ מהתרגול**: התחילו לעבוד עם ערכים קבועים (literals) בקוד. רק אחרי שהכל עובד — עברו לארגומנטים משורת הפקודה. אחרי שזה עובד, בדקו עם ארגומנטים.

## משתנים וטיפוסי נתונים

### מהו משתנה?

לפי ההגדרה מההרצאה, משתנה הוא **מיכל מופשט (abstract container)** שיש לו:
- **שם (name)** — קבוע לאורך התוכנית
- **טיפוס (type)** — קבוע, נקבע בהצהרה
- **ערך (value)** — יכול להשתנות במהלך הריצה

### הצהרה (Declaration)

יצירת משתנה חדש עם ציון הטיפוס:
\`\`\`java
int x;              // הצהרה
int a, b;           // הצהרת כמה משתנים מאותו טיפוס
int z = x + y;      // הצהרה + אתחול בשורה אחת
\`\`\`
משתנה יכול להחזיק **רק ערכים מהטיפוס שהוצהר**. שימוש במשתנה לא מאותחל גורם לשגיאת קומפילציה.

### השמה (Assignment)

הכנסת ערך למשתנה:
\`\`\`java
x = 5;
\`\`\`
**אנטומיית ההשמה** (מההרצאה):
1. קודם מחשבים את **הביטוי בצד ימין**
2. שמים את התוצאה במשתנה שב**צד שמאל**

**חשוב**: ה-\`=\` הוא **אופרטור השמה**, לא סימן שוויון מתמטי.

### טיפוסים פרימיטיביים

| טיפוס | תיאור |
|--------|--------|
| \`int\` | מספר שלם (32 ביט) |
| \`double\` | מספר ממשי (64 ביט) |
| \`boolean\` | ערך לוגי — \`true\` או \`false\` |
| \`char\` | תו בודד (16 ביט) |

### טיפוס הפניה — String

\`String\` הוא **טיפוס אובייקט** (לא פרימיטיבי) שמייצג רצף של תווים:
\`\`\`java
String city = "Herzliya";
\`\`\`

## פעולות על שלמים (int)

האופרטורים: \`+\`, \`-\`, \`*\`, \`/\`, \`%\`

\`\`\`java
// דוגמאות מההרצאה (Demo2)
System.out.println(5 + 3);    // 8
System.out.println(5 - 3);    // 2
System.out.println(5 * 3);    // 15
System.out.println(5 / 5);    // 1
System.out.println(5 % 3);    // 2
System.out.println(1 / 0);    // Runtime error!
\`\`\`

**סדר קדימויות**: \`*\`, \`/\`, \`%\` לפני \`+\`, \`-\`. באותה רמה — חישוב משמאל לימין. סוגריים גוברים על הכל:
\`\`\`java
System.out.println(3 * 5 - 2);       // 13
System.out.println(3 + 5 / 2);       // 5
System.out.println(3 - 5 - 2);       // -4
System.out.println(3 - (5 - 2));     // 0
\`\`\`

**חילוק שלמים**: כאשר שני האופרנדים \`int\`, התוצאה היא \`int\` — **החלק השלם בלבד**. \`1 / 3\` שווה \`0\`, לא \`0.333\`.

## שרשור מחרוזות (String Concatenation)

כאשר אחד הצדדים הוא \`String\`, Java ממירה את הצד השני ל-\`String\` ומשרשרת:

\`\`\`java
// דוגמאות מההרצאה (Demo3)
System.out.println("Tel" + "Aviv");     // "TelAviv"
System.out.println("Tel" + 3);          // "Tel3"
System.out.println(6 + 5);             // 11
System.out.println("6" + "5");         // "65"
System.out.println("6" + 5);           // "65"
System.out.println(2 + " + " + 3 + " = " + (2 + 3)); // "2 + 3 = 5"
\`\`\`

## מספרים ממשיים (double)

**כלל חשוב**: אם אחד האופרנדים הוא \`double\`, התוצאה היא \`double\`:

\`\`\`java
// דוגמאות מההרצאה (Demo6)
System.out.println(5.0 / 2.0);  // 2.5
System.out.println(5 / 2);      // 2 (שני int — תוצאה int!)
System.out.println(5.0 / 2);    // 2.5 (אחד double — תוצאה double)
System.out.println(1 / 3);      // 0
System.out.println(1.0 / 3.0);  // 0.3333333333333333
System.out.println(1.0 / 0.0);  // Infinity
System.out.println(1 / 0);      // Runtime error!
\`\`\`

\`Math.sqrt(-1.0)\` מחזיר \`NaN\` (Not a Number).

## boolean — ערכים לוגיים

שני ערכים בלבד: \`true\` ו-\`false\`.

### אופרטורים להשוואה

| אופרטור | משמעות | true | false |
|----------|--------|------|-------|
| \`==\` | שווה | \`2 == 2\` | \`2 == 3\` |
| \`!=\` | שונה | \`3 != 2\` | \`2 != 2\` |
| \`<\` | קטן מ | \`2 < 13\` | \`2 < 2\` |
| \`<=\` | קטן-שווה | \`2 <= 2\` | \`3 <= 2\` |
| \`>\` | גדול מ | \`13 > 2\` | \`2 > 13\` |
| \`>=\` | גדול-שווה | \`3 >= 2\` | \`2 >= 3\` |

### מחברים לוגיים (Connectors)
- \`!a\` — NOT: אמת אם ורק אם \`a\` שקר
- \`a && b\` — AND: אמת אם ורק אם **שניהם** אמת
- \`a || b\` — OR: אמת אם **לפחות אחד** אמת

\`\`\`java
// דוגמה מההרצאה — בדיקת שנה מעוברת
public class LeapYear {
    public static void main(String[] args) {
        int year = Integer.parseInt(args[0]);
        boolean isLeapYear;
        isLeapYear = ((year % 400) == 0);
        isLeapYear = isLeapYear || (((year % 4) == 0) && ((year % 100) != 0));
        System.out.println(isLeapYear);
    }
}
// java LeapYear 2020 → true
// java LeapYear 1900 → false
\`\`\`

## המרות טיפוסים (Casting)

### המרה מרומזת (Implicit)
Java ממירה אוטומטית כאשר אין סכנת אובדן מידע:
\`\`\`java
"1234" + 99         // "123499" (String)
11 * 0.3            // 3.3 (double — כי אחד מהם double)
\`\`\`

### המרה מפורשת (Explicit)
\`\`\`java
Integer.parseInt("123")   // 123 (String → int)
(int) 2.71828             // 2 (חיתוך! לא עיגול)
(int) (11 * 0.3)          // 3 (קודם 3.3, אז חיתוך ל-3)
(11 * (int) 0.3)          // 0 (קודם (int)0.3=0, אז 11*0=0!)
\`\`\`

**שימו לב**: **סדר ה-cast משנה את התוצאה!**

## ספריית Math

\`Math.random()\` — מחזירה מספר \`double\` אקראי בטווח [0, 1).

דוגמה מההרצאה — יצירת מספר שלם אקראי בטווח [0, N):
\`\`\`java
public class RandomInt {
    public static void main(String[] args) {
        int N = Integer.parseInt(args[0]);
        double r = Math.random();
        int n = (int) (r * N);
        System.out.println("random integer is " + n);
    }
}
// java RandomInt 10 → random integer is 6
\`\`\`

## דפוס נפוץ — חילוף ערכים (FlipFlop)

מהתרגול — החלפת ערכים בין שני משתנים דורשת **משתנה עזר (temp)**:

\`\`\`java
public class FlipFlop {
    public static void main(String[] args) {
        int a = 5;
        int b = 7;
        int temp = a;
        a = b;
        b = temp;
    }
}
\`\`\`

עם הדפסות:
\`\`\`java
public class FlipFlop {
    public static void main(String[] args) {
        int a = 5;
        int b = 7;
        System.out.println("a: " + a + ", b: " + b);
        int temp = a;
        a = b;
        b = temp;
        System.out.println("a: " + a + ", b: " + b);
    }
}
\`\`\`

גרסה עם ארגומנטים משורת הפקודה:
\`\`\`java
public class FlipFlop {
    public static void main(String[] args) {
        int a = Integer.parseInt(args[0]);
        int b = Integer.parseInt(args[1]);
        System.out.println("a: " + a + ", b: " + b);
        int temp = a;
        a = b;
        b = temp;
        System.out.println("a: " + a + ", b: " + b);
    }
}
// java FlipFlop 6 67 → a: 6, b: 67 → a: 67, b: 6
\`\`\`

**הסבר**: \`args[0]\` ו-\`args[1]\` הם **תמיד מסוג String**. צריך לפרסר (להמיר) אותם לטיפוס הרצוי לפני השימוש.

## ארגומנטים משורת הפקודה (Command-Line Arguments)

ערכים שנכתבים אחרי שם המחלקה בפקודת \`java\` מגיעים למערך \`args\` בפונקציית \`main\`.

\`\`\`
java Demo5 5 3
\`\`\`
- \`args[0]\` = \`"5"\` (String!)
- \`args[1]\` = \`"3"\` (String!)

### פרסור (Parsing) — המרה מ-String לטיפוס אחר:

| המרה | פונקציה |
|--------|---------|
| String → int | \`Integer.parseInt(args[0])\` |
| String → double | \`Double.parseDouble(args[0])\` |
| String → boolean | \`Boolean.parseBoolean(args[0])\` |

\`\`\`java
// דוגמה מההרצאה (Demo5)
public class Demo5 {
    public static void main(String[] args) {
        int a = Integer.parseInt(args[0]);
        int b = Integer.parseInt(args[1]);
        System.out.println(a + " + " + b + " = " + (a + b));
        System.out.println(a + " * " + b + " = " + (a * b));
        System.out.println(a + " / " + b + " = " + (a / b));
        System.out.println(a + " % " + b + " = " + (a % b));
    }
}
\`\`\`

**אזהרות**:
- אם לא מעבירים מספיק ארגומנטים → \`ArrayIndexOutOfBoundsException\`
- אם מעבירים טקסט במקום מספר → \`NumberFormatException\`

## הצפה ושגיאות עיגול (Overflow & Rounding)

\`\`\`java
// דוגמה מההרצאה (Demo9)
System.out.println(100000 * 100000 * 100000);  // -1530494976 (overflow!)
System.out.println(1.03 - 0.42);                // 0.6100000000000001
System.out.println(1.00 - 9 * .10);             // 0.09999999999999998
System.out.println((0.7 + 0.1) == (0.9 - 0.1)); // false!
\`\`\`

המחשב מייצג מספרים עם מספר סופי של ביטים → **הצפה** בשלמים, **אי-דיוק** בממשיים.

## טיפים למבחן

- **חילוק שלמים**: \`1 / 3 == 0\`, לא \`0.333\`! אם רוצים תוצאה עשרונית — לפחות אופרנד אחד צריך להיות \`double\`
- **casting**: סדר ה-cast קריטי — \`(int)(11 * 0.3)\` → \`3\`, אבל \`(11 * (int)0.3)\` → \`0\`
- **overflow**: \`100000 * 100000 * 100000\` נותן מספר שלילי בגלל הצפת \`int\`
- **args הם String**: חייבים לפרסר אותם לפני שימוש מתמטי
- **שרשור מחרוזות**: \`"6" + 5\` → \`"65"\` — כשאחד הצדדים הוא \`String\`, הכל הופך ל-\`String\``,
  },
  {
    topicSlug: "input-output",
    dayNumber: 1,
    title: "פלט ושורת הפקודה",
    estimatedReadingMinutes: 5,
    pdfResources: day1Pdfs,
    markdown: `## פלט בסיסי

Java משתמשת ב-\`System.out\` להדפסה:

\`\`\`java
System.out.println("Hello");    // מדפיס + ירידת שורה
System.out.print("No newline"); // מדפיס בלי ירידת שורה
\`\`\`

## תהליך הפיתוח

לפי ההרצאה, תהליך הפיתוח הוא מעגלי:
1. **עריכה** — כתיבת הקוד בקובץ \`.java\`
2. **קומפילציה** — \`javac MyProg.java\` → יוצרת \`MyProg.class\`
3. **הרצה** — \`java MyProg\`
4. **בדיקה** — האם התוצאה נכונה?
5. אם לא — חזרה לשלב 1 (דיבאג)

## קלט דרך ארגומנטים (לא Scanner)

**חשוב**: בקורס הזה, בשבוע 1 הקלט מגיע דרך **ארגומנטים משורת הפקודה**, לא דרך Scanner.

\`\`\`
javac Demo5.java
java Demo5 5 3
\`\`\`

הארגומנטים \`5\` ו-\`3\` מגיעים ל-\`args[0]\` ו-\`args[1]\` כ-\`String\`:
\`\`\`java
int a = Integer.parseInt(args[0]);    // "5" → 5
int b = Integer.parseInt(args[1]);    // "3" → 3
\`\`\`

## דוגמה מלאה — Quad1 (משוואה ריבועית)

\`\`\`java
public class Quad1 {
    public static void main(String[] args) {
        double b = Double.parseDouble(args[0]);
        double c = Double.parseDouble(args[1]);
        double discriminant = b * b - 4.0 * c;
        double d = Math.sqrt(discriminant);
        double root1 = (-b + d) / 2.0;
        double root2 = (-b - d) / 2.0;
        System.out.println(root1);
        System.out.println(root2);
    }
}
\`\`\`

\`\`\`
java Quad1 -3.0 2.0 → 2.0, 1.0
java Quad1 1.0 hello → NumberFormatException
java Quad1 1.0       → ArrayIndexOutOfBoundsException
\`\`\`

## טיפים למבחן

- קלט בשבוע 1 הוא דרך **ארגומנטים משורת הפקודה** — לא Scanner
- \`System.out.println\` מדפיס עם ירידת שורה, \`System.out.print\` בלי
- תמיד לפרסר \`args\` לפני שימוש — הם תמיד \`String\``,
  },

  // ==================== Day 2: Control Flow ====================
  {
    topicSlug: "conditionals",
    dayNumber: 2,
    title: "תנאים ומחרוזות",
    estimatedReadingMinutes: 12,
    pdfResources: day2Pdfs,
    markdown: `## מבוא

לפי ההרצאה, זרימת תוכנית (program flow) יכולה להיות **רציפה** (sequential — שורה אחרי שורה), **מותנית** (conditional — הסתעפות לפי תנאי), או **חוזרת** (iterative — לולאה). ביום הזה נתמקד בתנאים ובמחרוזות.

## תנאים (Conditionals)

### משפט if

\`\`\`java
if (condition) {
    // מתבצע רק אם condition הוא true
}
\`\`\`

**כלל חשוב מההרצאה**: תמיד כתבו סוגריים מסולסלים \`{}\`, גם אם יש שורה אחת בלבד — זה מונע באגים.

### משפט if-else

\`\`\`java
if (condition) {
    // מתבצע אם true
} else {
    // מתבצע אם false
}
\`\`\`

דוגמה מההרצאה — מציאת המקסימום בין שני מספרים:

\`\`\`java
public class Max {
    public static void main(String[] args) {
        int x = Integer.parseInt(args[0]);
        int y = Integer.parseInt(args[1]);
        int max;
        if (x > y) {
            max = x;
        } else {
            max = y;
        }
        System.out.println("max = " + max);
    }
}
\`\`\`

### שרשרת if / else if / else

כאשר יש יותר משתי אפשרויות, משתמשים בשרשרת. **הסדר קריטי** — רק התנאי הראשון שמתקיים יבוצע:

\`\`\`java
// דוגמה מההרצאה — חישוב מס
double tax;
if (income <= 5000) {
    tax = income * 0.05;
} else if (income <= 10000) {
    tax = 5000 * 0.05 + (income - 5000) * 0.1;
} else {
    tax = 5000 * 0.05 + 5000 * 0.1 + (income - 10000) * 0.3;
}
\`\`\`

דוגמה מהתרגול — סיווג משתמשים לפי קוד תפקיד:

\`\`\`java
// UserRole (תרגול 2)
public class UserRole {
    public static void main(String[] args) {
        int role = Integer.parseInt(args[0]);
        if (role == 1) {
            System.out.println("Admin");
        } else if (role == 2) {
            System.out.println("Editor");
        } else if (role == 3) {
            System.out.println("Viewer");
        } else {
            System.out.println("Unknown role");
        }
    }
}
// java UserRole 1 → Admin
\`\`\`

**שימו לב (מהתרגול)**: אם נכתוב \`if (role >= 1)\` במקום \`if (role == 1)\`, הענף הראשון יתפוס גם role=2 ו-role=3. הסדר והאופרטור חשובים!

### אופרטור שלישוני (Ternary)

קיצור ל-if-else פשוט — **ביטוי** שמחזיר ערך:

\`\`\`java
// condition ? valueIfTrue : valueIfFalse
int max = (x > y) ? x : y;
\`\`\`

## מחרוזות (Strings)

לפי ההרצאה, \`String\` הוא טיפוס **אובייקט** (לא פרימיטיבי). מחרוזת היא **סדרה אינדקסית של תווים** — האינדקס מתחיל מ-0:

\`\`\`
s = "Hello"
     H  e  l  l  o
     0  1  2  3  4
\`\`\`

### מתודות עיקריות

| מתודה | תיאור | דוגמה (\`s = "Hello"\`) |
|--------|--------|-------------------------|
| \`s.length()\` | מספר התווים | \`5\` |
| \`s.charAt(i)\` | התו באינדקס i | \`s.charAt(1)\` → \`'e'\` |
| \`s.indexOf(str)\` | אינדקס המופע הראשון | \`s.indexOf("ll")\` → \`2\` |
| \`s.substring(a, b)\` | תת-מחרוזת מ-a עד b (לא כולל b) | \`s.substring(1, 4)\` → \`"ell"\` |

\`indexOf\` מחזיר \`-1\` אם לא נמצא.

### דוגמה מהתרגול — מרחק אוקלידי

\`\`\`java
// EuclideanDistance (תרגול 2)
public class EuclideanDistance {
    public static void main(String[] args) {
        double x1 = Double.parseDouble(args[0]);
        double y1 = Double.parseDouble(args[1]);
        double x2 = Double.parseDouble(args[2]);
        double y2 = Double.parseDouble(args[3]);
        double dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        System.out.println(dist);
    }
}
// java EuclideanDistance 0 0 3 4 → 5.0
\`\`\`

### דוגמה מהתרגול — בדיקת אימייל

\`\`\`java
// IsValidEmail (תרגול 2)
public class IsValidEmail {
    public static void main(String[] args) {
        String email = args[0];
        int atIndex = email.indexOf("@");
        // בדיקה: יש @ שלא בהתחלה ולא בסוף
        if (atIndex > 0 && atIndex < email.length() - 1) {
            System.out.println("Valid");
        } else {
            System.out.println("Invalid");
        }
    }
}
// java IsValidEmail "user@mail.com" → Valid
// java IsValidEmail "@bad.com"      → Invalid
\`\`\`

## טעויות שכיחות

- **\`=\` במקום \`==\`**: \`if (x = 5)\` זו השמה, לא השוואה — שגיאת קומפילציה
- **השוואת String עם \`==\`**: חובה \`str.equals("abc")\` ולא \`str == "abc"\`
- **סדר תנאים שגוי**: \`if (grade >= 70)\` לפני \`if (grade >= 90)\` יתפוס ציון 95 כבר בענף 70+
- **שכחת \`{}\`**: בלי סוגריים, רק השורה הראשונה שייכת ל-\`if\` — מקור נפוץ לבאגים
- **\`charAt\` מחזיר \`char\`, לא \`String\`**: אי אפשר להשוות \`s.charAt(0) == "H"\` — צריך \`s.charAt(0) == 'H'\` (גרשיים בודדים)
- **\`indexOf\` מחזיר \`-1\`**: שכחה לבדוק את ערך ההחזרה

## טיפים למבחן

- **סדר ב-else-if**: עקבו אחרי סדר הביצוע — רק הראשון שמתקיים יבוצע, השאר נדלגים
- **ternary הוא ביטוי**: אפשר לשים אותו בתוך \`println\` או השמה, אבל הוא לא יכול לעמוד לבד כמשפט
- **\`substring(a, b)\`**: כולל את \`a\`, **לא** כולל את \`b\`. אורך התוצאה הוא \`b - a\`
- **\`String\` הוא immutable**: מתודות כמו \`substring\` מחזירות מחרוזת **חדשה**, לא משנות את המקורית
- **\`&&\` ו-\`||\` עושים short-circuit**: אם התוצאה ידועה מהצד השמאלי, הצד הימני לא מחושב כלל`,
  },
  {
    topicSlug: "logical-operators",
    dayNumber: 2,
    title: "לולאות ופונקציות",
    estimatedReadingMinutes: 14,
    pdfResources: day2Pdfs,
    markdown: `## מבוא

לולאות מאפשרות לחזור על בלוק קוד. פונקציות מאפשרות לארגן קוד ליחידות עם שם, שאפשר לקרוא להן שוב ושוב (עקרון DRY — Don't Repeat Yourself).

## לולאת while

מבצעת את הגוף **כל עוד** התנאי \`true\`. אם התנאי \`false\` מההתחלה — הגוף לא מתבצע אף פעם:

\`\`\`java
// דוגמה מההרצאה — הדפסת 0 עד N-1
int i = 0;
while (i < N) {
    System.out.println(i);
    i++;
}
\`\`\`

### טבלת מעקב (Trace Table)

כלי מההרצאה לעקוב אחרי לולאה — רושמים את ערכי המשתנים בכל סיבוב:

| סיבוב | i | i < 3? | פלט |
|--------|---|--------|------|
| 1 | 0 | true | 0 |
| 2 | 1 | true | 1 |
| 3 | 2 | true | 2 |
| 4 | 3 | false | — (יציאה) |

## לולאת for

מתאימה כשיודעים מראש כמה פעמים לחזור. שלושה חלקים: **אתחול**; **תנאי**; **קידום**:

\`\`\`java
for (int i = 0; i < N; i++) {
    // גוף הלולאה
}
\`\`\`

- **אתחול** (\`int i = 0\`) — מתבצע פעם אחת בהתחלה
- **תנאי** (\`i < N\`) — נבדק לפני כל סיבוב; אם \`false\` — יציאה
- **קידום** (\`i++\`) — מתבצע בסוף כל סיבוב

### דוגמאות מההרצאה

\`\`\`java
// סכום 1 + 2 + ... + N
int sum = 0;
for (int i = 1; i <= N; i++) {
    sum += i;
}

// עצרת N!
int factorial = 1;
for (int i = 1; i <= N; i++) {
    factorial *= i;
}

// סכום הרמוני 1 + 1/2 + ... + 1/N
double harmonic = 0;
for (int i = 1; i <= N; i++) {
    harmonic += 1.0 / i;  // חובה 1.0 ולא 1 — אחרת חילוק שלמים!
}
\`\`\`

### חזקות של 2 — גישה יעילה

\`\`\`java
// מההרצאה — חישוב 2^N ביעילות (בלי Math.pow)
int power = 1;
for (int i = 0; i < N; i++) {
    power *= 2;  // מכפיל ב-2 בכל סיבוב
}
\`\`\`

### for מקוננן (Nested for)

\`\`\`java
// לוח כפל מההרצאה
for (int i = 1; i <= N; i++) {
    for (int j = 1; j <= N; j++) {
        System.out.print(i * j + "\\t");
    }
    System.out.println();
}
\`\`\`

### break — יציאה מוקדמת מלולאה

\`\`\`java
// בדיקת פלינדרום מההרצאה
boolean isPalindrome = true;
for (int i = 0; i < s.length() / 2; i++) {
    if (s.charAt(i) != s.charAt(s.length() - 1 - i)) {
        isPalindrome = false;
        break;  // אין טעם להמשיך לבדוק
    }
}
\`\`\`

### for מול while

| | \`for\` | \`while\` |
|---|--------|---------|
| **מתי** | מספר חזרות ידוע מראש | תנאי עצירה דינמי |
| **דוגמה** | "הדפס 100 פעמים" | "קרא עד שהקלט הוא 0" |
| **מונה** | מוגדר בתוך ה-for | מוגדר לפני ה-while |

## פונקציות (Functions)

### מבנה פונקציה (מהתרגול)

\`\`\`java
public static returnType functionName(type param1, type param2) {
    // גוף הפונקציה
    return value;
}
\`\`\`

- **\`public static\`** — נלמד בהמשך; כרגע כותבים תמיד
- **\`returnType\`** — הטיפוס שהפונקציה מחזירה (\`int\`, \`boolean\`, \`String\`...)
- **\`void\`** — פונקציה שלא מחזירה ערך (רק מבצעת פעולה)
- **פרמטרים** — ערכים שהפונקציה מקבלת

### העברה לפי ערך (Pass by Value)

ב-Java, ערכים פרימיטיביים **מועתקים** לפונקציה. שינוי הפרמטר בתוך הפונקציה **לא** משפיע על המשתנה המקורי:

\`\`\`java
// דוגמה מהתרגול
public static void add5(int x) {
    x = x + 5;  // משנה רק את העותק המקומי!
}

public static void main(String[] args) {
    int num = 10;
    add5(num);
    System.out.println(num);  // מדפיס 10 — לא 15!
}
\`\`\`

### פונקציות עזר (Helper Functions)

מהתרגול — פונקציות קטנות שבודקות תו בודד:

\`\`\`java
public static boolean isDigit(char c) {
    return c >= '0' && c <= '9';
}

public static boolean isUpper(char c) {
    return c >= 'A' && c <= 'Z';
}

public static boolean isLower(char c) {
    return c >= 'a' && c <= 'z';
}
\`\`\`

### דוגמה מהתרגול — IsSubstring

\`\`\`java
// בדיקה אם sub היא תת-מחרוזת של str (תרגול 3)
public static boolean isSubstring(String str, String sub) {
    for (int i = 0; i <= str.length() - sub.length(); i++) {
        boolean found = true;
        for (int j = 0; j < sub.length(); j++) {
            if (str.charAt(i + j) != sub.charAt(j)) {
                found = false;
                break;
            }
        }
        if (found) return true;
    }
    return false;
}
\`\`\`

### דוגמה מהתרגול — סיסמה חזקה

\`\`\`java
// IsStrongPassword (תרגול 3) — שימוש בפונקציות עזר
public static boolean isStrongPassword(String password) {
    if (password.length() < 8) return false;
    boolean hasDigit = false, hasUpper = false, hasLower = false;
    for (int i = 0; i < password.length(); i++) {
        char c = password.charAt(i);
        if (isDigit(c)) hasDigit = true;
        if (isUpper(c)) hasUpper = true;
        if (isLower(c)) hasLower = true;
    }
    return hasDigit && hasUpper && hasLower;
}
\`\`\`

## טעויות שכיחות

- **לולאה אינסופית**: שכחה לקדם את המונה ב-\`while\` → הלולאה לא מסתיימת לעולם
- **Off-by-one**: \`i < N\` מול \`i <= N\` — הבדל של סיבוב אחד. \`i < N\` נותן N סיבובים (0 עד N-1)
- **חילוק שלמים בסכום הרמוני**: \`1 / i\` תמיד 0 כש-\`i > 1\` — חובה \`1.0 / i\`
- **pass by value**: שינוי פרמטר בתוך פונקציה **לא** משנה את המשתנה שנשלח
- **שכחת \`return\`**: פונקציה לא-void חייבת להחזיר ערך בכל מסלול ביצוע
- **\`break\` יוצא רק מלולאה אחת**: בלולאות מקוננות, \`break\` עוצר רק את הפנימית

## טיפים למבחן

- **טבלת מעקב**: בלולאות, רשמו את ערכי המשתנים בכל סיבוב — זה מונע טעויות
- **for מול while**: for כשמספר החזרות ידוע, while כשתלוי בתנאי
- **\`break\`**: יוצא מהלולאה **הפנימית** בלבד
- **פונקציות עזר**: פרקו בעיה מורכבת לפונקציות קטנות — קל יותר לבדוק ולתחזק
- **DRY**: אם אותו קוד מופיע פעמיים — זו סיבה טובה לשים אותו בפונקציה`,
  },

  // ==================== Day 3: Approximation, Characters & Functions ====================
  {
    topicSlug: "basic-loops",
    dayNumber: 3,
    title: "אלגוריתמי קירוב ותווים",
    estimatedReadingMinutes: 12,
    pdfResources: day3Pdfs,
    markdown: `## מבוא

מההרצאה: אלגוריתמי קירוב מוצאים ערכים מספריים כשאין נוסחה מדויקת, באמצעות **חיפוש חוזר** עם תנאי עצירה. בהמשך נלמד על טיפוס \`char\` ועל מחרוזות.

## חישוב שורש ריבועי (√x)

**הבעיה (מההרצאה)**: מצאו g כך ש-|g × g - x| ≤ epsilon.

### חיפוש סדרתי (Sequential Search)

גישת "כוח גס" — מתחילים מ-g=1 ומקדמים בצעדים קטנים:

\`\`\`java
// Sqrt1 מההרצאה — חיפוש סדרתי
double x = 16;
double epsilon = 0.01, increment = 0.0001;
double g = 1.0;
int stepCounter = 0;
while ((Math.abs(g * g - x) >= epsilon) && (g <= x)) {
    g += increment;
    stepCounter++;
}
if (g > x)
    System.out.println("Use a smaller increment");
else
    System.out.println("Square root (approx.) = " + g);
// x=16 → approx=3.998, iterations=29988
\`\`\`

**באג מההרצאה**: אם ה-increment גדול מדי, g עלול "לדלג" מעל התשובה → לולאה אינסופית! הפתרון: תנאי \`g <= x\` + הודעת שגיאה.

**ביצועים**: ~x/increment צעדים — **זמן ריצה ליניארי**.

### חיפוש בינארי (Bisection Search)

מצמצם את טווח החיפוש **בחצי** בכל צעד:

\`\`\`java
// Sqrt2 מההרצאה — חיפוש בינארי
double x = 16;
double epsilon = 0.01;
double L = 1.0, H = x;
double g = (L + H) / 2.0;
int stepCounter = 0;
while (Math.abs(g * g - x) >= epsilon) {
    if (g * g < x)
        L = g;
    else
        H = g;
    g = (L + H) / 2;
    stepCounter++;
}
System.out.println("Square root (approx.) = " + g);
// x=16 → 11 iterations, x=105 → 15 iterations
\`\`\`

**העיקרון**: L ו-H תוחמים את התשובה. בכל צעד מחצים את הטווח: x, x/2, x/4, ... x/2^k.

**ביצועים**: log₂(x) צעדים — **זמן ריצה לוגריתמי**. עובד על פונקציות **מונוטוניות** (משפט ערך הביניים).

### ניוטון-רפסון (Newton-Raphson)

עבור f(x) רציפה וגזירה, הנוסחה g ← g - f(g)/f'(g) מתכנסת מהר לשורש:

\`\`\`java
// Sqrt3 מההרצאה — ניוטון-רפסון
// עבור √x: f(g) = g² - x, f'(g) = 2g
// לכן: g ← g - (g² - x) / (2g)
double x = 16;
double epsilon = 0.01;
double g = x / 2;
int stepCounter = 0;
while (Math.abs(g * g - x) > epsilon) {
    g = g - (g * g - x) / (2 * g);
    stepCounter++;
}
System.out.println("Square root (approx.) = " + g);
// x=16 → 2 steps!  x=105 → 4 steps!
\`\`\`

### השוואת שלוש השיטות (מההרצאה)

| שיטה | דרישה | מספר צעדים | דוגמה (x=105) |
|-------|---------|------------|----------------|
| סדרתי | כל פונקציה | ~x/increment (ליניארי) | 29988 |
| בינארי | פונקציה מונוטונית | ~log₂(x) (לוגריתמי) | 15 |
| ניוטון-רפסון | רציפה + גזירה | מעט מאוד | 4 |

## תווים (Characters)

### הטיפוס char

מההרצאה: \`char\` הוא **טיפוס מספרי** — 16 ביט (0–65535), מאחסן קוד של תו:

| טיפוס | גודל | טווח |
|--------|-------|------|
| \`byte\` | 8 bit | -128 עד 127 |
| \`short\` | 16 bit | -32768 עד 32767 |
| \`char\` | 16 bit | 0 עד 65535 |
| \`int\` | 32 bit | ±2.1 מיליארד |

### ASCII ו-Unicode

- **ASCII** (1963): 8 ביט, 256 תווים. 0–31 בקרה, 32–127 אותיות מערביות
- **Unicode** (1991): 16 ביט, 65536 תווים. Java משתמשת ב-Unicode. ASCII מוטבע בתוכו
- \`'a'\` = 97, \`'A'\` = 65, \`'0'\` = 48 — **בשתי הקידודים**

### טווחים חשובים

| תווים | טווח ASCII |
|--------|------------|
| ספרות \`'0'\`–\`'9'\` | 48–57 |
| אותיות גדולות \`'A'\`–\`'Z'\` | 65–90 |
| אותיות קטנות \`'a'\`–\`'z'\` | 97–122 |

### חשבון תווים (מההרצאה)

ערכי \`char\` **הם** מספרים — אפשר לעשות עליהם חשבון:

\`\`\`java
System.out.println(3);        // 3
System.out.println('3');      // 3 (התו)
System.out.println(3 + 1);    // 4
System.out.println('3' + 1);  // 52 (קוד ASCII 51 + 1)

char c = 'd';
System.out.println(c - 32);          // 68 (int)
System.out.println((char)(c - 32));  // D (המרה לאות גדולה!)

// בדיקה אם תו הוא אות קטנה
boolean isLower = (c >= 'a') && (c <= 'z');

// בדיקה אם תו הוא ספרה
boolean isDigit = (c >= '0') && (c <= '9');
\`\`\`

**כלל חשוב**: ההפרש בין אות קטנה לגדולה הוא **32** תמיד (\`'a' - 'A' == 32\`).

### תווים מיוחדים (Escape Sequences)

| רצף | משמעות |
|------|---------|
| \`\\t\` | טאב |
| \`\\n\` | שורה חדשה |
| \`\\\\\` | backslash |
| \`\\"\` | גרש כפול |
| \`\\'\` | גרש בודד |

## מחרוזות (Strings)

מההרצאה: מחרוזת היא **סדרה של תווים** — ניתן לראות אותה ברמה גבוהה (תווים) או ברמה נמוכה (קודים):

\`\`\`
"As easy " → A  s     e  a  s  y
             65 115 32 101 97 115 121 32
\`\`\`

### שרשור (Concatenation)

\`\`\`java
String s1 = "As easy ";
String s2 = "as 123";
String s3 = s1 + s2;  // "As easy as 123" (14 תווים)
\`\`\`

### מתודות (מההרצאה)

| מתודה | תיאור | דוגמה (\`s = "As easy "\`) |
|--------|--------|---------------------------|
| \`s.length()\` | מספר תווים | \`8\` |
| \`s.charAt(3)\` | תו באינדקס | \`'e'\` |
| \`s.substring(1,5)\` | תת-מחרוזת (לא כולל 5) | \`"s ea"\` |
| \`s.indexOf('a')\` | אינדקס מופע ראשון | \`4\` |

**הערה מההרצאה**: מתודות הן כמו פונקציות שפועלות על אובייקט — \`s1.charAt(3)\` ולא \`charAt(s1, 3)\`.

### עיבוד מחרוזות — דוגמת upCase (מההרצאה)

\`\`\`java
// המרת אות ראשונה בכל מילה לאות גדולה
// "it was the best of time" → "It Was The Best Of Time"

// הרעיון: כשנתקלים ברווח, האות הבאה צריכה להיות גדולה
// המרה: (char)(c - 32) — הפחתת 32 מהקוד

// באג מההרצאה: "2 apples and 3 pears" → " Apples and 0ears"
// הסיבה: הקוד מניח שהתו אחרי רווח הוא אות — אבל '3' זו ספרה!
\`\`\`

## טעויות שכיחות

- **\`'3' + 1\` שווה 52, לא 4**: פעולות חשבון על \`char\` מחזירות \`int\` — ה-cast ל-\`char\` הוא מפורש
- **שכחת cast**: \`c - 32\` מחזיר \`int\`, צריך \`(char)(c - 32)\` כדי לקבל תו
- **increment גדול מדי בחיפוש סדרתי**: גורם ללולאה אינסופית — חובה תנאי \`g <= x\`
- **הנחות על קלט**: דוגמת upCase מראה שקוד שעובד על אותיות נשבר על ספרות
- **\`substring(a, b)\`**: כולל את \`a\`, **לא** כולל את \`b\`. אורך = \`b - a\`

## טיפים למבחן

- **ניוטון-רפסון**: הנוסחה g ← g - f(g)/f'(g) — צריך לזכור לגזור
- **\`char\` זה מספר**: אפשר להשוות, לחסר, לחבר — אבל צריך cast חזרה ל-\`char\`
- **טווחי ASCII**: ספרות מ-48, גדולות מ-65, קטנות מ-97. הפרש קטנה↔גדולה = 32
- **ביצועים**: סדרתי O(n), בינארי O(log n), ניוטון — הכי מהיר
- **מתודות String**: \`length()\` עם סוגריים (מתודה), \`charAt\` מחזיר \`char\` לא \`String\``,
  },
  {
    topicSlug: "nested-loops",
    dayNumber: 3,
    title: "פונקציות ומערכים",
    estimatedReadingMinutes: 12,
    pdfResources: day3Pdfs,
    markdown: `## מבוא

מההרצאה: פונקציה הופכת חישוב לקוד **שימושי מחדש** (reusable). במקום לכתוב את קוד √x בכל תוכנית, שמים אותו בפונקציה \`sqrt\` בספרייה \`MyMath\` — וכל מחלקה יכולה לקרוא לה. מהתרגול: מערכים מאחסנים אוסף ערכים עם גישה לפי אינדקס.

## פונקציות (Functions)

### אנטומיה של פונקציה (מההרצאה)

\`\`\`java
//   type of     function    parameter  parameter
//   return value  name      type       name
public static double sqrt(double x, double epsilon) {
    if (x < 0) return Double.NaN;
    double g = x;                        // local variable
    while (Math.abs(g * g - x) > epsilon) {
        g = g - (g * g - x) / (2 * g);
    }
    return g;                            // return value
}
\`\`\`

פונקציה:
- מקבלת אפס או יותר **ארגומנטים** (inputs)
- מחזירה ערך (או \`void\` אם לא מחזירה כלום)
- יש לה **טיפוס** — הטיפוס של הערך המוחזר

### קריאה לפונקציה וחזרה (מההרצאה)

**טרמינולוגיה**: הפונקציה שקוראת = **caller**, הפונקציה שנקראת = **callee**.

\`\`\`java
public class MyMath {
    public static void main(String args[]) {
        double d = hypot(2, 1, 5, 4);  // main קורא ל-hypot
        System.out.println(d);          // 4.242642472890547
    }

    public static double hypot(double x1, double y1,
                               double x2, double y2) {
        double dx = x2 - x1;
        double dy = y2 - y1;
        return sqrt(dx*dx + dy*dy);     // hypot קורא ל-sqrt
    }

    public static double sqrt(double x) {
        double epsilon = 0.01;
        double g = x;
        while (Math.abs(g * g - x) > epsilon) {
            g = g - (g * g - x) / (2 * g);
        }
        return g;
    }
}
\`\`\`

**סדר הביצוע (מההרצאה)**: main → hypot → sqrt → sqrt חוזר → hypot חוזר → main מדפיס.

**ארגומנטים מול פרמטרים**: ארגומנטים = הערכים שה-caller מעביר. פרמטרים = משתנים מקומיים שמאותחלים עם הארגומנטים.

### Overloading (מההרצאה)

**הגדרת פונקציות עם אותו שם אבל חתימות שונות** (מספר/טיפוסי פרמטרים שונים):

\`\`\`java
// שתי גרסאות של sqrt:
public static double sqrt(double x, double epsilon) {
    if (x < 0) return Double.NaN;
    double g = x;
    while (Math.abs(g * g - x) > epsilon) {
        g = g - (g * g - x) / (2 * g);
    }
    return g;
}

public static double sqrt(double x) {
    return sqrt(x, 0.001);  // ברירת מחדל
}

// קריאות:
// sqrt(2, 0.1)   → קורא לגרסה עם epsilon
// sqrt(2, 0.001) → קורא לגרסה עם epsilon
// sqrt(2)        → קורא לגרסה עם ברירת מחדל
\`\`\`

**דוגמאות נוספות מההרצאה**: \`println\` של Java — overloaded ל-boolean, char, int, double, String ועוד. \`indexOf\` — overloaded לתו, תו+startIndex, מחרוזת, מחרוזת+startIndex.

### מודולריות ו-API (מההרצאה)

**מודולריות**: חלוקת תוכנית למודולים (מחלקות) — מפחיתה מורכבות, מאפשרת שימוש חוזר, בדיקות, ופיתוח מקבילי.

**API** (Application Programming Interface): תיעוד שמתאר **איך להשתמש** בפונקציה (מנקודת המבט של ה-caller), בלי לחשוף את המימוש. הפונקציה היא "קופסה שחורה".

**תחביר קריאה**:
- באותה מחלקה: \`functionName(args)\`
- ממחלקה אחרת: \`ClassName.functionName(args)\` (למשל \`MyMath.sqrt(719)\`)

## מערכים (Arrays) — מהתרגול

### הדפסת מערך

\`\`\`java
// println על מערך מדפיס כתובת זיכרון כמו [I@120d62b
// צריך פונקציה מותאמת:
public static void printArray(int[] array) {
    System.out.print('{');
    for (int i = 0; i < array.length; i++) {
        System.out.print(array[i]);
        char c = (i != array.length - 1) ? ',' : '}';
        System.out.print(c);
    }
    System.out.println();
}
\`\`\`

**שימו לב**: \`string.length()\` עם סוגריים (מתודה) לעומת \`array.length\` **בלי** סוגריים (שדה)!

### השוואת מערכים

\`\`\`java
// == משווה הפניות (references), לא תוכן!
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
System.out.println(a == b);  // false!

// צריך פונקציה שמשווה איבר-איבר:
public static boolean equalsArray(int[] arr1, int[] arr2) {
    if (arr1.length != arr2.length) return false;
    for (int i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) return false;
    }
    return true;
}
\`\`\`

### פעולות על מערכים (מהתרגול)

\`\`\`java
// סכום מערך
public static int sumArray(int[] arr) {
    int sum = 0;
    for (int i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

// מקסימום
public static int maxElement(int[] arr) {
    int max = Integer.MIN_VALUE;
    for (int i = 0; i < arr.length; i++) {
        max = Math.max(max, arr[i]);
    }
    return max;
}

// מינימום — Integer.MAX_VALUE + Math.min

// אינדקס של המקסימום — שומרים גם ערך וגם אינדקס
public static int indexOfMaxElement(int[] arr) {
    int maxVal = arr[0];
    int maxIdx = 0;
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
            maxIdx = i;
        }
    }
    return maxIdx;
}

// בדיקת סדר עולה
public static boolean isInAscendingOrder(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
    }
    return true;
}
\`\`\`

### דוגמה מהתרגול — LengthOfLastWord

\`\`\`java
// נתונה מחרוזת של מילים ורווחים — מצאו את אורך המילה האחרונה
public static int lengthOfLastWord(String str) {
    int i = str.length() - 1;
    // דילוג על רווחים מהסוף
    while (i >= 0 && str.charAt(i) == ' ') {
        i--;
    }
    // ספירת תווים עד הרווח הבא
    int count = 0;
    while (i >= 0 && str.charAt(i) != ' ') {
        count++;
        i--;
    }
    return count;
}
\`\`\`

## טעויות שכיחות

- **שכחת \`return\`**: פונקציה לא-\`void\` חייבת להחזיר ערך **בכל מסלול ביצוע**
- **pass by value**: שינוי פרמטר פרימיטיבי בתוך פונקציה **לא** משנה את המשתנה של ה-caller
- **\`==\` על מערכים**: משווה הפניות, לא תוכן! צריך \`equalsArray\` (או \`Arrays.equals\`)
- **\`array.length\` בלי סוגריים**: שדה, לא מתודה. \`string.length()\` **עם** סוגריים
- **\`println(array)\`**: מדפיס כתובת, לא תוכן — צריך פונקציית הדפסה מותאמת
- **\`Integer.MIN_VALUE\`**: ערך התחלתי למקסימום. \`Integer.MAX_VALUE\` למינימום

## טיפים למבחן

- **אנטומיה**: זכרו — \`public static returnType name(params) { body; return value; }\`
- **overloading**: שם זהה, חתימה שונה. Java בוחרת את הגרסה לפי הארגומנטים
- **caller ↔ callee**: ה-caller מושהה, ה-callee רץ. ערך ה-return מחליף את הקריאה בקוד ה-caller
- **מערכים — דפוסי תרגול**: sum, max, min, indexOf, isAscending — הכירו את כולם
- **\`length\` מול \`length()\`**: מערך = שדה (בלי סוגריים), מחרוזת = מתודה (עם סוגריים)
- **pass by value**: העברת \`int\` לפונקציה = **העתקה**. שינוי הפרמטר לא משפיע על ה-caller`,
  },

  // ==================== Day 4: Arrays ====================
  {
    topicSlug: "arrays-1d",
    dayNumber: 4,
    title: "מערכים חד-ממדיים",
    estimatedReadingMinutes: 9,
    pdfResources: day4Pdfs,
    markdown: `## מבוא

מערך (Array) הוא מבנה נתונים בגודל **קבוע** שמאחסן ערכים מאותו טיפוס ברצף בזיכרון. גישה לאיברים באמצעות אינדקס (מתחיל מ-0).

## מושגי יסוד

- גודל קבוע — לא ניתן לשנות אחרי יצירה
- אינדקס מ-\`0\` עד \`length - 1\`
- ערכי ברירת מחדל: \`int\` → 0, \`boolean\` → false, \`String\` → null
- מערך הוא **אובייקט** (reference type)

## תחביר

### הצהרה ויצירה
\`\`\`java
int[] arr = new int[5];          // מערך של 5 אפסים
int[] arr2 = {10, 20, 30, 40};  // אתחול מפורש
int[] arr3 = new int[]{1, 2, 3}; // יצירה עם ערכים
\`\`\`

### גישה ועדכון
\`\`\`java
arr[0] = 42;             // כתיבה
int val = arr[0];        // קריאה
int len = arr.length;    // אורך (שדה, לא מתודה!)
\`\`\`

### מעבר על מערך
\`\`\`java
// for רגיל — כשצריך את האינדקס
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

// for-each — כשלא צריך אינדקס
for (int val : arr) {
    System.out.println(val);
}
\`\`\`

## דפוסים נפוצים

### סכום וממוצע
\`\`\`java
int sum = 0;
for (int val : arr) sum += val;
double avg = (double) sum / arr.length;
\`\`\`

### מקסימום / מינימום
\`\`\`java
int max = arr[0];
for (int i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
}
\`\`\`

### חיפוש לינארי
\`\`\`java
int index = -1;
for (int i = 0; i < arr.length; i++) {
    if (arr[i] == target) { index = i; break; }
}
\`\`\`

### היפוך מערך
\`\`\`java
for (int i = 0; i < arr.length / 2; i++) {
    int temp = arr[i];
    arr[i] = arr[arr.length - 1 - i];
    arr[arr.length - 1 - i] = temp;
}
\`\`\`

## דוגמאות

\`\`\`java
// ספירת מופעים
int[] arr = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5};
int count = 0;
int target = 5;
for (int val : arr) {
    if (val == target) count++;
}
System.out.println(target + " appears " + count + " times"); // 3
\`\`\`

## טעויות שכיחות

- **ArrayIndexOutOfBoundsException**: גישה לאינדקס \`arr.length\` או שלילי
- **\`arr.length()\`**: שדה, לא מתודה! בלי סוגריים — \`arr.length\`
- **השמת מערך**: \`arr2 = arr1\` מעתיק **הפניה**, לא ערכים! שני המשתנים מצביעים לאותו מערך
- **for-each לא משנה**: \`for (int x : arr) { x = 5; }\` — **לא** משנה את המערך!

## טיפים למבחן

- תמיד בדקו מה קורה עם מערך ריק (\`length == 0\`)
- \`arr.length / 2\` עובד גם לזוגי וגם לאי-זוגי בהיפוך
- העברת מערך לפונקציה = העברת הפניה — שינויים משפיעים על המקור
- \`Arrays.toString(arr)\` מדפיס יפה (צריך \`import java.util.Arrays\`)`,
  },
  {
    topicSlug: "arrays-2d",
    dayNumber: 4,
    title: "מערכים דו-ממדיים (מטריצות)",
    estimatedReadingMinutes: 8,
    pdfResources: day4Pdfs,
    markdown: `## מבוא

מערך דו-ממדי הוא "מערך של מערכים" — מטריצה עם שורות ועמודות. גישה באמצעות שני אינדקסים: \`mat[row][col]\`.

## מושגי יסוד

- \`mat.length\` — מספר שורות
- \`mat[i].length\` — מספר עמודות בשורה i
- Java תומכת במערכים "משוננים" (jagged) — שורות באורכים שונים

## תחביר

### הצהרה ויצירה
\`\`\`java
int[][] mat = new int[3][4];           // 3 שורות, 4 עמודות
int[][] mat2 = {{1,2,3}, {4,5,6}};    // אתחול מפורש
\`\`\`

### מעבר על מטריצה
\`\`\`java
for (int i = 0; i < mat.length; i++) {
    for (int j = 0; j < mat[i].length; j++) {
        System.out.print(mat[i][j] + " ");
    }
    System.out.println();
}
\`\`\`

## דפוסים נפוצים

### סכום שורה
\`\`\`java
for (int i = 0; i < mat.length; i++) {
    int rowSum = 0;
    for (int j = 0; j < mat[i].length; j++) {
        rowSum += mat[i][j];
    }
    System.out.println("Row " + i + ": " + rowSum);
}
\`\`\`

### אלכסון ראשי
\`\`\`java
// רק במטריצה ריבועית!
int diagSum = 0;
for (int i = 0; i < n; i++) {
    diagSum += mat[i][i];          // אלכסון ראשי
}
\`\`\`

### אלכסון משני
\`\`\`java
int antiDiagSum = 0;
for (int i = 0; i < n; i++) {
    antiDiagSum += mat[i][n - 1 - i]; // אלכסון משני
}
\`\`\`

### טרנספוזה (Transpose)
\`\`\`java
int[][] trans = new int[cols][rows];
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        trans[j][i] = mat[i][j];
    }
}
\`\`\`

## דוגמאות

\`\`\`java
// קריאת מטריצה מהקלט
int rows = sc.nextInt(), cols = sc.nextInt();
int[][] mat = new int[rows][cols];
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        mat[i][j] = sc.nextInt();
    }
}

// הדפסת מטריצה מפורמטת
for (int[] row : mat) {
    for (int val : row) {
        System.out.printf("%4d", val);
    }
    System.out.println();
}
\`\`\`

## טעויות שכיחות

- **בלבול שורות ועמודות**: \`mat[row][col]\` — שורה קודם!
- **אלכסון במטריצה לא ריבועית**: אלכסון מוגדר רק כש-rows == cols
- **שכחת יצירת שורות**: \`int[][] mat = new int[3][];\` — השורות הן \`null\`!
- **אינדקס הפוך ב-transpose**: \`trans[j][i] = mat[i][j]\` (לא ההפך)

## טיפים למבחן

- אלכסון ראשי: \`i == j\`, אלכסון משני: \`i + j == n - 1\`
- סכום כל המטריצה = סכום כל הסכומי שורות
- טרנספוזה של מטריצה m×n היא n×m
- במבחן ציירו את המטריצה עם אינדקסים — עוזר מאוד`,
  },

  // ==================== Day 5: Functions & Methods ====================
  {
    topicSlug: "method-basics",
    dayNumber: 5,
    title: "הצהרת מתודות",
    estimatedReadingMinutes: 9,
    pdfResources: day5Pdfs,
    markdown: `## מבוא

מתודה (Method/Function) היא בלוק קוד עם שם שמבצע משימה מוגדרת. מתודות מאפשרות שימוש חוזר בקוד, מודולריות, וקריאות.

## מושגי יסוד

### מבנה מתודה
\`\`\`java
accessModifier returnType methodName(paramType param1, paramType param2) {
    // גוף המתודה
    return value; // אם לא void
}
\`\`\`

### סוגי מתודות
- **void** — לא מחזירה ערך (מבצעת פעולה)
- **עם ערך החזרה** — מחזירה ערך מטיפוס מוגדר
- **static** — שייכת למחלקה, לא לאובייקט

## תחביר

### מתודת void
\`\`\`java
public static void printGreeting(String name) {
    System.out.println("Hello, " + name + "!");
}
\`\`\`

### מתודה עם ערך החזרה
\`\`\`java
public static int add(int a, int b) {
    return a + b;
}
\`\`\`

### קריאה למתודה
\`\`\`java
printGreeting("Alice");     // void — לא שומרים תוצאה
int sum = add(3, 5);        // שומרים את הערך המוחזר
System.out.println(add(3, 5)); // או משתמשים ישירות
\`\`\`

## דפוסים נפוצים

### Overloading — עמסה (אותו שם, פרמטרים שונים)
\`\`\`java
public static int max(int a, int b) {
    return (a > b) ? a : b;
}
public static int max(int a, int b, int c) {
    return max(max(a, b), c);
}
\`\`\`

### מתודת עזר
\`\`\`java
public static boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}
\`\`\`

### מתודה שמקבלת מערך
\`\`\`java
public static double average(int[] arr) {
    int sum = 0;
    for (int val : arr) sum += val;
    return (double) sum / arr.length;
}
\`\`\`

## דוגמאות

\`\`\`java
// מתודה להדפסת מערך
public static void printArray(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        if (i > 0) System.out.print(", ");
        System.out.print(arr[i]);
    }
    System.out.println();
}

// שימוש
int[] data = {1, 2, 3, 4, 5};
printArray(data); // 1, 2, 3, 4, 5
\`\`\`

## טעויות שכיחות

- **שכחת return**: מתודה לא-void חייבת להחזיר ערך בכל מסלול
- **return בתוך void**: \`return;\` (ללא ערך) מותר ב-void, אבל \`return 5;\` אסור
- **טיפוסי פרמטרים שגויים**: קריאה עם \`double\` למתודה שמצפה ל-\`int\`
- **שכחת static**: מתודות שנקראות מ-main חייבות להיות static

## טיפים למבחן

- עקבו אחרי Call Stack — איזו מתודה קוראת לאיזו
- פרמטרים פרימיטיביים עוברים **by value** — שינוי בפנים לא משפיע בחוץ
- מערכים עוברים **by reference** — שינוי איבר בפנים כן משפיע
- overloading נקבע בזמן קומפילציה לפי טיפוסי הפרמטרים`,
  },
  {
    topicSlug: "return-values-scope",
    dayNumber: 5,
    title: "ערכי החזרה ותחום הכרה (Scope)",
    estimatedReadingMinutes: 7,
    pdfResources: day5Pdfs,
    markdown: `## מבוא

**ערך החזרה** הוא התוצאה שמתודה מחזירה לקוד הקורא. **תחום הכרה (Scope)** מגדיר איפה משתנה נגיש — משתנה מקומי חי רק בתוך הבלוק שבו הוגדר.

## מושגי יסוד

### ערכי החזרה
- \`return\` מסיים את המתודה מיד ומחזיר ערך
- מתודת \`void\` — \`return;\` (אופציונלי, ליציאה מוקדמת)
- המהדר בודק שכל מסלול מחזיר ערך

### תחום הכרה (Scope)
- **משתנה מקומי**: חי מהצהרה עד סוף הבלוק \`{}\`
- **פרמטר**: חי בכל גוף המתודה
- **מונה לולאה**: חי רק בתוך הלולאה

## תחביר

### multiple return paths
\`\`\`java
public static String classify(int grade) {
    if (grade >= 90) return "Excellent";
    if (grade >= 80) return "Very Good";
    if (grade >= 70) return "Good";
    return "Needs Improvement"; // חובה — ברירת מחדל
}
\`\`\`

### scope
\`\`\`java
public static void example() {
    int x = 10;          // scope: כל המתודה
    if (x > 5) {
        int y = 20;      // scope: רק הבלוק הזה
        System.out.println(x + y); // OK
    }
    // System.out.println(y); // שגיאה! y לא קיים כאן
}
\`\`\`

## דפוסים נפוצים

### Early Return
\`\`\`java
public static int indexOf(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i; // מצא — החזר מיד
    }
    return -1; // לא נמצא
}
\`\`\`

### שימוש בתוצאת מתודה כפרמטר
\`\`\`java
int result = max(abs(a), abs(b));
\`\`\`

### GCD — אלגוריתם אוקלידס
\`\`\`java
public static int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
\`\`\`

## דוגמאות

\`\`\`java
// חזקה
public static long power(int base, int exp) {
    long result = 1;
    for (int i = 0; i < exp; i++) {
        result *= base;
    }
    return result;
}

// שימוש
long val = power(2, 10); // 1024
\`\`\`

## טעויות שכיחות

- **Missing return**: \`if (x > 0) return 1;\` — מה אם \`x <= 0\`? המהדר דורש return בכל מסלול
- **שימוש במשתנה מחוץ ל-scope**: \`for (int i=0;...)\` — \`i\` לא קיים אחרי הלולאה
- **Shadowing**: משתנה מקומי באותו שם כפרמטר — מסתיר אותו
- **בלבול pass-by-value**: \`swap(a,b)\` **לא עובד** על primitives! הערכים מועתקים

## טיפים למבחן

- במעקב (trace): כשנכנסים למתודה — פרמטרים מועתקים (primitives)
- \`return\` מפסיק את המתודה **מיד** — קוד אחריו לא ירוץ
- משתנה מוצהר ב-for: \`for(int i=...)\` — scope = הלולאה בלבד
- Overloading: \`add(int,int)\` ו-\`add(double,double)\` — שתי מתודות שונות`,
  },

  // ==================== Day 6: Recursion ====================
  {
    topicSlug: "recursion-basics",
    dayNumber: 6,
    title: "רקורסיה: יסודות",
    estimatedReadingMinutes: 10,
    pdfResources: day6Pdfs,
    markdown: `## מבוא

**רקורסיה** היא כאשר מתודה קוראת לעצמה. כל פתרון רקורסיבי חייב שני חלקים: **מקרה בסיס** (עוצר את הרקורסיה) ו**מקרה רקורסיבי** (מקטין את הבעיה).

## מושגי יסוד

### שלושת העקרונות
1. **מקרה בסיס (Base Case)**: תנאי שמחזיר ערך ישירות, בלי קריאה רקורסיבית
2. **מקרה רקורסיבי**: קריאה עצמית עם **בעיה קטנה יותר**
3. **התקדמות**: כל קריאה חייבת להתקרב למקרה הבסיס

### Call Stack
כל קריאה רקורסיבית נדחקת למחסנית (stack). כשהבסיס מושג — הקריאות חוזרות בסדר הפוך.

## תחביר

\`\`\`java
public static returnType methodName(params) {
    if (baseCondition) {
        return baseValue;      // מקרה בסיס
    }
    return methodName(smallerParams); // מקרה רקורסיבי
}
\`\`\`

## דפוסים נפוצים

### עצרת (Factorial)
\`\`\`java
public static long factorial(int n) {
    if (n <= 1) return 1;        // base case
    return n * factorial(n - 1); // n! = n × (n-1)!
}
// factorial(4) → 4 × factorial(3) → 4 × 3 × factorial(2) → 4 × 3 × 2 × 1 = 24
\`\`\`

### סכום 1 עד n
\`\`\`java
public static int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1);
}
\`\`\`

### חזקה
\`\`\`java
public static long power(int base, int exp) {
    if (exp == 0) return 1;
    return base * power(base, exp - 1);
}
\`\`\`

### פיבונאצ'י
\`\`\`java
public static int fib(int n) {
    if (n <= 1) return n;            // fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2); // שתי קריאות רקורסיביות
}
\`\`\`

## דוגמאות

\`\`\`java
// ספירת ספרות
public static int countDigits(int n) {
    if (n < 10) return 1;           // ספרה אחת
    return 1 + countDigits(n / 10); // ספור + המשך
}

// סכום ספרות
public static int digitSum(int n) {
    if (n < 10) return n;
    return (n % 10) + digitSum(n / 10);
}
\`\`\`

## טעויות שכיחות

- **שכחת מקרה בסיס**: גורם ל-StackOverflowError (רקורסיה אינסופית)
- **אין התקדמות**: הפרמטר לא מתקרב לבסיס
- **מקרה בסיס לא נכון**: למשל, \`factorial(0)\` צריך להחזיר 1, לא 0
- **חזרה ללא return**: \`factorial(n-1)\` במקום \`return n * factorial(n-1)\`

## טיפים למבחן

- שרטטו את עץ הקריאות (Call Tree)
- עקבו אחרי ה-Call Stack — LIFO (Last In, First Out)
- זכרו: כל קריאה יוצרת עותק חדש של המשתנים המקומיים
- fibonacci נאיבי = O(2ⁿ) — מאוד לא יעיל! (אבל כך מבקשים במבחן)
- אם הבעיה מתפצלת ל-2 קריאות — ציירו עץ בינארי`,
  },
  {
    topicSlug: "recursion-strings",
    dayNumber: 6,
    title: "רקורסיה עם מחרוזות ומערכים",
    estimatedReadingMinutes: 8,
    pdfResources: day6Pdfs,
    markdown: `## מבוא

רקורסיה על מחרוזות ומערכים עובדת על ידי צמצום האורך בכל קריאה — בודקים את האיבר הראשון/אחרון וממשיכים רקורסיבית על השאר.

## מושגי יסוד

### גישות מקובלות
- **מחרוזות**: \`substring()\`, \`charAt()\`, \`length()\`
- **מערכים**: העברת אינדקס נוסף כפרמטר (כי אי אפשר "לקצר" מערך)

## תחביר

### רקורסיה על מחרוזת
\`\`\`java
public static void process(String s) {
    if (s.isEmpty()) return;           // base case
    // עשה משהו עם s.charAt(0)
    process(s.substring(1));           // המשך עם השאר
}
\`\`\`

### רקורסיה על מערך עם אינדקס
\`\`\`java
public static int sum(int[] arr, int index) {
    if (index == arr.length) return 0; // base case
    return arr[index] + sum(arr, index + 1);
}
// קריאה: sum(arr, 0)
\`\`\`

## דפוסים נפוצים

### היפוך מחרוזת
\`\`\`java
public static String reverse(String s) {
    if (s.length() <= 1) return s;
    return reverse(s.substring(1)) + s.charAt(0);
}
// reverse("hello") → reverse("ello") + 'h' → ... → "olleh"
\`\`\`

### בדיקת פלינדרום
\`\`\`java
public static boolean isPalindrome(String s) {
    if (s.length() <= 1) return true;
    if (s.charAt(0) != s.charAt(s.length() - 1)) return false;
    return isPalindrome(s.substring(1, s.length() - 1));
}
\`\`\`

### ספירת מופעים במערך
\`\`\`java
public static int count(int[] arr, int index, int target) {
    if (index == arr.length) return 0;
    int found = (arr[index] == target) ? 1 : 0;
    return found + count(arr, index + 1, target);
}
\`\`\`

### סכום מערך
\`\`\`java
public static int arraySum(int[] arr, int index) {
    if (index == arr.length) return 0;
    return arr[index] + arraySum(arr, index + 1);
}
\`\`\`

## דוגמאות

\`\`\`java
// ספירת תו במחרוזת
public static int countChar(String s, char c) {
    if (s.isEmpty()) return 0;
    int match = (s.charAt(0) == c) ? 1 : 0;
    return match + countChar(s.substring(1), c);
}

// מציאת מקסימום במערך
public static int findMax(int[] arr, int index) {
    if (index == arr.length - 1) return arr[index];
    int maxOfRest = findMax(arr, index + 1);
    return Math.max(arr[index], maxOfRest);
}
\`\`\`

## טעויות שכיחות

- **StringIndexOutOfBoundsException**: \`substring(1)\` על מחרוזת ריקה
- **אינדקס שלא מתקדם**: שכחו \`index + 1\` בקריאה הרקורסיבית
- **base case שגוי למערך**: \`index == arr.length\` (לא \`index == arr.length - 1\`, תלוי בדפוס)
- **יצירת substring מיותרת**: עדיף להעביר אינדקס מאשר ליצור מחרוזות חדשות

## טיפים למבחן

- רקורסיה על מחרוזת: \`substring(1)\` מסיר את הראשון, \`substring(0, length-1)\` מסיר את האחרון
- למערכים — תמיד העבירו אינדקס, אל תיצרו מערכים חדשים
- שרטטו את עץ הקריאות עם הערכים בכל שלב
- בפלינדרום: בדקו קצוות והתקדמו פנימה`,
  },

  // ==================== Day 7: OOP Foundations ====================
  {
    topicSlug: "classes-objects",
    dayNumber: 7,
    title: "מחלקות ואובייקטים",
    estimatedReadingMinutes: 10,
    pdfResources: day7Pdfs,
    markdown: `## מבוא

**תכנות מונחה-עצמים (OOP)** מארגן קוד סביב אובייקטים — יישויות שמכילות מידע (שדות) והתנהגות (מתודות). **מחלקה** היא התבנית, **אובייקט** הוא המופע הספציפי.

## מושגי יסוד

| מונח | הגדרה | דוגמה |
|------|--------|--------|
| **Class** | תבנית/שרטוט | \`class Dog { }\` |
| **Object** | מופע של מחלקה | \`Dog d = new Dog();\` |
| **Field** | משתנה של אובייקט | \`String name;\` |
| **Method** | פעולה של אובייקט | \`void bark() { }\` |
| **Constructor** | מתודה ליצירת אובייקט | \`Dog(String name) { }\` |

### \`this\`
מילת מפתח שמתייחסת לאובייקט הנוכחי. משמשת להבדיל בין שדה לפרמטר באותו שם.

## תחביר

### הגדרת מחלקה
\`\`\`java
public class Student {
    // שדות
    private String name;
    private int grade;

    // קונסטרקטור
    public Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    // מתודה
    public String toString() {
        return name + " (" + grade + ")";
    }
}
\`\`\`

### יצירת אובייקט
\`\`\`java
Student s = new Student("Alice", 95);
System.out.println(s);           // Alice (95)
System.out.println(s.toString()); // אותו דבר
\`\`\`

### Getters
\`\`\`java
public String getName() { return name; }
public int getGrade() { return grade; }
\`\`\`

## דפוסים נפוצים

### Constructor עם ערכי ברירת מחדל
\`\`\`java
public Student() {
    this("Unknown", 0); // קורא לקונסטרקטור אחר
}
public Student(String name) {
    this(name, 0);
}
public Student(String name, int grade) {
    this.name = name;
    this.grade = grade;
}
\`\`\`

### toString
\`\`\`java
@Override
public String toString() {
    return "Student{name='" + name + "', grade=" + grade + "}";
}
\`\`\`

### מערך של אובייקטים
\`\`\`java
Student[] students = new Student[3];
students[0] = new Student("Alice", 95);
students[1] = new Student("Bob", 87);
students[2] = new Student("Charlie", 72);

for (Student s : students) {
    System.out.println(s);
}
\`\`\`

## דוגמאות

\`\`\`java
public class Point {
    private double x, y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double distanceTo(Point other) {
        double dx = this.x - other.x;
        double dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
\`\`\`

## טעויות שכיחות

- **שכחת new**: \`Student s;\` — רק הפניה, אין אובייקט! חייבים \`new Student(...)\`
- **NullPointerException**: שימוש באובייקט שלא אותחל (\`null\`)
- **שכחת this**: \`name = name;\` — לא עושה כלום! צריך \`this.name = name;\`
- **== במקום equals**: \`s1 == s2\` משווה הפניות, לא תוכן

## טיפים למבחן

- \`new\` עושה 3 דברים: (1) מקצה זיכרון, (2) מריץ constructor, (3) מחזיר הפניה
- כל אובייקט הוא **הפניה** (reference) — העברה למתודה = העברת ההפניה
- \`toString()\` נקראת אוטומטית ב-\`System.out.println(obj)\`
- Constructor **אין** לו return type (אפילו לא void)`,
  },
  {
    topicSlug: "instance-methods",
    dayNumber: 7,
    title: "מתודות מופע",
    estimatedReadingMinutes: 8,
    pdfResources: day7Pdfs,
    markdown: `## מבוא

**מתודות מופע** (Instance Methods) שייכות לאובייקט ספציפי — הן יכולות לגשת לשדות שלו ולשנות את מצבו. בניגוד למתודות \`static\`, הן דורשות אובייקט כדי להיקרא.

## מושגי יסוד

| מתודת מופע | מתודת static |
|-------------|-------------|
| שייכת לאובייקט | שייכת למחלקה |
| ניגשת ל-\`this\` | אין \`this\` |
| \`obj.method()\` | \`ClassName.method()\` |
| יכולה לגשת לשדות | לא יכולה לגשת לשדות |

## תחביר

### מתודה שמשנה מצב (Mutator)
\`\`\`java
public class Counter {
    private int count;

    public void increment() {
        count++;
    }

    public void reset() {
        count = 0;
    }
}
\`\`\`

### מתודה שרק קוראת (Accessor)
\`\`\`java
public int getCount() {
    return count;
}

public boolean isAbove(int threshold) {
    return count > threshold;
}
\`\`\`

### מתודה שמקבלת אובייקט אחר
\`\`\`java
public boolean equals(Counter other) {
    return this.count == other.count;
}
\`\`\`

## דפוסים נפוצים

### Builder / Fluent Pattern
\`\`\`java
public class StringBuilder {
    private String value = "";

    public StringBuilder append(String s) {
        value += s;
        return this; // מחזיר את עצמו!
    }

    public String build() {
        return value;
    }
}
// שימוש: new StringBuilder().append("a").append("b").build()
\`\`\`

### equals מותאם אישית
\`\`\`java
public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Student)) return false;
    Student other = (Student) obj;
    return this.name.equals(other.name) && this.grade == other.grade;
}
\`\`\`

### מתודה שעובדת עם מערך שדות
\`\`\`java
public class Scoreboard {
    private int[] scores;
    private int size;

    public void addScore(int score) {
        if (size < scores.length) {
            scores[size++] = score;
        }
    }

    public double average() {
        if (size == 0) return 0;
        int sum = 0;
        for (int i = 0; i < size; i++) sum += scores[i];
        return (double) sum / size;
    }
}
\`\`\`

## דוגמאות

\`\`\`java
public class BankAccount {
    private double balance;
    private String owner;

    public BankAccount(String owner, double initial) {
        this.owner = owner;
        this.balance = initial;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    public void transferTo(BankAccount other, double amount) {
        if (this.withdraw(amount)) {
            other.deposit(amount);
        }
    }
}
\`\`\`

## טעויות שכיחות

- **קריאה למתודת מופע ללא אובייקט**: \`Counter.increment();\` — לא! צריך \`c.increment();\`
- **שכחה לעדכן שדות**: המתודה מחשבת אבל לא שומרת
- **Mutator שמחזיר ערך ישן**: צריך לעדכן קודם ואז להחזיר
- **השוואת אובייקטים עם ==**: משווה הפניות, לא תוכן

## טיפים למבחן

- עקבו אחרי מצב האובייקט: רשמו את ערכי השדות אחרי כל קריאה
- \`this\` = האובייקט שעליו קראנו את המתודה
- מתודה שמקבלת אובייקט אחר: ניגשת לשדות שלו עם \`other.field\`
- מתודה שמחזירה \`this\` מאפשרת שרשור (chaining)`,
  },

  // ==================== Day 8: OOP Advanced ====================
  {
    topicSlug: "encapsulation",
    dayNumber: 8,
    title: "כימוס ומגבילי גישה",
    estimatedReadingMinutes: 8,
    pdfResources: day8Pdfs,
    markdown: `## מבוא

**כימוס (Encapsulation)** הוא עיקרון OOP שמסתיר את המימוש הפנימי ומגביל גישה ישירה לשדות. גישה רק דרך מתודות (getters/setters), שמאפשרות בקרה וולידציה.

## מושגי יסוד

### מגבילי גישה (Access Modifiers)

| מגביל | מחלקה | חבילה | תת-מחלקה | כולם |
|--------|--------|--------|-----------|------|
| \`private\` | V | X | X | X |
| (default) | V | V | X | X |
| \`protected\` | V | V | V | X |
| \`public\` | V | V | V | V |

### עיקרון: שדות private, גישה דרך מתודות public

## תחביר

### Getter & Setter
\`\`\`java
public class Person {
    private String name;
    private int age;

    // Getter
    public String getName() { return name; }
    public int getAge() { return age; }

    // Setter עם ולידציה
    public void setName(String name) {
        if (name != null && !name.isEmpty()) {
            this.name = name;
        }
    }

    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        }
    }
}
\`\`\`

## דפוסים נפוצים

### מחלקה אי-משתנה (Immutable)
\`\`\`java
public class ImmutablePoint {
    private final double x;
    private final double y;

    public ImmutablePoint(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    // אין setters! ו-final מונע שינוי
}
\`\`\`

### Setter שמחזיר boolean
\`\`\`java
public boolean setGrade(int grade) {
    if (grade < 0 || grade > 100) return false;
    this.grade = grade;
    return true;
}
\`\`\`

### Defensive Copy
\`\`\`java
public class Roster {
    private int[] grades;

    public Roster(int[] grades) {
        this.grades = grades.clone(); // עותק!
    }

    public int[] getGrades() {
        return grades.clone(); // עותק!
    }
}
\`\`\`

## דוגמאות

\`\`\`java
public class Student {
    private String name;
    private int grade;

    public Student(String name, int grade) {
        setName(name);    // משתמש ב-setter לולידציה
        setGrade(grade);
    }

    public void setGrade(int grade) {
        if (grade >= 0 && grade <= 100) {
            this.grade = grade;
        } else {
            throw new IllegalArgumentException("Grade must be 0-100");
        }
    }

    // שאר getters/setters...
}
\`\`\`

## טעויות שכיחות

- **שדות public**: מאפשר שינוי ישיר בלי בקרה — \`s.grade = -50;\`
- **Getter שחושף reference**: מחזיר את המערך עצמו במקום clone
- **Setter בלי ולידציה**: לא טוב יותר מ-public field
- **שכחת this**: \`name = name;\` — לא מעדכן את השדה

## טיפים למבחן

- \`private\` = נגיש רק מתוך המחלקה עצמה
- \`final\` על שדה = ניתן לאתחל רק פעם אחת (ב-constructor)
- Immutable class: כל השדות \`private final\`, אין setters
- במבחן ישאלו "מה השגיאה?" — חפשו שדות public או חוסר ולידציה`,
  },
  {
    topicSlug: "class-design",
    dayNumber: 8,
    title: "תכנון מחלקות: static, composition, design patterns",
    estimatedReadingMinutes: 9,
    pdfResources: day8Pdfs,
    markdown: `## מבוא

תכנון מחלקות כולל החלטות על: שדות static vs instance, הרכבה (composition) של אובייקטים, ודפוסי עיצוב נפוצים כמו Utility class ו-Builder.

## מושגי יסוד

### static vs instance

| | static | instance |
|--|--------|----------|
| **שדה** | משותף לכל האובייקטים | ייחודי לכל אובייקט |
| **מתודה** | לא צריך אובייקט | צריך אובייקט |
| **גישה** | \`ClassName.field\` | \`obj.field\` |

### Composition — "has-a"
אובייקט מכיל אובייקט אחר כשדה. למשל, \`Person\` **has-a** \`Address\`.

## תחביר

### Static fields & methods
\`\`\`java
public class MathUtils {
    public static final double PI = 3.14159;

    public static int max(int a, int b) {
        return (a > b) ? a : b;
    }
}
// שימוש: MathUtils.max(3, 5)
\`\`\`

### Static counter
\`\`\`java
public class Student {
    private static int count = 0;
    private int id;
    private String name;

    public Student(String name) {
        this.name = name;
        this.id = ++count; // כל סטודנט מקבל ID ייחודי
    }

    public static int getCount() { return count; }
}
\`\`\`

### Composition
\`\`\`java
public class Address {
    private String city;
    private String street;
    // constructor, getters...
}

public class Person {
    private String name;
    private Address address; // composition: Person has-a Address

    public Person(String name, Address address) {
        this.name = name;
        this.address = address;
    }
}
\`\`\`

## דפוסים נפוצים

### Utility Class (מתודות static בלבד)
\`\`\`java
public class ArrayUtils {
    private ArrayUtils() {} // מונע יצירת אובייקט

    public static int sum(int[] arr) {
        int s = 0;
        for (int v : arr) s += v;
        return s;
    }

    public static int max(int[] arr) {
        int m = arr[0];
        for (int v : arr) if (v > m) m = v;
        return m;
    }
}
\`\`\`

### Fluent Builder
\`\`\`java
public class PersonBuilder {
    private String name;
    private int age;
    private String city;

    public PersonBuilder setName(String n) { name = n; return this; }
    public PersonBuilder setAge(int a) { age = a; return this; }
    public PersonBuilder setCity(String c) { city = c; return this; }
    public Person build() { return new Person(name, age, city); }
}
// שימוש:
// Person p = new PersonBuilder().setName("A").setAge(20).setCity("TLV").build();
\`\`\`

## דוגמאות

\`\`\`java
// Composition: מכונית עם מנוע
public class Engine {
    private int horsepower;

    public Engine(int hp) { this.horsepower = hp; }
    public int getHorsepower() { return horsepower; }
}

public class Car {
    private String model;
    private Engine engine;

    public Car(String model, int hp) {
        this.model = model;
        this.engine = new Engine(hp);
    }

    public String toString() {
        return model + " (" + engine.getHorsepower() + " HP)";
    }
}
\`\`\`

## טעויות שכיחות

- **גישה ל-instance field ממתודה static**: אסור! \`static\` method אין לו \`this\`
- **שכחת static על main**: \`public static void main\` — חובה
- **Composition vs Inheritance**: "has-a" = composition, "is-a" = inheritance
- **שכחה לאתחל שדה composition**: \`this.address = null\` → NullPointerException

## טיפים למבחן

- \`static\` field משותף לכל האובייקטים — שינוי באחד משפיע על כולם
- \`static\` method לא יכול לגשת ל-\`this\` או לשדות instance
- Composition מאפשר שימוש חוזר ללא הורשה
- \`static final\` = קבוע — לפי convention שם ב-UPPER_CASE`,
  },

  // ==================== Day 9: Inheritance & Polymorphism ====================
  {
    topicSlug: "inheritance",
    dayNumber: 9,
    title: "הורשה ו-Override",
    estimatedReadingMinutes: 10,
    pdfResources: day9Pdfs,
    markdown: `## מבוא

**הורשה (Inheritance)** מאפשרת למחלקה לרשת שדות ומתודות ממחלקה אחרת. מחלקת **האב** (superclass) מגדירה התנהגות משותפת, ומחלקת **הבן** (subclass) מרחיבה או משנה אותה.

## מושגי יסוד

| מונח | הגדרה |
|------|--------|
| \`extends\` | מילת מפתח להורשה |
| \`super\` | גישה למחלקת האב |
| \`@Override\` | דריסת מתודה של האב |
| **is-a** | יחס הורשה: Dog **is-a** Animal |

### כללי הורשה ב-Java
- מחלקה יורשת ממחלקה **אחת** בלבד (single inheritance)
- כל מחלקה יורשת מ-\`Object\` (ישירות או בעקיפין)
- \`private\` שדות/מתודות **לא** נגישים לבן (אבל קיימים!)
- \`protected\` נגיש לבן

## תחביר

### הצהרת הורשה
\`\`\`java
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void speak() {
        System.out.println(name + " makes a sound");
    }
}

public class Dog extends Animal {
    private String breed;

    public Dog(String name, String breed) {
        super(name);        // חובה לקרוא ל-constructor של האב
        this.breed = breed;
    }

    @Override
    public void speak() {
        System.out.println(name + " barks!");
    }
}
\`\`\`

### super
\`\`\`java
// קריאה ל-constructor של האב
super(params);   // חייב להיות בשורה הראשונה!

// קריאה למתודה של האב
super.methodName();
\`\`\`

## דפוסים נפוצים

### Override עם הרחבה
\`\`\`java
@Override
public String toString() {
    return super.toString() + ", breed=" + breed;
}
\`\`\`

### Constructor chain
\`\`\`java
class A {
    A() { System.out.println("A"); }
}
class B extends A {
    B() { super(); System.out.println("B"); }
}
class C extends B {
    C() { super(); System.out.println("C"); }
}
// new C() מדפיס: A B C
\`\`\`

### Multi-level inheritance
\`\`\`java
class Shape { }
class Rectangle extends Shape { }
class Square extends Rectangle { }
// Square is-a Rectangle is-a Shape
\`\`\`

## דוגמאות

\`\`\`java
public class Employee {
    protected String name;
    protected double salary;

    public Employee(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    public double getBonus() {
        return salary * 0.1;
    }

    public String toString() {
        return name + " ($" + salary + ")";
    }
}

public class Manager extends Employee {
    private int teamSize;

    public Manager(String name, double salary, int teamSize) {
        super(name, salary);
        this.teamSize = teamSize;
    }

    @Override
    public double getBonus() {
        return salary * 0.2 + teamSize * 100; // בונוס גדול יותר
    }
}
\`\`\`

## טעויות שכיחות

- **שכחת super() ב-constructor**: אם לאב אין constructor ללא פרמטרים — שגיאת קומפילציה
- **super() לא בשורה ראשונה**: חייב להיות הפקודה הראשונה ב-constructor
- **גישה לשדה private של האב**: אסור! צריך getter או \`protected\`
- **שכחת @Override**: לא שגיאה, אבל אם טעיתם בחתימה — לא תדרסו

## טיפים למבחן

- סדר ביצוע constructors: מהאב לבן (A → B → C)
- \`@Override\` בודק שהמתודה באמת דורסת — השתמשו בו!
- אם האב אין לו default constructor — הבן **חייב** לקרוא \`super(...)\` מפורש
- \`protected\` = נגיש לבנים ולאותה חבילה`,
  },
  {
    topicSlug: "polymorphism",
    dayNumber: 9,
    title: "פולימורפיזם ומחלקות מופשטות",
    estimatedReadingMinutes: 10,
    pdfResources: day9Pdfs,
    markdown: `## מבוא

**פולימורפיזם** = "ריבוי צורות". משתנה מטיפוס האב יכול להחזיק אובייקט מטיפוס הבן, והמתודה שתיקרא נקבעת **בזמן ריצה** לפי הטיפוס האמיתי.

## מושגי יסוד

### פולימורפיזם
\`\`\`java
Animal a = new Dog("Rex", "Labrador");
a.speak(); // "Rex barks!" — המתודה של Dog, לא של Animal!
\`\`\`

### Abstract class — מחלקה מופשטת
- לא ניתן ליצור ממנה אובייקט (\`new AbstractClass()\` → שגיאה)
- יכולה להכיל מתודות **abstract** (ללא מימוש) ומתודות רגילות
- תת-מחלקה **חייבת** לממש את כל המתודות המופשטות

### Interface — ממשק
- חוזה: רק חתימות מתודות (בלי מימוש, עד Java 8)
- מחלקה יכולה לממש **כמה** interfaces
- כל המתודות \`public abstract\` (בברירת מחדל)

## תחביר

### Abstract class
\`\`\`java
public abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    public abstract double area();       // חובה לממש בבן
    public abstract double perimeter();  // חובה לממש בבן

    public String toString() {
        return color + " shape, area=" + area();
    }
}

public class Circle extends Shape {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() { return Math.PI * radius * radius; }

    @Override
    public double perimeter() { return 2 * Math.PI * radius; }
}
\`\`\`

### Interface
\`\`\`java
public interface Printable {
    void print();
}

public interface Comparable<T> {
    int compareTo(T other);
}

public class Student implements Printable, Comparable<Student> {
    private String name;
    private int grade;

    public void print() {
        System.out.println(name + ": " + grade);
    }

    public int compareTo(Student other) {
        return this.grade - other.grade;
    }
}
\`\`\`

### מערך פולימורפי
\`\`\`java
Shape[] shapes = new Shape[3];
shapes[0] = new Circle("Red", 5);
shapes[1] = new Rectangle("Blue", 4, 6);
shapes[2] = new Circle("Green", 3);

for (Shape s : shapes) {
    System.out.println(s.area()); // כל אובייקט מחשב בדרך שלו
}
\`\`\`

## דפוסים נפוצים

### instanceof + casting
\`\`\`java
for (Shape s : shapes) {
    if (s instanceof Circle) {
        Circle c = (Circle) s;
        System.out.println("Radius: " + c.getRadius());
    }
}
\`\`\`

### Template Method
\`\`\`java
public abstract class Game {
    public final void play() {
        start();      // כל משחק מממש אחרת
        playTurn();
        end();
    }
    protected abstract void start();
    protected abstract void playTurn();
    protected abstract void end();
}
\`\`\`

## דוגמאות

\`\`\`java
// פולימורפיזם עם interface
Printable[] items = {
    new Student("Alice", 95),
    new Report("Q1", "Sales up 20%"),
};
for (Printable p : items) {
    p.print(); // כל אחד מדפיס בדרך שלו
}
\`\`\`

## טעויות שכיחות

- **יצירת אובייקט ממחלקה abstract**: \`new Shape()\` → שגיאה!
- **שכחה לממש מתודה abstract**: הבן חייב לממש **כולן**, אחרת גם הוא abstract
- **Downcast שגוי**: \`(Circle) rectangleObj\` → ClassCastException בזמן ריצה
- **בלבול compile-time vs runtime type**: הטיפוס בהצהרה vs הטיפוס ב-new

## טיפים למבחן

- **Compile-time type** (סוג ההפניה) קובע אילו מתודות **ניתן** לקרוא
- **Runtime type** (הסוג האמיתי) קובע **איזו גרסה** תרוץ
- \`instanceof\` בודק את ה-runtime type — כולל הורשה (\`dog instanceof Animal\` = true)
- abstract class יכול להכיל constructors ושדות, interface לא (עד Java 8)
- interface = "what", abstract class = "what + some how"`,
  },

  // ==================== Day 10: Integration Review ====================
  {
    topicSlug: "mixed-fundamentals",
    dayNumber: 10,
    title: "חזרה משולבת: יסודות",
    estimatedReadingMinutes: 8,
    pdfResources: day10Pdfs,
    markdown: `## מבוא

יום 10 מסכם את כל החומר. בחלק זה חוזרים על הנושאים הבסיסיים (ימים 1-5): משתנים, תנאים, לולאות, מערכים ומתודות — עם דגש על שילוב ביניהם.

## נקודות מפתח לחזרה

### משתנים וטיפוסים
- חילוק שלמים: \`7/2=3\`, חילוק עשרוני: \`7.0/2=3.5\`
- casting: widening אוטומטי, narrowing מפורש
- \`char\` הוא מספר — \`'A'+1 == 66\`

### תנאים
- סדר if-else if: מהספציפי לכללי
- switch: זכרו break! fall-through = המשך ל-case הבא
- short-circuit: \`&&\` ו-\`||\`

### לולאות
- \`for\`: מספר חזרות ידוע, \`while\`: תנאי כללי
- \`break\` = יציאה, \`continue\` = דילוג לאיטרציה הבאה
- הפרדת ספרות: \`%10\` ו-\`/10\`

### מערכים
- אינדקס 0 עד \`length-1\`
- \`length\` — שדה, לא מתודה
- for-each: קריאה בלבד, לא ניתן לשנות
- 2D: \`mat[row][col]\`, \`mat.length\` = שורות

### מתודות
- Primitive: pass by value, Array: pass by reference
- Overloading: אותו שם, פרמטרים שונים
- Scope: משתנה מקומי חי רק בבלוק שלו

## שאלות אופייניות למבחן

### 1. מעקב קוד (Trace)
\`\`\`java
int x = 5;
for (int i = 0; i < 3; i++) {
    x = x * 2 - 1;
}
System.out.println(x); // ?
// i=0: x=9, i=1: x=17, i=2: x=33 → מדפיס 33
\`\`\`

### 2. כתיבת מתודה
\`\`\`java
// כתבו מתודה שמקבלת מערך ומחזירה את סכום האיברים הזוגיים
public static int sumEven(int[] arr) {
    int sum = 0;
    for (int val : arr) {
        if (val % 2 == 0) sum += val;
    }
    return sum;
}
\`\`\`

### 3. עבודה עם מטריצה
\`\`\`java
// סכום אלכסונים של מטריצה ריבועית
public static int sumDiagonals(int[][] mat) {
    int n = mat.length;
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += mat[i][i];           // אלכסון ראשי
        sum += mat[i][n - 1 - i];  // אלכסון משני
    }
    // אם n אי-זוגי, האמצע נספר פעמיים
    if (n % 2 == 1) sum -= mat[n/2][n/2];
    return sum;
}
\`\`\`

## טיפים אחרונים

- **קראו את השאלה פעמיים** לפני שמתחילים
- **כתבו trace table** לשאלות מעקב
- **בדקו מקרי קצה**: מערך ריק, מספר 0, ערכים שליליים
- **שימו לב לטיפוס ההחזרה**: \`int\` vs \`double\` vs \`void\``,
  },
  {
    topicSlug: "mixed-oop",
    dayNumber: 10,
    title: "חזרה משולבת: OOP",
    estimatedReadingMinutes: 9,
    pdfResources: day10Pdfs,
    markdown: `## מבוא

חזרה על נושאי OOP (ימים 7-9): מחלקות, כימוס, הורשה ופולימורפיזם. הדגש על שילוב הנושאים יחד בשאלות מורכבות.

## נקודות מפתח לחזרה

### מחלקות ואובייקטים
- Constructor: אין return type, שם = שם המחלקה
- \`this\`: מתייחס לאובייקט הנוכחי
- \`toString()\`: נקראת אוטומטית ב-println

### כימוס
- שדות \`private\`, גישה דרך getters/setters
- ולידציה ב-setters
- \`final\` = ערך קבוע

### Static
- שדה static = משותף לכל האובייקטים
- מתודה static = לא צריך אובייקט, אין \`this\`
- \`static final\` = קבוע של המחלקה

### הורשה
- \`extends\` — מחלקה אחת בלבד
- \`super()\` — **שורה ראשונה** ב-constructor
- \`@Override\` — דריסת מתודה של האב

### פולימורפיזם
- משתנה מטיפוס האב ← אובייקט מטיפוס הבן
- Compile-time type → מה ניתן לקרוא
- Runtime type → איזו גרסה רצה
- \`abstract class\` — לא ניתן ליצור מופע
- \`interface\` — חוזה, ניתן לממש כמה

## שאלות אופייניות למבחן

### 1. מעקב OOP
\`\`\`java
class A {
    public A() { System.out.print("A "); }
    public void f() { System.out.print("A.f "); }
}
class B extends A {
    public B() { System.out.print("B "); }
    public void f() { System.out.print("B.f "); }
}
// new B() → מדפיס: "A B "
// A a = new B(); a.f() → מדפיס: "B.f " (פולימורפיזם!)
\`\`\`

### 2. תכנון מחלקה
\`\`\`java
// כתבו מחלקה Classroom עם:
// - מערך של Student
// - מתודה getAverage()
// - מתודה getBestStudent()
public class Classroom {
    private Student[] students;
    private int count;

    public Classroom(int capacity) {
        students = new Student[capacity];
        count = 0;
    }

    public void addStudent(Student s) {
        if (count < students.length) {
            students[count++] = s;
        }
    }

    public double getAverage() {
        if (count == 0) return 0;
        int sum = 0;
        for (int i = 0; i < count; i++) {
            sum += students[i].getGrade();
        }
        return (double) sum / count;
    }

    public Student getBestStudent() {
        if (count == 0) return null;
        Student best = students[0];
        for (int i = 1; i < count; i++) {
            if (students[i].getGrade() > best.getGrade()) {
                best = students[i];
            }
        }
        return best;
    }
}
\`\`\`

### 3. פולימורפיזם + instanceof
\`\`\`java
Shape[] shapes = {new Circle(5), new Rectangle(3, 4), new Circle(2)};
double totalArea = 0;
int circleCount = 0;
for (Shape s : shapes) {
    totalArea += s.area();
    if (s instanceof Circle) circleCount++;
}
\`\`\`

## טיפים אחרונים

- **Constructor chain**: A → B → C — מהאב לבן
- **פולימורפיזם**: סוג ההצהרה ≠ סוג האובייקט
- **abstract**: חייבים לממש כל מתודה abstract, אחרת הבן גם abstract
- **instanceof**: בודק runtime type, כולל הורשה`,
  },
  {
    topicSlug: "exam-simulation",
    dayNumber: 10,
    title: "שאלות בסגנון מבחן",
    estimatedReadingMinutes: 10,
    pdfResources: day10Pdfs,
    markdown: `## מבוא

פרק זה מכיל דוגמאות לשאלות בסגנון מבחן, עם פתרונות מלאים. התרגול מכסה את כל נושאי הקורס: מערכים, רקורסיה, מתודות, ו-OOP.

## שאלה 1: מערכים ומתודות

**כתבו מתודה שמקבלת מטריצה ומחזירה את סכום האלכסון הראשי.**

\`\`\`java
public static int diagonalSum(int[][] mat) {
    int sum = 0;
    for (int i = 0; i < mat.length; i++) {
        sum += mat[i][i];
    }
    return sum;
}
\`\`\`

## שאלה 2: מיזוג מערכים ממוינים

**כתבו מתודה שמקבלת שני מערכים ממוינים ומחזירה מערך ממוין אחד.**

\`\`\`java
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
\`\`\`

**ניתוח**: שלוש לולאות while — ראשונה משווה, השתיים האחרות מטפלות בשאריות. סיבוכיות O(n+m).

## שאלה 3: רקורסיה

**כתבו מתודה רקורסיבית שבודקת אם מערך ממוין.**

\`\`\`java
public static boolean isSorted(int[] arr, int index) {
    if (index >= arr.length - 1) return true;
    if (arr[index] > arr[index + 1]) return false;
    return isSorted(arr, index + 1);
}
// קריאה: isSorted(arr, 0)
\`\`\`

## שאלה 4: OOP מלא

**כתבו את ההיררכיה הבאה:**
- \`Shape\` (abstract) — שדות: color, מתודות: area(), toString()
- \`Circle\` extends Shape — שדות: radius
- \`Rectangle\` extends Shape — שדות: width, height

\`\`\`java
public abstract class Shape {
    protected String color;
    public Shape(String color) { this.color = color; }
    public abstract double area();
    public String toString() {
        return color + " shape, area=" + String.format("%.2f", area());
    }
}

public class Circle extends Shape {
    private double radius;
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    public double area() { return Math.PI * radius * radius; }
    public double getRadius() { return radius; }
}

public class Rectangle extends Shape {
    private double width, height;
    public Rectangle(String color, double w, double h) {
        super(color);
        this.width = w;
        this.height = h;
    }
    public double area() { return width * height; }
}
\`\`\`

## שאלה 5: מעקב קוד

\`\`\`java
public static int mystery(int n) {
    if (n < 10) return n;
    return mystery(n / 10) + (n % 10);
}
System.out.println(mystery(1234)); // ?
\`\`\`

**פתרון**: סכום ספרות!
- \`mystery(1234)\` → \`mystery(123) + 4\`
- → \`mystery(12) + 3 + 4\`
- → \`mystery(1) + 2 + 3 + 4\`
- → \`1 + 2 + 3 + 4 = 10\`

## אסטרטגיית מבחן

1. **קראו את כל השאלות** לפני שמתחילים — התחילו מהקלה
2. **מעקב קוד**: כתבו trace table עם כל המשתנים
3. **כתיבת קוד**: חשבו על אלגוריתם לפני שכותבים
4. **OOP**: זכרו — constructor chain, פולימורפיזם, abstract חייב מימוש
5. **בדקו מקרי קצה**: null, 0, מערך ריק, איבר יחיד
6. **שכתבו נקי**: אם טעיתם, מחקו ותכתבו מחדש`,
  },
]

// ─── Helper Functions ────────────────────────────────────────────────────────

const dayTitles: Record<number, string> = {
  1: "Fundamentals & I/O",
  2: "Control Flow",
  3: "Loops",
  4: "Arrays",
  5: "Functions & Methods",
  6: "Recursion",
  7: "OOP Foundations",
  8: "OOP Advanced",
  9: "Inheritance & Polymorphism",
  10: "Integration Review",
}

const dayPdfs: Record<number, PdfResource[]> = {
  1: day1Pdfs,
  2: day2Pdfs,
  3: day3Pdfs,
  4: day4Pdfs,
  5: day5Pdfs,
  6: day6Pdfs,
  7: day7Pdfs,
  8: day8Pdfs,
  9: day9Pdfs,
  10: day10Pdfs,
}

export function getSummaryGroups(): DaySummaryGroup[] {
  const groups: DaySummaryGroup[] = []
  for (let day = 1; day <= 10; day++) {
    groups.push({
      dayNumber: day,
      dayTitle: dayTitles[day],
      topics: theorySummaries.filter((s) => s.dayNumber === day),
      pdfResources: dayPdfs[day],
    })
  }
  return groups
}

export function getSummariesByDay(dayNumber: number): TheorySummary[] {
  return theorySummaries.filter((s) => s.dayNumber === dayNumber)
}
