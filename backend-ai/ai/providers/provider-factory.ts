import { IndigenAiProvider } from "../interfaces";
import { AiConfiguration } from "../types";
import { LocalProviderPlaceholder } from "./local-provider-placeholder";
import { MockAiProvider } from "./mock-provider";
import { VertexAiPlaceholderProvider } from "./vertex-ai-placeholder";

export const defaultAiConfiguration: AiConfiguration = {
  provider: "mock",
  defaultLanguage: "Kasem",
  allowLiveCalls: false,
  promptVersion: "mvp-scaffold-v1",
};

export const createAiProvider = (
  config: AiConfiguration = defaultAiConfiguration,
): IndigenAiProvider => {
  switch (config.provider) {
    case "mock":
      return new MockAiProvider();
    case "vertex-ai-placeholder":
      return new VertexAiPlaceholderProvider();
    case "local-placeholder":
      return new LocalProviderPlaceholder();
    default:
      return new MockAiProvider();
  }
};
