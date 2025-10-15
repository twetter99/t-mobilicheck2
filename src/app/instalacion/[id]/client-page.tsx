'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { installationSteps } from '@/lib/installation-steps';
import { Check, CheckCircle, ChevronLeft, ChevronRight, HardHat, Loader2, PlayCircle, X } from 'lucide-react';

export function InstallationClientPage({ revision }: { revision: any }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 is the welcome screen
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = installationSteps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(step => step - 1);
    }
  };

  const startInstallation = () => {
    setCurrentStep(1);
  };
  
  const currentStepData = installationSteps[currentStep - 1];

  if (currentStep === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto text-center">
        <CardHeader>
          <HardHat className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-2xl font-bold">Procés de Nova Instal·lació</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Estàs a punt de començar una nova instal·lació. El procés consta de {totalSteps} passos obligatoris.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="font-semibold">Temps estimat: 4-6 hores</p>
          <Button size="lg" onClick={startInstallation}>
            <PlayCircle className="mr-2 h-5 w-5" />
            COMENÇAR INSTAL·LACIÓ
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-primary">PAS {currentStep} de {totalSteps}</p>
            <p className="text-sm text-muted-foreground">Temps transcorregut: 00:00:00</p>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="w-full h-2" />
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">{currentStepData.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-base md:text-lg text-muted-foreground">{currentStepData.description}</p>
                {/* Future content for each step will go here */}
            </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <Button type="button" onClick={handlePrev} variant="outline" disabled={currentStep <= 1 || isSubmitting}>
            <ChevronLeft className="mr-2"/>
            Pas Anterior
          </Button>
          {currentStep < totalSteps ? (
            <Button type="button" onClick={handleNext} disabled={isSubmitting}>
              Completar Pas
              <ChevronRight className="ml-2"/>
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Finalitzar Instal·lació
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

    