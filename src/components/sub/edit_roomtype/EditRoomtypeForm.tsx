import { FC } from "react";
import { Formik, Form, FieldArray, FormikHelpers } from "formik";
import RoomCard from "../create_roomtype/roomCard";
import validationSchema from "@/types/ValidationSchema";
import SeasonalPriceSection from "./SeasonalPriceSection";
import UnavailableSection from "./UnavailableSection";
import { EditRoomTypeFormValues } from "@/types/EditRoomTypes";

interface Facility {
  id: string;
  name: string;
}

interface EditRoomTypeFormProps {
  initialValues: EditRoomTypeFormValues;
  isLoading: boolean;
  handleSubmit: (
    values: EditRoomTypeFormValues,
    formikHelpers: FormikHelpers<EditRoomTypeFormValues>
  ) => Promise<void>;
  availableFacilities: Facility[];
}

const EditRoomTypeForm: FC<EditRoomTypeFormProps> = ({
  initialValues,
  isLoading,
  handleSubmit,
  availableFacilities,
}) => {
  return (
    <div className="max-w-6xl mx-auto p-8 bg-white md:pt-28 pt-0">
      <h1 className="text-4xl font-bold mb-12">Edit Tipe Kamar</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting, status }) => (
          <Form className="space-y-12">
            {status && status.responseMessage && (
              <div
                className={`mb-8 p-4 rounded-2xl ${
                  (status.responseMessage as string).includes("berhasil")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.responseMessage}
              </div>
            )}
            <FieldArray name="rooms">
              {({ remove }) => (
                <>
                  {values.rooms.map((room, roomIndex: number) => (
                    <div
                      key={roomIndex}
                      className="border p-4 rounded-2xl mb-8"
                    >
                      <RoomCard
                        room={room}
                        roomIndex={roomIndex}
                        availableFacilities={availableFacilities}
                        setFieldValue={setFieldValue}
                        remove={remove}
                      />
                      <SeasonalPriceSection
                        roomIndex={roomIndex}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                      <UnavailableSection
                        roomIndex={roomIndex}
                        values={values}
                        setFieldValue={setFieldValue}
                      />
                    </div>
                  ))}
                </>
              )}
            </FieldArray>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition-colors"
            >
              {isLoading ? "Loading..." : "Perbarui Tipe Kamar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditRoomTypeForm;
