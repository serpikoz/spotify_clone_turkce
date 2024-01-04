"use client";

import Modal from "./Modal";

const AuthModal = () => {
  return (
    <Modal
      title="Tekrar Hoşgeldiniz"
      description="Hesabınıza giriş yapın "
      isOpen // isOpen değeri true olarak belirtilmiş, siz isteğinize göre düzenleyebilirsiniz
      onChange={() => {
        /* onChange fonksiyonu gerekliliğinize göre işlevsellik eklenmeli */
      }}
    >
      Auth modal children
    </Modal>
  );
};

export default AuthModal;
