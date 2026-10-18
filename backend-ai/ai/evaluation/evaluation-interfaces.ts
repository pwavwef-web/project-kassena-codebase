import { ModelEvaluationResult } from "../types";

export interface EvaluationCase {
  id: string;
  task:
    | "translation"
    | "speech_to_text"
    | "text_to_speech"
    | "moderation"
    | "duplicate_detection";
  input: string;
  expectedNotes: string[];
  language: string;
  dialect?: string;
  contentTier: "OPEN" | "RESTRICTED" | "SENSITIVE";
}

export interface EvaluationHarness {
  runCase(testCase: EvaluationCase): Promise<ModelEvaluationResult>;
  runSuite(testCases: EvaluationCase[]): Promise<ModelEvaluationResult[]>;
}
