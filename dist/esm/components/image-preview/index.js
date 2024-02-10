import "../image/image-preview.js";
import ImagePreview from "../image/image-preview2.js";
export { default } from "../image/image-preview2.js";
let imagePreviewInstance;
function getImagePreviewInstance() {
  imagePreviewInstance = imagePreviewInstance || ImagePreview.newInstance();
  return imagePreviewInstance;
}
ImagePreview.show = function(props = {}) {
  const instance = getImagePreviewInstance();
  props.onRemove = function() {
    imagePreviewInstance = null;
  };
  instance.show(props);
};
