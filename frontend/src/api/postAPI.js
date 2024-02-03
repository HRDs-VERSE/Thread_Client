import useShowToast  from "../hooks/useShowToast";
import { useDispatch } from "react-redux"
import { setPost } from "../store/postSlice"

const usePostAPI = () => {
  const dispatch = useDispatch()
  const showToast = useShowToast();
  const apiURL = import.meta.env.VITE_API_URL;

  const deletePost = async (postId) => {
    try {
      const res = await fetch(`${apiURL}/api/v1/post/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
    
      if (data.error) {
        showToast("Error", "Something went wrong while deleting post", "error");
      }

      dispatch(setPost(data))
      showToast("Success", "Post deleted successfully", "success");
      
    } catch (error) {
      showToast("Error", error.message || "Something went wrong in deletePost");
    }
  };

  return { deletePost };
};

export default usePostAPI;
