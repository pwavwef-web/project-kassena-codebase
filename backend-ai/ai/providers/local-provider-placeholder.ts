import { IndigenAiProvider } from "../interfaces";
import { AiProviderError } from "../types";
import { MockAiProvider } from "./mock-provider";

export class LocalProviderPlaceholder extends MockAiProvider implements IndigenAiProvider {
  private disabled(): never {
    throw new AiProviderError(
      "PROVIDER_NOT_CONFIGURED",
      "Local AI provider placeholder is not configured. Use MockAiProvider for MVP tests.",
    );
  }

  override async translate() {
    return this.disabled();
  }
}
