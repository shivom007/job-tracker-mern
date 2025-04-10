import { Suspense } from "react";
import JobApplicationForm from "@/components/JobApplicationForm";
import JobApplicationList from "@/components/JobApplicationList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const Homepage = () => {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center justify-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Student Job Tracker
        </h1>
        <p className="text-muted-foreground text-lg text-center max-w-2xl">
          Keep track of your job applications, interviews, and offers in one
          place.
        </p>
      </div>

      <Tabs defaultValue="applications" className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
        </TabsList>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>
                View and manage all your job applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ApplicationsLoading />}>
                <JobApplicationList />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Application</CardTitle>
              <CardDescription>
                Track a new job application you've submitted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobApplicationForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Homepage;

function ApplicationsLoading() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-md" />
          </div>
        ))}
    </div>
  );
}
