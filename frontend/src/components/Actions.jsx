import { Box, Flex, FormControl,  Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { useSelector } from "react-redux";
import useCommentApi from "../api/commentAPI";
import useLikeApi from "../api/likeAPI";


function Actions({ post , postComments, setPostComments}) {

	const { setPostlike , getPostLike } = useLikeApi()
	const { createComment } = useCommentApi()

	const mode = useSelector((state) => state.mode.mode)
	const user = useRecoilValue(userAtom)

	const showToast = useShowToast()
	const [like, setLike] = useState([])
	const [likeBtn, setLikeBtn] = useState(like.some((like) => like.userId === user?._id));
	const [isLiking, setLiking] = useState(false)
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [reply, setReply] = useState()
	const [isReplying, setIsReplying] = useState(false);
	const userId = user?._id
	const postId = post?._id
	
	const handleLikeAndUnlike = async () => {
		if (!user) return showToast("Error", "Plase Login First", "error")
		if (isLiking) return
		
		setLikeBtn((prev) => !prev)
		try {
			await setPostlike(userId, postId, setLiking, setLike)
		    getPostLike(postId, setLike)
			
		} catch (error) {
			setLikeBtn((prev) => !prev)
		}
		
	}

	useEffect(() => {
		getPostLike(postId, setLike)

	},[post])

	useEffect(() => {
		setLikeBtn(like?.some((like) => like.userId === user?._id))
	}, [like])



	const handleReply = async () => {
		if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
		if (isReplying) return;

		const userId = user?._id 
		const postId = post?._id
		const content = reply 

		await createComment(userId, postId, content, setIsReplying, setPostComments)	

		showToast("Success", "Reply posted successfully", "success");
		onClose();
		setReply("");
	}


	if (!post) return null
	return (

		<Flex flexDirection='column'>
			<Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
				<svg
					aria-label='Like'
					color={likeBtn ? "rgb(237, 73, 86)" : ""}
					fill={likeBtn ? "rgb(237, 73, 86)" : "transparent"}
					height='19'
					role='img'
					viewBox='0 0 24 22'
					width='20'
					onClick={handleLikeAndUnlike}
				>
					<path
						d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
						stroke='currentColor'
						strokeWidth='2'
					></path>
				</svg>

				<svg
					aria-label='Comment'
					color=''
					fill=''
					height='20'
					role='img'
					viewBox='0 0 24 24'
					width='20'
					onClick={onOpen}
				>
					<title>Comment</title>
					<path
						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
						fill='none'
						stroke='currentColor'
						strokeLinejoin='round'
						strokeWidth='2'
					></path>
				</svg>

				{/* <RepostSVG />
				<ShareSVG /> */}
			</Flex>

			<Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize='sm'>
					{postComments?.length} replies
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"black"}></Box>
				<Text color={"gray.light"} fontSize='sm'>
					{like?.length} likes
				</Text>
			</Flex>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg={"transparent"} border={"1px solid #212120"}>
					<ModalBody pb={6} className={`rounded-t-lg ${mode ? "bg-[#0a0a0a]" : "bg-white"}`}>
						<FormControl>
							<input
								placeholder='Reply here...'
								value={reply}
								className={` border-none outline-none w-[23rem] h-[2.5rem] ${mode ? "bg-[#0a0a0a]" : "bg-white"}`}
								onChange={(e) => setReply(e.target.value)}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter className={`rounded-b-lg ${mode ? "bg-[#0a0a0a]" : "bg-white"}`}>
						<button className={"bg-gradient-to-r from-slate-500 to-slate-800 relative py-2 px-8 text-white text-base font-bold nded-full overflow-hidden bg-zinc-700 rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-zinc-900 before:to-gray-900 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0"} onClick={handleReply} >
							Comment
						</button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	);
};




export default Actions

// const RepostSVG = () => {
// 	return (
// 		<svg
// 			aria-label='Repost'
// 			color='currentColor'
// 			fill='currentColor'
// 			height='20'
// 			role='img'
// 			viewBox='0 0 24 24'
// 			width='20'
// 		>
// 			<title>Repost</title>
// 			<path
// 				fill=''
// 				d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
// 			></path>
// 		</svg>
// 	);
// };

// const ShareSVG = () => {
// 	return (
// 		<svg
// 			aria-label='Share'
// 			color=''
// 			fill='rgb(243, 245, 247)'
// 			height='20'
// 			role='img'
// 			viewBox='0 0 24 24'
// 			width='20'
// 		>
// 			<title>Share</title>
// 			<line
// 				fill='none'
// 				stroke='currentColor'
// 				strokeLinejoin='round'
// 				strokeWidth='2'
// 				x1='22'
// 				x2='9.218'
// 				y1='3'
// 				y2='10.083'
// 			></line>
// 			<polygon
// 				fill='none'
// 				points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
// 				stroke='currentColor'
// 				strokeLinejoin='round'
// 				strokeWidth='2'
// 			></polygon>
// 		</svg>
// 	);
// };