/**
 * Hebrew translations for marathon exercise prompts and hints.
 * Maps question slug → { promptHe, hintsHe }
 */

export interface ExerciseTranslation {
  promptHe: string
  hintsHe: string[]
}

export const exerciseTranslationsHe: Record<string, ExerciseTranslation> = {
  // ==================== Day 1: Fundamentals & I/O ====================

  // --- Variables & Data Types ---
  "declare-and-print-variables": {
    promptHe:
      "התוכנית מקבלת דרך שורת הפקודה (args) שני מספרים שלמים.\n\nעליכם:\n1. לקרוא את שני המספרים מ-args ולהמיר אותם ל-int באמצעות Integer.parseInt\n2. להדפיס בשורה הראשונה את הסכום שלהם\n3. להדפיס בשורה השנייה את המכפלה שלהם\n\nדוגמה:\nאם הארגומנטים הם 3 ו-5, הפלט יהיה:\n8\n15",
    hintsHe: [
      "args[0] ו-args[1] הם מחרוזות — צריך להמיר אותם למספרים עם Integer.parseInt",
      "השתמשו ב-System.out.println() כדי להדפיס כל תוצאה בשורה נפרדת",
      "סכום: a + b, מכפלה: a * b",
    ],
  },
  "type-casting-int-to-double": {
    promptHe:
      "התוכנית מקבלת דרך שורת הפקודה (args) שני מספרים שלמים.\n\nעליכם:\n1. לקרוא את שני המספרים מ-args ולהמיר אותם ל-int\n2. להדפיס בשורה הראשונה את תוצאת החילוק השלם (integer division) — חילוק בין שני int ב-Java חותך את החלק העשרוני\n3. להדפיס בשורה השנייה את תוצאת החילוק העשרוני (double division), מעוגל לשתי ספרות אחרי הנקודה\n\nכדי לקבל תוצאה עשרונית, יש להמיר (cast) את אחד המספרים ל-double לפני החילוק.\n\nדוגמה:\nעבור הארגומנטים 7 ו-2, הפלט יהיה:\n3\n3.50\n\nהמספר השני לעולם לא יהיה אפס.",
    hintsHe: [
      "חילוק שלמים ב-Java: 7 / 2 = 3 (החלק העשרוני נחתך)",
      "המירו את אחד המספרים ל-double לפני החילוק: (double) a / b",
      'השתמשו ב-System.out.printf("%.2f%n", value) כדי לעגל ל-2 ספרות',
    ],
  },
  "swap-two-variables": {
    promptHe:
      "התוכנית מקבלת דרך שורת הפקודה (args) שני מספרים שלמים.\n\nעליכם:\n1. לקרוא את שני המספרים מ-args ולהמיר אותם ל-int\n2. להחליף את הערכים ביניהם באמצעות משתנה עזר (temp)\n3. להדפיס כל מספר בשורה נפרדת — קודם הערך שהיה השני, ואחר כך הערך שהיה הראשון\n\nכדי להחליף בין שני משתנים, חייבים להשתמש במשתנה שלישי (temp) שישמור את הערך הראשון לפני שדורסים אותו.\n\nדוגמה:\nעבור הארגומנטים 3 ו-7, הפלט יהיה:\n7\n3",
    hintsHe: [
      "שמרו את הערך של a במשתנה זמני: int temp = a",
      "העבירו את הערך של b לתוך a: a = b",
      "העבירו את הערך השמור לתוך b: b = temp",
    ],
  },
  "expression-evaluation": {
    promptHe:
      "התוכנית מקבלת דרך שורת הפקודה (args) שלושה מספרים שלמים: a, b ו-c.\n\nעליכם:\n1. לקרוא את שלושת המספרים מ-args ולהמיר אותם ל-int\n2. לחשב את הביטוי: a\u00b2 + 2\u00d7b \u2212 c (כלומר: a בריבוע, ועוד פעמיים b, פחות c)\n3. להדפיס את התוצאה כמספר שלם\n\nשימו לב: ב-Java אין אופרטור חזקה — כדי לחשב a\u00b2 כותבים a * a.\n\nדוגמה:\nעבור a=3, b=4, c=2:\nהחישוב: 3\u00d73 + 2\u00d74 \u2212 2 = 9 + 8 \u2212 2 = 15\nהפלט: 15",
    hintsHe: [
      "a בריבוע ב-Java זה a * a (אין אופרטור **)",
      "הביטוי המלא: a * a + 2 * b - c",
      "סדר פעולות: כפל קודם לחיבור וחיסור",
    ],
  },

  // --- Output & Command-Line Arguments ---
  "read-and-greet": {
    promptHe:
      "התוכנית מקבלת דרך שורת הפקודה (args) שם של אדם (מילה אחת).\n\nעליכם:\n1. לקרוא את השם מ-args[0] — מכיוון שהשם הוא מחרוזת, אין צורך בהמרה\n2. להדפיס הודעת ברכה בפורמט: Hello, <שם>!\n\nשימו לב לפסיק אחרי Hello ולסימן קריאה בסוף.\n\nדוגמה:\nעבור הארגומנט Alice, הפלט יהיה:\nHello, Alice!",
    hintsHe: [
      "args[0] כבר מחרוזת — אין צורך להמיר אותו",
      'שרשרו מחרוזות עם +: "Hello, " + name + "!"',
      "וודאו שיש פסיק ורווח אחרי Hello ושסימן קריאה בסוף",
    ],
  },
  "circle-calculator": {
    promptHe:
      "התוכנית מקבלת דרך שורת הפקודה (args) מספר עשרוני המייצג את רדיוס המעגל.\n\nעליכם:\n1. לקרוא את הרדיוס מ-args[0] ולהמיר אותו ל-double באמצעות Double.parseDouble\n2. לחשב את שטח המעגל לפי הנוסחה: \u03c0 \u00d7 r\u00b2\n3. לחשב את היקף המעגל לפי הנוסחה: 2 \u00d7 \u03c0 \u00d7 r\n4. להדפיס את השטח בשורה הראשונה ואת ההיקף בשורה השנייה, שניהם מעוגלים לשתי ספרות עשרוניות\n\nהשתמשו ב-Math.PI עבור הערך של \u03c0.\n\nדוגמה:\nעבור רדיוס 5.0, הפלט יהיה:\n78.54\n31.42",
    hintsHe: [
      "השתמשו ב-Double.parseDouble(args[0]) כדי להמיר את הרדיוס ל-double",
      "שטח: Math.PI * r * r, היקף: 2 * Math.PI * r",
      'השתמשו ב-System.out.printf("%.2f%n", value) להדפסה עם 2 ספרות',
    ],
  },
  "formatted-receipt": {
    promptHe:
      "התוכנית מקבלת דרך שורת הפקודה (args) שלושה ערכים:\n\u2022 args[0] — שם פריט (מחרוזת, מילה אחת)\n\u2022 args[1] — כמות (מספר שלם)\n\u2022 args[2] — מחיר ליחידה (מספר עשרוני)\n\nעליכם:\n1. לקרוא את הערכים מ-args ולהמיר אותם לטיפוסים המתאימים\n2. לחשב את הסכום הכולל (כמות \u00d7 מחיר)\n3. להדפיס קבלה בפורמט הבא:\nItem: <שם>\nQty: <כמות>\nTotal: $<סכום>\n\nהסכום הכולל צריך להיות מעוגל לשתי ספרות עשרוניות.\n\nדוגמה:\nעבור הארגומנטים Apple 3 1.50, הפלט יהיה:\nItem: Apple\nQty: 3\nTotal: $4.50",
    hintsHe: [
      "args[0] כבר מחרוזת. השתמשו ב-Integer.parseInt לכמות ו-Double.parseDouble למחיר",
      "חשבו total = qty * price",
      'השתמשו ב-printf("Total: $%.2f%n", total) לעיגול',
    ],
  },
  "multi-type-parser": {
    promptHe:
      "התוכנית מקבלת דרך שורת הפקודה (args) ארבעה ערכים מטיפוסים שונים:\n\u2022 args[0] — מחרוזת (מילה)\n\u2022 args[1] — מספר שלם (int)\n\u2022 args[2] — מספר עשרוני (double)\n\u2022 args[3] — ערך בוליאני (true או false)\n\nעליכם להמיר כל ערך לטיפוס המתאים ולהדפיס אותו בשורה נפרדת עם תווית:\nWord: <מחרוזת>\nInteger: <int>\nDecimal: <double>\nBoolean: <boolean>\n\nהמספר העשרוני צריך להיות מוצג עם ספרה אחת בלבד אחרי הנקודה העשרונית.\n\nדוגמה:\nעבור הארגומנטים Hello 42 3.14 true, הפלט יהיה:\nWord: Hello\nInteger: 42\nDecimal: 3.1\nBoolean: true",
    hintsHe: [
      "args[0] כבר String. השתמשו ב-Integer.parseInt, Double.parseDouble, Boolean.parseBoolean",
      "שימו לב לסדר ההמרות — הוא תואם את סדר ה-args",
      'השתמשו ב-printf("Decimal: %.1f%n", value) להצגת ספרה עשרונית אחת',
    ],
  },

  // ==================== Day 2: Conditionals ====================

  // --- Conditionals ---
  "point-quadrant": {
    promptHe:
      'התוכנית מקבלת שני מספרים ממשיים x ו-y המייצגים נקודה במערכת צירים קרטזית.\n\nקבעו והדפיסו את מיקום הנקודה:\n• "Quadrant 1" — אם x > 0 וגם y > 0\n• "Quadrant 2" — אם x < 0 וגם y > 0\n• "Quadrant 3" — אם x < 0 וגם y < 0\n• "Quadrant 4" — אם x > 0 וגם y < 0\n• "Origin" — אם שני הקואורדינטות הם 0\n• "Axis" — אם הנקודה על ציר (קואורדינטה אחת 0 אבל לא שתיהן)',
    hintsHe: [
      "התחילו בבדיקת מקרים מיוחדים: שניהם 0 (Origin), אחד 0 (Axis)",
      "לרביעים, שלבו תנאים עם &&: למשל x > 0 && y > 0 לרביע 1",
      "הרביע האחרון (4) יכול להיות ב-else כי כל שאר האפשרויות מוצו",
    ],
  },
  "bmi-calculator": {
    promptHe:
      'התוכנית מקבלת שני ערכים: משקל בקילוגרמים וגובה בסנטימטרים.\n\nחשבו את מדד ה-BMI לפי הנוסחה:\n  BMI = weight / (height_in_meters)²\n\nשימו לב: המירו את הגובה מ-ס"מ למטרים (חלקו ב-100).\n\nסווגו והדפיסו:\n• "Underweight" — אם BMI < 18.5\n• "Normal" — אם 18.5 ≤ BMI < 25.0\n• "Overweight" — אם 25.0 ≤ BMI < 30.0\n• "Obese" — אם BMI ≥ 30.0',
    hintsHe: [
      "המירו גובה למטרים: heightM = heightCm / 100.0",
      "נוסחת BMI: weight / (heightM * heightM) — השתמשו ב-double",
      "בדקו מהטווח הנמוך לגבוה: < 18.5 קודם, אז < 25.0, אז < 30.0, אחרת Obese",
    ],
  },
  "season-by-month": {
    promptHe:
      'התוכנית מקבלת מספר חודש (1-12).\n\nהדפיסו את עונת השנה באמצעות switch עם קיבוץ cases:\n• חודשים 12, 1, 2 → "Winter"\n• חודשים 3, 4, 5 → "Spring"\n• חודשים 6, 7, 8 → "Summer"\n• חודשים 9, 10, 11 → "Autumn"\n• כל ערך אחר → "Invalid"\n\nהשתמשו ב-fall-through (כמה case labels שחולקים את אותו בלוק קוד).',
    hintsHe: [
      "השתמשו ב-switch עם כמה case labels לפני break אחד: case 12: case 1: case 2:",
      "בלי break, הביצוע נופל ל-case הבא — השתמשו בזה כדי לקבץ חודשים",
      'אל תשכחו default לקלט לא תקין ו-break אחרי כל עונה',
    ],
  },
  "triangle-type-classifier": {
    promptHe:
      'התוכנית מקבלת שלושה מספרים שלמים המייצגים צלעות של משולש.\n\nקודם כל בדקו אם הצלעות יכולות ליצור משולש תקין — סכום כל שתי צלעות חייב להיות גדול מהשלישית (a+b>c וגם a+c>b וגם b+c>a). אם לא, הדפיסו "Not a triangle".\n\nאם תקין, קבעו והדפיסו את הסוג:\n• "Equilateral" — כל שלוש הצלעות שוות\n• "Isosceles" — בדיוק שתי צלעות שוות\n• "Scalene" — אין צלעות שוות',
    hintsHe: [
      "בדקו קודם אם המשולש תקין (סכום כל שתי צלעות > השלישית)",
      "אם כל השלוש שוות → Equilateral; אם שתיים שוות → Isosceles; אחרת → Scalene",
      "השוואה: a == b && b == c לשלוש שוות; a == b || b == c || a == c לשתיים שוות",
    ],
  },
  "leap-year-checker": {
    promptHe:
      'התוכנית מקבלת שנה (מספר שלם).\n\nקבעו אם היא שנה מעוברת והדפיסו "Leap year" או "Not a leap year".\n\nחוקי שנה מעוברת:\n• מתחלקת ב-4 וגם לא מתחלקת ב-100 → שנה מעוברת\n• מתחלקת ב-400 → תמיד שנה מעוברת\n• כל שאר המקרים → לא שנה מעוברת\n\nדוגמאות: 2024 → Leap year, 1900 → Not a leap year, 2000 → Leap year.',
    hintsHe: [
      "בדקו קודם חילוק ב-400, אחר כך ב-100, ואז ב-4",
      "שנה מתחלקת ב-400 תמיד מעוברת (למרות שהיא מתחלקת גם ב-100)",
      "השתמשו באופרטור % (מודולו) — year % 4 == 0 בודק חילוק ב-4",
    ],
  },

  // --- Logical Operators ---
  "password-validator": {
    promptHe:
      'התוכנית מקבלת מחרוזת סיסמה.\n\nסיסמה תקינה חייבת לעמוד בכל שלושת התנאים:\n1. אורך 8 תווים לפחות\n2. מתחילה באות גדולה (A-Z)\n3. מסתיימת בספרה (0-9)\n\nהדפיסו "Valid" אם כל התנאים מתקיימים, אחרת "Invalid".\n\nדוגמאות: "Abcdefg1" → Valid, "abcdefg1" → Invalid (לא מתחילה באות גדולה), "Abcdefgh" → Invalid (לא מסתיימת בספרה).',
    hintsHe: [
      "השתמשו ב-password.length() לאורך, ב-password.charAt(0) לתו ראשון, ב-password.charAt(password.length()-1) לתו אחרון",
      "בדיקת אות גדולה: first >= 'A' && first <= 'Z'. בדיקת ספרה: last >= '0' && last <= '9'",
      "שלבו את שלושת התנאים הבוליאניים עם && — כולם חייבים להיות true עבור Valid",
    ],
  },
  "cinema-ticket-price": {
    promptHe:
      'התוכנית מקבלת שני ערכים: גיל (מספר שלם) והאם האדם סטודנט ("true" או "false").\n\nקבעו את מחיר הכרטיס:\n• ילדים מתחת לגיל 12 → "20"\n• מבוגרים מעל 65 או סטודנטים (בכל גיל) → "35"\n• כל השאר → "50"\n\nהדפיסו רק את המספר.\n\nדוגמאות: גיל=8, סטודנט=false → 20 | גיל=25, סטודנט=true → 35 | גיל=30, סטודנט=false → 50',
    hintsHe: [
      "בדקו ילדים קודם (age < 12), אחר כך השתמשו ב-|| לבכירים או סטודנטים",
      'Boolean.parseBoolean(args[1]) ממיר מחרוזת "true"/"false" ל-boolean',
      "האופרטור || אומר שמספיק שאחד מהתנאים מתקיים כדי לקבל הנחה",
    ],
  },
  "complex-boolean-logic": {
    promptHe:
      'מה מדפיסה התוכנית הבאה?\n\n```java\npublic class Solution {\n    public static void main(String[] args) {\n        int x = 5, y = 10, z = 3;\n        boolean a = (x > 3) && (y < 15);\n        boolean b = !(z == 3);\n        boolean c = a || b;\n        boolean d = a && !b;\n        System.out.println(a);\n        System.out.println(b);\n        System.out.println(c);\n        System.out.println(d);\n    }\n}\n```\n\nכתבו את הפלט המדויק (4 שורות של true/false).\n\nרמז: חשבו כל ביטוי צעד אחר צעד — a = (5>3) && (10<15) = true && true = true, וכן הלאה.',
    hintsHe: [
      "a = (5 > 3) && (10 < 15) = true && true = true",
      "b = !(3 == 3) = !true = false",
      "c = true || false = true; d = true && !false = true && true = true",
    ],
  },

  // ==================== Day 3: Loops ====================

  // --- Basic Loops ---
  "sum-of-n-numbers": {
    promptHe:
      "קראו מספר שלם n מהקלט. הדפיסו את סכום כל המספרים השלמים מ-1 עד n (כולל).\n\nלדוגמה: עבור n = 5, הסכום הוא 1+2+3+4+5 = 15.\n\nהשתמשו בלולאת for כדי לצבור את הסכום.",
    hintsHe: [
      "הגדירו משתנה sum = 0 לפני הלולאה",
      "לולאה: for (int i = 1; i <= n; i++) ובתוכה sum += i",
      "הדפיסו את sum אחרי הלולאה",
    ],
  },
  factorial: {
    promptHe:
      "קראו מספר שלם לא-שלילי n מהקלט. הדפיסו את n! (n עצרת).\n\nתזכורת:\n• 0! = 1\n• 1! = 1\n• n! = 1 × 2 × 3 × ... × n (עבור n ≥ 2)\n\nלדוגמה: 5! = 1×2×3×4×5 = 120.",
    hintsHe: [
      "התחילו עם result = 1 (כי 0! = 1)",
      "לולאה: for (int i = 1; i <= n; i++) ובתוכה result *= i",
      "שימו לב: עבור מספרים גדולים עדיף long במקום int",
    ],
  },
  "count-digits": {
    promptHe:
      "קראו מספר שלם חיובי מהקלט. בעזרת לולאת while, ספרו והדפיסו את מספר הספרות שלו.\n\nלדוגמה: למספר 12345 יש 5 ספרות.\n\nרמז: חלקו את המספר ב-10 שוב ושוב עד שהוא מגיע ל-0, וספרו כמה פעמים חילקתם.",
    hintsHe: [
      "הגדירו מונה count = 0",
      "בלולאת while (n > 0): חלקו n /= 10 והגדילו את count",
      "זכרו שלמספר חד-ספרתי יש ספרה אחת בלבד",
    ],
  },
  "reverse-number": {
    promptHe:
      "קראו מספר שלם חיובי מהקלט. הדפיסו את המספר כשהספרות שלו הפוכות.\n\nלדוגמה:\n• קלט: 1234 → פלט: 4321\n• קלט: 1200 → פלט: 21 (אפסים מובילים נעלמים)\n\nרמז: חלצו ספרות באמצעות % 10 ובנו את המספר ההפוך.",
    hintsHe: [
      "השתמשו ב-n % 10 כדי לקבל את הספרה האחרונה",
      "בנו את המספר ההפוך: reversed = reversed * 10 + digit",
      "חלקו n /= 10 בכל צעד כדי להסיר את הספרה האחרונה",
    ],
  },

  // --- Nested Loops ---
  "right-triangle-stars": {
    promptHe:
      "קראו מספר שלם n מהקלט. הדפיסו משולש ישר-זווית מכוכביות (*) עם n שורות.\n\nבשורה i (מ-1) יש i כוכביות.\n\nלדוגמה עבור n = 4:\n*\n**\n***\n****",
    hintsHe: [
      "השתמשו בלולאה חיצונית for i מ-1 עד n",
      "בלולאה פנימית הדפיסו i כוכביות (בלי ירידת שורה)",
      "אחרי הלולאה הפנימית הדפיסו System.out.println() לירידת שורה",
    ],
  },
  "number-pyramid": {
    promptHe:
      "קראו מספר שלם n מהקלט. הדפיסו פירמידת מספרים בה שורה i מכילה את המספר i חוזר i פעמים, מופרד ברווחים.\n\nלדוגמה עבור n = 4:\n1\n2 2\n3 3 3\n4 4 4 4",
    hintsHe: [
      "השתמשו בלולאה חיצונית for i מ-1 עד n",
      "בלולאה פנימית הדפיסו את i מספר i פעמים עם רווח ביניהם",
      "שימו לב להפריד ברווח בין מספרים אבל לא בסוף השורה",
    ],
  },
  "multiplication-table": {
    promptHe:
      "קראו מספר שלם n מהקלט. הדפיסו לוח כפל בגודל n×n. הערכים בכל שורה מופרדים ב-tab (\\t).\n\nלדוגמה עבור n = 3:\n1\t2\t3\n2\t4\t6\n3\t6\t9\n\nהערך בעמודה j ושורה i הוא i × j.",
    hintsHe: [
      "שתי לולאות מקוננות: חיצונית i מ-1 עד n, פנימית j מ-1 עד n",
      'הדפיסו i * j ואחריו "\\t" (tab) — חוץ מהעמודה האחרונה',
      "ירידת שורה אחרי סיום כל שורה",
    ],
  },
  "diamond-pattern": {
    promptHe:
      "קראו מספר שלם אי-זוגי n מהקלט. הדפיסו דפוס יהלום מכוכביות (*) כאשר השורה הרחבה ביותר מכילה n כוכביות. השתמשו ברווחים ליישור.\n\nלדוגמה עבור n = 5:\n  *\n ***\n*****\n ***\n  *\n\nהיהלום מתרחב משורה 1 כוכבית עד n, ואז מתכווץ חזרה.",
    hintsHe: [
      "חלקו ל-2 חלקים: החצי העליון (כולל האמצע) והחצי התחתון",
      "בכל שורה: הדפיסו רווחים ואז כוכביות",
      "מספר הכוכביות: 1, 3, 5, ..., n, ..., 5, 3, 1",
    ],
  },

  // ==================== Day 4: Arrays ====================

  // --- 1D Arrays ---
  "array-sum-average": {
    promptHe:
      "קראו מספר שלם n, ואז קראו n מספרים שלמים למערך.\n\nהדפיסו בשורה הראשונה את הסכום ובשורה השנייה את הממוצע, מעוגל ל-2 ספרות עשרוניות.\n\nלדוגמה: עבור [10, 20, 30] — סכום: 60, ממוצע: 20.00",
    hintsHe: [
      "צרו מערך בגודל n וקראו ערכים בלולאה",
      "חשבו סכום בלולאה נוספת",
      "ממוצע = (double) sum / n — וודאו המרה ל-double!",
    ],
  },
  "find-max-min": {
    promptHe:
      "קראו מספר שלם n, ואז קראו n מספרים שלמים.\n\nהדפיסו את הערך המקסימלי בשורה הראשונה ואת הערך המינימלי בשורה השנייה.\n\nלדוגמה: עבור [3, 7, 1, 9, 2] — מקסימום: 9, מינימום: 1",
    hintsHe: [
      "אתחלו max ו-min לערך הראשון במערך",
      "עברו על שאר האיברים ועדכנו max ו-min בהתאם",
      "השתמשו ב-if: אם arr[i] > max אז max = arr[i], וכנ\"ל למינימום",
    ],
  },
  "linear-search": {
    promptHe:
      "קראו מספר שלם n, ואז קראו n מספרים שלמים למערך. לבסוף קראו מספר יעד (target).\n\nהדפיסו את האינדקס (מבוסס-0) של המופע הראשון של היעד במערך. אם היעד לא נמצא, הדפיסו -1.\n\nלדוגמה: עבור מערך [5, 3, 8, 3] ויעד 3 — הפלט: 1 (אינדקס המופע הראשון).",
    hintsHe: [
      "עברו על המערך בלולאה ובדקו אם arr[i] == target",
      "כשנמצא — הדפיסו i ועצרו (break)",
      "אם הלולאה נגמרה בלי למצוא — הדפיסו -1",
    ],
  },
  "reverse-array": {
    promptHe:
      "קראו מספר שלם n, ואז קראו n מספרים שלמים למערך. הפכו את המערך במקום (in-place) והדפיסו את כל האיברים מופרדים ברווחים בשורה אחת.\n\nלדוגמה: עבור [1, 2, 3, 4, 5] — הפלט: 5 4 3 2 1",
    hintsHe: [
      "השתמשו בשני מצביעים: אחד מההתחלה ואחד מהסוף",
      "החליפו arr[left] ו-arr[right] וקדמו את שניהם פנימה",
      "המשיכו עד ש-left >= right",
    ],
  },
  "count-occurrences": {
    promptHe:
      "כתבו מתודה countOccurrences שמקבלת מערך של מספרים שלמים וערך יעד, ומחזירה את מספר הפעמים שהיעד מופיע במערך.\n\nב-main: קראו n, אז n מספרים שלמים, ואז ערך יעד. קראו למתודה והדפיסו את הספירה.\n\nלדוגמה: עבור מערך [1, 3, 5, 3, 3] ויעד 3 — הפלט: 3",
    hintsHe: [
      "הגדירו מונה count = 0 בתוך המתודה",
      "עברו על כל איבר במערך ואם שווה ליעד — הגדילו count",
      "החזירו return count בסוף המתודה",
    ],
  },

  // --- 2D Arrays ---
  "matrix-input-output": {
    promptHe:
      "קראו שני מספרים שלמים rows ו-cols, ואז קראו מטריצה של מספרים שלמים בגודל rows × cols.\n\nהדפיסו את המטריצה באותו פורמט: כל שורה בשורה נפרדת, ערכים מופרדים ברווחים.\n\nלדוגמה:\nקלט: 2 3, ואז 1 2 3 / 4 5 6\nפלט:\n1 2 3\n4 5 6",
    hintsHe: [
      "צרו מערך דו-ממדי: int[][] matrix = new int[rows][cols]",
      "השתמשו בשתי לולאות מקוננות לקריאה ושתי לולאות להדפסה",
      "הדפיסו רווח בין ערכים (אבל לא בסוף השורה) וירידת שורה בסוף כל שורה",
    ],
  },
  "row-sums": {
    promptHe:
      "קראו שני מספרים שלמים rows ו-cols, ואז קראו מטריצה בגודל rows × cols.\n\nלכל שורה, הדפיסו את סכום האיברים שלה. הדפיסו סכום אחד לכל שורה.\n\nלדוגמה:\nעבור מטריצה:\n1 2 3\n4 5 6\nהפלט:\n6\n15",
    hintsHe: [
      "עברו שורה-שורה ולכל שורה חשבו סכום בלולאה פנימית",
      "אפסו את הסכום בתחילת כל שורה",
      "הדפיסו את הסכום אחרי סיום כל שורה",
    ],
  },
  "matrix-diagonal-sum": {
    promptHe:
      "קראו מספר שלם n, ואז קראו מטריצה ריבועית n × n.\n\nהדפיסו בשורה הראשונה את סכום האלכסון הראשי (מלמעלה-שמאל ללמטה-ימין), ובשורה השנייה את סכום האלכסון המשני (מלמעלה-ימין ללמטה-שמאל).\n\nלדוגמה: עבור מטריצה 3×3:\n1 2 3\n4 5 6\n7 8 9\nאלכסון ראשי: 1 + 5 + 9 = 15\nאלכסון משני: 3 + 5 + 7 = 15",
    hintsHe: [
      "אלכסון ראשי: matrix[i][i] — אותו אינדקס לשורה ועמודה",
      "אלכסון משני: matrix[i][n-1-i]",
      "עברו בלולאה אחת מ-0 עד n-1 וצברו שני סכומים",
    ],
  },
  "matrix-transpose": {
    promptHe:
      "קראו שני מספרים שלמים rows ו-cols, ואז קראו מטריצה בגודל rows × cols.\n\nהדפיסו את השחלוף (transpose) של המטריצה — כלומר מטריצה בגודל cols × rows, שבה שורות הופכות לעמודות ועמודות לשורות.\n\nלדוגמה:\nקלט:\n2 3\n1 2 3\n4 5 6\nפלט:\n1 4\n2 5\n3 6",
    hintsHe: [
      "צרו מטריצה חדשה בגודל cols × rows",
      "transpose[j][i] = matrix[i][j]",
      "הדפיסו את המטריצה החדשה שורה-שורה",
    ],
  },

  // ==================== Day 5: Methods ====================

  // --- Method Basics ---
  "print-greeting-method": {
    promptHe:
      'כתבו מתודת void בשם printGreeting שמקבלת String name ו-int times, ומדפיסה "Hello, <name>!" בדיוק times פעמים — כל פעם בשורה נפרדת.\n\nב-main: קראו שם ומספר פעמים מהקלט וקראו למתודה.',
    hintsHe: [
      "הגדירו: static void printGreeting(String name, int times)",
      "בתוך המתודה השתמשו בלולאה שרצה times פעמים",
      'בכל איטרציה הדפיסו "Hello, " + name + "!"',
    ],
  },
  "print-separator-line": {
    promptHe:
      'כתבו מתודת void בשם printSeparator שמקבלת char symbol ו-int length, ומדפיסה את התו חוזר length פעמים בשורה אחת.\n\nב-main: קראו תו ואורך מהקלט. קראו למתודה כדי להדפיס מפריד, אז הדפיסו "SECTION", ואז קראו שוב למתודה.\n\nלדוגמה: עבור תו \'=\' ואורך 5, הפלט:\n=====\nSECTION\n=====',
    hintsHe: [
      "השתמשו בלולאה שמדפיסה את symbol מספר length פעמים",
      "אחרי הלולאה הדפיסו System.out.println() לירידת שורה",
      "ב-main: קראו char עם sc.next().charAt(0)",
    ],
  },
  "print-array-stats": {
    promptHe:
      'כתבו שתי מתודות void:\n\n1. printArray(int[] arr) — מדפיסה את כל איברי המערך מופרדים ברווחים בשורה אחת\n\n2. printStats(int[] arr) — מדפיסה שלוש שורות:\n   • "Min: <ערך מינימלי>"\n   • "Max: <ערך מקסימלי>"\n   • "Sum: <סכום כל האיברים>"\n\nב-main: קראו n מספרים שלמים וקראו לשתי המתודות.',
    hintsHe: [
      "printArray: לולאה שמדפיסה כל איבר עם רווח",
      "printStats: חשבו min, max, sum בלולאה אחת",
      "אתחלו min ו-max לערך הראשון: arr[0]",
    ],
  },
  "validate-and-print": {
    promptHe:
      'כתבו מתודה boolean isValidScore(int score) שמחזירה true אם הציון בין 0 ל-100 (כולל).\n\nב-main: קראו מספר ניסיונות n בשורה הראשונה, ו-n מספרים שלמים בשורה השנייה. לכל ניסיון — אם הציון לא תקין הדפיסו "Invalid", ואם תקין הדפיסו "Valid: <ציון>" ועצרו.\n\nאם לא נמצא ציון תקין, הדפיסו "No valid score".',
    hintsHe: [
      "המתודה מחזירה score >= 0 && score <= 100",
      "עברו על הציונים בלולאה, וכשנמצא תקין — הדפיסו ועשו break",
      "השתמשו בדגל (flag) כדי לדעת אם נמצא ציון תקין",
    ],
  },

  // --- Return Values & Scope ---
  "is-prime-method": {
    promptHe:
      "כתבו מתודה boolean isPrime(int n) שמחזירה true אם n הוא מספר ראשוני ו-false אחרת.\n\nמספר ראשוני הוא מספר גדול מ-1 שמתחלק רק ב-1 ובעצמו.\n\nב-main: קראו מספר שלם אחד והדפיסו \"Prime\" או \"Not prime\" בעזרת המתודה.\n\nלדוגמה: 7 → Prime, 4 → Not prime, 1 → Not prime.",
    hintsHe: [
      "אם n <= 1, החזירו false",
      "בדקו חלוקה מ-2 עד שורש n: for (int i = 2; i * i <= n; i++)",
      "אם n % i == 0 לאיזה i, המספר לא ראשוני",
    ],
  },
  "max-of-three-overloaded": {
    promptHe:
      "כתבו שתי מתודות עמוסות (overloaded):\n\n1. int maxOf(int a, int b) — מחזירה את הגדול מבין שני מספרים\n2. int maxOf(int a, int b, int c) — מחזירה את הגדול מבין שלושה מספרים\n\nב-main: קראו שלושה מספרים שלמים. הדפיסו בשורה 1 את המקסימום של שני הראשונים, ובשורה 2 את המקסימום של כל השלושה.",
    hintsHe: [
      "עמיסה: שתי מתודות באותו שם אבל מספר פרמטרים שונה",
      "maxOf(a, b): החזירו a > b ? a : b",
      "maxOf(a, b, c): אפשר להשתמש ב-maxOf(maxOf(a, b), c)",
    ],
  },
  "power-function": {
    promptHe:
      "כתבו מתודה long power(int base, int exp) שמחשבת בסיס בחזקת מעריך באמצעות לולאה (אל תשתמשו ב-Math.pow).\n\nהמתודה מחזירה את התוצאה כ-long.\n\nב-main: קראו base ו-exp מהקלט והדפיסו את התוצאה.\n\nלדוגמה: power(2, 10) = 1024.",
    hintsHe: [
      "התחילו עם result = 1",
      "הכפילו ב-base מספר exp פעמים: result *= base",
      "השתמשו ב-long כי חזקות יכולות להיות מספרים גדולים",
    ],
  },
  "gcd-method": {
    promptHe:
      "כתבו מתודה int gcd(int a, int b) שמחזירה את המחלק המשותף הגדול ביותר של שני מספרים חיוביים, באמצעות האלגוריתם של אוקלידס.\n\nאלגוריתם אוקלידס: gcd(a, b) = gcd(b, a % b), עם מקרה בסיס gcd(a, 0) = a.\n\nב-main: קראו שני מספרים שלמים והדפיסו את ה-GCD שלהם.\n\nלדוגמה: gcd(12, 8) = 4.",
    hintsHe: [
      "מקרה בסיס: אם b == 0, החזירו a",
      "קריאה רקורסיבית: return gcd(b, a % b)",
      "אפשר גם לולאת while: כל עוד b != 0, החליפו a = b, b = temp",
    ],
  },

  // ==================== Day 6: Recursion ====================

  // --- Recursion Basics ---
  "recursive-factorial": {
    promptHe:
      "כתבו מתודה רקורסיבית long factorial(int n) שמחזירה n! (n עצרת).\n\nתזכורת:\n• 0! = 1 (מקרה בסיס)\n• n! = n × (n-1)! עבור n ≥ 1 (קריאה רקורסיבית)\n\nב-main: קראו מספר שלם והדפיסו את העצרת שלו.\n\nלדוגמה: factorial(5) = 5 × 4 × 3 × 2 × 1 = 120.",
    hintsHe: [
      "מקרה בסיס: if (n == 0) return 1",
      "קריאה רקורסיבית: return n * factorial(n - 1)",
      "השתמשו ב-long כי עצרת גדלה מהר מאוד",
    ],
  },
  "recursive-sum-to-n": {
    promptHe:
      "כתבו מתודה רקורסיבית int sumToN(int n) שמחזירה את סכום כל המספרים מ-1 עד n.\n\nמקרה בסיס: sumToN(0) = 0\nקריאה רקורסיבית: sumToN(n) = n + sumToN(n - 1)\n\nב-main: קראו מספר שלם והדפיסו את הסכום.\n\nלדוגמה: sumToN(4) = 4 + 3 + 2 + 1 + 0 = 10.",
    hintsHe: [
      "מקרה בסיס: if (n == 0) return 0",
      "קריאה רקורסיבית: return n + sumToN(n - 1)",
      "עקבו אחרי הקריאות: sumToN(3) = 3 + sumToN(2) = 3 + 2 + sumToN(1) = ...",
    ],
  },
  "recursive-power": {
    promptHe:
      "כתבו מתודה רקורסיבית long power(int base, int exp) שמחשבת בסיס בחזקת מעריך.\n\nמקרה בסיס: power(base, 0) = 1\nקריאה רקורסיבית: power(base, exp) = base × power(base, exp - 1)\n\nב-main: קראו base ו-exp והדפיסו את התוצאה.\n\nלדוגמה: power(3, 4) = 3 × 3 × 3 × 3 = 81.",
    hintsHe: [
      "מקרה בסיס: if (exp == 0) return 1",
      "קריאה רקורסיבית: return base * power(base, exp - 1)",
      "כל קריאה מקטינה את exp ב-1 עד שהוא מגיע ל-0",
    ],
  },
  "recursive-countdown": {
    promptHe:
      'כתבו מתודה רקורסיבית void countdown(int n) שמדפיסה ספירה לאחור מ-n עד 1, כל מספר בשורה נפרדת, ואחריה "Go!" בשורה האחרונה.\n\nלדוגמה עבור n = 3:\n3\n2\n1\nGo!',
    hintsHe: [
      'מקרה בסיס: if (n == 0) הדפיסו "Go!" וחזרו',
      "קריאה רקורסיבית: הדפיסו n ואז קראו ל-countdown(n - 1)",
      "שימו לב: ההדפסה של n היא לפני הקריאה הרקורסיבית",
    ],
  },

  // --- Recursion with Strings ---
  "recursive-reverse-string": {
    promptHe:
      "כתבו מתודה רקורסיבית String reverseString(String s) שמחזירה את ההיפוך של המחרוזת.\n\nmקרה בסיס: אם המחרוזת ריקה או בעלת תו אחד — החזירו אותה כמו שהיא.\nקריאה רקורסיבית: קחו את התו האחרון + reverseString(שאר המחרוזת)\n\nב-main: קראו מילה אחת והדפיסו את ההיפוך שלה.\n\nלדוגמה: \"hello\" → \"olleh\".",
    hintsHe: [
      "מקרה בסיס: if (s.length() <= 1) return s",
      "תו אחרון: s.charAt(s.length() - 1)",
      "שאר המחרוזת: s.substring(0, s.length() - 1)",
    ],
  },
  "recursive-palindrome-check": {
    promptHe:
      'כתבו מתודה רקורסיבית boolean isPalindrome(String s) שמחזירה true אם המחרוזת היא פלינדרום (נקראת אותו דבר קדימה ואחורה), ו-false אחרת. הבדיקה רגישה לאותיות גדולות/קטנות.\n\nב-main: קראו מילה אחת והדפיסו "Palindrome" או "Not palindrome".\n\nלדוגמה: "racecar" → Palindrome, "hello" → Not palindrome.',
    hintsHe: [
      "מקרה בסיס: אם אורך <= 1, החזירו true",
      "בדקו אם התו הראשון שווה לאחרון: s.charAt(0) == s.charAt(s.length()-1)",
      "אם שווים — המשיכו רקורסיבית על s.substring(1, s.length()-1)",
    ],
  },
  "recursive-array-sum": {
    promptHe:
      "כתבו מתודה רקורסיבית int arraySum(int[] arr, int index) שמחזירה את סכום כל האיברים במערך, החל מהאינדקס הנתון.\n\nמקרה בסיס: אם index שווה לאורך המערך — החזירו 0.\nקריאה רקורסיבית: arr[index] + arraySum(arr, index + 1)\n\nב-main: קראו n מספרים שלמים למערך והדפיסו את סכומם.\n\nלדוגמה: עבור [3, 5, 2] — arraySum([3,5,2], 0) = 3 + 5 + 2 = 10.",
    hintsHe: [
      "מקרה בסיס: if (index == arr.length) return 0",
      "קריאה רקורסיבית: return arr[index] + arraySum(arr, index + 1)",
      "הקריאה הראשונה מ-main היא arraySum(arr, 0)",
    ],
  },
  "recursive-count-occurrences": {
    promptHe:
      "כתבו מתודה רקורסיבית int countOccurrences(String s, char c) שמחזירה את מספר הפעמים שהתו c מופיע במחרוזת s.\n\nמקרה בסיס: אם המחרוזת ריקה — החזירו 0.\nקריאה רקורסיבית: בדקו את התו הראשון ואז המשיכו רקורסיבית על השאר.\n\nב-main: קראו מילה ותו, והדפיסו את הספירה.\n\nלדוגמה: countOccurrences(\"hello\", 'l') = 2.",
    hintsHe: [
      "מקרה בסיס: if (s.isEmpty()) return 0",
      "בדקו s.charAt(0) == c — אם כן, הוסיפו 1",
      "קריאה רקורסיבית על s.substring(1)",
    ],
  },

  // ==================== Day 7: OOP Basics ====================

  // --- Classes & Objects ---
  "define-a-class": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית בשם Dog עם שני שדות: String name ו-int age. הוסיפו בנאי (constructor) שמקבל את שני הפרמטרים.\n\nב-main: קראו שם וגיל מהקלט, צרו אובייקט Dog, והדפיסו:\nName: <שם>\nAge: <גיל>',
    hintsHe: [
      "הגדירו: static class Dog { String name; int age; ... }",
      "בנאי: Dog(String name, int age) { this.name = name; this.age = age; }",
      "גישה לשדות: dog.name, dog.age",
    ],
  },
  "constructor-with-defaults": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Rectangle עם שדות int width ו-int height.\n\nספקו שני בנאים:\n1. Rectangle(int width, int height) — מגדיר את שני השדות\n2. Rectangle(int side) — יוצר ריבוע (מגדיר width ו-height לאותו ערך)\n\nב-main: קראו שני מספרים שלמים. אם הם זהים — צרו Rectangle עם בנאי הפרמטר היחיד. אם שונים — השתמשו בבנאי שני הפרמטרים.\n\nהדפיסו:\nWidth: <רוחב>\nHeight: <גובה>\nArea: <שטח>',
    hintsHe: [
      "שני בנאים = עמיסת בנאי (constructor overloading)",
      "בנאי הריבוע: Rectangle(int side) { this.width = side; this.height = side; }",
      "שטח = width * height",
    ],
  },
  "tostring-method": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Student עם שדות String name ו-int grade.\n\nדרסו (override) את מתודת toString() כך שתחזיר: "Student{name=\'<שם>\', grade=<ציון>}"\n\nב-main: קראו שם וציון מהקלט, צרו Student, והדפיסו אותו באמצעות System.out.println (שקורא ל-toString אוטומטית).',
    hintsHe: [
      "דרסו: public String toString() { return ... }",
      'השתמשו בשרשור: "Student{name=\'" + name + "\', grade=" + grade + "}"',
      "System.out.println(obj) קורא ל-toString() באופן אוטומטי",
    ],
  },
  "getter-methods": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית BankAccount עם שדה פרטי double balance. הבנאי מקבל יתרה התחלתית. הוסיפו:\n\n• double getBalance() — מחזיר את היתרה\n• void deposit(double amount) — מוסיף ליתרה\n• void withdraw(double amount) — מחסיר מהיתרה (רק אם יש מספיק כסף)\n\nב-main: קראו יתרה התחלתית, ואז n פעולות. כל פעולה היא "deposit <סכום>" או "withdraw <סכום>". אחרי כל הפעולות, הדפיסו את היתרה הסופית מעוגלת ל-2 ספרות עשרוניות.',
    hintsHe: [
      "שדה פרטי: private double balance",
      "ב-withdraw: בדקו if (amount <= balance) לפני החיסור",
      'פלט: System.out.printf("%.2f%n", account.getBalance())',
    ],
  },
  "create-instances-array": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Point עם שדות int x ו-int y ובנאי.\n\nב-main: קראו מספר n, ואז n זוגות מספרים שלמים. צרו מערך של אובייקטי Point. הדפיסו כל נקודה בפורמט "(<x>, <y>)" — אחת לכל שורה.\n\nלבסוף, מצאו את הנקודה הרחוקה ביותר מראשית הצירים (0,0) והדפיסו:\n"Farthest: (<x>, <y>)"\n\nנוסחת מרחק: distance = sqrt(x² + y²). אם יש שוויון — הדפיסו את הראשונה שנמצאה.',
    hintsHe: [
      "צרו מערך: Point[] points = new Point[n]",
      "מרחק: Math.sqrt(p.x * p.x + p.y * p.y)",
      "עברו על המערך ועקבו אחרי הנקודה עם המרחק הגדול ביותר",
    ],
  },

  // --- Instance Methods ---
  "methods-modify-state": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Counter עם שדה פרטי int count מאותחל ל-0.\n\nהוסיפו מתודות:\n• void increment() — מגדיל את count ב-1\n• void decrement() — מקטין את count ב-1 (מינימום 0)\n• int getCount() — מחזיר את ה-count הנוכחי\n\nב-main: קראו n פעולות. כל פעולה היא "inc" או "dec". אחרי כל הפעולות, הדפיסו את הספירה הסופית.',
    hintsHe: [
      "ב-decrement: בדקו if (count > 0) לפני ההקטנה",
      'השתמשו ב-equals() להשוואת מחרוזות: op.equals("inc")',
      "הדפיסו counter.getCount() בסוף",
    ],
  },
  "method-chaining-concept": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית TextBuilder עם שדה פרטי String text מאותחל למחרוזת ריקה.\n\nהוסיפו מתודות:\n• void append(String s) — מוסיף s לסוף הטקסט\n• void prepend(String s) — מוסיף s לפני הטקסט\n• String getText() — מחזיר את הטקסט הנוכחי\n\nב-main: קראו n פעולות. כל פעולה היא "append <מילה>" או "prepend <מילה>". אחרי כל הפעולות, הדפיסו את הטקסט הסופי.',
    hintsHe: [
      "append: text = text + s (או text += s)",
      "prepend: text = s + text",
      "השתמשו ב-sc.next() לקריאת סוג הפעולה ואז שוב ב-sc.next() למילה",
    ],
  },
  "equals-method": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Fraction עם שדות int numerator (מונה) ו-int denominator (מכנה).\n\nהוסיפו מתודה boolean equals(Fraction other) שמחזירה true אם שני השברים שווים מתמטית (מייצגים את אותו ערך). להשוואה, השתמשו בכפל צולב: a/b == c/d כאשר a*d == b*c.\n\nב-main: קראו ארבעה מספרים שלמים (מונה1, מכנה1, מונה2, מכנה2) והדפיסו "Equal" או "Not equal".\n\nלדוגמה: 1/2 ו-2/4 הם Equal (כי 1×4 == 2×2).',
    hintsHe: [
      "כפל צולב: this.numerator * other.denominator == other.numerator * this.denominator",
      "לא צריך לצמצם שברים — כפל צולב עובד ישירות",
      "הגדירו בנאי שמקבל מונה ומכנה",
    ],
  },
  "multiple-objects-interaction": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Player עם שדות String name ו-int score (מתחיל ב-0).\n\nהוסיפו מתודות:\n• void addScore(int points) — מוסיף נקודות\n• String getName() — מחזיר את השם\n• int getScore() — מחזיר את הניקוד\n\nב-main: קראו שני שמות שחקנים. אז קראו n אירועים, כל אחד בפורמט "<1 או 2> <נקודות>" (1 = שחקן ראשון קיבל נקודות, 2 = שני).\n\nאחרי כל האירועים הדפיסו:\n<שם1>: <ניקוד1>\n<שם2>: <ניקוד2>\nWinner: <שם המנצח>\n\nאם תיקו, הדפיסו "Winner: Tie".',
    hintsHe: [
      "צרו שני אובייקטי Player",
      "בלולאה: אם playerNum == 1 הוסיפו לראשון, אחרת לשני",
      "בסוף: השוו getScore() של שניהם כדי לקבוע מנצח",
    ],
  },

  // ==================== Day 8: OOP Advanced ====================

  // --- Encapsulation ---
  "private-fields-getters-setters": {
    promptHe:
      "הגדירו מחלקה פנימית סטטית Temperature עם שדה פרטי double celsius.\n\nספקו:\n• בנאי שמקבל celsius\n• double getCelsius() — מחזיר את הטמפרטורה בצלזיוס\n• double getFahrenheit() — מחזיר את הטמפרטורה בפרנהייט (נוסחה: C × 9/5 + 32)\n• void setCelsius(double c) — מעדכן את ערך הצלזיוס\n\nב-main: קראו טמפרטורה בצלזיוס. הדפיסו ערך צלזיוס ואז פרנהייט (שניהם ל-1 ספרה עשרונית). אז קראו טמפרטורה שנייה, עדכנו את האובייקט, והדפיסו שוב.\n\nלדוגמה: 100°C = 212.0°F.",
    hintsHe: [
      "נוסחת המרה: celsius * 9.0 / 5.0 + 32",
      "השתמשו ב-printf(\"%.1f\") להצגת ספרה עשרונית אחת",
      "setCelsius מעדכן את השדה הפרטי — אחר כך getFahrenheit יחזיר את הערך החדש",
    ],
  },
  "validation-in-setters": {
    promptHe:
      "הגדירו מחלקה פנימית סטטית Age עם שדה פרטי int value.\n\nהבנאי וה-setter צריכים לבדוק שהגיל בין 0 ל-150 (כולל). אם הערך לא תקין:\n• הבנאי מאתחל ל-0\n• ה-setter מתעלם מהערך החדש (שומר על הישן)\n\nספקו: בנאי, int getValue(), void setValue(int v), ו-boolean isValid(int v) (עוזרת פרטית).\n\nב-main: קראו גיל התחלתי, אז n ניסיונות עדכון. לכל ניסיון, קראו ל-setValue. אחרי הכל, הדפיסו את הערך הסופי.",
    hintsHe: [
      "isValid: return v >= 0 && v <= 150",
      "בבנאי: this.value = isValid(v) ? v : 0",
      "ב-setter: if (isValid(v)) this.value = v — אחרת לא עושים כלום",
    ],
  },
  "immutable-class": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית ImmutablePoint שמייצגת נקודה דו-ממדית שלא ניתנת לשינוי (immutable). ברגע שנוצרת — הקואורדינטות שלה לא משתנות.\n\nספקו:\n• בנאי ImmutablePoint(int x, int y)\n• int getX() ו-int getY() — getters\n• ImmutablePoint translate(int dx, int dy) — מחזיר נקודה חדשה מוזזת ב-(dx, dy) בלי לשנות את המקורית\n• String toString() — מחזיר "(<x>, <y>)"\n\nב-main: קראו x, y, dx, dy. צרו נקודה, הזזו אותה, והדפיסו את שתי הנקודות (מקורית ומוזזת).',
    hintsHe: [
      "השתמשו ב-private final int x, y — final מונע שינוי",
      "translate מחזירה new ImmutablePoint(this.x + dx, this.y + dy)",
      "המקורית לא משתנה — זה הרעיון של immutable",
    ],
  },
  "encapsulation-full-class": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Student עם שדות פרטיים: String name, int[] grades (עד 10 ציונים), ו-int gradeCount.\n\nספקו:\n• בנאי שמקבל רק שם (ציונים מתחילים ריקים)\n• void addGrade(int grade) — מוסיף ציון (רק אם count < 10 וציון בטווח 0-100)\n• double getAverage() — מחזיר ממוצע (0.0 אם אין ציונים)\n• int getHighest() — מחזיר ציון גבוה ביותר (0 אם אין)\n• String getName()\n\nב-main: קראו שם סטודנט, אז n ציונים. הוסיפו כל ציון. הדפיסו:\n<שם>\nAverage: <ממוצע ל-1 ספרה>\nHighest: <גבוה ביותר>',
    hintsHe: [
      "אתחלו: grades = new int[10], gradeCount = 0",
      "ב-addGrade: בדקו gradeCount < 10 && grade >= 0 && grade <= 100",
      "getAverage: סכמו וחלקו ב-gradeCount (בדקו חילוק באפס)",
    ],
  },

  // --- Class Design ---
  "composition-pattern": {
    promptHe:
      'הגדירו שתי מחלקות פנימיות סטטיות:\n\nAddress — עם שדות: String street, String city. בנאי ו-toString() שמחזיר "<רחוב>, <עיר>".\n\nPerson — עם שדות: String name, Address address. בנאי ו-toString() שמחזיר "<שם> lives at <כתובת>".\n\nב-main: קראו שם, רחוב ועיר (כל אחד בשורה נפרדת). צרו Person עם Address והדפיסו את ה-Person.\n\nזהו דפוס הרכבה (composition) — Person מכיל Address כשדה.',
    hintsHe: [
      "הרכבה: Person מכיל אובייקט Address כשדה",
      "Person.toString קורא ל-address.toString() אוטומטית בשרשור",
      "צרו קודם Address ואז Person שמקבל את ה-Address בבנאי",
    ],
  },
  "static-methods-class": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית MathUtils עם מתודות סטטיות בלבד (בלי שדות מופע או בנאי):\n\n• static int max(int a, int b) — מחזיר את הגדול\n• static int min(int a, int b) — מחזיר את הקטן\n• static int clamp(int value, int low, int high) — מחזיר value מוגבל לטווח [low, high]\n\nב-main: קראו שלושה מספרים: value, low, high. הדפיסו:\nMax of low and high: <תוצאה>\nMin of low and high: <תוצאה>\nClamped value: <תוצאה>',
    hintsHe: [
      "clamp: אם value < low החזירו low, אם value > high החזירו high, אחרת value",
      "אפשר: return Math.max(low, Math.min(high, value)) — אבל כתבו בעצמכם",
      "מתודות סטטיות נקראות דרך שם המחלקה: MathUtils.max(a, b)",
    ],
  },
  "static-counter": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Ticket עם:\n• שדה סטטי int nextId שמתחיל מ-1\n• שדה סטטי int totalTickets שמתחיל מ-0\n• שדות מופע: int id, String event\n• בנאי שמקבל שם אירוע, מקצה id אוטומטית (nextId), ומגדיל את שני המונים\n• static int getTotalTickets() — מחזיר כמה כרטיסים נוצרו\n• String toString() — מחזיר "Ticket #<id>: <event>"\n\nב-main: קראו n שמות אירועים (אחד לכל שורה). צרו Ticket לכל אחד. הדפיסו כל כרטיס, ואז "Total tickets: <מספר>".',
    hintsHe: [
      "שדה סטטי שייך למחלקה — משותף לכל האובייקטים",
      "בבנאי: this.id = nextId++; totalTickets++",
      "getTotalTickets הוא static — נקרא דרך Ticket.getTotalTickets()",
    ],
  },
  "builder-like-pattern": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Pizza עם שדות: String size, boolean cheese, boolean pepperoni, boolean mushrooms.\n\nהגדירו מחלקה פנימית סטטית PizzaBuilder עם אותם שדות (ברירת מחדל: "Medium", true, false, false) ומתודות:\n• PizzaBuilder setSize(String s) — מגדיר גודל, מחזיר this\n• PizzaBuilder addPepperoni() — מפעיל pepperoni, מחזיר this\n• PizzaBuilder addMushrooms() — מפעיל mushrooms, מחזיר this\n• PizzaBuilder removeCheese() — מבטל cheese, מחזיר this\n• Pizza build() — יוצר ומחזיר Pizza עם ההגדרות הנוכחיות\n\nל-Pizza יש toString שמדפיס: "<size> Pizza: [תוספות]" — רשימת תוספות מופרדות בפסיקים מתוך {cheese, pepperoni, mushrooms} שהן true.\n\nב-main: קראו גודל, ואז תוספות בשורה אחת (מופרדות בפסיקים, למשל: "pepperoni,mushrooms"). בנו והדפיסו את הפיצה.',
    hintsHe: [
      "דפוס Builder: כל setter מחזיר this כדי לאפשר שרשור קריאות",
      'toString: בנו רשימה של תוספות שהן true, חברו עם ", "',
      'ב-main: פצלו תוספות עם split(",") והפעילו מתודות בהתאם',
    ],
  },

  // ==================== Day 9: Inheritance & Polymorphism ====================

  // --- Inheritance ---
  "basic-extends": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Animal עם שדה String name ומתודה String speak() שמחזירה "...".\n\nהגדירו מחלקה Dog שיורשת מ-Animal. דרסו את speak() כך שיחזיר "Woof!".\n\nהגדירו מחלקה Cat שיורשת מ-Animal. דרסו את speak() כך שיחזיר "Meow!".\n\nב-main: קראו סוג ("dog" או "cat") ושם. צרו את האובייקט המתאים והדפיסו:\n<שם> says <תוצאת speak()>',
    hintsHe: [
      "ירושה: class Dog extends Animal { ... }",
      "דריסה: @Override String speak() { return \"Woof!\"; }",
      "פולימורפיזם: Animal animal = new Dog(name) — ואז animal.speak() מחזיר Woof!",
    ],
  },
  "super-constructor": {
    promptHe:
      'הגדירו מחלקה פנימית סטטית Vehicle עם שדות String make ו-int year, בנאי, ומתודה String info() שמחזירה "<year> <make>".\n\nהגדירו מחלקה Car שיורשת מ-Vehicle ומוסיפה שדה int doors. הבנאי שלה מקבל make, year, doors (וקורא ל-super עבור השניים הראשונים). דרסו info() כך שיחזיר "<year> <make> (<doors>-door)".\n\nב-main: קראו make, year, doors. צרו Car והדפיסו את info() שלו.',
    hintsHe: [
      "בבנאי של Car: super(make, year) ואז this.doors = doors",
      "super() חייב להיות השורה הראשונה בבנאי",
      "דרסו info() כדי להוסיף את מספר הדלתות",
    ],
  },
  "override-tostring": {
    promptHe:
      'הגדירו מחלקה Shape עם מתודה String getType() שמחזירה "Shape" ו-toString() שמחזיר "Type: <getType()>".\n\nהגדירו Circle שיורש מ-Shape עם שדה double radius. דרסו getType() להחזיר "Circle". הוסיפו double area() שמחזיר PI×r². דרסו toString() להחזיר "Type: Circle, Radius: <r>, Area: <area>" (area ל-2 ספרות).\n\nהגדירו Square שיורש מ-Shape עם שדה double side. דומה ל-Circle אבל עם side² ו-"Type: Square, Side: <s>, Area: <area>".\n\nב-main: קראו סוג ("circle" או "square") ומידה. צרו והדפיסו.',
    hintsHe: [
      "toString() יכולה לקרוא ל-getType() — כך הפולימורפיזם עובד",
      "שטח עיגול: Math.PI * radius * radius",
      'השתמשו ב-String.format("%.2f", area()) לעיגול ל-2 ספרות',
    ],
  },
  "override-method-behavior": {
    promptHe:
      'הגדירו מחלקה Employee עם שדות String name ו-double baseSalary. הוסיפו מתודה double calculatePay() שמחזירה baseSalary.\n\nהגדירו Manager שיורש מ-Employee עם שדה נוסף double bonus. דרסו calculatePay() להחזיר baseSalary + bonus.\n\nהגדירו Intern שיורש מ-Employee. דרסו calculatePay() להחזיר baseSalary × 0.5 (מתמחים מקבלים חצי משכורת).\n\nב-main: קראו תפקיד ("employee", "manager", או "intern"), שם, משכורת בסיס, ואם manager — גם בונוס. הדפיסו "<שם>: $<pay>" (pay ל-2 ספרות).',
    hintsHe: [
      "Manager ו-Intern שניהם extends Employee",
      "בנאי Manager: super(name, baseSalary) ואז this.bonus = bonus",
      "דריסת calculatePay() ב-Intern: return baseSalary * 0.5",
    ],
  },
  "multi-level-inheritance": {
    promptHe:
      'צרו היררכיית ירושה בת 3 רמות:\n\n1. LivingThing — מתודה String describe() שמחזירה "I am alive"\n2. Animal יורש מ-LivingThing — מוסיף שדה String species, דורס describe() להחזיר "I am a <species>"\n3. Pet יורש מ-Animal — מוסיף שדה String ownerName, דורס describe() להחזיר "I am a <species> owned by <ownerName>"\n\nב-main: קראו species ו-ownerName. צרו Pet והדפיסו describe(). אז צרו Animal עם אותו species והדפיסו describe(). אז צרו LivingThing והדפיסו describe().',
    hintsHe: [
      "ירושה רב-רמתית: Pet extends Animal extends LivingThing",
      "כל רמה דורסת describe() עם מידע ספציפי יותר",
      "Pet יכול לגשת ל-species דרך ירושה מ-Animal",
    ],
  },

  // --- Polymorphism ---
  "abstract-class": {
    promptHe:
      'הגדירו מחלקה אבסטרקטית Shape עם מתודה אבסטרקטית double area() ומתודה רגילה String describe() שמחזירה "Area: <area>" מעוגל ל-2 ספרות.\n\nהגדירו Rectangle שיורש מ-Shape עם double width ו-double height. מממש area() כ-width × height.\n\nהגדירו Triangle שיורש מ-Shape עם double base ו-double height. מממש area() כ-0.5 × base × height.\n\nב-main: קראו סוג צורה ("rectangle" או "triangle") והמידות. צרו את האובייקט והדפיסו describe().',
    hintsHe: [
      "מחלקה אבסטרקטית: abstract class Shape { abstract double area(); }",
      "describe() רגילה שמשתמשת ב-area() — פולימורפיזם!",
      "אי אפשר ליצור new Shape() — רק תת-מחלקות",
    ],
  },
  "polymorphic-array": {
    promptHe:
      'השתמשו באותה היררכיה Shape/Rectangle/Triangle (הגדירו אותם שוב):\n\nב-main: קראו n. אז קראו n צורות, כל אחת בשורה: "rectangle <w> <h>" או "triangle <b> <h>". שמרו את כולן במערך Shape[].\n\nהדפיסו את שטח כל צורה (ל-2 ספרות עשרוניות) בשורה נפרדת. בשורה האחרונה הדפיסו: "Total: <סכום>" (גם ל-2 ספרות).\n\nזה מדגים פולימורפיזם — מערך אחד מכיל סוגים שונים!',
    hintsHe: [
      "צרו Shape[] shapes = new Shape[n]",
      "בהתאם לסוג: shapes[i] = new Rectangle(w, h) או new Triangle(b, h)",
      "shapes[i].area() — Java יודע איזו area() להפעיל לפי הסוג האמיתי",
    ],
  },
  "interface-implementation": {
    promptHe:
      'הגדירו ממשק (interface) סטטי Printable עם מתודה String toPrintString().\n\nהגדירו Book שמממש Printable עם שדות String title ו-String author. toPrintString() מחזיר "<title> by <author>".\n\nהגדירו Invoice שמממש Printable עם שדות int id ו-double amount. toPrintString() מחזיר "Invoice #<id>: $<amount>" (amount ל-2 ספרות).\n\nב-main: קראו סוג ("book" או "invoice"). עבור book — קראו title ו-author. עבור invoice — קראו id ו-amount. צרו את האובייקט והדפיסו toPrintString().',
    hintsHe: [
      "ממשק: interface Printable { String toPrintString(); }",
      "מימוש: class Book implements Printable { ... }",
      "ממשק מגדיר חוזה — כל מחלקה שמממשת אותו חייבת לספק את המתודות",
    ],
  },
  "type-checking-instanceof": {
    promptHe:
      'הגדירו היררכיה: Animal (בסיס) עם שדה String name, Dog יורש מ-Animal עם שדה String breed, Cat יורש מ-Animal עם שדה boolean isIndoor.\n\nב-main: קראו n חיות. כל שורה:\n• "dog <שם> <גזע>"\n• "cat <שם> <indoor/outdoor>"\n\nשמרו במערך Animal[]. עברו על המערך והדפיסו עבור כל אחד:\n• Dog: "<שם> (Dog, breed: <גזע>)"\n• Cat: "<שם> (Cat, <indoor/outdoor>)"\n\nהשתמשו ב-instanceof כדי לזהות את הסוג האמיתי.',
    hintsHe: [
      "instanceof: if (animal instanceof Dog) — בודק אם האובייקט הוא Dog",
      'המרה: Dog d = (Dog) animal — אחרי instanceof אפשר ל"המיר" ולגשת לשדות של Dog',
      'Cat: בדקו isIndoor ? "indoor" : "outdoor"',
    ],
  },

  // ==================== Day 10: Integration & Review ====================

  // --- Mixed Fundamentals ---
  "array-stats-with-methods": {
    promptHe:
      'כתבו תוכנית עם מתודות סטטיות:\n• int sum(int[] arr) — מחזיר סכום\n• double average(int[] arr) — מחזיר ממוצע\n• int countAboveAverage(int[] arr) — מחזיר כמה איברים מעל הממוצע (ממש מעל, לא שווה)\n\nב-main: קראו n מספרים שלמים למערך. הדפיסו:\nSum: <סכום>\nAverage: <ממוצע ל-2 ספרות>\nAbove average: <כמות>',
    hintsHe: [
      "countAboveAverage: חשבו ממוצע קודם, אז ספרו כמה arr[i] > average",
      "שימו לב: הממוצע הוא double, לכן ההשוואה עובדת על מספרים עשרוניים",
      "sum מחזיר int, average מחזיר double — חשוב לעשות casting",
    ],
  },
  "string-manipulation-with-methods": {
    promptHe:
      'כתבו תוכנית עם מתודות סטטיות:\n• String capitalize(String s) — מחזיר את המחרוזת עם אות ראשונה גדולה והשאר קטנות\n• int countVowels(String s) — מחזיר מספר תנועות (a, e, i, o, u — לא רגיש לאותיות)\n• String removeVowels(String s) — מחזיר את המחרוזת ללא תנועות\n\nב-main: קראו מילה אחת. הדפיסו:\nCapitalized: <תוצאה>\nVowels: <מספר>\nWithout vowels: <תוצאה>',
    hintsHe: [
      "capitalize: s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase()",
      'countVowels: עברו תו-תו ובדקו אם הוא ב-"aeiouAEIOU"',
      'removeVowels: בנו מחרוזת חדשה ללא תנועות, או השתמשו ב-replaceAll("[aeiouAEIOU]", "")',
    ],
  },
  "nested-loops-with-conditions": {
    promptHe:
      "כתבו תוכנית עם מתודה סטטית boolean isPrime(int n) שמחזירה true אם n ראשוני.\n\nב-main: קראו שני מספרים שלמים low ו-high. הדפיסו את כל המספרים הראשוניים בטווח [low, high] בשורה אחת מופרדים ברווחים. בשורה הבאה הדפיסו את מספר הראשוניים שנמצאו.\n\nאם לא נמצאו ראשוניים, הדפיסו \"No primes\" בשורה הראשונה ו-\"0\" בשנייה.",
    hintsHe: [
      "isPrime: בדקו חלוקה מ-2 עד שורש n",
      "עברו על כל מספר בטווח [low, high] ובדקו אם ראשוני",
      "ספרו כמה ראשוניים נמצאו — אם 0 הדפיסו No primes",
    ],
  },
  "array-rotation-with-methods": {
    promptHe:
      "כתבו מתודה סטטית void rotateRight(int[] arr, int k) שמסובבת את המערך ימינה ב-k מקומות.\n\nלדוגמה: סיבוב [1,2,3,4,5] ימינה ב-2 נותן [4,5,1,2,3].\n\nרמז: k יכול להיות גדול מאורך המערך — השתמשו ב-k % arr.length.\n\nב-main: קראו n מספרים שלמים, ואז k. סובבו את המערך והדפיסו את האיברים מופרדים ברווחים.",
    hintsHe: [
      "נרמלו: k = k % arr.length",
      "אפשרות 1: צרו מערך חדש ומקמו כל איבר במקום החדש",
      "אפשרות 2: הפכו את כל המערך, אז הפכו k ראשונים, אז הפכו את השאר",
    ],
  },

  // --- Mixed OOP ---
  "full-class-hierarchy": {
    promptHe:
      'צרו היררכיית מחלקות עבור מערכת ספרייה:\n\n1. LibraryItem (מחלקת בסיס): שדות String title ו-int year. בנאי. מתודה String getInfo() שמחזירה "<title> (<year>)".\n\n2. Book יורש מ-LibraryItem: מוסיף String author. דורס getInfo() להחזיר "Book: <title> by <author> (<year>)".\n\n3. DVD יורש מ-LibraryItem: מוסיף int duration (דקות). דורס getInfo() להחזיר "DVD: <title> (<year>) - <duration>min".\n\nב-main: קראו n פריטים. כל שורה: "book <title> <author> <year>" או "dvd <title> <duration> <year>" (title הוא מילה אחת). שמרו במערך LibraryItem[] והדפיסו getInfo() לכל אחד.',
    hintsHe: [
      "LibraryItem הוא מחלקת בסיס — Book ו-DVD יורשים ממנה",
      "בבנאי של Book/DVD: super(title, year) ואז השדות הנוספים",
      "פולימורפיזם: items[i].getInfo() מפעיל את הגרסה המתאימה",
    ],
  },
  "interface-inheritance-combo": {
    promptHe:
      'הגדירו ממשק סטטי Measurable עם מתודה double getMeasurement().\n\nהגדירו מחלקה אבסטרקטית Shape שמממשת Measurable עם מתודה אבסטרקטית String getName().\n\nהגדירו Circle שיורש מ-Shape עם שדה double radius. מממש getMeasurement() להחזיר שטח (PI × r²). מממש getName() להחזיר "Circle".\n\nהגדירו Line שמממש Measurable (לא יורש מ-Shape) עם שדה double length. getMeasurement() מחזיר את האורך.\n\nב-main: קראו n פריטים. כל שורה: "circle <radius>" או "line <length>". שמרו במערך Measurable[]. הדפיסו את המדידה של כל פריט (ל-2 ספרות). בשורה אחרונה: "Largest: <מדידה>" — המדידה הגדולה ביותר.',
    hintsHe: [
      "Measurable הוא ממשק — שניהם Circle ו-Line מממשים אותו",
      "Circle גם יורש מ-Shape — שילוב ירושה וממשק",
      "Measurable[] יכול להכיל גם Circle וגם Line — פולימורפיזם דרך ממשק",
    ],
  },
  "complex-class-with-arrays": {
    promptHe:
      'הגדירו מחלקות:\n\nStudent — שדות String name ו-int score. בנאי. toString() מחזיר "<name>: <score>".\n\nClassroom — שדות Student[] (עד 30) ו-int size. מתודות:\n• void addStudent(String name, int score) — מוסיף תלמיד אם יש מקום\n• double getAverage() — ממוצע ציונים (0.0 אם ריק)\n• Student getTopStudent() — התלמיד עם הציון הגבוה ביותר (null אם ריק)\n• int countPassing(int threshold) — כמה תלמידים עם ציון >= סף\n\nב-main: קראו n תלמידים (שם וציון לכל שורה). אז קראו סף עובר. הדפיסו:\nClass average: <ממוצע ל-1 ספרה>\nTop student: <name>: <score>\nPassing: <כמות>/<סה"כ>',
    hintsHe: [
      "Classroom מכיל מערך של Student — הרכבה (composition)",
      "addStudent: צרו Student חדש ושמרו ב-students[size++]",
      "getTopStudent: עברו על המערך ומצאו את בעל הציון הגבוה ביותר",
    ],
  },
  "design-challenge": {
    promptHe:
      'תכננו מערכת גיליון ציונים שלמה עם מחלקות:\n\nGrade — שדות String subject ו-int score.\n\nStudent — שדות String name, Grade[] (עד 10), ו-int gradeCount. מתודות:\n• void addGrade(String subject, int score)\n• double getAverage() — ממוצע ציונים\n• String getHighestSubject() — המקצוע עם הציון הגבוה ביותר\n\nGradebook — שדות Student[] (עד 20) ו-int studentCount. מתודות:\n• void addStudent(String name)\n• Student findStudent(String name) — מחזיר תלמיד לפי שם (או null)\n• String getTopStudent() — שם התלמיד עם הממוצע הגבוה ביותר\n\nב-main: קראו פקודות עד "done":\n• "add_student <שם>" — מוסיף תלמיד\n• "add_grade <שם_תלמיד> <מקצוע> <ציון>" — מוסיף ציון לתלמיד\n• "print" — מדפיס כל תלמיד: "<שם>: avg=<ממוצע ל-1 ספרה>, best=<מקצוע>"\n\nאחרי print, הדפיסו "Top: <שם>" — התלמיד עם הממוצע הגבוה ביותר.',
    hintsHe: [
      "3 מחלקות שעובדות יחד: Grade, Student, Gradebook",
      "findStudent: עברו על המערך ובדקו name.equals(students[i].name)",
      "getTopStudent: עברו על כל התלמידים והשוו ממוצעים",
    ],
  },

  // --- Exam Simulation ---
  "exam-matrix-diagonal": {
    promptHe:
      "קראו מספר שלם n, ואז קראו מטריצה ריבועית n × n של מספרים שלמים.\n\nחשבו והדפיסו את סכום האלכסון הראשי (מלמעלה-שמאל ללמטה-ימין) ואת סכום האלכסון המשני (מלמעלה-ימין ללמטה-שמאל) — כל אחד בשורה נפרדת.\n\nאם n אי-זוגי, האיבר המרכזי נספר בשני האלכסונים, אבל עדיין הדפיסו כל סכום בנפרד.\n\nלדוגמה עבור n = 3:\n1 2 3\n4 5 6\n7 8 9\n\nאלכסון ראשי: 1 + 5 + 9 = 15\nאלכסון משני: 3 + 5 + 7 = 15",
    hintsHe: [
      "אלכסון ראשי: matrix[i][i]",
      "אלכסון משני: matrix[i][n - 1 - i]",
      "לולאה אחת מ-0 עד n-1 מספיקה לחישוב שני הסכומים",
    ],
  },
  "exam-sorted-merge": {
    promptHe:
      "כתבו מתודה סטטית int[] merge(int[] a, int[] b) שממזגת שני מערכים ממוינים למערך ממוין אחד.\n\nשני מערכי הקלט ממוינים בסדר עולה. התוצאה צריכה להיות ממוינת בסדר עולה.\n\nב-main: קראו שני מערכים ממוינים והדפיסו את המערך הממוזג, מופרד ברווחים.\n\nלדוגמה: [1, 3, 5] ו-[2, 4, 6] → פלט: 1 2 3 4 5 6\n\nרמז: השתמשו בשני מצביעים (אינדקסים) שמתקדמים על שני המערכים.",
    hintsHe: [
      "השתמשו בשני מצביעים i ו-j — אחד לכל מערך",
      "בכל צעד, קחו את הקטן יותר בין a[i] ו-b[j]",
      "אחרי שמערך אחד נגמר, העתיקו את השאר מהמערך השני",
    ],
  },
  "exam-text-analyzer": {
    promptHe:
      'צרו מערכת ניתוח טקסט:\n\nWordStats — שדות String word ו-int count. בנאי מאתחל word ו-count = 1. מתודה void increment() מגדילה count.\n\nTextAnalyzer — שדות WordStats[] (עד 100) ו-int uniqueCount. מתודות:\n• void addWord(String word) — אם המילה קיימת, הגדילו count; אחרת הוסיפו\n• String getMostFrequent() — מחזיר את המילה השכיחה ביותר\n• int getUniqueCount() — מחזיר מספר מילים ייחודיות\n\nב-main: קראו שורת טקסט. פצלו למילים (לפי רווחים). הוסיפו כל מילה (באותיות קטנות) לאנלייזר. הדפיסו:\nUnique words: <מספר>\nMost frequent: <מילה>\nOccurrences: <מספר הופעות המילה השכיחה>',
    hintsHe: [
      "addWord: עברו על המערך כדי לבדוק אם המילה כבר קיימת",
      "המרה לאותיות קטנות: word.toLowerCase()",
      "getMostFrequent: מצאו את WordStats עם ה-count הגבוה ביותר",
    ],
  },
  "exam-polymorphic-calculator": {
    promptHe:
      'צרו מערכת חישוב ביטויים:\n\nהגדירו מחלקה אבסטרקטית Expression עם מתודה אבסטרקטית int evaluate().\n\nLiteral — יורש מ-Expression, מכיל int value. evaluate() מחזיר את הערך.\n\nAdd — יורש מ-Expression, מכיל שני שדות Expression (left ו-right). evaluate() מחזיר left.evaluate() + right.evaluate().\n\nMultiply — יורש מ-Expression, מכיל שני שדות Expression. evaluate() מחזיר left.evaluate() × right.evaluate().\n\nב-main: קראו ביטוי בכתיב פריפיקס (prefix notation):\n• מספר בפני עצמו הוא Literal\n• "+ <expr1> <expr2>" — חיבור\n• "* <expr1> <expr2>" — כפל\n\nפרסרו רקורסיבית והדפיסו את התוצאה.\n\nדוגמאות:\n• קלט: "+ 3 4" → פלט: 7\n• קלט: "* + 1 2 4" → פלט: 12 (כי (1+2)×4 = 12)',
    hintsHe: [
      "פרסור רקורסיבי: אם הבא הוא מספר → Literal, אם + או * → קראו שני ביטויים",
      "השתמשו ב-sc.next() — אם ניתן להמיר למספר זה Literal, אחרת אופרטור",
      "פולימורפיזם: evaluate() עובד רקורסיבית דרך עץ הביטויים",
    ],
  },
}
