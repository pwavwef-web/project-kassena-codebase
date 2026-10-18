export type CulturalReviewStatus =
  | "not_required"
  | "requires_human_review"
  | "approved_for_demo"
  | "blocked_sensitive";

export type HumanValidationStatus =
  | "not_validated"
  | "validator_approved"
  | "elder_review_required"
  | "rejected";

export interface AiSourceReference {
  id: string;
  collection: string;
  title: string;
  contentTier: "OPEN" | "RESTRICTED" | "SENSITIVE";
}

export interface AiResultMetadata {
  provider: string;
  model: string;
  modelVersion: string;
  promptVersion: string;
  sourceReferences: AiSourceReference[];
  language: string;
  dialect?: string;
  confidence: number;
  safetyFlags: string[];
  culturalReviewStatus: CulturalReviewStatus;
  humanValidationStatus: HumanValidationStatus;
  timestamp: string;
}

export interface AiConfiguration {
  provider: "mock" | "vertex-ai-placeholder" | "local-placeholder";
  defaultLanguage: string;
  defaultDialect?: string;
  allowLiveCalls: false;
  promptVersion: string;
}

export class AiProviderError extends Error {
  constructor(
    public readonly code:
      | "PROVIDER_NOT_CONFIGURED"
      | "LIVE_CALL_DISABLED"
      | "VALIDATION_FAILED"
      | "HUMAN_REVIEW_REQUIRED",
    message: string,
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  dialect?: string;
}

export interface TranslationResult {
  translatedText: string;
  alternatives: string[];
  metadata: AiResultMetadata;
}

export interface EmbeddingResult {
  vector: number[];
  metadata: AiResultMetadata;
}

export interface ModerationResult {
  allowed: boolean;
  categories: string[];
  metadata: AiResultMetadata;
}

export interface DuplicateDetectionResult {
  duplicate: boolean;
  candidateIds: string[];
  metadata: AiResultMetadata;
}

export interface SpeechResult {
  text: string;
  durationMs?: number;
  metadata: AiResultMetadata;
}

export interface DatasetPreparationResult {
  exportable: boolean;
  blockedReasons: string[];
  recordCount: number;
  metadata: AiResultMetadata;
}

export interface ModelEvaluationResult {
  score: number;
  observations: string[];
  metadata: AiResultMetadata;
}
