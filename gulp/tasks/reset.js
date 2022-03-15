import del from "del";

export const reset = async () => {
  del(app.path.clean);
};
