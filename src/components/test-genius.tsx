"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Download, Loader2, Play, AlertCircle, Sparkles, ChevronsUpDown } from "lucide-react";
import { generateTestCasesAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Editor from "@monaco-editor/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Image from "next/image";

type TestCase = {
  input: string;
  expectedOutput: string;
  reasoning?: string;
};

type TestResult = TestCase & {
  actualOutput: string;
  status: "Pass" | "Fail";
};

export default function TestGenius() {
  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [activeTab, setActiveTab] = useState("cases");
  const [showCodeInput, setShowCodeInput] = useState(false);

  const [isGenerating, startGenerating] = useTransition();
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { toast } = useToast();

  const handleGenerateTestCases = () => {
    if (!problem) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Problem description cannot be empty.",
      });
      return;
    }

    startGenerating(async () => {
      const result = await generateTestCasesAction({
        problemDescription: problem,
        providedCode: showCodeInput ? code : undefined,
      });

      if (result.success) {
        setTestCases(result.data);
        setResults([]);
        setActiveTab("cases");
         toast({
          title: "Test Cases Generated!",
          description: "The system has created new test cases for you.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error,
        });
      }
    });
  };

  const handleRunTests = () => {
    if (!code) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Code is required to run tests.",
      });
      return;
    }

    setIsExecuting(true);
    // Simulate code execution
    setTimeout(() => {
      const newResults = testCases.map((tc) => {
        const pass = Math.random() > 0.3; // 70% chance of passing
        return {
          ...tc,
          actualOutput: pass ? tc.expectedOutput : `Error: ${tc.expectedOutput.split("").reverse().join("")}`,
          status: pass ? "Pass" : "Fail",
        } as TestResult;
      });
      setResults(newResults);
      setActiveTab("results");
      setIsExecuting(false);
      toast({
        title: "Execution Complete",
        description: `Ran ${newResults.length} test cases.`
      })
    }, 1500);
  };

  const handleDownload = () => {
    const data = JSON.stringify(testCases, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-cases.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
       <header className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500">
          TestGenius
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate and run test cases for your coding problems. Describe your problem, and let our system do the heavy lifting.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Start Here</CardTitle>
            <CardDescription>
              Enter a problem description to generate test cases. You can also provide your code to get more accurate results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 relative">
              <Label htmlFor="problem-description">Problem Description</Label>
              <Textarea
                id="problem-description"
                placeholder="e.g., Write a function to find the factorial of a number."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={8}
                className="bg-background/70 text-base"
              />
            </div>
            
            <Collapsible open={showCodeInput} onOpenChange={setShowCodeInput}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  <ChevronsUpDown className="mr-2 h-4 w-4" />
                  {showCodeInput ? "Hide Code Input" : "Show Code Input"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-2">
                 <Label>Code (Optional)</Label>
                  <div className="grid grid-cols-3 gap-2">
                     <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="col-span-3 sm:col-span-1">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="rounded-md border border-input overflow-hidden">
                    <Editor
                      height="240px"
                      language={language}
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: '"Source Code Pro", monospace',
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                      className="bg-background/70 font-code p-1"
                    />
                  </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={handleGenerateTestCases} disabled={isGenerating || !problem}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate Test Cases
            </Button>
            <Button
              onClick={handleRunTests}
              disabled={isExecuting || !code || testCases.length === 0}
              variant="secondary"
            >
              {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Tests
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="cases">Test Cases</TabsTrigger>
                  <TabsTrigger value="results" disabled={results.length === 0}>
                    Results
                  </TabsTrigger>
                </TabsList>
                {activeTab === 'cases' && testCases.length > 0 && (
                   <Button variant="ghost" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    JSON
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="cases">
                {isGenerating ? (
                   <div className="flex flex-col items-center justify-center h-60 gap-4 text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">Generating awesome test cases for you.</p>
                  </div>
                ) : testCases.length > 0 ? (
                  <div className="w-full overflow-auto max-h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Input</TableHead>
                          <TableHead>Expected Output</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testCases.map((tc, index) => (
                          <TableRow key={index} className="transition-colors hover:bg-muted/50">
                            <TableCell className="font-code whitespace-pre-wrap">{tc.input}</TableCell>
                            <TableCell className="font-code whitespace-pre-wrap">{tc.expectedOutput}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                   <div className="relative w-full h-[50vh] rounded-lg overflow-hidden">
                      <Image
                        src="https://picsum.photos/800/600"
                        alt="Abstract placeholder image"
                        fill
                        className="object-cover"
                      />
                       <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                         <Alert className="bg-background/80 backdrop-blur-sm max-w-sm">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle className="font-headline">No Test Cases Yet</AlertTitle>
                          <AlertDescription>
                            Describe a problem and click "Generate Test Cases" to get started.
                          </AlertDescription>
                         </Alert>
                       </div>
                   </div>
                )}
              </TabsContent>
              <TabsContent value="results">
                 {isExecuting ? (
                   <div className="flex flex-col items-center justify-center h-60">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground mt-4">Running tests...</p>
                  </div>
                 ) : results.length > 0 ? (
                  <div className="w-full overflow-auto max-h-[60vh]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Input</TableHead>
                          <TableHead>Expected</TableHead>
                          <TableHead>Actual</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((res, index) => (
                          <TableRow key={index} className={cn(res.status === 'Fail' && 'bg-destructive/10')}>
                            <TableCell>
                              <span className={cn('px-2 py-1 rounded-full text-xs', res.status === 'Pass' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300')}>
                                {res.status}
                              </span>
                            </TableCell>
                            <TableCell className="font-code whitespace-pre-wrap">{res.input}</TableCell>
                            <TableCell className="font-code whitespace-pre-wrap">{res.expectedOutput}</TableCell>
                            <TableCell className="font-code whitespace-pre-wrap">{res.actualOutput}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <p>Run tests to see the results here.</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
