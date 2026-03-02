
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Trash2, AlertTriangle } from 'lucide-react'

export default function DataDeletionPage() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this would call an API to trigger the deletion workflow
        console.log("Deletion requested for:", email)
        setSubmitted(true)
    }

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="w-full max-w-lg border-destructive/20">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                        <Trash2 className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">Data Deletion Request</h1>
                    </div>
                    <CardDescription>
                        We respect your right to be forgotten. Use this form to request the permanent deletion of your account and all associated data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                            <AlertTitle className="text-green-800 dark:text-green-300">Request Received</AlertTitle>
                            <AlertDescription className="text-green-700 dark:text-green-400">
                                We have received your request. We will process your data deletion within 30 days and send a confirmation to <strong>{email}</strong>.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Warning</AlertTitle>
                                <AlertDescription>
                                    This action is irreversible. All your progress, streaks, and chat history will be permanently lost.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Confirm Account Email</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <Button type="submit" variant="destructive" className="w-full">
                                Request Account Deletion
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
