import { Avatar, Flex, Image, Text, Box, Divider } from "@chakra-ui/react"
import Actions from "../components/Actions"
// import { BsThreeDots } from "react-icons/bs"
import { useEffect, useState } from "react"
import Comment from "../components/Comment"
import { useParams } from "react-router-dom"
import { Spinner } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import useUserApi from "../api/userAPI"
import useCommentApi from "../api/commentAPI"
import usePostAPI from "../api/postAPI"

function PostPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { getPost } = usePostAPI()
  const { getPostComment } = useCommentApi()
  const { getUser } = useUserApi()
  const [user, setUser] = useState()
  const [post, setPost] = useState()
  const [fetchingPost, setFetchingPost] = useState(true)
  const [loading, setLoading] = useState(true)
  const [postComments, setPostComments] = useState([])

  useEffect(() => {

    const username = params?.username
    const postId = params?.postId

    getUser(username, setUser)

    getPost(postId, setFetchingPost, setPost)



  }, [params?.postId, params?.username]);

  useEffect(() => {

    if (post) {
      const postId = params?.postId
      getPostComment(postId, setPostComments)

    }

  }, [post])


  if (!user && loading && fetchingPost) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    )
  }



  if (!user && !post && !fetchingPost) {
    return (
      <Flex justifyContent={"center"}>
        <h1 style={{ fontSize: "5rem" }}>No user found!</h1>
      </Flex>
    );
  }


  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3} >
          <Avatar src={user?.avatar} size={"md"} name={user?.username} onClick={(e) => {
            e.preventDefault()
            navigate(`/${user.username}`)
          }} />
          <Flex>
            <Text fontSize="sm" fontWeight="bold" cursor={"pointer"}
              onClick={(e) => {
                e.preventDefault()
                navigate(`/${user.username}`)
              }}>{user?.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          {/* <Text fontSize={"sm"} color={"#736c6c"}>Id</Text> */}
          {/* <BsThreeDots /> */}
        </Flex>
      </Flex>
      <Text my={3}>{post?.content}</Text>
      <Box borderRadius={6} overflow={"hidden"} border={"1px solid #736c6c"}>
        {post?.postFile?.url && (
          <Image src={post?.postFile?.url} w={"full"} cursor={"pointer"}
          />
        )}
      </Box>

      {post && (
        <Flex gap={3} my={3}>
          <Actions post={post} postComments={postComments} setPostComments={setPostComments} />
        </Flex>
      )}

      <Divider my={4} />


      <Divider />

      {postComments?.length !== 0 && (
        postComments?.map((postComment) => (
          <Comment
            commentId={postComment._id}
            key={postComment._id}
            comment={postComment.content}
            avatar={postComment.userAvatar}
            createdAt="2d"
            owner={postComment.userId}
            username={postComment.username}
            likes={post?.likes?.length ? post?.likes?.length : 0}
            setComments={setPostComments}
          />
        ))
      )}

    </>
  )
}

export default PostPage
