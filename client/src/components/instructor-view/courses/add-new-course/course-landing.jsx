import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { useContext, useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const validateField = (name, value) => {
    const field = courseLandingPageFormControls.find(f => f.name === name);
    if (!field) return "";

    if (field.required !== false && (!value || value.trim() === "")) {
      return `${field.label} is required`;
    }

    if (name === "pricing") {
      const price = parseFloat(value);
      if (isNaN(price) || price < 0) {
        return "Please enter a valid price";
      }
    }

    return "";
  };

  useEffect(() => {
    const newErrors = {};
    Object.keys(touchedFields).forEach(field => {
      const error = validateField(field, courseLandingFormData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
  }, [courseLandingFormData, touchedFields]);

  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            2
          </div>
          Course Landing Page
        </CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Provide essential information about your course to attract students
        </CardDescription>

        {Object.keys(errors).length > 0 && (
          <Alert className="bg-red-50 border-red-200 mt-4">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} before proceeding
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <div onBlur={(e) => handleBlur(e.target.name)}>
          <FormControls
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
            errors={errors}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseLanding;
