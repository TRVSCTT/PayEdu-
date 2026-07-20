/**
 * StepProgressBar.jsx
 * Rôle : Affiche les cercles et lignes de progression selon la maquette Figma.
 */
import React from 'react';

export function StepProgressBar({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto mb-8 px-4">
      {steps.map((step, index) => {
        const isActive = index <= currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium border-2 z-10 bg-white
                  ${isActive 
                    ? 'border-text-main bg-text-main text-white' // Cercle noir avec texte blanc pour l'actif
                    : 'border-gray-400 text-gray-500' // Cercle blanc contour gris pour inactif
                  }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-[10px] text-center w-16 leading-tight text-gray-600">
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={`flex-1 h-[1px] -mt-6 mx-1 ${
                  index < currentStep ? 'bg-text-main' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
