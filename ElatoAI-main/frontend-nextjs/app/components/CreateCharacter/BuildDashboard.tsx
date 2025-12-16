"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Volume2, Plus, Sparkles, User, Mic, Settings2, Image as ImageIcon, Upload, Smile, BrainCircuit } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CharacterAttributes, generateCharacterPrompt, initialCharacterAttributes, parseCharacterPrompt } from "@/lib/promptUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface SettingsDashboardProps {
  selectedUser: IUser;
  allLanguages: ILanguage[];
  initialData?: IPersonality | null;
}

const formSchema = z.object({
  provider: z.enum(["openai", "gemini"]),
  title: z.string().min(2, "Minimum 2 characters").max(50, "Maximum 50 characters"),
  description: z.string().min(50, "Minimum 50 characters").max(200, "Maximum 200 characters"),
  prompt: z.string().min(100, "Minimum 100 characters").max(2000, "Maximum 2000 characters"),
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
  { id: 'identity', title: 'Identity', icon: User, description: 'Name & Look' },
  { id: 'personality', title: 'Personality', icon: BrainCircuit, description: 'Core Traits' },
  { id: 'voice', title: 'Voice', icon: Mic, description: 'Sound & Tone' },
  { id: 'refine', title: 'Refine', icon: Settings2, description: 'Fine-tuning' },
] as const;

type Step = typeof steps[number]['id'];

// Minimal type definition for voice if not globally available
interface VoiceType {
  id: string;
  name: string;
  provider: string;
  description?: string;
  color?: string;
}

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

  /* State */
  const [characterAttributes, setCharacterAttributes] = useState<CharacterAttributes>(initialCharacterAttributes);

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData | keyof CharacterAttributes | 'features', string>>>({});
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Effect to parse initial data on load
  React.useEffect(() => {
    if (initialData && initialData.character_prompt) {
      const parsedAttrs = parseCharacterPrompt(initialData.character_prompt);
      if (parsedAttrs) {
        setCharacterAttributes(parsedAttrs);
      }
    }
  }, [initialData]);

  // Effect to generate prompt when attributes change
  React.useEffect(() => {
    const generatedPrompt = generateCharacterPrompt(formData.title, characterAttributes);
    setFormData(prev => {
      // Avoid infinite loop if prompt hasn't actually changed
      if (prev.prompt !== generatedPrompt) {
        return { ...prev, prompt: generatedPrompt };
      }
      return prev;
    });
  }, [characterAttributes, formData.title]);

  const handleAttributeChange = (field: keyof CharacterAttributes, value: string) => {
    setCharacterAttributes(prev => ({ ...prev, [field]: value }));
  };

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
    }

    if (step === 'personality') {
      if (formData.prompt.length < 50) { errors.prompt = "Personality is too short."; isValid = false; }
    }

    if (step === 'voice') {
      if (!formData.voice) { errors.voice = "Please select a voice"; isValid = false; }
    }

    if (step === 'refine') {
      if (formData.firstMessagePrompt.length < 50) { errors.firstMessagePrompt = "First message must be at least 50 characters"; isValid = false; }
      // Speaking Style is part of attributes now, so prompt check covers it implicitly or we can check specific field
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 'identity') setCurrentStep('personality');
      else if (currentStep === 'personality') setCurrentStep('voice');
      else if (currentStep === 'voice') setCurrentStep('refine');
    }
  };

  const handleBack = () => {
    if (currentStep === 'refine') setCurrentStep('voice');
    else if (currentStep === 'voice') setCurrentStep('personality');
    else if (currentStep === 'personality') setCurrentStep('identity');
  };

  const handleSubmit = async () => {
    if (!validateStep('refine')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const personalityData = {
        provider: formData.provider as ModelProvider,
        title: formData.title,
        subtitle: customImageUrl || "",
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

      let personality;
      if (initialData && initialData.personality_id) {
        if (selectedUser.user_id !== initialData.creator_id) {
          console.error("User ID mismatch!");
        }

        const updateData = {
          provider: personalityData.provider,
          title: personalityData.title,
          subtitle: personalityData.subtitle,
          character_prompt: personalityData.character_prompt,
          oai_voice: personalityData.oai_voice,
          voice_prompt: personalityData.voice_prompt,
          short_description: personalityData.short_description,
          pitch_factor: personalityData.pitch_factor,
          first_message_prompt: personalityData.first_message_prompt
        };

        const result = await updatePersonalityAction(initialData.personality_id, updateData);
        if (result.error) {
          toast({ title: "Error", description: result.error, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        personality = result.data;
      } else {
        personality = await createPersonality(supabase, selectedUser.user_id, personalityData);
      }

      if (personality) {
        toast({ title: "Success!", description: initialData ? "Character updated successfully." : "Your AI companion is ready." });
        router.push(`/home`);
      } else {
        toast({ title: "Error", description: "Operation failed silently.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving personality:", error);
      toast({ title: "Error", description: "Failed to save character.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewVoice = (voice: any) => {
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

      {/* Content Card - Removing the single card wrapper to allow individual colored steps */}
      <div className="flex-1 flex flex-col">
        {currentStep === 'identity' && (
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 md:p-10 border-2 border-cyan-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Identity & Appearance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Give your friend a name and a face.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-cyan-900">Name</Label>
                  <Input
                    placeholder="e.g. Arya, The Wise Sage"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="h-12 text-lg bg-white border-2 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl"
                  />
                  {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold text-cyan-900">Description (Short)</Label>
                  <Textarea
                    placeholder="A brief summary of who they are..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[120px] bg-white border-2 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl resize-none"
                  />
                  <div className="flex justify-between text-xs text-cyan-700 font-medium">
                    <span>{formErrors.description && <span className="text-red-500">{formErrors.description}</span>}</span>
                    <span>{formData.description.length}/200</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold text-cyan-900">Avatar Appearance</Label>
                <div className="bg-white/50 rounded-2xl p-6 border-2 border-cyan-100 h-full min-h-[300px] flex flex-col">
                  <Tabs defaultValue="generate" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-cyan-100/50 p-1 rounded-xl">
                      <TabsTrigger value="generate" className="rounded-lg data-[state=active]:bg-cyan-600 data-[state=active]:text-white transition-all">Generate AI</TabsTrigger>
                      <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-cyan-600 data-[state=active]:text-white transition-all">Upload Image</TabsTrigger>
                    </TabsList>
                    <TabsContent value="generate" className="mt-0">
                      <div className="flex flex-col h-full justify-center min-h-[240px]">
                        <ImageGenerator
                          onImageGenerated={(url) => setCustomImageUrl(url)}
                          initialPrompt={`${formData.title}. ${formData.description}`}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="upload" className="mt-0">
                      <div className="flex flex-col h-full justify-center min-h-[240px]">
                        <ImageUpload
                          onImageSelected={(url) => setCustomImageUrl(url)}
                          currentImage={customImageUrl}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'personality' && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 md:p-10 border-2 border-purple-100 shadow-xl animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Core Personality</h3>
                <p className="text-gray-700 leading-relaxed">
                  Define who they are, deep down.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Gender Selection - Big Cards */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-purple-900">Gender Identity</Label>
                <div className="grid grid-cols-2 gap-4 max-w-lg">
                  {['Male', 'Female'].map((g) => (
                    <div
                      key={g}
                      onClick={() => handleAttributeChange('gender', g)}
                      className={cn(
                        "cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200",
                        characterAttributes.gender === g
                          ? "border-purple-500 bg-purple-100 text-purple-900 shadow-md scale-105"
                          : "border-purple-100 bg-white/80 hover:border-purple-300 text-gray-600 hover:bg-purple-50"
                      )}
                    >
                      <span className="text-lg font-bold">{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maturity Slider */}
              <div className="space-y-4 bg-white/60 p-6 rounded-2xl border-2 border-purple-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold text-purple-900">Maturity Level</Label>
                  <span className="text-sm font-bold text-purple-600">{characterAttributes.maturity || "Select"}</span>
                </div>
                <div className="px-2">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[
                      characterAttributes.maturity === "Childish" ? 1 :
                        characterAttributes.maturity === "Teenager-like" ? 2 :
                          characterAttributes.maturity === "Reckless" ? 3 :
                            characterAttributes.maturity === "Mature" ? 4 :
                              characterAttributes.maturity === "Wise/Elderly" ? 5 : 3
                    ]}
                    onValueChange={(val) => {
                      const map = ["", "Childish", "Teenager-like", "Reckless", "Mature", "Wise/Elderly"];
                      handleAttributeChange('maturity', map[val[0]]);
                    }}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-purple-700 font-medium pt-1">
                    <span>Childish</span>
                    <span>Teen</span>
                    <span>Reckless</span>
                    <span>Mature</span>
                    <span>Wise</span>
                  </div>
                </div>
              </div>

              {/* Behaviour Chips */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-purple-900">Core Behaviour</Label>
                <div className="flex flex-wrap gap-2">
                  {['Cheerful', 'Gloomy', 'Energetic', 'Lazy', 'Strict', 'Friendly', 'Flirty', 'Professional', 'Sarcastic', 'Shy', 'Confident'].map((b) => (
                    <div
                      key={b}
                      onClick={() => handleAttributeChange('behaviour', b)}
                      className={cn(
                        "cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                        characterAttributes.behaviour === b
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg scale-105"
                          : "bg-white text-gray-600 border-purple-100 hover:border-purple-300 hover:bg-purple-50"
                      )}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Inputs for Specifics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-purple-900">Age</Label>
                  <Input
                    value={characterAttributes.age}
                    onChange={(e) => handleAttributeChange('age', e.target.value)}
                    placeholder="e.g. 24, Eternal"
                    className="bg-white/80 border-2 border-purple-100 focus:border-purple-400 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-purple-900">Education / Occupation</Label>
                  <Input
                    value={characterAttributes.education}
                    onChange={(e) => handleAttributeChange('education', e.target.value)}
                    placeholder="e.g. High School, Doctor"
                    className="bg-white/80 border-2 border-purple-100 focus:border-purple-400 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-purple-900">Location</Label>
                  <Input
                    value={characterAttributes.location}
                    onChange={(e) => handleAttributeChange('location', e.target.value)}
                    placeholder="e.g. Tokyo, Digital Void"
                    className="bg-white/80 border-2 border-purple-100 focus:border-purple-400 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-purple-900">Relationship to User</Label>
                  <Input
                    value={characterAttributes.relation}
                    onChange={(e) => handleAttributeChange('relation', e.target.value)}
                    placeholder="e.g. Best Friend, Rival"
                    className="bg-white/80 border-2 border-purple-100 focus:border-purple-400 focus:bg-white transition-all rounded-xl"
                  />
                </div>
              </div>

              {/* Hobbies & Backstory - Detailed Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/80 p-5 rounded-2xl border-2 border-purple-100 shadow-sm space-y-3">
                  <Label className="text-sm font-semibold text-purple-900">Hobbies & Interests</Label>
                  <Input
                    value={characterAttributes.hobbies}
                    onChange={(e) => handleAttributeChange('hobbies', e.target.value)}
                    placeholder="What do they do for fun?"
                    className="border-0 bg-transparent focus:ring-0 px-0 text-base placeholder:text-gray-400"
                  />
                </div>
                <div className="bg-white/80 p-5 rounded-2xl border-2 border-purple-100 shadow-sm space-y-3">
                  <Label className="text-sm font-semibold text-purple-900">Backstory</Label>
                  <Textarea
                    value={characterAttributes.backstory}
                    onChange={(e) => handleAttributeChange('backstory', e.target.value)}
                    placeholder="Where did they come from? What defines their past?"
                    className="border-0 bg-transparent focus:ring-0 resize-none min-h-[80px] px-0 text-base placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-purple-900">Pet Peeves</Label>
                  <Input value={characterAttributes.petPeeves} onChange={(e) => handleAttributeChange('petPeeves', e.target.value)} className="bg-white/80 border-2 border-purple-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-purple-900">Flaws</Label>
                  <Input value={characterAttributes.flaws} onChange={(e) => handleAttributeChange('flaws', e.target.value)} className="bg-white/80 border-2 border-purple-100 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              {formErrors.prompt && <span className="text-red-500 text-sm font-medium">{formErrors.prompt}</span>}
            </div>
          </div>
        )}

        {currentStep === 'voice' && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 md:p-10 border-2 border-amber-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Voice Companion</h3>
                <p className="text-gray-700 leading-relaxed">
                  Choose a voice that resonates with you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...openaiVoices, ...geminiVoices].map((voice: any) => {
                const isSelected = formData.voice === voice.id;
                const isPlaying = previewingVoice === voice.id;

                return (
                  <div
                    key={voice.name}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, provider: voice.provider as ModelProvider, voice: voice.id }));
                      const audioSrc = voice.provider === 'gemini' ? voice.name : voice.id;
                      previewVoice(voice);
                    }}
                    className={cn(
                      "relative group cursor-pointer rounded-[24px] p-5 transition-all duration-300 overflow-hidden aspect-square flex flex-col items-center justify-center",
                      "shadow-[0_4px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
                      isSelected
                        ? "ring-4 ring-amber-400 shadow-2xl scale-[1.02]"
                        : "hover:scale-[1.02]"
                    )}
                    style={{ background: voice.color }}
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
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 md:p-10 border-2 border-green-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Refine & Tune</h3>
                <p className="text-gray-700 leading-relaxed">
                  Fine-tune the voice and speaking style.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white/60 rounded-2xl p-6 border-2 border-green-100 space-y-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold text-green-900">Voice Pitch</Label>
                    <span className="text-sm text-green-700 font-medium">
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
                  <div className="flex justify-between text-xs text-green-700 px-1">
                    <span>Deep</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold text-green-900">Emotional Tone</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {emotionOptions.map((emotion) => (
                      <div
                        key={emotion.value}
                        onClick={() => handleVoiceCharacteristicChange('emotion', emotion.value)}
                        className={cn(
                          "cursor-pointer rounded-xl border-2 p-3 transition-all text-center",
                          formData.voiceCharacteristics.emotion === emotion.value
                            ? "border-green-500 bg-green-50 text-green-900 scale-105 shadow-sm"
                            : "border-gray-100 bg-white hover:border-green-200"
                        )}
                      >
                        <div className="text-2xl mb-1"><EmojiComponent emoji={emotion.icon} /></div>
                        <span className="text-sm font-medium">{emotion.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/60 rounded-2xl p-6 border-2 border-green-100 space-y-4 shadow-sm">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-green-900">Speaking Style / Language (Critical)</Label>
                  <p className="text-sm text-gray-500 mb-2">How do they sound? Use this to add accent, slang, or speech impediments.</p>
                  <Textarea
                    placeholder="e.g. Uses Gen-Z slang, stutters when nervous, speaks very fast..."
                    value={characterAttributes.language}
                    onChange={(e) => handleAttributeChange('language', e.target.value)}
                    className="bg-white border-2 border-green-100 min-h-[80px] focus:border-green-400 rounded-xl"
                  />
                </div>
              </div>

              <div className="bg-white/60 rounded-2xl p-6 border-2 border-green-100 space-y-4 shadow-sm">
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-green-900">First Message</Label>
                  <Textarea
                    placeholder="How they introduce themselves..."
                    value={formData.firstMessagePrompt}
                    onChange={(e) => handleInputChange('firstMessagePrompt', e.target.value)}
                    className="min-h-[80px] bg-white border-2 border-green-100 focus:border-green-400 rounded-xl resize-none"
                  />
                  <div className="flex justify-between text-xs text-green-700">
                    <span>{formErrors.firstMessagePrompt && <span className="text-red-500">{formErrors.firstMessagePrompt}</span>}</span>
                    <span>{formData.firstMessagePrompt.length}/150</span>
                  </div>
                </div>
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