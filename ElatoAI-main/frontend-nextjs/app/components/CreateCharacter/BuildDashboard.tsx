"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Volume2, Plus, Sparkles, User, Mic, Settings2, Image as ImageIcon, Upload, Smile } from "lucide-react";
import { createPersonality, updatePersonality } from "@/db/personalities";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { updatePersonalityAction } from "@/app/actions";
import { emotionOptions, geminiVoices, openaiVoices, r2UrlAudio } from "@/lib/data";
import EmojiComponent from "./EmojiComponent";
import ImageUpload from "./ImageUpload";
import ImageGenerator from "./ImageGenerator";
import { PitchFactors } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import VoiceCloneModal from "./VoiceCloneModal";
import { cn } from "@/lib/utils";

interface SettingsDashboardProps {
  selectedUser: IUser;
  allLanguages: ILanguage[];
  initialData?: IPersonality | null;
}

const formSchema = z.object({
  provider: z.enum(["openai", "gemini"]),
  title: z.string().min(2, "Minimum 2 characters").max(50, "Maximum 50 characters"),
  description: z.string().min(50, "Minimum 50 characters").max(200, "Maximum 200 characters"),
  prompt: z.string().min(100, "Minimum 100 characters").max(1000, "Maximum 1000 characters"),
  firstMessagePrompt: z.string().min(50, "Minimum 50 characters").max(150, "Maximum 150 characters"),
  voice: z.string().min(1, "Voice selection is required"),
  voiceCharacteristics: z.object({
    features: z.string().min(10, "Minimum 10 characters").max(150, "Maximum 150 characters"),
    emotion: z.string(),
    pitchFactor: z.number().min(0.75).max(1.5),
  })
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 'identity', title: 'Identity', icon: User, description: 'Name & Personality' },
  { id: 'voice', title: 'Voice', icon: Mic, description: 'Sound & Tone' },
  { id: 'refine', title: 'Refine', icon: Settings2, description: 'Fine-tuning' },
] as const;

type Step = typeof steps[number]['id'];

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({
  selectedUser,
  initialData
}) => {
  const supabase = createClient();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('identity');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    provider: (initialData?.provider as ModelProvider) || 'openai',
    title: initialData?.title || '',
    description: initialData?.short_description || '',
    prompt: initialData?.character_prompt || '',
    firstMessagePrompt: initialData?.first_message_prompt || '',
    voice: initialData?.oai_voice || '',
    voiceCharacteristics: {
      features: initialData?.voice_prompt?.split('\nThe voice should be ')[0] || '',
      emotion: initialData?.voice_prompt?.split('\nThe voice should be ')[1] || 'neutral',
      pitchFactor: initialData?.pitch_factor || 1.0,
    }
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData | 'features', string>>>({});
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Image handling state
  const isInitialImage = initialData?.subtitle && initialData.subtitle.startsWith('http');
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(isInitialImage ? initialData.subtitle : null);


  const [showVoiceCloneModal, setShowVoiceCloneModal] = useState<{
    provider: "elevenlabs" | "hume";
    title: string;
    voiceInputLabel: string;
    voiceInputPlaceholder: string;
    voiceDescription: string;
  } | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  const handleVoiceCharacteristicChange = (characteristic: 'features' | 'emotion' | 'pitchFactor', value: string | number) => {
    setFormData({
      ...formData,
      voiceCharacteristics: {
        ...formData.voiceCharacteristics,
        [characteristic]: characteristic === 'pitchFactor' ? Number(value) : value
      }
    });
  };

  const validateStep = (step: Step): boolean => {
    const errors: Partial<Record<keyof FormData | 'features', string>> = {};
    let isValid = true;

    if (step === 'identity') {
      if (formData.title.length < 2) { errors.title = "Title must be at least 2 characters"; isValid = false; }
      if (formData.description.length < 50) { errors.description = "Description must be at least 50 characters"; isValid = false; }
      if (formData.prompt.length < 100) { errors.prompt = "Prompt must be at least 100 characters"; isValid = false; }
      if (formData.firstMessagePrompt.length < 50) { errors.firstMessagePrompt = "First message must be at least 50 characters"; isValid = false; }
    }

    if (step === 'voice') {
      if (!formData.voice) { errors.voice = "Please select a voice"; isValid = false; }
    }

    if (step === 'refine') {
      if (formData.voiceCharacteristics.features.length < 10) { errors.features = "Characteristics must be at least 10 characters"; isValid = false; }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 'identity') setCurrentStep('voice');
      else if (currentStep === 'voice') setCurrentStep('refine');
    }
  };

  const handleBack = () => {
    if (currentStep === 'refine') setCurrentStep('voice');
    else if (currentStep === 'voice') setCurrentStep('identity');
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    if (!validateStep('refine')) {
      console.log("Validation failed");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Preparing personality data...");
      const personalityData = {
        provider: formData.provider as ModelProvider,
        title: formData.title,
        subtitle: customImageUrl || "", // Use custom image URL if available
        character_prompt: formData.prompt,
        oai_voice: formData.voice as OaiVoice,
        voice_prompt: formData.voiceCharacteristics.features + "\nThe voice should be " + formData.voiceCharacteristics.emotion,
        is_doctor: false,
        is_child_voice: false,
        is_story: false,
        key: initialData ? initialData.key : formData.title.toLowerCase().replace(/ /g, '_') + "_" + uuidv4(),
        creator_id: selectedUser.user_id,
        short_description: formData.description,
        pitch_factor: formData.voiceCharacteristics.pitchFactor,
        first_message_prompt: formData.firstMessagePrompt
      };
      console.log("Personality data prepared:", personalityData);

      let personality;
      if (initialData && initialData.personality_id) {
        console.log("Updating existing personality:", initialData.personality_id);

        // Debug: Check user IDs
        console.log("Current User ID:", selectedUser.user_id);
        console.log("Creator ID:", initialData.creator_id);
        if (selectedUser.user_id !== initialData.creator_id) {
          console.error("User ID mismatch! You might not have permission to update this character.");
        }

        // Debug: Check visibility
        const { data: checkData, error: checkError } = await supabase
          .from("personalities")
          .select("*")
          .eq("personality_id", initialData.personality_id)
          .single();
        console.log("Visibility check - Data:", checkData, "Error:", checkError);

        // Filter update payload to ONLY fields that should change
        // Exclude system flags and immutable fields
        const updateData = {
          provider: personalityData.provider,
          title: personalityData.title,
          subtitle: personalityData.subtitle, // Update subtitle with image URL
          character_prompt: personalityData.character_prompt,
          oai_voice: personalityData.oai_voice,
          voice_prompt: personalityData.voice_prompt,
          short_description: personalityData.short_description,
          pitch_factor: personalityData.pitch_factor,
          first_message_prompt: personalityData.first_message_prompt
        };

        console.log("Refined Update payload:", updateData);
        // Use Server Action to bypass potential client-side RLS issues
        const result = await updatePersonalityAction(initialData.personality_id, updateData);
        if (result.error) {
          console.error("Server Action Error:", result.error);
          toast({ title: "Error", description: result.error, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        personality = result.data;
      } else {
        console.log("Creating new personality");
        personality = await createPersonality(supabase, selectedUser.user_id, personalityData);
      }

      console.log("Result from DB:", personality);

      if (personality) {
        toast({ title: "Success!", description: initialData ? "Character updated successfully." : "Your AI companion is ready." });
        router.push(`/home`);
      } else {
        console.error("No personality returned from DB operation");
        toast({ title: "Error", description: "Operation failed silently.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving personality:", error);
      toast({ title: "Error", description: "Failed to save character.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewVoice = (voice: VoiceType) => {
    const { id, provider } = voice;

    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    let audioUrl = '';
    if (provider === 'openai') {
      audioUrl = `${r2UrlAudio}/${id}.wav`;
    } else if (provider === 'gemini') {
      audioUrl = `/Voices/${id}.wav`;
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setPreviewingVoice(id);
      setAudioElement(audio);
      audio.play().catch(() => setPreviewingVoice(null));
      audio.onended = () => setPreviewingVoice(null);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto min-h-[calc(100vh-100px)] p-4 md:p-8">
      {/* Header */}
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-lora text-gray-900">
          {initialData ? "Edit Your " : "Create Your "} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-600">Avatar</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Design a unique personality that resonates with you.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4 md:gap-8">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                  isActive ? "bg-purple-600 text-white shadow-lg scale-110" :
                    isCompleted ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="hidden md:block">
                  <p className={cn("font-semibold text-sm", isActive ? "text-purple-900" : "text-gray-500")}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-12 h-0.5 bg-gray-200 mx-2 hidden md:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 md:p-10 flex-1 flex flex-col">
        <div className="flex-1">
          {currentStep === 'identity' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Name</Label>
                    <Input
                      placeholder="e.g. Arya, The Wise Sage"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="h-12 text-lg bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl"
                    />
                    {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Description</Label>
                    <Textarea
                      placeholder="A brief summary of who they are..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="min-h-[120px] bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formErrors.description && <span className="text-red-500">{formErrors.description}</span>}</span>
                      <span>{formData.description.length}/200</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Core Personality (Prompt)</Label>
                    <Textarea
                      placeholder="Detailed instructions on how they should behave, think, and speak..."
                      value={formData.prompt}
                      onChange={(e) => handleInputChange('prompt', e.target.value)}
                      className="min-h-[120px] bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formErrors.prompt && <span className="text-red-500">{formErrors.prompt}</span>}</span>
                      <span>{formData.prompt.length}/1000</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">First Message</Label>
                    <Textarea
                      placeholder="How they introduce themselves..."
                      value={formData.firstMessagePrompt}
                      onChange={(e) => handleInputChange('firstMessagePrompt', e.target.value)}
                      className="min-h-[80px] bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{formErrors.firstMessagePrompt && <span className="text-red-500">{formErrors.firstMessagePrompt}</span>}</span>
                      <span>{formData.firstMessagePrompt.length}/150</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* Character Appearance Section */}
              <div className="md:col-span-2 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Character Appearance</h3>
                {/* Content Area */}
                <div className="md:col-span-3 bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <ImageGenerator
                    onImageGenerated={(url) => setCustomImageUrl(url)}
                    initialPrompt={`${formData.title}. ${formData.description}`}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'voice' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight ml-2">Select Your Voice Companion</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...openaiVoices, ...geminiVoices].map((voice: VoiceType) => {
                  const isSelected = formData.voice === voice.id;
                  const isPlaying = previewingVoice === voice.id;

                  return (
                    <div
                      key={voice.id}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, provider: voice.provider as ModelProvider, voice: voice.id }));
                        previewVoice(voice);
                      }}
                      className={cn(
                        "relative group cursor-pointer rounded-[24px] p-5 transition-all duration-300 overflow-hidden aspect-square flex flex-col items-center justify-center",
                        "shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
                        isSelected
                          ? "ring-4 ring-white shadow-2xl scale-[1.02]"
                          : "hover:scale-[1.02]",
                        voice.color
                      )}
                    >
                      {/* Metallic sheen overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-black/5 opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-30" />

                      {/* Icon Container - The "Knob" */}
                      <div className={cn(
                        "relative w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300",
                        "bg-gradient-to-b from-slate-200 to-slate-400",
                        "shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.8)]",
                        "border border-white/40",
                        isPlaying ? "scale-105" : (isSelected ? "scale-110" : "group-hover:scale-105")
                      )}>
                        {isPlaying ? (
                          <div className="flex items-center gap-[3px] h-5">
                            <span className="w-[3px] bg-white animate-[bounce_1s_infinite] h-2 rounded-full drop-shadow-sm"></span>
                            <span className="w-[3px] bg-white animate-[bounce_1.2s_infinite] h-4 rounded-full drop-shadow-sm"></span>
                            <span className="w-[3px] bg-white animate-[bounce_0.8s_infinite] h-3 rounded-full drop-shadow-sm"></span>
                          </div>
                        ) : (
                          <div className="text-white drop-shadow-md">
                            <Volume2 size={20} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>

                      <div className="relative text-center z-10 w-full px-1">
                        <h3 className={cn(
                          "font-bold text-lg mb-0.5 truncate drop-shadow-md tracking-tight",
                          isSelected ? "text-gray-900" : "text-gray-900"
                        )}>
                          {voice.name}
                        </h3>
                        <p className={cn(
                          "text-[11px] font-medium tracking-wide line-clamp-1 truncate drop-shadow-sm opacity-80",
                          isSelected ? "text-gray-800" : "text-gray-700"
                        )}>
                          {voice.description}
                        </p>
                      </div>

                      {/* Selection Ring (External) */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-[24px] border-[5px] border-white/90 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
              {formErrors.voice && <p className="text-red-500 text-center">{formErrors.voice}</p>}

              {/* Advanced Voice Options */}
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Advanced Voice Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div
                    onClick={() => setShowVoiceCloneModal({
                      provider: "elevenlabs",
                      title: "Eleven Labs Voice Clone",
                      voiceInputLabel: "Voice ID",
                      voiceInputPlaceholder: "Enter Eleven Labs Voice ID",
                      voiceDescription: "Enter the Voice ID from your Eleven Labs dashboard."
                    })}
                    className="cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-purple-50 border border-gray-200 hover:border-purple-200 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md group"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🧪</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Eleven Labs</h4>
                      <p className="text-xs text-gray-500">Clone a voice using Eleven Labs ID</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setShowVoiceCloneModal({
                      provider: "hume",
                      title: "Hume Voice Clone",
                      voiceInputLabel: "Hume Config ID",
                      voiceInputPlaceholder: "Enter Hume Config ID",
                      voiceDescription: "Enter the Config ID from your Hume dashboard."
                    })}
                    className="cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-amber-50 border border-gray-200 hover:border-amber-200 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md group"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🎭</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Hume AI</h4>
                      <p className="text-xs text-gray-500">Use advanced emotional voices</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm">Pro Tip</h4>
                    <p className="text-amber-800 text-sm">Click on any voice card to hear a preview. Choose one that matches the personality you defined in the previous step.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'refine' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/50 rounded-2xl p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">Voice Pitch</Label>
                    <span className="text-sm text-purple-600 font-medium">
                      {PitchFactors.find(p => p.value === formData.voiceCharacteristics.pitchFactor)?.label || 'Normal'}
                    </span>
                  </div>
                  <Slider
                    min={0.75}
                    max={1.5}
                    step={0.25}
                    value={[formData.voiceCharacteristics.pitchFactor]}
                    onValueChange={(val) => handleVoiceCharacteristicChange('pitchFactor', val[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-gray-400 px-1">
                    <span>Deep</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Emotional Tone</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {emotionOptions.map((emotion) => (
                      <div
                        key={emotion.value}
                        onClick={() => handleVoiceCharacteristicChange('emotion', emotion.value)}
                        className={cn(
                          "cursor-pointer rounded-xl border-2 p-3 transition-all text-center",
                          formData.voiceCharacteristics.emotion === emotion.value
                            ? "border-purple-500 bg-purple-50 text-purple-900"
                            : "border-transparent bg-white hover:border-gray-200"
                        )}
                      >
                        <div className="text-2xl mb-1"><EmojiComponent emoji={emotion.icon} /></div>
                        <span className="text-sm font-medium">{emotion.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Voice Characteristics</Label>
                  <Textarea
                    placeholder="e.g. Speaks slowly with a calm demeanor..."
                    value={formData.voiceCharacteristics.features}
                    onChange={(e) => handleVoiceCharacteristicChange('features', e.target.value)}
                    className="min-h-[100px] bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl resize-none"
                  />
                  {formErrors.features && <p className="text-red-500 text-sm">{formErrors.features}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200/50">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 'identity'}
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {currentStep === 'refine' ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all rounded-full px-8 py-6 text-lg"
            >
              {isSubmitting ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Avatar" : "Create Avatar")}
              {!isSubmitting && <Sparkles className="w-5 h-5 ml-2" />}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Next Step <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <VoiceCloneModal
        isOpen={!!showVoiceCloneModal}
        onClose={() => setShowVoiceCloneModal(null)}
        selectedUser={selectedUser}
        onSuccess={() => {
          toast({ title: "Success", description: "Voice clone added!" });
          router.push('/home');
        }}
        voiceCloneModalProps={showVoiceCloneModal!}
      />
    </div >
  );
};

export default SettingsDashboard;