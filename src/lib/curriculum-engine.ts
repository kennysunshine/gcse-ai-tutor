import fs from 'fs';
import path from 'path';

export interface SpecificationPoint {
    code: string;
    description: string;
    level: string; // e.g., "Tier", "Topic", "Subtopic"
    parent?: string;
}

export interface PaperStructure {
    name: string;
    durationMinutes: number;
    totalMarks: number;
    calculatorStatus: 'allowed' | 'forbidden' | 'partial';
    sections: { name: string; description: string; marks: number }[];
}

export interface AssessmentObjective {
    code: string;
    description: string;
    weighting: string; // e.g., "25-30%"
}

export interface GradeBoundary {
    grade: string;
    boundary: number;
    outOf: number;
    year: string;
    tier?: string;
}

export interface SubjectData {
    subject: string;
    board: string;
    level: string; // e.g., "GCSE"
    specifications: SpecificationPoint[];
    papers?: PaperStructure[];
    assessmentObjectives?: AssessmentObjective[];
    gradeBoundaries?: GradeBoundary[];
}

export class CurriculumEngine {
    private static instance: CurriculumEngine;
    private dataDir: string;
    private subjectsCache: Map<string, SubjectData> = new Map();

    private constructor() {
        this.dataDir = path.join(process.cwd(), 'src/data/curriculum');
    }

    public static getInstance(): CurriculumEngine {
        if (!CurriculumEngine.instance) {
            CurriculumEngine.instance = new CurriculumEngine();
        }
        return CurriculumEngine.instance;
    }

    private getFilePath(board: string, subject: string, level: string): string {
        const fileName = `${board.toLowerCase()}-${subject.toLowerCase()}-${level.toLowerCase()}.json`;
        return path.join(this.dataDir, fileName);
    }

    private loadSubjectData(board: string, subject: string, level: string): SubjectData | null {
        const cacheKey = `${board}-${subject}-${level}`;
        if (this.subjectsCache.has(cacheKey)) {
            return this.subjectsCache.get(cacheKey)!;
        }

        const filePath = this.getFilePath(board, subject, level);
        try {
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                this.subjectsCache.set(cacheKey, data);
                return data;
            }
        } catch (e) {
            console.error(`Error loading curriculum data for ${cacheKey}:`, e);
        }
        return null;
    }

    // Tools

    public listSubjects(board?: string, level?: string) {
        // Enumerate JSON files in data dir to get available subjects
        try {
            if (!fs.existsSync(this.dataDir)) return [];
            const files = fs.readdirSync(this.dataDir);
            const results = files.map(f => {
                const parts = f.replace('.json', '').split('-');
                return { board: parts[0], subject: parts[1], level: parts[2] };
            });

            return results.filter(r => 
                (!board || r.board.toLowerCase() === board.toLowerCase()) && 
                (!level || r.level.toLowerCase() === level.toLowerCase())
            );
        } catch (e) {
            return [];
        }
    }

    public getSpecification(board: string, subject: string, level: string): SpecificationPoint[] | null {
        const data = this.loadSubjectData(board, subject, level);
        return data?.specifications || null;
    }

    public getPaperStructure(board: string, subject: string, level: string): PaperStructure[] | null {
        const data = this.loadSubjectData(board, subject, level);
        return data?.papers || null;
    }

    public getAssessmentObjectives(board: string, subject: string, level: string): AssessmentObjective[] | null {
        const data = this.loadSubjectData(board, subject, level);
        return data?.assessmentObjectives || null;
    }

    public getGradeBoundaries(board: string, subject: string, level: string): GradeBoundary[] | null {
        const data = this.loadSubjectData(board, subject, level);
        return data?.gradeBoundaries || null;
    }
}
