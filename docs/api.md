# API Documentation

This document describes the external API integrations used in CyberAscii Vision.

## Overview

CyberAscii Vision integrates with one external API service:

- **Google Gemini AI**: For image analysis and scene interpretation

The application does not expose any REST APIs itself—it is a client-side application that consumes external APIs.

## Google Gemini API Integration

### Purpose

The Gemini API is used to analyze captured ASCII art frames and provide:
- Scene description in a cyberpunk security AI persona
- Threat level assessment (LOW, MODERATE, CRITICAL, UNKNOWN)
- Identifying tags/keywords

### Authentication

Authentication is handled via API key:

**Environment Variable**: `GEMINI_API_KEY`

**Setup**:
1. Create account at [Google AI Studio](https://ai.google.dev/)
2. Generate API key in the API keys section
3. Add to `.env.local` file: `GEMINI_API_KEY=your_key_here`

**Security Notes**:
- API key is loaded at build time via Vite's environment variable handling
- Never commit `.env.local` to version control
- API key is exposed in client-side bundle (use restrictive API key settings)

### API Configuration

**Service File**: `services/geminiService.ts`

**Model**: `gemini-3-flash-preview`

**SDK**: `@google/genai` version 1.40.0

### API Endpoint

**Base URL**: Handled by SDK (Google's infrastructure)

**Method**: POST (via SDK's `generateContent` method)

**Request Format**: Multipart request with inline image data

### Request Structure

#### Input Data

The API receives:
- **Image**: Base64-encoded PNG from canvas snapshot
- **Prompt**: Cyberpunk-themed analysis instructions

#### Prompt Template

```typescript
const prompt = `
  You are a futuristic cyberpunk security AI. 
  Analyze this visual feed of a person or object. 
  Provide a brief, robotic assessment of what you see.
  Determine a 'Threat Level' (e.g., LOW, MODERATE, CRITICAL, UNKNOWN).
  Extract key identifier tags.
  
  Respond in JSON format.
`;
```

#### Request Schema

```typescript
{
  model: 'gemini-3-flash-preview',
  contents: {
    parts: [
      { 
        inlineData: { 
          mimeType: 'image/png', 
          data: <base64_image_data> 
        } 
      },
      { 
        text: <prompt> 
      }
    ]
  },
  config: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        description: { 
          type: Type.STRING, 
          description: "A robotic, 2-sentence analysis of the subject." 
        },
        threatLevel: { 
          type: Type.STRING, 
          description: "The calculated threat level." 
        },
        tags: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "List of 3-5 keywords identifying features." 
        }
      },
      required: ["description", "threatLevel", "tags"]
    }
  }
}
```

### Response Structure

#### Success Response

```typescript
{
  description: string;    // Robotic analysis of the subject (2 sentences)
  threatLevel: string;    // "LOW" | "MODERATE" | "CRITICAL" | "UNKNOWN"
  tags: string[];         // Array of 3-5 identifying keywords
}
```

#### Example Response

```json
{
  "description": "Subject identified as human male approximately 25-30 years of age. No visible weapons or threat indicators detected in current visual field.",
  "threatLevel": "LOW",
  "tags": ["human", "male", "civilian", "unarmed", "benign"]
}
```

#### Error Response

The application handles errors gracefully and returns a fallback response:

```typescript
{
  description: "ANALYSIS FAILED. UNABLE TO PROCESS VISUAL DATA. RETRY INITIATED.",
  threatLevel: "ERROR",
  tags: ["ERROR", "NO_DATA"]
}
```

### Usage in Application

#### Integration Point

**Component**: `AsciiCanvas.tsx`

**Function**: `handleCapture`

```typescript
const handleCapture = async (imageData: string) => {
  setIsAnalyzing(true);
  setAnalysisResult(null);
  setIsModalOpen(true);
  playAnalysisStartSound();

  try {
    const result = await analyzeImage(imageData);
    setAnalysisResult(result);
    playAnalysisCompleteSound();
  } catch (error) {
    console.error("Analysis failed:", error);
    setAnalysisResult({
      description: "SYSTEM ERROR: Neural link connection failed.",
      tags: ["ERROR", "OFFLINE"],
      threatLevel: "UNKNOWN"
    });
  } finally {
    setIsAnalyzing(false);
  }
};
```

#### Service Function

**File**: `services/geminiService.ts`

**Function**: `analyzeImage`

```typescript
export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const ai = getClient();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: { /* schema definition */ }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { /* fallback error response */ };
  }
};
```

### Rate Limits and Quotas

**Google Gemini API Limits**:
- Free tier: 15 requests per minute
- Rate limits vary by pricing tier
- Quota resets daily

**Handling Rate Limits**:
The application does not implement client-side rate limiting. Users may encounter rate limit errors if they make too many requests in quick succession.

**Recommendations**:
- Implement debounce/throttle on capture button
- Cache recent analysis results
- Show rate limit warning to users

### Error Handling

#### Common Errors

1. **API Key Missing/Invalid**
   - Error: "API Key not found in environment variables"
   - Solution: Verify `GEMINI_API_KEY` in `.env.local`

2. **Network Issues**
   - Error: Network timeout or connection failed
   - Solution: Check internet connectivity

3. **Rate Limit Exceeded**
   - Error: 429 Too Many Requests
   - Solution: Wait before retrying

4. **Invalid Image Data**
   - Error: Image processing failed
   - Solution: Verify canvas capture is working

5. **API Service Down**
   - Error: 500 Internal Server Error
   - Solution: Check Google AI status page

#### Error Handling Strategy

The application uses a try-catch pattern with fallback responses:

```typescript
try {
  const result = await analyzeImage(imageData);
  setAnalysisResult(result);
} catch (error) {
  console.error("Analysis failed:", error);
  setAnalysisResult({
    description: "SYSTEM ERROR: Neural link connection failed.",
    tags: ["ERROR", "OFFLINE"],
    threatLevel: "UNKNOWN"
  });
}
```

### Security Considerations

#### API Key Exposure

- **Risk**: API key is embedded in client-side bundle
- **Mitigation**: Use restrictive API key settings in Google Cloud Console
- **Recommendation**: Set API key restrictions to specific domains/referrers

#### Data Privacy

- **Data Sent**: Only base64 image data is sent to Google
- **Data Storage**: No data is stored by the application
- **Data Retention**: Google may retain data per their privacy policy

#### Recommendations

1. **API Key Restrictions**:
   - Set HTTP referrer restrictions in Google Cloud Console
   - Limit API key to specific domains
   - Set daily usage quotas

2. **User Consent**:
   - Inform users that images are sent to Google for analysis
   - Provide option to disable AI features
   - Include privacy policy

3. **Data Minimization**:
   - Send only necessary image data
   - Consider lower resolution for analysis
   - Implement image blurring for privacy

### Testing the API

#### Manual Testing

Use the Gemini API playground:

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Use the playground to test prompts
3. Verify response schema matches expectations

#### Integration Testing

Test with the application:

1. Start development server: `npm run dev`
2. Allow camera permissions
3. Click the scan button
4. Verify analysis modal appears with results
5. Check browser console for errors

#### Mock Testing

For development without API key, you can mock the service:

```typescript
// In geminiService.ts
export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  // Mock response for testing
  return {
    description: "MOCK: Subject analysis simulation complete.",
    threatLevel: "LOW",
    tags: ["mock", "test", "simulation"]
  };
};
```

### API Alternatives

The application could be extended to support other AI providers:

- **OpenAI GPT-4 Vision**: Similar image analysis capabilities
- **Claude 3 Vision**: Anthropic's vision model
- **Azure Computer Vision**: Microsoft's vision API
- **Local Models**: WebLLM or similar for offline processing

### Future API Enhancements

Potential improvements to API integration:

1. **Streaming Responses**: Real-time analysis updates
2. **Batch Processing**: Analyze multiple frames
3. **Custom Prompts**: User-configurable analysis parameters
4. **Multiple Models**: Support for different AI providers
5. **Fallback Mechanism**: Graceful degradation on API failure
6. **Caching**: Reduce API calls with result caching
7. **Rate Limiting**: Client-side rate limit enforcement

## Browser APIs

While not external APIs, the application uses several browser APIs:

### MediaDevices API

**Purpose**: Camera access

**Key Methods**:
- `navigator.mediaDevices.getUserMedia()`
- `MediaStream.getTracks()`

**Permissions**: Requires user permission

### Canvas API

**Purpose**: Image processing and rendering

**Key Methods**:
- `CanvasRenderingContext2D.getImageData()`
- `CanvasRenderingContext2D.fillText()`
- `HTMLCanvasElement.toDataURL()`

### Web Audio API

**Purpose**: Sound effects generation

**Key Methods**:
- `AudioContext.createOscillator()`
- `AudioContext.createGain()`
- `OscillatorNode.start()`

## No Internal REST APIs

CyberAscii Vision does not expose any REST APIs. It is a client-side application that:
- Runs entirely in the browser
- Consumes external APIs (Gemini)
- Uses browser APIs for functionality
- Has no backend server or database

## API Troubleshooting

### Common Issues

**Issue**: Analysis always returns error
- Check API key is valid
- Verify network connectivity
- Check browser console for specific errors

**Issue**: Slow response times
- Check network speed
- Consider image resolution
- Monitor API response times

**Issue**: Unexpected responses
- Verify prompt is correct
- Check response schema matches
- Test in Gemini playground

**Issue**: Rate limiting
- Implement client-side throttling
- Wait between requests
- Consider upgrading API tier

## Support Resources

- **Google AI Documentation**: [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **Gemini API Reference**: [https://ai.google.dev/tutorials/rest_quickstart](https://ai.google.dev/tutorials/rest_quickstart)
- **API Key Management**: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
- **Quota Management**: [https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas](https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas)
