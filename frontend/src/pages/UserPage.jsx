import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import { Flex, Spinner } from "@chakra-ui/react"
import Post from "../components/Post"

function UserPage() {
  const param = useParams()
  const showToast = useShowToast()
  const [user, setUser] = useState(null)
  const { username } = useParams()
  const [post, setPost] = useState([])
  const [fetchingPost, setFetchingPost] = useState(true)
  const apiURL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${apiURL}/api/v1/users/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } 
    };
    const getPost = async () => {
      setFetchingPost(true)
      try {
        const res = await fetch(`${apiURL}/api/v1/post/feeds/${param.username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPost(data)

      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setFetchingPost(false)
      }
    }
    getPost()
    getUser();
  }, [username]);

  if (!user && fetchingPost) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    )
  }



  if (!user) {
    return (
      <Flex justifyContent={"center"}>
        <h1 style={{ fontSize: "5rem" }}>🫤 is there a user</h1>
      </Flex>
    )
  }

  return (
    <div>
      <UserHeader user={user} />
      {!fetchingPost && post.length === 0 && <h1>No! posts</h1>}
      {fetchingPost && (
        <Flex justifyContent={"center"} position={"relative"} top={"4rem"}>
          <Spinner size="xl" />
        </Flex>
      )}
      
      {post.length !== 0 && (
        post?.map((post) => (
          <Post key={post?._id} post={post} postedBy={post?.owner} />
        ))
      )}

    </div>
  )
}

export default UserPage
