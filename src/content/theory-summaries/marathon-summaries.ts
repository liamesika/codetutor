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
    title: "משתנים וטיפוסי נתונים",
    estimatedReadingMinutes: 8,
    pdfResources: day1Pdfs,
    markdown: `## מבוא

ב-Java כל משתנה חייב להיות מוצהר עם **טיפוס** לפני השימוש. השפה היא **strongly typed** — לא ניתן לשים מחרוזת בתוך משתנה שלם, למשל.

## מושגי יסוד

### טיפוסים פרימיטיביים (Primitive Types)

| טיפוס | גודל | טווח | דוגמה |
|--------|-------|------|--------|
| \`byte\` | 8 ביט | -128 עד 127 | \`byte b = 100;\` |
| \`short\` | 16 ביט | -32,768 עד 32,767 | \`short s = 1000;\` |
| \`int\` | 32 ביט | ±2.1 מיליארד | \`int x = 42;\` |
| \`long\` | 64 ביט | ±9.2×10¹⁸ | \`long l = 123456789L;\` |
| \`float\` | 32 ביט | ~7 ספרות משמעותיות | \`float f = 3.14f;\` |
| \`double\` | 64 ביט | ~15 ספרות משמעותיות | \`double d = 3.14;\` |
| \`char\` | 16 ביט | תו Unicode | \`char c = 'A';\` |
| \`boolean\` | — | true / false | \`boolean ok = true;\` |

### טיפוסי הפניה (Reference Types)
- \`String\` — מחרוזת (אובייקט, לא primitive)
- מערכים, אובייקטים אחרים

## תחביר

### הצהרה והשמה
\`\`\`java
int x;           // הצהרה בלבד (ערך ברירת מחדל 0 בשדות מחלקה)
int y = 10;      // הצהרה + אתחול
final int MAX = 100; // קבוע — לא ניתן לשנות
\`\`\`

### המרת טיפוסים (Casting)
\`\`\`java
// המרה מרחיבה (Widening) — אוטומטית
int a = 5;
double b = a;         // 5.0 — בלי בעיה

// המרה מצמצמת (Narrowing) — דורשת cast מפורש
double c = 9.7;
int d = (int) c;      // 9 — חיתוך (לא עיגול!)
\`\`\`

### חילוק שלמים vs עשרוני
\`\`\`java
int a = 7, b = 2;
System.out.println(a / b);           // 3 (חילוק שלמים!)
System.out.println((double) a / b);  // 3.5
System.out.println(a % b);           // 1 (שארית)
\`\`\`

## דפוסים נפוצים

1. **חילוף ערכים (Swap)**: דורש משתנה עזר — \`int temp = a; a = b; b = temp;\`
2. **הפרדת ספרות**: \`n % 10\` נותן ספרת אחדות, \`n / 10\` מסיר אותה
3. **עיגול**: \`Math.round(x)\` מעגל, \`(int)(x + 0.5)\` עבור חיוביים

## דוגמאות

\`\`\`java
// חילוק שלמים עם שארית
int total = 17, perBox = 5;
int boxes = total / perBox;    // 3
int leftover = total % perBox; // 2

// עיגול לשתי ספרות אחרי הנקודה
double price = 19.99 * 1.17;
System.out.printf("%.2f%n", price); // 23.39
\`\`\`

## טעויות שכיחות

- **חילוק שלמים**: \`7 / 2\` שווה \`3\` ולא \`3.5\`! צריך cast ל-double
- **שכחת f/L**: \`float f = 3.14;\` → שגיאה! צריך \`3.14f\`
- **הצפה (Overflow)**: \`int x = 2147483647 + 1;\` → מספר שלילי!
- **השוואת String עם ==**: משווה הפניות, לא תוכן. תמיד \`str.equals()\`

## טיפים למבחן

- שימו לב לטיפוס התוצאה בחילוק — אם שני האופרנדים \`int\`, התוצאה \`int\`
- \`char\` הוא מספר — \`'A' + 1\` שווה \`66\` (ה-ASCII של 'B')
- \`%\` עובד גם עם שליליים: \`-7 % 2 == -1\`
- במבחן תשאלו על casting — זכרו: narrowing חותך, לא מעגל`,
  },
  {
    topicSlug: "input-output",
    dayNumber: 1,
    title: "קלט ופלט",
    estimatedReadingMinutes: 7,
    pdfResources: day1Pdfs,
    markdown: `## מבוא

Java משתמשת ב-\`Scanner\` לקלט מהמשתמש וב-\`System.out\` לפלט. חשוב להבין את ההבדל בין מתודות הקריאה השונות.

## מושגי יסוד

### קלט עם Scanner
\`\`\`java
import java.util.Scanner;
Scanner sc = new Scanner(System.in);
\`\`\`

### מתודות קריאה

| מתודה | קוראת | מדלגת על שורה? |
|--------|--------|----------------|
| \`nextInt()\` | מספר שלם | לא |
| \`nextDouble()\` | מספר עשרוני | לא |
| \`next()\` | מילה (עד רווח) | לא |
| \`nextLine()\` | שורה שלמה | כן |

## תחביר

### פלט בסיסי
\`\`\`java
System.out.println("Hello");   // מדפיס + ירידת שורה
System.out.print("No newline"); // מדפיס בלי ירידת שורה
System.out.printf("Name: %s, Age: %d%n", name, age); // פורמט
\`\`\`

### קודי פורמט (printf)

| קוד | טיפוס | דוגמה |
|------|--------|--------|
| \`%d\` | int | \`printf("%d", 42)\` → \`42\` |
| \`%f\` | double | \`printf("%.2f", 3.14159)\` → \`3.14\` |
| \`%s\` | String | \`printf("%s", "hi")\` → \`hi\` |
| \`%c\` | char | \`printf("%c", 'A')\` → \`A\` |
| \`%n\` | שורה חדשה | (עדיף על \`\\n\`) |

## דפוסים נפוצים

### קריאת מספר ואז שורה
\`\`\`java
int n = sc.nextInt();
sc.nextLine();  // ← חובה! ניקוי ה-newline
String line = sc.nextLine();
\`\`\`

### קריאה בלולאה
\`\`\`java
int n = sc.nextInt();
for (int i = 0; i < n; i++) {
    int value = sc.nextInt();
    // עיבוד...
}
\`\`\`

## דוגמאות

\`\`\`java
// קריאת שם מלא ועיצוב פלט
Scanner sc = new Scanner(System.in);
System.out.print("Enter name: ");
String name = sc.nextLine();
System.out.print("Enter age: ");
int age = sc.nextInt();
System.out.printf("Hello %s, you are %d years old%n", name, age);
\`\`\`

## טעויות שכיחות

- **בעיית nextLine() אחרי nextInt()**: \`nextInt()\` לא צורכת את ה-Enter, אז \`nextLine()\` הבא מקבל מחרוזת ריקה. פתרון: הוסיפו \`sc.nextLine();\` ביניהם
- **שכחת import**: חייבים \`import java.util.Scanner;\`
- **בלבול בין next() ל-nextLine()**: \`next()\` קוראת עד רווח, \`nextLine()\` קוראת שורה שלמה

## טיפים למבחן

- תמיד שימו לב אם הקלט הוא מספרים או מחרוזות — זה קובע את המתודה
- \`printf\` עם \`%.2f\` מעגל אוטומטית (4.125 → 4.13)
- אם קוראים \`nextInt()\` ואז \`nextLine()\` — **חובה** לנקות עם \`nextLine()\` מיותר`,
  },

  // ==================== Day 2: Control Flow ====================
  {
    topicSlug: "conditionals",
    dayNumber: 2,
    title: "תנאים: if-else ו-switch",
    estimatedReadingMinutes: 9,
    pdfResources: day2Pdfs,
    markdown: `## מבוא

משפטי תנאי מאפשרים לתוכנית לקבל החלטות. \`if-else\` הוא הכלי הבסיסי ביותר, ו-\`switch\` מתאים להשוואה של ערך יחיד למספר אפשרויות.

## מושגי יסוד

### if-else
- **if** — מבצע בלוק קוד אם התנאי \`true\`
- **else if** — תנאי נוסף אם הקודם \`false\`
- **else** — ברירת מחדל אם כל התנאים \`false\`

### switch
- משווה ערך יחיד (int, char, String, enum) לערכים קבועים
- כל \`case\` חייב להסתיים ב-\`break\` (אחרת "נופל" למקרה הבא)
- \`default\` — ברירת מחדל

## תחביר

### if-else
\`\`\`java
if (condition1) {
    // ...
} else if (condition2) {
    // ...
} else {
    // ...
}
\`\`\`

### Ternary Operator
\`\`\`java
String result = (grade >= 60) ? "Pass" : "Fail";
\`\`\`

### switch
\`\`\`java
switch (value) {
    case 1:
        System.out.println("One");
        break;
    case 2:
        System.out.println("Two");
        break;
    default:
        System.out.println("Other");
}
\`\`\`

## דפוסים נפוצים

### סיווג טווחים
\`\`\`java
if (grade >= 90) result = "A";
else if (grade >= 80) result = "B";
else if (grade >= 70) result = "C";
else result = "F";
// חשוב: הסדר חשוב! מהגדול לקטן
\`\`\`

### בדיקת תחום
\`\`\`java
if (x >= 0 && x <= 100) { /* בטווח */ }
\`\`\`

### switch עם fall-through מכוון
\`\`\`java
switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
        days = 31; break;
    case 4: case 6: case 9: case 11:
        days = 30; break;
    case 2:
        days = 28; break;
}
\`\`\`

## דוגמאות

\`\`\`java
// סיווג משולש
if (a == b && b == c) {
    System.out.println("Equilateral");
} else if (a == b || b == c || a == c) {
    System.out.println("Isosceles");
} else {
    System.out.println("Scalene");
}
\`\`\`

## טעויות שכיחות

- **= במקום ==**: \`if (x = 5)\` זו השמה, לא השוואה!
- **שכחת break ב-switch**: הקוד "ייפול" ל-case הבא
- **השוואת String עם ==**: חובה להשתמש ב-\`.equals()\`
- **סדר תנאים שגוי**: \`if (grade >= 70)\` לפני \`if (grade >= 90)\` יתפוס 90+ ב-70+

## טיפים למבחן

- עקבו אחרי סדר ביצוע התנאים — רק הראשון שמתקיים יבוצע
- ב-switch: אם אין break — הקוד ממשיך ל-case הבא (fall-through)!
- \`&&\` ו-\`||\` עושים short-circuit: אם התוצאה ידועה מהצד השמאלי, הצד הימני לא מחושב`,
  },
  {
    topicSlug: "logical-operators",
    dayNumber: 2,
    title: "אופרטורים לוגיים",
    estimatedReadingMinutes: 6,
    pdfResources: day2Pdfs,
    markdown: `## מבוא

אופרטורים לוגיים מאפשרים לשלב תנאים. הם מחזירים \`boolean\` ומשמשים בעיקר בתוך \`if\` ו-\`while\`.

## מושגי יסוד

| אופרטור | שם | דוגמה | תיאור |
|----------|-----|--------|--------|
| \`&&\` | AND | \`a && b\` | true רק אם שניהם true |
| \`\\|\\|\` | OR | \`a \\|\\| b\` | true אם לפחות אחד true |
| \`!\` | NOT | \`!a\` | הופך true↔false |

### סדר קדימות (Precedence)
1. \`!\` (גבוה ביותר)
2. \`&&\`
3. \`||\` (נמוך ביותר)

### Short-Circuit Evaluation
- \`false && expr\` → לא מחשב את \`expr\`
- \`true || expr\` → לא מחשב את \`expr\`

## תחביר

\`\`\`java
// AND — שני תנאים חייבים להתקיים
if (age >= 18 && hasLicense) { /* יכול לנהוג */ }

// OR — מספיק שאחד מתקיים
if (isStudent || isElderly) { /* הנחה */ }

// NOT — היפוך
if (!isEmpty) { /* יש תוכן */ }

// שילוב עם סוגריים
if ((a > 0 && b > 0) || c > 0) { /* ... */ }
\`\`\`

## דפוסים נפוצים

### בדיקת טווח
\`\`\`java
boolean inRange = (x >= 0) && (x <= 100);
\`\`\`

### בדיקת null בטוחה
\`\`\`java
if (str != null && str.length() > 0) { /* בטוח */ }
// short-circuit מגן מ-NullPointerException
\`\`\`

### חוקי דה-מורגן (De Morgan)
\`\`\`java
!(A && B)  ==  (!A || !B)
!(A || B)  ==  (!A && !B)
\`\`\`

## דוגמאות

\`\`\`java
// שנה מעוברת
boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);

// בדיקת תקינות קלט
boolean valid = (input >= 1 && input <= 10);
\`\`\`

## טעויות שכיחות

- **בלבול && עם &**: \`&\` הוא bitwise AND — לא עושה short-circuit!
- **שכחת סוגריים**: \`a || b && c\` שווה ל-\`a || (b && c)\` — לא \`(a || b) && c\`
- **כפל שלילה**: \`!(x != 5)\` פשוט שווה ל-\`x == 5\`

## טיפים למבחן

- שרטטו טבלת אמת אם הביטוי מסובך
- זכרו דה-מורגן: הפכו && ↔ || כשמכניסים שלילה
- short-circuit חשוב כשיש סכנת NullPointerException`,
  },

  // ==================== Day 3: Loops ====================
  {
    topicSlug: "basic-loops",
    dayNumber: 3,
    title: "לולאות for ו-while",
    estimatedReadingMinutes: 9,
    pdfResources: day3Pdfs,
    markdown: `## מבוא

לולאות מאפשרות חזרה על בלוק קוד. \`for\` מתאים כשיודעים מראש כמה פעמים לחזור, \`while\` כשהתנאי תלוי בקלט או מצב משתנה.

## מושגי יסוד

### שלושה סוגי לולאות

| לולאה | מתי להשתמש | מבנה |
|--------|-------------|------|
| \`for\` | מספר חזרות ידוע | \`for (init; cond; update)\` |
| \`while\` | תנאי כללי | \`while (cond) { ... }\` |
| \`do-while\` | לפחות פעם אחת | \`do { ... } while (cond);\` |

## תחביר

### for
\`\`\`java
for (int i = 0; i < n; i++) {
    System.out.println(i);
}
// i לא נגיש מחוץ ללולאה
\`\`\`

### while
\`\`\`java
int i = 0;
while (i < n) {
    System.out.println(i);
    i++;
}
\`\`\`

### do-while
\`\`\`java
int input;
do {
    System.out.print("Enter (1-10): ");
    input = sc.nextInt();
} while (input < 1 || input > 10);
\`\`\`

### break ו-continue
\`\`\`java
for (int i = 0; i < 100; i++) {
    if (i == 50) break;     // יוצא מהלולאה לגמרי
    if (i % 2 == 0) continue; // מדלג לאיטרציה הבאה
    System.out.println(i);  // מדפיס רק אי-זוגיים עד 49
}
\`\`\`

## דפוסים נפוצים

### סכום מספרים
\`\`\`java
int sum = 0;
for (int i = 1; i <= n; i++) {
    sum += i;
}
\`\`\`

### מונה עם תנאי
\`\`\`java
int count = 0;
for (int i = 0; i < n; i++) {
    if (arr[i] > 0) count++;
}
\`\`\`

### הפרדת ספרות
\`\`\`java
while (n > 0) {
    int digit = n % 10;
    n /= 10;
    // עיבוד digit...
}
\`\`\`

### חיפוש ראשון
\`\`\`java
int i = 0;
while (i < arr.length && arr[i] != target) {
    i++;
}
boolean found = (i < arr.length);
\`\`\`

## דוגמאות

\`\`\`java
// עצרת (Factorial)
long fact = 1;
for (int i = 2; i <= n; i++) {
    fact *= i;
}

// ספירת ספרות
int count = 0;
int num = 12345;
while (num > 0) {
    count++;
    num /= 10;
}
// count == 5
\`\`\`

## טעויות שכיחות

- **לולאה אינסופית**: שכחתם לעדכן את המונה או התנאי אף פעם לא נהיה false
- **Off-by-one**: \`i <= n\` vs \`i < n\` — הבדל של 1!
- **שינוי מונה בתוך for**: \`for(int i=0; i<n; i++) { i++; }\` — מדלג על ערכים
- **שכחת {} בלולאה חד-שורתית**: רק השורה הראשונה בתוך הלולאה

## טיפים למבחן

- עקבו אחרי ערכי המשתנים באמצעות טבלה (trace table)
- שימו לב לערך ההתחלתי ולתנאי העצירה
- \`do-while\` מבצע לפחות פעם אחת — שונה מ-\`while\`
- לולאה על ספרות: \`% 10\` ו-\`/ 10\` — דפוס קלאסי`,
  },
  {
    topicSlug: "nested-loops",
    dayNumber: 3,
    title: "לולאות מקוננות ודפוסים",
    estimatedReadingMinutes: 8,
    pdfResources: day3Pdfs,
    markdown: `## מבוא

לולאה מקוננת היא לולאה בתוך לולאה. הלולאה הפנימית רצה מלאה עבור כל איטרציה של החיצונית. שימוש נפוץ: הדפסת דפוסים, עבודה עם מטריצות.

## מושגי יסוד

- הלולאה **החיצונית** שולטת בשורות
- הלולאה **הפנימית** שולטת בעמודות
- סיבוכיות: n חיצוני × m פנימי = O(n×m)

## תחביר

\`\`\`java
for (int i = 0; i < rows; i++) {       // שורות
    for (int j = 0; j < cols; j++) {   // עמודות
        System.out.print("* ");
    }
    System.out.println(); // ירידת שורה
}
\`\`\`

## דפוסים נפוצים

### משולש ימני
\`\`\`java
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}
// n=4:
// *
// * *
// * * *
// * * * *
\`\`\`

### משולש הפוך
\`\`\`java
for (int i = n; i >= 1; i--) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}
\`\`\`

### פירמידת מספרים
\`\`\`java
for (int i = 1; i <= n; i++) {
    // רווחים
    for (int j = 0; j < n - i; j++) System.out.print(" ");
    // מספרים
    for (int j = 1; j <= i; j++) System.out.print(j + " ");
    System.out.println();
}
\`\`\`

### לוח כפל
\`\`\`java
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n; j++) {
        System.out.printf("%4d", i * j);
    }
    System.out.println();
}
\`\`\`

## דוגמאות

\`\`\`java
// דפוס יהלום
int n = 5;
// חצי עליון
for (int i = 1; i <= n; i++) {
    for (int j = 0; j < n - i; j++) System.out.print(" ");
    for (int j = 0; j < 2 * i - 1; j++) System.out.print("*");
    System.out.println();
}
// חצי תחתון
for (int i = n - 1; i >= 1; i--) {
    for (int j = 0; j < n - i; j++) System.out.print(" ");
    for (int j = 0; j < 2 * i - 1; j++) System.out.print("*");
    System.out.println();
}
\`\`\`

## טעויות שכיחות

- **שכחת println() אחרי שורה**: הכל מודפס בשורה אחת
- **שימוש באותו שם מונה**: \`i\` בשתי הלולאות — שגיאת קומפילציה או התנהגות לא צפויה
- **חישוב גבול שגוי**: \`j <= i\` vs \`j < i\` — משפיע על מספר הכוכביות

## טיפים למבחן

- ציירו את הדפוס על נייר קודם — זהו כמה תווים בכל שורה
- הלולאה הפנימית תלויה ב-\`i\` (המונה של החיצונית) — ככה הדפוס משתנה
- עבור דפוסים מרוכזים: מספר רווחים = \`n - i\`, מספר כוכביות = \`2*i - 1\``,
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
