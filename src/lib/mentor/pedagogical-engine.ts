/**
 * Pedagogical Feedback Engine
 *
 * Transforms technical errors into meaningful learning feedback.
 * Identifies conceptual misunderstandings and provides guidance.
 */

import { db } from "@/lib/db"
import { MistakeType, ConceptualMistakeCategory } from "@prisma/client"

// ============================================================================
// TYPES
// ============================================================================

export interface PedagogicalAnalysis {
  conceptualCategory: ConceptualMistakeCategory
  subcategory: string | null
  explanation: string
  whyItMatters: string | null
  guidingQuestion: string | null
  hint: string | null
  suggestedTopic: string | null
  relatedConcepts: string[]
  commonMistakeRank: number | null
}

interface AttemptContext {
  code: string
  compileError: string | null
  stderr: string | null
  testResults: Array<{
    passed: boolean
    expected: string
    actual: string | null
    error: string | null
    input: string
  }>
  mistakeType: MistakeType
  skillArea: string | null
  questionTitle?: string
  questionDescription?: string
}

// ============================================================================
// CONCEPTUAL PATTERN MATCHERS
// ============================================================================

interface ConceptualPattern {
  category: ConceptualMistakeCategory
  patterns: RegExp[]
  testPatterns?: (ctx: AttemptContext) => boolean
  explanation: string
  whyItMatters: string
  guidingQuestion: string
  hint: string
  suggestedTopic: string
  relatedConcepts: string[]
  commonMistakeRank: number
}

const CONCEPTUAL_PATTERNS: ConceptualPattern[] = [
  // LOOP ISSUES
  {
    category: "LOOP_BOUNDARY",
    patterns: [/ArrayIndexOutOfBoundsException/i, /StringIndexOutOfBoundsException/i],
    testPatterns: (ctx) => {
      // Check for off-by-one in test results
      const failedTests = ctx.testResults.filter(t => !t.passed)
      return failedTests.some(t => {
        if (!t.actual || !t.expected) return false
        const expNum = parseInt(t.expected)
        const actNum = parseInt(t.actual)
        return !isNaN(expNum) && !isNaN(actNum) && Math.abs(expNum - actNum) === 1
      })
    },
    explanation: "הלולאה שלכם מתקדמת צעד אחד יותר מדי או עוצרת צעד אחד מוקדם מדי. זוהי שגיאת 'off-by-one' - אחת הטעויות הנפוצות ביותר בתכנות.",
    whyItMatters: "גבולות לולאה הם קריטיים כי למערכים ומחרוזות יש גודל קבוע. גישה לאינדקס שלא קיים גורמת לקריסת התוכנית.",
    guidingQuestion: "אם למערך יש 5 איברים, מהו האינדקס של האיבר האחרון? מה צריך להיות תנאי הלולאה?",
    hint: "זכרו: מערך באורך n מכיל אינדקסים מ-0 עד n-1. בדקו אם אתם משתמשים ב-< או <= בתנאי הלולאה.",
    suggestedTopic: "לולאות ואיטרציה",
    relatedConcepts: ["אינדוקס מערכים", "תנאי לולאה", "אינדוקס מבוסס אפס"],
    commonMistakeRank: 1,
  },
  {
    category: "LOOP_INITIALIZATION",
    patterns: [/for\s*\(\s*int\s+\w+\s*=\s*1/],
    testPatterns: (ctx) => {
      // Check if first element is being skipped
      const firstTestFailed = ctx.testResults[0] && !ctx.testResults[0].passed
      return firstTestFailed && ctx.code.includes("for") && /for\s*\(\s*int\s+\w+\s*=\s*1/.test(ctx.code)
    },
    explanation: "הלולאה שלכם מתחילה מהמיקום הלא נכון. ברוב המקרים, אינדקסים של מערכים ומחרוזות מתחילים מ-0, לא מ-1.",
    whyItMatters: "התחלה מאינדקס שגוי גורמת לדילוג על האיבר הראשון או לניסיון גישה לאיברים שלא קיימים.",
    guidingQuestion: "מהו האינדקס של האיבר הראשון במערך? האם אתם מעבדים את כל האיברים?",
    hint: "רוב הלולאות שמעבדות מערכים צריכות להתחיל עם i = 0, לא i = 1.",
    suggestedTopic: "לולאות ואיטרציה",
    relatedConcepts: ["אינדוקס מבוסס אפס", "מעבר על מערך", "אתחול לולאה"],
    commonMistakeRank: 2,
  },
  {
    category: "LOOP_INCREMENT",
    patterns: [],
    testPatterns: (ctx) => {
      // Check for infinite loop signs or skipping elements
      return ctx.mistakeType === "TIMEOUT" && ctx.code.includes("while")
    },
    explanation: "ייתכן שהלולאה שלכם לא מתקדמת לכיוון תנאי היציאה. זה יכול לגרום ללולאה אינסופית.",
    whyItMatters: "כל לולאה חייבת להסתיים בסופו של דבר. אם משתנה הלולאה לא משתנה נכון, הלולאה רצה לנצח.",
    guidingQuestion: "איך משתנה הלולאה שלכם משתנה בכל איטרציה? האם הוא אי פעם יגיע לתנאי היציאה?",
    hint: "בדקו שמשתנה הלולאה מתעדכן בתוך הלולאה ומתקדם לכיוון תנאי העצירה.",
    suggestedTopic: "לולאות ואיטרציה",
    relatedConcepts: ["לולאה אינסופית", "עצירת לולאה", "עדכון משתנה לולאה"],
    commonMistakeRank: 3,
  },

  // CONDITION ISSUES
  {
    category: "CONDITION_LOGIC",
    patterns: [/&&.*\|\||\|\|.*&&/],
    testPatterns: (ctx) => {
      // Multiple conditions with mixed AND/OR
      return (ctx.code.match(/&&/g) || []).length > 0 && (ctx.code.match(/\|\|/g) || []).length > 0
    },
    explanation: "התנאי שלכם משלב אופרטורים AND (&&) ו-OR (||). סדר החישוב עשוי להיות שונה ממה שציפיתם.",
    whyItMatters: "לוגיקה בוליאנית עם מספר אופרטורים יכולה להיות מסובכת. ל-AND יש עדיפות גבוהה יותר מ-OR, מה שיכול לשנות את משמעות התנאי.",
    guidingQuestion: "מה צריך לקרות כשהתנאי הראשון נכון אבל השני לא? האם הקוד שלכם עושה את זה?",
    hint: "השתמשו בסוגריים כדי להבהיר את סדר החישוב: (a && b) || c שונה מ-a && (b || c).",
    suggestedTopic: "משפטי תנאי",
    relatedConcepts: ["אופרטורים בוליאניים", "עדיפות אופרטורים", "חוקי דה-מורגן"],
    commonMistakeRank: 4,
  },
  {
    category: "CONDITION_BOUNDARY",
    patterns: [],
    testPatterns: (ctx) => {
      // Check for boundary condition issues (< vs <=)
      const failedTests = ctx.testResults.filter(t => !t.passed)
      return failedTests.length === 1 && ctx.testResults.length > 2
    },
    explanation: "הקוד שלכם נכשל במקרה גבולי. בדקו אם אתם משתמשים באופרטור ההשוואה הנכון (< מול <=, > מול >=).",
    whyItMatters: "תנאי גבול מגדירים היכן הלוגיקה שלכם משתנה. אופרטור שגוי גורם לטיפול לא נכון במקרי קצה.",
    guidingQuestion: "האם ערך הגבול עצמו צריך להיכלל או לא? מה קורה בדיוק בגבול?",
    hint: "חשבו: אם התנאי הוא 'קטן מ-10', מה קורה כשהערך הוא בדיוק 10?",
    suggestedTopic: "משפטי תנאי",
    relatedConcepts: ["אופרטורי השוואה", "מקרי קצה", "בדיקת גבולות"],
    commonMistakeRank: 2,
  },

  // ARRAY ISSUES
  {
    category: "ARRAY_INDEXING",
    patterns: [/ArrayIndexOutOfBoundsException/i, /Index\s+\d+\s+out\s+of\s+bounds/i],
    explanation: "אתם מנסים לגשת לאיבר במערך שלא קיים. למערכים יש גודל קבוע ואינדקסים חוקיים הם מ-0 עד length-1.",
    whyItMatters: "גישה לאינדקס לא חוקי במערך גורמת לקריסת התוכנית. זהו מקור נפוץ לבאגים בתוכניות רבות.",
    guidingQuestion: "אם למערך שלכם יש n איברים, מהו טווח האינדקסים החוקי? האם אתם נשארים בטווח הזה?",
    hint: "לפני גישה ל-array[i], ודאו ש-i >= 0 וגם i < array.length.",
    suggestedTopic: "מערכים",
    relatedConcepts: ["גבולות מערך", "תיקוף אינדקס", "אורך מערך"],
    commonMistakeRank: 1,
  },
  {
    category: "ARRAY_SIZE",
    patterns: [/\.length\s*-\s*1/, /\.length\s*\+\s*1/],
    testPatterns: (ctx) => {
      return ctx.code.includes(".length") && /\.length\s*[-+]\s*\d/.test(ctx.code)
    },
    explanation: "בדקו את השימוש שלכם באורך המערך. זכרו שהאינדקס החוקי האחרון הוא length-1, לא length.",
    whyItMatters: "בלבול בין אורך המערך לאינדקס האחרון היא טעות קלאסית. אורך אומר לכם כמה איברים יש; אינדקסים אומרים היכן הם נמצאים.",
    guidingQuestion: "למערך באורך 5 יש אילו אינדקסים? האם length-1 הוא האינדקס האחרון או אחד אחריו?",
    hint: "array.length נותן את מספר האיברים. האיבר האחרון נמצא ב-array[array.length - 1].",
    suggestedTopic: "מערכים",
    relatedConcepts: ["אורך מערך", "אינדוקס מבוסס אפס", "מעבר על מערך"],
    commonMistakeRank: 2,
  },

  // STRING ISSUES
  {
    category: "STRING_MANIPULATION",
    patterns: [/StringIndexOutOfBoundsException/i, /\.charAt/, /\.substring/],
    explanation: "יש בעיה באופן שבו אתם מטפלים במחרוזות. אינדקסים של מחרוזות עובדים כמו מערכים - הם מתחילים מ-0.",
    whyItMatters: "מחרוזות הן רצפי תווים באורך קבוע. גישה מעבר לאורך המחרוזת גורמת לשגיאה.",
    guidingQuestion: "עבור מחרוזת באורך n, מהם האינדקסים החוקיים ל-charAt()? אילו פרמטרים substring() מצפה לקבל?",
    hint: "charAt(i) דורש ש-i יהיה בין 0 ל-length()-1. substring(start, end) לוקח מ-start עד end אבל לא כולל את end.",
    suggestedTopic: "מחרוזות",
    relatedConcepts: ["אינדוקס מחרוזות", "substring", "אורך מחרוזת"],
    commonMistakeRank: 3,
  },

  // NULL HANDLING
  {
    category: "NULL_HANDLING",
    patterns: [/NullPointerException/i, /null pointer/i],
    explanation: "אתם מנסים להשתמש באובייקט או ערך שהוא null (לא קיים). תמיד בדקו אם משהו עלול להיות null לפני השימוש בו.",
    whyItMatters: "null מייצג 'כלום' או 'אין ערך'. ניסיון לקרוא למתודות על null גורם לקריסת התוכנית.",
    guidingQuestion: "מה יכול לגרום למשתנה הזה להיות null? האם שכחתם לאתחל אותו, או שאולי מתודה מחזירה null?",
    hint: "הוסיפו בדיקת null: if (variable != null) לפני השימוש במשתנה.",
    suggestedTopic: "אובייקטים והפניות",
    relatedConcepts: ["ערכי null", "תכנות דפנסיבי", "אתחול"],
    commonMistakeRank: 3,
  },

  // EDGE CASES
  {
    category: "EDGE_CASE_EMPTY",
    patterns: [],
    testPatterns: (ctx) => {
      // Check if empty input causes failure
      return ctx.testResults.some(t => !t.passed && (t.input === "" || t.input === "[]" || t.input === "0"))
    },
    explanation: "הקוד שלכם לא מטפל נכון בקלט ריק. תמיד חשבו מה קורה כשאין מה לעבד.",
    whyItMatters: "קלטים ריקים נפוצים בתוכניות אמיתיות. הקוד שלכם צריך לטפל בהם בצורה תקינה, לא לקרוס.",
    guidingQuestion: "מה התוכנית צריכה להחזיר כשמקבלת מערך או מחרוזת ריקים? האם הקוד שלכם מטפל במקרה הזה?",
    hint: "הוסיפו בדיקה בהתחלה: אם הקלט ריק, החזירו את התוצאה המתאימה מיד.",
    suggestedTopic: "מקרי קצה",
    relatedConcepts: ["קלט ריק", "תיקוף קלט", "תכנות דפנסיבי"],
    commonMistakeRank: 2,
  },
  {
    category: "EDGE_CASE_SINGLE",
    patterns: [],
    testPatterns: (ctx) => {
      // Check if single-element input causes failure
      return ctx.testResults.some(t => !t.passed && (t.input === "1" || t.input.match(/^\[\d\]$/) || t.input.length === 1))
    },
    explanation: "הקוד שלכם לא מטפל נכון בקלט עם איבר יחיד. חלק מהאלגוריתמים דורשים טיפול מיוחד במקרה כזה.",
    whyItMatters: "מקרים של איבר יחיד חושפים לעיתים הנחות בקוד שלכם, כמו ציפייה לשני איברים לפחות להשוואה.",
    guidingQuestion: "מה קורה בלולאה שלכם כשיש רק איבר אחד? האם הלוגיקה של ההשוואה עדיין עובדת?",
    hint: "בדקו את הקוד שלכם מנטלית עם איבר אחד בלבד. האם כל שורה עדיין הגיונית?",
    suggestedTopic: "מקרי קצה",
    relatedConcepts: ["איבר יחיד", "מקרי קצה", "הנחות אלגוריתם"],
    commonMistakeRank: 3,
  },
  {
    category: "EDGE_CASE_BOUNDARY",
    patterns: [/overflow/i, /Integer\.MAX_VALUE/, /Integer\.MIN_VALUE/],
    explanation: "הקוד שלכם עלול לא לטפל נכון בערכים קיצוניים (מספרים גדולים או קטנים מאוד).",
    whyItMatters: "גלישת מספרים שלמים (overflow) יכולה לגרום לתוצאות בלתי צפויות. למספרים יש גבולות, וחריגה מהם גורמת לעטיפה.",
    guidingQuestion: "מה קורה אם הקלט הוא המספר השלם הגדול ביותר האפשרי? האם החישובים שלכם עלולים לגלוש?",
    hint: "שקלו להשתמש ב-long במקום int לחישובים ביניים, או בדקו גלישה אפשרית לפני שהיא קורית.",
    suggestedTopic: "טיפוסי נתונים",
    relatedConcepts: ["גלישת מספרים שלמים", "גבולות טיפוסי נתונים", "ערכי גבול"],
    commonMistakeRank: 5,
  },

  // ALGORITHM ISSUES
  {
    category: "ALGORITHM_APPROACH",
    patterns: [],
    testPatterns: (ctx) => ctx.mistakeType === "MISUNDERSTANDING",
    explanation: "הגישה שלכם לפתרון הבעיה עשויה לדרוש חשיבה מחדש. רוב הטסטים נכשלים, מה שמרמז שהאלגוריתם עצמו דורש עבודה.",
    whyItMatters: "בחירת האלגוריתם הנכון היא בסיסית. גישה שגויה לא ניתנת לתיקון בהתאמות קטנות.",
    guidingQuestion: "האם אתם יכולים להסביר את האלגוריתם שלכם צעד אחרי צעד? האם כל צעד מקרב אתכם לתשובה הנכונה?",
    hint: "נסו לעבוד על דוגמה קטנה ביד קודם. אילו צעדים אתם עושים? אחר כך תרגמו את הצעדים האלה לקוד.",
    suggestedTopic: "פתרון בעיות",
    relatedConcepts: ["תכנון אלגוריתם", "פירוק בעיה", "חשיבה צעד אחר צעד"],
    commonMistakeRank: 4,
  },
  {
    category: "ALGORITHM_INCOMPLETE",
    patterns: [],
    testPatterns: (ctx) => {
      // Some tests pass, some fail - missing cases
      const passRate = ctx.testResults.filter(t => t.passed).length / ctx.testResults.length
      return passRate > 0.3 && passRate < 0.7
    },
    explanation: "האלגוריתם שלכם עובד עבור חלק מהמקרים אבל לא כולם. ייתכן שחסר צעד או שאתם לא מטפלים בתנאים מסוימים.",
    whyItMatters: "פתרון חלקי מראה שאתם מבינים את הבסיס אבל צריכים להתחשב בעוד תרחישים.",
    guidingQuestion: "הסתכלו על הטסטים שנכשלו - מה המשותף להם? האם יש מקרה שהקוד שלכם לא מטפל בו?",
    hint: "השוו קלט של טסט שעבר עם קלט של טסט שנכשל. מה שונה? ההבדל הזה עשוי לחשוף את הלוגיקה החסרה.",
    suggestedTopic: "פתרון בעיות",
    relatedConcepts: ["ניתוח טסטים", "כיסוי מקרים", "שלמות אלגוריתם"],
    commonMistakeRank: 3,
  },

  // OUTPUT FORMAT
  {
    category: "OUTPUT_FORMAT",
    patterns: [],
    testPatterns: (ctx) => {
      return ctx.testResults.some(t => {
        if (!t.actual || !t.expected || t.passed) return false
        // Check if content is same but format different
        const expClean = t.expected.replace(/\s+/g, "").toLowerCase()
        const actClean = t.actual.replace(/\s+/g, "").toLowerCase()
        return expClean === actClean
      })
    },
    explanation: "התשובה שלכם נכונה אבל הפורמט שגוי. בדקו רווחים, שורות חדשות, או אותיות גדולות/קטנות.",
    whyItMatters: "בתכנות, הפלט המדויק חשוב. מערכות אוטומטיות משוות את הפלט שלכם תו אחרי תו.",
    guidingQuestion: "השוו את הפלט שלכם עם הפלט הצפוי בזהירות. האם אתם רואים הבדלים ברווחים או בפורמט?",
    hint: "בדקו רווחים מיותרים, שורות חדשות חסרות, או שימוש שגוי באותיות גדולות/קטנות. התוכן אולי נכון אבל הפורמט שגוי.",
    suggestedTopic: "קלט/פלט",
    relatedConcepts: ["פורמט פלט", "רווחים", "השוואת מחרוזות"],
    commonMistakeRank: 1,
  },

  // RECURSION ISSUES
  {
    category: "RECURSION_BASE",
    patterns: [/StackOverflowError/i],
    testPatterns: (ctx) => ctx.code.includes("return") && ctx.mistakeType === "MEMORY",
    explanation: "ייתכן שלפונקציה הרקורסיבית שלכם חסר תנאי עצירה (base case) או שתנאי העצירה שגוי.",
    whyItMatters: "כל פונקציה רקורסיבית צריכה תנאי עצירה שעוצר את הרקורסיה. בלעדיו, הפונקציה קוראת לעצמה לנצח.",
    guidingQuestion: "מהו הקלט הפשוט ביותר שעבורו אתם יודעים את התשובה מיד? זה צריך להיות תנאי העצירה שלכם.",
    hint: "תנאי עצירה נראה בדרך כלל כך: if (n <= 0) return something; ודאו שהתנאי הזה יתקיים בסופו של דבר.",
    suggestedTopic: "רקורסיה",
    relatedConcepts: ["תנאי עצירה", "קריאות רקורסיביות", "stack overflow"],
    commonMistakeRank: 4,
  },
  {
    category: "RECURSION_PROGRESS",
    patterns: [/StackOverflowError/i],
    testPatterns: (ctx) => {
      // Check if recursive call doesn't reduce problem
      const hasRecursion = /(\w+)\s*\([^)]*\)\s*\{[^}]*\1\s*\(/.test(ctx.code)
      return hasRecursion && ctx.mistakeType === "MEMORY"
    },
    explanation: "הקריאות הרקורסיביות שלכם עשויות לא להתקדם לכיוון תנאי העצירה. כל קריאה צריכה לקרב אתכם לעצירה.",
    whyItMatters: "רקורסיה חייבת לצמצם את גודל הבעיה בכל קריאה. אם לא, לעולם לא תגיעו לתנאי העצירה.",
    guidingQuestion: "איך כל קריאה רקורסיבית משנה את הקלט? האם הוא הולך וקטן או מתקרב לתנאי העצירה?",
    hint: "אם אתם עושים רקורסיה על n, ודאו שאתם קוראים לפונקציה עם משהו קטן יותר כמו n-1, לא n או n+1.",
    suggestedTopic: "רקורסיה",
    relatedConcepts: ["התקדמות רקורסיבית", "צמצום בעיה", "התכנסות לתנאי עצירה"],
    commonMistakeRank: 4,
  },

  // TYPE ISSUES
  {
    category: "TYPE_CONVERSION",
    patterns: [/incompatible types/i, /cannot be converted/i, /lossy conversion/i],
    explanation: "אתם מערבבים טיפוסי נתונים שונים בצורה שלא עובדת. Java דורשת המרה מפורשת בין חלק מהטיפוסים.",
    whyItMatters: "לטיפוסי נתונים שונים יש טווחים והתנהגויות שונות. המרה שגויה יכולה לאבד נתונים או לגרום לשגיאות.",
    guidingQuestion: "עם אילו טיפוסים אתם עובדים? האם הפעולה הגיונית עבור הטיפוסים האלה?",
    hint: "להמרת int ל-String, השתמשו ב-String.valueOf(). להמרת String ל-int, השתמשו ב-Integer.parseInt().",
    suggestedTopic: "טיפוסי נתונים",
    relatedConcepts: ["המרת טיפוסים", "casting", "טיפוסי נתונים"],
    commonMistakeRank: 3,
  },
  {
    category: "INTEGER_OVERFLOW",
    patterns: [/overflow/i],
    testPatterns: (ctx) => {
      // Large numbers in failing tests
      return ctx.testResults.some(t => !t.passed && /\d{10,}/.test(t.input))
    },
    explanation: "ייתכן שהחישוב שלכם גולש. כשמספרים גדולים מדי עבור int, הם עוטפים לערכים שליליים.",
    whyItMatters: "גלישת מספרים שלמים היא באג שקט - הקוד רץ אבל מייצר תוצאות שגויות למספרים גדולים.",
    guidingQuestion: "מהו המספר הגדול ביותר שהחישוב שלכם יכול לייצר? האם הוא גדול מ-2,147,483,647 (Integer.MAX_VALUE)?",
    hint: "השתמשו ב-long במקום int לחישובים שעלולים לחרוג מטווח int. גם שקלו את סדר הפעולות.",
    suggestedTopic: "טיפוסי נתונים",
    relatedConcepts: ["גלישת מספרים שלמים", "long מול int", "גבולות מספריים"],
    commonMistakeRank: 5,
  },

  // PROBLEM MISUNDERSTANDING
  {
    category: "PROBLEM_MISREAD",
    patterns: [],
    testPatterns: (ctx) => ctx.mistakeType === "MISUNDERSTANDING",
    explanation: "רוב הטסטים נכשלים, מה שמרמז שייתכן שדרישות השאלה לא הובנו נכון. קראו את השאלה שוב בזהירות.",
    whyItMatters: "הבנת הבעיה היא הצעד הראשון בפתרון. פתרון נכון לבעיה הלא נכונה הוא עדיין שגוי.",
    guidingQuestion: "האם אתם יכולים להסביר במילים שלכם מה השאלה מבקשת? מהו הקלט והפלט הצפויים?",
    hint: "הסתכלו על הדוגמאות שניתנו. עברו עליהן צעד אחרי צעד. איזו טרנספורמציה מתרחשת מהקלט לפלט?",
    suggestedTopic: "פתרון בעיות",
    relatedConcepts: ["הבנת הבעיה", "ניתוח דרישות", "דוגמאות"],
    commonMistakeRank: 2,
  },

  // OPERATOR PRECEDENCE
  {
    category: "OPERATOR_PRECEDENCE",
    patterns: [/\d\s*[+\-]\s*\d\s*[*\/]\s*\d/],
    testPatterns: (ctx) => {
      // Math expression without parentheses
      return /[+\-].*[*\/]|[*\/].*[+\-]/.test(ctx.code) && !/\([^)]*[+\-*\/][^)]*\)/.test(ctx.code)
    },
    explanation: "ייתכן שהביטוי המתמטי שלכם לא מחושב בסדר שציפיתם. כפל וחילוק מתבצעים לפני חיבור וחיסור.",
    whyItMatters: "עדיפות אופרטורים עוקבת אחרי כללים מתמטיים, לא קריאה משמאל לימין. זה יכול לייצר תוצאות בלתי צפויות.",
    guidingQuestion: "מהו 2 + 3 * 4? האם זה 20 או 14? האם הקוד שלכם מסתמך על סדר פעולות מסוים?",
    hint: "השתמשו בסוגריים כדי להבהיר את הסדר: (a + b) * c שונה מ-a + (b * c).",
    suggestedTopic: "אופרטורים",
    relatedConcepts: ["עדיפות אופרטורים", "ביטויים מתמטיים", "סוגריים"],
    commonMistakeRank: 4,
  },
]

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

export async function generatePedagogicalFeedback(
  attemptId: string,
  mistakeLogId: string
): Promise<PedagogicalAnalysis | null> {
  // Fetch attempt with all context
  const attempt = await db.attempt.findUnique({
    where: { id: attemptId },
    include: {
      testResults: true,
      question: { include: { topic: true } },
      mistakeLogs: {
        where: { id: mistakeLogId },
        take: 1,
      },
    },
  })

  if (!attempt || attempt.mistakeLogs.length === 0) {
    return null
  }

  const mistakeLog = attempt.mistakeLogs[0]

  const context: AttemptContext = {
    code: attempt.code,
    compileError: attempt.compileError,
    stderr: attempt.stderr,
    testResults: attempt.testResults.map(tr => ({
      passed: tr.passed,
      expected: tr.expected,
      actual: tr.actual,
      error: tr.error,
      input: tr.input,
    })),
    mistakeType: mistakeLog.mistakeType,
    skillArea: mistakeLog.skillArea,
    questionTitle: attempt.question.title,
    questionDescription: attempt.question.prompt || undefined,
  }

  // Find the best matching conceptual pattern
  const analysis = findBestMatch(context)

  // Store the feedback
  await db.pedagogicalFeedback.create({
    data: {
      mistakeLogId,
      attemptId,
      conceptualCategory: analysis.conceptualCategory,
      subcategory: analysis.subcategory,
      explanation: analysis.explanation,
      whyItMatters: analysis.whyItMatters,
      guidingQuestion: analysis.guidingQuestion,
      hint: analysis.hint,
      suggestedTopic: analysis.suggestedTopic,
      relatedConcepts: analysis.relatedConcepts,
      commonMistakeRank: analysis.commonMistakeRank,
      aiGenerated: false,
    },
  })

  return analysis
}

function findBestMatch(context: AttemptContext): PedagogicalAnalysis {
  const errorText = [context.compileError, context.stderr].filter(Boolean).join("\n")
  let bestMatch: ConceptualPattern | null = null
  let bestScore = 0

  for (const pattern of CONCEPTUAL_PATTERNS) {
    let score = 0

    // Check regex patterns against error text
    for (const regex of pattern.patterns) {
      if (regex.test(errorText) || regex.test(context.code)) {
        score += 2
      }
    }

    // Check test patterns (contextual analysis)
    if (pattern.testPatterns && pattern.testPatterns(context)) {
      score += 3
    }

    // Bonus for skill area match
    if (context.skillArea && pattern.suggestedTopic.toLowerCase().includes(context.skillArea.toLowerCase())) {
      score += 1
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = pattern
    }
  }

  // If no good match found, return a generic response based on mistake type
  if (!bestMatch || bestScore === 0) {
    return getGenericFeedback(context)
  }

  return {
    conceptualCategory: bestMatch.category,
    subcategory: null,
    explanation: bestMatch.explanation,
    whyItMatters: bestMatch.whyItMatters,
    guidingQuestion: bestMatch.guidingQuestion,
    hint: bestMatch.hint,
    suggestedTopic: bestMatch.suggestedTopic,
    relatedConcepts: bestMatch.relatedConcepts,
    commonMistakeRank: bestMatch.commonMistakeRank,
  }
}

function getGenericFeedback(context: AttemptContext): PedagogicalAnalysis {
  const mistakeTypeDefaults: Record<MistakeType, Partial<PedagogicalAnalysis>> = {
    SYNTAX: {
      conceptualCategory: "OUTPUT_FORMAT",
      explanation: "יש שגיאת תחביר בקוד שלכם. בדקו אם חסר נקודה-פסיק, סוגריים, או שגיאות הקלדה במילות מפתח.",
      whyItMatters: "שגיאות תחביר מונעות מהקוד שלכם לרוץ בכלל. המחשב צריך תחביר מדויק כדי להבין את ההוראות שלכם.",
      guidingQuestion: "הסתכלו על הודעת השגיאה - היא בדרך כלל אומרת את מספר השורה. מה נראה שגוי בשורה הזו?",
      hint: "שגיאות תחביר נפוצות: נקודה-פסיק חסרה (;), סוגריים מסולסלים לא תואמים {}, שגיאת כתיב במילות מפתח כמו public או static.",
      suggestedTopic: "תחביר Java",
    },
    LOGIC: {
      conceptualCategory: "ALGORITHM_INCOMPLETE",
      explanation: "הקוד שלכם רץ אבל מחזיר תוצאות שגויות. הלוגיקה של הפתרון דורשת תיקון.",
      whyItMatters: "שגיאות לוגיקה מסובכות כי הקוד רץ בלי לקרוס. אתם צריכים לעקוב אחרי האלגוריתם שלכם בזהירות.",
      guidingQuestion: "בחרו טסט שנכשל ועקבו אחרי הקוד שלכם צעד אחרי צעד. איפה התוצאה בפועל שונה מהצפויה?",
      hint: "הוסיפו הדפסות כדי לראות ערכים ביניים. זה עוזר למצוא איפה הלוגיקה משתבשת.",
      suggestedTopic: "דיבוג",
    },
    TIMEOUT: {
      conceptualCategory: "LOOP_INCREMENT",
      explanation: "הקוד שלכם רץ זמן רב מדי. זה בדרך כלל אומר לולאה אינסופית או אלגוריתם לא יעיל.",
      whyItMatters: "יעילות חשובה בתכנות. לולאה אינסופית אומרת שהתוכנית שלכם אף פעם לא מסיימת.",
      guidingQuestion: "האם לכל הלולאות שלכם יש דרך לצאת? האם משתנה הלולאה משתנה בכיוון הנכון?",
      hint: "בדקו את לולאות ה-while שלכם במיוחד. ודאו שהתנאי יהפוך ל-false בסופו של דבר.",
      suggestedTopic: "לולאות ויעילות",
    },
    MISUNDERSTANDING: {
      conceptualCategory: "PROBLEM_MISREAD",
      explanation: "רוב הטסטים נכשלו. זה לעתים קרובות אומר שדרישות השאלה לא הובנו לגמרי.",
      whyItMatters: "הבנה של מה צריך לבנות חשובה לא פחות מלדעת איך לבנות את זה.",
      guidingQuestion: "קראו שוב את תיאור השאלה. מה בדיוק מבקשים? מה הקלטים והפלטים הצפויים?",
      hint: "עברו על הדוגמאות הנתונות ביד לפני שאתם כותבים קוד. ודאו שאתם יכולים לפתור את זה ידנית קודם.",
      suggestedTopic: "פתרון בעיות",
    },
    CARELESS: {
      conceptualCategory: "OUTPUT_FORMAT",
      explanation: "אתם מאוד קרובים! התשובה כמעט נכונה אבל יש שגיאה קטנה - אולי חריגה באחד, אותיות גדולות/קטנות, או רווח מיותר.",
      whyItMatters: "פרטים חשובים בתכנות. מחשבים משווים פלטים בדיוק, תו אחרי תו.",
      guidingQuestion: "השוו את הפלט שלכם עם הפלט הצפוי בזהירות רבה. מה ההבדל הקטן?",
      hint: "בדקו: שגיאות off-by-one, אותיות גדולות מול קטנות, רווחים או שורות חדשות מיותרים או חסרים.",
      suggestedTopic: "תשומת לב לפרטים",
    },
    MEMORY: {
      conceptualCategory: "RECURSION_BASE",
      explanation: "התוכנית שלכם חרגה מהזיכרון. זה לעתים קרובות נגרם מרקורסיה אינסופית או יצירת יותר מדי אובייקטים.",
      whyItMatters: "הזיכרון מוגבל. רקורסיה אינסופית ממלאת את ה-call stack וגורמת לקריסה.",
      guidingQuestion: "אם אתם משתמשים ברקורסיה, האם כל מסלול מגיע בסופו של דבר למקרה בסיס?",
      hint: "הוסיפו מקרה בסיס שמחזיר ישירות בלי לבצע קריאה רקורסיבית נוספת.",
      suggestedTopic: "רקורסיה",
    },
    EDGE_CASE: {
      conceptualCategory: "EDGE_CASE_BOUNDARY",
      explanation: "הקוד שלכם נכשל במקרי קצה - קלטים חריגים כמו מערכים ריקים, איבר בודד, או ערכים קיצוניים.",
      whyItMatters: "קוד טוב מטפל בכל הקלטים, לא רק בטיפוסיים. מקרי קצה הם המקום בו באגים מתחבאים.",
      guidingQuestion: "מה קורה עם קלט ריק? עם איבר אחד בלבד? עם הערך הגדול ביותר האפשרי?",
      hint: "הוסיפו בדיקות בתחילת הפונקציה עבור מקרים מיוחדים לפני הלוגיקה הראשית.",
      suggestedTopic: "מקרי קצה",
    },
    TYPE_ERROR: {
      conceptualCategory: "TYPE_CONVERSION",
      explanation: "יש אי-התאמה בטיפוסים בקוד שלכם. אתם משתמשים בערכים מטיפוסים שונים בצורה שלא עובדת.",
      whyItMatters: "Java היא שפה עם טיפוסים חזקים. פעולות חייבות להשתמש בטיפוסים תואמים.",
      guidingQuestion: "מה הטיפוס של כל משתנה? האם אתם מערבבים מספרים שלמים עם מחרוזות, או משתמשים במתודה הלא נכונה לטיפוס?",
      hint: "בדקו את הטיפוסים של המשתנים שלכם. השתמשו ב-casting או מתודות המרה לפי הצורך.",
      suggestedTopic: "טיפוסי נתונים",
    },
  }

  const defaults = mistakeTypeDefaults[context.mistakeType] || mistakeTypeDefaults.LOGIC

  return {
    conceptualCategory: defaults.conceptualCategory || "ALGORITHM_INCOMPLETE",
    subcategory: null,
    explanation: defaults.explanation || "יש שגיאה בקוד שלכם.",
    whyItMatters: defaults.whyItMatters || "הבנת שגיאות עוזרת לכם להפוך למתכנתים טובים יותר.",
    guidingQuestion: defaults.guidingQuestion || "האם אתם יכולים לזהות איזה חלק בקוד שלכם עלול לגרום לזה?",
    hint: defaults.hint || "עברו על הקוד שלכם צעד אחרי צעד.",
    suggestedTopic: defaults.suggestedTopic || "תכנות כללי",
    relatedConcepts: [],
    commonMistakeRank: null,
  }
}

// ============================================================================
// AGGREGATION & INSIGHTS
// ============================================================================

export async function getStudentMistakeInsights(userId: string) {
  const [
    conceptualBreakdown,
    recurringConcepts,
    improvementAreas,
    recentFeedback,
  ] = await Promise.all([
    // Group by conceptual category
    db.pedagogicalFeedback.groupBy({
      by: ["conceptualCategory"],
      where: {
        mistakeLog: { userId },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    // Find recurring conceptual issues
    db.pedagogicalFeedback.findMany({
      where: {
        mistakeLog: { userId, isRecurring: true },
      },
      select: {
        conceptualCategory: true,
        suggestedTopic: true,
        explanation: true,
        mistakeLog: {
          select: { createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    // Topics that need work
    db.pedagogicalFeedback.groupBy({
      by: ["suggestedTopic"],
      where: {
        mistakeLog: { userId },
        suggestedTopic: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),

    // Recent feedback
    db.pedagogicalFeedback.findMany({
      where: {
        mistakeLog: { userId },
      },
      include: {
        mistakeLog: {
          include: {
            question: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  return {
    conceptualBreakdown: conceptualBreakdown.map(c => ({
      category: c.conceptualCategory,
      count: c._count.id,
    })),
    recurringConcepts: recurringConcepts.map(r => ({
      category: r.conceptualCategory,
      topic: r.suggestedTopic,
      explanation: r.explanation,
      date: r.mistakeLog.createdAt,
    })),
    improvementAreas: improvementAreas
      .filter(a => a.suggestedTopic)
      .map(a => ({
        topic: a.suggestedTopic!,
        mistakeCount: a._count.id,
      })),
    recentFeedback: recentFeedback.map(f => ({
      category: f.conceptualCategory,
      explanation: f.explanation,
      hint: f.hint,
      guidingQuestion: f.guidingQuestion,
      questionTitle: f.mistakeLog.question.title,
      date: f.createdAt,
    })),
  }
}

export async function getClassMistakeInsights() {
  const [
    topMistakes,
    mistakesByTopic,
    weeklyTrend,
    commonPatterns,
  ] = await Promise.all([
    // Most common conceptual mistakes
    db.pedagogicalFeedback.groupBy({
      by: ["conceptualCategory"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Mistakes by suggested topic
    db.pedagogicalFeedback.groupBy({
      by: ["suggestedTopic"],
      where: { suggestedTopic: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    // Weekly trend
    db.$queryRaw<Array<{ week: Date; count: bigint }>>`
      SELECT DATE_TRUNC('week', "createdAt") as week, COUNT(*) as count
      FROM "PedagogicalFeedback"
      WHERE "createdAt" > NOW() - INTERVAL '8 weeks'
      GROUP BY DATE_TRUNC('week', "createdAt")
      ORDER BY week DESC
    `,

    // Students with most recurring issues
    db.mistakeLog.groupBy({
      by: ["userId"],
      where: { isRecurring: true },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ])

  return {
    topMistakes: topMistakes.map(m => ({
      category: m.conceptualCategory,
      count: m._count.id,
    })),
    mistakesByTopic: mistakesByTopic
      .filter(m => m.suggestedTopic)
      .map(m => ({
        topic: m.suggestedTopic!,
        count: m._count.id,
      })),
    weeklyTrend: weeklyTrend.map(w => ({
      week: w.week,
      count: Number(w.count),
    })),
    studentsNeedingHelp: commonPatterns.map(p => ({
      userId: p.userId,
      recurringMistakes: p._count.id,
    })),
  }
}
