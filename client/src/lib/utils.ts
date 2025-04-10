import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Job } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const statusColors: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Interview: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Offer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

// Problem 1: Sort jobs by appliedDate (latest first)
export function sortJobsByDate(jobs: Job[]) {
  return [...jobs].sort((a, b) => {
    const dateA = new Date(a.appliedDate).getTime()
    const dateB = new Date(b.appliedDate).getTime()
    return dateB - dateA // Latest first
  })
}

// Problem 2: Status Frequency Counter
export function countStatusFrequency(jobs: Job[]) {
  const statusCount: Record<string, number> = {}

  for (const job of jobs) {
    const status = job.status
    statusCount[status] = (statusCount[status] || 0) + 1
  }

  return statusCount
}

// Problem 3: Detect Duplicate Applications
export function findDuplicateApplications(jobs: Job[]) {
  const seen = new Map()
  const duplicates = []

  for (const job of jobs) {
    // Create a unique key by combining company and role (case insensitive)
    const key = `${job.company.toLowerCase()}-${job.role.toLowerCase()}`

    if (seen.has(key)) {
      duplicates.push({
        original: seen.get(key),
        duplicate: job,
      })
    } else {
      seen.set(key, job)
    }
  }

  return duplicates
}

// Dummy data for testing
export const sampleJobs: Job[] = [
  { company: "Google", role: "SDE Intern", appliedDate: "2025-04-01", status: "Applied" },
  { company: "Microsoft", role: "Software Engineer", appliedDate: "2025-03-15", status: "Interview" },
  { company: "Amazon", role: "Frontend Developer", appliedDate: "2025-04-10", status: "Applied" },
  { company: "Meta", role: "React Developer", appliedDate: "2025-02-20", status: "Rejected" },
  { company: "Apple", role: "iOS Developer", appliedDate: "2025-03-05", status: "Offer" },
  { company: "Netflix", role: "Full Stack Engineer", appliedDate: "2025-03-25", status: "Interview" },
  { company: "Google", role: "Product Manager", appliedDate: "2025-04-05", status: "Applied" },
  { company: "Microsoft", role: "SDE Intern", appliedDate: "2025-03-10", status: "Rejected" },
  { company: "google", role: "sde intern", appliedDate: "2025-02-15", status: "Applied" },
]