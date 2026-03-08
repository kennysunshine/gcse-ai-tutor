"use client"

import { useState, useEffect } from "react"
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
import { supabase } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'

interface Alert {
    id: string;
    student_id: string;
    subject: string;
    message_excerpt: string;
    timestamp: string;
    status: string;
    type: 'primary' | 'secondary';
    name?: string;
}

interface EfficacyData {
    topic: string;
    mastery: number;
    target: number;
    trend: string;
}

interface ScholarshipApp {
    id: string;
    applicant_name: string;
    applicant_role: string;
    learning_gap: string;
    status: string;
    created_at: string;
}

export default function TeacherDashboard() {
    const [viewMode, setViewMode] = useState<'secondary' | 'primary'>('secondary');
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [efficacyDataSecondary, setEfficacyDataSecondary] = useState<EfficacyData[]>([]);
    const [efficacyDataPrimary, setEfficacyDataPrimary] = useState<EfficacyData[]>([]);
    const [scholarships, setScholarships] = useState<ScholarshipApp[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isApproving, setIsApproving] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch Safeguarding Alerts
                const { data: alertData, error: alertError } = await supabase
                    .from('safeguarding_alerts')
                    .select(`
                        id, student_id, subject, message_excerpt, created_at, status, type,
                        profiles ( full_name )
                    `)
                    .order('created_at', { ascending: false });

                if (!alertError && alertData) {
                    const mappedAlerts: Alert[] = alertData.map((a: any) => ({
                        id: a.id,
                        student_id: a.student_id,
                        subject: a.subject,
                        message_excerpt: a.message_excerpt,
                        timestamp: formatDistanceToNow(new Date(a.created_at), { addSuffix: true }),
                        status: a.status,
                        type: a.type,
                        name: a.profiles?.full_name || 'Unknown Student'
                    }));
                    setAlerts(mappedAlerts);
                }

                // Fetch Curriculum Mastery (Aggregated by Topic)
                const { data: masteryData, error: masteryError } = await supabase
                    .from('curriculum_mastery')
                    .select('*');

                if (!masteryError && masteryData && masteryData.length > 0) {
                    // Just an example mapping, in reality you'd aggregate scores
                    const primary = masteryData.filter(m => m.tier === 'primary').map(m => ({
                        topic: `${m.subject}: ${m.topic_id}`,
                        mastery: m.mastery_score,
                        target: m.target_score,
                        trend: 'flat'
                    }));
                    const secondary = masteryData.filter(m => m.tier === 'secondary').map(m => ({
                        topic: `${m.subject}: ${m.topic_id}`,
                        mastery: m.mastery_score,
                        target: m.target_score,
                        trend: 'flat'
                    }));
                    setEfficacyDataPrimary(primary);
                    setEfficacyDataSecondary(secondary);
                } else {
                    // Fallback to empty if no live data
                    setEfficacyDataPrimary([]);
                    setEfficacyDataSecondary([]);
                }

                // Fetch Scholarship Applications
                const { data: scholarsData, error: scholarsError } = await supabase
                    .from('scholarship_applications')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!scholarsError && scholarsData) {
                    setScholarships(scholarsData);
                }

            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleApproveScholarship = async (appId: string) => {
        setIsApproving(appId);
        try {
            const response = await fetch('/api/scholars/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId: appId }),
            });
            if (response.ok) {
                // Optimistically update UI
                setScholarships(prev => prev.map(s => s.id === appId ? { ...s, status: 'Approved' } : s));
            } else {
                console.error("Approval failed");
            }
        } catch (error) {
            console.error("Error approving scholarship", error);
        } finally {
            setIsApproving(null);
        }
    }

    const displayedAlerts = alerts.filter(alert => alert.type === viewMode);
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
                                                        className={`w - [60px] h - 2 ${topic.mastery < topic.target - 20 ? 'bg-destructive/20' : ''}`}
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

                {/* Foundry Scholars Management */}
                <Card className="mb-6 flex flex-col">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-600" />
                            Foundry Scholars Applications
                        </CardTitle>
                        <CardDescription>
                            Review and approve Elite tier access tokens for Nominated Pupils.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Identified Gap</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scholarships.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No applications currently pending.</TableCell>
                                    </TableRow>
                                ) : (
                                    scholarships.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">{app.applicant_name}</TableCell>
                                            <TableCell className="capitalize">{app.applicant_role}</TableCell>
                                            <TableCell className="max-w-[200px] truncate" title={app.learning_gap}>{app.learning_gap}</TableCell>
                                            <TableCell>
                                                {app.status === 'Pending' ? (
                                                    <Badge variant="outline" className="text-amber-600 border-amber-200">Pending</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/10">Approved</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {app.status === 'Pending' && (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        disabled={isApproving === app.id}
                                                        onClick={() => handleApproveScholarship(app.id)}
                                                    >
                                                        {isApproving === app.id ? "Approving..." : "Approve & Issue Token"}
                                                    </Button>
                                                )}
                                                {app.status === 'Approved' && (
                                                    <Button size="sm" variant="ghost" disabled>Issued</Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>
    )
}
