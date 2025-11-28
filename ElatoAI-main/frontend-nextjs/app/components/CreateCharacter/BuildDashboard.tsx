"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Volume2, Plus, Sparkles, User, Mic, Settings2 } from "lucide-react";
import { createPersonality } from "@/db/personalities";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { emotionOptions, geminiVoices, openaiVoices, r2UrlAudio } from "@/lib/data";
import EmojiComponent from "./EmojiComponent";
import { PitchFactors } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import VoiceCloneModal from "./VoiceCloneModal";
import { cn } from "@/lib/utils";

interface SettingsDashboardProps {
  selectedUser: IUser;
  allLanguages: ILanguage[];
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
}) => {
  const supabase = createClient();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('identity');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    provider: 'openai' as ModelProvider,
    title: '',
    description: '',
    prompt: '',
    firstMessagePrompt: '',
    voice: '',
    voiceCharacteristics: {
      features: '',
      emotion: 'neutral',
      pitchFactor: 1.0,
    }
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData | 'features', string>>>({});
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
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
    if (!validateStep('refine')) return;

    setIsSubmitting(true);
    try {
      const personality = await createPersonality(supabase, selectedUser.user_id, {
        provider: formData.provider as ModelProvider,
        title: formData.title,
        subtitle: "",
        character_prompt: formData.prompt,
        oai_voice: formData.voice as OaiVoice,
        voice_prompt: formData.voiceCharacteristics.features + "\nThe voice should be " + formData.voiceCharacteristics.emotion,
        is_doctor: false,
        is_child_voice: false,
        is_story: false,
        key: formData.title.toLowerCase().replace(/ /g, '_') + "_" + uuidv4(),
        creator_id: selectedUser.user_id,
        short_description: formData.description,
        pitch_factor: formData.voiceCharacteristics.pitchFactor,
        first_message_prompt: formData.firstMessagePrompt
      });

      if (personality) {
        toast({ title: "Success!", description: "Your AI companion is ready." });
        router.push(`/home`);
      }
    } catch (error) {
      console.error("Error creating personality:", error);
      toast({ title: "Error", description: "Failed to create character.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewVoice = (voice: VoiceType) => {
    const { id, provider } = voice;
    if (provider === 'openai') {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      const audio = new Audio(`${r2UrlAudio}/${id}.wav`);
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
          Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-600">Companion</span>
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
            </div>
          )}

          {currentStep === 'voice' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...openaiVoices, ...geminiVoices].map((voice: VoiceType) => (
                  <div
                    key={voice.id}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, provider: voice.provider as ModelProvider, voice: voice.id }));
                      previewVoice(voice);
                    }}
                    className={cn(
                      "relative group cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2",
                      formData.voice === voice.id
                        ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                        : "border-transparent bg-white hover:border-purple-200 hover:shadow-md hover:-translate-y-1"
                    )}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-4xl transform transition-transform group-hover:scale-110">
                        <EmojiComponent emoji={voice.emoji} />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900">{voice.name}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{voice.description}</p>
                      </div>
                    </div>

                    {/* Playing Indicator */}
                    {previewingVoice === voice.id && (
                      <div className="absolute top-2 right-2 animate-pulse text-purple-600 bg-white rounded-full p-1.5 shadow-sm">
                        <Volume2 size={14} />
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {formData.voice === voice.id && (
                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1 shadow-md">
                        <Check size={12} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {formErrors.voice && <p className="text-red-500 text-center">{formErrors.voice}</p>}

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
                    onChange={(e) => handleInputChange('features' as any, e.target.value)} // Type cast for simplicity in this specific handler
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
              {isSubmitting ? "Creating..." : "Create Companion"}
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
    </div>
  );
};

export default SettingsDashboard;