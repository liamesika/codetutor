"use client"

import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* English Version */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last Updated: December 28, 2025</p>

        {/* Table of Contents */}
        <nav className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
          <ol className="space-y-2 text-gray-300">
            <li><a href="#info-collect" className="hover:text-purple-400 transition-colors">1. Information We Collect</a></li>
            <li><a href="#how-use" className="hover:text-purple-400 transition-colors">2. How We Use Your Information</a></li>
            <li><a href="#legal-basis" className="hover:text-purple-400 transition-colors">3. Legal Basis for Processing (GDPR)</a></li>
            <li><a href="#data-sharing" className="hover:text-purple-400 transition-colors">4. Data Sharing and Third Parties</a></li>
            <li><a href="#data-retention" className="hover:text-purple-400 transition-colors">5. Data Retention</a></li>
            <li><a href="#data-security" className="hover:text-purple-400 transition-colors">6. Data Security</a></li>
            <li><a href="#your-rights" className="hover:text-purple-400 transition-colors">7. Your Rights</a></li>
            <li><a href="#children" className="hover:text-purple-400 transition-colors">8. Children's Privacy</a></li>
            <li><a href="#cookies" className="hover:text-purple-400 transition-colors">9. Cookies and Tracking</a></li>
            <li><a href="#marketing" className="hover:text-purple-400 transition-colors">10. Marketing Communications</a></li>
            <li><a href="#international" className="hover:text-purple-400 transition-colors">11. International Data Transfers</a></li>
            <li><a href="#changes-privacy" className="hover:text-purple-400 transition-colors">12. Changes to This Policy</a></li>
            <li><a href="#contact-privacy" className="hover:text-purple-400 transition-colors">13. Contact Us</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="info-collect" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
          <div className="text-gray-300 space-y-4">
            <p>We collect information you provide directly to us, including:</p>
            <h3 className="text-lg font-medium text-white mt-4">1.1 Account Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address</li>
              <li>Password (encrypted)</li>
              <li>Profile information (optional)</li>
              <li>Date of birth (for age verification)</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">1.2 Payment Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Billing address</li>
              <li>Payment method details (processed securely by PayPlus)</li>
              <li>Transaction history</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">1.3 Usage Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Code submissions and solutions</li>
              <li>Learning progress and achievements</li>
              <li>Session data (time spent, pages visited)</li>
              <li>Device and browser information</li>
              <li>IP address</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">1.4 Content You Create</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Code written in the editor</li>
              <li>Notes and annotations</li>
              <li>Questions or feedback submitted</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section id="how-use" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
          <div className="text-gray-300 space-y-4">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve the CodeTutor platform</li>
              <li>Process subscriptions and payments</li>
              <li>Personalize your learning experience through adaptive algorithms</li>
              <li>Provide AI-based feedback on your code submissions</li>
              <li>Track and display your progress, achievements, and streaks</li>
              <li>Send important service notifications</li>
              <li>Respond to your questions and support requests</li>
              <li>Analyze platform usage to improve our services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section id="legal-basis" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Legal Basis for Processing (GDPR)</h2>
          <div className="text-gray-300 space-y-4">
            <p>For users in the European Economic Area (EEA), we process your data based on:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Contract Performance:</strong> Processing necessary to provide our services to you</li>
              <li><strong className="text-white">Legitimate Interests:</strong> Improving our services, security, and fraud prevention</li>
              <li><strong className="text-white">Legal Compliance:</strong> Processing required by law</li>
              <li><strong className="text-white">Consent:</strong> For marketing communications and optional features</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section id="data-sharing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Third Parties</h2>
          <div className="text-gray-300 space-y-4">
            <p>We may share your information with:</p>
            <h3 className="text-lg font-medium text-white mt-4">4.1 Service Providers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">PayPlus:</strong> Payment processing (Israel-based)</li>
              <li><strong className="text-white">Vercel:</strong> Hosting and infrastructure</li>
              <li><strong className="text-white">Neon:</strong> Database services</li>
              <li><strong className="text-white">Sentry:</strong> Error tracking and monitoring</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">4.2 Legal Requirements</h3>
            <p>We may disclose information when required by law, court order, or to protect our rights and safety.</p>
            <h3 className="text-lg font-medium text-white mt-4">4.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, user data may be transferred to the new entity.</p>
            <p className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <strong className="text-green-400">We do not sell your personal information.</strong>
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="data-retention" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
          <div className="text-gray-300 space-y-4">
            <p>We retain your data according to the following guidelines:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Active Accounts:</strong> Data is retained while your account is active</li>
              <li><strong className="text-white">Deleted Accounts:</strong> Personal data is deleted within 30 days of account deletion</li>
              <li><strong className="text-white">Payment Records:</strong> Transaction records are retained for 7 years for legal and tax purposes</li>
              <li><strong className="text-white">Aggregated Data:</strong> Anonymous, aggregated data may be retained indefinitely for analytics</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section id="data-security" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
          <div className="text-gray-300 space-y-4">
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS encryption for all data transmission</li>
              <li>Encrypted password storage using bcrypt</li>
              <li>Secure, sandboxed code execution environment</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Rate limiting to prevent abuse</li>
            </ul>
            <p className="mt-4">While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.</p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="your-rights" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
          <div className="text-gray-300 space-y-4">
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
              <li><strong className="text-white">Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong className="text-white">Erasure:</strong> Request deletion of your data ("Right to be Forgotten")</li>
              <li><strong className="text-white">Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong className="text-white">Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong className="text-white">Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent for marketing at any time</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact us at <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a>. We will respond within 30 days.</p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="children" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor welcomes learners of all ages, including minors. For users under 16:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We recommend parental or guardian oversight during registration</li>
              <li>We collect only information necessary for educational purposes</li>
              <li>We do not knowingly target advertising to minors</li>
              <li>Parents or guardians can request access to or deletion of their child's data</li>
            </ul>
            <p className="mt-4">If you believe a child has provided personal information without appropriate consent, please contact us immediately.</p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. Cookies and Tracking</h2>
          <div className="text-gray-300 space-y-4">
            <p>We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Essential Cookies:</strong> Required for authentication and security</li>
              <li><strong className="text-white">Functional Cookies:</strong> Remember your preferences</li>
              <li><strong className="text-white">Analytics Cookies:</strong> Understand how users interact with our platform</li>
            </ul>
            <p className="mt-4">For more details, see our <Link href="/cookies" className="text-purple-400 hover:text-purple-300">Cookie Policy</Link>.</p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="marketing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">10. Marketing Communications</h2>
          <div className="text-gray-300 space-y-4">
            <p>With your consent, we may send you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>New feature announcements</li>
              <li>Learning tips and resources</li>
              <li>Special offers and promotions</li>
            </ul>
            <p className="mt-4">You can opt out of marketing emails at any time by:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clicking "Unsubscribe" in any marketing email</li>
              <li>Updating your notification preferences in account settings</li>
              <li>Contacting us at <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></li>
            </ul>
            <p className="mt-4">Note: You will still receive essential service notifications.</p>
          </div>
        </section>

        {/* Section 11 */}
        <section id="international" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">11. International Data Transfers</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor is operated from Israel. Your data may be transferred to and processed in countries outside your residence, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Israel (primary data processing)</li>
              <li>United States (cloud infrastructure services)</li>
              <li>European Union (certain service providers)</li>
            </ul>
            <p className="mt-4">Where required, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses or adequacy decisions.</p>
          </div>
        </section>

        {/* Section 12 */}
        <section id="changes-privacy" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">12. Changes to This Policy</h2>
          <div className="text-gray-300 space-y-4">
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. For significant changes, we will notify you via email or a prominent notice on our platform.</p>
            <p className="mt-4">Continued use of CodeTutor after changes constitutes acceptance of the updated policy.</p>
          </div>
        </section>

        {/* Section 13 */}
        <section id="contact-privacy" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
          <div className="text-gray-300 space-y-4">
            <p>For privacy-related questions or to exercise your rights, contact us:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">Data Controller:</strong> Lia Mesika</p>
              <p><strong className="text-white">Business ID:</strong> 213754476</p>
              <p><strong className="text-white">Country:</strong> Israel</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
            </div>
          </div>
        </section>
      </section>

      {/* Hebrew Version */}
      <section dir="rtl" className="border-t border-white/10 pt-16">
        <h1 className="text-4xl font-bold text-white mb-4">מדיניות פרטיות</h1>
        <p className="text-gray-400 mb-8">עודכן לאחרונה: 28 בדצמבר, 2025</p>

        {/* Table of Contents - Hebrew */}
        <nav className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">תוכן עניינים</h2>
          <ol className="space-y-2 text-gray-300">
            <li><a href="#he-info-collect" className="hover:text-purple-400 transition-colors">1. מידע שאנו אוספים</a></li>
            <li><a href="#he-how-use" className="hover:text-purple-400 transition-colors">2. כיצד אנו משתמשים במידע שלך</a></li>
            <li><a href="#he-legal-basis" className="hover:text-purple-400 transition-colors">3. בסיס משפטי לעיבוד (GDPR)</a></li>
            <li><a href="#he-data-sharing" className="hover:text-purple-400 transition-colors">4. שיתוף מידע וצדדים שלישיים</a></li>
            <li><a href="#he-data-retention" className="hover:text-purple-400 transition-colors">5. שמירת מידע</a></li>
            <li><a href="#he-data-security" className="hover:text-purple-400 transition-colors">6. אבטחת מידע</a></li>
            <li><a href="#he-your-rights" className="hover:text-purple-400 transition-colors">7. הזכויות שלך</a></li>
            <li><a href="#he-children" className="hover:text-purple-400 transition-colors">8. פרטיות ילדים</a></li>
            <li><a href="#he-cookies" className="hover:text-purple-400 transition-colors">9. עוגיות ומעקב</a></li>
            <li><a href="#he-marketing" className="hover:text-purple-400 transition-colors">10. תקשורת שיווקית</a></li>
            <li><a href="#he-international" className="hover:text-purple-400 transition-colors">11. העברות מידע בינלאומיות</a></li>
            <li><a href="#he-changes-privacy" className="hover:text-purple-400 transition-colors">12. שינויים במדיניות זו</a></li>
            <li><a href="#he-contact-privacy" className="hover:text-purple-400 transition-colors">13. צור קשר</a></li>
          </ol>
        </nav>

        {/* Section 1 - Hebrew */}
        <section id="he-info-collect" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">1. מידע שאנו אוספים</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו אוספים מידע שאתה מספק לנו ישירות, כולל:</p>
            <h3 className="text-lg font-medium text-white mt-4">1.1 פרטי חשבון</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>שם וכתובת אימייל</li>
              <li>סיסמה (מוצפנת)</li>
              <li>פרטי פרופיל (אופציונלי)</li>
              <li>תאריך לידה (לאימות גיל)</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">1.2 מידע תשלום</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>כתובת לחיוב</li>
              <li>פרטי אמצעי תשלום (מעובדים בצורה מאובטחת על ידי PayPlus)</li>
              <li>היסטוריית עסקאות</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">1.3 נתוני שימוש</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>הגשות קוד ופתרונות</li>
              <li>התקדמות למידה והישגים</li>
              <li>נתוני סשן (זמן שהות, עמודים שנצפו)</li>
              <li>מידע על המכשיר והדפדפן</li>
              <li>כתובת IP</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">1.4 תוכן שאתה יוצר</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>קוד שנכתב בעורך</li>
              <li>הערות והסברים</li>
              <li>שאלות או משוב שנשלחו</li>
            </ul>
          </div>
        </section>

        {/* Section 2 - Hebrew */}
        <section id="he-how-use" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. כיצד אנו משתמשים במידע שלך</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו משתמשים במידע שאנו אוספים כדי:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>לספק, לתחזק ולשפר את פלטפורמת CodeTutor</li>
              <li>לעבד מנויים ותשלומים</li>
              <li>להתאים אישית את חווית הלמידה שלך באמצעות אלגוריתמים אדפטיביים</li>
              <li>לספק משוב מבוסס AI על הגשות הקוד שלך</li>
              <li>לעקוב ולהציג את ההתקדמות, ההישגים והרצפים שלך</li>
              <li>לשלוח התראות שירות חשובות</li>
              <li>להגיב לשאלות ולבקשות תמיכה שלך</li>
              <li>לנתח שימוש בפלטפורמה לשיפור השירותים שלנו</li>
              <li>למנוע הונאה ולהבטיח אבטחה</li>
              <li>לציית לחובות משפטיות</li>
            </ul>
          </div>
        </section>

        {/* Section 3 - Hebrew */}
        <section id="he-legal-basis" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. בסיס משפטי לעיבוד (GDPR)</h2>
          <div className="text-gray-300 space-y-4">
            <p>עבור משתמשים באזור הכלכלי האירופי (EEA), אנו מעבדים את הנתונים שלך על בסיס:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">ביצוע חוזה:</strong> עיבוד הנדרש לספק לך את השירותים שלנו</li>
              <li><strong className="text-white">אינטרסים לגיטימיים:</strong> שיפור השירותים, אבטחה ומניעת הונאה</li>
              <li><strong className="text-white">ציות לחוק:</strong> עיבוד הנדרש על פי חוק</li>
              <li><strong className="text-white">הסכמה:</strong> לתקשורת שיווקית ותכונות אופציונליות</li>
            </ul>
          </div>
        </section>

        {/* Section 4 - Hebrew */}
        <section id="he-data-sharing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. שיתוף מידע וצדדים שלישיים</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו עשויים לשתף את המידע שלך עם:</p>
            <h3 className="text-lg font-medium text-white mt-4">4.1 ספקי שירות</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">PayPlus:</strong> עיבוד תשלומים (מבוסס ישראל)</li>
              <li><strong className="text-white">Vercel:</strong> אירוח ותשתית</li>
              <li><strong className="text-white">Neon:</strong> שירותי מסד נתונים</li>
              <li><strong className="text-white">Sentry:</strong> מעקב שגיאות וניטור</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">4.2 דרישות משפטיות</h3>
            <p>אנו עשויים לחשוף מידע כאשר נדרש על פי חוק, צו בית משפט, או להגנה על הזכויות והבטיחות שלנו.</p>
            <h3 className="text-lg font-medium text-white mt-4">4.3 העברות עסקיות</h3>
            <p>במקרה של מיזוג, רכישה או מכירת נכסים, נתוני משתמשים עשויים להיות מועברים לגוף החדש.</p>
            <p className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <strong className="text-green-400">אנו לא מוכרים את המידע האישי שלך.</strong>
            </p>
          </div>
        </section>

        {/* Section 5 - Hebrew */}
        <section id="he-data-retention" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. שמירת מידע</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו שומרים את הנתונים שלך בהתאם להנחיות הבאות:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">חשבונות פעילים:</strong> הנתונים נשמרים כל עוד החשבון שלך פעיל</li>
              <li><strong className="text-white">חשבונות שנמחקו:</strong> נתונים אישיים נמחקים תוך 30 יום ממחיקת החשבון</li>
              <li><strong className="text-white">רשומות תשלום:</strong> רשומות עסקאות נשמרות ל-7 שנים לצרכים משפטיים ומס</li>
              <li><strong className="text-white">נתונים מצטברים:</strong> נתונים אנונימיים ומצטברים עשויים להישמר ללא הגבלה לניתוח</li>
            </ul>
          </div>
        </section>

        {/* Section 6 - Hebrew */}
        <section id="he-data-security" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. אבטחת מידע</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו מיישמים אמצעי אבטחה תקניים בתעשייה כולל:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>הצפנת HTTPS לכל העברת נתונים</li>
              <li>אחסון סיסמאות מוצפן באמצעות bcrypt</li>
              <li>סביבת הרצת קוד מאובטחת ומבודדת</li>
              <li>ביקורות אבטחה ועדכונים קבועים</li>
              <li>בקרות גישה ואימות</li>
              <li>הגבלת קצב למניעת שימוש לרעה</li>
            </ul>
            <p className="mt-4">בעוד אנו שואפים להגן על המידע שלך, אין שיטת העברה באינטרנט שהיא 100% מאובטחת. איננו יכולים להבטיח אבטחה מוחלטת.</p>
          </div>
        </section>

        {/* Section 7 - Hebrew */}
        <section id="he-your-rights" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. הזכויות שלך</h2>
          <div className="text-gray-300 space-y-4">
            <p>בהתאם למיקומך, ייתכן שיש לך את הזכויות הבאות:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">גישה:</strong> בקש עותק של הנתונים האישיים שלך</li>
              <li><strong className="text-white">תיקון:</strong> תקן נתונים לא מדויקים או לא שלמים</li>
              <li><strong className="text-white">מחיקה:</strong> בקש מחיקת הנתונים שלך ("הזכות להישכח")</li>
              <li><strong className="text-white">ניידות נתונים:</strong> קבל את הנתונים שלך בפורמט קריא למכונה</li>
              <li><strong className="text-white">הגבלת עיבוד:</strong> הגבל את האופן שבו אנו משתמשים בנתונים שלך</li>
              <li><strong className="text-white">התנגדות:</strong> התנגד לעיבוד המבוסס על אינטרסים לגיטימיים</li>
              <li><strong className="text-white">משיכת הסכמה:</strong> משוך הסכמה לשיווק בכל עת</li>
            </ul>
            <p className="mt-4">למימוש זכויות אלה, צור קשר בכתובת <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a>. נגיב תוך 30 יום.</p>
          </div>
        </section>

        {/* Section 8 - Hebrew */}
        <section id="he-children" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. פרטיות ילדים</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor מקבלת בברכה לומדים מכל הגילאים, כולל קטינים. עבור משתמשים מתחת לגיל 16:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>אנו ממליצים על פיקוח הורי או אפוטרופוס במהלך ההרשמה</li>
              <li>אנו אוספים רק מידע הנדרש למטרות חינוכיות</li>
              <li>איננו מכוונים פרסומות לקטינים ביודעין</li>
              <li>הורים או אפוטרופוסים יכולים לבקש גישה או מחיקה של נתוני ילדם</li>
            </ul>
            <p className="mt-4">אם אתה מאמין שילד סיפק מידע אישי ללא הסכמה מתאימה, אנא צור איתנו קשר מיד.</p>
          </div>
        </section>

        {/* Section 9 - Hebrew */}
        <section id="he-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. עוגיות ומעקב</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו משתמשים בעוגיות וטכנולוגיות דומות עבור:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">עוגיות חיוניות:</strong> נדרשות לאימות ואבטחה</li>
              <li><strong className="text-white">עוגיות פונקציונליות:</strong> זוכרות את ההעדפות שלך</li>
              <li><strong className="text-white">עוגיות אנליטיקה:</strong> מבינות כיצד משתמשים מתקשרים עם הפלטפורמה שלנו</li>
            </ul>
            <p className="mt-4">לפרטים נוספים, ראה את <Link href="/cookies" className="text-purple-400 hover:text-purple-300">מדיניות העוגיות</Link> שלנו.</p>
          </div>
        </section>

        {/* Section 10 - Hebrew */}
        <section id="he-marketing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">10. תקשורת שיווקית</h2>
          <div className="text-gray-300 space-y-4">
            <p>בהסכמתך, אנו עשויים לשלוח לך:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>הודעות על תכונות חדשות</li>
              <li>טיפים ומשאבי למידה</li>
              <li>הצעות מיוחדות ומבצעים</li>
            </ul>
            <p className="mt-4">תוכל לבטל הרשמה לאימיילים שיווקיים בכל עת על ידי:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>לחיצה על "הסר מרשימת התפוצה" בכל אימייל שיווקי</li>
              <li>עדכון העדפות ההתראות בהגדרות החשבון</li>
              <li>יצירת קשר בכתובת <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></li>
            </ul>
            <p className="mt-4">שים לב: עדיין תקבל התראות שירות חיוניות.</p>
          </div>
        </section>

        {/* Section 11 - Hebrew */}
        <section id="he-international" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">11. העברות מידע בינלאומיות</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor מופעלת מישראל. הנתונים שלך עשויים להיות מועברים ומעובדים במדינות מחוץ למקום מגוריך, כולל:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>ישראל (עיבוד נתונים ראשי)</li>
              <li>ארצות הברית (שירותי תשתית ענן)</li>
              <li>האיחוד האירופי (ספקי שירות מסוימים)</li>
            </ul>
            <p className="mt-4">כאשר נדרש, אנו מבטיחים שאמצעי הגנה מתאימים קיימים, כגון סעיפים חוזיים סטנדרטיים או החלטות התאמה.</p>
          </div>
        </section>

        {/* Section 12 - Hebrew */}
        <section id="he-changes-privacy" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">12. שינויים במדיניות זו</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים יפורסמו בדף זה עם תאריך "עודכן לאחרונה" מעודכן. עבור שינויים משמעותיים, נודיע לך באמצעות אימייל או הודעה בולטת בפלטפורמה שלנו.</p>
            <p className="mt-4">המשך השימוש ב-CodeTutor לאחר שינויים מהווה קבלה של המדיניות המעודכנת.</p>
          </div>
        </section>

        {/* Section 13 - Hebrew */}
        <section id="he-contact-privacy" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">13. צור קשר</h2>
          <div className="text-gray-300 space-y-4">
            <p>לשאלות הקשורות לפרטיות או למימוש הזכויות שלך, צור קשר:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">בקר נתונים:</strong> ליה מסיקה</p>
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
