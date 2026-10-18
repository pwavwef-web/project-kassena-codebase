import {HttpsError, onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

type MockPayload = Record<string, unknown>;

interface MockResult {
  ok: true;
  mode: "mock";
  action: string;
  message: string;
  received: MockPayload;
  audit: {
    actorId: string;
    timestamp: string;
    productionWrite: false;
  };
}

const getPayload = (data: unknown): MockPayload => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  return data as MockPayload;
};

const requireString = (payload: MockPayload, field: string): string => {
  const value = payload[field];

  if (typeof value !== "string" || !value.trim()) {
    throw new HttpsError("invalid-argument", `${field} is required.`);
  }

  if (value.length > 5000) {
    throw new HttpsError("invalid-argument", `${field} is too long.`);
  }

  return value.trim();
};

const assertEnum = (
  payload: MockPayload,
  field: string,
  values: readonly string[],
): string => {
  const value = requireString(payload, field);

  if (!values.includes(value)) {
    throw new HttpsError(
      "invalid-argument",
      `${field} must be one of: ${values.join(", ")}.`,
    );
  }

  return value;
};

const respond = (
  action: string,
  actorId: string,
  received: MockPayload,
  message = "Safe mock response. No production service was called.",
): MockResult => {
  logger.info("MVP scaffold function invoked.", {
    action,
    mode: "mock",
    productionWrite: false,
  });

  return {
    ok: true,
    mode: "mock",
    action,
    message,
    received,
    audit: {
      actorId,
      timestamp: new Date().toISOString(),
      productionWrite: false,
    },
  };
};

const actor = (payload: MockPayload, fallback = "demo-user"): string => {
  const value = payload.actorId || payload.userId || payload.contributorId;
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

export const createUserProfile = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "displayName");
  assertEnum(payload, "role", [
    "user",
    "contributor",
    "creator",
    "validator",
    "elder",
    "cultural custodian",
    "community manager",
    "administrator",
    "researcher",
    "partner",
  ]);

  return respond("createUserProfile", actor(payload), payload);
});

export const submitContribution = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "contributorId");
  requireString(payload, "contentType");
  assertEnum(payload, "contentTier", ["OPEN", "RESTRICTED", "SENSITIVE"]);

  return respond("submitContribution", actor(payload), payload);
});

export const createReviewTask = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "contributionId");
  requireString(payload, "validatorRole");

  return respond("createReviewTask", actor(payload, "system"), payload);
});

export const reviewContribution = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "contributionId");
  assertEnum(payload, "decision", ["approve", "reject", "request_revision"]);

  return respond("reviewContribution", actor(payload), payload);
});

export const calculateRewardPoints = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "contributionId");

  return {
    ...respond("calculateRewardPoints", actor(payload), payload),
    points: 25,
    reason: "Demo points only. No payout or reward redemption was created.",
  };
});

export const publishApprovedContent = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "contributionId");
  assertEnum(payload, "contentTier", ["OPEN", "RESTRICTED", "SENSITIVE"]);

  return respond(
    "publishApprovedContent",
    actor(payload),
    payload,
    "Mock publish completed. No Firestore document was written.",
  );
});

export const requestContentTakedown = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "contentId");
  requireString(payload, "reason");

  return respond("requestContentTakedown", actor(payload), payload);
});

export const generateDatasetExport = onCall((request) => {
  const payload = getPayload(request.data);
  assertEnum(payload, "scope", ["OPEN_ONLY", "REVIEW_SAMPLE", "NO_EXPORT"]);

  return {
    ...respond("generateDatasetExport", actor(payload, "system"), payload),
    exportStatus: "not-generated",
    downloadUrl: null,
    aiTrainingIncluded: false,
  };
});

export const sendNotification = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "userId");
  requireString(payload, "message");

  return respond(
    "sendNotification",
    actor(payload),
    payload,
    "Mock notification accepted. No email, SMS or push service was called.",
  );
});

export const recordAuditEvent = onCall((request) => {
  const payload = getPayload(request.data);
  requireString(payload, "action");

  return respond(
    "recordAuditEvent",
    actor(payload),
    payload,
    "Structured audit log preview only. No audit document was written.",
  );
});

export const aiGateway = onCall((request) => {
  const payload = getPayload(request.data);
  const task = assertEnum(payload, "task", [
    "translation",
    "dictionary_augmentation",
    "semantic_retrieval",
    "embeddings",
    "duplicate_detection",
    "moderation",
    "speech_to_text",
    "text_to_speech",
    "audio_quality_scoring",
    "transcription_alignment",
    "dataset_preparation",
    "model_evaluation",
    "human_review_escalation",
  ]);
  const message = [
    "AI gateway mock response.",
    "No Gemini, Vertex AI, OpenAI, Hugging Face or speech service was called.",
  ].join(" ");

  return {
    ...respond(
      "aiGateway",
      actor(payload, "system"),
      payload,
      message,
    ),
    result: {
      provider: "mock",
      model: "mock-provider",
      modelVersion: "0.0.0",
      promptVersion: "mvp-scaffold-v1",
      task,
      confidence: 0,
      safetyFlags: ["mock_only"],
      culturalReviewStatus: "requires_human_review",
      humanValidationStatus: "not_validated",
      timestamp: new Date().toISOString(),
    },
  };
});
