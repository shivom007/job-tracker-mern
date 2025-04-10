export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected"

export interface JobApplication {
  _id?: string
  company: string
  role: string
  status: JobStatus
  appliedDate: string
  link: string
  createdAt?: string
  updatedAt?: string
}
export interface JobApplicationFormProps {
  jobApplication?: JobApplication
  onSubmit: (data: JobApplication) => void
  onDelete?: () => void
  isLoading?: boolean
}
export interface Job {
  company: string;
  role: string;
  appliedDate: string;
  status: string;
}

export interface frequency {
    [key: string]: number;
  }

interface DuplicateApplicationPair {
    original: Job;
    duplicate: Job;
  }
  
export type DuplicateApplications = DuplicateApplicationPair[];
