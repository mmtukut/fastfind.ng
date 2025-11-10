import { BuildingClassification } from "@/types";

// Simplified classification as we don't have road or shape data
export function classifyBuilding(area: number): BuildingClassification {
    if (area < 300) return 'residential';
    if (area >= 200 && area <= 1000) return 'commercial';
    if (area > 1000) return 'industrial';
    if (area > 500) return 'institutional';
    return 'mixed';
}

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
