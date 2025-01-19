import React from 'react';

const ImageModal = ({ image, closeModal }) => {
  return (
    <>
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={closeModal}
    ></div>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <img
        src={image.url}
        alt="Image"
        className="h-[350px] w-[auto] max-w-full max-h-full"
      />
    </div>
  </>
  );
};

export default ImageModal;