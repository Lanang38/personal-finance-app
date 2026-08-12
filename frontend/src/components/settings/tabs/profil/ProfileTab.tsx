import { ProfileCard } from './ProfileCard';
import { PersonalInfoCard } from './PersonalInfoCard';
import { SecuritySection } from './SecuritySection';
import type { JSX } from 'react';

export function ProfileTab(): JSX.Element {
  return (
    <>
      <ProfileCard />
      <PersonalInfoCard />
      <SecuritySection />
    </>
  );
}
