import useShowToast from "../hooks/useShowToast";
import { useDispatch } from "react-redux"
import { setPost } from "../store/postSlice"

const usePostAPI = () => {
  const dispatch = useDispatch()
  const showToast = useShowToast();
  const apiURL = import.meta.env.VITE_API_URL;

  const createPost = async (postText, userId, imgUrl) => {
    try {

      const res = await fetch(`${apiURL}/api/v1/post`, {
        method: "POST",
        headers: {

          "Content-Type": "application/json"
        },
        body: JSON.stringify({ postFileLocalPath: imgUrl ? imgUrl : null, content: postText, userId: userId })
      })
      const data = await res.json()
      if (data.error) {
        showToast('Error', data.error, "error")
      }

      dispatch(setPost(data))

    } catch (error) {
      showToast('Error', "Something went wrong while posting", "error")  

    }
  }

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


  const getFeedPost = async (userId, setLoading) => {
    setLoading(true)
    try {

      const res = await fetch(`${apiURL}/api/v1/post/feeds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId
        }),
      });
      const data = await res.json()
      if (data.error) {
        showToast("Error", data.error, "error")
      }
      dispatch(setPost(data))

    } catch (error) {
      showToast("Error", error.message, "error")
    }
    finally {
      setLoading(false)
    }
  }

  const getPost = async (postId, setFetchingPost, setPost) => {

    setFetchingPost(true)
    try {
      const res = await fetch(`${apiURL}/api/v1/post/${postId}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setPost(data)

    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setFetchingPost(false);
    }
  };

  const getUserPost = async (username, setPost) => {
    try {
      const res = await fetch(`${apiURL}/api/v1/post/feeds/${username}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setPost(data)

    } catch (error) {
      showToast("Error", error.message, "error");
    }

  }




  return { deletePost, getFeedPost, getPost, createPost, getUserPost };
};

export default usePostAPI;
