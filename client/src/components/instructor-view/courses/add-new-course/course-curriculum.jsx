import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Upload,
  Video,
  Youtube,
} from "lucide-react";
import { useContext, useRef, useState } from "react";

const YT_PATTERN =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;

function isValidYoutubeUrl(url) {
  return YT_PATTERN.test(url);
}

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  // Tracks which YouTube URL fields the user has interacted with
  const [urlTouched, setUrlTouched] = useState({});

  // Single confirmation dialog for switch-type and delete actions
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null, // "switch-to-youtube" | "switch-to-upload" | "delete-lecture"
    lectureIndex: null,
    pendingAction: null,
  });

  function closeConfirm() {
    setConfirmDialog({
      open: false,
      type: null,
      lectureIndex: null,
      pendingAction: null,
    });
  }

  function handleConfirmAction() {
    confirmDialog.pendingAction?.();
    closeConfirm();
  }

  // ─── Lecture list management ───────────────────────────────────────────────

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    const copy = [...courseCurriculumFormData];
    copy[currentIndex] = { ...copy[currentIndex], title: event.target.value };
    setCourseCurriculumFormData(copy);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    const copy = [...courseCurriculumFormData];
    copy[currentIndex] = { ...copy[currentIndex], freePreview: currentValue };
    setCourseCurriculumFormData(copy);
  }

  // ─── Video type toggle ─────────────────────────────────────────────────────

  function applyVideoTypeChange(type, idx) {
    const copy = [...courseCurriculumFormData];
    copy[idx] = {
      ...copy[idx],
      videoType: type,
      videoUrl: "",
      public_id: "",
      duration: 0,
    };
    setCourseCurriculumFormData(copy);
    setUrlTouched((prev) => ({ ...prev, [idx]: false }));
  }

  function handleVideoTypeChange(type, idx) {
    const item = courseCurriculumFormData[idx];
    const hasExistingVideo = item?.videoUrl?.trim() !== "";

    if (hasExistingVideo) {
      setConfirmDialog({
        open: true,
        type: type === "youtube" ? "switch-to-youtube" : "switch-to-upload",
        lectureIndex: idx,
        pendingAction: () => applyVideoTypeChange(type, idx),
      });
    } else {
      applyVideoTypeChange(type, idx);
    }
  }

  // ─── YouTube URL input ─────────────────────────────────────────────────────

  function handleYoutubeUrlChange(event, idx) {
    const copy = [...courseCurriculumFormData];
    copy[idx] = {
      ...copy[idx],
      videoUrl: event.target.value,
      public_id: "",
      duration: 0,
    };
    setCourseCurriculumFormData(copy);
    setUrlTouched((prev) => ({ ...prev, [idx]: true }));
  }

  // ─── Upload / replace / delete ─────────────────────────────────────────────

  async function handleSingleLectureUpload(event, idx) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const videoFormData = new FormData();
    videoFormData.append("file", selectedFile);

    try {
      setMediaUploadProgress(true);
      const response = await mediaUploadService(
        videoFormData,
        setMediaUploadProgressPercentage
      );
      if (response.success) {
        const copy = [...courseCurriculumFormData];
        copy[idx] = {
          ...copy[idx],
          videoUrl: response?.data?.url,
          public_id: response?.data?.public_id,
          duration: response?.data?.duration || 0,
        };
        setCourseCurriculumFormData(copy);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
      setMediaUploadProgress(false);
    }
  }

  async function handleReplaceVideo(idx) {
    const copy = [...courseCurriculumFormData];
    const item = copy[idx];

    if (item.videoType !== "youtube" && item.public_id) {
      const response = await mediaDeleteService(item.public_id);
      if (!response?.success) return;
    }

    copy[idx] = { ...copy[idx], videoUrl: "", public_id: "", duration: 0 };
    setCourseCurriculumFormData(copy);
  }

  async function applyDeleteLecture(idx) {
    let copy = [...courseCurriculumFormData];
    const item = copy[idx];

    if (item.videoType !== "youtube" && item.public_id) {
      const response = await mediaDeleteService(item.public_id);
      if (!response?.success) return;
    }

    copy = copy.filter((_, i) => i !== idx);
    setCourseCurriculumFormData(copy);
    setUrlTouched((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  }

  function handleDeleteLecture(idx) {
    setConfirmDialog({
      open: true,
      type: "delete-lecture",
      lectureIndex: idx,
      pendingAction: () => applyDeleteLecture(idx),
    });
  }

  // ─── Bulk upload ───────────────────────────────────────────────────────────

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllEmpty(arr) {
    return arr.every((obj) =>
      Object.entries(obj).every(([key, value]) => {
        if (key === "videoType") return true;
        if (typeof value === "boolean" || typeof value === "number") return true;
        return value === "";
      })
    );
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();
    selectedFiles.forEach((f) => bulkFormData.append("files", f));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      if (response?.success) {
        const base = areAllEmpty(courseCurriculumFormData)
          ? []
          : [...courseCurriculumFormData];

        const merged = [
          ...base,
          ...response.data.map((item, i) => ({
            videoType: "upload",
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${base.length + (i + 1)}`,
            freePreview: false,
            duration: item?.duration || 0,
          })),
        ];
        setCourseCurriculumFormData(merged);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
      setMediaUploadProgress(false);
    }
  }

  // ─── Validation ────────────────────────────────────────────────────────────

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      if (!item || typeof item !== "object") return false;
      if (!item.title?.trim() || !item.videoUrl?.trim()) return false;
      if (item.videoType === "youtube") return isValidYoutubeUrl(item.videoUrl);
      return true;
    });
  }

  // ─── Confirmation dialog config ────────────────────────────────────────────

  const currentLecture =
    confirmDialog.lectureIndex !== null
      ? courseCurriculumFormData[confirmDialog.lectureIndex]
      : null;

  const CONFIRM_CONFIG = {
    "switch-to-youtube": {
      title: "Switch to YouTube URL?",
      description: `Switching will remove the uploaded video for "${currentLecture?.title || "this lecture"}" and delete it from storage. You will need to provide a YouTube link instead.`,
      confirmLabel: "Switch to YouTube",
    },
    "switch-to-upload": {
      title: "Switch to File Upload?",
      description: `This will clear the YouTube URL set for "${currentLecture?.title || "this lecture"}". You will need to upload a new video file.`,
      confirmLabel: "Switch to Upload",
    },
    "delete-lecture": {
      title: "Delete this lecture?",
      description: `"${currentLecture?.title || "This lecture"}" and its video will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete Lecture",
    },
  };

  const dialogConfig = confirmDialog.type
    ? CONFIRM_CONFIG[confirmDialog.type]
    : null;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Confirmation Modal ─────────────────────────────────────────── */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && closeConfirm()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-start gap-4 mb-1">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-gray-900 leading-tight">
                  {dialogConfig?.title}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {dialogConfig?.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={closeConfirm}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmAction}>
              {dialogConfig?.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Main Card ──────────────────────────────────────────────────── */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-teal-50 border-b">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                1
              </div>
              Create Course Curriculum
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1 ml-13">
              Add lectures and organize your course content
            </p>
          </div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            variant="outline"
            className="cursor-pointer flex-shrink-0"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <Button
            disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
            onClick={handleNewLecture}
          >
            + Add Lecture
          </Button>

          {mediaUploadProgress && (
            <div className="mt-4">
              <MediaProgressbar isMediaUploading={mediaUploadProgress} />
            </div>
          )}

          {/* ── Lecture list ─────────────────────────────────────────── */}
          <div className="mt-5 space-y-4">
            {courseCurriculumFormData.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Video className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  No lectures yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Click &quot;+ Add Lecture&quot; to get started
                </p>
              </div>
            )}

            {courseCurriculumFormData.map((curriculumItem, index) => {
              const videoType = curriculumItem?.videoType || "upload";
              const videoUrl = curriculumItem?.videoUrl || "";
              const isTouched = !!urlTouched[index];
              const urlValid = isValidYoutubeUrl(videoUrl);
              const showError =
                videoType === "youtube" &&
                isTouched &&
                videoUrl !== "" &&
                !urlValid;
              const showSuccess =
                videoType === "youtube" && videoUrl !== "" && urlValid;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Lecture header strip */}
                  <div className="flex items-start gap-4 px-5 pt-5 pb-4 border-b border-gray-100">
                    <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex flex-wrap gap-4 items-center">
                      <Input
                        name={`title-${index + 1}`}
                        placeholder="Enter lecture title"
                        className="max-w-sm"
                        onChange={(e) => handleCourseTitleChange(e, index)}
                        value={curriculumItem?.title || ""}
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          onCheckedChange={(v) =>
                            handleFreePreviewChange(v, index)
                          }
                          checked={curriculumItem?.freePreview || false}
                          id={`freePreview-${index + 1}`}
                        />
                        <Label
                          htmlFor={`freePreview-${index + 1}`}
                          className="text-sm text-gray-600 cursor-pointer select-none"
                        >
                          Free Preview
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Video source section */}
                  <div className="px-5 pt-4 pb-5">
                    {/* Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 w-fit mb-5">
                      <button
                        type="button"
                        onClick={() => handleVideoTypeChange("upload", index)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 select-none",
                          videoType === "upload"
                            ? "bg-white text-indigo-700 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <Video className="w-4 h-4" />
                        Upload Video
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVideoTypeChange("youtube", index)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 select-none",
                          videoType === "youtube"
                            ? "bg-white text-red-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <Youtube className="w-4 h-4" />
                        YouTube URL
                      </button>
                    </div>

                    {/* ── YouTube mode ─────────────────────────────── */}
                    {videoType === "youtube" ? (
                      <div className="space-y-3 max-w-2xl">
                        {/* URL input with validation states */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Youtube
                              className={cn(
                                "h-4 w-4",
                                showError
                                  ? "text-red-400"
                                  : showSuccess
                                  ? "text-green-500"
                                  : "text-red-500"
                              )}
                            />
                          </div>
                          <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={videoUrl}
                            onChange={(e) =>
                              handleYoutubeUrlChange(e, index)
                            }
                            onBlur={() =>
                              setUrlTouched((prev) => ({
                                ...prev,
                                [index]: true,
                              }))
                            }
                            className={cn(
                              "pl-10 pr-10 transition-colors",
                              showError &&
                                "border-red-400 focus-visible:ring-red-300 bg-red-50/50",
                              showSuccess &&
                                "border-green-400 focus-visible:ring-green-300 bg-green-50/50"
                            )}
                          />
                          {showSuccess && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                          {showError && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <AlertCircle className="h-4 w-4 text-red-400" />
                            </div>
                          )}
                        </div>

                        {/* Inline error message */}
                        {showError && (
                          <p className="flex items-center gap-1.5 text-sm text-red-600">
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                            Enter a valid YouTube URL — e.g.{" "}
                            <span className="font-mono text-xs">
                              youtube.com/watch?v=…
                            </span>{" "}
                            or{" "}
                            <span className="font-mono text-xs">
                              youtu.be/…
                            </span>
                          </p>
                        )}

                        {/* Success hint */}
                        {showSuccess && (
                          <p className="flex items-center gap-1.5 text-sm text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                            Valid YouTube URL — preview below
                          </p>
                        )}

                        {/* Live preview */}
                        {showSuccess && (
                          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            <VideoPlayer
                              url={videoUrl}
                              width="100%"
                              height="230px"
                            />
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          {videoUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleReplaceVideo(index)}
                              className="text-gray-600 border-gray-300 hover:bg-gray-50"
                            >
                              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                              Clear URL
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLecture(index)}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Delete Lecture
                          </Button>
                        </div>
                      </div>
                    ) : videoUrl ? (
                      /* ── Uploaded video preview ──────────────────── */
                      <div className="space-y-3 max-w-2xl">
                        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                          <VideoPlayer
                            url={videoUrl}
                            width="100%"
                            height="230px"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleReplaceVideo(index)}
                            className="text-gray-700 border-gray-300 hover:bg-gray-50"
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                            Replace Video
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLecture(index)}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Delete Lecture
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* ── File upload drop zone ────────────────────── */
                      <div className="space-y-3 max-w-2xl">
                        <label
                          htmlFor={`upload-${index}`}
                          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50 hover:bg-gray-100 hover:border-indigo-300 transition-colors cursor-pointer group"
                        >
                          <div className="h-11 w-11 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <Upload className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                              Click to upload a video
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              MP4, MOV, AVI — max 500 MB
                            </p>
                          </div>
                          <Input
                            id={`upload-${index}`}
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              handleSingleLectureUpload(e, index)
                            }
                            className="hidden"
                          />
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLecture(index)}
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                          Delete Lecture
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default CourseCurriculum;
