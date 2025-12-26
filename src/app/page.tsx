import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Code2,
  Zap,
  Target,
  Brain,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Trophy,
  Users,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">CodeTutor</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#curriculum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Curriculum
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-32 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              Java Mastery for CS Students
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Learn Java the
              <span className="text-primary"> Smart Way</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Master Java programming with adaptive learning, real-time code execution,
              and personalized feedback. Perfect for CS students from week 1 to mastery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required. Start with Weeks 1-5 for free.
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-muted/50 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built by educators, for students. Our platform adapts to your learning style.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>In-Browser Code Editor</CardTitle>
                  <CardDescription>
                    Write, run, and debug Java code directly in your browser with our
                    Monaco-powered editor.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Adaptive Learning</CardTitle>
                  <CardDescription>
                    Our AI-powered system learns your strengths and weaknesses to serve
                    the perfect next challenge.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Instant Feedback</CardTitle>
                  <CardDescription>
                    Get immediate results with detailed test cases, error explanations,
                    and improvement suggestions.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Progressive Hints</CardTitle>
                  <CardDescription>
                    Stuck? Use our hint system for gentle nudges without giving away
                    the solution.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Gamified Progress</CardTitle>
                  <CardDescription>
                    Earn XP, maintain streaks, unlock achievements, and track your
                    journey to mastery.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Comprehensive Content</CardTitle>
                  <CardDescription>
                    From command line basics to advanced OOP, covering 13 weeks of
                    university-level material.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Curriculum */}
        <section id="curriculum" className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Structured Curriculum
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow a proven path from beginner to proficient Java developer.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { week: 1, title: "Getting Started", topics: ["Command Line", "Compile & Run", "Git Basics", "Error Types"] },
                { week: 2, title: "Strings & Control Flow", topics: ["String Methods", "Conditionals", "Loops", "Variable Scope"] },
                { week: 3, title: "Functions & Methods", topics: ["Function Basics", "Return Values", "Overloading", "Validation"] },
                { week: 4, title: "Arrays", topics: ["Array Basics", "Array Operations", "Command Line Args", "Pass by Value"] },
                { week: 5, title: "2D Arrays & I/O", topics: ["2D Arrays", "Standard I/O", "File Reading", "Final Keyword"] },
              ].map((week) => (
                <Card key={week.week}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
                      {week.week}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{week.title}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-2 mt-2">
                        {week.topics.map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </CardDescription>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                </Card>
              ))}
              <Card className="border-dashed">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg shrink-0 text-muted-foreground">
                    6+
                  </div>
                  <div>
                    <CardTitle className="text-lg text-muted-foreground">
                      Weeks 6-13 Coming Soon
                    </CardTitle>
                    <CardDescription>
                      OOP, Recursion, Data Structures, and more
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Master Java?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join thousands of CS students who are already learning smarter, not harder.
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Start Learning Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <Code2 className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">CodeTutor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for CS students. Made with care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
