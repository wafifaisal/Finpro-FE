import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploadSectionProps {
  imagePreviewUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imagePreviewUrls,
  handleImageChange,
  removeImage,
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-gray-900">
        Foto Properti
      </label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          accept="image/jpg, image/jpeg, image/png, image/gif"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-2">
          <div className="text-gray-600">
            <span className="font-semibold text-rose-600">Unggah foto</span>{" "}
            atau seret dan lepas
          </div>
          <p className="text-sm text-gray-500">Maksimal 10 foto</p>
        </div>
      </div>

      {imagePreviewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {imagePreviewUrls.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <Image
                fill
                src={url}
                alt={`Pratinjau ${index + 1}`}
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
