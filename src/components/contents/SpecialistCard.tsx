import {ReactNode} from "react";

interface SpecialistCardProps {
    name: string,
    department: string,
    children: ReactNode
}

export const SpecialistCard = ({name, department, children}: SpecialistCardProps) => {
    return (
        <div className="specialist-card">
            <div className="specialist-card-person-info-container">
                <span className="specialist-card-name">{name}</span>
                <span className="specialist-card-department">{department}</span>
            </div>
            {children}
        </div>
    )
}
