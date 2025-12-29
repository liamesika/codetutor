"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Shield, Download, Trash2, Edit, Eye, Ban, AlertCircle } from "lucide-react"

const REQUEST_TYPES = [
  { id: "access", label: "Access My Data", labelHe: "גישה לנתונים שלי", icon: Eye, description: "Request a copy of all personal data we hold about you" },
  { id: "rectification", label: "Correct My Data", labelHe: "תיקון הנתונים שלי", icon: Edit, description: "Request correction of inaccurate or incomplete data" },
  { id: "erasure", label: "Delete My Data", labelHe: "מחיקת הנתונים שלי", icon: Trash2, description: "Request deletion of your personal data (Right to be Forgotten)" },
  { id: "portability", label: "Export My Data", labelHe: "ייצוא הנתונים שלי", icon: Download, description: "Receive your data in a machine-readable format" },
  { id: "restriction", label: "Restrict Processing", labelHe: "הגבלת עיבוד", icon: Ban, description: "Limit how we use your data" },
  { id: "objection", label: "Object to Processing", labelHe: "התנגדות לעיבוד", icon: AlertCircle, description: "Object to processing based on legitimate interests" },
]

export default function DataRightsPage() {
  const [submitted, setSubmitted] = useState(false)
  const [requestType, setRequestType] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [details, setDetails] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, this would send the request to an API
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* English Version */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-purple-500" />
          <h1 className="text-4xl font-bold text-white">Your Data Rights</h1>
        </div>
        <p className="text-gray-400 mb-8">
          Under GDPR and other privacy regulations, you have rights regarding your personal data.
          Use this page to exercise those rights.
        </p>

        {/* Rights Overview */}
        <div className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Your Rights Include:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REQUEST_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <div key={type.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <Icon className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white text-sm">{type.label}</h3>
                    <p className="text-xs text-gray-400">{type.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Request Form */}
        {submitted ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Request Submitted</h2>
            <p className="text-gray-300 mb-4">
              We have received your data rights request. We will process your request and respond within 30 days.
            </p>
            <p className="text-sm text-gray-400">
              A confirmation has been sent to <span className="text-white">{email}</span>
            </p>
            <Button
              className="mt-6"
              onClick={() => setSubmitted(false)}
            >
              Submit Another Request
            </Button>
          </div>
        ) : (
          <div className="bg-white/5 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Submit a Data Rights Request</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requestType" className="text-white">Type of Request *</Label>
                <Select value={requestType} onValueChange={setRequestType} required>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select the type of request" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="bg-white/5 border-white/10"
                    required
                  />
                  <p className="text-xs text-gray-400">Must match your CodeTutor account email</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-white">Additional Details</Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Please provide any additional information that may help us process your request..."
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-yellow-400">
                  <strong>Verification Required:</strong> For security purposes, we will verify your identity before processing your request.
                  You may be asked to provide additional information.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Alternatively, you can email your request directly to{" "}
                <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300">
                  liamessi30@gmail.com
                </a>{" "}
                with the subject line "[DATA REQUEST] Your Request Type".
              </p>
            </div>
          </div>
        )}

        {/* Response Timeline */}
        <div className="mt-8 bg-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">1</div>
              <div>
                <h3 className="font-medium text-white">Verification (1-3 days)</h3>
                <p className="text-sm text-gray-400">We verify your identity to protect your data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">2</div>
              <div>
                <h3 className="font-medium text-white">Processing (1-25 days)</h3>
                <p className="text-sm text-gray-400">We locate and process your data according to your request</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">3</div>
              <div>
                <h3 className="font-medium text-white">Response (within 30 days)</h3>
                <p className="text-sm text-gray-400">You receive a response with the outcome of your request</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            * Complex requests may take up to 60 days with prior notification
          </p>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          For more information about how we handle your data, please read our{" "}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>.
        </p>
      </section>

      {/* Hebrew Version */}
      <section dir="rtl" className="border-t border-white/10 pt-16">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-purple-500" />
          <h1 className="text-4xl font-bold text-white">זכויות הנתונים שלך</h1>
        </div>
        <p className="text-gray-400 mb-8">
          לפי GDPR ותקנות פרטיות אחרות, יש לך זכויות בנוגע לנתונים האישיים שלך.
          השתמש בדף זה למימוש זכויות אלה.
        </p>

        {/* Rights Overview - Hebrew */}
        <div className="bg-white/5 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">הזכויות שלך כוללות:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REQUEST_TYPES.map((type) => {
              const Icon = type.icon
              return (
                <div key={type.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <Icon className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-white text-sm">{type.labelHe}</h3>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Info - Hebrew */}
        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">הגשת בקשה</h2>
          <p className="text-gray-300 mb-4">
            להגשת בקשת זכויות נתונים, אנא שלח אימייל ל:
          </p>
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <a href="mailto:liamessi30@gmail.com" className="text-purple-400 hover:text-purple-300 text-lg">
              liamessi30@gmail.com
            </a>
          </div>
          <p className="text-sm text-gray-400">
            כלול בנושא האימייל: [בקשת נתונים] ואת סוג הבקשה שלך.
          </p>
        </div>

        {/* Response Timeline - Hebrew */}
        <div className="mt-8 bg-white/5 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">מה קורה הלאה?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">1</div>
              <div>
                <h3 className="font-medium text-white">אימות (1-3 ימים)</h3>
                <p className="text-sm text-gray-400">אנו מאמתים את זהותך להגנה על הנתונים שלך</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">2</div>
              <div>
                <h3 className="font-medium text-white">עיבוד (1-25 ימים)</h3>
                <p className="text-sm text-gray-400">אנו מאתרים ומעבדים את הנתונים שלך בהתאם לבקשתך</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-medium">3</div>
              <div>
                <h3 className="font-medium text-white">מענה (תוך 30 יום)</h3>
                <p className="text-sm text-gray-400">תקבל תשובה עם תוצאת הבקשה שלך</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            * בקשות מורכבות עשויות לקחת עד 60 יום עם הודעה מוקדמת
          </p>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          למידע נוסף על אופן הטיפול שלנו בנתונים שלך, אנא קרא את{" "}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300">מדיניות הפרטיות</Link> שלנו.
        </p>
      </section>
    </div>
  )
}
