import useShowToast from "../hooks/useShowToast"


const useCommentApi = () => {
    const showToast = useShowToast()
    const apiURL = import.meta.env.VITE_API_URL;


    const createComment = async (userId, postId, content, setIsReplying, setPostComments) => {

        setIsReplying(true)
        try {

            const res = await fetch(`${apiURL}/api/v1/comment/create-comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, postId, content })
            })

            const data = await res.json()

            if (data.error) {
                showToast("Error", data.error || "Something went wrong", "error")
            }

            setPostComments(prev => [...prev, data]);



        } catch (error) {
            showToast("Error", error.message || "Something went wrong while creating comment in fetch")
        }finally{
            setIsReplying(false)
        }
    }


    const getPostComment = async (postId, setPostComments) => {

        try {
            const res = await fetch(`${apiURL}/api/v1/comment/post-comment/${postId}`)
            const data = await res.json()

            if (data.error) {
                showToast("Error", data.error || "Something went wrong", "error")
            }

            setPostComments(data)

            return data


        } catch (error) {
            showToast("Error", error.message || "Something went wrong in while getting post")    
        }
    }

    const deleteComment = async (commentId, setComments) => {
        try {
            const res = await fetch(`${apiURL}/api/v1/comment/delete-comment/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const data = await res.json()

            if (data.error) {
                showToast("Error", data.error || "Something went wrong while deleting comment", "error")
            }
            setComments(prev => prev.filter(comment => comment._id !== commentId));
            showToast("Success", "Comment deleted successfully", "success")
   


        } catch (error) {
            showToast("Error", error.message || "Something went worng while deleting post", "error")
        }
    }


    return {
        createComment,
        getPostComment,
        deleteComment
    }
}

export default useCommentApi