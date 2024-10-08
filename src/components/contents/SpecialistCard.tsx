import { ReactNode } from "react";

interface SpecialistCardProps {
  id: string;
  name: string;
  department: string;
  children: ReactNode;
}

export const SpecialistCard = ({
  id,
  name,
  department,
  children,
}: SpecialistCardProps) => {
  return (
    <div id={id} className="specialist-card">
      <div className="specialist-card-person-info-container">
        <span className="specialist-card-name">{name}</span>
        <span className="specialist-card-department">{department}</span>
      </div>
      {children}
    </div>
  );
};
