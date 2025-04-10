/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  countStatusFrequency,
  findDuplicateApplications,
  sampleJobs,
  sortJobsByDate,
} from "@/lib/utils";
import { DuplicateApplications, Job, frequency } from "@/lib/types";
import { toast } from "sonner";
import { VITE_BACKEND_URL } from "@/config";

const Dsa = () => {
  const [activeTab, setActiveTab] = useState("problem1");
  const [result, setResult] = useState<
    Job[] | frequency | DuplicateApplications | null
  >(null);
  const [applications, setApplications] = useState<Job[]>(sampleJobs);

  async function fetchApplications() {
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/applications`);
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      const cleanedArray: Job[] = data.map(
        ({
          _id,
          createdAt,
          updatedAt,
          link,
          ...rest
        }: {
          _id: string;
          createdAt: string;
          updatedAt: string;
          link: string;
          rest: Job;
        }) => rest
      );
      setApplications(cleanedArray || sampleJobs);
      toast.success("Job applications loaded successfully.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load job applications.");
      }
    }
  }
  useEffect(() => {
    fetchApplications();
  }, []);

  const runProblem1 = () => {
    const sorted: Job[] = sortJobsByDate(applications);
    setResult(sorted);
  };

  const runProblem2 = () => {
    const frequency: frequency = countStatusFrequency(applications);
    setResult(frequency);
  };

  const runProblem3 = () => {
    const duplicates: DuplicateApplications =
      findDuplicateApplications(applications);
    setResult(duplicates);
  };

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <Link to={"/"}>
        <h1 className="text-4xl font-bold tracking-tight mb-6">DSA Problems</h1>
      </Link>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="problem1">Problem 1</TabsTrigger>
          <TabsTrigger value="problem2">Problem 2</TabsTrigger>
          <TabsTrigger value="problem3">Problem 3</TabsTrigger>
        </TabsList>

        <TabsContent value="problem1">
          <Card>
            <CardHeader>
              <CardTitle>Problem 1: Job Tracker Sorting</CardTitle>
              <CardDescription>
                Sort jobs by appliedDate (latest first).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
                  <pre className="text-sm">
                    {JSON.stringify(sampleJobs, null, 2)}
                  </pre>
                </div>

                <Button onClick={runProblem1}>Run Solution</Button>

                {result && activeTab === "problem1" && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
                      <pre className="text-sm">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Solution Code:</h3>
                  <div className="bg-muted p-4 rounded-md overflow-auto">
                    <pre className="text-sm">{`function sortJobsByDate(jobs) {
    return [...jobs].sort((a, b) => {
      const dateA = new Date(a.appliedDate).getTime();
      const dateB = new Date(b.appliedDate).getTime();
      return dateB - dateA; // Latest first
    });
  }`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problem2">
          <Card>
            <CardHeader>
              <CardTitle>Problem 2: Status Frequency Counter</CardTitle>
              <CardDescription>
                Count the frequency of each status in the job applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
                  <pre className="text-sm">
                    {JSON.stringify(sampleJobs, null, 2)}
                  </pre>
                </div>

                <Button onClick={runProblem2}>Run Solution</Button>

                {result && activeTab === "problem2" && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <div className="bg-muted p-4 rounded-md overflow-auto">
                      <pre className="text-sm">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Solution Code:</h3>
                  <div className="bg-muted p-4 rounded-md overflow-auto">
                    <pre className="text-sm">{`function countStatusFrequency(jobs) {
    const statusCount = {};
    
    for (const job of jobs) {
      const status = job.status;
      statusCount[status] = (statusCount[status] || 0) + 1;
    }
    
    return statusCount;
  }`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problem3">
          <Card>
            <CardHeader>
              <CardTitle>Problem 3: Detect Duplicate Applications</CardTitle>
              <CardDescription>
                Find duplicate applications based on company + role (case
                insensitive).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
                  <pre className="text-sm">
                    {JSON.stringify(sampleJobs, null, 2)}
                  </pre>
                </div>

                <Button onClick={runProblem3}>Run Solution</Button>

                {result && activeTab === "problem3" && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Result:</h3>
                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-60">
                      <pre className="text-sm">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Solution Code:</h3>
                  <div className="bg-muted p-4 rounded-md overflow-auto">
                    <pre className="text-sm">{`function findDuplicateApplications(jobs) {
    const seen = new Map();
    const duplicates = [];
    
    for (const job of jobs) {
      // Create a unique key by combining company and role (case insensitive)
      const key = \`\${job.company.toLowerCase()}-\${job.role.toLowerCase()}\`;
      
      if (seen.has(key)) {
        duplicates.push({
          original: seen.get(key),
          duplicate: job
        });
      } else {
        seen.set(key, job);
      }
    }
    
    return duplicates;
  }`}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Dsa;
