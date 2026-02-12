"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Lock, Zap, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface MentorLockedOverlayProps {
  className?: string
}

export function MentorLockedOverlay({ className }: MentorLockedOverlayProps) {
  return (
    <Card className={cn("border-purple-200 dark:border-purple-800 h-full", className)} dir="rtl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">מנטור AI</CardTitle>
            <p className="text-xs text-muted-foreground">משוב מותאם אישית על הקוד שלכם</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col items-center justify-center flex-1">
        <div className="text-center py-6">
          <motion.div
            className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(79, 70, 229, 0.2) 100%)",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
            }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.3)",
                "0 0 40px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(139, 92, 246, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="h-8 w-8 text-purple-400" />
          </motion.div>

          <h3 className="text-lg font-bold mb-2">המנטור הוא פיצ&#39;ר PRO</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-xs mx-auto">
            שדרגו ל-PRO כדי לקבל משוב מותאם אישית מבוסס AI,
            רמזים מדורגים, וניפוי באגים מודרך לכל שאלה.
          </p>

          <div className="space-y-2 mb-6 text-right max-w-xs mx-auto">
            {[
              "אבחון שגיאות מותאם אישית",
              "רמזים מדורגים (בלי ספוילרים)",
              "שאלות חשיבה מנחות",
              "צ׳אט המשך עם המנטור",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          <Button
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full"
            onClick={() => { window.location.href = "https://payments.payplus.co.il/l/44b589ff-31f8-407a-bd2f-956fd33aac2a" }}
          >
            <Crown className="h-4 w-4" />
            שדרגו ל-PRO
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
