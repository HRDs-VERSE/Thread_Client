import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast"
import { Flex, Spinner } from "@chakra-ui/react"
import Post from "../components/Post"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"

function HomePage() {
  const user = useRecoilValue(userAtom)
  const showToast = useShowToast()
  const [post, setPost] = useState()
  const [loading, setLoading] = useState(false)
  console.log(user?.username)
  useEffect(() => {
    const getFeedPost = async () => {
      setLoading(true)
      try {
        const res = await fetch("https://mern-thread-hrd.vercel.app/api/v1/post/feeds")
      //   const res = await fetch("https://mern-thread-hrd.vercel.app/api/v1/post/feeds", {
      //   method: "POST", // or any other method as needed
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     userId: user?.username, // Assuming user._id is the property containing the user's ID
      //   }),
      //   credentials: 'include', // Include credentials (cookies, authorization headers, etc.)
      // });
        const data = await res.json()
        if (data.error) {
          showToast("Error", data.error, "error")
        }
        setPost(data)

      } catch (error) {
        showToast("Error", error.message, "error")
      } finally {
        setLoading(false)
      }
    }
    getFeedPost()
  }, [])

  {loading && (
    <Flex justifyContent={"center"}>
      <Spinner size="xl" />
    </Flex>
  )}
  if(!post) return null
  return (
    <>
      {!loading && post.length === 0 && <h1>Post something, or follow someone</h1>}
      
      {post?.map((post) => (
        <Post key={post?._id} post={post} postedBy={post?.owner} />
      ))}

    </>
  )
}

export default HomePage
