import { IndigenAiProvider } from "../interfaces";
import {
  AiResultMetadata,
  DatasetPreparationResult,
  DuplicateDetectionResult,
  EmbeddingResult,
  ModelEvaluationResult,
  ModerationResult,
  SpeechResult,
  TranslationRequest,
  TranslationResult,
} from "../types";

const metadata = (language: string, dialect?: string): AiResultMetadata => ({
  provider: "mock",
  model: "mock-provider",
  modelVersion: "0.0.0",
  promptVersion: "mvp-scaffold-v1",
  sourceReferences: [],
  language,
  dialect,
  confidence: 0,
  safetyFlags: ["mock_only"],
  culturalReviewStatus: "requires_human_review",
  humanValidationStatus: "not_validated",
  timestamp: new Date().toISOString(),
});

export class MockAiProvider implements IndigenAiProvider {
  async translate(request: TranslationRequest): Promise<TranslationResult> {
    return {
      translatedText: `[mock ${request.sourceLanguage}->${request.targetLanguage}] ${request.text}`,
      alternatives: [],
      metadata: metadata(request.targetLanguage, request.dialect),
    };
  }

  async suggestDictionaryFields(term: string, language: string): Promise<TranslationResult> {
    return {
      translatedText: term,
      alternatives: ["mock part of speech", "mock example sentence"],
      metadata: metadata(language),
    };
  }

  async retrieve(query: string, language: string): Promise<EmbeddingResult> {
    return this.embed(query, language);
  }

  async embed(text: string, language: string): Promise<EmbeddingResult> {
    return {
      vector: [text.length, 0, 0],
      metadata: metadata(language),
    };
  }

  async detectDuplicate(text: string, language: string): Promise<DuplicateDetectionResult> {
    return {
      duplicate: false,
      candidateIds: text ? [] : ["empty-text"],
      metadata: metadata(language),
    };
  }

  async moderate(text: string, language: string): Promise<ModerationResult> {
    return {
      allowed: Boolean(text.trim()),
      categories: text.trim() ? [] : ["empty_text"],
      metadata: metadata(language),
    };
  }

  async transcribeAudio(storagePath: string, language: string): Promise<SpeechResult> {
    return {
      text: `mock transcription for ${storagePath}`,
      metadata: metadata(language),
    };
  }

  async synthesizeSpeech(text: string, language: string): Promise<SpeechResult> {
    return {
      text,
      durationMs: 0,
      metadata: metadata(language),
    };
  }

  async scoreAudio(storagePath: string, language: string): Promise<ModelEvaluationResult> {
    return {
      score: storagePath ? 0 : 0,
      observations: ["mock audio quality score only"],
      metadata: metadata(language),
    };
  }

  async alignTranscription(audioPath: string, transcript: string): Promise<ModelEvaluationResult> {
    return {
      score: audioPath && transcript ? 0 : 0,
      observations: ["mock alignment only"],
      metadata: metadata("Kasem"),
    };
  }

  async prepareDataset(scope: "OPEN_ONLY" | "REVIEW_SAMPLE" | "NO_EXPORT"): Promise<DatasetPreparationResult> {
    return {
      exportable: scope === "OPEN_ONLY",
      blockedReasons: scope === "NO_EXPORT" ? ["export_disabled"] : [],
      recordCount: 0,
      metadata: metadata("Kasem"),
    };
  }

  async evaluateModel(datasetId: string): Promise<ModelEvaluationResult> {
    return {
      score: datasetId ? 0 : 0,
      observations: ["mock evaluation only"],
      metadata: metadata("Kasem"),
    };
  }

  async escalateForHumanReview(recordId: string, reason: string): Promise<ModelEvaluationResult> {
    return {
      score: 0,
      observations: [`human review requested for ${recordId}: ${reason}`],
      metadata: metadata("Kasem"),
    };
  }
}
