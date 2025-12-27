"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Play,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  Save,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionBarProps {
  onRun: () => void
  onCheck: () => void
  onHint: () => void
  onReset: () => void
  onSave: () => void
  isRunning: boolean
  isChecking: boolean
  isSaving: boolean
  hintsAvailable: number
  hasChanges: boolean
  executorAvailable?: boolean
}

export function ActionBar({
  onRun,
  onCheck,
  onHint,
  onReset,
  onSave,
  isRunning,
  isChecking,
  isSaving,
  hintsAvailable,
  hasChanges,
  executorAvailable = true,
}: ActionBarProps) {
  const isLoading = isRunning || isChecking
  const canExecute = executorAvailable && !isLoading

  return (
    <TooltipProvider>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="sticky bottom-0 glass-card border-t-0 rounded-t-none border-x-0"
      >
        <div className="flex items-center justify-between p-4 gap-3">
          {/* Left side - secondary actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onHint}
                  disabled={isLoading || hintsAvailable === 0}
                  className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Hint</span>
                  {hintsAvailable > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                      {hintsAvailable}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get a hint (costs XP)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  disabled={isLoading}
                  className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset to starter code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSave}
                  disabled={isLoading || isSaving || !hasChanges}
                  className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Save</span>
                  {hasChanges && (
                    <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save draft (Ctrl+S)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right side - primary actions */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="default"
                  onClick={onRun}
                  disabled={!canExecute}
                  className="gap-2 neon-border hover:neon-glow transition-all duration-300"
                >
                  {isRunning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Run</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{executorAvailable ? "Run code without testing" : "Code execution unavailable"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={onCheck}
                  disabled={!canExecute}
                  whileHover={{ scale: canExecute ? 1.02 : 1 }}
                  whileTap={{ scale: canExecute ? 0.98 : 1 }}
                  className={cn(
                    "relative inline-flex items-center justify-center gap-2",
                    "px-6 py-2.5 rounded-xl font-semibold text-white",
                    "gradient-neon shadow-lg",
                    "hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg",
                    isChecking && "animate-glow-pulse"
                  )}
                >
                  {isChecking ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                  <span>Check Solution</span>

                  {/* Shine effect */}
                  <span className="absolute inset-0 rounded-xl overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                  </span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{executorAvailable ? "Submit and check against all tests" : "Code execution unavailable"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
