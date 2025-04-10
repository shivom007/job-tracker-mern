import { useState, useEffect } from "react"
import { ExternalLink, Filter, Calendar, Search, Trash2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { JobApplication, JobStatus } from "@/lib/types"
import { formatDate, statusColors } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { VITE_BACKEND_URL } from "@/config"

const JobApplicationList = () => {
    const [applications, setApplications] = useState<JobApplication[]>([])
    const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
    
  
    useEffect(() => {
      fetchApplications()
    }, [])
  
    useEffect(() => {
      filterApplications()
    }, [applications, statusFilter, searchQuery, dateFilter ])
  
    async function fetchApplications() {
      setIsLoading(true)
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/applications`)
        if (!response.ok) {
          throw new Error("Failed to fetch applications")
        }
        const data = await response.json()
        setApplications(data)
        setFilteredApplications(data)
        toast.success("Applications fetched successfully!")
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
        else {
          toast.error("Failed to fetch applications. Please try again.")
        }
        
      } finally {
        setIsLoading(false)
      }
    }
  
    function filterApplications() {
      let filtered = [...applications]
  
      // Filter by status
      if (statusFilter !== "all") {
        filtered = filtered.filter((app) => app.status === statusFilter)
      }
  
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (app) => app.company.toLowerCase().includes(query) || app.role.toLowerCase().includes(query),
        )
      }
  
      // Filter by date
      if (dateFilter) {
        const filterDate = format(dateFilter, "yyyy-MM-dd")
        filtered = filtered.filter((app) => app.appliedDate === filterDate)
      }
  
      setFilteredApplications(filtered)
    }
  
    async function updateStatus(id: string, newStatus: JobStatus) {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/applications/${id}`, {
          method: "PUT",  
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        })
  
        if (!response.ok) {
          throw new Error("Failed to update status")
        }
  
        // Update local state
        setApplications((prev) => prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app)))
  
        toast.success("Status updated successfully!")
      } catch (error:unknown) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
        else {
          toast.error("Failed to update status. Please try again.")
        }
        
      }
    }
  
    async function deleteApplication(id: string) {
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/applications/${id}`, {
          method: "DELETE",
        })
  
        if (!response.ok) {
          throw new Error("Failed to delete application")
        }
  
        // Update local state
        setApplications((prev) => prev.filter((app) => app._id !== id))
  
        toast.success("Application deleted successfully!")
      } catch (error:unknown) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
        else {
          toast.error("Failed to delete application. Please try again.")
        }
      }
    }
  
    function resetFilters() {
      setStatusFilter("all")
      setSearchQuery("")
      setDateFilter(undefined)
    }
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company or role..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
  
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter by Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
  
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "Filter by Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
              </PopoverContent>
            </Popover>
  
            <Button variant="ghost" size="icon" onClick={resetFilters} title="Reset filters">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
  
        {filteredApplications.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No job applications found.</p>
            {(statusFilter !== "all" || searchQuery || dateFilter) && (
              <Button variant="link" onClick={resetFilters}>
                Reset filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((application) => (
              <Card key={application._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{application.company}</CardTitle>
                      <p className="text-lg font-medium">{application.role}</p>
                    </div>
                    <Badge className={cn("ml-2", statusColors[application.status])}>{application.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>Applied on {formatDate(application.appliedDate)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex gap-2">
                    <Select
                      defaultValue={application.status}
                      onValueChange={(value) => updateStatus(application._id!, value as JobStatus)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
  
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this job application.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteApplication(application._id!)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
  
                  <Button variant="outline" size="sm" asChild>
                    <a href={application.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      View <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
}

export default JobApplicationList