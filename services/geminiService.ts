
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, Region } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "imagen-4.0-generate-001";

export const generateStudentProfile = async (region: Region): Promise<StudentProfile> => {
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - 18;
  
  // Prompt produces English data for realism (Overseas university), but structure is strict.
  const prompt = `
    Generate a realistic, fictional student profile for an OVERSEAS university student in ${region}.
    
    CRITICAL RESTRICTIONS:
    1. AGE: Must be EXACTLY 18 years old (Born in ${birthYear}).
    2. YEAR: Must be a Freshman / Year 1 Undergraduate.
    3. UNIVERSITY: Must be a real, major university in ${region}.
    4. EMAIL: Must follow that university's real format (e.g., @nyu.edu, @ucl.ac.uk).
    
    Return purely JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            firstName: { type: Type.STRING },
            lastName: { type: Type.STRING },
            dob: { type: Type.STRING, description: `YYYY-MM-DD date in ${birthYear}` },
            universityName: { type: Type.STRING },
            universityDomain: { type: Type.STRING },
            email: { type: Type.STRING },
            major: { type: Type.STRING },
            studentId: { type: Type.STRING },
            admissionDate: { type: Type.STRING, description: "YYYY-MM-DD, within last 6 months" },
            graduationDate: { type: Type.STRING, description: "YYYY-MM-DD, 3-4 years from admission" },
            degree: { type: Type.STRING, description: "Bachelor of..." },
          },
          required: ["firstName", "lastName", "dob", "universityName", "email", "major", "studentId", "admissionDate", "graduationDate"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as StudentProfile;
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error generating profile:", error);
    throw error;
  }
};

export const generateStudentAssets = async (profile: StudentProfile): Promise<{ avatar: string, campus: string }> => {
  try {
    // 1. Generate Student Headshot
    const avatarPrompt = `A professional ID photo of an 18 year old college student named ${profile.firstName} from ${profile.universityName}, neutral background, realistic, high quality, looking at camera, slight smile.`;
    
    const avatarResponse = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: avatarPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/jpeg'
      }
    });

    // 2. Generate Campus Photo
    const campusPrompt = `A photorealistic photo of the main campus building or entrance of ${profile.universityName}, sunny day, academic architecture, high resolution.`;
    
    const campusResponse = await ai.models.generateImages({
        model: IMAGE_MODEL,
        prompt: campusPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: '16:9',
          outputMimeType: 'image/jpeg'
        }
    });

    const avatarBytes = avatarResponse.generatedImages?.[0]?.image?.imageBytes;
    const campusBytes = campusResponse.generatedImages?.[0]?.image?.imageBytes;

    if (!avatarBytes || !campusBytes) throw new Error("Failed to generate images");

    return {
        avatar: `data:image/jpeg;base64,${avatarBytes}`,
        campus: `data:image/jpeg;base64,${campusBytes}`
    };

  } catch (error) {
    console.error("Error generating assets:", error);
    // Return empty if fails, UI will handle it
    return { avatar: '', campus: '' };
  }
};

export const generateVerificationEmail = async (profile: StudentProfile): Promise<{ subject: string; body: string; code: string }> => {
  const prompt = `
    Generate a SheerID verification email for ${profile.firstName}.
    Context: They are verifying student status for a service (e.g., Spotify, YouTube Premium).
    Sender Name: "SheerID Verification".
    Content: "Congratulations! You have been verified as a student at ${profile.universityName}."
    Include a 6-digit code.
    Return JSON: { subject, body, code }.
  `;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
            code: { type: Type.STRING },
          },
          required: ["subject", "body", "code"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Failed to generate email");
  } catch (error) {
    return {
        subject: "SheerID Verification Successful",
        body: "Your student status has been verified. Code: 999999",
        code: "999999"
    };
  }
};
