"use client"

import Link from "next/link"

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* English Version */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Information Security Policy</h1>
        <p className="text-gray-400 mb-8">Last Updated: December 28, 2025</p>

        {/* Table of Contents */}
        <nav className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Table of Contents</h2>
          <ol className="space-y-2 text-gray-300">
            <li><a href="#commitment" className="hover:text-purple-400 transition-colors">1. Our Commitment to Security</a></li>
            <li><a href="#infrastructure" className="hover:text-purple-400 transition-colors">2. Infrastructure Security</a></li>
            <li><a href="#data-protection" className="hover:text-purple-400 transition-colors">3. Data Protection</a></li>
            <li><a href="#code-execution" className="hover:text-purple-400 transition-colors">4. Code Execution Security</a></li>
            <li><a href="#authentication" className="hover:text-purple-400 transition-colors">5. Authentication & Access Control</a></li>
            <li><a href="#monitoring" className="hover:text-purple-400 transition-colors">6. Monitoring & Incident Response</a></li>
            <li><a href="#your-responsibility" className="hover:text-purple-400 transition-colors">7. Your Security Responsibilities</a></li>
            <li><a href="#reporting" className="hover:text-purple-400 transition-colors">8. Reporting Security Issues</a></li>
            <li><a href="#contact-security" className="hover:text-purple-400 transition-colors">9. Contact Us</a></li>
          </ol>
        </nav>

        {/* Section 1 */}
        <section id="commitment" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Our Commitment to Security</h2>
          <div className="text-gray-300 space-y-4">
            <p>At CodeTutor, we take the security of your data and our platform seriously. This policy outlines the security measures we implement to protect your information and ensure a safe learning environment.</p>
            <p>We continuously review and update our security practices to address emerging threats and maintain the highest standards of protection.</p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="infrastructure" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Infrastructure Security</h2>
          <div className="text-gray-300 space-y-4">
            <h3 className="text-lg font-medium text-white mt-4">2.1 Hosting & Cloud Security</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Vercel:</strong> Our application is hosted on Vercel's secure, globally distributed infrastructure with automatic DDoS protection</li>
              <li><strong className="text-white">Neon PostgreSQL:</strong> Database hosted on Neon's secure cloud with encryption at rest and in transit</li>
              <li><strong className="text-white">Edge Network:</strong> Global CDN with security at the edge</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">2.2 Network Security</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS/TLS encryption for all data in transit</li>
              <li>Secure WebSocket connections for real-time features</li>
              <li>Firewall protection and network isolation</li>
              <li>Rate limiting to prevent abuse and DDoS attacks</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">2.3 Web Application Firewall (WAF)</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Vercel WAF:</strong> Integrated protection against common web attacks</li>
              <li>Protection against OWASP Top 10 vulnerabilities (SQL injection, XSS, CSRF)</li>
              <li>Bot detection and mitigation</li>
              <li>Geo-blocking capabilities for suspicious regions</li>
              <li>Real-time threat intelligence updates</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section id="data-protection" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Data Protection</h2>
          <div className="text-gray-300 space-y-4">
            <h3 className="text-lg font-medium text-white mt-4">3.1 Encryption Standards</h3>
            <div className="bg-white/5 rounded-xl p-6 mt-2 mb-4">
              <h4 className="text-md font-medium text-white mb-3">Data in Transit</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">TLS 1.2+ Required:</strong> Minimum TLS 1.2, with TLS 1.3 preferred for all connections</li>
                <li><strong className="text-white">Strong Cipher Suites:</strong> ECDHE key exchange with AES-GCM encryption</li>
                <li><strong className="text-white">HSTS Enabled:</strong> HTTP Strict Transport Security prevents downgrade attacks</li>
                <li><strong className="text-white">Certificate Pinning:</strong> For mobile applications (when applicable)</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 mt-2 mb-4">
              <h4 className="text-md font-medium text-white mb-3">Data at Rest</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">AES-256 Encryption:</strong> Industry-standard encryption for all stored data</li>
                <li><strong className="text-white">Encrypted Backups:</strong> All database backups are encrypted before storage</li>
                <li><strong className="text-white">Key Management:</strong> Encryption keys managed through secure key management services</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 mt-2 mb-4">
              <h4 className="text-md font-medium text-white mb-3">Password Security</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">bcrypt Hashing:</strong> Passwords are hashed using bcrypt with configurable cost factor</li>
                <li><strong className="text-white">Unique Salt:</strong> Each password uses a unique random salt</li>
                <li><strong className="text-white">No Reversible Encryption:</strong> Passwords cannot be decrypted, only verified</li>
                <li><strong className="text-white">Argon2 Ready:</strong> Infrastructure supports migration to Argon2id for enhanced security</li>
              </ul>
            </div>

            <h3 className="text-lg font-medium text-white mt-4">3.2 Data Handling</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Strict access controls limit who can view sensitive data</li>
              <li>Regular automated backups with encryption</li>
              <li>Secure data deletion procedures</li>
              <li>No plain-text storage of sensitive information</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.3 Payment Security</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment processing handled by PayPlus (PCI DSS compliant)</li>
              <li>We never store full credit card numbers</li>
              <li>Secure tokenization for recurring payments</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section id="code-execution" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Code Execution Security</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor allows users to write and execute Java code. We implement multiple layers of security:</p>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">🐳 Sandboxed Execution Environment</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Docker Isolation:</strong> Each code execution runs in an isolated Docker container</li>
                <li><strong className="text-white">Resource Limits:</strong> CPU, memory, and execution time are strictly limited</li>
                <li><strong className="text-white">No Network Access:</strong> Containers cannot access the internet or internal services</li>
                <li><strong className="text-white">No Filesystem Access:</strong> Code cannot read or write to the host filesystem</li>
                <li><strong className="text-white">Automatic Cleanup:</strong> Containers are destroyed after execution</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">🛡️ Security Measures</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">Timeout Protection:</strong> Maximum 30-second execution time</li>
                <li><strong className="text-white">Memory Limits:</strong> Maximum 128MB RAM per execution</li>
                <li><strong className="text-white">Rate Limiting:</strong> Limited submissions per minute per user</li>
                <li><strong className="text-white">Input Validation:</strong> All code is validated before execution</li>
                <li><strong className="text-white">Blocked Operations:</strong> System calls, file I/O, and network operations are blocked</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400"><strong>Demo Mode:</strong> The public demo uses additional restrictions and does not store any data.</p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="authentication" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Authentication & Access Control</h2>
          <div className="text-gray-300 space-y-4">
            <h3 className="text-lg font-medium text-white mt-4">5.1 Authentication</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Secure session management with NextAuth.js</li>
              <li>Encrypted session tokens</li>
              <li>CSRF protection on all forms</li>
              <li>Automatic session expiry</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">5.2 Password Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Minimum 8 characters</li>
              <li>Passwords are hashed before storage</li>
              <li>Secure password reset process</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">5.3 Access Control</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Role-based access control (User, Admin)</li>
              <li>Least privilege principle for all operations</li>
              <li>Admin actions require additional authentication</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">5.4 Multi-Factor Authentication (MFA)</h3>
            <div className="bg-white/5 rounded-xl p-6 mt-2">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-white">OAuth Providers:</strong> Login via Google, GitHub, and other OAuth providers offers built-in MFA where enabled on those accounts</li>
                <li><strong className="text-white">Admin MFA Required:</strong> Administrator accounts require enhanced authentication</li>
                <li><strong className="text-white">Session Verification:</strong> Sensitive operations may require re-authentication</li>
              </ul>
              <p className="mt-4 text-sm text-gray-400">We recommend enabling MFA on your OAuth provider (Google, GitHub) for maximum security.</p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="monitoring" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. Monitoring & Incident Response</h2>
          <div className="text-gray-300 space-y-4">
            <h3 className="text-lg font-medium text-white mt-4">6.1 Monitoring</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Real-time error tracking with Sentry</li>
              <li>Performance monitoring and alerting</li>
              <li>Automated security scanning</li>
              <li>Log analysis for suspicious activity</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">6.2 Security Testing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Automated Scanning:</strong> Regular vulnerability scans using industry-standard tools</li>
              <li><strong className="text-white">Dependency Audits:</strong> Automated monitoring for vulnerable dependencies (npm audit, Snyk)</li>
              <li><strong className="text-white">Code Analysis:</strong> Static code analysis for security vulnerabilities</li>
              <li><strong className="text-white">Penetration Testing:</strong> Periodic security assessments to identify and remediate vulnerabilities</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">6.3 Incident Response</h3>
            <p>In the event of a security incident, we will:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Immediately investigate and contain the issue</li>
              <li>Notify affected users within 72 hours (as required by GDPR)</li>
              <li>Report to relevant authorities if required</li>
              <li>Implement measures to prevent recurrence</li>
              <li>Provide transparency through post-incident reports</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section id="your-responsibility" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. Your Security Responsibilities</h2>
          <div className="text-gray-300 space-y-4">
            <p>To help keep your account secure, we recommend:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use a strong, unique password for your CodeTutor account</li>
              <li>Don't share your login credentials with others</li>
              <li>Log out from shared or public devices</li>
              <li>Report any suspicious activity immediately</li>
              <li>Keep your email account secure (for password recovery)</li>
              <li>Be cautious of phishing attempts</li>
            </ul>
          </div>
        </section>

        {/* Section 8 */}
        <section id="reporting" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. Reporting Security Issues</h2>
          <div className="text-gray-300 space-y-4">
            <p>If you discover a security vulnerability, please report it responsibly:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">Email:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
              <p className="mt-2"><strong className="text-white">Subject Line:</strong> [SECURITY] Brief description</p>
            </div>
            <p className="mt-4">When reporting, please include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Description of the vulnerability</li>
              <li>Steps to reproduce</li>
              <li>Potential impact</li>
              <li>Any suggestions for remediation</li>
            </ul>
            <p className="mt-4">We appreciate responsible disclosure and will acknowledge your report within 48 hours.</p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="contact-security" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
          <div className="text-gray-300 space-y-4">
            <p>For security-related questions or concerns:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">Lia Mesika</strong></p>
              <p><strong className="text-white">Business ID:</strong> 213754476</p>
              <p><strong className="text-white">Address:</strong> Or Akiva, Israel</p>
              <p><strong className="text-white">Phone:</strong> <a href="tel:+972587878676" className="text-purple-400 hover:text-purple-300">058-7878676</a></p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
            </div>
          </div>
        </section>
      </section>

      {/* Hebrew Version */}
      <section dir="rtl" className="border-t border-white/10 pt-16">
        <h1 className="text-4xl font-bold text-white mb-4">מדיניות אבטחת מידע</h1>
        <p className="text-gray-400 mb-8">עודכן לאחרונה: 28 בדצמבר, 2025</p>

        {/* Table of Contents - Hebrew */}
        <nav className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">תוכן עניינים</h2>
          <ol className="space-y-2 text-gray-300">
            <li><a href="#he-commitment" className="hover:text-purple-400 transition-colors">1. המחויבות שלנו לאבטחה</a></li>
            <li><a href="#he-infrastructure" className="hover:text-purple-400 transition-colors">2. אבטחת תשתית</a></li>
            <li><a href="#he-data-protection" className="hover:text-purple-400 transition-colors">3. הגנת מידע</a></li>
            <li><a href="#he-code-execution" className="hover:text-purple-400 transition-colors">4. אבטחת הרצת קוד</a></li>
            <li><a href="#he-authentication" className="hover:text-purple-400 transition-colors">5. אימות ובקרת גישה</a></li>
            <li><a href="#he-monitoring" className="hover:text-purple-400 transition-colors">6. ניטור ותגובה לאירועים</a></li>
            <li><a href="#he-your-responsibility" className="hover:text-purple-400 transition-colors">7. אחריות האבטחה שלך</a></li>
            <li><a href="#he-reporting" className="hover:text-purple-400 transition-colors">8. דיווח על בעיות אבטחה</a></li>
            <li><a href="#he-contact-security" className="hover:text-purple-400 transition-colors">9. צור קשר</a></li>
          </ol>
        </nav>

        {/* Section 1 - Hebrew */}
        <section id="he-commitment" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">1. המחויבות שלנו לאבטחה</h2>
          <div className="text-gray-300 space-y-4">
            <p>ב-CodeTutor, אנו מתייחסים ברצינות לאבטחת הנתונים שלך והפלטפורמה שלנו. מדיניות זו מתארת את אמצעי האבטחה שאנו מיישמים להגנה על המידע שלך ולהבטחת סביבת למידה בטוחה.</p>
            <p>אנו בודקים ומעדכנים באופן מתמיד את נוהלי האבטחה שלנו כדי להתמודד עם איומים מתפתחים ולשמור על הסטנדרטים הגבוהים ביותר של הגנה.</p>
          </div>
        </section>

        {/* Section 2 - Hebrew */}
        <section id="he-infrastructure" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. אבטחת תשתית</h2>
          <div className="text-gray-300 space-y-4">
            <h3 className="text-lg font-medium text-white mt-4">2.1 אירוח ואבטחת ענן</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">Vercel:</strong> האפליקציה שלנו מתארחת בתשתית המאובטחת של Vercel עם הגנת DDoS אוטומטית</li>
              <li><strong className="text-white">Neon PostgreSQL:</strong> מסד נתונים מתארח בענן המאובטח של Neon עם הצפנה במנוחה ובמעבר</li>
              <li><strong className="text-white">רשת Edge:</strong> CDN גלובלי עם אבטחה בקצה</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">2.2 אבטחת רשת</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>הצפנת HTTPS/TLS לכל הנתונים במעבר</li>
              <li>חיבורי WebSocket מאובטחים לתכונות בזמן אמת</li>
              <li>הגנת Firewall ובידוד רשת</li>
              <li>הגבלת קצב למניעת שימוש לרעה והתקפות DDoS</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">2.3 חומת אש יישומי אינטרנט (WAF)</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">Vercel WAF:</strong> הגנה משולבת מפני התקפות אינטרנט נפוצות</li>
              <li>הגנה מפני פגיעויות OWASP Top 10 (הזרקת SQL, XSS, CSRF)</li>
              <li>זיהוי והפחתת בוטים</li>
              <li>יכולות חסימה גיאוגרפית לאזורים חשודים</li>
              <li>עדכוני מודיעין איומים בזמן אמת</li>
            </ul>
          </div>
        </section>

        {/* Section 3 - Hebrew */}
        <section id="he-data-protection" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. הגנת מידע</h2>
          <div className="text-gray-300 space-y-4">
            <h3 className="text-lg font-medium text-white mt-4">3.1 תקני הצפנה</h3>
            <div className="bg-white/5 rounded-xl p-6 mt-2 mb-4">
              <h4 className="text-md font-medium text-white mb-3">נתונים במעבר</h4>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong className="text-white">TLS 1.2+ נדרש:</strong> מינימום TLS 1.2, עם העדפה ל-TLS 1.3 לכל החיבורים</li>
                <li><strong className="text-white">חבילות צפנים חזקות:</strong> החלפת מפתחות ECDHE עם הצפנת AES-GCM</li>
                <li><strong className="text-white">HSTS מופעל:</strong> אבטחת תעבורה קפדנית למניעת התקפות שדרוג לאחור</li>
                <li><strong className="text-white">הצמדת אישורים:</strong> עבור אפליקציות מובייל (כשרלוונטי)</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 mt-2 mb-4">
              <h4 className="text-md font-medium text-white mb-3">נתונים במנוחה</h4>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong className="text-white">הצפנת AES-256:</strong> הצפנה סטנדרטית בתעשייה לכל הנתונים המאוחסנים</li>
                <li><strong className="text-white">גיבויים מוצפנים:</strong> כל גיבויי מסד הנתונים מוצפנים לפני אחסון</li>
                <li><strong className="text-white">ניהול מפתחות:</strong> מפתחות הצפנה מנוהלים באמצעות שירותי ניהול מפתחות מאובטחים</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-xl p-6 mt-2 mb-4">
              <h4 className="text-md font-medium text-white mb-3">אבטחת סיסמאות</h4>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong className="text-white">גיבוב bcrypt:</strong> סיסמאות מגובבות באמצעות bcrypt עם מקדם עלות מתכוונן</li>
                <li><strong className="text-white">Salt ייחודי:</strong> כל סיסמה משתמשת ב-salt אקראי ייחודי</li>
                <li><strong className="text-white">ללא הצפנה הפיכה:</strong> לא ניתן לפענח סיסמאות, רק לאמת</li>
                <li><strong className="text-white">מוכנות ל-Argon2:</strong> התשתית תומכת במעבר ל-Argon2id לאבטחה משופרת</li>
              </ul>
            </div>

            <h3 className="text-lg font-medium text-white mt-4">3.2 טיפול בנתונים</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>בקרות גישה קפדניות מגבילות מי יכול לצפות בנתונים רגישים</li>
              <li>גיבויים אוטומטיים קבועים עם הצפנה</li>
              <li>נהלי מחיקת נתונים מאובטחים</li>
              <li>אין אחסון של מידע רגיש בטקסט גלוי</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">3.3 אבטחת תשלומים</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>עיבוד תשלומים מטופל על ידי PayPlus (תואם PCI DSS)</li>
              <li>אנחנו לעולם לא מאחסנים מספרי כרטיסי אשראי מלאים</li>
              <li>טוקניזציה מאובטחת לתשלומים חוזרים</li>
            </ul>
          </div>
        </section>

        {/* Section 4 - Hebrew */}
        <section id="he-code-execution" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">4. אבטחת הרצת קוד</h2>
          <div className="text-gray-300 space-y-4">
            <p>CodeTutor מאפשרת למשתמשים לכתוב ולהריץ קוד Java. אנו מיישמים שכבות הגנה מרובות:</p>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">🐳 סביבת הרצה מבודדת</h3>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong className="text-white">בידוד Docker:</strong> כל הרצת קוד פועלת בקונטיינר Docker מבודד</li>
                <li><strong className="text-white">מגבלות משאבים:</strong> CPU, זיכרון וזמן הרצה מוגבלים בקפדנות</li>
                <li><strong className="text-white">ללא גישה לרשת:</strong> קונטיינרים לא יכולים לגשת לאינטרנט או לשירותים פנימיים</li>
                <li><strong className="text-white">ללא גישה למערכת קבצים:</strong> הקוד לא יכול לקרוא או לכתוב למערכת הקבצים המארחת</li>
                <li><strong className="text-white">ניקוי אוטומטי:</strong> קונטיינרים נהרסים לאחר ההרצה</li>
              </ul>
            </div>

            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <h3 className="text-lg font-medium text-white mb-3">🛡️ אמצעי אבטחה</h3>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong className="text-white">הגנת Timeout:</strong> זמן הרצה מקסימלי של 30 שניות</li>
                <li><strong className="text-white">מגבלות זיכרון:</strong> מקסימום 128MB RAM להרצה</li>
                <li><strong className="text-white">הגבלת קצב:</strong> הגשות מוגבלות לדקה לכל משתמש</li>
                <li><strong className="text-white">אימות קלט:</strong> כל הקוד מאומת לפני ההרצה</li>
                <li><strong className="text-white">פעולות חסומות:</strong> קריאות מערכת, קלט/פלט קבצים ופעולות רשת חסומות</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400"><strong>מצב דמו:</strong> הדמו הציבורי משתמש בהגבלות נוספות ולא מאחסן שום נתונים.</p>
            </div>
          </div>
        </section>

        {/* Section 5 - Hebrew */}
        <section id="he-authentication" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. אימות ובקרת גישה</h2>
          <div className="text-gray-300 space-y-4">
            <h3 className="text-lg font-medium text-white mt-4">5.1 אימות</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>ניהול סשן מאובטח עם NextAuth.js</li>
              <li>טוקני סשן מוצפנים</li>
              <li>הגנת CSRF בכל הטפסים</li>
              <li>פקיעת סשן אוטומטית</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">5.2 דרישות סיסמה</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>מינימום 8 תווים</li>
              <li>סיסמאות מגובבות לפני אחסון</li>
              <li>תהליך איפוס סיסמה מאובטח</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">5.3 בקרת גישה</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>בקרת גישה מבוססת תפקידים (משתמש, מנהל)</li>
              <li>עיקרון ההרשאה המינימלית לכל הפעולות</li>
              <li>פעולות מנהל דורשות אימות נוסף</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">5.4 אימות רב-גורמי (MFA)</h3>
            <div className="bg-white/5 rounded-xl p-6 mt-2">
              <ul className="list-disc pr-6 space-y-2">
                <li><strong className="text-white">ספקי OAuth:</strong> התחברות דרך Google, GitHub וספקי OAuth אחרים מציעה MFA מובנה כשמופעל בחשבונות אלה</li>
                <li><strong className="text-white">MFA נדרש למנהלים:</strong> חשבונות מנהל דורשים אימות משופר</li>
                <li><strong className="text-white">אימות סשן:</strong> פעולות רגישות עשויות לדרוש אימות מחדש</li>
              </ul>
              <p className="mt-4 text-sm text-gray-400">אנו ממליצים להפעיל MFA בספק ה-OAuth שלך (Google, GitHub) לאבטחה מרבית.</p>
            </div>
          </div>
        </section>

        {/* Section 6 - Hebrew */}
        <section id="he-monitoring" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. ניטור ותגובה לאירועים</h2>
          <div className="text-gray-300 space-y-4">
            <h3 className="text-lg font-medium text-white mt-4">6.1 ניטור</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li>מעקב שגיאות בזמן אמת עם Sentry</li>
              <li>ניטור ביצועים והתראות</li>
              <li>סריקות אבטחה אוטומטיות</li>
              <li>ניתוח לוגים לפעילות חשודה</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">6.2 בדיקות אבטחה</h3>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-white">סריקה אוטומטית:</strong> סריקות פגיעות קבועות באמצעות כלים סטנדרטיים בתעשייה</li>
              <li><strong className="text-white">ביקורות תלויות:</strong> ניטור אוטומטי של תלויות פגיעות (npm audit, Snyk)</li>
              <li><strong className="text-white">ניתוח קוד:</strong> ניתוח קוד סטטי לזיהוי פגיעויות אבטחה</li>
              <li><strong className="text-white">בדיקות חדירה:</strong> הערכות אבטחה תקופתיות לזיהוי ותיקון פגיעויות</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-4">6.3 תגובה לאירועים</h3>
            <p>במקרה של אירוע אבטחה, אנו נ:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>נחקור ונכיל את הבעיה מיד</li>
              <li>נודיע למשתמשים מושפעים תוך 72 שעות (כנדרש ב-GDPR)</li>
              <li>נדווח לרשויות הרלוונטיות אם נדרש</li>
              <li>ניישם אמצעים למניעת הישנות</li>
              <li>נספק שקיפות באמצעות דוחות לאחר האירוע</li>
            </ul>
          </div>
        </section>

        {/* Section 7 - Hebrew */}
        <section id="he-your-responsibility" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">7. אחריות האבטחה שלך</h2>
          <div className="text-gray-300 space-y-4">
            <p>כדי לעזור לשמור על החשבון שלך מאובטח, אנו ממליצים:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>השתמש בסיסמה חזקה וייחודית לחשבון CodeTutor שלך</li>
              <li>אל תשתף את פרטי ההתחברות שלך עם אחרים</li>
              <li>התנתק ממכשירים משותפים או ציבוריים</li>
              <li>דווח על כל פעילות חשודה מיד</li>
              <li>שמור על חשבון האימייל שלך מאובטח (לשחזור סיסמה)</li>
              <li>היזהר מניסיונות פישינג</li>
            </ul>
          </div>
        </section>

        {/* Section 8 - Hebrew */}
        <section id="he-reporting" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">8. דיווח על בעיות אבטחה</h2>
          <div className="text-gray-300 space-y-4">
            <p>אם גילית פרצת אבטחה, אנא דווח עליה באחריות:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">אימייל:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
              <p className="mt-2"><strong className="text-white">שורת נושא:</strong> [SECURITY] תיאור קצר</p>
            </div>
            <p className="mt-4">בעת הדיווח, אנא כלול:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>תיאור הפרצה</li>
              <li>צעדים לשחזור</li>
              <li>השפעה פוטנציאלית</li>
              <li>הצעות לתיקון</li>
            </ul>
            <p className="mt-4">אנו מעריכים חשיפה אחראית ונאשר את הדיווח שלך תוך 48 שעות.</p>
          </div>
        </section>

        {/* Section 9 - Hebrew */}
        <section id="he-contact-security" className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">9. צור קשר</h2>
          <div className="text-gray-300 space-y-4">
            <p>לשאלות או חששות הקשורים לאבטחה:</p>
            <div className="bg-white/5 rounded-xl p-6 mt-4">
              <p><strong className="text-white">ליה מסיקה</strong></p>
              <p><strong className="text-white">מספר עוסק:</strong> 213754476</p>
              <p><strong className="text-white">כתובת:</strong> אור עקיבא, ישראל</p>
              <p><strong className="text-white">טלפון:</strong> <a href="tel:+972587878676" className="text-purple-400 hover:text-purple-300">058-7878676</a></p>
              <p><strong className="text-white">אימייל:</strong> <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">liamessi30@gmail.com</a></p>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}
