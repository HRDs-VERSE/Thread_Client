import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom"
import { Flex, Spinner } from "@chakra-ui/react"
import Post from "../components/Post"
import useUserApi from "../api/userAPI"
import usePostAPI from "../api/postAPI"

function UserPage() {
  const { getUser } = useUserApi()
  const { getUserPost } = usePostAPI()
  const [user, setUser] = useState(null)
  const { username } = useParams()
  const [post, setPost] = useState([])
  const [fetchingPost, setFetchingPost] = useState(true)

  useEffect(() => {
    (async () => {
      await getUser(username, setUser)

      setFetchingPost(true)

      await getUserPost(username, setPost)

      setFetchingPost(false)

    })()    

  }, [username]);

  if (!user && fetchingPost) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    )
  }



  if (!user && !fetchingPost) {
    return (
      <Flex justifyContent={"center"}>
        <h1 style={{ fontSize: "5rem" }}>No user found!</h1>
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
