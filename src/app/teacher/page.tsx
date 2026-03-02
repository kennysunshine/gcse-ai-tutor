"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Users, BookOpen, BrainCircuit, ShieldCheck, Eye, Target, Grid } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Dummy data for Safeguarding Queue
const safeguardingAlerts = [
    { id: "A-124", name: "Jamie T.", subject: "Biology", timestamp: "10 mins ago", flag: "<CRISIS_FLAG>", status: "Unresolved", type: "secondary" },
    { id: "A-125", name: "Leo W.", subject: "Maths (Year 4)", timestamp: "1 hour ago", flag: "<CRISIS_FLAG>", status: "Unresolved", type: "primary" },
    { id: "A-123", name: "Sarah L.", subject: "English", timestamp: "2 hours ago", flag: "<CRISIS_FLAG>", status: "Logged & Routed", type: "secondary" }
];

// Dummy data for Class Efficacy Breakdown (Secondary)
const efficacyDataSecondary = [
    { topic: "AQA Maths: Algebraic Fractions", mastery: 42, target: 70, trend: "down" },
    { topic: "Edexcel Maths: Probability Trees", mastery: 65, target: 60, trend: "up" },
    { topic: "OCR Science: Kinematics", mastery: 85, target: 80, trend: "up" },
    { topic: "AQA English: Language Analysis", mastery: 55, target: 65, trend: "flat" },
];

// Dummy data for Gap Analysis Heatmap (Primary)
const efficacyDataPrimary = [
    { topic: "Year 4: Multiplication Tables Check (MTC)", mastery: 45, target: 85, trend: "down" },
    { topic: "Year 5: Equivalent Fractions", mastery: 38, target: 70, trend: "down" },
    { topic: "Year 3: Capital Letters & Full Stops", mastery: 72, target: 75, trend: "up" },
    { topic: "Year 6: Multi-Step Reasoning", mastery: 50, target: 80, trend: "flat" },
];

export default function TeacherDashboard() {
    const [viewMode, setViewMode] = useState<'secondary' | 'primary'>('secondary');

    const displayedAlerts = safeguardingAlerts.filter(alert => alert.type === viewMode);
    const displayedEfficacy = viewMode === 'secondary' ? efficacyDataSecondary : efficacyDataPrimary;

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background p-6 space-y-6 flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b pb-4 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Supervisor Command Centre</h1>
                    <p className="text-muted-foreground mt-1">Real-time efficacy tracking and DfE-compliant safeguarding</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center bg-muted p-1 rounded-md">
                        <Button
                            variant={viewMode === 'secondary' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('secondary')}
                        >
                            Secondary (KS3/4)
                        </Button>
                        <Button
                            variant={viewMode === 'primary' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('primary')}
                        >
                            Primary (KS2)
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            DfE 2026 Standard: Compliant
                        </Badge>
                        <div className="hidden sm:flex flex-col gap-1 text-xs text-muted-foreground mr-1">
                            <span className="flex items-center gap-1 leading-none"><BrainCircuit className="h-3 w-3 text-green-500" /> RAG Data Residency</span>
                            <span className="flex items-center gap-1 leading-none"><AlertTriangle className="h-3 w-3 text-destructive" /> Tiered Response</span>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{viewMode === 'primary' ? '30 / 30' : '14 / 28'}</div>
                            <p className="text-xs text-muted-foreground">Actively using AI Tutor</p>
                        </CardContent>
                    </Card>
                    <Card className="border-destructive shadow-sm shadow-destructive/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-destructive">Active Safeguarding Flags</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{displayedAlerts.filter(a => a.status === 'Unresolved').length}</div>
                            <p className="text-xs text-muted-foreground">Requires immediate review</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                    {/* Active Safeguarding Feed */}
                    <Card className="flex flex-col border-destructive/50">
                        <CardHeader className="bg-destructive/5 border-b">
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                {viewMode === 'primary' ? 'Junior Safeguarding Monitor' : 'Active Safeguarding Feed'}
                            </CardTitle>
                            <CardDescription>
                                Real-time interception of AI &lt;CRISIS_FLAG&gt; events.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <div className="divide-y">
                                {displayedAlerts.length === 0 ? (
                                    <div className="p-6 text-center text-muted-foreground">No active alerts for this cohort.</div>
                                ) : (
                                    displayedAlerts.map((alert) => (
                                        <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{alert.name}</span>
                                                    <Badge variant="secondary" className="text-xs">{alert.subject}</Badge>
                                                    {alert.status === 'Unresolved' && (
                                                        <span className="relative flex h-2 w-2 ml-1">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Triggered: {alert.timestamp}</p>
                                            </div>
                                            <Button variant={alert.status === 'Unresolved' ? 'destructive' : 'outline'} size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Transcript
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Class Efficacy Breakdown / Primary Heatmap */}
                    <Card className="flex flex-col">
                        <CardHeader className="border-b">
                            <CardTitle className="flex items-center gap-2">
                                {viewMode === 'primary' ? <Grid className="h-5 w-5 text-primary" /> : <Target className="h-5 w-5 text-primary" />}
                                {viewMode === 'primary' ? 'Gap Analysis Class Heatmap' : 'Class Efficacy Breakdown'}
                            </CardTitle>
                            <CardDescription>
                                Aggregated Curriculum Mastery scores vs Target Grades.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Curriculum Topic</TableHead>
                                        <TableHead>Class Mastery</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {displayedEfficacy.map((topic, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{topic.topic}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={topic.mastery}
                                                        className={`w-[60px] h-2 ${topic.mastery < topic.target - 20 ? 'bg-destructive/20' : ''}`}
                                                        // Change color based on gap
                                                        indicatorColor={topic.mastery < topic.target - 20 ? 'bg-destructive' : topic.mastery >= topic.target ? 'bg-green-500' : 'bg-primary'}
                                                    />
                                                    <span className="text-xs text-muted-foreground">{topic.mastery}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {topic.mastery >= topic.target ? (
                                                    <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50 dark:bg-green-900/10">Mastered</Badge>
                                                ) : topic.mastery < topic.target - 20 ? (
                                                    <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">Re-teach Required</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-900/10">Intervention</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="bg-muted/30 border-t p-4 text-xs text-muted-foreground justify-between">
                            <span>Data aggregated from practice chat sessions.</span>
                            <Button variant="link" size="sm" className="h-auto p-0">Generate Intervention Plan</Button>
                        </CardFooter>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    )
}
