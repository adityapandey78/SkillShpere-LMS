import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";
import { X, Upload } from "lucide-react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
        setMediaUploadProgress(false);
      }
    }
  }

  function handleRemoveImage() {
    setCourseLandingFormData({
      ...courseLandingFormData,
      image: "",
    });
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            3
          </div>
          Course Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {mediaUploadProgress ? (
          <MediaProgressbar isMediaUploading={mediaUploadProgress} />
        ) : courseLandingFormData?.image ? (
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">Course Thumbnail</Label>
            <div className="relative group">
              <img
                src={courseLandingFormData.image}
                alt="Course thumbnail"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 shadow-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                <Button
                  onClick={handleRemoveImage}
                  variant="destructive"
                  size="lg"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-5 w-5 mr-2" />
                  Remove Thumbnail
                </Button>
              </div>
            </div>
            <Button
              onClick={() => document.getElementById('course-image-upload').click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Thumbnail
            </Button>
            <Input
              id="course-image-upload"
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">Upload Course Thumbnail</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors duration-200">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mb-4">PNG, JPG, GIF up to 10MB</p>
              <Button
                onClick={() => document.getElementById('course-image-upload').click()}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
            <Input
              id="course-image-upload"
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
