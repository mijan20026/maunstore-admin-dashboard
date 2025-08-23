export const getImageUrl = (path?: string): string => {
  if (!path) {
    return "https://i.ibb.co/fYZx5zCP/Region-Gallery-Viewer.png"; // default image
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    const baseUrl = "http://10.10.7.111:5003";
    return `${baseUrl}/${path}`;
  }
};
