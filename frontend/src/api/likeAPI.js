import useShowToast from "../hooks/useShowToast"

const useLikeApi = () => {
    const apiURL = import.meta.env.VITE_API_URL;
    const showToast = useShowToast()

    const setPostlike = async (userId, postId, setLiking, setLike) => {
        
        setLiking(true)
        try {
            
            const res = await fetch(`${apiURL}/api/v1/like/like-Unlike-Post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userId, postId})
            })

            const data = await res.json()

            if (data.error) {
                showToast("Error", data.error || "Something went wrong", "error")
            }

        } catch (error) {
            showToast("Error", error.message || "Something went wrong while liking post", "error")

        } finally{
            setLiking(false)
        }
    }

    const getPostLike = async (postId, setLike) => {

        try {

            const res = await fetch(`${apiURL}/api/v1/like/post-likes/${postId}`)
            
            const data = await res.json()

            if (data.error) {
                showToast("Error", data.error || "Something went wrong while getting post likes", "error")
            }

            setLike(data)
            
        } catch (error) {
            showToast("Error", error.message || "Something went wrong while getting likes of post", "error")
        }
    }

    return {
        setPostlike,
        getPostLike
    }
}

export default useLikeApi