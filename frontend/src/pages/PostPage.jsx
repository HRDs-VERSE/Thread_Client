import { Avatar, Flex, Image, Text, Box, Divider, Button } from "@chakra-ui/react"
import Actions from "../components/Actions"
// import { BsThreeDots } from "react-icons/bs"
import { useEffect, useState } from "react"
import Comment from "../components/Comment"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast"
import { Spinner } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

function PostPage() {
  const navigate = useNavigate()
  const params = useParams()
  
  const showToast = useShowToast()
  const [user, setUser] = useState()
  const [post, setPost] = useState()
  const [fetchingPost, setFetchingPost] = useState(true)
  const [loading, setLoading] = useState(true)
  const [postComments, setPostComments] = useState([])
  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${apiURL}/api/v1/users/${params?.username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data)
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    const getPost = async () => {
      setFetchingPost(true);
      try {
        const res = await fetch(`${apiURL}/api/v1/post/${params?.postId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setPost(data);
        setPostComments(data.comments)
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setFetchingPost(false);
      }
    };

    getPost();
    getUser();
  }, []);



  if (!user && loading && fetchingPost) {
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
    );
  }


  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3} >
          <Avatar src={user?.avatar} size={"md"} name={user?.username} onClick={(e) => {
              e.preventDefault()
              navigate(`/${user.username}`)
            }}  />
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
      <Actions />

      <Flex gap={3} my={3}>
        <Actions post={post} />

      </Flex>

      <Divider my={4} />


      <Divider />

      {postComments?.length !== 0 && (
        postComments?.map((postComment) => (
          <Comment
            commentId={postComment._id}
            postId={post._id}
            key={postComment._id}
            comment={postComment.content}
            avatar={postComment.userAvatar}
            createdAt="2d"
            username={postComment.username}
            likes={post?.likes?.length ? post?.likes?.length : 0}
            setComments={setPostComments} // Pass the setPostComments function
          />
        ))
      )}

    </>
  )
}

export default PostPage
