import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

// Demo classroom seed endpoint for dean presentation
// Creates 10 demo students with realistic assignment submissions
export async function POST(request: Request) {
  try {
    const { secret } = await request.json()

    if (secret !== process.env.ADMIN_SETUP_SECRET && secret !== "codetutor-setup-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const hashedPassword = await bcrypt.hash("demo123", 12)

    // Define the 10 demo students
    const demoStudents = [
      { num: 1, name: "Lia Mesika 1", grades: [95, 92, 97] },
      { num: 2, name: "Lia Mesika 2", grades: [88, 91, 90] },
      { num: 3, name: "Lia Mesika 3", grades: [82, 79, 85] },
      { num: 4, name: "Lia Mesika 4", grades: [74, 71, 76] },
      { num: 5, name: "Lia Mesika 5", grades: [61, 64, 58] },
      { num: 6, name: "Lia Mesika 6", grades: [55, 49, null] },
      { num: 7, name: "Lia Mesika 7", grades: [42, null, null] },
      { num: 8, name: "Lia Mesika 8", grades: [38, null, null] },
      { num: 9, name: "Lia Mesika 9", grades: [null, null, null] },
      { num: 10, name: "Lia Mesika 10", grades: [null, null, null] },
    ]

    const createdUsers: string[] = []
    const userIds: { id: string; num: number; grades: (number | null)[] }[] = []

    // Create or update each demo student
    for (const student of demoStudents) {
      const email = `lia.mesika${student.num}@demo.com`

      // Check if user exists
      const existingUsers = await db.$queryRaw<{ id: string }[]>`
        SELECT id FROM "User" WHERE email = ${email} LIMIT 1
      `

      let userId: string

      if (existingUsers.length > 0) {
        userId = existingUsers[0].id
        // Update existing user
        await db.$executeRaw`
          UPDATE "User"
          SET name = ${student.name}, password = ${hashedPassword}, role = 'USER', "updatedAt" = NOW()
          WHERE id = ${userId}
        `
      } else {
        // Create new user
        userId = `demo_student_${student.num}_${Date.now()}`
        await db.$executeRaw`
          INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
          VALUES (${userId}, ${email}, ${student.name}, ${hashedPassword}, 'USER', NOW(), NOW())
        `
      }

      createdUsers.push(email)
      userIds.push({ id: userId, num: student.num, grades: student.grades })
    }

    // Get or create a course for assignments
    const courses = await db.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Course" LIMIT 1
    `

    let courseId: string
    if (courses.length === 0) {
      courseId = `demo_course_${Date.now()}`
      await db.$executeRaw`
        INSERT INTO "Course" (id, title, description, "createdAt", "updatedAt")
        VALUES (${courseId}, 'Introduction to Java', 'First-year Java programming course', NOW(), NOW())
      `
    } else {
      courseId = courses[0].id
    }

    // Get or create weeks for the course
    const weeks = await db.$queryRaw<{ id: string; "weekNumber": number }[]>`
      SELECT id, "weekNumber" FROM "Week" WHERE "courseId" = ${courseId} ORDER BY "weekNumber" LIMIT 3
    `

    const weekIds: string[] = []
    for (let i = 1; i <= 3; i++) {
      const existingWeek = weeks.find(w => w.weekNumber === i)
      if (existingWeek) {
        weekIds.push(existingWeek.id)
      } else {
        const weekId = `demo_week_${i}_${Date.now()}`
        await db.$executeRaw`
          INSERT INTO "Week" (id, "courseId", "weekNumber", title, description, "createdAt", "updatedAt")
          VALUES (${weekId}, ${courseId}, ${i}, ${'Week ' + i + ': Java Basics Part ' + i}, ${'Learning objectives for week ' + i}, NOW(), NOW())
        `
        weekIds.push(weekId)
      }
    }

    // Define the 3 assignments
    const assignmentDefs = [
      { id: "demo-hw-week1", weekId: weekIds[0], title: "Homework 1: Variables & Output", desc: "Practice with variables, data types, and System.out", dueDate: "2024-09-15" },
      { id: "demo-hw-week2", weekId: weekIds[1], title: "Homework 2: Control Flow", desc: "If statements, loops, and conditional logic", dueDate: "2024-09-22" },
      { id: "demo-hw-week3", weekId: weekIds[2], title: "Homework 3: Methods & Functions", desc: "Writing and calling methods in Java", dueDate: "2024-09-29" },
    ]

    const assignmentIds: string[] = []

    // Create or update assignments
    for (const asn of assignmentDefs) {
      const existing = await db.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Assignment" WHERE id = ${asn.id} LIMIT 1
      `

      if (existing.length > 0) {
        await db.$executeRaw`
          UPDATE "Assignment"
          SET title = ${asn.title}, description = ${asn.desc}, "isPublished" = true, "dueDate" = ${asn.dueDate}::timestamp, "updatedAt" = NOW()
          WHERE id = ${asn.id}
        `
        assignmentIds.push(asn.id)
      } else {
        await db.$executeRaw`
          INSERT INTO "Assignment" (id, "weekId", title, description, "isPublished", "dueDate", "createdAt", "updatedAt")
          VALUES (${asn.id}, ${asn.weekId}, ${asn.title}, ${asn.desc}, true, ${asn.dueDate}::timestamp, NOW(), NOW())
        `
        assignmentIds.push(asn.id)
      }
    }

    // Clear existing demo submissions
    for (const user of userIds) {
      await db.$executeRaw`
        DELETE FROM "AssignmentSubmission" WHERE "userId" = ${user.id}
      `
    }

    // Create submissions based on grade data
    let submissionsCreated = 0
    for (const user of userIds) {
      for (let i = 0; i < 3; i++) {
        const grade = user.grades[i]
        const assignmentId = assignmentIds[i]

        if (grade !== null) {
          // Student submitted this assignment
          const submissionId = `demo_sub_${user.num}_hw${i + 1}_${Date.now()}`
          const submittedDate = new Date(`2024-09-${14 + (i * 7)}`)

          await db.$executeRaw`
            INSERT INTO "AssignmentSubmission" (id, "assignmentId", "userId", status, grade, "submittedAt", "createdAt", "updatedAt")
            VALUES (${submissionId}, ${assignmentId}, ${user.id}, 'SUBMITTED', ${grade}, ${submittedDate}, NOW(), NOW())
          `
          submissionsCreated++
        }
        // If grade is null, no submission created (student didn't submit)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Demo classroom seeded successfully",
      data: {
        studentsCreated: createdUsers.length,
        students: createdUsers,
        assignmentsCreated: assignmentIds.length,
        assignments: assignmentDefs.map(a => a.title),
        submissionsCreated,
        note: "Students 1-5: all 3 submitted, Student 6: 2/3, Students 7-8: 1/3, Students 9-10: 0/3"
      }
    })
  } catch (error) {
    console.error("Seed demo classroom error:", error)
    return NextResponse.json(
      { error: "Failed to seed demo classroom", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
