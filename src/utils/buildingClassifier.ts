import { BuildingClassification } from "@/types";

// This function is now used to calculate value based on the model's classification
export function estimateValue(classification: BuildingClassification, area: number): number {
    switch (classification) {
        case 'residential': return area * 500;
        case 'commercial': return area * 1200;
        case 'industrial': return area * 600;
        case 'institutional': return area * 800;
        case 'mixed': return area * 700;
        default: return area * 400;
    }
}
