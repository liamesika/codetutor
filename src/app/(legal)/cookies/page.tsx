"use client"

import Link from "next/link"

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* English Version */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
        <p className="text-gray-400 mb-8">Last Updated: December 28, 2025</p>

        {/* Table of Contents */}
        <nav className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
          <ol className="space-y-2 text-gray-300">
            <li><a href="#what-cookies" className="hover:text-purple-400 transition-colors">1. What Are Cookies</a></li>
            <li><a href="#how-use-cookies" className="hover:text-purple-400 transition-colors">2. How We Use Cookies</a></li>
            <li><a href="#types-cookies" className="hover:text-purple-400 transition-colors">3. Types of Cookies We Use</a></li>
            <li><a href="#cookie-consent" className="hover:text-purple-400 transition-colors">4. Cookie Consent</a></li>
            <li><a href="#third-party" className="hover:text-purple-400 transition-colors">5. Third-Party Cookies</a></li>
            <li><a href="#manage-cookies" className="hover:text-purple-400 transition-colors">6. Managing Your Cookies</a></li>
            <li><a href="#local-storage" className="hover:text-purple-400 transition-colors">7. Local Storage</a></li>
            <li><a href="#updates-cookies" className="hover:text-purple-400 transition-colors">8. Updates to This Policy</a></li>
            <li><a href="#contact-cookies" className="hover:text-purple-400 transition-colors">9. Contact Us</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="what-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies</h2>
          <div className="text-gray-300 space-y-4">
            <p>Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.</p>
            <p>Cookies can be "persistent" (remaining on your device until they expire or are deleted) or "session" cookies (deleted when you close your browser).</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="how-use-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Cookies</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor uses cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services based on usage patterns</li>
              <li>Ensure security and prevent fraud</li>
              <li>Provide personalized learning experiences</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section id="types-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Types of Cookies We Use</h2>
          <div className="text-gray-300 space-y-6">

            {/* Essential Cookies */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-3">🔒 Essential Cookies</h3>
              <p className="mb-3">Required for the platform to function. Cannot be disabled.</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-gray-400">Cookie Name</th>
                    <th className="text-left py-2 text-gray-400">Purpose</th>
                    <th className="text-left py-2 text-gray-400">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">next-auth.session-token</td>
                    <td className="py-2">Authentication session</td>
                    <td className="py-2">30 days</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">next-auth.csrf-token</td>
                    <td className="py-2">CSRF protection</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">next-auth.callback-url</td>
                    <td className="py-2">Redirect after login</td>
                    <td className="py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Functional Cookies */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-3">⚙️ Functional Cookies</h3>
              <p className="mb-3">Remember your preferences and settings.</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-gray-400">Cookie Name</th>
                    <th className="text-left py-2 text-gray-400">Purpose</th>
                    <th className="text-left py-2 text-gray-400">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">theme</td>
                    <td className="py-2">Dark/Light mode preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">language</td>
                    <td className="py-2">Language preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">editor-settings</td>
                    <td className="py-2">Code editor preferences</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-3">📊 Analytics Cookies</h3>
              <p className="mb-3">Help us understand how you use our platform.</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-gray-400">Cookie Name</th>
                    <th className="text-left py-2 text-gray-400">Purpose</th>
                    <th className="text-left py-2 text-gray-400">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">_vercel_insights</td>
                    <td className="py-2">Vercel Analytics</td>
                    <td className="py-2">Session</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-sm text-gray-400">Note: We use privacy-focused analytics that do not track individual users across sites.</p>
            </div>
          </div>
        </section>

        {/* Section 4 - Cookie Consent */}
        <section id="cookie-consent" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Cookie Consent</h2>
          <div className="text-gray-300 space-y-4">
            <p>In compliance with GDPR and the ePrivacy Directive, we obtain your consent before placing non-essential cookies on your device.</p>

            <h3 className="text-lg font-medium text-white mt-4">4.1 How Consent Works</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>When you first visit CodeTutor, you will see a cookie consent banner</li>
              <li>You can choose to accept all cookies, reject non-essential cookies, or customize your preferences</li>
              <li>Essential cookies are always enabled as they are required for the platform to function</li>
              <li>Your consent choice is stored and remembered for future visits</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">4.2 Cookie Categories You Can Control</h3>
            <div className="bg-white/5 rounded-xl p-6 mt-2">
              <ul className="space-y-4">
                <li>
                  <strong className="text-white">Essential (Required):</strong>
                  <p className="text-sm text-gray-400">Cannot be disabled. Necessary for security, authentication, and core platform functionality.</p>
                </li>
                <li>
                  <strong className="text-white">Functional (Optional):</strong>
                  <p className="text-sm text-gray-400">Remember your preferences like theme, language, and editor settings. Can be disabled.</p>
                </li>
                <li>
                  <strong className="text-white">Analytics (Optional):</strong>
                  <p className="text-sm text-gray-400">Help us understand how you use the platform. Can be disabled.</p>
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-medium text-white mt-4">4.3 Changing Your Consent</h3>
            <p>You can change your cookie preferences at any time:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clear your browser's cookies to see the consent banner again</li>
              <li>Use your browser's cookie settings to manage individual cookies</li>
              <li>Contact us to request changes to your consent</li>
            </ul>

            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400"><strong>Your Rights:</strong> Under GDPR, you have the right to withdraw consent as easily as you gave it. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="third-party" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Cookies</h2>
          <div className="text-gray-300 space-y-4">
            <p>Some cookies are placed by third-party services that appear on our pages:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Vercel:</strong> Platform hosting and analytics</li>
              <li><strong className="text-white">PayPlus:</strong> Payment processing (only when making a purchase)</li>
            </ul>
            <p className="mt-4">These third parties have their own privacy and cookie policies. We recommend reviewing their policies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Vercel Privacy Policy</a></li>
              <li><a href="https://www.payplus.co.il/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">PayPlus Privacy Policy</a></li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section id="manage-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. Managing Your Cookies</h2>
          <div className="text-gray-300 space-y-4">
            <p>You can control and manage cookies in several ways:</p>

            <h3 className="text-lg font-medium text-white mt-4">Browser Settings</h3>
            <p>Most browsers allow you to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>See what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">Browser-Specific Instructions</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Microsoft Edge</a></li>
            </ul>

            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400"><strong>Note:</strong> Blocking essential cookies will prevent you from logging in and using CodeTutor.</p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section id="local-storage" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. Local Storage</h2>
          <div className="text-gray-300 space-y-4">
            <p>In addition to cookies, we use local storage to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Save your code in progress (so you don't lose work if you close the browser)</li>
              <li>Store learning progress locally for faster loading</li>
              <li>Cache UI preferences</li>
            </ul>
            <p className="mt-4">Local storage data stays on your device and is not transmitted to our servers unless explicitly saved.</p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="updates-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. Updates to This Policy</h2>
          <div className="text-gray-300 space-y-4">
            <p>We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. For significant changes, we will notify you through our platform.</p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="contact-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
          <div className="text-gray-300 space-y-4">
            <p>For questions about our use of cookies, contact us:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">Lia Mesika</strong></p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
            </div>
          </div>
        </section>
      </section>

      {/* Hebrew Version */}
      <section dir="rtl" className="border-t border-white/10 pt-16">
        <h1 className="text-4xl font-bold text-white mb-4">מדיניות עוגיות</h1>
        <p className="text-gray-400 mb-8">עודכן לאחרונה: 28 בדצמבר, 2025</p>

        {/* Table of Contents - Hebrew */}
        <nav className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">תוכן עניינים</h2>
          <ol className="space-y-2 text-gray-300">
            <li><a href="#he-what-cookies" className="hover:text-purple-400 transition-colors">1. מה הן עוגיות</a></li>
            <li><a href="#he-how-use-cookies" className="hover:text-purple-400 transition-colors">2. כיצד אנו משתמשים בעוגיות</a></li>
            <li><a href="#he-types-cookies" className="hover:text-purple-400 transition-colors">3. סוגי העוגיות שאנו משתמשים בהן</a></li>
            <li><a href="#he-cookie-consent" className="hover:text-purple-400 transition-colors">4. הסכמה לעוגיות</a></li>
            <li><a href="#he-third-party" className="hover:text-purple-400 transition-colors">5. עוגיות צד שלישי</a></li>
            <li><a href="#he-manage-cookies" className="hover:text-purple-400 transition-colors">6. ניהול העוגיות שלך</a></li>
            <li><a href="#he-local-storage" className="hover:text-purple-400 transition-colors">7. אחסון מקומי</a></li>
            <li><a href="#he-updates-cookies" className="hover:text-purple-400 transition-colors">8. עדכונים למדיניות זו</a></li>
            <li><a href="#he-contact-cookies" className="hover:text-purple-400 transition-colors">9. צור קשר</a></li>
          </ol>
        </nav>

        {/* Section 1 - Hebrew */}
        <section id="he-what-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">1. מה הן עוגיות</h2>
          <div className="text-gray-300 space-y-4">
            <p>עוגיות הן קבצי טקסט קטנים שמוצבים על המכשיר שלך כאשר אתה מבקר באתר. הן נפוצות ומשמשות להפעלת אתרים בצורה יעילה יותר ולספק מידע לבעלי האתר.</p>
            <p>עוגיות יכולות להיות "קבועות" (נשארות במכשיר שלך עד שתוקפן פג או שהן נמחקות) או עוגיות "סשן" (נמחקות כאשר אתה סוגר את הדפדפן).</p>
          </div>
        </section>

        {/* Section 2 - Hebrew */}
        <section id="he-how-use-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. כיצד אנו משתמשים בעוגיות</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor משתמשת בעוגיות וטכנולוגיות דומות כדי:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>לשמור אותך מחובר לחשבון שלך</li>
              <li>לזכור את ההעדפות וההגדרות שלך</li>
              <li>להבין כיצד אתה משתמש בפלטפורמה שלנו</li>
              <li>לשפר את השירותים שלנו בהתבסס על דפוסי שימוש</li>
              <li>להבטיח אבטחה ולמנוע הונאה</li>
              <li>לספק חוויות למידה מותאמות אישית</li>
            </ul>
          </div>
        </section>

        {/* Section 3 - Hebrew */}
        <section id="he-types-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. סוגי העוגיות שאנו משתמשים בהן</h2>
          <div className="text-gray-300 space-y-6">

            {/* Essential Cookies */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-3">🔒 עוגיות חיוניות</h3>
              <p className="mb-3">נדרשות להפעלת הפלטפורמה. לא ניתן לכבות אותן.</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right py-2 text-gray-400">שם העוגייה</th>
                    <th className="text-right py-2 text-gray-400">מטרה</th>
                    <th className="text-right py-2 text-gray-400">משך</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">next-auth.session-token</td>
                    <td className="py-2">סשן אימות</td>
                    <td className="py-2">30 יום</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">next-auth.csrf-token</td>
                    <td className="py-2">הגנת CSRF</td>
                    <td className="py-2">סשן</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">next-auth.callback-url</td>
                    <td className="py-2">הפניה לאחר התחברות</td>
                    <td className="py-2">סשן</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Functional Cookies */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-3">⚙️ עוגיות פונקציונליות</h3>
              <p className="mb-3">זוכרות את ההעדפות וההגדרות שלך.</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right py-2 text-gray-400">שם העוגייה</th>
                    <th className="text-right py-2 text-gray-400">מטרה</th>
                    <th className="text-right py-2 text-gray-400">משך</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">theme</td>
                    <td className="py-2">העדפת מצב כהה/בהיר</td>
                    <td className="py-2">שנה</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">language</td>
                    <td className="py-2">העדפת שפה</td>
                    <td className="py-2">שנה</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">editor-settings</td>
                    <td className="py-2">העדפות עורך קוד</td>
                    <td className="py-2">שנה</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-3">📊 עוגיות אנליטיקה</h3>
              <p className="mb-3">עוזרות לנו להבין כיצד אתה משתמש בפלטפורמה שלנו.</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right py-2 text-gray-400">שם העוגייה</th>
                    <th className="text-right py-2 text-gray-400">מטרה</th>
                    <th className="text-right py-2 text-gray-400">משך</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-2 font-mono text-purple-400">_vercel_insights</td>
                    <td className="py-2">Vercel Analytics</td>
                    <td className="py-2">סשן</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-3 text-sm text-gray-400">הערה: אנו משתמשים באנליטיקה ממוקדת פרטיות שאינה עוקבת אחר משתמשים בודדים באתרים שונים.</p>
            </div>
          </div>
        </section>

        {/* Section 4 - Hebrew - Cookie Consent */}
        <section id="he-cookie-consent" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. הסכמה לעוגיות</h2>
          <div className="text-gray-300 space-y-4">
            <p>בהתאם ל-GDPR והוראת ePrivacy, אנו מקבלים את הסכמתך לפני הצבת עוגיות לא חיוניות במכשיר שלך.</p>

            <h3 className="text-lg font-medium text-white mt-4">4.1 כיצד ההסכמה עובדת</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>כאשר אתה מבקר לראשונה ב-CodeTutor, תראה באנר הסכמה לעוגיות</li>
              <li>תוכל לבחור לקבל את כל העוגיות, לדחות עוגיות לא חיוניות, או להתאים את ההעדפות שלך</li>
              <li>עוגיות חיוניות תמיד מופעלות כיוון שהן נדרשות לתפקוד הפלטפורמה</li>
              <li>בחירת ההסכמה שלך נשמרת ונזכרת לביקורים עתידיים</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">4.2 קטגוריות עוגיות שתוכל לשלוט בהן</h3>
            <div className="bg-white/5 rounded-xl p-6 mt-2">
              <ul className="space-y-4">
                <li>
                  <strong className="text-white">חיוניות (נדרשות):</strong>
                  <p className="text-sm text-gray-400">לא ניתן לכבות. נחוצות לאבטחה, אימות ופונקציונליות ליבה של הפלטפורמה.</p>
                </li>
                <li>
                  <strong className="text-white">פונקציונליות (אופציונלי):</strong>
                  <p className="text-sm text-gray-400">זוכרות את ההעדפות שלך כמו ערכת נושא, שפה והגדרות עורך. ניתן לכבות.</p>
                </li>
                <li>
                  <strong className="text-white">אנליטיקה (אופציונלי):</strong>
                  <p className="text-sm text-gray-400">עוזרות לנו להבין כיצד אתה משתמש בפלטפורמה. ניתן לכבות.</p>
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-medium text-white mt-4">4.3 שינוי ההסכמה שלך</h3>
            <p>תוכל לשנות את העדפות העוגיות שלך בכל עת:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>נקה את עוגיות הדפדפן כדי לראות שוב את באנר ההסכמה</li>
              <li>השתמש בהגדרות העוגיות של הדפדפן לניהול עוגיות בודדות</li>
              <li>צור איתנו קשר לבקשת שינויים בהסכמה שלך</li>
            </ul>

            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400"><strong>הזכויות שלך:</strong> לפי GDPR, יש לך זכות למשוך הסכמה באותה קלות שבה נתת אותה. משיכת הסכמה אינה משפיעה על חוקיות העיבוד שהתבסס על הסכמה לפני משיכתה.</p>
            </div>
          </div>
        </section>

        {/* Section 5 - Hebrew */}
        <section id="he-third-party" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. עוגיות צד שלישי</h2>
          <div className="text-gray-300 space-y-4">
            <p>חלק מהעוגיות מוצבות על ידי שירותי צד שלישי המופיעים בדפים שלנו:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">Vercel:</strong> אירוח פלטפורמה ואנליטיקה</li>
              <li><strong className="text-white">PayPlus:</strong> עיבוד תשלומים (רק בעת ביצוע רכישה)</li>
            </ul>
            <p className="mt-4">לצדדים שלישיים אלה יש מדיניות פרטיות ועוגיות משלהם. אנו ממליצים לעיין במדיניות שלהם:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">מדיניות הפרטיות של Vercel</a></li>
              <li><a href="https://www.payplus.co.il/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">מדיניות הפרטיות של PayPlus</a></li>
            </ul>
          </div>
        </section>

        {/* Section 6 - Hebrew */}
        <section id="he-manage-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. ניהול העוגיות שלך</h2>
          <div className="text-gray-300 space-y-4">
            <p>ניתן לשלוט ולנהל עוגיות במספר דרכים:</p>

            <h3 className="text-lg font-medium text-white mt-4">הגדרות דפדפן</h3>
            <p>רוב הדפדפנים מאפשרים לך:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>לראות אילו עוגיות מאוחסנות ולמחוק אותן בנפרד</li>
              <li>לחסום עוגיות צד שלישי</li>
              <li>לחסום עוגיות מאתרים מסוימים</li>
              <li>לחסום את כל העוגיות</li>
              <li>למחוק את כל העוגיות כאשר אתה סוגר את הדפדפן</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">הוראות לפי דפדפן</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">Microsoft Edge</a></li>
            </ul>

            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400"><strong>הערה:</strong> חסימת עוגיות חיוניות תמנע ממך להתחבר ולהשתמש ב-CodeTutor.</p>
            </div>
          </div>
        </section>

        {/* Section 7 - Hebrew */}
        <section id="he-local-storage" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. אחסון מקומי</h2>
          <div className="text-gray-300 space-y-4">
            <p>בנוסף לעוגיות, אנו משתמשים באחסון מקומי כדי:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>לשמור את הקוד שלך בתהליך (כדי שלא תאבד עבודה אם תסגור את הדפדפן)</li>
              <li>לאחסן התקדמות למידה מקומית לטעינה מהירה יותר</li>
              <li>לשמור העדפות ממשק משתמש במטמון</li>
            </ul>
            <p className="mt-4">נתוני אחסון מקומי נשארים במכשיר שלך ואינם מועברים לשרתים שלנו אלא אם נשמרו במפורש.</p>
          </div>
        </section>

        {/* Section 8 - Hebrew */}
        <section id="he-updates-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. עדכונים למדיניות זו</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו עשויים לעדכן מדיניות עוגיות זו מעת לעת. שינויים יפורסמו בדף זה עם תאריך "עודכן לאחרונה" מעודכן. עבור שינויים משמעותיים, נודיע לך דרך הפלטפורמה שלנו.</p>
          </div>
        </section>

        {/* Section 9 - Hebrew */}
        <section id="he-contact-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. צור קשר</h2>
          <div className="text-gray-300 space-y-4">
            <p>לשאלות לגבי השימוש שלנו בעוגיות, צור קשר:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">ליה מסיקה</strong></p>
              <p><strong className="text-white">אימייל:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}
