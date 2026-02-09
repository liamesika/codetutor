import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | CodeTutor",
  description: "Terms of Service for CodeTutor - Java learning platform. Read our terms and conditions for using our educational services.",
  openGraph: {
    title: "Terms of Service | CodeTutor",
    description: "Terms of Service for CodeTutor - Java learning platform.",
  },
}

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", titleHe: "קבלת התנאים" },
  { id: "description", title: "Service Description", titleHe: "תיאור השירות" },
  { id: "accounts", title: "User Accounts", titleHe: "חשבונות משתמש" },
  { id: "minors", title: "Minors Policy", titleHe: "מדיניות קטינים" },
  { id: "subscriptions", title: "Subscriptions & Payments", titleHe: "מנויים ותשלומים" },
  { id: "refunds", title: "Refund Policy", titleHe: "מדיניות החזרים" },
  { id: "code-execution", title: "Code Execution & Demo", titleHe: "הרצת קוד ודמו" },
  { id: "ai-feedback", title: "AI-Based Feedback", titleHe: "משוב מבוסס בינה מלאכותית" },
  { id: "content", title: "User Content", titleHe: "תוכן משתמש" },
  { id: "ip", title: "Intellectual Property", titleHe: "קניין רוחני" },
  { id: "prohibited", title: "Prohibited Conduct", titleHe: "התנהגות אסורה" },
  { id: "termination", title: "Termination", titleHe: "סיום" },
  { id: "liability", title: "Limitation of Liability", titleHe: "הגבלת אחריות" },
  { id: "jurisdiction", title: "Governing Law", titleHe: "דין חל" },
  { id: "changes", title: "Changes to Terms", titleHe: "שינויים בתנאים" },
  { id: "contact", title: "Contact", titleHe: "יצירת קשר" },
]

export default function TermsPage() {
  return (
    <div className="py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-[#9CA3AF]">
            Last updated: December 28, 2024
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-12 p-6 rounded-2xl bg-[#0F0F23] border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm text-[#9CA3AF] hover:text-[#22D3EE] transition-colors"
              >
                {index + 1}. {section.title}
              </a>
            ))}
          </div>
        </nav>

        {/* English Content */}
        <article className="prose prose-invert max-w-none mb-16">
          <section id="acceptance" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              Welcome to CodeTutor, an educational SaaS platform operated by Lia Mesika (Business ID: 213754476), registered in Israel. By accessing or using our platform at codetutor.dev, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              These terms constitute a legally binding agreement between you and CodeTutor. Your continued use of the platform constitutes acceptance of any modifications to these terms.
            </p>
          </section>

          <section id="description" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              CodeTutor is an online educational platform designed to help users learn Java programming through:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Interactive coding challenges and exercises</li>
              <li>Real-time code execution in a secure sandbox environment</li>
              <li>AI-powered feedback and personalized learning recommendations</li>
              <li>Structured curriculum spanning 9 weeks of Java content</li>
              <li>Progress tracking, XP system, and gamification features</li>
              <li>Public demo access for trying the platform</li>
            </ul>
          </section>

          <section id="accounts" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
            </p>
          </section>

          <section id="minors" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">4. Minors Policy</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              CodeTutor is designed as an educational platform and welcomes users of all ages, including minors. However:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Users under 18 should have parental or guardian consent before creating an account</li>
              <li>Parents/guardians are responsible for monitoring their minor&apos;s use of the platform</li>
              <li>We do not knowingly collect personal information from children under 13 without parental consent</li>
              <li>Payment transactions for minors must be authorized by a parent or guardian</li>
            </ul>
          </section>

          <section id="subscriptions" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Subscriptions & Payments</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              CodeTutor offers both free and paid subscription tiers:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li><strong>Free Tier:</strong> Access to Week 1 content, basic features, and limited demo executions</li>
              <li><strong>PRO Tier:</strong> Full access to all 9 weeks, AI mentor features, and priority support</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              Payments are processed securely through PayPlus. By subscribing, you authorize recurring charges until cancellation. All prices are in the currency displayed at checkout and may include applicable taxes.
            </p>
          </section>

          <section id="refunds" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">6. Refund & Cancellation Policy</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              In accordance with the Israeli Consumer Protection Law (חוק הגנת הצרכן), 1981, consumers are entitled to cancel a remote transaction within 14 days of purchase, provided that the digital service has not been fully consumed. For full details, see our <a href="/cancellation" className="text-[#22D3EE] hover:underline">Cancellation Policy</a>.
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Full refund within 14 days of purchase, subject to a cancellation fee of 5% or ₪100, whichever is lower, as permitted by law</li>
              <li>If more than 50% of the digital content has been accessed, the right to cancel may not apply</li>
              <li>Pro-rated refund for service outages exceeding 48 consecutive hours</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              To request a cancellation or refund, contact us at <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a> or call <a href="tel:+972587878676" className="text-[#22D3EE] hover:underline">058-7878676</a>.
            </p>
          </section>

          <section id="code-execution" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">7. Code Execution & Demo</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              CodeTutor provides real-time Java code execution through secure sandboxed environments:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Code is executed in isolated Docker containers with strict resource limits</li>
              <li>Execution timeouts are enforced (25 seconds maximum)</li>
              <li>Certain operations are blocked for security (file system access, network calls, etc.)</li>
              <li>Demo users have limited executions (5 per minute) without an account</li>
              <li>We reserve the right to suspend access for abuse of execution resources</li>
            </ul>
          </section>

          <section id="ai-feedback" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">8. AI-Based Feedback</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              CodeTutor uses artificial intelligence to provide:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Personalized learning recommendations</li>
              <li>Adaptive difficulty adjustments</li>
              <li>Code feedback and hints</li>
              <li>Performance analytics and skill gap analysis</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              AI-generated feedback is provided for educational purposes and should not be considered professional advice. We continuously improve our AI systems but do not guarantee perfect accuracy.
            </p>
          </section>

          <section id="content" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">9. User Content</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              When you submit code or content to CodeTutor:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>You retain ownership of your original code submissions</li>
              <li>You grant us a license to store, process, and analyze your code for educational purposes</li>
              <li>You are responsible for ensuring your code does not infringe third-party rights</li>
              <li>We may use anonymized, aggregated data to improve our services</li>
            </ul>
          </section>

          <section id="ip" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">10. Intellectual Property</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              All CodeTutor content, including curriculum, challenges, design, and branding, is owned by Lia Mesika and protected by intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Copy, modify, or distribute our educational content</li>
              <li>Reverse engineer our platform or algorithms</li>
              <li>Use our branding without written permission</li>
              <li>Scrape or automatically collect data from our platform</li>
            </ul>
          </section>

          <section id="prohibited" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">11. Prohibited Conduct</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Submit malicious code designed to harm our systems or users</li>
              <li>Attempt to bypass security measures or rate limits</li>
              <li>Share account credentials or use multiple accounts fraudulently</li>
              <li>Harass other users or staff</li>
              <li>Use the platform for illegal purposes</li>
              <li>Resell or commercially exploit access to our services</li>
            </ul>
          </section>

          <section id="termination" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              You may terminate your account at any time through account settings or by contacting us. We may terminate or suspend your access:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>For violation of these terms</li>
              <li>For fraudulent or abusive behavior</li>
              <li>For non-payment of subscription fees</li>
              <li>At our discretion with reasonable notice</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              Upon termination, your access to paid features will cease. You may request export of your data within 30 days of termination.
            </p>
          </section>

          <section id="liability" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">13. Limitation of Liability</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>CodeTutor is provided &ldquo;as is&rdquo; without warranties of any kind</li>
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>Our total liability shall not exceed the amount you paid in the 12 months preceding the claim</li>
              <li>We are not responsible for third-party services or content</li>
            </ul>
          </section>

          <section id="jurisdiction" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">14. Governing Law</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              These Terms are governed by the laws of the State of Israel, without regard to conflict of law principles. Any disputes shall be resolved in the competent courts of Tel Aviv-Jaffa, Israel. For EU users, this does not affect your statutory rights under applicable consumer protection laws.
            </p>
          </section>

          <section id="changes" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">15. Changes to Terms</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              We may update these Terms from time to time. We will notify registered users of material changes via email or platform notification. Continued use after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section id="contact" className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">16. Contact</h2>
            <p className="text-[#D1D5DB] leading-relaxed">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-4 rounded-xl bg-[#0F0F23] border border-white/10">
              <p className="text-[#D1D5DB]"><strong>Lia Mesika</strong></p>
              <p className="text-[#D1D5DB]">Business ID: 213754476</p>
              <p className="text-[#D1D5DB]">Address: Or Akiva, Israel</p>
              <p className="text-[#D1D5DB]">Phone: <a href="tel:+972587878676" className="text-[#22D3EE] hover:underline">058-7878676</a></p>
              <p className="text-[#D1D5DB]">Email: <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a></p>
            </div>
          </section>
        </article>

        {/* Hebrew Divider */}
        <div className="border-t border-white/10 my-12 pt-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" dir="rtl">
              תנאי שימוש
            </h1>
            <p className="text-[#9CA3AF]" dir="rtl">
              עדכון אחרון: 28 בדצמבר 2024
            </p>
          </div>

          {/* Hebrew Table of Contents */}
          <nav className="mb-12 p-6 rounded-2xl bg-[#0F0F23] border border-white/10" dir="rtl">
            <h2 className="text-lg font-semibold text-white mb-4">תוכן עניינים</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {sections.map((section, index) => (
                <a
                  key={`he-${section.id}`}
                  href={`#he-${section.id}`}
                  className="text-sm text-[#9CA3AF] hover:text-[#22D3EE] transition-colors"
                >
                  {index + 1}. {section.titleHe}
                </a>
              ))}
            </div>
          </nav>

          {/* Hebrew Content */}
          <article className="prose prose-invert max-w-none" dir="rtl">
            <section id="he-acceptance" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">1. קבלת התנאים</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                ברוכים הבאים ל-CodeTutor, פלטפורמת SaaS חינוכית המופעלת על ידי ליה מסיקה (מספר עוסק: 213754476), הרשומה בישראל. בגישה או שימוש בפלטפורמה שלנו ב-codetutor.dev, אתם מסכימים להיות מחויבים לתנאי שימוש אלה. אם אינכם מסכימים לתנאים אלה, אנא אל תשתמשו בשירותים שלנו.
              </p>
              <p className="text-[#D1D5DB] leading-relaxed mt-4">
                תנאים אלה מהווים הסכם מחייב משפטית בינכם לבין CodeTutor. המשך השימוש בפלטפורמה מהווה הסכמה לכל שינוי בתנאים אלה.
              </p>
            </section>

            <section id="he-description" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">2. תיאור השירות</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                CodeTutor היא פלטפורמה חינוכית מקוונת שנועדה לעזור למשתמשים ללמוד תכנות Java באמצעות:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>אתגרי קוד ותרגילים אינטראקטיביים</li>
                <li>הרצת קוד בזמן אמת בסביבת sandbox מאובטחת</li>
                <li>משוב מונחה בינה מלאכותית והמלצות למידה מותאמות אישית</li>
                <li>תוכנית לימודים מובנית של 9 שבועות של תוכן Java</li>
                <li>מעקב התקדמות, מערכת XP ותכונות גיימיפיקציה</li>
                <li>גישה ציבורית לדמו לניסיון הפלטפורמה</li>
              </ul>
            </section>

            <section id="he-accounts" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">3. חשבונות משתמש</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                כדי לגשת לתכונות מסוימות, עליכם ליצור חשבון. אתם מסכימים:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>לספק מידע רישום מדויק ומלא</li>
                <li>לשמור על אבטחת פרטי הכניסה לחשבון שלכם</li>
                <li>להודיע לנו מיד על כל גישה לא מורשית</li>
                <li>לקבל אחריות על כל הפעילויות תחת החשבון שלכם</li>
              </ul>
              <p className="text-[#D1D5DB] leading-relaxed mt-4">
                אנו שומרים לעצמנו את הזכות להשעות או לסיים חשבונות המפרים תנאים אלה או עוסקים בפעילות הונאה.
              </p>
            </section>

            <section id="he-minors" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">4. מדיניות קטינים</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                CodeTutor מתוכננת כפלטפורמה חינוכית ומקבלת בברכה משתמשים מכל הגילאים, כולל קטינים. עם זאת:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>משתמשים מתחת לגיל 18 צריכים הסכמת הורה או אפוטרופוס לפני יצירת חשבון</li>
                <li>הורים/אפוטרופוסים אחראים לפקח על השימוש של הקטין בפלטפורמה</li>
                <li>אנחנו לא אוספים ביודעין מידע אישי מילדים מתחת לגיל 13 ללא הסכמת הורים</li>
                <li>עסקאות תשלום עבור קטינים חייבות להיות מאושרות על ידי הורה או אפוטרופוס</li>
              </ul>
            </section>

            <section id="he-subscriptions" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">5. מנויים ותשלומים</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                CodeTutor מציעה רמות מנוי חינמיות ובתשלום:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li><strong>רמה חינמית:</strong> גישה לתוכן שבוע 1, תכונות בסיסיות והרצות דמו מוגבלות</li>
                <li><strong>רמת PRO:</strong> גישה מלאה לכל 9 השבועות, תכונות מנטור AI ותמיכה מועדפת</li>
              </ul>
              <p className="text-[#D1D5DB] leading-relaxed mt-4">
                התשלומים מעובדים באופן מאובטח דרך PayPlus. בהרשמה למנוי, אתם מאשרים חיובים חוזרים עד לביטול. כל המחירים הם במטבע המוצג בקופה ועשויים לכלול מיסים החלים.
              </p>
            </section>

            <section id="he-refunds" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">6. מדיניות ביטול עסקה והחזרים</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                בהתאם לחוק הגנת הצרכן, התשמ&quot;א-1981, צרכן רשאי לבטל עסקת רכש מרחוק תוך 14 ימים ממועד הרכישה, בתנאי שהשירות הדיגיטלי לא נצרך במלואו. לפרטים מלאים ראו את <a href="/cancellation" className="text-[#22D3EE] hover:underline">תקנון ביטול עסקה</a>.
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>החזר מלא תוך 14 ימים מהרכישה, בניכוי דמי ביטול בסך 5% ממחיר העסקה או ₪100 — הנמוך מביניהם, כמותר על פי חוק</li>
                <li>אם נצרכו למעלה מ-50% מהתוכן הדיגיטלי, ייתכן שזכות הביטול לא תחול</li>
                <li>החזר יחסי עבור הפסקות שירות העולות על 48 שעות רצופות</li>
              </ul>
              <p className="text-[#D1D5DB] leading-relaxed mt-4">
                לבקשת ביטול או החזר, צרו קשר בדוא&quot;ל <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a> או בטלפון <a href="tel:+972587878676" className="text-[#22D3EE] hover:underline">058-7878676</a>.
              </p>
            </section>

            <section id="he-code-execution" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">7. הרצת קוד ודמו</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                CodeTutor מספקת הרצת קוד Java בזמן אמת דרך סביבות sandbox מאובטחות:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>הקוד מורץ בקונטיינרים מבודדים של Docker עם מגבלות משאבים קפדניות</li>
                <li>מאולצים זמני קצבה להרצה (מקסימום 25 שניות)</li>
                <li>פעולות מסוימות חסומות לצורכי אבטחה (גישה למערכת קבצים, שיחות רשת וכו&apos;)</li>
                <li>למשתמשי דמו יש הרצות מוגבלות (5 בדקה) ללא חשבון</li>
                <li>אנו שומרים לעצמנו את הזכות להשעות גישה בגין שימוש לרעה במשאבי הרצה</li>
              </ul>
            </section>

            <section id="he-ai-feedback" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">8. משוב מבוסס בינה מלאכותית</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                CodeTutor משתמשת בבינה מלאכותית לספק:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>המלצות למידה מותאמות אישית</li>
                <li>התאמות רמת קושי אדפטיביות</li>
                <li>משוב קוד ורמזים</li>
                <li>אנליטיקת ביצועים וניתוח פערי מיומנויות</li>
              </ul>
              <p className="text-[#D1D5DB] leading-relaxed mt-4">
                משוב שנוצר על ידי בינה מלאכותית מסופק למטרות חינוכיות ואין לראות בו ייעוץ מקצועי. אנו משפרים באופן מתמיד את מערכות הבינה המלאכותית שלנו אך איננו מבטיחים דיוק מושלם.
              </p>
            </section>

            <section id="he-content" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">9. תוכן משתמש</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                כאשר אתם שולחים קוד או תוכן ל-CodeTutor:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>אתם שומרים על הבעלות על הגשות הקוד המקוריות שלכם</li>
                <li>אתם מעניקים לנו רישיון לאחסן, לעבד ולנתח את הקוד שלכם למטרות חינוכיות</li>
                <li>אתם אחראים לוודא שהקוד שלכם אינו מפר זכויות צד שלישי</li>
                <li>אנו עשויים להשתמש בנתונים אנונימיים ומצטברים לשיפור השירותים שלנו</li>
              </ul>
            </section>

            <section id="he-ip" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">10. קניין רוחני</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                כל תוכן CodeTutor, כולל תוכנית הלימודים, האתגרים, העיצוב והמיתוג, שייך לליה מסיקה ומוגן על ידי חוקי קניין רוחני. אינכם רשאים:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>להעתיק, לשנות או להפיץ את התוכן החינוכי שלנו</li>
                <li>לבצע הנדסה לאחור של הפלטפורמה או האלגוריתמים שלנו</li>
                <li>להשתמש במיתוג שלנו ללא אישור בכתב</li>
                <li>לאסוף נתונים באופן אוטומטי מהפלטפורמה שלנו</li>
              </ul>
            </section>

            <section id="he-prohibited" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">11. התנהגות אסורה</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                אתם מסכימים שלא:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>לשלוח קוד זדוני שנועד לפגוע במערכות או במשתמשים שלנו</li>
                <li>לנסות לעקוף אמצעי אבטחה או מגבלות קצב</li>
                <li>לשתף פרטי כניסה לחשבון או להשתמש במספר חשבונות בהונאה</li>
                <li>להטריד משתמשים או צוות אחרים</li>
                <li>להשתמש בפלטפורמה למטרות בלתי חוקיות</li>
                <li>למכור מחדש או לנצל מסחרית גישה לשירותים שלנו</li>
              </ul>
            </section>

            <section id="he-termination" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">12. סיום</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                אתם יכולים לסיים את החשבון שלכם בכל עת דרך הגדרות החשבון או על ידי יצירת קשר איתנו. אנו עשויים לסיים או להשעות את הגישה שלכם:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>בגין הפרה של תנאים אלה</li>
                <li>בגין התנהגות הונאתית או פוגענית</li>
                <li>בגין אי תשלום דמי מנוי</li>
                <li>לפי שיקול דעתנו עם הודעה סבירה</li>
              </ul>
              <p className="text-[#D1D5DB] leading-relaxed mt-4">
                עם סיום, הגישה שלכם לתכונות בתשלום תיפסק. אתם יכולים לבקש ייצוא הנתונים שלכם תוך 30 יום מהסיום.
              </p>
            </section>

            <section id="he-liability" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">13. הגבלת אחריות</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                במידה המרבית המותרת על פי חוק:
              </p>
              <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
                <li>CodeTutor מסופקת &ldquo;כמות שהיא&rdquo; ללא אחריות מכל סוג</li>
                <li>איננו אחראים לנזקים עקיפים, מקריים או תוצאתיים</li>
                <li>האחריות הכוללת שלנו לא תעלה על הסכום ששילמתם ב-12 החודשים שקדמו לתביעה</li>
                <li>איננו אחראים לשירותים או תוכן של צד שלישי</li>
              </ul>
            </section>

            <section id="he-jurisdiction" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">14. דין חל</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                תנאים אלה כפופים לחוקי מדינת ישראל, ללא התייחסות לעקרונות ניגוד דינים. כל מחלוקת תיפתר בבתי המשפט המוסמכים של תל אביב-יפו, ישראל. עבור משתמשים מהאיחוד האירופי, זה אינו משפיע על הזכויות החוקיות שלכם על פי חוקי הגנת הצרכן החלים.
              </p>
            </section>

            <section id="he-changes" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">15. שינויים בתנאים</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                אנו עשויים לעדכן תנאים אלה מעת לעת. נודיע למשתמשים רשומים על שינויים מהותיים באמצעות דוא&quot;ל או הודעה בפלטפורמה. המשך השימוש לאחר שינויים מהווה קבלת התנאים המתוקנים.
              </p>
            </section>

            <section id="he-contact" className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">16. יצירת קשר</h2>
              <p className="text-[#D1D5DB] leading-relaxed">
                לשאלות בנוגע לתנאי שימוש אלה, אנא צרו קשר:
              </p>
              <div className="mt-4 p-4 rounded-xl bg-[#0F0F23] border border-white/10">
                <p className="text-[#D1D5DB]"><strong>ליה מסיקה</strong></p>
                <p className="text-[#D1D5DB]">מספר עוסק: 213754476</p>
                <p className="text-[#D1D5DB]">כתובת: אור עקיבא, ישראל</p>
                <p className="text-[#D1D5DB]">טלפון: <a href="tel:+972587878676" className="text-[#22D3EE] hover:underline">058-7878676</a></p>
                <p className="text-[#D1D5DB]">דוא&quot;ל: <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a></p>
              </div>
            </section>
          </article>
        </div>
      </div>
    </div>
  )
}
