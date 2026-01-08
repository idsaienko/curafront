import { uploadVoiceReport } from "./services/llmApi";

function VoiceRecorder() {
  const handleUpload = async (blob) => {
    const result = await uploadVoiceReport(blob);
    console.log(result);
  };
}
