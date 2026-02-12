import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cancellation Policy | CodeTutor",
  description: "Transaction cancellation and refund policy in accordance with Israeli Consumer Protection Law.",
}

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-[#0A0A1B] text-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Cancellation Policy
        </h1>
        <p className="text-[#6B7280] mb-12">Last updated: February 9, 2026</p>

        {/* Hebrew Content (Primary) */}
        <article className="prose prose-invert max-w-none mb-16" dir="rtl">
          <h2 className="text-3xl font-bold text-white mb-8">תקנון ביטול עסקה</h2>

          <div className="p-4 rounded-xl bg-[#0F0F23] border border-white/10 mb-8">
            <p className="text-[#D1D5DB] leading-relaxed">
              תקנון זה נכתב בהתאם להוראות חוק הגנת הצרכן, התשמ&quot;א-1981 ותקנות הגנת הצרכן (ביטול עסקה), התשע&quot;א-2010, ומסדיר את זכויות הצרכן בנוגע לביטול עסקאות שבוצעו באתר CodeTutor.
            </p>
          </div>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">1. פרטי העוסק</h3>
            <div className="p-4 rounded-xl bg-[#0F0F23] border border-white/10">
              <p className="text-[#D1D5DB]"><strong>שם העוסק:</strong> ליה מסיקה</p>
              <p className="text-[#D1D5DB]"><strong>מספר עוסק:</strong> 213754476</p>
              <p className="text-[#D1D5DB]"><strong>כתובת:</strong> אור עקיבא, ישראל</p>
              <p className="text-[#D1D5DB]"><strong>טלפון:</strong> <a href="tel:+972587878676" className="text-[#22D3EE] hover:underline">058-7878676</a></p>
              <p className="text-[#D1D5DB]"><strong>דוא&quot;ל:</strong> <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a></p>
              <p className="text-[#D1D5DB]"><strong>אתר:</strong> <a href="https://www.codetutor.co.il" className="text-[#22D3EE] hover:underline">www.codetutor.co.il</a></p>
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">2. תיאור השירות</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              CodeTutor הינה פלטפורמה דיגיטלית להכנה למבחנים במדעי המחשב (מרתון הכנה למבחן CS). השירות כולל גישה לתוכן לימודי דיגיטלי, שאלות תרגול, הרצת קוד Java בזמן אמת, ובמסלול PRO גם ליווי אישי של AI Mentor.
            </p>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              השירות ניתן בשני מסלולים:
            </p>
            <ul className="list-disc pr-6 text-[#D1D5DB] mt-2 space-y-2">
              <li><strong>BASIC</strong> (₪49, תשלום חד-פעמי) — גישה מלאה ל-10 ימי תוכן, 87+ שאלות תרגול, הרצת קוד, מעקב התקדמות ולוחות תוצאות.</li>
              <li><strong>PRO</strong> (₪89, תשלום חד-פעמי) — כל מה שב-BASIC, בתוספת AI Mentor אישי לאבחון שגיאות, רמזים מדורגים וניפוי באגים מודרך.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">3. זכות הביטול — עסקת מכר מרחוק</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              בהתאם לסעיף 14ג(ג) לחוק הגנת הצרכן, צרכן רשאי לבטל עסקת מכר מרחוק של שירות דיגיטלי:
            </p>
            <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
              <li><strong>תוך 14 ימים</strong> ממועד ביצוע העסקה או מיום קבלת המסמך המפרט את תנאי העסקה — לפי המאוחר מביניהם.</li>
              <li>הביטול ייעשה בהודעה בכתב לעוסק (בדוא&quot;ל או בטלפון).</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">4. דמי ביטול</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              בהתאם לסעיף 14ה(ב) לחוק, במקרה של ביטול עסקה שלא עקב פגם בשירות או אי-התאמה, העוסק רשאי לגבות דמי ביטול בסך:
            </p>
            <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/30 mt-4">
              <p className="text-[#D1D5DB] font-bold text-lg">
                5% ממחיר העסקה או ₪100 — הנמוך מביניהם
              </p>
            </div>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              לדוגמה:
            </p>
            <ul className="list-disc pr-6 text-[#D1D5DB] mt-2 space-y-2">
              <li>ביטול מסלול BASIC (₪49): דמי ביטול של ₪2.45 (5% מ-₪49), החזר של ₪46.55.</li>
              <li>ביטול מסלול PRO (₪89): דמי ביטול של ₪4.45 (5% מ-₪89), החזר של ₪84.55.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">5. חריגים לזכות הביטול</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              בהתאם לסעיף 14ג(ד) לחוק, זכות הביטול לא תחול במקרים הבאים:
            </p>
            <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>מוצר מידע (תוכן דיגיטלי) שנצרך במלואו או ברובו (למעלה מ-50% מהתוכן נצפה/הושלם).</li>
              <li>שירות שניתן במלואו לפני תום תקופת הביטול.</li>
              <li>מוצר שיוצר במיוחד עבור הצרכן לפי מפרט אישי.</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              הערה: ביום הראשון של המרתון (יום 1) מוצע בחינם לכל המשתמשים, ואינו חלק מהעסקה בתשלום.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">6. ביטול עקב פגם או אי-התאמה</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              בהתאם לסעיף 14ה(א) לחוק, במקרה שהשירות פגום או אינו תואם את התיאור שהוצג, הצרכן זכאי ל:
            </p>
            <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>החזר כספי מלא — ללא ניכוי דמי ביטול.</li>
              <li>ההחזר יבוצע תוך 14 ימי עסקים מקבלת הודעת הביטול.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">7. אופן ביצוע הביטול</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              ניתן להגיש בקשת ביטול באחת מהדרכים הבאות:
            </p>
            <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
              <li><strong>בדוא&quot;ל:</strong> <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a> — עם הנושא &quot;בקשת ביטול עסקה&quot;</li>
              <li><strong>בטלפון:</strong> <a href="tel:+972587878676" className="text-[#22D3EE] hover:underline">058-7878676</a> — בימים א&apos;-ה&apos;, 09:00-17:00</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              בהודעת הביטול יש לציין:
            </p>
            <ul className="list-disc pr-6 text-[#D1D5DB] mt-2 space-y-2">
              <li>שם מלא</li>
              <li>כתובת דוא&quot;ל המשויכת לחשבון</li>
              <li>תאריך הרכישה</li>
              <li>סיבת הביטול (אופציונלי)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">8. מועד ההחזר הכספי</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              בהתאם לחוק, ההחזר הכספי יבוצע תוך 14 ימי עסקים ממועד קבלת הודעת הביטול, באמצעי התשלום בו בוצעה העסקה המקורית.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">9. אוכלוסיות מוגנות</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              בהתאם לסעיף 14ג1 לחוק, צרכנים המשתייכים לאוכלוסיות הבאות זכאים לתקופת ביטול מוארכת של <strong>4 חודשים</strong> ממועד ביצוע העסקה:
            </p>
            <ul className="list-disc pr-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>אדם עם מוגבלות</li>
              <li>אזרח ותיק (מעל גיל 65)</li>
              <li>עולה חדש (עד 5 שנים מיום העלייה)</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              הצרכן יידרש להציג אישור רלוונטי (תעודת נכה, תעודת זהות, תעודת עולה) בעת הגשת בקשת הביטול.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">10. הפסקת שירות עקב תקלה</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              במקרה של הפסקת שירות העולה על 48 שעות רצופות שאינה בשליטת הצרכן, הצרכן זכאי להחזר כספי יחסי לתקופה בה השירות לא היה זמין.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">11. דין חל וסמכות שיפוט</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              על תקנון זה יחולו דיני מדינת ישראל. סמכות השיפוט הייחודית לכל עניין הנוגע לתקנון זה מוקנית לבתי המשפט המוסמכים במחוז חיפה.
            </p>
          </section>
        </article>

        {/* Divider */}
        <div className="border-t border-white/10 my-12"></div>

        {/* English Content */}
        <article className="prose prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-white mb-8">Cancellation & Refund Policy</h2>

          <div className="p-4 rounded-xl bg-[#0F0F23] border border-white/10 mb-8">
            <p className="text-[#D1D5DB] leading-relaxed">
              This cancellation policy is drafted in accordance with the Israeli Consumer Protection Law, 1981, and the Consumer Protection Regulations (Transaction Cancellation), 2010, governing the rights of consumers regarding the cancellation of transactions made on the CodeTutor website.
            </p>
          </div>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">1. Business Details</h3>
            <div className="p-4 rounded-xl bg-[#0F0F23] border border-white/10">
              <p className="text-[#D1D5DB]"><strong>Business Name:</strong> Lia Mesika</p>
              <p className="text-[#D1D5DB]"><strong>Business ID:</strong> 213754476</p>
              <p className="text-[#D1D5DB]"><strong>Address:</strong> Or Akiva, Israel</p>
              <p className="text-[#D1D5DB]"><strong>Phone:</strong> <a href="tel:+972587878676" className="text-[#22D3EE] hover:underline">058-7878676</a></p>
              <p className="text-[#D1D5DB]"><strong>Email:</strong> <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a></p>
              <p className="text-[#D1D5DB]"><strong>Website:</strong> <a href="https://www.codetutor.co.il" className="text-[#22D3EE] hover:underline">www.codetutor.co.il</a></p>
            </div>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">2. Service Description</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              CodeTutor is a digital platform for Computer Science exam preparation (CS Exam Marathon). The service includes access to educational digital content, practice questions, real-time Java code execution, and an optional AI Mentor in the PRO plan.
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li><strong>BASIC</strong> (&#x20AA;79, one-time payment) — Full access to all 10 days of content, 87+ practice questions, code execution, progress tracking, and leaderboards.</li>
              <li><strong>PRO</strong> (&#x20AA;149, one-time payment) — Everything in BASIC, plus a personal AI Mentor for error diagnosis, progressive hints, and guided debugging.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">3. Right to Cancel — Remote Transaction</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              In accordance with Section 14C(c) of the Consumer Protection Law, a consumer may cancel a remote transaction for a digital service:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Within <strong>14 days</strong> from the date of the transaction or from the date of receiving the document detailing the terms of the transaction — whichever is later.</li>
              <li>The cancellation must be submitted in writing (via email or by phone).</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">4. Cancellation Fee</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              In accordance with Section 14E(b) of the Law, when cancellation is not due to a defect or non-conformity, the business may charge a cancellation fee of:
            </p>
            <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-500/30 mt-4">
              <p className="text-[#D1D5DB] font-bold text-lg">
                5% of the transaction price or &#x20AA;100 — whichever is lower
              </p>
            </div>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Cancellation of BASIC (&#x20AA;79): Fee of &#x20AA;3.95 (5% of &#x20AA;79), refund of &#x20AA;75.05.</li>
              <li>Cancellation of PRO (&#x20AA;149): Fee of &#x20AA;7.45 (5% of &#x20AA;149), refund of &#x20AA;141.55.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">5. Exceptions to the Right to Cancel</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              In accordance with Section 14C(d) of the Law, the right to cancel does not apply in the following cases:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Digital content that has been fully or substantially consumed (more than 50% of content viewed/completed).</li>
              <li>A service that has been fully provided before the end of the cancellation period.</li>
              <li>A product created specifically for the consumer based on personal specifications.</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              Note: Day 1 of the marathon is offered free to all users and is not part of the paid transaction.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">6. Cancellation Due to Defect or Non-Conformity</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              In accordance with Section 14E(a) of the Law, if the service is defective or does not match its description, the consumer is entitled to:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>A full refund — without deduction of cancellation fees.</li>
              <li>The refund will be processed within 14 business days of receiving the cancellation notice.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">7. How to Cancel</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              Cancellation requests may be submitted via:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:liamessi30@gmail.com" className="text-[#22D3EE] hover:underline">liamessi30@gmail.com</a> — with subject &quot;Transaction Cancellation Request&quot;</li>
              <li><strong>Phone:</strong> <a href="tel:+972587878676" className="text-[#22D3EE] hover:underline">058-7878676</a> — Sunday-Thursday, 09:00-17:00</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              Please include: full name, account email, purchase date, and reason for cancellation (optional).
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">8. Refund Timeline</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              As required by law, refunds will be processed within 14 business days of receiving the cancellation notice, using the original payment method.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">9. Protected Populations</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              In accordance with Section 14C1 of the Law, consumers belonging to the following groups are entitled to an extended cancellation period of <strong>4 months</strong>:
            </p>
            <ul className="list-disc pl-6 text-[#D1D5DB] mt-4 space-y-2">
              <li>Person with a disability</li>
              <li>Senior citizen (over age 65)</li>
              <li>New immigrant (within 5 years of immigration)</li>
            </ul>
            <p className="text-[#D1D5DB] leading-relaxed mt-4">
              Relevant documentation (disability certificate, ID, immigration certificate) may be required.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">10. Service Interruption</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              In the event of a service interruption exceeding 48 consecutive hours that is beyond the consumer&apos;s control, the consumer is entitled to a pro-rated refund for the period during which the service was unavailable.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">11. Governing Law & Jurisdiction</h3>
            <p className="text-[#D1D5DB] leading-relaxed">
              This policy is governed by the laws of the State of Israel. Exclusive jurisdiction for any matter relating to this policy is granted to the competent courts in the Haifa District.
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}
