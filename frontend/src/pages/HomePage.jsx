import { useEffect, useState } from "react"
import { Flex, Spinner } from "@chakra-ui/react"
import Post from "../components/Post"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { useSelector } from "react-redux"
import usePostAPI from "../api/postAPI"


function HomePage() {
  const user = useRecoilValue(userAtom)
  const [loading, setLoading] = useState(false)
  const post = useSelector((state) => state.post.postData)
  const { getFeedPost } = usePostAPI()
  const userId = user?._id

  useEffect(() => {
    
      getFeedPost(userId, setLoading)

  }, [])

  if (loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" color={"white"} />
      </Flex>
    );
  }

  if(!post) return null
  return (
    <>
      
      {post?.map((post) => (
        <Post key={post?._id} post={post}  postedBy={post?.owner} />
      ))}

    </>
  )
}

export default HomePage
