import Button from "@/components/ui/Button";
import { ButtonStyle } from "@/components/ui/Button/styles";
import Modal from "@/components/ui/Modal";
import MeasurementsModalContent from "./MeasurementsModalContent";

export default function Component() {
  return (
    <Modal
      openElement={
        <Button asChild style={ButtonStyle.underlinedButton}>
          measurements
        </Button>
      }
    >
      <MeasurementsModalContent />
    </Modal>
  );
}
