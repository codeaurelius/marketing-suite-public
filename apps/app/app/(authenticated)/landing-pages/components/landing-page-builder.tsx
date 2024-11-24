'use client';

import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@repo/design-system/components/ui/radio-group';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/design-system/components/ui/tabs';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import type React from 'react';
import { useState } from 'react';
import { getRandomTemplate } from '../data/sample-content';
import { LandingPagePreview } from './landing-page-preview';

export interface LandingPageContent {
  title: string;
  description: string;
  productName: string;
  targetAudience: string;
  keyFeatures: string;
  callToAction: string;
}

type WizardStep = 'basics' | 'content' | 'design';
type Template = 'modern' | 'classic';

interface LandingPageBuilderProps {
  initialContent?: LandingPageContent;
  initialTemplate?: Template;
  onBack: () => void;
  onSubmit: (content: LandingPageContent, template: Template) => Promise<void>;
  submitLabel: string;
}

export function LandingPageBuilder({
  initialContent = {
    title: '',
    description: '',
    productName: '',
    targetAudience: '',
    keyFeatures: '',
    callToAction: '',
  },
  initialTemplate = 'modern',
  onBack,
  onSubmit,
  submitLabel,
}: LandingPageBuilderProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics');
  const [selectedTemplate, setSelectedTemplate] =
    useState<Template>(initialTemplate);
  const [formData, setFormData] = useState<LandingPageContent>(initialContent);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRandomize = () => {
    const template = getRandomTemplate();
    setFormData(template);
  };

  const handleSubmit = async () => {
    await onSubmit(formData, selectedTemplate);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Landing Pages
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <div className="space-y-6">
          <div className="flex justify-between items-center space-x-4">
            <Tabs
              value={currentStep}
              onValueChange={(value) => setCurrentStep(value as WizardStep)}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              onClick={handleRandomize}
              className="shrink-0"
            >
              Randomize Content
            </Button>
          </div>

          {currentStep === 'basics' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter landing page title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter landing page description"
                />
              </div>
            </div>
          )}

          {currentStep === 'content' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Describe your target audience"
                />
              </div>

              <div>
                <Label htmlFor="keyFeatures">Key Features</Label>
                <Textarea
                  id="keyFeatures"
                  name="keyFeatures"
                  value={formData.keyFeatures}
                  onChange={handleInputChange}
                  placeholder="List key features (one per line)"
                />
              </div>

              <div>
                <Label htmlFor="callToAction">Call to Action</Label>
                <Input
                  id="callToAction"
                  name="callToAction"
                  value={formData.callToAction}
                  onChange={handleInputChange}
                  placeholder="Enter call to action text"
                />
              </div>
            </div>
          )}

          {currentStep === 'design' && (
            <RadioGroup
              defaultValue={selectedTemplate}
              onValueChange={(value) => setSelectedTemplate(value as Template)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="col-span-2">
                <h2 className="text-lg font-medium mb-4">Choose a Template</h2>
              </div>
              <div>
                <RadioGroupItem
                  value="modern"
                  id="modern"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="modern"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="font-medium">Modern Template</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clean and minimalist design with a focus on visuals
                  </p>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="classic"
                  id="classic"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="classic"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="font-medium">Classic Template</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Traditional layout with a professional appearance
                  </p>
                </Label>
              </div>
            </RadioGroup>
          )}

          <div className="flex justify-between pt-4 border-t mt-4">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{submitLabel}</Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <LandingPagePreview content={formData} template={selectedTemplate} />
        </div>
      </div>
    </div>
  );
}
