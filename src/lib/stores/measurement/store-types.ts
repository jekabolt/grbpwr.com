export interface MeasurementStore {
    hoveredMeasurement: string | null;
    setHoveredMeasurement: (measurement: string | null) => void;
    handleMeasurementHover: (measurementName: string) => void;
    handleMeasurementLeave: () => void;
}