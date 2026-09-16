import React from 'react';
import { UploadWizard } from '../components/upload/UploadWizard.js';

interface UploadPageProps {
  onSuccess: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onSuccess }) => {
  return <UploadWizard onSuccess={onSuccess} />;
};
