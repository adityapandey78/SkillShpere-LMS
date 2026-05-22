import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext, useRef } from "react";
import { X, Upload, ImageIcon, Image } from "lucide-react";

const DEFAULT_THUMBNAIL = "/images/default_thumbnail.jpg";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const fileInputRef = useRef(null);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];
    if (!selectedImage) return;

    const imageFormData = new FormData();
    imageFormData.append("file", selectedImage);

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(
        imageFormData,
        setMediaUploadProgressPercentage
      );
      if (response.success) {
        setCourseLandingFormData({ ...courseLandingFormData, image: response.data.url });
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
      setMediaUploadProgress(false);
    }
  }

  function handleRemoveImage() {
    setCourseLandingFormData({ ...courseLandingFormData, image: "" });
  }

  const displayImage = courseLandingFormData?.image || DEFAULT_THUMBNAIL;
  const isCustomImage = Boolean(courseLandingFormData?.image);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-purple-500 mb-0.5">Step 3</div>
            Thumbnail
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {mediaUploadProgress ? (
          <MediaProgressbar isMediaUploading={mediaUploadProgress} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-gray-900">Course Thumbnail</Label>
              {!isCustomImage && (
                <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  <ImageIcon className="h-3 w-3" />
                  Using default
                </span>
              )}
            </div>

            {/* Thumbnail preview — always visible (custom or default) */}
            <div className="relative group">
              <img
                src={displayImage}
                alt="Course thumbnail"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 shadow-md"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center gap-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  {isCustomImage ? "Replace" : "Upload"}
                </Button>
                {isCustomImage && (
                  <Button
                    onClick={handleRemoveImage}
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Upload button below the preview */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isCustomImage ? "Change Thumbnail" : "Upload Custom Thumbnail"}
            </Button>

            {!isCustomImage && (
              <p className="text-xs text-gray-400 text-center">
                No thumbnail uploaded — the default image above will be used when you save.
              </p>
            )}

            <Input
              ref={fileInputRef}
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
