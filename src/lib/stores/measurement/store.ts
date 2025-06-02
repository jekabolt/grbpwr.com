import { create } from "zustand";
import { MeasurementStore } from "./store-types";


export const useMeasurementStore = create<MeasurementStore>((set) => ({
    hoveredMeasurement: null,
    setHoveredMeasurement: (measurement) =>
        set({ hoveredMeasurement: measurement }),
    handleMeasurementHover: (measurementName) =>
        set({ hoveredMeasurement: measurementName }),
    handleMeasurementLeave: () => set({ hoveredMeasurement: null }),
})); 