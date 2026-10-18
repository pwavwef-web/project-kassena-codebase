import { IndigenAiProvider } from "../interfaces";
import { AiProviderError } from "../types";
import { MockAiProvider } from "./mock-provider";

export class VertexAiPlaceholderProvider extends MockAiProvider implements IndigenAiProvider {
  private disabled(): never {
    throw new AiProviderError(
      "LIVE_CALL_DISABLED",
      "Vertex AI placeholder is disabled. No live Vertex, Gemini or external model call is allowed in the MVP.",
    );
  }

  override async translate() {
    return this.disabled();
  }
}
