import {
  DatasetPreparationResult,
  DuplicateDetectionResult,
  EmbeddingResult,
  ModelEvaluationResult,
  ModerationResult,
  SpeechResult,
  TranslationRequest,
  TranslationResult,
} from "./types";

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
}

export interface DictionaryAugmentationProvider {
  suggestDictionaryFields(term: string, language: string): Promise<TranslationResult>;
}

export interface SemanticRetrievalProvider {
  retrieve(query: string, language: string): Promise<EmbeddingResult>;
}

export interface EmbeddingsProvider {
  embed(text: string, language: string): Promise<EmbeddingResult>;
}

export interface DuplicateDetectionProvider {
  detectDuplicate(text: string, language: string): Promise<DuplicateDetectionResult>;
}

export interface ModerationProvider {
  moderate(text: string, language: string): Promise<ModerationResult>;
}

export interface SpeechToTextProvider {
  transcribeAudio(storagePath: string, language: string): Promise<SpeechResult>;
}

export interface TextToSpeechProvider {
  synthesizeSpeech(text: string, language: string): Promise<SpeechResult>;
}

export interface AudioQualityScoringProvider {
  scoreAudio(storagePath: string, language: string): Promise<ModelEvaluationResult>;
}

export interface TranscriptionAlignmentProvider {
  alignTranscription(audioPath: string, transcript: string): Promise<ModelEvaluationResult>;
}

export interface DatasetPreparationProvider {
  prepareDataset(scope: "OPEN_ONLY" | "REVIEW_SAMPLE" | "NO_EXPORT"): Promise<DatasetPreparationResult>;
}

export interface ModelEvaluationProvider {
  evaluateModel(datasetId: string): Promise<ModelEvaluationResult>;
}

export interface HumanReviewEscalationProvider {
  escalateForHumanReview(recordId: string, reason: string): Promise<ModelEvaluationResult>;
}

export interface IndigenAiProvider
  extends TranslationProvider,
    DictionaryAugmentationProvider,
    SemanticRetrievalProvider,
    EmbeddingsProvider,
    DuplicateDetectionProvider,
    ModerationProvider,
    SpeechToTextProvider,
    TextToSpeechProvider,
    AudioQualityScoringProvider,
    TranscriptionAlignmentProvider,
    DatasetPreparationProvider,
    ModelEvaluationProvider,
    HumanReviewEscalationProvider {}
