"use client"

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
}: ActionBarProps) {
  const isLoading = isRunning || isChecking

  return (
    <TooltipProvider>
      <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-3 gap-2">
          {/* Left side - secondary actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onHint}
                  disabled={isLoading || hintsAvailable === 0}
                  className="gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Hint</span>
                  {hintsAvailable > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({hintsAvailable})
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
                  className="gap-2"
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
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save draft (Ctrl+S)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right side - primary actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onRun}
                  disabled={isLoading}
                  className="gap-2"
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
                <p>Run code without testing</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={onCheck}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span>Check</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Submit and check answer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
