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
            <li><a href="#ai-transparency" className="hover:text-purple-400 transition-colors">3. AI and Automated Processing</a></li>
            <li><a href="#legal-basis" className="hover:text-purple-400 transition-colors">4. Legal Basis for Processing (GDPR)</a></li>
            <li><a href="#data-sharing" className="hover:text-purple-400 transition-colors">5. Data Sharing and Third Parties</a></li>
            <li><a href="#data-retention" className="hover:text-purple-400 transition-colors">6. Data Retention</a></li>
            <li><a href="#data-security" className="hover:text-purple-400 transition-colors">7. Data Security</a></li>
            <li><a href="#your-rights" className="hover:text-purple-400 transition-colors">8. Your Rights</a></li>
            <li><a href="#children" className="hover:text-purple-400 transition-colors">9. Children's Privacy (COPPA Compliance)</a></li>
            <li><a href="#cookies" className="hover:text-purple-400 transition-colors">10. Cookies and Tracking</a></li>
            <li><a href="#marketing" className="hover:text-purple-400 transition-colors">11. Marketing Communications</a></li>
            <li><a href="#international" className="hover:text-purple-400 transition-colors">12. International Data Transfers</a></li>
            <li><a href="#changes-privacy" className="hover:text-purple-400 transition-colors">13. Changes to This Policy</a></li>
            <li><a href="#contact-privacy" className="hover:text-purple-400 transition-colors">14. Contact Us</a></li>
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

        {/* Section 3 - AI Transparency */}
        <section id="ai-transparency" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. AI and Automated Processing</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor uses artificial intelligence (AI) and automated processing to enhance your learning experience. We are committed to transparency about how these technologies work.</p>

            <h3 className="text-lg font-medium text-white mt-4">3.1 How We Use AI</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Adaptive Learning:</strong> AI algorithms analyze your performance, learning patterns, and skill levels to personalize question difficulty and recommend appropriate content</li>
              <li><strong className="text-white">Code Feedback:</strong> Automated systems evaluate your code submissions, providing instant feedback on correctness, style, and best practices</li>
              <li><strong className="text-white">Hint Generation:</strong> AI may generate contextual hints based on common mistakes and your current progress</li>
              <li><strong className="text-white">Progress Tracking:</strong> Algorithms calculate skill proficiency and suggest next steps in your learning journey</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.2 Data Used by AI</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Code submissions and solutions you write</li>
              <li>Time spent on questions and topics</li>
              <li>Correct and incorrect attempts</li>
              <li>Learning progression patterns</li>
              <li>Skill assessment scores</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.3 AI Safeguards</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">No Third-Party Training:</strong> Your code submissions and personal data are NOT used to train external AI models</li>
              <li><strong className="text-white">Local Processing:</strong> Adaptive learning calculations are performed on our secure servers, not shared externally</li>
              <li><strong className="text-white">Human Oversight:</strong> Critical decisions affecting your account or access are reviewed by humans</li>
              <li><strong className="text-white">Opt-Out Options:</strong> You may request reduced AI personalization by contacting us</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.4 Your Rights Regarding AI</h3>
            <p>Under GDPR Article 22, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request human review of significant automated decisions</li>
              <li>Obtain meaningful information about the logic involved in automated processing</li>
              <li>Express your point of view and contest automated decisions</li>
            </ul>
            <p className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <strong className="text-blue-400">Important:</strong> CodeTutor does not make legally significant decisions (e.g., employment, credit, housing) based solely on automated processing.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="legal-basis" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Legal Basis for Processing (GDPR)</h2>
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

        {/* Section 5 */}
        <section id="data-sharing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Third Parties</h2>
          <div className="text-gray-300 space-y-4">
            <p>We may share your information with:</p>
            <h3 className="text-lg font-medium text-white mt-4">5.1 Service Providers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">PayPlus:</strong> Payment processing (Israel-based)</li>
              <li><strong className="text-white">Vercel:</strong> Hosting and infrastructure</li>
              <li><strong className="text-white">Neon:</strong> Database services</li>
              <li><strong className="text-white">Sentry:</strong> Error tracking and monitoring</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">5.2 Legal Requirements</h3>
            <p>We may disclose information when required by law, court order, or to protect our rights and safety.</p>
            <h3 className="text-lg font-medium text-white mt-4">5.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, user data may be transferred to the new entity.</p>
            <p className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <strong className="text-green-400">We do not sell your personal information.</strong>
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="data-retention" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
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

        {/* Section 7 */}
        <section id="data-security" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. Data Security</h2>
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

        {/* Section 8 */}
        <section id="your-rights" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
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

        {/* Section 9 - Children's Privacy (COPPA Compliance) */}
        <section id="children" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy (COPPA Compliance)</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor is an educational platform designed for learners of all ages. We are committed to protecting children's privacy in compliance with the Children's Online Privacy Protection Act (COPPA) and similar regulations.</p>

            <h3 className="text-lg font-medium text-white mt-4">9.1 Age Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Under 13 Years Old:</strong> Children under 13 must have verifiable parental consent before creating an account or using our services</li>
              <li><strong className="text-white">13-16 Years Old:</strong> Parental or guardian oversight is strongly recommended during registration and use</li>
              <li><strong className="text-white">16 and Older:</strong> Users may create and manage accounts independently</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">9.2 Verifiable Parental Consent</h3>
            <p>For children under 13, we require verifiable parental consent before collecting personal information. We may verify consent through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email confirmation from a parent's email address</li>
              <li>Signed consent form submitted electronically or by mail</li>
              <li>Video conference verification with a parent or guardian</li>
              <li>Credit card verification (with a nominal charge refunded immediately)</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">9.3 Information Collected from Children</h3>
            <p>For users under 13, we limit data collection to what is strictly necessary for educational purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Username (may be a pseudonym, not requiring real name)</li>
              <li>Parent/guardian email address (for consent and communication)</li>
              <li>Educational progress and code submissions</li>
              <li>We do NOT collect: photos, location data, phone numbers, or social media profiles from children</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">9.4 Parental Rights</h3>
            <p>Parents and guardians have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Review their child's personal information</li>
              <li>Request deletion of their child's account and data</li>
              <li>Refuse further collection or use of their child's information</li>
              <li>Consent to collection without consenting to third-party disclosure</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a> with proof of parental relationship.</p>

            <h3 className="text-lg font-medium text-white mt-4">9.5 Child Safety Measures</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>No advertising or marketing is targeted at children</li>
              <li>No social features that allow direct communication between children and unknown users</li>
              <li>No collection of geolocation data from children</li>
              <li>No sharing of children's data with third parties except as necessary for service operation</li>
            </ul>

            <p className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <strong className="text-yellow-400">Report Concern:</strong> If you believe a child under 13 has provided personal information without parental consent, please contact us immediately at <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a>. We will promptly investigate and delete the information if appropriate.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">10. Cookies and Tracking</h2>
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

        {/* Section 11 */}
        <section id="marketing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">11. Marketing Communications</h2>
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

        {/* Section 12 */}
        <section id="international" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">12. International Data Transfers</h2>
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

        {/* Section 13 */}
        <section id="changes-privacy" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to This Policy</h2>
          <div className="text-gray-300 space-y-4">
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. For significant changes, we will notify you via email or a prominent notice on our platform.</p>
            <p className="mt-4">Continued use of CodeTutor after changes constitutes acceptance of the updated policy.</p>
          </div>
        </section>

        {/* Section 14 */}
        <section id="contact-privacy" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Us</h2>
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
            <li><a href="#he-ai-transparency" className="hover:text-purple-400 transition-colors">3. בינה מלאכותית ועיבוד אוטומטי</a></li>
            <li><a href="#he-legal-basis" className="hover:text-purple-400 transition-colors">4. בסיס משפטי לעיבוד (GDPR)</a></li>
            <li><a href="#he-data-sharing" className="hover:text-purple-400 transition-colors">5. שיתוף מידע וצדדים שלישיים</a></li>
            <li><a href="#he-data-retention" className="hover:text-purple-400 transition-colors">6. שמירת מידע</a></li>
            <li><a href="#he-data-security" className="hover:text-purple-400 transition-colors">7. אבטחת מידע</a></li>
            <li><a href="#he-your-rights" className="hover:text-purple-400 transition-colors">8. הזכויות שלך</a></li>
            <li><a href="#he-children" className="hover:text-purple-400 transition-colors">9. פרטיות ילדים (תאימות COPPA)</a></li>
            <li><a href="#he-cookies" className="hover:text-purple-400 transition-colors">10. עוגיות ומעקב</a></li>
            <li><a href="#he-marketing" className="hover:text-purple-400 transition-colors">11. תקשורת שיווקית</a></li>
            <li><a href="#he-international" className="hover:text-purple-400 transition-colors">12. העברות מידע בינלאומיות</a></li>
            <li><a href="#he-changes-privacy" className="hover:text-purple-400 transition-colors">13. שינויים במדיניות זו</a></li>
            <li><a href="#he-contact-privacy" className="hover:text-purple-400 transition-colors">14. צור קשר</a></li>
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

        {/* Section 3 - Hebrew - AI Transparency */}
        <section id="he-ai-transparency" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. בינה מלאכותית ועיבוד אוטומטי</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor משתמשת בבינה מלאכותית (AI) ועיבוד אוטומטי לשיפור חווית הלמידה שלך. אנו מחויבים לשקיפות לגבי אופן פעולת טכנולוגיות אלה.</p>

            <h3 className="text-lg font-medium text-white mt-4">3.1 כיצד אנו משתמשים ב-AI</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">למידה אדפטיבית:</strong> אלגוריתמי AI מנתחים את הביצועים שלך, דפוסי הלמידה ורמות המיומנות להתאמה אישית של רמת הקושי והמלצה על תוכן מתאים</li>
              <li><strong className="text-white">משוב על קוד:</strong> מערכות אוטומטיות מעריכות את הגשות הקוד שלך, ומספקות משוב מיידי על נכונות, סגנון ושיטות עבודה מומלצות</li>
              <li><strong className="text-white">יצירת רמזים:</strong> AI עשוי ליצור רמזים הקשריים בהתבסס על טעויות נפוצות וההתקדמות הנוכחית שלך</li>
              <li><strong className="text-white">מעקב התקדמות:</strong> אלגוריתמים מחשבים מיומנות ומציעים את הצעדים הבאים במסע הלמידה שלך</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.2 נתונים המשמשים את ה-AI</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>הגשות קוד ופתרונות שאתה כותב</li>
              <li>זמן שהושקע בשאלות ונושאים</li>
              <li>ניסיונות נכונים ושגויים</li>
              <li>דפוסי התקדמות למידה</li>
              <li>ציוני הערכת מיומנויות</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.3 אמצעי הגנה של AI</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">ללא אימון צד שלישי:</strong> הגשות הקוד והנתונים האישיים שלך אינם משמשים לאימון מודלי AI חיצוניים</li>
              <li><strong className="text-white">עיבוד מקומי:</strong> חישובי למידה אדפטיבית מבוצעים בשרתים המאובטחים שלנו, ללא שיתוף חיצוני</li>
              <li><strong className="text-white">פיקוח אנושי:</strong> החלטות קריטיות המשפיעות על החשבון או הגישה שלך נבדקות על ידי בני אדם</li>
              <li><strong className="text-white">אפשרויות ביטול:</strong> תוכל לבקש הפחתת התאמה אישית של AI על ידי פנייה אלינו</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.4 הזכויות שלך בנוגע ל-AI</h3>
            <p>לפי סעיף 22 של GDPR, יש לך זכות:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>לבקש סקירה אנושית של החלטות אוטומטיות משמעותיות</li>
              <li>לקבל מידע משמעותי על הלוגיקה המעורבת בעיבוד אוטומטי</li>
              <li>להביע את נקודת המבט שלך ולערער על החלטות אוטומטיות</li>
            </ul>
            <p className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <strong className="text-blue-400">חשוב:</strong> CodeTutor אינה מקבלת החלטות משמעותיות מבחינה משפטית (למשל, תעסוקה, אשראי, דיור) המבוססות אך ורק על עיבוד אוטומטי.
            </p>
          </div>
        </section>

        {/* Section 4 - Hebrew */}
        <section id="he-legal-basis" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. בסיס משפטי לעיבוד (GDPR)</h2>
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

        {/* Section 5 - Hebrew */}
        <section id="he-data-sharing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. שיתוף מידע וצדדים שלישיים</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו עשויים לשתף את המידע שלך עם:</p>
            <h3 className="text-lg font-medium text-white mt-4">5.1 ספקי שירות</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">PayPlus:</strong> עיבוד תשלומים (מבוסס ישראל)</li>
              <li><strong className="text-white">Vercel:</strong> אירוח ותשתית</li>
              <li><strong className="text-white">Neon:</strong> שירותי מסד נתונים</li>
              <li><strong className="text-white">Sentry:</strong> מעקב שגיאות וניטור</li>
            </ul>
            <h3 className="text-lg font-medium text-white mt-4">5.2 דרישות משפטיות</h3>
            <p>אנו עשויים לחשוף מידע כאשר נדרש על פי חוק, צו בית משפט, או להגנה על הזכויות והבטיחות שלנו.</p>
            <h3 className="text-lg font-medium text-white mt-4">5.3 העברות עסקיות</h3>
            <p>במקרה של מיזוג, רכישה או מכירת נכסים, נתוני משתמשים עשויים להיות מועברים לגוף החדש.</p>
            <p className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <strong className="text-green-400">אנו לא מוכרים את המידע האישי שלך.</strong>
            </p>
          </div>
        </section>

        {/* Section 6 - Hebrew */}
        <section id="he-data-retention" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. שמירת מידע</h2>
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

        {/* Section 7 - Hebrew */}
        <section id="he-data-security" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. אבטחת מידע</h2>
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

        {/* Section 8 - Hebrew */}
        <section id="he-your-rights" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. הזכויות שלך</h2>
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

        {/* Section 9 - Hebrew - Children's Privacy (COPPA Compliance) */}
        <section id="he-children" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. פרטיות ילדים (תאימות COPPA)</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor היא פלטפורמה חינוכית המיועדת ללומדים בכל הגילאים. אנו מחויבים להגנה על פרטיות ילדים בהתאם לחוק הגנת הפרטיות המקוונת לילדים (COPPA) ותקנות דומות.</p>

            <h3 className="text-lg font-medium text-white mt-4">9.1 דרישות גיל</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">מתחת לגיל 13:</strong> ילדים מתחת לגיל 13 חייבים לקבל הסכמת הורים מאומתת לפני יצירת חשבון או שימוש בשירותים שלנו</li>
              <li><strong className="text-white">גילאי 13-16:</strong> פיקוח הורי או אפוטרופוס מומלץ מאוד במהלך ההרשמה והשימוש</li>
              <li><strong className="text-white">16 ומעלה:</strong> משתמשים יכולים ליצור ולנהל חשבונות באופן עצמאי</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">9.2 הסכמת הורים מאומתת</h3>
            <p>עבור ילדים מתחת לגיל 13, אנו דורשים הסכמת הורים מאומתת לפני איסוף מידע אישי. אנו עשויים לאמת הסכמה באמצעות:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>אישור אימייל מכתובת אימייל של הורה</li>
              <li>טופס הסכמה חתום שנשלח אלקטרונית או בדואר</li>
              <li>אימות וידאו קונפרנס עם הורה או אפוטרופוס</li>
              <li>אימות כרטיס אשראי (עם חיוב סמלי שמוחזר מיד)</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">9.3 מידע שנאסף מילדים</h3>
            <p>עבור משתמשים מתחת לגיל 13, אנו מגבילים את איסוף הנתונים למה שנדרש בהחלט למטרות חינוכיות:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>שם משתמש (יכול להיות כינוי, ללא צורך בשם אמיתי)</li>
              <li>כתובת אימייל של הורה/אפוטרופוס (להסכמה ותקשורת)</li>
              <li>התקדמות חינוכית והגשות קוד</li>
              <li>אנו לא אוספים: תמונות, נתוני מיקום, מספרי טלפון או פרופילי רשתות חברתיות מילדים</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">9.4 זכויות הורים</h3>
            <p>להורים ואפוטרופוסים יש את הזכות:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>לעיין במידע האישי של ילדם</li>
              <li>לבקש מחיקת החשבון והנתונים של ילדם</li>
              <li>לסרב לאיסוף או שימוש נוסף במידע של ילדם</li>
              <li>להסכים לאיסוף ללא הסכמה לחשיפה לצד שלישי</li>
            </ul>
            <p className="mt-2">למימוש זכויות אלה, צור קשר בכתובת <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a> עם הוכחה ליחסי הורות.</p>

            <h3 className="text-lg font-medium text-white mt-4">9.5 אמצעי בטיחות לילדים</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>אין פרסום או שיווק המכוון לילדים</li>
              <li>אין תכונות חברתיות המאפשרות תקשורת ישירה בין ילדים למשתמשים לא מוכרים</li>
              <li>אין איסוף נתוני מיקום גיאוגרפי מילדים</li>
              <li>אין שיתוף נתוני ילדים עם צדדים שלישיים אלא אם נדרש להפעלת השירות</li>
            </ul>

            <p className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <strong className="text-yellow-400">דיווח על חשש:</strong> אם אתה מאמין שילד מתחת לגיל 13 סיפק מידע אישי ללא הסכמת הורים, אנא צור קשר מיד בכתובת <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a>. נחקור במהירות ונמחק את המידע במידת הצורך.
            </p>
          </div>
        </section>

        {/* Section 10 - Hebrew */}
        <section id="he-cookies" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">10. עוגיות ומעקב</h2>
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

        {/* Section 11 - Hebrew */}
        <section id="he-marketing" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">11. תקשורת שיווקית</h2>
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

        {/* Section 12 - Hebrew */}
        <section id="he-international" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">12. העברות מידע בינלאומיות</h2>
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

        {/* Section 13 - Hebrew */}
        <section id="he-changes-privacy" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">13. שינויים במדיניות זו</h2>
          <div className="text-gray-300 space-y-4">
            <p>אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים יפורסמו בדף זה עם תאריך "עודכן לאחרונה" מעודכן. עבור שינויים משמעותיים, נודיע לך באמצעות אימייל או הודעה בולטת בפלטפורמה שלנו.</p>
            <p className="mt-4">המשך השימוש ב-CodeTutor לאחר שינויים מהווה קבלה של המדיניות המעודכנת.</p>
          </div>
        </section>

        {/* Section 14 - Hebrew */}
        <section id="he-contact-privacy" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">14. צור קשר</h2>
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
