"use client"

import Link from "next/link"

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* English Version */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Accessibility Statement</h1>
        <p className="text-gray-400 mb-8">Last Updated: December 28, 2025</p>

        {/* Table of Contents */}
        <nav className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
          <ol className="space-y-2 text-gray-300">
            <li><a href="#commitment-a11y" className="hover:text-purple-400 transition-colors">1. Our Commitment to Accessibility</a></li>
            <li><a href="#standards" className="hover:text-purple-400 transition-colors">2. Accessibility Standards</a></li>
            <li><a href="#features" className="hover:text-purple-400 transition-colors">3. Accessibility Features</a></li>
            <li><a href="#technologies" className="hover:text-purple-400 transition-colors">4. Technologies Used</a></li>
            <li><a href="#known-limitations" className="hover:text-purple-400 transition-colors">5. Known Limitations</a></li>
            <li><a href="#browser-support" className="hover:text-purple-400 transition-colors">6. Browser & Assistive Technology Support</a></li>
            <li><a href="#feedback-a11y" className="hover:text-purple-400 transition-colors">7. Feedback & Assistance</a></li>
            <li><a href="#ongoing" className="hover:text-purple-400 transition-colors">8. Ongoing Improvements</a></li>
            <li><a href="#contact-a11y" className="hover:text-purple-400 transition-colors">9. Contact Us</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="commitment-a11y" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Our Commitment to Accessibility</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards to ensure we provide equal access to all users.</p>
            <p>We believe that everyone should have the opportunity to learn programming, regardless of ability. Our platform is designed to be as accessible as possible while maintaining a rich, interactive learning experience.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="standards" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Accessibility Standards</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor strives to conform to the following accessibility standards:</p>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">International Standards</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines, the international standard for web accessibility</li>
                <li><strong className="text-white">WAI-ARIA 1.2:</strong> Accessible Rich Internet Applications specification for dynamic content</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">Israeli Law Compliance</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Israeli Standard 5568:</strong> Web Content Accessibility Requirements</li>
                <li><strong className="text-white">Equal Rights for Persons with Disabilities Law (1998):</strong> Chapter H - Accessibility</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="features" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Accessibility Features</h2>
          <div className="text-gray-300 space-y-4">
            <p>Our platform includes the following accessibility features:</p>

            <h3 className="text-lg font-medium text-white mt-4">3.1 Visual Accessibility</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Color Contrast:</strong> Text and interactive elements meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)</li>
              <li><strong className="text-white">Dark/Light Mode:</strong> Choice between dark and light themes to suit user preferences</li>
              <li><strong className="text-white">Resizable Text:</strong> Text can be resized up to 200% without loss of content or functionality</li>
              <li><strong className="text-white">No Color-Only Information:</strong> Information is not conveyed by color alone</li>
              <li><strong className="text-white">Focus Indicators:</strong> Visible focus indicators for keyboard navigation</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.2 Navigation & Interaction</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Keyboard Navigation:</strong> Full keyboard access to all interactive elements</li>
              <li><strong className="text-white">Skip Links:</strong> Skip to main content links for screen reader users</li>
              <li><strong className="text-white">Logical Tab Order:</strong> Consistent, logical tab order throughout the site</li>
              <li><strong className="text-white">Clear Focus States:</strong> Visible focus rings on interactive elements</li>
              <li><strong className="text-white">No Keyboard Traps:</strong> Users can navigate freely without getting stuck</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.3 Screen Reader Support</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Semantic HTML:</strong> Proper use of headings, landmarks, and semantic elements</li>
              <li><strong className="text-white">ARIA Labels:</strong> Descriptive labels for interactive elements</li>
              <li><strong className="text-white">Live Regions:</strong> Dynamic content updates are announced</li>
              <li><strong className="text-white">Image Alt Text:</strong> Meaningful alternative text for images</li>
              <li><strong className="text-white">Form Labels:</strong> All form inputs have associated labels</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.4 Code Editor Accessibility</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Monaco Editor:</strong> Built on the same accessible editor as VS Code</li>
              <li><strong className="text-white">ARIA Support:</strong> Editor includes proper ARIA attributes</li>
              <li><strong className="text-white">Keyboard Shortcuts:</strong> Full keyboard control within the editor</li>
              <li><strong className="text-white">Screen Reader Mode:</strong> Optimized mode for screen reader users</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.5 Content & Language</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Clear Language:</strong> Simple, clear language throughout</li>
              <li><strong className="text-white">Language Declaration:</strong> Page language is properly declared</li>
              <li><strong className="text-white">RTL Support:</strong> Full right-to-left support for Hebrew content</li>
              <li><strong className="text-white">Consistent Navigation:</strong> Consistent placement of navigation elements</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section id="technologies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Technologies Used</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor is built with accessibility in mind using:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">React & Next.js:</strong> Modern framework with excellent accessibility support</li>
              <li><strong className="text-white">Radix UI:</strong> Headless, accessible UI component library</li>
              <li><strong className="text-white">Tailwind CSS:</strong> Utility-first CSS with accessibility utilities</li>
              <li><strong className="text-white">Monaco Editor:</strong> VS Code's accessible code editor</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section id="known-limitations" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Known Limitations</h2>
          <div className="text-gray-300 space-y-4">
            <p>While we strive for full accessibility, some areas may have limitations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Code Editor:</strong> Some advanced editor features may have reduced accessibility on older assistive technology</li>
              <li><strong className="text-white">Complex Interactions:</strong> Drag-and-drop features (if any) have keyboard alternatives</li>
              <li><strong className="text-white">Third-Party Content:</strong> Some embedded third-party content may not fully meet accessibility standards</li>
            </ul>
            <p className="mt-4">We are actively working to address these limitations and welcome feedback on accessibility issues.</p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="browser-support" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. Browser & Assistive Technology Support</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor is tested and optimized for:</p>

            <h3 className="text-lg font-medium text-white mt-4">Browsers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google Chrome (latest 2 versions)</li>
              <li>Mozilla Firefox (latest 2 versions)</li>
              <li>Apple Safari (latest 2 versions)</li>
              <li>Microsoft Edge (latest 2 versions)</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">Screen Readers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>NVDA (Windows)</li>
              <li>JAWS (Windows)</li>
              <li>VoiceOver (macOS, iOS)</li>
              <li>TalkBack (Android)</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">Other Assistive Technologies</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keyboard-only navigation</li>
              <li>Screen magnification software</li>
              <li>Voice control software</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section id="feedback-a11y" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. Feedback & Assistance</h2>
          <div className="text-gray-300 space-y-4">
            <p>We welcome your feedback on the accessibility of CodeTutor. Please let us know if you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encounter any accessibility barriers</li>
              <li>Have difficulty using any feature with assistive technology</li>
              <li>Have suggestions for improving accessibility</li>
              <li>Need content in an alternative format</li>
            </ul>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">Request Assistance</h3>
              <p>If you need assistance or encounter an accessibility barrier, we will try to provide the information you need in an accessible format within 5 business days.</p>
              <p className="mt-2"><strong className="text-white">Email:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
              <p><strong className="text-white">Subject Line:</strong> Accessibility Request</p>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="ongoing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. Ongoing Improvements</h2>
          <div className="text-gray-300 space-y-4">
            <p>We are committed to continually improving accessibility:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Regular accessibility audits and testing</li>
              <li>Training for our development team</li>
              <li>Integration of accessibility into our development process</li>
              <li>User feedback incorporation</li>
              <li>Monitoring of accessibility standards and best practices</li>
            </ul>
          </div>
        </section>

        {/* Section 9 */}
        <section id="contact-a11y" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
          <div className="text-gray-300 space-y-4">
            <p>For accessibility-related questions, feedback, or assistance requests:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">Accessibility Coordinator:</strong> Lia Mesika</p>
              <p><strong className="text-white">Business ID:</strong> 213754476</p>
              <p><strong className="text-white">Country:</strong> Israel</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
            </div>
          </div>
        </section>
      </section>

      {/* Hebrew Version */}
      <section dir="rtl" className="border-t border-white/10 pt-16">
        <h1 className="text-4xl font-bold text-white mb-4">הצהרת נגישות</h1>
        <p className="text-gray-400 mb-8">עודכן לאחרונה: 28 בדצמבר, 2025</p>

        {/* Table of Contents - Hebrew */}
        <nav className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">תוכן עניינים</h2>
          <ol className="space-y-2 text-gray-300">
            <li><a href="#he-commitment-a11y" className="hover:text-purple-400 transition-colors">1. המחויבות שלנו לנגישות</a></li>
            <li><a href="#he-standards" className="hover:text-purple-400 transition-colors">2. תקני נגישות</a></li>
            <li><a href="#he-features" className="hover:text-purple-400 transition-colors">3. תכונות נגישות</a></li>
            <li><a href="#he-technologies" className="hover:text-purple-400 transition-colors">4. טכנולוגיות בשימוש</a></li>
            <li><a href="#he-known-limitations" className="hover:text-purple-400 transition-colors">5. מגבלות ידועות</a></li>
            <li><a href="#he-browser-support" className="hover:text-purple-400 transition-colors">6. תמיכה בדפדפנים וטכנולוגיות מסייעות</a></li>
            <li><a href="#he-feedback-a11y" className="hover:text-purple-400 transition-colors">7. משוב וסיוע</a></li>
            <li><a href="#he-ongoing" className="hover:text-purple-400 transition-colors">8. שיפורים מתמשכים</a></li>
            <li><a href="#he-contact-a11y" className="hover:text-purple-400 transition-colors">9. צור קשר</a></li>
          </ol>
        </nav>

        {/* Section 1 - Hebrew */}
        <section id="he-commitment-a11y" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">1. המחויבות שלנו לנגישות</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor מחויבת להבטחת נגישות דיגיטלית לאנשים עם מוגבלויות. אנו משפרים באופן מתמיד את חווית המשתמש לכולם ומיישמים את תקני הנגישות הרלוונטיים כדי להבטיח גישה שוויונית לכל המשתמשים.</p>
            <p>אנו מאמינים שלכל אחד צריכה להיות ההזדמנות ללמוד תכנות, ללא קשר ליכולת. הפלטפורמה שלנו מתוכננת להיות נגישה ככל האפשר תוך שמירה על חווית למידה עשירה ואינטראקטיבית.</p>
          </div>
        </section>

        {/* Section 2 - Hebrew */}
        <section id="he-standards" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. תקני נגישות</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor שואפת לעמוד בתקני הנגישות הבאים:</p>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">תקנים בינלאומיים</h3>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong className="text-white">WCAG 2.1 רמה AA:</strong> הנחיות נגישות לתוכן אינטרנט, התקן הבינלאומי לנגישות אתרים</li>
                <li><strong className="text-white">WAI-ARIA 1.2:</strong> מפרט יישומי אינטרנט עשירים נגישים לתוכן דינמי</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">עמידה בחוק הישראלי</h3>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong className="text-white">תקן ישראלי 5568:</strong> דרישות נגישות לתוכן אינטרנט</li>
                <li><strong className="text-white">חוק שוויון זכויות לאנשים עם מוגבלות (1998):</strong> פרק ח' - נגישות</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 - Hebrew */}
        <section id="he-features" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. תכונות נגישות</h2>
          <div className="text-gray-300 space-y-4">
            <p>הפלטפורמה שלנו כוללת את תכונות הנגישות הבאות:</p>

            <h3 className="text-lg font-medium text-white mt-4">3.1 נגישות חזותית</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">ניגודיות צבעים:</strong> טקסט ואלמנטים אינטראקטיביים עומדים בדרישות הניגודיות של WCAG AA (4.5:1 לטקסט רגיל, 3:1 לטקסט גדול)</li>
              <li><strong className="text-white">מצב כהה/בהיר:</strong> בחירה בין ערכות נושא כהות ובהירות לפי העדפת המשתמש</li>
              <li><strong className="text-white">טקסט ניתן להגדלה:</strong> ניתן להגדיל טקסט עד 200% ללא אובדן תוכן או פונקציונליות</li>
              <li><strong className="text-white">מידע לא רק בצבע:</strong> מידע לא מועבר רק באמצעות צבע</li>
              <li><strong className="text-white">מחווני מיקוד:</strong> מחווני מיקוד נראים לניווט במקלדת</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.2 ניווט ואינטראקציה</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">ניווט מקלדת:</strong> גישה מלאה במקלדת לכל האלמנטים האינטראקטיביים</li>
              <li><strong className="text-white">קישורי דילוג:</strong> קישורי דילוג לתוכן העיקרי למשתמשי קורא מסך</li>
              <li><strong className="text-white">סדר טאב לוגי:</strong> סדר טאב עקבי ולוגי לאורך האתר</li>
              <li><strong className="text-white">מצבי מיקוד ברורים:</strong> טבעות מיקוד נראות על אלמנטים אינטראקטיביים</li>
              <li><strong className="text-white">ללא מלכודות מקלדת:</strong> משתמשים יכולים לנווט בחופשיות ללא להיתקע</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.3 תמיכה בקורא מסך</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">HTML סמנטי:</strong> שימוש נכון בכותרות, ציוני דרך ואלמנטים סמנטיים</li>
              <li><strong className="text-white">תוויות ARIA:</strong> תוויות תיאוריות לאלמנטים אינטראקטיביים</li>
              <li><strong className="text-white">אזורים חיים:</strong> עדכוני תוכן דינמיים מוכרזים</li>
              <li><strong className="text-white">טקסט חלופי לתמונות:</strong> טקסט חלופי משמעותי לתמונות</li>
              <li><strong className="text-white">תוויות טפסים:</strong> לכל שדות הקלט יש תוויות משויכות</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.4 נגישות עורך קוד</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">עורך Monaco:</strong> בנוי על אותו עורך נגיש כמו VS Code</li>
              <li><strong className="text-white">תמיכת ARIA:</strong> העורך כולל תכונות ARIA מתאימות</li>
              <li><strong className="text-white">קיצורי מקלדת:</strong> שליטה מלאה במקלדת בתוך העורך</li>
              <li><strong className="text-white">מצב קורא מסך:</strong> מצב אופטימלי למשתמשי קורא מסך</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.5 תוכן ושפה</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">שפה ברורה:</strong> שפה פשוטה וברורה לאורך כל האתר</li>
              <li><strong className="text-white">הצהרת שפה:</strong> שפת הדף מוגדרת כראוי</li>
              <li><strong className="text-white">תמיכת RTL:</strong> תמיכה מלאה מימין לשמאל לתוכן עברי</li>
              <li><strong className="text-white">ניווט עקבי:</strong> מיקום עקבי של אלמנטי ניווט</li>
            </ul>
          </div>
        </section>

        {/* Section 4 - Hebrew */}
        <section id="he-technologies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. טכנולוגיות בשימוש</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor נבנתה עם נגישות בראש מעייננו באמצעות:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">React & Next.js:</strong> מסגרת מודרנית עם תמיכת נגישות מצוינת</li>
              <li><strong className="text-white">Radix UI:</strong> ספריית רכיבי ממשק משתמש נגישה וללא עיצוב</li>
              <li><strong className="text-white">Tailwind CSS:</strong> CSS מבוסס כלים עם כלי נגישות</li>
              <li><strong className="text-white">Monaco Editor:</strong> עורך הקוד הנגיש של VS Code</li>
            </ul>
          </div>
        </section>

        {/* Section 5 - Hebrew */}
        <section id="he-known-limitations" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. מגבלות ידועות</h2>
          <div className="text-gray-300 space-y-4">
            <p>בעוד אנו שואפים לנגישות מלאה, יתכנו מגבלות בחלק מהאזורים:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">עורך קוד:</strong> חלק מתכונות העורך המתקדמות עשויות להיות בעלות נגישות מופחתת בטכנולוגיה מסייעת ישנה</li>
              <li><strong className="text-white">אינטראקציות מורכבות:</strong> תכונות גרירה ושחרור (אם קיימות) כוללות חלופות מקלדת</li>
              <li><strong className="text-white">תוכן צד שלישי:</strong> חלק מהתוכן המשובץ של צד שלישי עשוי לא לעמוד במלואו בתקני הנגישות</li>
            </ul>
            <p className="mt-4">אנו פועלים באופן פעיל לטיפול במגבלות אלה ומקבלים בברכה משוב על בעיות נגישות.</p>
          </div>
        </section>

        {/* Section 6 - Hebrew */}
        <section id="he-browser-support" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. תמיכה בדפדפנים וטכנולוגיות מסייעות</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor נבדקת ומותאמת עבור:</p>

            <h3 className="text-lg font-medium text-white mt-4">דפדפנים</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>Google Chrome (2 הגרסאות האחרונות)</li>
              <li>Mozilla Firefox (2 הגרסאות האחרונות)</li>
              <li>Apple Safari (2 הגרסאות האחרונות)</li>
              <li>Microsoft Edge (2 הגרסאות האחרונות)</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">קוראי מסך</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>NVDA (Windows)</li>
              <li>JAWS (Windows)</li>
              <li>VoiceOver (macOS, iOS)</li>
              <li>TalkBack (Android)</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">טכנולוגיות מסייעות אחרות</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>ניווט מקלדת בלבד</li>
              <li>תוכנות הגדלת מסך</li>
              <li>תוכנות שליטה קולית</li>
            </ul>
          </div>
        </section>

        {/* Section 7 - Hebrew */}
        <section id="he-feedback-a11y" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. משוב וסיוע</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו מקבלים בברכה את המשוב שלך על הנגישות של CodeTutor. אנא יידע אותנו אם:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>נתקלת בחסמי נגישות</li>
              <li>יש לך קושי להשתמש בתכונה כלשהי עם טכנולוגיה מסייעת</li>
              <li>יש לך הצעות לשיפור הנגישות</li>
              <li>אתה זקוק לתוכן בפורמט חלופי</li>
            </ul>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">בקשת סיוע</h3>
              <p>אם אתה זקוק לסיוע או נתקל בחסם נגישות, ננסה לספק לך את המידע שאתה צריך בפורמט נגיש תוך 5 ימי עסקים.</p>
              <p className="mt-2"><strong className="text-white">אימייל:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
              <p><strong className="text-white">שורת נושא:</strong> בקשת נגישות</p>
            </div>
          </div>
        </section>

        {/* Section 8 - Hebrew */}
        <section id="he-ongoing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. שיפורים מתמשכים</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו מחויבים לשיפור מתמשך של הנגישות:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>ביקורות ובדיקות נגישות קבועות</li>
              <li>הכשרה לצוות הפיתוח שלנו</li>
              <li>שילוב נגישות בתהליך הפיתוח שלנו</li>
              <li>שילוב משוב משתמשים</li>
              <li>מעקב אחר תקני נגישות ושיטות עבודה מומלצות</li>
            </ul>
          </div>
        </section>

        {/* Section 9 - Hebrew */}
        <section id="he-contact-a11y" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. צור קשר</h2>
          <div className="text-gray-300 space-y-4">
            <p>לשאלות, משוב או בקשות סיוע הקשורות לנגישות:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">רכז נגישות:</strong> ליה מסיקה</p>
              <p><strong className="text-white">מספר עוסק:</strong> 213754476</p>
              <p><strong className="text-white">מדינה:</strong> ישראל</p>
              <p><strong className="text-white">אימייל:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}
