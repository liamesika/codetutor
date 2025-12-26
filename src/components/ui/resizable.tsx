"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"

interface ResizablePanelGroupProps {
  children: React.ReactNode
  direction?: "horizontal" | "vertical"
  className?: string
}

interface ResizablePanelProps {
  children: React.ReactNode
  defaultSize?: number
  minSize?: number
  maxSize?: number
  className?: string
  collapsible?: boolean
  collapsedSize?: number
}

interface ResizableHandleProps {
  className?: string
  withHandle?: boolean
}

interface PanelContext {
  sizes: number[]
  setSizes: React.Dispatch<React.SetStateAction<number[]>>
  direction: "horizontal" | "vertical"
}

const PanelGroupContext = React.createContext<PanelContext | null>(null)

export function ResizablePanelGroup({
  children,
  direction = "horizontal",
  className,
}: ResizablePanelGroupProps) {
  const [sizes, setSizes] = React.useState<number[]>([])

  return (
    <PanelGroupContext.Provider value={{ sizes, setSizes, direction }}>
      <div
        className={cn(
          "flex h-full w-full",
          direction === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        data-panel-group
        data-panel-group-direction={direction}
      >
        {children}
      </div>
    </PanelGroupContext.Provider>
  )
}

export function ResizablePanel({
  children,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  className,
  collapsible = false,
  collapsedSize = 0,
}: ResizablePanelProps) {
  const context = React.useContext(PanelGroupContext)
  const [size, setSize] = React.useState(defaultSize)
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const actualSize = isCollapsed && collapsible ? collapsedSize : size

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        [context?.direction === "horizontal" ? "width" : "height"]: `${actualSize}%`,
        minWidth: context?.direction === "horizontal" ? `${minSize}%` : undefined,
        maxWidth: context?.direction === "horizontal" ? `${maxSize}%` : undefined,
        minHeight: context?.direction === "vertical" ? `${minSize}%` : undefined,
        maxHeight: context?.direction === "vertical" ? `${maxSize}%` : undefined,
        flexShrink: 0,
      }}
      data-panel
      data-panel-collapsible={collapsible}
      data-panel-collapsed={isCollapsed}
    >
      {children}
    </div>
  )
}

export function ResizableHandle({
  className,
  withHandle = false,
}: ResizableHandleProps) {
  const context = React.useContext(PanelGroupContext)
  const [isDragging, setIsDragging] = React.useState(false)
  const handleRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)

      const startPos = context?.direction === "horizontal" ? e.clientX : e.clientY
      const parent = handleRef.current?.parentElement
      if (!parent) return

      const panels = Array.from(parent.querySelectorAll("[data-panel]")) as HTMLElement[]
      const handleIndex = Array.from(parent.querySelectorAll("[data-resize-handle]")).indexOf(
        handleRef.current!
      )

      const leftPanel = panels[handleIndex]
      const rightPanel = panels[handleIndex + 1]
      if (!leftPanel || !rightPanel) return

      const parentRect = parent.getBoundingClientRect()
      const parentSize =
        context?.direction === "horizontal" ? parentRect.width : parentRect.height

      const leftStartSize =
        (context?.direction === "horizontal"
          ? leftPanel.offsetWidth
          : leftPanel.offsetHeight) / parentSize

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const currentPos =
          context?.direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY
        const delta = (currentPos - startPos) / parentSize

        const newLeftSize = Math.max(0.1, Math.min(0.9, leftStartSize + delta))
        leftPanel.style[context?.direction === "horizontal" ? "width" : "height"] =
          `${newLeftSize * 100}%`
        rightPanel.style[context?.direction === "horizontal" ? "width" : "height"] =
          `${(1 - newLeftSize) * 100}%`
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [context?.direction]
  )

  return (
    <div
      ref={handleRef}
      className={cn(
        "relative flex items-center justify-center bg-border transition-colors",
        context?.direction === "horizontal"
          ? "w-1.5 cursor-col-resize hover:bg-primary/20"
          : "h-1.5 cursor-row-resize hover:bg-primary/20",
        isDragging && "bg-primary/30",
        className
      )}
      data-resize-handle
      onMouseDown={handleMouseDown}
    >
      {withHandle && (
        <div
          className={cn(
            "z-10 flex h-6 w-4 items-center justify-center rounded-sm border bg-border",
            context?.direction === "horizontal" && "rotate-0",
            context?.direction === "vertical" && "rotate-90"
          )}
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
