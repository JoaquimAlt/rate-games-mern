import { Modal, ModalOverlay, ModalContent, Spinner, Center } from "@chakra-ui/react";

export default function LoadingOverlay({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bg="transparent" shadow="none">
        <Center>
          <Spinner size="xl" color="red.500" thickness="4px" />
        </Center>
      </ModalContent>
    </Modal>
  );
}
